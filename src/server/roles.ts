import type { EnquiryDepartment } from '@/lib/types'
import type { Stamped } from './store'

/**
 * The seven roles from the requirement list, and what each may do.
 *
 * `hod` is scoped to a single department (`StaffUser.department`) — checked
 * in `can()`, not just in the UI, so a HOD account can't see another
 * department's enquiries by hitting the API directly.
 */
export type Role =
  | 'super-admin'
  | 'marketing'
  | 'hod'
  | 'venue-manager'
  | 'training-coordinator'
  | 'accounts'
  | 'editor'

export const roles: Role[] = [
  'super-admin',
  'marketing',
  'hod',
  'venue-manager',
  'training-coordinator',
  'accounts',
  'editor',
]

export interface StaffUser extends Stamped {
  email: string
  name: string
  role: Role
  /** Only meaningful for 'hod'. Null for every other role. */
  department: EnquiryDepartment | null
  passwordHash: string
  passwordSalt: string
  active: boolean
}

/**
 * Every checkable action, foundation-wide — not just the ones Module 1
 * (Enquiry) wires up yet. Booking approval and payment recording are
 * reserved here now, before either feature exists, specifically so the
 * "never the same role" rule below has something to check against the day
 * those modules land, instead of being re-derived (and possibly gotten
 * wrong) from scratch then.
 */
export type Action =
  | 'enquiries:view'
  | 'enquiries:view-all-departments'
  | 'enquiries:update-status'
  | 'routing-map:view'
  | 'routing-map:edit'
  | 'staff:manage'
  | 'audit-log:view'
  | 'bookings:approve'
  | 'payments:record'
  | 'certificates:issue'
  | 'training:manage'

const GRANTS: Record<Role, Action[]> = {
  'super-admin': [
    'enquiries:view',
    'enquiries:view-all-departments',
    'enquiries:update-status',
    'routing-map:view',
    'routing-map:edit',
    'staff:manage',
    'audit-log:view',
    'bookings:approve',
    'certificates:issue',
    'training:manage',
    // Deliberately NOT 'payments:record' — see assertApprovalPaymentSeparation
    // below. Even the super-admin does not hold both sides of that split;
    // it exists to make the rule true structurally, not by convention.
  ],
  marketing: ['enquiries:view', 'enquiries:view-all-departments', 'enquiries:update-status', 'routing-map:view'],
  hod: ['enquiries:view', 'enquiries:update-status'],
  'venue-manager': ['enquiries:view', 'bookings:approve'],
  'training-coordinator': ['enquiries:view', 'training:manage', 'certificates:issue'],
  accounts: ['payments:record', 'audit-log:view'],
  editor: [],
}

export function can(user: Pick<StaffUser, 'role'>, action: Action): boolean {
  return GRANTS[user.role]?.includes(action) ?? false
}

/**
 * "Approval and payment recording split across different roles, never the
 * same person" — enforced here as an invariant over the grant table itself,
 * checked once at module load, rather than trusted to stay true by hand as
 * roles gain actions over time. Throws at import time (dev and build) if
 * violated, the same fail-fast contract as the `Href` type and the Media
 * alt-text validator elsewhere in this codebase.
 */
function assertApprovalPaymentSeparation() {
  const rolesWithBoth = roles.filter(
    (role) => GRANTS[role].includes('bookings:approve') && GRANTS[role].includes('payments:record'),
  )
  if (rolesWithBoth.length > 0) {
    throw new Error(
      `Role permission table grants both 'bookings:approve' and 'payments:record' to: ${rolesWithBoth.join(', ')}. These must stay on different roles.`,
    )
  }
}

assertApprovalPaymentSeparation()

/** For a HOD, the one department they may see. Null for every other role. */
export function departmentScope(user: Pick<StaffUser, 'role' | 'department'>): EnquiryDepartment | null {
  return user.role === 'hod' ? user.department : null
}
