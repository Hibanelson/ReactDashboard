import './FilterBar.css'

/**
 * FilterBar
 * - Displays department filter pills
 * - Exposes a single "Add New User" CTA aligned to the right (desktop)
 * - Keeps logic minimal; parent owns state
 */
const FILTERS = ['All', 'Engineering', 'Design', 'Marketing', 'Sales']

export function FilterBar({ activeDepartment, onChangeFilter, onAddUser }) {
  return (
    <div className="filterbar">
      <div className="filterbar-filters">
        {FILTERS.map((label) => {
          // Parent stores filter value as a display label ("All", "Engineering", ...).
          const isActive = activeDepartment === label
          return (
            <button
              key={label}
              type="button"
              className={['filter-pill', isActive ? 'filter-pill--active' : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => onChangeFilter(label)}
            >
              {/* Screenshot uses uppercase pill labels */}
              {label.toUpperCase()}
            </button>
          )
        })}
      </div>

      {/* CTA intentionally separate so it can wrap below pills on mobile */}
      <button type="button" className="add-user-button" onClick={onAddUser}>
        + Add New User
      </button>
    </div>
  )
}

