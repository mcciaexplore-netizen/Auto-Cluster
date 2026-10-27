import Link from 'next/link'
import { listFixedRates, rateCatalogue } from '@/server/platform'
import { formatRupees } from '@/content/rates'
import { PageHero, Section } from '@/components/ui/Section'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Fixed service rate card', description: 'Approved fixed rates for Auto Cluster machines, testing services and venue hire.' }
export default async function RateCardPage() {
  const rates = await listFixedRates()
  const today = new Date(Date.now() + 330 * 60000).toISOString().slice(0,10)
  return <><PageHero eyebrow="Machines & services" title="Service rate card" subtitle="One approved fixed charge per machine or service. Charges awaiting approval are available by enquiry." /><Section tone="white"><div className="max-w-[1100px]"><p className="mb-7">Select a machine or venue for its details. The effective date and tax terms accompany every published rate.</p><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-sm text-left"><caption className="sr-only">Fixed service charges in Indian rupees</caption><thead><tr className="border-b-2 border-brand-600"><th scope="col" className="py-4 pr-5">Machine / service</th><th scope="col" className="pr-5">Fixed rate (INR)</th><th scope="col" className="pr-5">Unit</th><th scope="col">Effective date & terms</th></tr></thead><tbody>
    {rateCatalogue.map((item) => {
      const rate = rates.filter((r) => r.key === item.key && r.effectiveFrom <= today).sort((a,b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0]
      return <tr key={item.key} className="border-b border-rule align-top"><th scope="row" className="py-5 pr-5 font-medium"><Link href={item.href}>{item.title}</Link></th><td className="py-5 pr-5">{rate ? <span className="font-mono tabular-nums">{formatRupees(rate.amountPaise / 100)}</span> : <span className="text-ink-500">Enquire for rate</span>}</td><td className="py-5 pr-5">{rate?.unit ?? 'To be confirmed'}</td><td className="py-5">{rate ? <>{rate.effectiveFrom}<span className="block mt-1 text-ink-500">{rate.taxNote}</span></> : 'Awaiting approved rate'}</td></tr>
    })}
  </tbody></table></div><p className="mt-7 text-sm">The applicable total and service scope will be confirmed before payment.</p><Link href="/contact" className="inline-block mt-5">Request a service quotation →</Link></div></Section></>
}
