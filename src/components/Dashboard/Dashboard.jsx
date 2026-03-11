import { useEffect, useMemo, useState } from 'react'
import './Dashboard.css'
import { FilterBar } from '../FilterBar/FilterBar'
import { UserCard } from '../UserCard/UserCard'
import { UserFormModal } from '../UserFormModal/UserFormModal'
import { transformUsersFromApi } from '../../utils/userUtils'

/**
 * Dashboard
 * - Owns all dashboard UI state (users, filter, modal)
 * - Fetches initial user list from DummyJSON and normalizes it for the UI
 * - Implements add/edit/delete locally (no server persistence required)
 * - Keeps filtering working for both fetched and locally-created users
 */
const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales']

export function Dashboard() {
  // Canonical list used by the grid; all mutations (add/edit/delete) update this state.
  const [users, setUsers] = useState([])
  // Current department filter (UI pills); "All" means no filtering.
  const [activeDepartment, setActiveDepartment] = useState('All')
  // Fetch lifecycle state for the initial API request.
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Modal / form state: open/close + add vs edit + which user is being edited.
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    /**
     * "isMounted" guard:
     * - Prevents state updates if the component unmounts before the fetch resolves.
     * - Keeps the code simple without introducing AbortController for this demo.
     */
    let isMounted = true
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // Limit to 24 to match a dashboard-like “page” of cards.
        const response = await fetch('https://dummyjson.com/users?limit=24')
        if (!response.ok) {
          throw new Error('Failed to load users')
        }
        const data = await response.json()
        if (!isMounted) return
        // Normalize API fields into a UI-friendly shape + assign departments + online status.
        const normalized = transformUsersFromApi(data?.users ?? [], DEPARTMENTS)
        setUsers(normalized)
        setError(null)
      } catch (err) {
        if (isMounted) {
          // Keep error message user-friendly (don’t leak raw fetch internals).
          setError(err.message || 'Something went wrong while fetching users.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    // Fire-and-forget initial load.
    fetchUsers()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    // Derived data: keep the render cheap and avoid re-filtering on unrelated state changes.
    if (activeDepartment === 'All') return users
    return users.filter((user) => user.department === activeDepartment)
  }, [users, activeDepartment])

  const handleChangeFilter = (department) => {
    // Clicking a pill changes which users are displayed.
    setActiveDepartment(department)
  }

  const handleOpenAdd = () => {
    // Add flow: reset edit state and open the shared form in "add" mode.
    setModalMode('add')
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (user) => {
    // Edit flow: store the selected user so the modal can prefill values.
    setModalMode('edit')
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    // Modal is UI-only; form component will reset itself when appropriate.
    setIsModalOpen(false)
  }

  const handleSubmitUser = (formValues) => {
    if (modalMode === 'add') {
      /**
       * Local user creation:
       * - Use a UUID so new users don't clash with API numeric ids
       * - Compute fullName and isOnline in one place so cards stay consistent
       */
      const newUser = {
        ...formValues,
        id: crypto.randomUUID(),
        fullName: `${formValues.firstName} ${formValues.lastName}`,
        isOnline: formValues.status === 'Online',
      }
      // Prepend so the new user is immediately visible at the top.
      setUsers((prev) => [newUser, ...prev])
    } else if (modalMode === 'edit' && editingUser) {
      // Immutable update: replace only the matching user entry.
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? {
                ...editingUser,
                ...formValues,
                fullName: `${formValues.firstName} ${formValues.lastName}`,
                isOnline: formValues.status === 'Online',
              }
            : user,
        ),
      )
    }

    // Close after successful submit (add or edit).
    setIsModalOpen(false)
  }

  const handleDeleteUser = (userId) => {
    // Confirmation is intentionally basic to keep the project dependency-free.
    const confirmed = window.confirm('Are you sure you want to delete this user?')
    if (!confirmed) return
    // Immutable delete: remove by id.
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>

      <section className="dashboard-panel">
        <header className="dashboard-panel-header">
          <h2 className="panel-title">Users Management</h2>
          <div className="panel-divider" />
        </header>

        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <div>
              <h3 className="section-title">Filter by Department</h3>
            </div>
            <FilterBar
              activeDepartment={activeDepartment}
              onChangeFilter={handleChangeFilter}
              onAddUser={handleOpenAdd}
            />
          </div>
        </section>

        <section className="dashboard-section users-section">
          <header className="users-section-header">
            <h3 className="section-title">Users</h3>
          </header>
          <div className="panel-divider" />

          <div className="users-content">
            {/* Fetch states: shown inside the scrollable area to preserve layout */}
            {loading && <p className="status-text">Loading users...</p>}
            {error && !loading && <p className="status-text error-text">{error}</p>}
            {!loading && !error && filteredUsers.length === 0 && (
              <p className="status-text">No users found for this department.</p>
            )}

            {!loading && !error && filteredUsers.length > 0 && (
              <div className="users-grid">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={() => handleOpenEdit(user)}
                    onDelete={() => handleDeleteUser(user.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </section>

      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialValues={editingUser}
        onClose={handleCloseModal}
        onSubmit={handleSubmitUser}
        departments={DEPARTMENTS}
      />
    </main>
  )
}

