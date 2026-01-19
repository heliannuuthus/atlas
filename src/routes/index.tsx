import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts'
import { MiniprogramManagement } from '@/pages/miniprogram'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/miniprogram" replace />} />
        <Route path="miniprogram/*" element={<MiniprogramManagement />} />
      </Route>
    </Routes>
  )
}
