import { Routes, Route } from 'react-router-dom'
import { PortalLayout } from '@/layouts'
import { AuthCallback } from '@/pages/auth/Callback'
import { Home } from '@/pages/Home'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={<PortalLayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}
