import { Routes, Route, Navigate } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { DomainManagement } from './DomainManagement'
import { ServiceManagement } from './ServiceManagement'
import { ApplicationManagement } from './ApplicationManagement'
import { RelationshipManagement } from './RelationshipManagement'
import { GroupManagement } from './GroupManagement'

export function HermesManagement() {
  return (
    <Routes>
      {/* 默认重定向到 Dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="domains/*" element={<DomainManagement />} />
      <Route path="services/*" element={<ServiceManagement />} />
      <Route path="applications/*" element={<ApplicationManagement />} />
      <Route path="relationships/*" element={<RelationshipManagement />} />
      <Route path="groups/*" element={<GroupManagement />} />
    </Routes>
  )
}
