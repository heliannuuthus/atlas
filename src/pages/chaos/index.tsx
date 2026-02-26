import { Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { TemplateManagement } from './TemplateManagement'
import { FileManagement } from './FileManagement'

export function ChaosManagement() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="templates/*" element={<TemplateManagement />} />
      <Route path="files/*" element={<FileManagement />} />
    </Routes>
  )
}
