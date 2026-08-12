'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { logo, mainNav, site } from '@/content/site'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Section'
import { cn } from '@/lib/cn'
import type { NavItem } from '@/lib/types'

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
    <header className="sticky top-0 z-50 bg-white text-ink-700 border-b border-rule">
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
            {mainNav.slice(0, 6).map((item) => (
              <li key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="block py-2 text-[14.5px] text-ink-700 no-underline hover:text-brand-800"
                >
                  {item.label}
                </Link>

                {item.children && (
                  <div
                    className={cn(
                      'absolute left-0 top-full pt-2 w-[320px] invisible opacity-0',
                      'group-hover:visible group-hover:opacity-100',
                      'group-focus-within:visible group-focus-within:opacity-100',
                      'transition-opacity duration-150',
                    )}
                  >
                    <ul className="bg-white border border-rule rounded-md shadow-[var(--shadow-hover)] p-2 list-none m-0">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-3 py-2.5 rounded-sm no-underline hover:bg-paper-2"
                          >
                            <span className="block text-[14.5px] font-semibold text-brand-600">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="block text-[12.5px] leading-snug text-ink-500 mt-0.5">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
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
