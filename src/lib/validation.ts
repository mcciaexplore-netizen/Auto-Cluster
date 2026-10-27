import { z } from 'zod'
import { getService } from '@/content/services'
import { getVenue } from '@/content/venues'

/**
 * Enquiry schema. Used on the client and re-validated on the server.
 *
 * Replaces the broken Contact Form 7 shortcode, the external Google Form
 * (`forms.gle/xYZnEyN2NqiF3ySD6`) the client uses as a workaround, the 30
 * non-functional "Our Machines Form" instances, and the dead "Request a Quote"
 * modal.
 *
 * Each service kind has its own fields, including venue requests and startup applications.
 */

export const departments = [
  'testing',
  'prototyping',
  'venue',
  'training',
  'careers',
  'tenders',
  'general',
] as const

export const departmentLabels: Record<(typeof departments)[number], string> = {
  testing: 'Testing — environmental, rubber & polymer, metrology',
  prototyping: 'Prototyping — machining, 3D printing',
  venue: 'Venue hire — exhibition, auditorium, training hall',
  training: 'Training programs',
  careers: 'Careers',
  tenders: 'Tenders and procurement',
  general: 'General enquiry',
}

export const contactFields = {
  name: z.string().trim().min(2, 'Enter your name.').max(120),

  company: z.string().trim().max(160).optional().or(z.literal('')),

  email: z.string().trim().email('Enter an email address we can reply to.').max(200),

  // Indian mobile or landline, with or without +91.
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+?91[\s-]?)?[0-9][0-9\s-]{7,14}$/,
      'Enter a phone number we can reach you on — 10 digits, no country code needed.',
    ),

  /** src/content/services.ts id. Resolves to a department server-side. */
  serviceId: z.string().min(1, 'Choose a service.'),

  subject: z.string().trim().max(200).optional().or(z.literal('')),

  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little about what you need — 10 characters or more.')
    .max(4000),

  consent: z.literal(true, {
    error: 'Please confirm we may contact you about this request.',
  }),

  /**
   * Honeypot. Real users never fill this; bots usually do.
   *
   * Deliberately permissive: if zod rejected a filled honeypot, the request
   * would 422 with `website` named in the field errors, telling the bot
   * exactly which field caught it. The route handler checks it instead and
   * accepts silently.
   */
  website: z.string().optional(),

  /**
   * `Date.now()` captured when the form mounted, echoed back on submit. A
   * submission that arrives less than a couple of seconds after the form
   * rendered was not typed by a person — checked in the route handler, not
   * here, since the threshold is a timing policy rather than a shape rule.
   * Not a real bot challenge (no hCaptcha/Turnstile site key is configured
   * yet); it catches the fastest, dumbest bots and nothing more.
   */
  formRenderedAt: z.number(),
}
const base = contactFields

export const localDateTime = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Choose a date and time.')
  .refine((v) => {
    const date = new Date(`${v}:00+05:30`)
    return Number.isFinite(date.getTime()) && new Date(date.getTime() + 330 * 60000).toISOString().slice(0, 16) === v
  }, 'Choose a valid date and time.')

const venueSchema = z.object({
  ...base,
  kind: z.literal('venue'),
  venueSlug: z.string().refine((v) => Boolean(getVenue(v)?.bookable), 'Choose a venue.'),
  roomUse: z.enum(['exhibition', 'conference', 'video-conference', 'training', 'other']),
  startsAt: localDateTime,
  endsAt: localDateTime,
  attendees: z.string().regex(/^[1-9]\d{0,4}$/, 'Enter the expected number of attendees.'),
  eventType: z.string().trim().min(2, 'Enter the event type.').max(160),
  floorPlanRequested: z.boolean().default(false),
  wifiRequired: z.boolean().default(false),
  parkingRequired: z.boolean().default(false),
})

const startupSchema = z.object({
  ...base,
  kind: z.literal('startup'),
  startupName: z.string().trim().min(2, 'Enter your startup or project name.').max(160),
  stage: z.enum(['idea', 'prototype', 'early-revenue', 'growth']),
  supportNeeded: z.string().trim().min(10, 'Describe the support you need.').max(2000),
})

const manufacturingSchema = z.object({
  ...base,
  kind: z.literal('manufacturing'),
  partName: z.string().trim().min(1, 'Enter the part name.').max(200),
  material: z.string().trim().min(1, 'Enter the material.').max(200),
  quantity: z.string().trim().min(1, 'Enter a quantity.').max(50),
  tolerance: z.string().trim().max(100).optional().or(z.literal('')),
  deliveryDate: z.string().trim().min(1, 'Enter the delivery date you need.'),
  /** Token from a prior POST /api/upload, if a drawing was attached. */
  cadFileToken: z.string().optional().or(z.literal('')),
})

const testingSchema = z.object({
  ...base,
  kind: z.literal('testing'),
  sampleDescription: z.string().trim().min(1, 'Describe the sample.').max(1000),
  standardOrTest: z.string().trim().min(1, 'Enter the standard or test required.').max(300),
  sampleCount: z.string().trim().min(1, 'Enter how many samples.').max(50),
  nablScope: z.boolean().default(false),
  cadFileToken: z.string().optional().or(z.literal('')),
})

const generalSchema = z.object({
  ...base,
  kind: z.literal('general'),
})

export const applicantTypes = ['student', 'graduate', 'professional'] as const
export type ApplicantType = (typeof applicantTypes)[number]

export const applicantTypeLabels: Record<ApplicantType, string> = {
  student: 'Currently studying',
  graduate: 'Fresh graduate',
  professional: 'Working professional',
}

const careersSchema = z.object({
  ...base,
  kind: z.literal('careers'),
  applicantType: z.enum(applicantTypes, {
    message: 'Tell us which of these best describes you.',
  }),
  position: z.string().trim().min(2, 'Enter the role you are applying for.').max(200),
  education: z.string().trim().max(200).optional().or(z.literal('')),
  /** Token from a prior POST /api/upload. Required — a job application without a résumé isn't one. */
  resumeFileToken: z.string().min(1, 'Attach your résumé.'),
})

export const enquirySchema = z.discriminatedUnion('kind', [
  manufacturingSchema,
  testingSchema,
  careersSchema,
  generalSchema,
  venueSchema,
  startupSchema,
]).superRefine((input, ctx) => {
  const service = getService(input.serviceId)
  const expected = service?.kind === 'training' ? 'general' : service?.kind
  if (!service || expected !== input.kind) ctx.addIssue({ code: 'custom', path: ['serviceId'], message: 'Choose a matching service.' })
  if (input.kind === 'venue') {
    if (new Date(`${input.startsAt}:00+05:30`).getTime() <= Date.now()) ctx.addIssue({ code: 'custom', path: ['startsAt'], message: 'Choose a future start time.' })
    if (input.endsAt <= input.startsAt) ctx.addIssue({ code: 'custom', path: ['endsAt'], message: 'End time must be after start time.' })
  }
})

export type EnquiryInput = z.infer<typeof enquirySchema>

/** Field-keyed errors, shaped for inline rendering next to each input. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!out[key]) out[key] = issue.message
  }
  return out
}
