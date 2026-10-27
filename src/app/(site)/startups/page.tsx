import { PageHero, Prose, Section, Stat } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'
import { EnquiryForm } from '@/components/EnquiryForm'

export const metadata = {
  title: 'Startups & incubation',
  description: 'Discuss your startup, prototype and incubation support needs with Auto Cluster.',
}

const pillars = [
  'Modern Co-Working Space',
  'Business Mentoring & Guidance',
  'Business Networking',
  'Easy Access to In-house Designing, Prototyping and Testing Facilities',
]

const startupHubServices = [
  'Legal Services & CS Support',
  'Financial Advisory & Accounts',
  'Marketing and Branding Support',
  'Design Thinking Facilitation',
  'Business Planning & Funding Support',
  'Funding Assistance',
  'No Equity Dilution',
]

const sharedOfficeResources = [
  'Office Workstations',
  'Fully Equipped Meeting Rooms',
  'High-speed Internet & Communications',
  'Presentation and Training Facilities',
]

const pmfSupport = [
  'Ecosystem Access',
  'Advanced Technical Mentoring',
  'Product Development Assistance',
  'Market Validation Studies',
  'Customer Discovery Programmes',
  'Access to Prototyping & Testing Facilities',
  'Branding & Marketing Support',
  'Business Planning & Industry Connect',
]

const steps = [
  'Submit your inquiry',
  'Internal screening',
  'Jury round evaluation',
  'Selected ventures get incubated',
]

const dashboard: { label: string; value: string; count?: boolean }[] = [
  { label: 'Graduated Startups', value: '95' },
  { label: 'Live Startups', value: '15' },
  { label: 'Jobs Created', value: '345', count: true },
  { label: 'Combined Revenue Generated', value: '₹33.5 cr' },
  { label: 'Mentors', value: '22' },
]

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 grid gap-2 sm:grid-cols-2 list-none m-0 p-0">
      {items.map((item) => (
        <li key={item} className="relative pl-6 text-ink-700 text-[15px]">
          <span
            aria-hidden="true"
            className="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function StartupsPage() {
  return (
    <>
      <PageHero
        eyebrow="Startups & incubation"
        title="From an idea to something you can test."
        subtitle="The first incubation centre in the PCMC area, supported by PCMC and MCCIA, inaugurated 14 November 2019 to strengthen Pune's entrepreneurial ecosystem."
      >
        <ButtonLink href="#apply">Introduce your startup</ButtonLink>
      </PageHero>

      <Section tone="white">
        <h2 className="text-3xl">About the Incubation Centre</h2>
        <Prose
          className="mt-5 max-w-[66ch]"
          paragraphs={[
            'The incubation centre supports start-ups by providing infrastructure, mentorship, industry connect and growth opportunities to help innovative ideas transform into successful, sustainable ventures. The programme is designed for innovators, start-ups, community entrepreneurs and enterprises that need intensive hand-holding and access to physical infrastructure in Pune.',
            'We are sector-agnostic, with a main focus on manufacturing, automobile and product-based start-ups. Eligibility requires a validated, innovative idea — the incubation programme itself runs for 18 months.',
          ]}
        />
      </Section>

      <Section>
        <h2 className="text-[22px]">Steps to incubate</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-4 list-none m-0 p-0">
          {steps.map((step, i) => (
            <li key={step} className="border-t-2 border-brand-600 pt-3">
              <span className="block font-mono text-[11px] tracking-[0.14em] uppercase text-ink-400">
                Step {i + 1}
              </span>
              <span className="block mt-1 text-[15px] text-ink-900 font-semibold">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="white">
        <h2 className="text-[22px]">Four-pillar support (18-month incubation programme)</h2>
        <BulletList items={pillars} />
      </Section>

      <Section>
        <h2 className="text-[22px]">Startup Hub support services</h2>
        <BulletList items={startupHubServices} />
      </Section>

      <Section tone="white">
        <h2 className="text-[22px]">Shared office resources</h2>
        <BulletList items={sharedOfficeResources} />
      </Section>

      <Section>
        <h2 className="text-[22px]">Proof of concept to product-market fit</h2>
        <p className="mt-4 text-ink-700 max-w-[66ch]">
          Focuses on refining the product, validating the market, and preparing for
          commercialisation.
        </p>
        <BulletList items={pmfSupport} />
      </Section>

      <Section tone="accent">
        <h2 className="text-[22px]">Startup Incubation Dashboard</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-6">
          {dashboard.map((d) => (
            <Stat key={d.label} label={d.label} value={d.value} count={d.count} />
          ))}
        </div>
      </Section>

      <Section tone="white">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl">Bring your technical challenge.</h2>
            <p className="mt-5 text-ink-700">
              Whether you are exploring an idea or developing a prototype, describe your
              product, stage and requirements. Programme eligibility, facilities and terms
              are confirmed by the team.
            </p>
          </div>
          <div className="border-l-2 border-brand-600 pl-6">
            <h3 className="text-xl">Explore the shared facilities</h3>
            <p className="mt-3">
              Review the equipment and technical services that may support your project.
            </p>
            <ButtonLink href="/facilities" variant="secondary" className="mt-5">
              View facilities
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section>
        <div id="apply" className="max-w-[720px] scroll-mt-28">
          <h2 className="text-3xl mb-7">Introduce your startup</h2>
          <EnquiryForm
            lockedServiceId="startup-incubation"
            defaultSubject="Startup and incubation application"
          />
        </div>
      </Section>
    </>
  )
}
