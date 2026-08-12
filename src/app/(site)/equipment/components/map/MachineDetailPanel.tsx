'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'
import { useFocusTrap } from '@/lib/useFocusTrap'
import { formatRupees } from '@/content/rates'
import { SpecTable, StandardList } from '@/components/ui/SpecTable'
import { ButtonLink } from '@/components/ui/Button'
import type { Equipment } from '@/lib/types'

/**
 * The machine detail panel.
 *
 * A side panel on a wide screen, a bottom sheet on a phone. Portalled to
 * `document.body` so it escapes the map's stacking and transform context —
 * a `position: fixed` child of a transformed ancestor is positioned against
 * that ancestor, not the viewport, and the map's parallax layer is
 * transformed.
 *
 * **Every section is conditional on real data.** The brief named
 * `description`, `capabilities` and `dimensions`; none of those fields exist
 * on `Equipment`. What exists is `summary`, `specs`, `applications`,
 * `standards`, `rate`, `make`, `model` and `machineType`, with coverage from
 * 8/30 (standards) to 30/30 (specs). So each block renders only when its
 * field is populated, and nothing is invented to fill a gap.
 *
 * `SpecTable` is reused rather than reimplemented, which is what carries the
 * corrected / verify / not-supplied provenance chips into the panel — 12 of
 * the 30 machines have at least one unsupplied spec and the panel must say so
 * rather than show a blank row.
 */
export function MachineDetailPanel({
  machine,
  categoryLabel,
  onClose,
}: {
  machine: Equipment | null
  categoryLabel: string
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => setMounted(true), [])

  // Mount at rest, then flip to the open state on the next frame so the
  // transition actually has two states to run between.
  useEffect(() => {
    if (!machine) {
      setShown(false)
      return
    }
    const raf = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(raf)
  }, [machine])

  useFocusTrap(panelRef, Boolean(machine), onClose)

  if (!mounted || !machine) return null

  const meta = [machine.make, machine.model, machine.machineType].filter(Boolean).join(' · ')
  const hasApplications = machine.applications.length > 0
  const hasStandards = machine.standards.length > 0

  // Sections arrive in order. The index drives the delay, so adding or
  // dropping a conditional block re-times the run rather than leaving a hole.
  let step = 0
  const stagger = () => ({ transitionDelay: `${90 + step++ * 55}ms` })
  const enter = 'transition-[opacity,transform] duration-400 ease-out'
  const entered = shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* The map dims but stays visible behind — the selected node keeps its
          halo, so closing returns you to a place you can still see. */}
      <button
        type="button"
        aria-label="Close machine details"
        onClick={onClose}
        className={cn(
          'absolute inset-0 w-full h-full cursor-default border-0',
          'bg-ink-900/35 backdrop-blur-[2px] transition-opacity duration-300',
          shown ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="machine-panel-title"
        tabIndex={-1}
        className={cn(
          'absolute bg-paper shadow-[var(--shadow-hover)] outline-none',
          'flex flex-col overflow-hidden',
          // Phone: bottom sheet, capped so the map stays visible above it.
          'inset-x-0 bottom-0 max-h-[88svh] rounded-t-lg border-t border-rule',
          // Wide: right-hand panel, full height.
          'md:inset-y-0 md:left-auto md:right-0 md:bottom-auto md:max-h-none',
          'md:w-[min(560px,50vw)] md:rounded-t-none md:rounded-l-lg md:border-t-0 md:border-l',
          'transition-transform duration-400 ease-out motion-reduce:transition-none',
          shown ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full',
        )}
      >
        {/* Grab handle, phone only. */}
        <span
          aria-hidden="true"
          className="md:hidden mx-auto mt-3 mb-1 block h-1 w-10 rounded-full bg-rule-strong/40 shrink-0"
        />

        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-rule shrink-0">
          <div className="min-w-0">
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-400">
              <span>{categoryLabel}</span>
              {machine.isAccredited && (
                <span className="text-brand-600 border border-brand-600 rounded-sm px-1.5 py-px">
                  NABL
                </span>
              )}
            </span>
            <h2
              id="machine-panel-title"
              className="mt-2 text-[clamp(19px,2.2vw,25px)] leading-tight m-0"
            >
              {machine.name}
            </h2>
            {meta && <p className="mt-1.5 font-mono text-[12.5px] text-ink-500 m-0">{meta}</p>}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 grid place-items-center size-11 -mr-2 -mt-1 rounded-full border border-rule bg-paper text-ink-500 hover:text-brand-600 hover:border-rule-strong transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" fill="none">
              <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 flex flex-col gap-7">
          {machine.image && (
            <div className={cn(enter, entered)} style={stagger()}>
              <div className="relative w-full aspect-[3/2] rounded-md overflow-hidden border border-rule bg-paper-2">
                <Image
                  src={machine.image.src}
                  alt={machine.image.alt}
                  fill
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <p className={cn('text-[15.5px] leading-relaxed text-ink-700 m-0', enter, entered)} style={stagger()}>
            {machine.summary}
          </p>

          <section className={cn(enter, entered)} style={stagger()}>
            <h3 className="text-solid label text-ink-500 m-0 mb-3">Specification</h3>
            <SpecTable specs={machine.specs} />
          </section>

          {hasApplications && (
            <section className={cn(enter, entered)} style={stagger()}>
              <h3 className="text-solid label text-ink-500 m-0 mb-3">Applications</h3>
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {machine.applications.map((a) => (
                  <li key={a} className="relative pl-5 text-[14.5px] text-ink-700">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.62em] w-2.5 h-px bg-rule-strong"
                    />
                    {a}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasStandards && (
            <section className={cn(enter, entered)} style={stagger()}>
              <h3 className="text-solid label text-ink-500 m-0 mb-3">Test standards</h3>
              <StandardList standards={machine.standards} />
            </section>
          )}

          {machine.rate && (
            <section
              className={cn('border border-rule rounded-md bg-white p-5', enter, entered)}
              style={stagger()}
            >
              <h3 className="text-solid label text-ink-500 m-0">Indicative rate</h3>
              <p className="mt-2 font-mono text-[19px] text-ink-900 tabular-nums m-0">
                {formatRupees(machine.rate.min)} – {formatRupees(machine.rate.max)}{' '}
                <span className="font-sans text-[13px] text-ink-500">
                  {machine.rate.uom.toLowerCase()}
                </span>
              </p>
              <p className="mt-2 text-[12.5px] text-ink-500 m-0">
                Core operation rate. The lower figure applies to MSMEs; MCCIA members
                receive a further 10% discount.
              </p>
            </section>
          )}
        </div>

        {/* The panel is a shortcut, not a replacement for the machine's own
            page. That page is the indexable one — the whole point of the
            rebuild was getting these 30 records out of a modal and onto URLs,
            so the modal must always hand you the URL. */}
        <div className="shrink-0 border-t border-rule px-6 py-4 flex flex-wrap items-center gap-3 bg-paper">
          <ButtonLink href={`/equipment/${machine.slug}`} size="sm">
            Full specification page
          </ButtonLink>
          <Link
            href={`/contact?machine=${machine.slug}`}
            className="text-[14px] font-semibold text-brand-800"
          >
            Enquire about this machine
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  )
}
