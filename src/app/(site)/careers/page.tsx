import type { Metadata } from 'next'
import { site } from '@/content/site'
import { PageHero, Section } from '@/components/ui/Section'
import { EnquiryForm } from '@/components/EnquiryForm'

export const metadata: Metadata = {
  title: 'Careers — Work at Auto Cluster',
  description:
    'Apply for a role at the Auto Cluster Development and Research Institute, Chinchwad, Pune — testing laboratories, the machining facility and venue operations.',
}

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Work at Auto Cluster"
        subtitle="Roles across our testing laboratories, machining facility and venue operations, in the Chinchwad–Talegaon–Chakan automotive belt of Pune."
      />

      <Section tone="white">
        <h2>What you'd be part of</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          <li>
            <h3 className="text-[17px] mb-1.5">NABL-accredited testing labs</h3>
            <p className="text-ink-700 m-0">
              Environmental, rubber &amp; polymer and metrology labs working to{' '}
              {site.accreditation.nabl}.
            </p>
          </li>
          <li>
            <h3 className="text-[17px] mb-1.5">A working machining facility</h3>
            <p className="text-ink-700 m-0">
              VMC machining, wire EDM, laser cutting and 3D printing producing real parts for
              regional manufacturers.
            </p>
          </li>
          <li>
            <h3 className="text-[17px] mb-1.5">Exhibition &amp; training venues</h3>
            <p className="text-ink-700 m-0">
              An exhibition centre, auditorium and training halls that host industry events
              through the year.
            </p>
          </li>
          <li>
            <h3 className="text-[17px] mb-1.5">A govt.-promoted institute</h3>
            <p className="text-ink-700 m-0">
              Backed by the Ministry of Commerce and Industry, PCMC, the Government of
              Maharashtra and MCCIA.
            </p>
          </li>
        </ul>
      </Section>

      <Section id="apply">
        <h2>Apply at Auto Cluster</h2>
        <p className="mt-4 text-ink-700">
          We don't run a public job board yet, so this is an open application rather than a
          reply to a specific listing — tell us the role you're interested in and attach your
          résumé, and it reaches our HR team directly. Students, fresh graduates and working
          professionals are all welcome to apply.
        </p>
        {/* Left-aligned, not `mx-auto` — see the same fix on /contact for why:
            the page runs edge to edge, so a centred wrapper here floats away
            from the heading above it on anything wider than ~1600px. */}
        <div className="mt-8 max-w-[680px]">
          <EnquiryForm lockedServiceId="careers" />
        </div>
      </Section>

      <Section tone="white">
        <h2 className="text-[22px]">After you apply</h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3 list-none m-0 p-0">
          <li className="border border-rule rounded-md bg-white p-5">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-brand-600">
              Step 1
            </span>
            <p className="mt-2 text-[14.5px] text-ink-700 m-0">
              You get an emailed acknowledgement with a reference number, straight away.
            </p>
          </li>
          <li className="border border-rule rounded-md bg-white p-5">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-brand-600">
              Step 2
            </span>
            <p className="mt-2 text-[14.5px] text-ink-700 m-0">
              Our HR team reviews it against current and upcoming openings in that area.
            </p>
          </li>
          <li className="border border-rule rounded-md bg-white p-5">
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-brand-600">
              Step 3
            </span>
            <p className="mt-2 text-[14.5px] text-ink-700 m-0">
              If there's a fit, we call or email you to take it further. We keep applications
              on file for future openings too.
            </p>
          </li>
        </ol>
        <p className="mt-6 text-[14.5px] text-ink-500">
          Questions in the meantime? Call{' '}
          <a href={site.phone.href} className="text-brand-800">
            {site.phone.display}
          </a>{' '}
          or email{' '}
          <a href={`mailto:${site.email.info}`} className="text-brand-800">
            {site.email.info}
          </a>
          .
        </p>
      </Section>
    </>
  )
}
