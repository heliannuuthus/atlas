import { BrowserRouter } from 'react-router-dom'
import { AuthGuard, ErrorBoundary } from '@atlas/shared'
import { AppRoutes } from './routes'

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthGuard>
          <AppRoutes />
        </AuthGuard>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
