import { departmentLabels } from './validation'
import { getService } from '@/content/services'
import type { EnquiryRecord } from '@/server/enquiries'

/**
 * Delivery only. Routing lives in src/server/routing.ts now — the
 * staff-editable table that replaced this file's old hardcoded `ROUTES`
 * object (CONTENT_QUESTIONS.md CQ-07: the current site shows three
 * addresses, marketing@, marketing2@, info@, with no stated purpose for any
 * of them; a hardcoded map here would just be a second place that guess
 * lived).
 *
 * Without RESEND_API_KEY set, delivery is skipped so local development works
 * with no mail provider configured.
 */

interface Message {
  to: string
  subject: string
  text: string
  replyTo?: string
}

async function deliver(message: Message): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM ?? 'Auto Cluster <no-reply@autoclusterpune.org>'

  if (!apiKey) {
    console.log('[email] RESEND_API_KEY not set — logging instead of sending.', message)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      ...(message.replyTo && { reply_to: message.replyTo }),
    }),
  })

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`)
  }
}

function fieldLines(enquiry: EnquiryRecord): string[] {
  const entries = Object.entries(enquiry.fields)
  if (entries.length === 0) return []
  const labels: Record<string, string> = {
    partName: 'Part name',
    material: 'Material',
    quantity: 'Quantity',
    tolerance: 'Tolerance',
    deliveryDate: 'Delivery date needed',
    sampleDescription: 'Sample description',
    standardOrTest: 'Standard / test required',
    sampleCount: 'Sample count',
    nablScope: 'NABL scope required',
  }
  return ['', ...entries.map(([key, value]) => `${(labels[key] ?? key).padEnd(24)}${value}`)]
}

export async function sendDepartmentNotification(enquiry: EnquiryRecord): Promise<void> {
  const service = getService(enquiry.serviceId)
  await deliver({
    to: enquiry.routedTo,
    replyTo: enquiry.email,
    subject: `Enquiry ${enquiry.referenceCode} — ${service?.label ?? departmentLabels[enquiry.department]}${
      enquiry.subject ? ` — ${enquiry.subject}` : ''
    }`,
    text: [
      `Reference:  ${enquiry.referenceCode}`,
      `Service:    ${service?.label ?? enquiry.department}`,
      `Name:       ${enquiry.name}`,
      `Company:    ${enquiry.company || '—'}`,
      `Email:      ${enquiry.email}`,
      `Phone:      ${enquiry.phone}`,
      `Subject:    ${enquiry.subject || '—'}`,
      enquiry.needsRoutingReview
        ? '\n[No routing mapped for this service — sent to the fallback inbox. Add a mapping in Staff > Settings > Routing.]'
        : '',
      ...fieldLines(enquiry),
      enquiry.cadFileToken
        ? `\nAttachment: ${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/api/files/${enquiry.cadFileToken}`
        : '',
      '',
      enquiry.message,
    ]
      .filter(Boolean)
      .join('\n'),
  })
}

export async function sendAcknowledgement(enquiry: EnquiryRecord): Promise<void> {
  await deliver({
    to: enquiry.email,
    subject: `We have received your enquiry — ${enquiry.referenceCode}`,
    text: [
      `Dear ${enquiry.name},`,
      '',
      'Thank you for contacting the Auto Cluster Development and Research Institute.',
      `Your reference number is ${enquiry.referenceCode} — quote it in any follow-up.`,
      'Your enquiry has reached the right team and we will reply shortly.',
      '',
      'What you sent us:',
      enquiry.message,
      '',
      'If it is urgent, call us on +91 20 6633 3700.',
      '',
      'Auto Cluster Development and Research Institute',
      'H-Block, Plot No. C-181, Chinchwad East, Mumbai Pune Road',
      'Pune 411 019, Maharashtra, India',
    ].join('\n'),
  })
}

/** "Automatic follow-up nudge if an enquiry sits untouched for 48 hours" — sent to the team that owns it, not the enquirer. */
export async function sendFollowUpNudge(enquiry: EnquiryRecord): Promise<void> {
  const service = getService(enquiry.serviceId)
  await deliver({
    to: enquiry.routedTo,
    subject: `Reminder — ${enquiry.referenceCode} has had no update in 48 hours`,
    text: [
      `Enquiry ${enquiry.referenceCode} (${service?.label ?? enquiry.department}) from ${enquiry.name} is still "new" 48 hours after it arrived.`,
      '',
      `Name:    ${enquiry.name}`,
      `Email:   ${enquiry.email}`,
      `Phone:   ${enquiry.phone}`,
      '',
      'Update its status once you have looked at it, even if only to "assigned".',
    ].join('\n'),
  })
}
