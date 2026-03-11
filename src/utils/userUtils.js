const BASE_DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales']

export function transformUsersFromApi(apiUsers, departments = BASE_DEPARTMENTS) {
  if (!Array.isArray(apiUsers)) return []

  const finalDepartments = Array.isArray(departments) && departments.length > 0 ? departments : BASE_DEPARTMENTS

  return apiUsers.map((user, index) => {
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || user.username || 'Unknown User'

    const department = finalDepartments[index % finalDepartments.length]
    const isOnline = index % 3 !== 0

    return {
      id: user.id,
      firstName,
      lastName,
      fullName,
      email: user.email || `${user.username || 'user'}@example.com`,
      image: user.image || '',
      department,
      isOnline,
    }
  })
}

