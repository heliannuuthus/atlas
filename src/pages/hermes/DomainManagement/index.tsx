import { Routes, Route } from 'react-router-dom'
import { List } from './List'
import { Detail } from './Detail'

export function DomainManagement() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path=":domainId" element={<Detail />} />
    </Routes>
  )
}
