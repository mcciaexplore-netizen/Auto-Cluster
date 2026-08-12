import { z } from 'zod'

/**
 * Enquiry schema. Used on the client and re-validated on the server.
 *
 * Replaces the broken Contact Form 7 shortcode, the external Google Form
 * (`forms.gle/xYZnEyN2NqiF3ySD6`) the client uses as a workaround, the 30
 * non-functional "Our Machines Form" instances, and the dead "Request a Quote"
 * modal.
 */

export const departments = [
  'testing',
  'prototyping',
  'venue',
  'careers',
  'tenders',
  'general',
] as const

export const departmentLabels: Record<(typeof departments)[number], string> = {
  testing: 'Testing — environmental, rubber & polymer, metrology',
  prototyping: 'Prototyping — machining, 3D printing',
  venue: 'Venue hire — exhibition, auditorium, training hall',
  careers: 'Careers',
  tenders: 'Tenders and procurement',
  general: 'General enquiry',
}

export const enquirySchema = z.object({
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

  department: z.enum(departments, { message: 'Choose which team should receive this.' }),

  /** Set when the enquiry came from an equipment or facility page. */
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
