'use client'

import { useEffect, type RefObject } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Traps focus inside an open dialog, and gives it back on close.
 *
 * The project has no dialog primitive to reuse — there is no Radix, no
 * Headless UI, and the only `<details>` on the site is an accordion — so the
 * behaviour WCAG 2.4.3 and 2.1.2 ask for is implemented here once.
 *
 *   - focus moves into the panel on open
 *   - Tab and Shift+Tab cycle within it
 *   - Escape closes
 *   - focus returns to whatever opened it, which on this map is the machine
 *     node, so the user lands back exactly where they were on the route
 *   - the page behind cannot scroll, and does not shift when its scrollbar
 *     is removed
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return
    const panel = ref.current
    if (!panel) return

    const returnTo = document.activeElement as HTMLElement | null

    // Replacing the scrollbar's width with padding keeps the page from
    // jumping sideways as it locks — the map is mid-scroll behind this and a
    // horizontal lurch is exactly the disorientation the panel must avoid.
    const { body } = document
    const gap = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )

    // Focus the panel itself rather than its first control: a screen reader
    // then announces the machine's name before the close button.
    panel.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
      returnTo?.focus?.({ preventScroll: true })
    }
  }, [open, onClose, ref])
}
