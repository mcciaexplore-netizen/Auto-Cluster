import { z } from 'zod'
import { findAll, transaction } from './store'
import type { EnquiryRecord } from './enquiries'
import { can, type StaffUser } from './roles'
import { amountSchema } from '@/lib/platform'

export const bookingQueueStates = ['all', 'requested', 'awaiting-payment', 'paid', 'declined'] as const
export type BookingQueueState = typeof bookingQueueStates[number]

export async function listBookings(actor: StaffUser, filters: { query?: string; state?: BookingQueueState } = {}) {
  if (!actor.active || (!can(actor, 'bookings:approve') && !can(actor, 'payments:record'))) throw new Error('You do not have permission to view bookings.')
  const query = filters.query?.trim().slice(0, 120).toLowerCase()
  return (await findAll<EnquiryRecord>('enquiries'))
    .filter((r) => r.kind === 'venue' && r.department === 'venue' && r.booking)
    .filter((r) => !filters.state || filters.state === 'all'
      || (filters.state === 'awaiting-payment' ? r.booking!.status === 'approved' && !r.booking!.paidReference
        : filters.state === 'paid' ? r.booking!.status === 'approved' && !!r.booking!.paidReference
          : r.booking!.status === filters.state))
    .filter((r) => !query || [r.referenceCode, r.name, r.company, r.email, r.phone, String(r.fields.venueSlug)].some((value) => value.toLowerCase().includes(query)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function validCheckoutUrl(value: string) {
  try {
    const url = new URL(value)
    const hosts = (process.env.PAYMENT_LINK_HOSTS ?? '').split(',').map((h) => h.trim().toLowerCase()).filter(Boolean)
    return url.protocol === 'https:' && !url.username && !url.password && !url.port && hosts.includes(url.hostname.toLowerCase())
  } catch { return false }
}

export async function changeBooking(id: string, operation: string, data: FormData, actor: StaffUser) {
  const approval = operation === 'approve' || operation === 'decline'
  if (!actor.active || !can(actor, approval ? 'bookings:approve' : 'payments:record')) throw new Error('You do not have permission to perform this action.')
  return transaction<EnquiryRecord, string>('enquiries', (records) => {
    const record = records.find((r) => r.id === id && r.kind === 'venue')
    if (!record?.booking) throw new Error('Booking not found.')
    const booking = { ...record.booking }
    if (approval) {
      if (booking.status !== 'requested') throw new Error('This request has already been reviewed.')
      if (operation === 'approve') {
        if (new Date(`${record.fields.startsAt}:00+05:30`).getTime() <= Date.now()) throw new Error('The requested start time has passed. Ask the customer for new dates.')
        const collision = records.some((r) => r.id !== id && r.booking?.status === 'approved' && r.fields.venueSlug === record.fields.venueSlug && String(r.fields.startsAt) < String(record.fields.endsAt) && String(r.fields.endsAt) > String(record.fields.startsAt))
        if (collision) throw new Error('Another approved booking overlaps this venue and time. Review the dates before approval.')
        booking.amountPaise = amountSchema.parse(data.get('amount'))
        booking.status = 'approved'
      } else booking.status = 'declined'
    } else {
      if (booking.status !== 'approved') throw new Error('The venue team must approve the booking first.')
      if (booking.paidReference) throw new Error('Payment has already been recorded.')
      if (operation === 'payment-link') {
        const url = String(data.get('checkoutUrl') ?? '').trim()
        if (!validCheckoutUrl(url)) throw new Error('Use an HTTPS payment link from a host configured in PAYMENT_LINK_HOSTS.')
        booking.checkoutUrl = url
      } else if (operation === 'record-payment') {
        if (data.get('verified') !== 'on') throw new Error('Confirm the amount and receipt in the payment provider before recording payment.')
        booking.paidReference = z.string().trim().min(4).max(160).parse(data.get('receipt'))
        if (records.some((r) => r.id !== id && r.booking?.paidReference === booking.paidReference)) throw new Error('This receipt has already been recorded for another booking.')
      } else throw new Error('Unknown booking action.')
    }
    return { records: records.map((r) => r.id === id ? { ...r, booking, updatedAt: new Date().toISOString() } : r), result: record.referenceCode }
  })
}
