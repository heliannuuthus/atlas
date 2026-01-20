import { Routes, Route } from 'react-router-dom'
import { List } from './List'
import { Create } from './Create'
import { Detail } from './Detail'
import { Edit } from './Edit'

export function ServiceManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path=":serviceId" element={<Detail />} />
      <Route path=":serviceId/edit" element={<Edit />} />
    </Routes>
  )
}
