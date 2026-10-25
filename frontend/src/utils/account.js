// The current API has no participant category. Never infer one from fees or email.
export function accountType(user) {
  const type = user?.participantType || user?.accountType || user?.role
  return typeof type === 'string' && !['authenticated', 'user'].includes(type)
    ? type.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Member'
}
