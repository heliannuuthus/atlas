import { Routes, Route } from 'react-router-dom'
import { List } from './List'
import { Create } from './Create'
import { Graph } from './Graph'

export function RelationshipManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path="graph" element={<Graph />} />
    </Routes>
  )
}
