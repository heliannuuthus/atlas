import { Routes, Route } from 'react-router-dom'
import { List } from './List'
import { Detail } from './Detail'
import { Create } from './Create'
import { Edit } from './Edit'

export function MiniprogramManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path=":id" element={<Detail />} />
      <Route path=":id/edit" element={<Edit />} />
    </Routes>
  )
}
