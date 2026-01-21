import { Routes, Route } from 'react-router-dom'
import { DomainManagement } from './DomainManagement'
import { ServiceManagement } from './ServiceManagement'
import { ApplicationManagement } from './ApplicationManagement'
import { RelationshipManagement } from './RelationshipManagement'
import { GroupManagement } from './GroupManagement'

export function HermesManagement() {
  return (
    <Routes>
      <Route path="domains/*" element={<DomainManagement />} />
      <Route path="services/*" element={<ServiceManagement />} />
      <Route path="applications/*" element={<ApplicationManagement />} />
      <Route path="relationships" element={<RelationshipManagement />} />
      <Route path="groups/*" element={<GroupManagement />} />
    </Routes>
  )
}
