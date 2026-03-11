import { useEffect, useMemo, useState } from 'react'
import './Dashboard.css'
import { FilterBar } from '../FilterBar/FilterBar'
import { UserCard } from '../UserCard/UserCard'
import { UserFormModal } from '../UserFormModal/UserFormModal'
import { transformUsersFromApi } from '../../utils/userUtils'

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales']

export function Dashboard() {
  const [users, setUsers] = useState([])
  const [activeDepartment, setActiveDepartment] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    let isMounted = true
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://dummyjson.com/users?limit=24')
        if (!response.ok) {
          throw new Error('Failed to load users')
        }
        const data = await response.json()
        if (!isMounted) return
        const normalized = transformUsersFromApi(data?.users ?? [], DEPARTMENTS)
        setUsers(normalized)
        setError(null)
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Something went wrong while fetching users.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchUsers()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredUsers = useMemo(() => {
    if (activeDepartment === 'All') return users
    return users.filter((user) => user.department === activeDepartment)
  }, [users, activeDepartment])

  const handleChangeFilter = (department) => {
    setActiveDepartment(department)
  }

  const handleOpenAdd = () => {
    setModalMode('add')
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (user) => {
    setModalMode('edit')
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmitUser = (formValues) => {
    if (modalMode === 'add') {
      const newUser = {
        ...formValues,
        id: crypto.randomUUID(),
        fullName: `${formValues.firstName} ${formValues.lastName}`,
        isOnline: formValues.status === 'Online',
      }
      setUsers((prev) => [newUser, ...prev])
    } else if (modalMode === 'edit' && editingUser) {
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

    setIsModalOpen(false)
  }

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?')
    if (!confirmed) return
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

