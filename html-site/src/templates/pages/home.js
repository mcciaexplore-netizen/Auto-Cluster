import { html, joinHtml } from '../../lib/html.js'
import { container, section } from '../components.js'

const heroCollage = {
  src: '/images/home/hero-collage.png',
  alt: 'A gear-shaped collage: a CNC machine cutting metal, a robotic arm welding a vehicle frame, a shop floor of machining centres, the institute’s building exterior, and precision gears and machine parts',
  width: 1350,
  height: 1165,
}

const paths = [
  { href: '/facilities', title: 'Testing & prototyping', text: 'Explore environmental testing, material testing, machining, additive manufacturing and metrology.', link: 'Explore facilities' },
  { href: '/venues', title: 'Space for industry', text: 'Compare exhibition halls, the auditorium and training spaces. Send one request with your dates and requirements.', link: 'Venue options' },
]

/** Ported from src/app/(site)/page.tsx, carrying over the single-line / even-spacing promoter-logo fixes from the same conversation. */
export function homePage({ promoters }) {
  const promoterItems = joinHtml(
    promoters.map(
      (p) => html`<li class="flex items-center gap-3 shrink-0"><img src="${p.src}" alt="${p.alt}" width="${p.width}" height="${p.height}" class="h-16 w-auto object-contain shrink-0" /><span class="text-xs font-medium text-ink-700 whitespace-nowrap">${p.caption}</span></li>`,
    ),
  )

  const pathCards = joinHtml(
    paths.map(
      (p) => html`
      <article class="border-t-2 border-brand-600 pt-6">
        <h2 class="text-[28px]">${p.title}</h2>
        <p class="mt-4 text-ink-700">${p.text}</p>
        <a href="${p.href}" class="inline-flex items-center min-h-11 mt-4 font-semibold">${p.link} →</a>
      </article>`,
    ),
  )

  return html`
    <section class="bg-white">
      ${container(html`
        <div class="py-12 lg:py-20">
          <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p class="font-poppins text-sm text-brand-600 tracking-wide mb-5">Pune, India · An MCCIA initiative</p>
              <h1 class="max-w-[18ch]">Technical facilities for Indian MSMEs.</h1>
              <p class="mt-6 text-lg text-ink-700 max-w-[46ch]">Test a component, build a prototype or bring your industry together. Auto Cluster gives manufacturers access to shared facilities in Chinchwad, Pune.</p>
              <div class="flex flex-wrap gap-3 mt-8">
                <a href="/facilities" class="inline-flex items-center justify-center gap-2 font-semibold leading-none rounded-full no-underline min-h-11 text-[15px] px-8 py-3.5 gradient-edge text-white shadow-[var(--shadow-card)] [--edge-fill:var(--color-logo-indigo)]">Explore facilities</a>
                <a href="/venues" class="inline-flex items-center justify-center gap-2 font-semibold leading-none rounded-full no-underline min-h-11 text-[15px] px-8 py-3.5 bg-white text-brand-600 border border-rule shadow-[var(--shadow-card)] hover:border-rule-strong hover:bg-paper-2">Venue options</a>
              </div>
              <a href="/contact" class="inline-flex min-h-11 items-center mt-4 font-semibold text-brand-800">Discuss your requirements →</a>
            </div>
            <div class="relative aspect-[1350/1165]">
              <img src="${heroCollage.src}" alt="${heroCollage.alt}" width="${heroCollage.width}" height="${heroCollage.height}" class="object-contain w-full h-full" />
            </div>
          </div>

          <div class="border-t border-rule mt-10 pt-7">
            <p class="text-xs text-ink-500 mb-4">Promoted and supported by</p>
            <ul class="flex flex-nowrap justify-between gap-x-4 gap-y-6 list-none m-0 p-0 overflow-x-auto">${promoterItems}</ul>
          </div>
        </div>
      `)}
    </section>

    ${section(
      html`
        <div class="grid md:grid-cols-2 gap-8 md:gap-16">${pathCards}</div>
        <div class="mt-12 pt-7 border-t border-rule flex flex-wrap gap-x-8 gap-y-3">
          <a href="/rate-card">Service rate card →</a>
          <a href="/events">Events & registration →</a>
          <a href="/startups">Startups & incubation →</a>
          <a href="/media">Media →</a>
        </div>`,
      { compact: true },
    )}
  `
}
