import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { MainLayout, Sidebar, Breadcrumb, Header, UserMenu, SearchTrigger } from '@atlas/ui'
import type { SidebarMenuItem } from '@atlas/ui'

const BRAND_COLOR = '#d97706'

const chaosMenus: SidebarMenuItem[] = [
  { key: 'dashboard', label: '概览', icon: <DashboardOutlined />, path: '/dashboard' },
  {
    key: 'templates',
    label: '邮件模板',
    icon: <FileTextOutlined />,
    path: '/templates',
    section: '内容管理',
  },
  { key: 'files', label: '文件管理', icon: <CloudUploadOutlined />, path: '/files' },
  { key: 'settings', label: '设置', icon: <SettingOutlined />, path: '/settings', bottom: true },
]

const chaosLogo = {
  icon: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#d97706" />
      <path d="M10 10l12 12M22 10l-12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  text: 'Chaos',
}

const breadcrumbConfig = {
  appName: 'Chaos',
  defaultPath: '/dashboard',
  routeNameMap: {
    templates: '邮件模板',
    files: '文件管理',
    settings: '设置',
  },
}

export function ChaosLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <MainLayout
      renderSidebar={collapsed => (
        <Sidebar
          collapsed={collapsed}
          menus={chaosMenus}
          logo={chaosLogo}
          brandColor={BRAND_COLOR}
          onLogoClick={() => navigate('/dashboard')}
          selectedKeys={[location.pathname]}
          onMenuClick={key => navigate(key)}
        />
      )}
      header={
        <Header
          left={<Breadcrumb config={breadcrumbConfig} />}
          center={<SearchTrigger />}
          right={<UserMenu brandColor={BRAND_COLOR} />}
        />
      }
    />
  )
}
