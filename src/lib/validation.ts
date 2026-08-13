import { z } from 'zod'

/**
 * Enquiry schema. Used on the client and re-validated on the server.
 *
 * Replaces the broken Contact Form 7 shortcode, the external Google Form
 * (`forms.gle/xYZnEyN2NqiF3ySD6`) the client uses as a workaround, the 30
 * non-functional "Our Machines Form" instances, and the dead "Request a Quote"
 * modal.
 *
 * One shape per service `kind` — manufacturing and testing services collect
 * different fields, per the requirement list. `venue` and `training` are not
 * representable here: those services hand off to their own flow before a
 * form is ever submitted (see EnquiryForm and src/content/services.ts), so
 * there is nothing for this schema to validate for them.
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

const base = {
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
    message: 'Please confirm we may contact you about this enquiry.',
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

export const enquirySchema = z.discriminatedUnion('kind', [
  manufacturingSchema,
  testingSchema,
  generalSchema,
])

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
