'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { logo, mainNav, site } from '@/content/site'
import { categories as equipmentCategories } from '@/content/equipment'
import { aboutPhotos, venuePhotos } from '@/content/images'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Section'
import { cn } from '@/lib/cn'
import type { ImageRef, NavItem } from '@/lib/types'

type MegaItem = { label: string; href: string; image?: ImageRef }

/** The slug at the end of a href — `/facilities/design-centre` → `design-centre`. */
function slugFromHref(href: string): string {
  return href.split('/').filter(Boolean).pop() ?? ''
}

function buildMegaItems(
  children: NavItem[],
  imageFor: (child: NavItem) => ImageRef | undefined,
): MegaItem[] {
  return children.map((c) => ({ label: c.label, href: c.href, image: imageFor(c) }))
}

const venuesNav = mainNav.find((i) => i.href === '/venues')
const aboutNav = mainNav.find((i) => i.href === '/about')
const lifeNav = mainNav.find((i) => i.href === '/life-at-auto-cluster')

const equipmentMegaItems: MegaItem[] = equipmentCategories.map((c) => ({
  label: c.label,
  href: `/equipment?category=${c.id}`,
  image: c.image,
}))

/* Only the three venues with their own photograph; Book a venue and Rate
   card are actions, not spaces, and were never photographed as one. */
const venuesMegaItems: MegaItem[] = buildMegaItems(venuesNav?.children ?? [], (c) =>
  venuePhotos[slugFromHref(c.href)],
)

/* About's children are anchors on one page, not separate destinations, and
   only two have anything to show a picture of. */
const aboutMegaItems: MegaItem[] = buildMegaItems(aboutNav?.children ?? [], (c) => {
  if (c.href.endsWith('#team')) return aboutPhotos.team
  if (c.href.endsWith('#certifications')) return aboutPhotos.isoCertificate
  return undefined
})

/* No photography exists for this section at all — the staff photo used on
   /about is the closest thing the library has to "life at Auto Cluster",
   so every child shares it rather than the panel going blank. */
const lifeMegaItems: MegaItem[] = buildMegaItems(lifeNav?.children ?? [], () => aboutPhotos.team)

const megaMenus: Record<string, { items: MegaItem[]; viewAllLabel: string }> = {
  '/equipment': { items: equipmentMegaItems, viewAllLabel: 'View all machines' },
  '/venues': { items: venuesMegaItems, viewAllLabel: 'View all venues' },
  '/about': { items: aboutMegaItems, viewAllLabel: 'View full page' },
  '/life-at-auto-cluster': { items: lifeMegaItems, viewAllLabel: 'View full page' },
}

/**
 * Sticky dark header with a two-level mega nav on desktop and a full-screen
 * drawer on mobile.
 *
 * Every item resolves — the `Href` type makes `#` a compile error. Seven
 * navigation items are dead links on the current site.
 */
export function Header() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    /* The contact strip that used to sit above this now closes the page,
       below the footer — see components/layout/ContactBar.tsx. */
    <header className="sticky top-0 z-50 bg-white text-ink-700">
      <Container className="flex items-center gap-6 py-3.5">
        <Link href="/" className="shrink-0" aria-label={`${site.name} — home`}>
          {/* The masthead sits in a sticky bar on every page, so it is the
              first thing painted. Hot-linking it from the WordPress install
              put a cross-origin round-trip on that critical path. */}
          <Image
            src={logo.src}
            alt={site.name}
            width={logo.width}
            height={logo.height}
            priority
            className="w-28 h-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {mainNav.slice(0, 6).map((item) => {
              const mega = megaMenus[item.href]
              return (
                <li key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className="block py-2 text-[14.5px] text-ink-700 no-underline hover:text-brand-800"
                  >
                    {item.label}
                  </Link>

                  {mega && (
                    <NavMegaMenu
                      items={mega.items}
                      viewAllHref={item.href}
                      viewAllLabel={mega.viewAllLabel}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
            Enquire
          </ButtonLink>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center size-11 rounded-md border border-rule-strong text-brand-800"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span aria-hidden="true" className="text-lg leading-none">
              {open ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </Container>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-rule max-h-[75vh] overflow-y-auto"
        >
          <Container className="py-4">
            <nav aria-label="Mobile">
              <ul className="list-none m-0 p-0 flex flex-col">
                {mainNav.map((item) => (
                  <MobileNavItem
                    key={item.href}
                    item={item}
                    expanded={expanded === item.href}
                    onToggle={() =>
                      setExpanded((cur) => (cur === item.href ? null : item.href))
                    }
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </ul>
            </nav>

            <div className="mt-5 pt-5 border-t border-rule flex flex-col gap-3">
              <ButtonLink href="/contact" onClick={() => setOpen(false)}>
                Send an enquiry
              </ButtonLink>
              <a
                href={site.phone.href}
                className="font-mono text-[13px] text-ink-500 hover:text-brand-800"
              >
                Call {site.phone.display}
              </a>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}

function MobileNavItem({
  item,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: NavItem
  expanded: boolean
  onToggle: () => void
  onNavigate: () => void
}) {
  return (
    <li className="border-b border-rule last:border-b-0">
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          className="flex-1 py-3.5 text-[15px] text-brand-800 no-underline"
        >
          {item.label}
        </Link>
        {item.children && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="size-11 shrink-0 text-ink-500 hover:text-brand-800"
          >
            <span className="sr-only">
              {expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
            </span>
            <span aria-hidden="true">{expanded ? '−' : '+'}</span>
          </button>
        )}
      </div>

      {item.children && expanded && (
        <ul className="list-none m-0 pb-3 pl-4 flex flex-col">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className="block py-2.5 text-[14px] text-ink-700 no-underline hover:text-brand-800"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/**
 * A navbar item's mega-menu dropdown — every child on the left, the hovered
 * (or focused) one's illustration on the right. Shared by every top-level
 * item that has one; each section supplies its own `items`, built above
 * from whatever imagery actually exists for it.
 *
 * A child with no image (Facilities' Skill Development and NABL Scope,
 * for instance) still highlights on hover — `hoveredHref` tracks that
 * regardless — but `activeImage` only updates when the hovered child
 * actually has one, so the panel keeps showing the last real image
 * instead of going blank.
 */
function NavMegaMenu({
  items,
  viewAllHref,
  viewAllLabel,
}: {
  items: MegaItem[]
  viewAllHref: string
  viewAllLabel: string
}) {
  const firstWithImage = items.find((i) => i.image) ?? items[0]
  const [hoveredHref, setHoveredHref] = useState(firstWithImage.href)
  const [activeImage, setActiveImage] = useState(firstWithImage.image)

  const handleEnter = (item: MegaItem) => {
    setHoveredHref(item.href)
    if (item.image) setActiveImage(item.image)
  }

  return (
    <div
      className={cn(
        'absolute left-0 top-full pt-2 w-[640px] invisible opacity-0',
        'group-hover:visible group-hover:opacity-100',
        'group-focus-within:visible group-focus-within:opacity-100',
        'transition-opacity duration-150',
      )}
    >
      <div className="flex bg-white border border-rule rounded-md shadow-[var(--shadow-hover)] overflow-hidden">
        <ul className="w-[280px] shrink-0 border-r border-rule p-2 list-none m-0 flex flex-col">
          {items.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onMouseEnter={() => handleEnter(item)}
                onFocus={() => handleEnter(item)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-sm no-underline',
                  hoveredHref === item.href ? 'bg-paper-2' : 'hover:bg-paper-2',
                )}
              >
                <span className="font-mono text-[10.5px] text-ink-400 tabular-nums shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[14.5px] font-semibold text-brand-600">{item.label}</span>
              </Link>
            </li>
          ))}

          <li className="mt-1 pt-2 border-t border-rule">
            <Link
              href={viewAllHref}
              className="block px-3 py-2 text-[13px] font-semibold text-brand-800 no-underline hover:underline underline-offset-4"
            >
              {viewAllLabel} →
            </Link>
          </li>
        </ul>

        <div className="relative flex-1 min-h-[280px] bg-paper-2">
          {activeImage && (
            <Image
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="360px"
              className="object-contain p-8"
            />
          )}
        </div>
      </div>
    </div>
  )
}
