import Image from 'next/image'
import Link from 'next/link'
import { promoters } from '@/content/site'
import { heroCollage } from '@/content/images'
import { Container, Section } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'

const paths = [
  { href: '/facilities', title: 'Testing & prototyping', text: 'Explore environmental testing, material testing, machining, additive manufacturing and metrology.', link: 'Explore facilities' },
  { href: '/venues', title: 'Space for industry', text: 'Compare exhibition halls, the auditorium and training spaces. Send one request with your dates and requirements.', link: 'Venue options' },
]
export default function HomePage() {
  return <>
    <section className="bg-white">
      <Container className="py-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-poppins text-sm text-brand-600 tracking-wide mb-5">Pune, India · An MCCIA initiative</p>
            <h1 className="max-w-[18ch]">Technical facilities for Indian MSMEs.</h1>
            <p className="mt-6 text-lg text-ink-700 max-w-[46ch]">Test a component, build a prototype or bring your industry together. Auto Cluster gives manufacturers access to shared facilities in Chinchwad, Pune.</p>
            <div className="flex flex-wrap gap-3 mt-8"><ButtonLink href="/facilities">Explore facilities</ButtonLink><ButtonLink href="/venues" variant="secondary">Venue options</ButtonLink></div>
            <Link href="/contact" className="inline-flex min-h-11 items-center mt-4 font-semibold text-brand-800">Discuss your requirements →</Link>
          </div>
          <div className="relative aspect-[1350/1165]"><Image src={heroCollage.src} alt={heroCollage.alt} fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-contain" /></div>
        </div>
        <div className="border-t border-rule mt-10 pt-7"><p className="text-xs text-ink-500 mb-4">Promoted and supported by</p><ul className="flex flex-wrap gap-x-10 gap-y-6 list-none m-0 p-0">{promoters.map((p) => <li key={p.caption} className="flex items-center gap-3 w-[15rem]"><Image src={p.src} alt={p.alt} width={p.width} height={p.height} className="h-16 w-auto object-contain shrink-0" /><span className="text-xs font-medium text-ink-700">{p.caption}</span></li>)}</ul></div>
      </Container>
    </section>
    <Section compact><div className="grid md:grid-cols-2 gap-8 md:gap-16">{paths.map((p) => <article key={p.href} className="border-t-2 border-brand-600 pt-6"><h2 className="text-[28px]">{p.title}</h2><p className="mt-4 text-ink-700">{p.text}</p><Link href={p.href} className="inline-flex items-center min-h-11 mt-4 font-semibold">{p.link} →</Link></article>)}</div>
      <div className="mt-12 pt-7 border-t border-rule flex flex-wrap gap-x-8 gap-y-3"><Link href="/rate-card">Service rate card →</Link><Link href="/events">Events & registration →</Link><Link href="/startups">Startups & incubation →</Link><Link href="/media">Media →</Link></div>
    </Section>
  </>
}
