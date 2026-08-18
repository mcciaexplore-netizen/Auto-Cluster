import type { Metadata } from 'next'
import { site } from '@/content/site'
import { departments, departmentLabels } from '@/lib/validation'
import { serviceIdForCategory, serviceIdForDepartment } from '@/content/services'
import { equipment } from '@/content/equipment'
import { facilities } from '@/content/facilities'
import { PageHero, Section } from '@/components/ui/Section'
import { EnquiryForm } from '@/components/EnquiryForm'
import { EmptyState } from '@/components/ui/Card'
import { BuildNote } from '@/components/blocks/BuildNote'
import { cn } from '@/lib/cn'

export const metadata: Metadata = {
  title: 'Contact — Testing, Prototyping & Venue Enquiries',
  description:
    'Contact Auto Cluster Development and Research Institute, H-Block, Plot No. C-181, Chinchwad East, Pune 411 019. Phone +91 20 6633 3700.',
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; department?: string; machine?: string; facility?: string }>
}) {
  const params = await searchParams
  const { address } = site

  const machine = params.machine ? equipment.find((e) => e.slug === params.machine) : undefined
  const facility = params.facility ? facilities.find((f) => f.slug === params.facility) : undefined

  const serviceId =
    params.service ??
    serviceIdForCategory(machine?.category) ??
    serviceIdForCategory(facility?.category) ??
    (params.department ? serviceIdForDepartment(params.department) : undefined) ??
    'general'

  const subject = params.machine
    ? `Enquiry about ${params.machine.replace(/-/g, ' ')}`
    : params.facility
      ? `Enquiry about ${params.facility.replace(/-/g, ' ')}`
      : ''

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Auto Cluster"
        subtitle="Chinchwad East, on the Mumbai–Pune Road. Call us, email us, or send an enquiry and it will reach the team that can answer it."
      />

      <Section tone="white">
        <h2>Send an enquiry</h2>
        <p className="mt-4 text-ink-700">
          One form for every department. We store your enquiry, route it to the right team
          and send you an acknowledgement.
        </p>
        {/* Left-aligned, not `mx-auto` — the page itself runs edge to edge
            with no max width (see --page-max in globals.css), so a centred
            wrapper here floated the form away from the "Send an enquiry"
            heading above it on anything wider than ~1600px, with the gap
            growing to hundreds of pixels on an ultrawide monitor. Starting
            flush with the heading's own left edge instead keeps the two
            reading as one block regardless of viewport width.

            Only the machine-scoped case still caps its own width — that
            layout has no sidebar to absorb extra space, so an uncapped form
            would just stretch its inputs. The full picker+form layout below
            caps the form internally (EnquiryForm's own grid columns) and
            lets the picker fill whatever width is left instead. */}
        <div className={cn('mt-8', params.machine && 'max-w-[680px]')}>
          <EnquiryForm
            defaultServiceId={serviceId}
            defaultSubject={subject}
            categoryPicker={Boolean(params.machine)}
          />
        </div>
      </Section>

      <Section>
        <h2>Address and contact</h2>

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-solid label mb-3">Postal address</h3>
            <address className="not-italic text-[16px] leading-relaxed text-ink-900">
              {address.organisation}
              <br />
              {address.lines.join(', ')}
              <br />
              {address.city} – {address.postalCode}
              <br />
              {address.region}, {address.country}
            </address>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-solid label mb-2">Phone</h3>
              <a
                href={site.phone.href}
                className="font-mono text-[17px] text-brand-800 no-underline hover:underline"
              >
                {site.phone.display}
              </a>
            </div>
            <div>
              <h3 className="text-solid label mb-2">Email</h3>
              <div className="flex flex-col gap-1.5">
                <a
                  href={`mailto:${site.email.marketing}`}
                  className="text-[15px] text-brand-800 no-underline hover:underline"
                >
                  {site.email.marketing}
                </a>
                <a
                  href={`mailto:${site.email.info}`}
                  className="text-[15px] text-brand-800 no-underline hover:underline"
                >
                  {site.email.info}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <h2 className="text-[22px]">Who handles what</h2>
        {/* flex-wrap, not tile-grid: 7 departments don't divide evenly into
            tile-grid's fixed column count, which left the trailing row's
            empty tracks as a wide blank gap. grow fills a short row; centre
            it once grow hits the width cap below. */}
        <ul className="mt-5 flex flex-wrap justify-center gap-3 list-none m-0 p-0">
          {departments.map((d) => (
            <li
              key={d}
              className="grow basis-[13rem] max-w-[17rem] border border-rule rounded-md bg-white p-4"
            >
              <span className="block font-display font-semibold text-[15px] text-brand-600">
                {departmentLabels[d]}
              </span>
              <span className="block mt-1 font-mono text-[11px] tracking-[0.08em] uppercase text-ink-400">
                Named contact pending
              </span>
            </li>
          ))}
        </ul>
        <BuildNote question="CQ-07">
          The current site shows three email addresses with no stated purpose for any of
          them, and names nobody. Department owners have been requested from ACDRI.
        </BuildNote>
      </Section>

      <Section>
        <h2 className="text-[22px]">Locate us</h2>
        <div className="mt-5 max-w-[560px] flex flex-col gap-4">
          <EmptyState
            title="Map pending a Place ID"
            body="An interactive map is coming shortly. We are at H-Block, Plot No. C-181, Chinchwad East, on the Mumbai–Pune Road. Call us and we will guide you in."
          />
          <EmptyState
            title="Directions, parking and opening hours"
            body="Driving directions, parking guidance and reception hours will be published here. For a sample drop-off, call ahead and we will confirm timings."
          />
        </div>
      </Section>
    </>
  )
}
