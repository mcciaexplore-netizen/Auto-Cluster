import { redirect } from 'next/navigation'
import { getStaffSession } from '@/server/auth'

export default async function StaffIndexPage() {
  const user = await getStaffSession()
  redirect(user ? '/staff/enquiries' : '/staff/login')
}
