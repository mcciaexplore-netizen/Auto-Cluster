import type { EnquiryInput } from './validation'
import { departmentLabels } from './validation'
import type { EnquiryDepartment } from './types'

/**
 * Department routing and delivery.
 *
 * Which mailbox owns which department is CONTENT_QUESTIONS.md CQ-07 — the
 * current site shows three addresses (marketing@, marketing2@, info@) with no
 * stated purpose for any of them.
 *
 * Without RESEND_API_KEY set, delivery is skipped so local development works
 * with no mail provider configured.
 */

const ROUTES: Record<EnquiryDepartment, string | undefined> = {
  testing: process.env.EMAIL_TO_TESTING,
  prototyping: process.env.EMAIL_TO_PROTOTYPING,
  venue: process.env.EMAIL_TO_VENUE,
  careers: process.env.EMAIL_TO_CAREERS,
  tenders: process.env.EMAIL_TO_TENDERS,
  general: process.env.EMAIL_TO_GENERAL,
}

const FALLBACK = 'marketing@autoclusterpune.org'

export function routeEnquiry(department: EnquiryDepartment): string {
  return ROUTES[department] ?? FALLBACK
}

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

export async function sendDepartmentNotification(
  to: string,
  enquiry: EnquiryInput,
): Promise<void> {
  await deliver({
    to,
    replyTo: enquiry.email,
    subject: `Enquiry — ${departmentLabels[enquiry.department]}${
      enquiry.subject ? ` — ${enquiry.subject}` : ''
    }`,
    text: [
      `Name:       ${enquiry.name}`,
      `Company:    ${enquiry.company || '—'}`,
      `Email:      ${enquiry.email}`,
      `Phone:      ${enquiry.phone}`,
      `Department: ${departmentLabels[enquiry.department]}`,
      `Subject:    ${enquiry.subject || '—'}`,
      '',
      enquiry.message,
    ].join('\n'),
  })
}

export async function sendAcknowledgement(enquiry: EnquiryInput): Promise<void> {
  await deliver({
    to: enquiry.email,
    subject: 'We have received your enquiry — Auto Cluster',
    text: [
      `Dear ${enquiry.name},`,
      '',
      'Thank you for contacting the Auto Cluster Development and Research Institute.',
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
