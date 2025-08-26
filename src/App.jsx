import { Routes, Route, Navigate } from 'react-router-dom'
import ApplicationLayout from './layouts/ApplicationLayout'
import StepPage from './pages/apply/StepPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/apply/step/1" replace />} />

      {/* Parent route mengandung :step -> layout bisa baca step */}
      <Route path="/apply/step/:step" element={<ApplicationLayout />}>
        <Route index element={<StepPage total={7} />} />
      </Route>

      <Route path="*" element={<Navigate to="/apply/step/1" replace />} />
    </Routes>
  )
}
