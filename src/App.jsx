import { Routes, Route, Navigate } from 'react-router-dom'
import ApplicationLayout from './layouts/ApplicationLayout'
import StepPage from './pages/apply/StepPage'
import VideoRecord from './pages/apply/VideoRecord'
import VideoHelp from './pages/apply/VideoHelp'
import VideoSuccess from './pages/apply/VideoSuccess'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/apply/step/1" replace />} />

      {/* Parent route mengandung :step -> layout bisa baca step */}
      <Route path="/apply/step/:step" element={<ApplicationLayout />}>
        <Route index element={<StepPage total={7} />} />
      </Route>
      <Route path="/apply/video" element={<VideoRecord />} />
      <Route path="/apply/video/help" element={<VideoHelp />} />
      <Route path="/apply/video/success" element={<VideoSuccess />} />

      <Route path="*" element={<Navigate to="/apply/step/1" replace />} />
    </Routes>
  )
}
