import { html, joinHtml } from '../../lib/html.js'
import { pageHero, section, serviceCard, specTable, standardList, dashList, buttonLink } from '../components.js'
import { categories, getEquipmentByCategory } from '../../content/equipment.js'
import { serviceTiles, facilityHeroImages, facilityPhotos } from '../../content/images.js'
import { site } from '../../content/site.js'

export function facilitiesListPage({ primaryFacilities }) {
  const cards = joinHtml(
    primaryFacilities.map((f) => {
      const machines = f.category ? getEquipmentByCategory(f.category) : []
      const data = [
        ...(machines.length ? [{ label: 'Machines', value: String(machines.length) }] : []),
        ...(f.tests ? [{ label: 'Test methods', value: String(f.tests.length) }] : []),
      ]
      return html`<li>${serviceCard({
        href: `/facilities/${f.slug}`,
        title: f.name,
        description: f.summary,
        eyebrow: categories.find((c) => c.id === f.category)?.label || '',
        image: f.category ? serviceTiles[f.category] : null,
        badge: f.isAccredited ? 'NABL 17025' : '',
        data,
      })}</li>`
    }),
  )

  return html`
    ${pageHero({
      eyebrow: 'Facilities',
      title: 'Infrastructure MSMEs cannot justify buying alone',
      subtitle: 'Testing, machining, prototyping and metrology under one roof in Chinchwad, with NABL ISO/IEC 17025:2017 accreditation on the laboratories.',
    })}
    ${section(html`<h2 class="sr-only">All facilities</h2><ul class="card-grid items-start gap-5 list-none m-0 p-0">${cards}</ul>`, { tone: 'glow' })}
  `
}

function testsSection(facility) {
  if (!facility.tests || facility.tests.length === 0) return ''
  const items = joinHtml(
    facility.tests.map(
      (test) => html`
      <details class="group border-b border-rule">
        <summary class="flex items-center justify-between gap-4 cursor-pointer list-none py-4 min-h-11">
          <h3 class="text-solid text-[18px] m-0 text-ink-900 group-open:text-brand-600">${test.name}</h3>
          <span aria-hidden="true" class="shrink-0 font-mono text-ink-400 group-open:rotate-45 transition-transform duration-150">+</span>
        </summary>
        <div class="pb-5 flex flex-col gap-3">
          ${joinHtml(test.body.map((p) => html`<p class="text-[15px] text-ink-700 m-0">${p}</p>`))}
          ${test.standards && test.standards.length > 0 ? html`<div class="pt-1">${standardList(test.standards)}</div>` : ''}
        </div>
      </details>`,
    ),
  )
  return section(html`
    <h2>${facility.testsHeading || 'Tests conducted at Auto Cluster'}</h2>
    <p class="mt-4 text-ink-700">${facility.tests.length} ${facility.testsHeading ? 'items' : 'test methods'}, each with further detail below.</p>
    <div class="mt-8 border-t border-rule">${items}</div>
  `, { tone: 'white' })
}

function equipmentSection(machines) {
  if (machines.length === 0) return ''
  const items = joinHtml(
    machines.map(
      (m) => html`
      <li class="grow basis-[16.25rem] max-w-[23rem]">
        <a href="/equipment/${m.slug}" class="group block h-full bg-white rounded-md p-5 no-underline shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-[var(--shadow-hover)]">
          ${m.image ? html`<img src="${m.image.src}" alt="" width="${m.image.width}" height="${m.image.height}" class="-mx-5 -mt-5 rounded-t-md w-[calc(100%+2.5rem)] max-w-none aspect-[3/2] object-cover" />` : ''}
          <span class="block mt-1 font-display font-semibold text-[17px] leading-tight text-brand-600">${m.name}</span>
          ${m.make ? html`<span class="block mt-1 font-mono text-[12px] text-ink-400">${[m.make, m.model].filter(Boolean).join(' · ')}</span>` : ''}
          <span class="block mt-2 text-[13.5px] leading-snug text-ink-500">${m.summary}</span>
        </a>
      </li>`,
    ),
  )
  return section(html`
    <h2>Equipment</h2>
    <p class="mt-4 text-ink-700">Every machine has a full specification page with make, model, capacity and applicable standards.</p>
    <ul class="mt-8 flex flex-wrap justify-center gap-4 list-none m-0 p-0">${items}</ul>
  `)
}

export function facilityDetailPage(facility) {
  const machines = facility.category ? getEquipmentByCategory(facility.category) : []
  const photos = facilityPhotos[facility.slug] || []
  const standards = [
    ...new Set([...machines.flatMap((m) => m.standards), ...(facility.tests?.flatMap((t) => t.standards || []) || [])]),
  ].sort()

  const photoGrid =
    photos.length > 0
      ? html`<div class="mt-10 grid gap-5 ${photos.length > 1 ? 'sm:grid-cols-2' : 'max-w-[520px]'}">${joinHtml(
          photos.map((p) => html`<img src="${p.src}" alt="${p.alt}" width="${p.width}" height="${p.height}" class="w-full aspect-[4/3] object-cover rounded-md" />`),
        )}</div>`
      : ''

  const introSection =
    facility.intro.length > 0
      ? section(html`<h2>About our ${facility.name.toLowerCase()}</h2><div class="mt-5 flex flex-col gap-4 text-ink-700">${joinHtml(facility.intro.map((p) => html`<p>${p}</p>`))}</div>${photoGrid}`, { tone: 'white' })
      : ''

  const capabilitiesSection =
    facility.capabilities && facility.capabilities.length > 0
      ? section(html`
          <h2 class="text-[22px]">Our ${facility.name.toLowerCase()} capabilities</h2>
          <p class="mt-4 text-ink-700">${facility.capabilitiesNote || 'Auto Cluster Development and Research Institute Pune is equipped with the following chamber types.'}</p>
          ${dashList(facility.capabilities)}
        `)
      : ''

  const standardsSection =
    standards.length > 0 ? section(html`<h2>Standards we test to</h2><div class="mt-5">${standardList(standards)}</div>`) : ''

  const industriesSection =
    facility.industries.length > 0
      ? section(html`<h2 class="text-[22px]">Industries we serve</h2>${dashList(facility.industries)}`, { tone: 'white' })
      : ''

  const projectsSection =
    facility.projects && facility.projects.length > 0
      ? section(html`<h2 class="text-[22px]">Special projects undertaken</h2><ul class="mt-5 flex flex-col gap-3 list-none m-0 p-0">${joinHtml(
          facility.projects.map((p) => html`<li class="relative pl-6 text-ink-700 text-[15px] max-w-[66ch]"><span aria-hidden="true" class="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"></span>${p}</li>`),
        )}</ul>`)
      : ''

  const teamSection =
    facility.team && facility.team.length > 0
      ? section(html`
          <h2 class="text-[22px]">Meet the team</h2>
          <ul class="mt-5 flex flex-wrap gap-3 list-none m-0 p-0">${joinHtml(
            facility.team.map((name) => html`<li class="grow basis-[13rem] max-w-[17rem] border-b border-rule pb-3"><span class="block text-[15px] font-semibold text-ink-900">${name}</span><span class="block font-mono text-[11px] tracking-[0.1em] uppercase text-ink-400 mt-1">Designation pending</span></li>`),
          )}</ul>
        `, { tone: 'white' })
      : ''

  const heroImage = facilityHeroImages[facility.slug]
  const machinesCta =
    machines.length > 0
      ? buttonLink(`/equipment?category=${facility.category}`, `${machines.length} machines`, { variant: 'secondary' })
      : ''

  return html`
    ${pageHero({
      eyebrow: facility.isAccredited ? site.accreditation.nabl : 'Facility',
      title: facility.h1,
      subtitle: facility.h2,
      actions: html`${buttonLink(`/contact?facility=${facility.slug}`, 'Send an enquiry')}${machinesCta}`,
    })}
    ${heroImage ? html`<div class="bg-white border-b border-rule"><img src="${heroImage.src}" alt="${heroImage.alt}" width="${heroImage.width}" height="${heroImage.height}" class="w-full max-h-[420px] object-cover" /></div>` : ''}
    ${introSection}
    ${capabilitiesSection}
    ${equipmentSection(machines)}
    ${testsSection(facility)}
    ${standardsSection}
    ${industriesSection}
    ${projectsSection}
    ${teamSection}
    ${section(html`
      <h2 class="text-[24px]">Talk to the ${facility.name} team</h2>
      <p class="mt-3 text-ink-700">Tell us about your part or sample and we will confirm suitability, turnaround and cost.</p>
      <div class="mt-6 flex flex-wrap gap-3">${buttonLink(`/contact?facility=${facility.slug}`, 'Send an enquiry')}${buttonLink(site.phone.href, `Call ${site.phone.display}`, { variant: 'secondary' })}</div>
    `, { tone: 'accent' })}
  `
}
