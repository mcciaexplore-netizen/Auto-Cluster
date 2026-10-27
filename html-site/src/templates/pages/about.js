import { html } from '../../lib/html.js'
import { pageHero, section } from '../components.js'

/**
 * Lighter port of src/app/(site)/about/page.tsx for Phase 1 — overview,
 * certifications and vision/mission only. Team/board/timeline sections
 * (which pull from content/images.ts and have real-vs-pending data notes)
 * land in a later phase once the content/images modules are ported too.
 */
export function aboutPage() {
  return html`
    ${pageHero({
      eyebrow: 'About Auto Cluster',
      title: 'Technical facilities for Indian manufacturing, in Chinchwad, Pune.',
      subtitle:
        'Established under the Industrial Infrastructure Up-gradation Scheme (IIUS), with an MCCIA initiative and support from the Government of Maharashtra and Pimpri Chinchwad Municipal Corporation.',
    })}

    ${section(html`
      <h2>Overview</h2>
      <p class="mt-5 text-ink-700 max-w-[66ch]">
        Located in the Chinchwad-Talegaon-Chakan automotive district of Pune, the Auto Cluster
        Development and Research Institute is a facility for providing support to Small and
        Medium Enterprises. It provides a common facility for validation, training, seminars,
        workshops and market promotional activities, especially for the automotive and
        engineering sector.
      </p>
      <p class="mt-4 text-ink-700 max-w-[66ch]">
        ACDRI is known for its model of technology infrastructure for innovation, technology
        up-gradation, new product development, prototyping and testing — supporting key
        technologies such as e-mobility and new avenues of design validation for future
        mobility.
      </p>
    `, { tone: 'white' })}

    ${section(html`
      <h2 id="certifications" class="text-[22px]">Our certifications</h2>
      <p class="mt-4 text-ink-700 max-w-[66ch]">
        ISO 9001:2015 certified, with a NABL ISO/IEC 17025:2017 accredited laboratory —
        ensuring our processes align to national and international standards of quality and
        delivery.
      </p>
    `)}

    ${section(html`
      <div id="vision-mission" class="grid md:grid-cols-2 gap-10">
        <div>
          <h2 class="text-[22px]">Vision</h2>
          <p class="mt-4 text-ink-700">
            An excellence centre for component development support to nearby MSMEs, a
            state-of-the-art exhibition centre for showcasing products and services, and a
            knowledge hub running training programmes and development initiatives.
          </p>
        </div>
        <div>
          <h2 class="text-[22px]">Mission</h2>
          <p class="mt-4 text-ink-700">
            To promote innovation and collective learning in product design and development
            for local industry, improve confidence and competence through well-designed
            training programmes, and assist in technology transfer and continuous quality
            improvement.
          </p>
        </div>
      </div>
    `, { tone: 'white' })}
  `
}
