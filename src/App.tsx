import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { LayoutProvider } from './layouts'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <LayoutProvider>
          <AppRoutes />
        </LayoutProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
