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
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
  },
  components: {
    Menu: {
      itemHeight: 40,
      itemMarginBlock: 4,
      itemMarginInline: 8,
      itemBorderRadius: 8,
      itemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#1890ff',
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#262626',
      rowHoverBg: '#f5f5f5',
    },
    Collapse: {
      headerBg: 'transparent',
      contentBg: 'transparent',
    },
    Breadcrumb: {
      separatorMargin: 8,
      linkColor: '#595959',
      linkHoverColor: '#1890ff',
      lastItemColor: '#262626',
    },
    Select: {
      optionSelectedBg: '#e6f7ff',
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
