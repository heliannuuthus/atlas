import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppWindow, ScrollText, Server, ShieldCheck, Search, Users } from 'lucide-react'
import { Breadcrumb } from '@atlas/ui/breadcrumb'
import { PRODUCT_BRAND_COLORS } from '@atlas/ui/brand-colors'
import { Header } from '@atlas/ui/header'
import { MainLayout } from '@atlas/ui/main-layout'
import { Sidebar, type SidebarMenuItem } from '@atlas/ui/sidebar'
import { UserMenu } from '@atlas/ui/user-menu'
import { DomainContext } from '@/contexts/DomainContext'
import { DomainSwitcher } from '@/components/DomainSwitcher'

const BRAND_COLOR = PRODUCT_BRAND_COLORS.hermes

function buildMenus(basePath: string): SidebarMenuItem[] {
  return [
    {
      key: 'applications',
      label: '应用管理',
      icon: <AppWindow />,
      path: `${basePath}/applications`,
    },
    {
      key: 'services',
      label: '服务管理',
      icon: <Server />,
      path: `${basePath}/services`,
    },
    {
      key: 'users',
      label: '用户查询',
      icon: <Search />,
      path: `${basePath}/users`,
    },
    {
      key: 'groups',
      label: '用户组',
      icon: <Users />,
      path: `${basePath}/groups`,
    },
    {
      key: 'relationships',
      label: '权限关系',
      icon: <ShieldCheck />,
      path: `${basePath}/relationships`,
    },
    {
      key: 'audit',
      label: '审计信息',
      icon: <ScrollText />,
      path: `${basePath}/audit`,
    },
  ]
}

function getSelectedPath(menus: SidebarMenuItem[], pathname: string, basePath: string) {
  const paths = menus
    .map(menu => menu.path)
    .filter(path => path !== '/')
    .sort((a, b) => b.length - a.length)

  return paths.find(path => pathname === path || pathname.startsWith(`${path}/`)) ?? basePath
}

const hermesLogo = { text: '概览' }

export function HermesLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { domainId } = useParams<{ domainId: string }>()

  const basePath = domainId ? `/d/${encodeURIComponent(domainId)}` : ''
  const menus = useMemo(() => buildMenus(basePath), [basePath])
  const selectedPath = getSelectedPath(menus, location.pathname, basePath)
  const breadcrumbConfig = useMemo(
    () => ({
      appName: '首页',
      defaultPath: basePath,
      basePath,
      routeNameMap: {
        home: '概览',
        applications: '应用管理',
        services: '服务管理',
        users: '用户查询',
        groups: '用户组',
        relationships: '权限关系',
        audit: '审计信息',
      },
    }),
    [basePath]
  )
  const showBreadcrumb = location.pathname !== basePath

  if (!domainId) return <Navigate to="/" replace />

  return (
    <DomainContext.Provider value={domainId}>
      <MainLayout
        renderSidebar={collapsed => (
          <Sidebar
            collapsed={collapsed}
            menus={menus}
            logo={hermesLogo}
            brandColor={BRAND_COLOR}
            envLabel={domainId}
            logoActive={location.pathname === basePath}
            onLogoClick={() => navigate(basePath)}
            selectedKeys={[selectedPath]}
            onMenuClick={path => navigate(path)}
          />
        )}
        header={
          <Header
            left={<DomainSwitcher currentDomainId={domainId} />}
            right={<UserMenu brandColor={BRAND_COLOR} showDocs />}
          />
        }
        contentHeader={showBreadcrumb ? <Breadcrumb config={breadcrumbConfig} /> : null}
      />
    </DomainContext.Provider>
  )
}
