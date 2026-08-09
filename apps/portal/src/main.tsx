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
    colorPrimary: '#1677ff',
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorInfo: '#1677ff',
    colorText: '#1d2633',
    colorTextSecondary: '#657287',
    borderRadius: 12,
    fontFamily:
      "'SF Pro Text', 'SF Pro SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    colorBgContainer: '#ffffff',
    colorBgLayout: '#eaf1f8',
    colorBorder: '#dfe5ee',
    colorBorderSecondary: '#e6eaf0',
  },
  components: {
    Button: { controlHeight: 40, borderRadius: 10 },
    Card: { paddingLG: 24, borderRadiusLG: 18 },
    Modal: { borderRadiusLG: 20 },
    Breadcrumb: {
      separatorMargin: 8,
      linkColor: '#657287',
      linkHoverColor: '#1677ff',
      lastItemColor: '#1d2633',
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
