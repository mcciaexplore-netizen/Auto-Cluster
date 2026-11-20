import Image from 'next/image'
import { credentials, promoters, site } from '@/content/site'
import { primaryFacilities } from '@/content/facilities'
import { venues } from '@/content/venues'
import { categories, equipment, getEquipmentByCategory } from '@/content/equipment'
import { ctaBadges, heroCollage, serviceTiles, venuePhotos } from '@/content/images'
import { Container, Section, Stat } from '@/components/ui/Section'
import { ServiceCard } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/motion/Reveal'
import styles from './home.module.css'

/**
 * Home.
 *
 * The hero answers "what is this place" in one line and routes three
 * different visitors in one glance. The credential strip carries only figures
 * ACDRI can evidence — the current site's five animated counters all render
 * `1 +` and stay off the page until real numbers arrive (CQ-57).
 */

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      {/* Sized to its own content, not to a viewport-height minimum. It
          used to carry a `min-h-[82svh]`-ish floor so a short copy+image
          pairing wouldn't look like a mere banner, but now that the
          promoted-by strip lives inside this same band too, the combined
          content is tall enough on its own — the old floor just forced a
          dead band of extra height below it (worse the taller the
          viewport, since the floor is viewport-relative and the content
          isn't) before the next section began. */}
      <div className={`${styles.home} bg-white flex flex-col`}>
        <Container className="w-full py-8 lg:py-5 flex-1">
          {/* Two columns on request: copy on the left, the collage on the
              right, rather than one centred column. Below `lg` there isn't
              room for both side by side, so it stacks — copy first, image
              second, same reading order as the two-column version, and
              `lg:h-full` drops out so the stack just flows at its own
              height the way any other stacked section does.

              Column 1 is `auto`, not a fixed fraction: the copy is already
              capped by its own `max-w-[22ch]`/`max-w-[46ch]`, so a fixed
              `3fr` share only matters once the container is wider than
              that cap — and since `--page-max` is `none` (this Container
              runs edge-to-edge on wide viewports), `3fr` of the full window
              width blows way past the copy's own cap, leaving a dead gap
              of empty track between the copy and the image. `auto` sizes
              the column to its (capped) content instead, so the image
              column starts right after the text at any viewport width. */}
          <div className="grid lg:grid-cols-[auto_1fr] gap-12 xl:gap-16 lg:h-full">
            <Reveal
              stagger
              className="flex flex-col items-start text-left lg:h-full lg:justify-center"
            >
              {/* The base h1 rule sizes against the full viewport (5.1vw), but
                  from `lg` this heading sits in a column only half that
                  width — at common laptop widths (~1024-1500px) that mismatch
                  wrapped it across 4-5 short lines instead of 2-3, pushing
                  the CTA below the fold. Below `lg` the column is full width
                  again, so the base clamp is kept there. */}
              <h1 className="max-w-[22ch] lg:text-[clamp(34px,3.0vw,60px)]">
                {site.tagline}
              </h1>

              <p className="font-poppins text-[13px] font-medium tracking-[0.1em] uppercase text-brand-400 mt-3 max-w-none">
                Promoted by Govt. of India · PCMC · Govt. of Maharashtra · MCCIA initiative
              </p>

              <p className="mt-2 text-[clamp(16px,1.2vw,20px)] leading-relaxed text-ink-700 max-w-[46ch]">
                In the Chinchwad–Talegaon–Chakan automotive belt of Pune, ACDRI gives small and
                medium enterprises access to the validation, machining and exhibition
                infrastructure they cannot justify buying alone.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <ButtonLink href="/contact">Send an enquiry</ButtonLink>
                <ButtonLink href="/equipment" variant="secondary">
                  Browse {equipment.length} machines
                </ButtonLink>
              </div>
            </Reveal>

            {/* The collage's own background is flat white (see
                content/images.ts), so it sits directly on the band without
                a frame or a visible box around it. `priority`: it is above
                the fold on every viewport this wide enough to show it.

                Stays inside the container's own right gutter — same right
                margin as the nav, the footer, every other section — rather
                than bleeding to the true window edge.

                `fill` + `object-contain` instead of the intrinsic
                width/height: the wrapper's own `aspect-[1350/1165]` box
                always matches the image's intrinsic ratio exactly, at
                every breakpoint, so the box is sized from the column's
                *width* rather than from the row's height.

                That width is now a real, definite value — the text column
                is `auto` (sized to its own capped content) and this one is
                `1fr` (the rest of the row) — so letting the image grow
                from that width is what actually makes it as large as the
                layout can afford, instead of being capped to whatever
                height the copy block happens to need.

                That said, width-driven sizing alone has no ceiling on an
                ultrawide window — it kept growing past the point where
                its own aspect-driven height pushed the "Promoted &
                supported by" strip below the fold, which breaks the
                invariant that strip is built on (see the comment at that
                section: it's kept in this same band specifically so it
                shows without scrolling). So at `lg` this is driven by
                *height* instead — `lg:h-[clamp(360px,calc(100svh-320px),600px)]`,
                `320px` being the rest of the fold's fixed cost (header +
                this band's own padding + the promoted-by strip itself) —
                clamped so it still grows on a taller viewport, shrinks on
                a shorter one, but never pushes that strip out of view.
                `lg:w-auto` lets the aspect ratio size the width from that
                height, rather than the reverse. */}
            <Reveal className="relative w-full aspect-[1350/1165] lg:w-auto lg:h-[clamp(360px,calc(100svh-320px),600px)]">
              <Image
                src={heroCollage.src}
                alt={heroCollage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-contain lg:object-left"
              />
            </Reveal>
          </div>
        </Container>

        {/* Promoted by — kept inside the hero band itself (same wrapper,
            same min-h) rather than a separate section below it, so it
            shows in the first fold alongside the hero copy instead of
            requiring a scroll to reach. */}
        <Container className="w-full pb-1.5 lg:pb-0.5">
          <p className="font-mono text-[10.5px] font-semibold tracking-[0.18em] uppercase text-brand-600 mb-4 max-w-none">
            Promoted &amp; supported by
          </p>
          <Reveal
            as="ul"
            stagger
            className="grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-4 list-none m-0 p-0"
          >
            {promoters.map((p) => (
              <li
                key={p.caption}
                className="group flex flex-col items-center gap-3 rounded-lg border border-rule p-4 text-center transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <hr className="w-full border-rule" />
                <span className="text-[13px] font-medium leading-snug text-ink-700">{p.caption}</span>
              </li>
            ))}
          </Reveal>
        </Container>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Facilities                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="glow" border={false} compact>
        <h2>Auto Cluster facilities</h2>
        <p className="mt-4 text-ink-700">
          Auto Cluster provides its expertise to MSMEs looking for cost-effective
          infrastructure support and help with innovation. We ensure that products are
          tested, are of the highest quality, and meet the requirements of our clients.
        </p>

        {/* Exactly 5 facilities, always — a fixed lg:grid-cols-5 rather than
            card-grid's auto-fit, which wrapped the 5th card onto its own
            row once four filled the first. */}
        <Reveal
          as="ul"
          stagger
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 list-none m-0 p-0"
        >
          {primaryFacilities
            .filter((f) => f.category)
            .map((f) => {
              const machines = f.category ? getEquipmentByCategory(f.category) : []
              return (
                <li key={f.slug}>
                  <ServiceCard
                    href={`/facilities/${f.slug}`}
                    title={f.name}
                    description={f.summary}
                    eyebrow={categories.find((c) => c.id === f.category)?.label}
                    image={f.category ? serviceTiles[f.category] : undefined}
                    badge={f.isAccredited ? 'NABL 17025' : undefined}
                    data={[
                      { label: 'Machines', value: String(machines.length) },
                      ...(f.tests ? [{ label: 'Test methods', value: String(f.tests.length) }] : []),
                    ]}
                  />
                </li>
              )
            })}
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Venues                                                            */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="white" compact>
        <h2>Auto Cluster venues</h2>
        <p className="mt-4 text-ink-700">
          Creating infrastructural support to promote innovation and collective learning.
          Our venues are designed to meet international standards, and have hosted more
          than 100 industrial exhibitions over the last ten years.
        </p>

        <Reveal
          as="ul"
          stagger
          className="mt-8 card-grid gap-5 list-none m-0 p-0"
        >
          {venues.map((v) => (
            <li key={v.slug}>
              <ServiceCard
                href={`/venues/${v.slug}`}
                title={v.name}
                description={v.summary}
                image={venuePhotos[v.slug]}
                data={v.highlights
                  .filter((h) => h.value)
                  .slice(0, 2)
                  .map((h) => ({ label: h.label, value: h.value as string }))}
                cta="View venue"
              />
            </li>
          ))}
        </Reveal>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Credentials                                                       */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white border-b border-rule">
        <Container className="py-16 md:py-20 xl:py-24">
          <Reveal stagger className="grid gap-8 grid-cols-2 md:grid-cols-4">
            {credentials.map((c) => (
              <Stat
                key={c.key}
                label={c.key}
                value={c.value}
                note={c.note}
                count={c.countUp}
              />
            ))}
          </Reveal>
        </Container>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="accent" compact>
        <div className="grid lg:grid-cols-2 gap-10 lg:items-center">
          <div>
            <h2>Tell us what you need tested or made.</h2>
            <p className="mt-4 text-ink-700">
              One enquiry form, routed to the team that can answer it. We acknowledge every
              enquiry we receive.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/contact">Send an enquiry</ButtonLink>
              <ButtonLink href={site.phone.href} variant="secondary">
                Call {site.phone.display}
              </ButtonLink>
            </div>
          </div>

          {/* NABL/ISO badge collage — decorative reinforcement of the two
              accreditation lines already in the copy elsewhere on the site,
              so it carries an empty alt via `Reveal`'s wrapper rather than
              repeating the marks' meaning a screen reader has already heard.
              aspect-[3/2] matches the source file exactly (1536x1024), so
              object-contain has nothing to letterbox. */}
          <Reveal className="relative aspect-[3/2] w-full max-w-[420px] justify-self-center lg:justify-self-end">
            <Image
              src={ctaBadges.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              className="object-contain"
            />
          </Reveal>
        </div>
      </Section>
    </>
  )
}
