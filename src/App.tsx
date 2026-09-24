import { Routes, Route } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<CalendarPage />} />
      </Routes>
    </div>
  )
}

export default App
