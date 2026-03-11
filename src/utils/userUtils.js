const BASE_DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales']

/**
 * transformUsersFromApi
 * - Converts DummyJSON "user" records into the exact shape the dashboard needs
 * - Assigns a department because the API doesn't provide one
 * - Assigns a stable-ish online/offline state for a realistic dashboard feel
 */
export function transformUsersFromApi(apiUsers, departments = BASE_DEPARTMENTS) {
  // Defensive: ensure callers can pass undefined/null without breaking the UI.
  if (!Array.isArray(apiUsers)) return []

  // Allow custom department lists but keep a sane fallback.
  const finalDepartments = Array.isArray(departments) && departments.length > 0 ? departments : BASE_DEPARTMENTS

  return apiUsers.map((user, index) => {
    // Prefer real names; fallback to username so cards never look blank.
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || user.username || 'Unknown User'

    // Deterministic assignment (by index) keeps departments evenly distributed.
    const department = finalDepartments[index % finalDepartments.length]
    // Deterministic "online" heuristic to mimic presence without needing real-time infra.
    const isOnline = index % 3 !== 0

    return {
      id: user.id,
      firstName,
      lastName,
      fullName,
      // Ensure email always exists so the card layout is consistent.
      email: user.email || `${user.username || 'user'}@example.com`,
      // Image is optional; UserCard handles fallback if missing/broken.
      image: user.image || '',
      department,
      isOnline,
    }
  })
}

