import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, ErrorBoundary } from '@atlas/shared'
import { AppRoutes } from './routes'

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
