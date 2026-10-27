import { html } from '../lib/html.js'

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
  return html`<section ${id ? `id="${id}"` : ''} class="${classes}">${container(html`<div class="${padY}">${inner}</div>`)}</section>`
}
