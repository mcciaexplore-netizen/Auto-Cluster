import { html, joinHtml, raw } from '../lib/html.js'

/** Mirrors src/components/ui/Section.tsx's <Container>. */
export function container(inner, extraClass = '') {
  return html`<div class="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] ${extraClass}">${inner}</div>`
}

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 font-semibold leading-none rounded-full ' +
  'no-underline cursor-pointer transition-[background-color,border-color,transform] duration-200 ease-out ' +
  'active:translate-y-px motion-reduce:active:translate-y-0 min-h-11'

const BUTTON_VARIANTS = {
  primary:
    'gradient-edge text-white shadow-[var(--shadow-card)] [--edge-fill:var(--color-logo-indigo)] ' +
    'hover:[--edge-fill:#2b256a] active:[--edge-fill:#2b256a]',
  secondary: 'bg-white text-brand-600 border border-rule shadow-[var(--shadow-card)] hover:border-rule-strong hover:bg-paper-2',
  ghost: 'bg-transparent text-brand-600 border border-transparent hover:bg-paper-2',
}

const BUTTON_SIZES = { sm: 'text-sm px-6 py-2.5', md: 'text-[15px] px-8 py-3.5' }

/** Mirrors src/components/ui/Button.tsx's <ButtonLink>. */
export function buttonLink(href, label, { variant = 'primary', size = 'md', className = '' } = {}) {
  return html`<a href="${href}" class="${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}">${label}</a>`
}

/** Mirrors src/components/ui/Section.tsx's <PageHero> — the eyebrow/title/subtitle band at the top of every inner page. */
export function pageHero({ eyebrow, title, subtitle, actions = '' }) {
  return html`
    <div class="bg-white border-b border-rule">
      ${container(html`
        <div class="py-12 lg:py-16 max-w-[66ch]">
          ${eyebrow ? html`<p class="label mb-3">${eyebrow}</p>` : ''}
          <h1>${title}</h1>
          ${subtitle ? html`<p class="mt-5 text-lg text-ink-700">${subtitle}</p>` : ''}
          ${actions ? html`<div class="flex flex-wrap gap-3 mt-7">${actions}</div>` : ''}
        </div>
      `)}
    </div>`
}

/** Mirrors src/components/ui/Section.tsx's <Section>. */
export function section(inner, { tone = 'paper', border = true, compact = false, id = '' } = {}) {
  const backgrounds = { paper: 'bg-paper', white: 'bg-white', accent: 'bg-paper-2', glow: 'section-glow' }
  const borders = {
    paper: 'border-b border-rule',
    white: 'border-b border-rule',
    accent: 'border-y-2 border-rule',
    glow: 'border-b border-rule',
  }
  const padY = compact ? 'py-8 lg:py-10' : 'py-14 lg:py-20'
  const classes = `${backgrounds[tone]} ${border ? borders[tone] : ''}`
  return html`<section ${id ? raw(`id="${id}"`) : ''} class="${classes}">${container(html`<div class="${padY}">${inner}</div>`)}</section>`
}

/** Mirrors src/components/ui/SpecTable.tsx's <StandardChip>/<StandardList>. */
export function standardList(standards) {
  if (!standards || standards.length === 0) return ''
  const chips = joinHtml(
    standards.map((s) => html`<li><code class="font-mono text-[11px] bg-paper-2 border border-rule rounded-sm px-1.5 py-1 text-ink-700">${s}</code></li>`),
  )
  return html`<ul class="flex flex-wrap gap-1.5 list-none p-0 m-0">${chips}</ul>`
}

/**
 * Mirrors src/components/ui/SpecTable.tsx's <SpecTable> — post the
 * "remove CORRECTED/VERIFY/NOT SUPPLIED chips" change from this same
 * conversation, so there is no flag-badge rendering here either.
 */
export function specTable(specs, caption = '') {
  const rows = joinHtml(
    specs.map(
      (spec) => html`
      <tr class="border-b border-rule last:border-b-0">
        <th scope="row" class="font-mono text-[13px] font-medium tracking-[0.1em] uppercase text-ink-400 text-left align-top w-[38%] py-4 pr-4 normal-nums">${spec.label}</th>
        <td class="align-top py-4 tabular-nums text-ink-900">
          ${spec.value
            ? html`<span class="font-mono text-[17px] leading-relaxed">${spec.value}${spec.unit ? html`<span class="ml-2 font-sans text-[14.5px] text-ink-500 normal-nums">${spec.unit}</span>` : ''}</span>`
            : ''}
        </td>
      </tr>`,
    ),
  )
  return html`
    <div class="overflow-x-auto max-w-[54rem]">
      <table class="w-full border-collapse text-[17px]">
        ${caption ? html`<caption class="font-mono text-[13px] font-medium tracking-[0.14em] uppercase text-ink-400 caption-top text-left pb-3 border-b-2 border-brand-900">${caption}</caption>` : ''}
        <tbody>${rows}</tbody>
      </table>
    </div>`
}

/** Mirrors src/components/ui/Card.tsx's <ServiceCard> + <LinkCard>. */
export function serviceCard({ href, title, description, eyebrow = '', badge = '', data = [], image = null, cta = 'View facility' }) {
  const dataRow =
    data.length > 0
      ? html`<dl class="flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4 m-0">${joinHtml(
          data.map(
            (d) => html`<div class="flex flex-col gap-0.5"><dt class="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-400">${d.label}</dt><dd class="font-display font-semibold text-[17px] text-ink-900 tabular-nums m-0">${d.value}</dd></div>`,
          ),
        )}</dl>`
      : ''
  return html`
    <a href="${href}" class="group relative isolate bg-paper rounded-md border border-rule p-7 sm:p-8 flex flex-col gap-4 no-underline shadow-[var(--shadow-card)] transition-transform duration-200 ease-out hover:-translate-y-0.5 h-full">
      ${image ? html`<img src="${image.src}" alt="" width="${image.width}" height="${image.height}" class="-mx-7 -mt-7 sm:-mx-8 sm:-mt-8 rounded-t-md w-[calc(100%+3.5rem)] sm:w-[calc(100%+4rem)] max-w-none aspect-[4/3] object-cover" />` : ''}
      ${eyebrow ? html`<span class="self-start inline-flex items-center font-mono text-[10px] tracking-[0.12em] uppercase text-brand-600 bg-brand-50 border border-brand-600/20 rounded-full px-2.5 py-1">${eyebrow}</span>` : ''}
      <div class="flex items-start justify-between gap-3 min-h-[3.25rem]">
        <h3 class="text-[20px] leading-tight line-clamp-2">${title}</h3>
        ${badge ? html`<span class="font-mono text-[10.5px] tracking-[0.08em] text-brand-600 border border-brand-600 rounded-sm px-1.5 py-1 whitespace-nowrap shrink-0">${badge}</span>` : ''}
      </div>
      <p class="text-[14.5px] leading-snug text-ink-500 m-0 min-h-[3.75rem] line-clamp-3">${description}</p>
      ${dataRow}
      <span class="mt-auto pt-2 text-[14.5px] font-semibold text-brand-800 group-hover:underline underline-offset-4">${cta} <span aria-hidden="true">→</span></span>
    </a>`
}

/** A bulleted list with the site's small dash marker — used across facility/venue pages for industries, capabilities, projects. */
export function dashList(items, { maxWidth = '' } = {}) {
  const lis = joinHtml(
    items.map((i) => html`<li class="relative pl-6 text-ink-700 text-[15px] ${maxWidth}"><span aria-hidden="true" class="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"></span>${i}</li>`),
  )
  return html`<ul class="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3 list-none m-0 p-0">${lis}</ul>`
}
