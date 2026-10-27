import { requireStaff } from '@/server/auth'
import { rateCatalogue, listFixedRates } from '@/server/platform'
import { StaffForm } from '@/components/StaffForm'
import { StaffField } from '@/components/StaffFields'
import { saveRate } from '../platform-actions'
export const metadata = { title: 'Fixed rates — Staff', robots: { index: false } }
export default async function StaffRatesPage() {
  await requireStaff('rates:manage')
  const rates = await listFixedRates()
  return <><h1 className="text-3xl">Fixed service rates</h1><p className="mt-4 mb-8">Publish only approved charges. Each service has one fixed amount from its effective date, with no membership discount. Include the approved tax treatment.</p><div className="space-y-5">
    {rateCatalogue.map((item) => {
      const rate = rates.filter((r) => r.key === item.key).sort((a,b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0]
      return <details key={item.key} className="p-5 bg-white border border-rule rounded-md"><summary className="cursor-pointer min-h-11 font-semibold">{item.title} · {rate ? 'Rate saved' : 'Awaiting approved rate'}</summary>
        <StaffForm action={saveRate} label="Publish approved rate"><input type="hidden" name="key" value={item.key} /><div className="grid sm:grid-cols-2 gap-4"><StaffField name="amount" label="Fixed amount (INR)" value={rate ? rate.amountPaise / 100 : ''} /><StaffField name="unit" label="Unit" value={rate?.unit ?? item.unit} /><StaffField name="effectiveFrom" label="Effective from (India date)" type="date" value={rate?.effectiveFrom ?? ''} /><StaffField name="taxNote" label="Tax / additional-charge terms" value={rate?.taxNote} /></div></StaffForm>
      </details>
    })}
  </div></>
}
