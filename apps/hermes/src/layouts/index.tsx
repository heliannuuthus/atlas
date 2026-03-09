import { useNavigate, useLocation } from 'react-router-dom'
import {
  ApartmentOutlined,
  CloudServerOutlined,
  AppstoreAddOutlined,
  ShareAltOutlined,
  TeamOutlined,
  DashboardOutlined,
  NodeIndexOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  FileSearchOutlined,
} from '@ant-design/icons'
import { MainLayout, Sidebar, Breadcrumb, Header, UserMenu, SearchTrigger } from '@atlas/ui'
import type { SidebarMenuItem } from '@atlas/ui'

const BRAND_COLOR = '#059669'

const hermesMenus: SidebarMenuItem[] = [
  { key: 'dashboard', label: '概览', icon: <DashboardOutlined />, path: '/dashboard' },
  { key: 'domains', label: '域管理', icon: <ApartmentOutlined />, path: '/domains', section: '身份管理' },
  { key: 'services', label: '服务管理', icon: <CloudServerOutlined />, path: '/services' },
  { key: 'applications', label: '应用管理', icon: <AppstoreAddOutlined />, path: '/applications' },
  {
    key: 'relationships',
    label: '关系管理',
    icon: <ShareAltOutlined />,
    path: '/relationships',
    section: '访问控制',
    children: [
      { key: 'rel-list', label: '关系列表', icon: <UnorderedListOutlined />, path: '/relationships' },
      { key: 'rel-graph', label: '关系图谱', icon: <NodeIndexOutlined />, path: '/relationships/graph' },
    ],
  },
  { key: 'groups', label: '组管理', icon: <TeamOutlined />, path: '/groups' },
  { key: 'logs', label: '审计日志', icon: <FileSearchOutlined />, path: '/logs', bottom: true },
  { key: 'settings', label: '设置', icon: <SettingOutlined />, path: '/settings', bottom: true },
]

const hermesLogo = {
  icon: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#059669" />
      <path d="M8 12h16M8 16h16M8 20h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  text: 'Hermes',
}

const breadcrumbConfig = {
  appName: 'Hermes',
  defaultPath: '/dashboard',
  routeNameMap: {
    domains: '域管理',
    services: '服务管理',
    applications: '应用管理',
    relationships: '关系管理',
    groups: '组管理',
    graph: '关系图谱',
    logs: '审计日志',
    settings: '设置',
  },
}

export function HermesLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <MainLayout
      renderSidebar={(collapsed) => (
        <Sidebar
          collapsed={collapsed}
          menus={hermesMenus}
          logo={hermesLogo}
          brandColor={BRAND_COLOR}
          onLogoClick={() => navigate('/dashboard')}
          selectedKeys={[location.pathname]}
          onMenuClick={(key) => navigate(key)}
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
