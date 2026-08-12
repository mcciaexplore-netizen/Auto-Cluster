import type { Metadata } from 'next'
import Image from 'next/image'
import { site } from '@/content/site'
import { aboutPhotos, badges } from '@/content/images'
import { PageHero, Prose, Section } from '@/components/ui/Section'
import { Figure } from '@/components/ui/Figure'
import { EmptyState } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { BuildNote } from '@/components/blocks/BuildNote'

export const metadata: Metadata = {
  title: 'About ACDRI — Government-Promoted Automotive Cluster Institute in Pune',
  description:
    'Auto Cluster Development and Research Institute, established under the IIUS scheme of DIPP, Ministry of Commerce and Industry, with the initiative of MCCIA and support from PCMC and the Government of Maharashtra.',
}

const board = [
  { name: 'Dr. Vijay Suryawanshi (IAS)', role: 'Chairman — Commissioner, PCMC' },
  { name: 'Mr. Prashant Girbane', role: 'Director General, MCCIA' },
  { name: 'Mr. Sanjay Kirloskar', role: 'President, MCCIA' },
  { name: 'Mr. Manoj Lonkar', role: 'Joint Commissioner, PCMC' },
  { name: 'Mr. Deepak Karandikar', role: 'Representative of MCCIA' },
  { name: 'Mr. Shrikrishna Gadgil', role: 'Managing Director, Auto Cluster' },
  { name: 'Mr. A. K. Jindal', role: 'Director' },
  { name: 'Mr. S. G. Rajput', role: 'Joint Director of Industries, Pune Region' },
  { name: 'Dr. Regi Mathai', role: 'Director, ARAI' },
  { name: 'Prof. Sunil Bhirud', role: 'Director, COEP' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the institute"
        title="Auto Cluster: pioneering in providing infrastructure support"
        subtitle="Solutions that promote innovation and collective learning."
      />

      <Section id="overview" tone="white">
        <h2>About Auto Cluster</h2>
        <Prose
          className="mt-5"
          paragraphs={[
            'Located in the Chinchwad-Talegaon-Chakan automotive district of Pune, the Auto Cluster Development and Research Institute is a facility providing support to small and medium enterprises. It offers a common facility for validation, training, seminars, workshops and market promotional activities, especially for the automotive and engineering sector. The institute has helped establish Pune as host to some of the biggest events in the automobile sector.',
            // Source repeats the "supported by…" clause twice; stated once.
            // "ACDRIL" corrected to ACDRI, "MSEME\'s" to MSMEs.
            'ACDRI was established under the Industrial Infrastructure Up-gradation Scheme (IIUS) of the Department of Industrial Policy and Promotion (DIPP), Ministry of Commerce and Industry, Government of India, supported by the Government of Maharashtra and the Pimpri Chinchwad Municipal Corporation, with the initiative of the Mahratta Chamber of Commerce, Industries and Agriculture (MCCIA).',
            'ACDRI Pune is known for its model of technology infrastructure for innovation, technology up-gradation, new product development, prototyping and testing. We are working to support and develop key technologies such as e-mobility, and to open new design validation platforms for future mobility under expert guidance.',
            'Auto Cluster also acts as a catalyst for industry-academia collaboration, building a network through online platforms and running expert guidance series for future industry engineers. Our equipment and machinery serve MSMEs from concept stage through to product validation, while our infrastructure is widely used for exhibitions and seminars by industry, industry associations and government agencies.',
            // Source paragraph is present-tense about the 2020 pandemic.
            // Reframed as the historical achievement it is.
            'During the COVID-19 pandemic, Auto Cluster supported the development of prototype PPE kit parts and medical equipment components, and converted its Exhibition Centre into a COVID hospital for PCMC.',
          ]}
        />
      </Section>

      <Section id="certifications">
        <h2>Our certifications</h2>
        <Prose
          className="mt-5"
          paragraphs={[
            'Our certifications support continuous growth and our commitment to excellence. They ensure our processes are aligned to national and international standards of quality and delivery.',
          ]}
        />
        {/* The marks sit beside the standard they stand for rather than in a
            row of logos at the foot of the page, which is where they were and
            where they said nothing. Both are decorative: the accreditation is
            spelled out in text on the same card. */}
        <ul className="mt-8 card-grid gap-4 list-none m-0 p-0">
          <li className="border border-rule rounded-md bg-white p-6 flex items-start gap-4">
            <Image
              src={badges.nabl.src}
              alt=""
              width={badges.nabl.width}
              height={badges.nabl.height}
              className="w-12 h-12 shrink-0"
            />
            <div className="min-w-0">
              <span className="label block">Laboratory accreditation</span>
              <span className="block mt-2 font-display font-semibold text-[20px] text-brand-600">
                {site.accreditation.nabl}
              </span>
              <p className="mt-2 text-[14px] text-ink-500 m-0">
                NABL accreditation for our laboratory.
              </p>
            </div>
          </li>
          <li className="border border-rule rounded-md bg-white p-6 flex items-start gap-4">
            <Image
              src={badges.iso9001.src}
              alt=""
              width={badges.iso9001.width}
              height={badges.iso9001.height}
              className="w-12 h-12 shrink-0"
            />
            <div className="min-w-0">
              <span className="label block">Quality management</span>
              <span className="block mt-2 font-display font-semibold text-[20px] text-brand-600">
                {site.accreditation.iso}
              </span>
              <p className="mt-2 text-[14px] text-ink-500 m-0">
                Certified by TÜV, covering working conditions and customer satisfaction.
              </p>
            </div>
          </li>
        </ul>

        {/* The certificate itself. Only a 300×199 scan exists, which is
            legible enough to show the issuing body and our name on it and not
            enough to read the scope — so it is presented at its own size with
            the flag, not blown up to fill the column. */}
        <Figure
          className="mt-8 max-w-[300px]"
          image={aboutPhotos.isoCertificate}
          sizes="300px"
          caption="The ISO 9001 certificate issued by TÜV SÜD South Asia."
        />

        <div className="mt-6">
          <ButtonLink href="/facilities/nabl-scope" variant="secondary" size="sm">
            View our NABL scope
          </ButtonLink>
        </div>
      </Section>

      <Section id="vision-mission" tone="white">
        <h2>Vision and mission</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-solid label mb-3">Vision</h3>
            <p className="text-ink-700">
              Auto Cluster Development and Research Institute, Chinchwad represents a centre
              of excellence for component development support to nearby MSMEs, a
              state-of-the-art exhibition centre for showcasing products and services, and a
              knowledge hub providing training programmes and skill development initiatives.
            </p>
          </div>
          <div>
            <h3 className="text-solid label mb-3">Mission</h3>
            <p className="text-ink-700">
              ACDRI exists to promote innovation and collective learning in product design
              and development for local industry, by providing appropriate and focused
              support. We assist in improving confidence, competence and reliability through
              well-designed training programmes for employees and students, assist in
              technology transfer and the adoption of new technologies, and facilitate
              information sharing and continuous quality improvement.
            </p>
          </div>
        </div>
      </Section>

      <Section id="md-message">
        <h2>Our MD&rsquo;s message</h2>
        <div className="mt-6 max-w-[720px]">
          <a
            href={`https://www.youtube.com/watch?v=${site.video.youtubeId}`}
            className="group block relative border border-rule rounded-md overflow-hidden bg-paper-2 no-underline"
            rel="noopener"
          >
            {/* Facade. The real embed only loads on click — the current site
                loads the full YouTube payload on every page view. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={site.video.poster}
              alt=""
              width={480}
              height={360}
              className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity duration-150"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center gap-2.5 bg-accent-700 text-white font-semibold text-[15px] px-5 py-3 rounded-md">
                <span aria-hidden="true">▶</span> Play {site.video.title}
              </span>
            </span>
          </a>
          <p className="mt-4 text-[13.5px] text-ink-500">Opens on YouTube.</p>
          <BuildNote>
            Needs a transcript and captions before launch. The existing embed has neither
            and is clipped to a 45-second excerpt.
          </BuildNote>
        </div>
      </Section>

      <Section id="team" tone="white">
        <h2>Our team</h2>
        <Prose
          className="mt-5"
          paragraphs={[
            'Our team is committed to providing services that meet national and international standards to client requirements. They are qualified, professional and skilled, and current with industry trends.',
          ]}
        />
        {/* The whole staff in one frame. Nobody is named — designations do
            not exist for any team member (CQ-11) and a group caption that
            named some faces and not others would be worse than none. The
            individual facility teams appear on their own pages. */}
        <Figure
          className="mt-8 max-w-[900px]"
          image={aboutPhotos.team}
          sizes="(min-width: 1024px) 900px, 100vw"
          caption="The Auto Cluster team at Chinchwad."
        />
      </Section>

      <Section id="board">
        <h2>Board of directors</h2>
        <ul className="mt-6 tile-grid gap-4 list-none m-0 p-0">
          {board.map((member) => (
            <li key={member.name} className="border border-rule rounded-md bg-white p-5">
              <span className="block font-display font-semibold text-[16px] text-ink-900">
                {member.name}
              </span>
              <span className="block mt-1 text-[13.5px] leading-snug text-ink-500">
                {member.role}
              </span>
            </li>
          ))}
        </ul>
        <BuildNote question="CQ-08">
          Headshots are withheld pending verification. In the current markup at least one
          photograph is paired with the wrong name.
        </BuildNote>
      </Section>

      <Section id="timeline" tone="white">
        <h2 className="text-[22px]">Timeline</h2>
        <div className="mt-5 max-w-[560px]">
          <EmptyState
            title="Milestones pending"
            body="A timeline of the institute’s milestones is in preparation."
          />
        </div>
      </Section>
    </>
  )
}
