import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import App from './App'
import './index.scss'

dayjs.locale('zh-cn')

window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason
  const errorMessage = error?.message || String(error)

  if (errorMessage.includes('checkout popup')) {
    event.preventDefault()
    console.warn('Checkout popup error suppressed:', errorMessage)
    return
  }

  console.error('Unhandled promise rejection:', error)
})

window.addEventListener('error', (event) => {
  const errorMessage = event.message || String(event.error)

  if (errorMessage.includes('checkout popup')) {
    event.preventDefault()
    console.warn('Checkout popup error suppressed:', errorMessage)
    return
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
