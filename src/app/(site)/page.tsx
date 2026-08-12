import Image from 'next/image'
import Link from 'next/link'
import { credentials, site } from '@/content/site'
import { primaryFacilities } from '@/content/facilities'
import { venues } from '@/content/venues'
import { categories, equipment, getEquipmentByCategory } from '@/content/equipment'
import { heroCollage, serviceTiles, venuePhotos } from '@/content/images'
import { Container, Prose, Section, Stat } from '@/components/ui/Section'
import { ServiceCard } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Home.
 *
 * The hero answers "what is this place" in one line and routes three
 * different visitors in one glance. The credential strip carries only figures
 * ACDRI can evidence — the current site's five animated counters all render
 * `1 +` and stay off the page until real numbers arrive (CQ-57).
 */

const audiences = [
  {
    href: '/facilities/environmental-testing',
    heading: 'Get something tested',
    body: 'Environmental chambers, rubber and polymer, metrology. NABL scope, standards and turnaround.',
    cta: 'Choose a test',
  },
  {
    href: '/facilities/prototype-production-facility',
    heading: 'Get something made',
    body: '3, 3+1 and 5-axis VMC, wire EDM and laser. SLA, SLS, FDM and vacuum casting.',
    cta: 'See capabilities',
  },
  {
    href: '/venues/book',
    heading: 'Hire a venue',
    body: '4,000 sq m of exhibition halls, a 172-seat auditorium and training rooms.',
    cta: 'Check availability',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      {/* Fills the window. `--hero-min-h` is 100svh minus the 88px sticky
          masthead, so the band ends exactly at the fold. `min-h`, not `h`:
          on a short laptop the content still governs and the band grows.

          Both the copy and the collage stretch to the band's full height
          now (`h-full` down at the grid and its two columns), rather than
          each sizing itself and leaving whatever gap is left over. That is
          what makes "the copy sits at the vertical centre of the window"
          and "the image fills the band top to bottom" true at the same
          time, instead of fighting each other the way bottom-aligning two
          independently-sized columns did. */}
      <div className="bg-paper-2 border-b border-rule flex min-h-[var(--hero-min-h)]">
        <Container className="w-full py-16 md:py-20">
          {/* Two columns on request: copy on the left, the collage on the
              right, rather than one centred column. Below `lg` there isn't
              room for both side by side, so it stacks — copy first, image
              second, same reading order as the two-column version, and
              `lg:h-full` drops out so the stack just flows at its own
              height the way any other stacked section does. */}
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 lg:h-full">
            <Reveal
              stagger
              className="flex flex-col items-start text-left lg:h-full lg:justify-center"
            >
              <p className="font-mono text-[12px] tracking-[0.16em] uppercase text-brand-400 mb-6 max-w-none">
                Promoted by Govt. of India · PCMC · Govt. of Maharashtra · MCCIA initiative
              </p>

              <h1 className="max-w-[22ch]">{site.tagline}</h1>

              <p className="mt-7 text-[clamp(16px,1.25vw,20px)] leading-relaxed text-ink-700 max-w-[46ch]">
                In the Chinchwad–Talegaon–Chakan automotive belt of Pune, ACDRI gives small and
                medium enterprises access to the validation, machining and exhibition
                infrastructure they cannot justify buying alone.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href="/contact">Send an enquiry</ButtonLink>
                <ButtonLink href="/equipment" variant="secondary">
                  Browse {equipment.length} machines
                </ButtonLink>
              </div>
            </Reveal>

            {/* The collage's background is removed to real alpha (see
                content/images.ts), so it sits directly on the band without
                a frame or a visible box around it. `priority`: it is above
                the fold on every viewport this wide enough to show it.

                Bleeds past the container's own right gutter to the true
                window edge on request — widened by exactly `--page-gutter`
                and pulled right by the same amount, which is precisely the
                padding it needs to cross to reach the edge.

                `fill` + `object-contain` instead of the intrinsic
                width/height: below `lg` the wrapper's height comes from
                its own `aspect-*`, matching the image exactly, so this
                renders the same as a plain sized image. At `lg` the
                wrapper switches to the *grid row's* height — the same
                height the copy is now centred against — and the image
                scales up to fill that box on whichever axis runs out of
                room first. It never has to exceed the band's own height to
                do it, which is what kept the last, size-driven attempt at
                "bigger" from overflowing the fold — this one is bounded by
                a height the page already has, not adding one. */}
            <Reveal
              className="relative w-full aspect-[1483/1061] lg:aspect-auto lg:h-full lg:w-[calc(100%+var(--page-gutter))] lg:-mr-[var(--page-gutter)]"
            >
              <Image
                src={heroCollage.src}
                alt={heroCollage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-contain lg:object-right"
              />
            </Reveal>
          </div>
        </Container>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Credentials                                                       */}
      {/* ---------------------------------------------------------------- */}
      {/* Its own band below the fold, no longer a footnote to the hero.
          White against the hero's tint, so the two read as separate bands
          without needing a rule between them.

          Being below the fold is what makes the count-up work as intended:
          the figures are still at zero when the band scrolls into view, so
          the animation is seen rather than finishing off-screen. */}
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
      {/* Audience router                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white border-t-[3px] border-brand-600 border-b border-rule">
        {/* Keeps the page gutter, so the row's left edge lines up with every
            other band on the page. (This carried `px-0` before, which never
            applied — `cn` does not merge, and Tailwind emits `.px-6` after
            `.px-0`, so the gutter won regardless. Removed rather than made
            to work: the alignment is worth more than the full bleed.) */}
        <Container>
          <Reveal as="ul" stagger className="grid md:grid-cols-3 list-none m-0 p-0">
            {audiences.map((a) => (
              <li key={a.href} className="border-b md:border-b-0 md:border-r border-rule last:border-0">
                <Link
                  href={a.href}
                  className="group flex flex-col gap-2.5 h-full px-6 py-10 md:py-14 no-underline transition-colors duration-150 hover:bg-paper-2"
                >
                  <span className="font-display font-semibold text-[clamp(20px,1.5vw,26px)] leading-tight text-brand-600">
                    {a.heading}
                  </span>
                  <span className="text-[15.5px] leading-relaxed text-ink-500">{a.body}</span>
                  <span className="mt-1 text-sm font-semibold text-brand-800 group-hover:underline underline-offset-4">
                    {a.cta} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </Container>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Welcome — source copy, deduplicated                               */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="white">
        {/* Wide on request: at the container's full width the default 28ch/66ch
            reading measure left this one section reading as a narrow column
            with the whole right half of the band empty. */}
        <h2 className="max-w-none">Welcome to Auto Cluster Development and Research Institute</h2>
        <Prose
          className="mt-5"
          wide
          paragraphs={[
            'Located in the Chinchwad-Talegaon-Chakan automotive district of Pune, the Auto Cluster Development and Research Institute is a facility providing support to small and medium enterprises. It offers a common facility for validation, training, seminars, workshops and market promotional activities, especially for the automotive and engineering sector.',
            // The source sentence repeats "supported by Government of Maharashtra
            // and Pimpri Chinchwad Municipal Corporation" twice. Stated once.
            'ACDRI is established under the Industrial Infrastructure Up-gradation Scheme (IIUS) of the Department of Industrial Policy and Promotion (DIPP), Ministry of Commerce and Industry, Government of India, supported by the Government of Maharashtra and the Pimpri Chinchwad Municipal Corporation, with the initiative of the Mahratta Chamber of Commerce, Industries and Agriculture (MCCIA).',
          ]}
        />
        <div className="mt-6">
          <ButtonLink href="/about" variant="secondary" size="sm">
            About the institute
          </ButtonLink>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- */}
      {/* Facilities                                                        */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="glow">
        <h2>Auto Cluster facilities</h2>
        <p className="mt-4 text-ink-700">
          Auto Cluster provides its expertise to MSMEs looking for cost-effective
          infrastructure support and help with innovation. We ensure that products are
          tested, are of the highest quality, and meet the requirements of our clients.
        </p>

        <Reveal
          as="ul"
          stagger
          className="mt-8 card-grid gap-5 list-none m-0 p-0"
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
      <Section tone="white">
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
      {/* CTA                                                               */}
      {/* ---------------------------------------------------------------- */}
      <Section tone="accent">
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
      </Section>
    </>
  )
}
