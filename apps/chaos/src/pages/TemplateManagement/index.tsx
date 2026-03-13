import { Routes, Route } from 'react-router-dom'
import { List } from './List'
import { Create } from './Create'
import { Edit } from './Edit'
import { Detail } from './Detail'

export function TemplateManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path=":templateId" element={<Detail />} />
      <Route path=":templateId/edit" element={<Edit />} />
    </Routes>
  )
}
