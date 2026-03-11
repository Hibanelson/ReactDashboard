import './UserCard.css'

/**
 * UserCard
 * - Presentational card matching the dashboard screenshot
 * - Shows avatar, online status, name/email, department badge
 * - Exposes Edit/Delete actions handled by the parent
 */
const FALLBACK_AVATAR =
  'https://avatars.dicebear.com/api/initials/example.svg?background=%23e0ecff'

// Department → badge color mapping to keep styling logic centralized.
const departmentClassName = (department) => {
  switch (department) {
    case 'Engineering':
      return 'badge--engineering'
    case 'Design':
      return 'badge--design'
    case 'Marketing':
      return 'badge--marketing'
    case 'Sales':
      return 'badge--sales'
    default:
      return ''
  }
}

export function UserCard({ user, onEdit, onDelete }) {
  const handleImageError = (event) => {
    // Prevent infinite error loop if the fallback URL fails for any reason.
    if (event.target.src === FALLBACK_AVATAR) return
    // eslint-disable-next-line no-param-reassign
    event.target.src = FALLBACK_AVATAR
  }

  return (
    <article className="user-card">
      <div className="user-card-top">
        <div className="user-avatar-wrap">
          <img
            src={user.image || FALLBACK_AVATAR}
            alt={user.fullName}
            className="user-avatar"
            onError={handleImageError}
          />
        </div>
        <div className="user-status">
          {/* Visual indicator (green dot + label) as shown in the screenshot */}
          <span className="status-dot" />
          <span className="status-text-inline">{user.isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div className="user-card-body">
        <h4 className="user-name">{user.fullName}</h4>
        <p className="user-email">{user.email}</p>
        <div className={`user-department-badge ${departmentClassName(user.department)}`}>
          {user.department}
        </div>
      </div>

      <div className="user-card-footer">
        {/* Kept as a button for accessibility; styled to match a link */}
        <button type="button" className="view-posts-link">
          View Posts
        </button>
        <div className="user-card-actions">
          <button type="button" className="user-action user-action--edit" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="user-action user-action--delete" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

