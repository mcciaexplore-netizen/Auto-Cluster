import { requireStaff } from '@/server/auth'
import { findAll } from '@/server/store'
import { roles, type StaffUser } from '@/server/roles'
import { departments, departmentLabels } from '@/lib/validation'
import { StaffForm } from '@/components/StaffForm'
import { StaffField } from '@/components/StaffFields'
import { createStaffAccount } from '../platform-actions'
export const metadata = { title: 'Staff accounts', robots: { index: false } }
export default async function StaffUsersPage() {
  await requireStaff('staff:manage')
  const users = await findAll<StaffUser>('staff-users')
  return <><h1 className="text-3xl">Staff accounts</h1><p className="mt-4 mb-7">Assign separate venue-manager and accounts users for approval and payment recording. Editors can manage events and media; only super-admins publish fixed rates.</p><div className="max-w-[640px] border border-rule bg-white rounded-md p-6"><StaffForm action={createStaffAccount} label="Create staff account"><StaffField name="name" label="Name" /><StaffField name="email" label="Email" type="email" /><StaffField name="password" label="Password (at least 12 characters)" type="password" /><label className="text-sm">Role<select name="role" defaultValue="editor" className="block w-full min-h-11 p-3 border border-rule-strong rounded-md">{roles.map((r) => <option key={r} value={r}>{r}</option>)}</select></label><label className="text-sm">Department (HOD accounts only)<select name="department" defaultValue="general" className="block w-full min-h-11 p-3 border border-rule-strong rounded-md">{departments.map((d) => <option key={d} value={d}>{departmentLabels[d]}</option>)}</select></label></StaffForm></div><ul className="list-none p-0 mt-8 divide-y divide-rule">{users.map((u) => <li key={u.id} className="py-4"><strong>{u.name}</strong> · {u.email}<span className="block mt-1 text-sm">{u.role} · {u.active ? 'Active' : 'Inactive'}</span></li>)}</ul></>
}
