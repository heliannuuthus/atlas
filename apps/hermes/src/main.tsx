import React from 'react'
import ReactDOM from 'react-dom/client'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { configureAudiences, defaultScopeString } from '@atlas/shared'
import '@atlas/ui/globals.css'
import { Toaster } from '@atlas/ui/toast'
import { TooltipProvider } from '@atlas/ui/tooltip'
import App from './App'
import './index.scss'

dayjs.locale('zh-cn')

configureAudiences({ hermes: { scope: defaultScopeString } })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </React.StrictMode>
)
