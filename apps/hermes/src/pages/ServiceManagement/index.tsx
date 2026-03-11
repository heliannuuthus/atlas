import { Routes, Route, Navigate } from 'react-router-dom'
import { List } from './List'
import { Detail } from './Detail'
import { Edit } from './Edit'
import { RelationshipManagement } from '@/pages/RelationshipManagement'

export function ServiceManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Navigate to=".." state={{ openCreate: true }} replace />} />
      <Route path=":serviceId" element={<Detail />} />
      <Route path=":serviceId/edit" element={<Edit />} />
      <Route path=":serviceId/relationships/*" element={<RelationshipManagement />} />
    </Routes>
  )
}
