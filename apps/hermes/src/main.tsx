import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import type { ThemeConfig } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { configureAudiences, defaultScopeString } from '@atlas/shared'
import App from './App'
import './index.scss'

dayjs.locale('zh-cn')

configureAudiences({ hermes: { scope: defaultScopeString } })

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#059669',
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorInfo: '#059669',
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
      itemSelectedBg: '#ecfdf5',
      itemSelectedColor: '#059669',
    },
    Card: { paddingLG: 24 },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#171717',
      rowHoverBg: '#fafafa',
    },
    Breadcrumb: {
      separatorMargin: 8,
      linkColor: '#737373',
      linkHoverColor: '#059669',
      lastItemColor: '#171717',
    },
    Select: { optionSelectedBg: '#ecfdf5' },
    Tag: { defaultBg: '#fafafa' },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
