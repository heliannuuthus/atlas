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
    colorPrimary: '#2557d6',
    colorSuccess: '#16a34a',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorInfo: '#2557d6',
    colorText: '#15233b',
    colorTextSecondary: '#5e6b82',
    borderRadius: 10,
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f8fe',
    colorBorder: '#dce5f2',
    colorBorderSecondary: '#e8eef7',
  },
  components: {
    Button: { controlHeight: 40, borderRadius: 10 },
    Card: { paddingLG: 24, borderRadiusLG: 18 },
    Modal: { borderRadiusLG: 20 },
    Breadcrumb: {
      separatorMargin: 8,
      linkColor: '#5e6b82',
      linkHoverColor: '#2557d6',
      lastItemColor: '#15233b',
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
