import { Routes, Route } from 'react-router-dom'
import { List } from './List'
import { Create } from './Create'

export function RelationshipManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Create />} />
    </Routes>
  )
}
