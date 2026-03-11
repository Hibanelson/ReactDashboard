import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import './UserFormModal.css'

const DEFAULT_VALUES = {
  firstName: '',
  lastName: '',
  email: '',
  image: '',
  department: '',
  status: 'Online',
}

export function UserFormModal({ isOpen, mode, initialValues, onClose, onSubmit, departments }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialValues) {
        reset({
          firstName: initialValues.firstName ?? '',
          lastName: initialValues.lastName ?? '',
          email: initialValues.email ?? '',
          image: initialValues.image ?? '',
          department: initialValues.department ?? '',
          status: initialValues.isOnline ? 'Online' : 'Offline',
        })
      } else {
        reset(DEFAULT_VALUES)
      }
    }
  }, [isOpen, mode, initialValues, reset])

  const handleClose = () => {
    if (isSubmitting) return
    onClose()
  }

  const onValidSubmit = (values) => {
    onSubmit(values)
    reset(DEFAULT_VALUES)
  }

  if (!isOpen) {
    return null
  }

  const title = mode === 'edit' ? 'Edit User' : 'Add New User'

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <header className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button type="button" className="modal-close" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </header>

        <form className="modal-form" onSubmit={handleSubmit(onValidSubmit)} noValidate>
          <div className="modal-grid">
            <div className="form-field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && (
                <p className="field-error">{errors.firstName.message}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && <p className="field-error">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="image">Image URL (optional)</label>
            <input id="image" type="url" {...register('image')} />
          </div>

          <div className="modal-grid">
            <div className="form-field">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                {...register('department', { required: 'Department is required' })}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <p className="field-error">{errors.department.message}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" {...register('status')}>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="modal-primary" disabled={isSubmitting}>
              {mode === 'edit' ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

