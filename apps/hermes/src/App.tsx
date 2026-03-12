import { BrowserRouter } from 'react-router-dom'
import { AuthGuard, AuthProvider, ErrorBoundary } from '@atlas/shared'
import { AppRoutes } from './routes'

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AuthGuard>
            <AppRoutes />
          </AuthGuard>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
