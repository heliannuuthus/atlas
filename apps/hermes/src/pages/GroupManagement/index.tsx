import { Routes, Route } from 'react-router-dom'
import { List } from './List'
import { Create } from './Create'
import { Detail } from './Detail'
import { Edit } from './Edit'

export function GroupManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path=":groupId" element={<Detail />} />
      <Route path=":groupId/edit" element={<Edit />} />
    </Routes>
  )
}
