import './App.css'
import { Dashboard } from './components/Dashboard/Dashboard'

/**
 * App
 * - Minimal app shell; the Dashboard owns the feature logic and UI state
 * - Keeping App small makes it easy to add routing or other pages later
 */
function App() {
  return (
    <div className="app-root">
      <Dashboard />
    </div>
  )
}

export default App
