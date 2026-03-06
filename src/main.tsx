import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import type { ThemeConfig } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import App from './App'
import './index.scss'

dayjs.locale('zh-cn')

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#7c3aed',
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorInfo: '#7c3aed',
    borderRadius: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBorder: '#e5e5e5',
    colorBorderSecondary: '#f5f5f5',
  },
  components: {
    Menu: {
      itemHeight: 40,
      itemMarginBlock: 4,
      itemMarginInline: 8,
      itemBorderRadius: 8,
      itemSelectedBg: '#f5f3ff',
      itemSelectedColor: '#7c3aed',
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#171717',
      rowHoverBg: '#fafafa',
    },
    Collapse: {
      headerBg: 'transparent',
      contentBg: 'transparent',
    },
    Breadcrumb: {
      separatorMargin: 8,
      linkColor: '#737373',
      linkHoverColor: '#7c3aed',
      lastItemColor: '#171717',
    },
    Select: {
      optionSelectedBg: '#f5f3ff',
    },
    Tag: {
      defaultBg: '#fafafa',
    },
    List: {
      itemPaddingSM: '8px 0',
      itemPadding: '12px 0',
    },
  },
}

window.addEventListener('unhandledrejection', event => {
  const error = event.reason
  const errorMessage = error?.message || String(error)

  if (errorMessage.includes('checkout popup')) {
    event.preventDefault()
    console.warn('Checkout popup error suppressed:', errorMessage)
    return
  }

  console.error('Unhandled promise rejection:', error)
})

window.addEventListener('error', event => {
  const errorMessage = event.message || String(event.error)

  if (errorMessage.includes('checkout popup')) {
    event.preventDefault()
    console.warn('Checkout popup error suppressed:', errorMessage)
    return
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
