import { redirect } from 'next/navigation'
import { getStaffSession } from '@/server/auth'
import { LoginForm } from './LoginForm'

export const metadata = { title: 'Staff sign-in', robots: { index: false, follow: false } }

export default async function StaffLoginPage() {
  const user = await getStaffSession()
  if (user) redirect('/staff/enquiries')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[24px] font-display font-semibold">Staff sign-in</h1>
      <LoginForm />
    </div>
  )
}
