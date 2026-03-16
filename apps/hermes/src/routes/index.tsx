import { Routes, Route } from 'react-router-dom'
import { HermesLayout } from '@/layouts'
import { AuthCallback } from '@/pages/auth/Callback'
import { DomainPicker } from '@/pages/DomainPicker'
import { Dashboard } from '@/pages/Dashboard'
import { ServiceManagement } from '@/pages/ServiceManagement'
import { ApplicationManagement } from '@/pages/ApplicationManagement'
import { GroupManagement } from '@/pages/GroupManagement'
import { NotFound } from '@/pages/NotFound'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={<DomainPicker />} />
      <Route path="/d/:domainId" element={<HermesLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="services/*" element={<ServiceManagement />} />
        <Route path="applications/*" element={<ApplicationManagement />} />
        <Route path="groups/*" element={<GroupManagement />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
