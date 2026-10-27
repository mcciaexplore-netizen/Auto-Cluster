import { html, joinHtml, raw } from '../../lib/html.js'
import { container, pageHero, section, specTable, standardList, buttonLink } from '../components.js'
import { categories, equipment } from '../../content/equipment.js'
import { serviceIdForCategory } from '../../content/services.js'
import { site } from '../../content/site.js'

function filterChip(href, label, active) {
  const classes = active
    ? 'bg-brand-600 text-white border-brand-600'
    : 'bg-white text-ink-700 border-rule hover:border-brand-600 hover:text-brand-600'
  return html`<a href="${href}" ${active ? raw('aria-current="page"') : ''} class="inline-flex items-center min-h-11 px-4 rounded-md border font-mono text-[12px] tracking-[0.06em] uppercase no-underline transition-colors duration-150 ${classes}">${label}</a>`
}

export function equipmentListPage({ activeCategory }) {
  const active = categories.find((c) => c.id === activeCategory)?.id
  const shown = active ? equipment.filter((e) => e.category === active || e.alsoIn?.includes(active)) : equipment

  const filters = joinHtml(
    categories.map((c) => {
      const count = equipment.filter((e) => e.category === c.id || e.alsoIn?.includes(c.id)).length
      return html`
      <li class="flex items-center gap-1.5">
        ${filterChip(`/equipment?category=${c.id}`, `${c.label} ${count}`, active === c.id)}
        <a href="/contact?service=${serviceIdForCategory(c.id) || 'general'}" class="inline-flex items-center min-h-11 px-3 rounded-md border border-rule font-mono text-[11px] tracking-[0.06em] uppercase text-brand-800 no-underline hover:border-brand-600 hover:bg-paper-2">Enquire</a>
      </li>`
    }),
  )

  const cards = joinHtml(
    shown.map((item) => {
      const incomplete = item.specs.some((s) => s.flag?.kind === 'missing')
      return html`
      <li class="grow basis-[16.25rem] max-w-[23rem]">
        <a href="/equipment/${item.slug}" class="group h-full bg-white rounded-md p-6 flex flex-col gap-3 no-underline shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-[var(--shadow-hover)]">
          ${item.image ? html`<img src="${item.image.src}" alt="" width="${item.image.width}" height="${item.image.height}" class="-mx-6 -mt-6 rounded-t-md w-[calc(100%+3rem)] max-w-none aspect-[3/2] object-cover" />` : ''}
          <div class="flex items-start justify-between gap-3">
            <span class="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-400">${categories.find((c) => c.id === item.category)?.label || ''}</span>
            ${item.isAccredited ? html`<span class="font-mono text-[10px] tracking-[0.08em] text-brand-600 border border-brand-600 rounded-sm px-1.5 py-0.5 shrink-0">NABL</span>` : ''}
          </div>
          <h3 class="text-[19px] leading-tight">${item.name}</h3>
          ${item.make || item.model ? html`<p class="font-mono text-[12.5px] text-ink-500 m-0">${[item.make, item.model].filter(Boolean).join(' · ')}</p>` : ''}
          <p class="text-[14px] leading-snug text-ink-500 m-0">${item.summary}</p>
          ${item.standards.length > 0 ? standardList(item.standards.slice(0, 3)) : ''}
          ${incomplete ? html`<span class="font-mono text-[10px] tracking-[0.1em] uppercase text-warning">Specifications pending</span>` : ''}
          <span class="mt-auto pt-2 text-sm font-semibold text-brand-800 group-hover:underline underline-offset-4">View specification <span aria-hidden="true">→</span></span>
        </a>
      </li>`
    }),
  )

  return html`
    ${pageHero({
      eyebrow: 'Equipment catalogue',
      title: 'Every machine, with its specifications',
      subtitle: `${equipment.length} machines across prototype production, rapid prototyping, environmental testing, rubber and polymer testing, and metrology.`,
    })}
    <div class="bg-white border-b border-rule">
      ${container(html`
        <div class="py-5">
          <nav aria-label="Filter by category">
            <ul class="flex flex-wrap gap-2 list-none m-0 p-0">
              <li>${filterChip('/equipment', `All ${equipment.length}`, !active)}</li>
              ${filters}
            </ul>
          </nav>
        </div>
      `)}
    </div>
    ${section(html`
      <h2 class="sr-only">Equipment</h2>
      <ul class="flex flex-wrap justify-center gap-5 list-none m-0 p-0">${cards}</ul>
      ${shown.length === 0 ? html`<p class="text-ink-500">No machines in this category yet. <a href="/equipment" class="text-brand-800">View all equipment</a>.</p>` : ''}
    `)}
  `
}

export function equipmentDetailPage(item) {
  const category = categories.find((c) => c.id === item.category)
  const related = equipment.filter((e) => e.slug !== item.slug && e.category === item.category).slice(0, 3)

  const relatedSection =
    related.length > 0
      ? section(html`
          <h2 class="text-[22px]">Related equipment</h2>
          <ul class="mt-6 flex flex-wrap gap-4 list-none m-0 p-0">${joinHtml(
            related.map((r) => html`<li class="grow basis-[14rem] max-w-[18rem]"><a href="/equipment/${r.slug}" class="block bg-white rounded-md p-5 no-underline shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]"><span class="block font-display font-semibold text-[16px] text-brand-600">${r.name}</span><span class="block mt-1 text-[13px] text-ink-500">${r.summary}</span></a></li>`),
          )}</ul>
        `, { tone: 'white' })
      : ''

  return html`
    <div class="bg-white border-b border-rule">
      ${container(html`
        <div class="py-10 md:py-14">
          <nav aria-label="Breadcrumb" class="mb-4">
            <ol class="flex flex-wrap gap-1.5 list-none m-0 p-0 font-mono text-[11px] tracking-[0.08em] text-ink-400">
              <li><a href="/equipment" class="text-ink-400 no-underline hover:text-brand-800 hover:underline">Equipment</a></li>
              <li aria-hidden="true">/</li>
              <li><a href="/equipment?category=${item.category}" class="text-ink-400 no-underline hover:text-brand-800 hover:underline">${category?.label || ''}</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" class="text-ink-700">${item.name}</li>
            </ol>
          </nav>
          ${item.isAccredited ? html`<span class="font-mono text-[10.5px] tracking-[0.08em] text-brand-600 border border-brand-600 rounded-sm px-2 py-1">${site.accreditation.nabl}</span>` : ''}
          <h1 class="mt-2">${item.name}</h1>
          ${item.make || item.model ? html`<p class="mt-2 font-mono text-[15px] text-ink-500">${[item.make, item.model, item.machineType].filter(Boolean).join(' · ')}</p>` : ''}
          <p class="mt-4 text-[18px] text-ink-500 max-w-[58ch]">${item.summary}</p>
        </div>
      `)}
    </div>

    ${section(html`
      <h2 class="sr-only">Specification</h2>
      <div class="flex flex-col gap-8 lg:flex-row lg:items-start">
        ${item.image ? html`<img src="${item.image.src}" alt="${item.image.alt}" width="${item.image.width}" height="${item.image.height}" class="lg:w-[340px] lg:shrink-0 rounded-md object-cover" />` : ''}
        <div class="min-w-0 flex-1">${specTable(item.specs, 'Specification · as verified against source')}</div>
      </div>
      <div class="mt-6 border border-rule rounded-md bg-white p-6 shadow-[var(--shadow-card)]">
        <h3 class="text-[19px] m-0">Service rate</h3>
        <p class="mt-2 font-mono text-[24px] text-ink-900 tabular-nums m-0">Enquire for rate</p>
        <p class="mt-2 text-[14.5px] text-ink-500 m-0">Contact us for a quotation. <a href="/rate-card" class="text-brand-800">Full rate card</a>.</p>
      </div>
    `, { compact: true })}

    ${item.applications.length > 0 || item.standards.length > 0
      ? section(html`
          <div class="grid gap-10 md:grid-cols-2">
            ${item.applications.length > 0 ? html`<div><h2 class="text-[22px]">Applications</h2><ul class="mt-5 flex flex-col gap-2 list-none m-0 p-0">${joinHtml(item.applications.map((a) => html`<li class="relative pl-6 text-ink-700 text-[15px]"><span aria-hidden="true" class="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"></span>${a}</li>`))}</ul></div>` : ''}
            ${item.standards.length > 0 ? html`<div><h2 class="text-[22px]">Standards</h2><div class="mt-5">${standardList(item.standards)}</div></div>` : ''}
          </div>
        `, { tone: 'white', compact: true })
      : ''}

    ${relatedSection}

    ${section(html`
      <h2 class="text-[24px]">Enquire about the ${item.name}</h2>
      <p class="mt-3 text-ink-700">Tell us about your part or sample and we will confirm suitability, turnaround and cost.</p>
      <div class="mt-6 flex flex-wrap gap-3">${buttonLink(`/contact?service=${serviceIdForCategory(item.category) || 'general'}`, 'Send an enquiry')}${buttonLink(site.phone.href, `Call ${site.phone.display}`, { variant: 'secondary' })}</div>
    `, { tone: 'accent' })}
  `
}
