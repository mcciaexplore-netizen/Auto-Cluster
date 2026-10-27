import { html, joinHtml, raw } from '../lib/html.js'
import { container } from './components.js'
import { footerNav, legalNav, logo, mainNav, promoters, site } from '../content/site.js'

function headerNavItem(item) {
  if (!item.children) {
    return html`<li><a href="${item.href}" class="block py-2 text-[14.5px] text-ink-700 no-underline hover:text-brand-800">${item.label}</a></li>`
  }
  const children = joinHtml(
    item.children.map(
      (c) => html`<li><a href="${c.href}" class="block px-3 py-2 text-[14px] text-ink-700 no-underline hover:bg-paper-2 hover:text-brand-800 rounded-sm">${c.label}</a></li>`,
    ),
  )
  return html`
    <li class="relative group">
      <a href="${item.href}" class="block py-2 text-[14.5px] text-ink-700 no-underline hover:text-brand-800">${item.label}</a>
      <div class="absolute left-0 top-full pt-2 w-[260px] invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity duration-150">
        <ul class="list-none m-0 p-2 bg-white border border-rule rounded-md shadow-[var(--shadow-hover)]">${children}</ul>
      </div>
    </li>`
}

function mobileNavItem(item) {
  if (!item.children) {
    return html`<li class="border-b border-rule"><a href="${item.href}" class="block py-3.5 text-[15px] text-brand-800 no-underline">${item.label}</a></li>`
  }
  const children = joinHtml(
    item.children.map((c) => html`<li><a href="${c.href}" class="block py-2.5 pl-4 text-[14px] text-ink-700 no-underline hover:text-brand-800">${c.label}</a></li>`),
  )
  return html`
    <li class="border-b border-rule">
      <details>
        <summary class="flex items-center justify-between py-3.5 text-[15px] text-brand-800 cursor-pointer list-none">
          ${item.label}
          <span aria-hidden="true" class="text-ink-400">+</span>
        </summary>
        <ul class="list-none m-0 pb-3 flex flex-col">${children}</ul>
      </details>
    </li>`
}

function header() {
  const desktopItems = joinHtml(mainNav.slice(0, 7).map(headerNavItem))
  const mobileItems = joinHtml(mainNav.map(mobileNavItem))

  return html`
    <header class="sticky top-0 z-50 bg-white text-ink-700">
      ${container(html`
        <div class="flex items-center gap-6 py-3.5">
          <a href="/" class="shrink-0" aria-label="${site.name} — home">
            <img src="${logo.src}" alt="${site.name}" width="${logo.width}" height="${logo.height}" class="w-28 h-auto" />
          </a>

          <nav aria-label="Main" class="hidden xl:block">
            <ul class="flex items-center gap-6 list-none m-0 p-0">${desktopItems}</ul>
          </nav>

          <div class="ml-auto flex items-center gap-3">
            <a href="/contact" class="hidden sm:inline-flex items-center justify-center gap-2 font-semibold leading-none rounded-full no-underline min-h-11 text-sm px-6 py-2.5 gradient-edge text-white shadow-[var(--shadow-card)] [--edge-fill:var(--color-logo-indigo)] hover:[--edge-fill:#2b256a]">Enquire</a>
            <button type="button" data-nav-toggle class="xl:hidden inline-flex items-center justify-center size-11 rounded-md border border-rule-strong text-brand-800" aria-expanded="false" aria-controls="mobile-nav">
              <span class="sr-only">Open menu</span>
              <span aria-hidden="true" class="text-lg leading-none" data-nav-icon>☰</span>
            </button>
          </div>
        </div>
      `)}

      <div id="mobile-nav" data-nav-panel hidden class="xl:hidden border-t border-rule max-h-[75vh] overflow-y-auto">
        ${container(html`
          <div class="py-4">
            <nav aria-label="Mobile"><ul class="list-none m-0 p-0 flex flex-col">${mobileItems}</ul></nav>
            <div class="mt-5 pt-5 border-t border-rule flex flex-col gap-3">
              <a href="/contact" class="inline-flex items-center justify-center gap-2 font-semibold leading-none rounded-full no-underline min-h-11 text-[15px] px-8 py-3.5 gradient-edge text-white shadow-[var(--shadow-card)] [--edge-fill:var(--color-logo-indigo)]">Send an enquiry</a>
              <a href="${site.phone.href}" class="font-mono text-[13px] text-ink-500 hover:text-brand-800">Call ${site.phone.display}</a>
            </div>
          </div>
        `)}
      </div>
    </header>`
}

function footerColumn(col) {
  const items = joinHtml(
    col.items.map(
      (item) => html`<li><a href="${item.href}" class="text-[14.5px] text-ink-700 no-underline hover:text-brand-800 hover:underline underline-offset-4">${item.label}</a></li>`,
    ),
  )
  return html`
    <nav aria-label="${col.heading}">
      <h2 class="text-solid font-mono text-[11.5px] font-medium tracking-[0.14em] uppercase text-brand-400 mb-4">${col.heading}</h2>
      <ul class="list-none m-0 p-0 flex flex-col gap-2.5">${items}</ul>
    </nav>`
}

function footer() {
  const { address } = site
  const columns = joinHtml(footerNav.map(footerColumn))
  const promoterItems = joinHtml(
    promoters.map((p) => html`<li><img src="${p.src}" alt="${p.alt}" width="${p.width}" height="${p.height}" loading="lazy" class="h-10 w-auto object-contain" /></li>`),
  )
  const legalItems = joinHtml(legalNav.map((item) => html`<a href="${item.href}">${item.label}</a>`))

  return html`
    <footer class="bg-white border-t border-rule text-ink-700">
      ${container(html`
        <div class="py-12">
          <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            ${columns}
            <div>
              <h2 class="text-solid font-mono text-[11.5px] font-medium tracking-[0.14em] uppercase text-brand-400 mb-4">Contact</h2>
              <address class="not-italic text-[14.5px] leading-relaxed text-ink-700">
                ${address.organisation}<br />${address.lines.join(', ')}<br />${address.city} – ${address.postalCode}<br />${address.region}, ${address.country}
              </address>
              <div class="mt-4 flex flex-col gap-2 text-[14.5px]">
                <a href="${site.phone.href}" class="text-brand-800 font-semibold no-underline hover:underline">${site.phone.display}</a>
                <a href="mailto:${site.email.marketing}" class="text-ink-700 no-underline hover:text-brand-800 hover:underline">${site.email.marketing}</a>
                <a href="mailto:${site.email.info}" class="text-ink-700 no-underline hover:text-brand-800 hover:underline">${site.email.info}</a>
              </div>
            </div>
          </div>

          <div class="mt-10 pt-6 border-t border-rule flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <h2 class="text-solid font-mono text-[11.5px] font-medium tracking-[0.14em] uppercase text-ink-400">Promoted and supported by</h2>
            <ul class="grid grid-cols-2 gap-x-10 gap-y-5 list-none m-0 p-0 lg:justify-items-end">${promoterItems}</ul>
          </div>
          <nav aria-label="Website policies" class="mt-8 pt-5 border-t border-rule flex flex-wrap gap-x-6 gap-y-3 text-sm">${legalItems}</nav>
        </div>
      `)}
    </footer>`
}

/**
 * The full HTML document. `title`/`description` are per-page metadata;
 * `body` is the already-rendered page content (header/footer wrap it here
 * so every page template only has to write its own middle section).
 */
export function layout({ title, description, body }) {
  const pageTitle = title ? `${title} | ${site.shortName}` : site.name
  return html`<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>
  <meta name="description" content="${description || site.tagline}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Poppins:wght@500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/css/styles.css" />
  <script>document.documentElement.classList.add('js')</script>
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  ${raw(header())}
  <main id="main">${body}</main>
  ${raw(footer())}
  <script type="module" src="/js/main.js"></script>
</body>
</html>`
}
