import { html, joinHtml } from '../../lib/html.js'
import { pageHero, section, serviceCard, buttonLink } from '../components.js'
import { venues } from '../../content/venues.js'
import { exhibitionBanner, venuePhotos } from '../../content/images.js'
import { site } from '../../content/site.js'

export function venuesListPage() {
  const cards = joinHtml(
    venues.map(
      (v) => html`<li>${serviceCard({
        href: `/venues/${v.slug}`,
        title: v.name,
        description: v.summary,
        image: venuePhotos[v.slug],
        data: v.highlights.filter((h) => h.value).slice(0, 2).map((h) => ({ label: h.label, value: h.value })),
        cta: 'View venue',
      })}</li>`,
    ),
  )

  return html`
    ${pageHero({
      eyebrow: 'Venues',
      title: 'Exhibition halls, auditorium and training rooms',
      subtitle: 'More than 100 industrial exhibitions hosted over ten years, on a permanent site designed to international guidelines.',
    })}
    <div class="border-b border-rule bg-paper-2">
      <img src="${exhibitionBanner.src}" alt="${exhibitionBanner.alt}" width="${exhibitionBanner.width}" height="${exhibitionBanner.height}" class="block w-full h-auto max-h-[380px] object-cover" />
    </div>
    ${section(html`<h2 class="sr-only">All venues</h2><ul class="card-grid gap-5 list-none m-0 p-0">${cards}</ul>`)}
  `
}

function emptyState(title, body) {
  return html`<div class="bg-paper-2/60 border border-dashed border-rule-strong rounded-md p-6 flex flex-col gap-3"><h3 class="text-solid text-ink-500 text-[19px] m-0">${title}</h3><p class="text-[14px] text-ink-500 m-0">${body}</p></div>`
}

export function venueDetailPage(venue) {
  const photo = venuePhotos[venue.slug]
  const highlights = joinHtml(
    venue.highlights.map(
      (h) => html`<li class="border border-rule rounded-md bg-white p-5"><span class="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-400 block">${h.value ? h.label : 'Included'}</span><span class="font-display font-semibold text-[18px] text-ink-900 block mt-1.5 tabular-nums">${h.value || h.label}</span></li>`,
    ),
  )

  return html`
    ${pageHero({
      eyebrow: 'Venue',
      title: venue.h1,
      subtitle: venue.h2,
      actions: html`${buttonLink(`/venues/book?venue=${venue.slug}`, 'Request a booking')}${buttonLink('/rate-card', 'Rate card', { variant: 'secondary' })}`,
    })}

    ${section(html`
      <h2>${venue.name}</h2>
      <div class="mt-5 grid gap-8 lg:grid-cols-[1fr_minmax(0,590px)] lg:items-stretch">
        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-4 text-ink-700">${joinHtml(venue.intro.map((p) => html`<p>${p}</p>`))}</div>
          <ul class="grid gap-4 sm:grid-cols-2 list-none m-0 p-0">${highlights}</ul>
        </div>
        ${photo ? html`<img src="${photo.src}" alt="${photo.alt}" width="${photo.width}" height="${photo.height}" class="w-full h-full object-cover rounded-md" />` : ''}
      </div>
    `, { tone: 'white' })}

    ${section(html`
      <h2 class="text-[22px]">Plan your visit</h2>
      <div class="mt-5 card-grid gap-4">
        ${emptyState('Guidelines and rules', 'Request the room rules, access arrangements and booking terms with your enquiry. The venue team will share the applicable documents directly.')}
        ${emptyState('Floor plan', 'Request a floor plan or stall layout with your booking. The venue team shares these privately to help you plan the space.')}
        ${emptyState('Wi-Fi and parking', venue.slug === 'exhibition-centre' ? 'Dedicated visitor parking is listed for the Exhibition Centre. Request Wi-Fi and parking arrangements for your event when booking.' : 'Tell us your Wi-Fi and parking requirements. The venue team will confirm availability and arrangements for your room.')}
      </div>
    `, { tone: 'white' })}

    ${section(html`
      <h2 class="text-[24px]">Request a booking</h2>
      <p class="mt-3 text-ink-700">Send us your dates and requirements. We confirm availability and cost by return.</p>
      <div class="mt-6 flex flex-wrap gap-3">${buttonLink(`/venues/book?venue=${venue.slug}`, 'Request a booking')}${buttonLink(site.phone.href, `Call ${site.phone.display}`, { variant: 'secondary' })}</div>
    `, { tone: 'accent' })}
  `
}
