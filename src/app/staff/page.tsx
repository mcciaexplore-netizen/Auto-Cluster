import { redirect } from 'next/navigation'
import { getStaffSession } from '@/server/auth'
import { can } from '@/server/roles'

export default async function StaffIndexPage() {
  const user = await getStaffSession()
  if (!user) redirect('/staff/login')
  redirect(can(user, 'payments:record') || user.role === 'venue-manager' ? '/staff/bookings' : can(user, 'enquiries:view') ? '/staff/enquiries' : '/staff/media')
}
