import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { showBuildNotes } from '@/lib/flags'
import type { ImageRef } from '@/lib/types'

/**
 * A photograph on the page.
 *
 * Framed the way every other surface on this site is framed — a hairline, a
 * small radius, no shadow at rest. The image is the content, so nothing is
 * drawn on top of it and nothing crops it to a fashionable ratio: `aspect`
 * is opt-in, and without it the frame takes the picture's own proportions.
 *
 * `needsPhotography` assets keep their `[NEEDS PHOTOGRAPHY]` tag from
 * DESIGN_DIRECTION.md §4 — a 500×333 asset from 2020 is shown at its own size
 * with the flag, never upscaled into looking like current photography. The tag
 * is project commentary rather than visitor copy, so it follows BuildNote and
 * is off in production.
 */
export function Figure({
  image,
  caption,
  aspect,
  fill = false,
  sizes = '(min-width: 768px) 50vw, 100vw',
  priority = false,
  className,
}: {
  image: ImageRef
  caption?: ReactNode
  /** e.g. `'16 / 9'`. Omit to keep the source proportions. */
  aspect?: string
  /**
   * Stretch to the height of whatever it sits beside instead of keeping the
   * source proportions — for a grid row where the photo should match a
   * sibling column's height rather than dictate its own. The caller supplies
   * that height (a `lg:items-stretch` grid row, typically); `Figure` just
   * fills it and crops.
   */
  fill?: boolean
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const flagged = image.needsPhotography && showBuildNotes

  return (
    <figure className={cn('m-0 flex flex-col gap-2.5', fill && 'h-full', className)}>
      <div
        className={cn(
          'relative overflow-hidden rounded-md border border-rule bg-paper-2',
          fill && 'flex-1',
        )}
      >
        <Image
          src={image.src}
          alt={image.alt}
          {...(fill
            ? { fill: true as const }
            : { width: image.width ?? 1200, height: image.height ?? 800 })}
          sizes={sizes}
          priority={priority}
          className={cn(fill ? 'object-cover' : 'block w-full h-auto', aspect && 'object-cover')}
          style={aspect && !fill ? { aspectRatio: aspect } : undefined}
        />
        {flagged && (
          <span className="absolute left-2 top-2 font-mono text-[9.5px] tracking-[0.1em] uppercase bg-flag-warn-bg text-flag-warn-fg border border-flag-warn-edge rounded-sm px-1.5 py-0.5">
            Needs photography
          </span>
        )}
      </div>
      {caption && (
        <figcaption className="text-[13px] leading-snug text-ink-500">{caption}</figcaption>
      )}
    </figure>
  )
}

/**
 * The image half of a card, above the card's own padding.
 *
 * Kept separate from `Figure` because a card thumbnail is not a figure: it has
 * no caption, it is cropped to a common ratio so a grid of them lines up, and
 * it never carries the pending-photography tag — twenty of those stacked down
 * the equipment catalogue would be the loudest thing on the page.
 */
export function CardImage({
  image,
  aspect = '3 / 2',
  sizes = '(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 100vw',
  bleed = '-mx-7 -mt-7 sm:-mx-8 sm:-mt-8 rounded-t-lg',
}: {
  image: ImageRef
  aspect?: string
  sizes?: string
  /**
   * Negative margins that pull the image out to the card's edge, plus the
   * radius that matches the card it is sitting in. Cards on this site do not
   * share one padding — the service card is `p-7 sm:p-8`, the catalogue card
   * `p-6` — and an image that is bled by the wrong amount leaves a visible
   * sliver of card on three sides.
   */
  bleed?: string
}) {
  return (
    <div
      className={cn('relative overflow-hidden border-b border-rule bg-paper-2 mb-1', bleed)}
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  )
}
