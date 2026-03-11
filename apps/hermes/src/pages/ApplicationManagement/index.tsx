import { Routes, Route, Navigate } from 'react-router-dom'
import { List } from './List'
import { Detail } from './Detail'
import { Edit } from './Edit'

export function ApplicationManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Navigate to=".." state={{ openCreate: true }} replace />} />
      <Route path=":appId" element={<Detail />} />
      <Route path=":appId/edit" element={<Edit />} />
    </Routes>
  )
}
