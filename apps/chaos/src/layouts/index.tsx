import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  PRODUCT_BRAND_COLORS,
  MainLayout,
  Sidebar,
  Breadcrumb,
  Header,
  UserMenu,
  SearchTrigger,
} from '@atlas/ui'
import type { SidebarMenuItem } from '@atlas/ui'

const BRAND_COLOR = PRODUCT_BRAND_COLORS.chaos

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
