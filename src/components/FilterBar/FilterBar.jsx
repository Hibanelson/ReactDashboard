import './FilterBar.css'

const FILTERS = ['All', 'Engineering', 'Design', 'Marketing', 'Sales']

export function FilterBar({ activeDepartment, onChangeFilter, onAddUser }) {
  return (
    <div className="filterbar">
      <div className="filterbar-filters">
        {FILTERS.map((label) => {
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
              {label.toUpperCase()}
            </button>
          )
        })}
      </div>

      <button type="button" className="add-user-button" onClick={onAddUser}>
        + Add New User
      </button>
    </div>
  )
}

