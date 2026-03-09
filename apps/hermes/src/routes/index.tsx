import { Routes, Route, Navigate } from 'react-router-dom'
import { HermesLayout } from '@/layouts'
import { AuthCallback } from '@/pages/auth/Callback'
import { Dashboard } from '@/pages/Dashboard'
import { DomainManagement } from '@/pages/DomainManagement'
import { ServiceManagement } from '@/pages/ServiceManagement'
import { ApplicationManagement } from '@/pages/ApplicationManagement'
import { RelationshipManagement } from '@/pages/RelationshipManagement'
import { GroupManagement } from '@/pages/GroupManagement'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={<HermesLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="domains/*" element={<DomainManagement />} />
        <Route path="services/*" element={<ServiceManagement />} />
        <Route path="applications/*" element={<ApplicationManagement />} />
        <Route path="relationships/*" element={<RelationshipManagement />} />
        <Route path="groups/*" element={<GroupManagement />} />
      </Route>
    </Routes>
  )
}
