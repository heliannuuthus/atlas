import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import {
  CloudServerOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import { MainLayout, Sidebar, Header, UserMenu, SearchTrigger } from '@atlas/ui'
import type { SidebarMenuItem } from '@atlas/ui'
import { DomainContext } from '@/contexts/DomainContext'
import { domainApi } from '@/services'
import { DomainSwitcher } from './DomainSwitcher'

const BRAND_COLOR = '#059669'

function buildMenus(basePath: string): SidebarMenuItem[] {
  return [
    { key: 'applications', label: '应用管理', icon: <AppstoreAddOutlined />, path: `${basePath}/applications` },
    { key: 'services', label: '服务管理', icon: <CloudServerOutlined />, path: `${basePath}/services` },
    { key: 'users', label: '用户管理', icon: <UserOutlined />, path: `${basePath}/users`, section: '平台管理' },
    { key: 'groups', label: '用户组管理', icon: <TeamOutlined />, path: `${basePath}/groups`, section: '平台管理' },
    { key: 'credentials', label: '凭证管理', icon: <SafetyOutlined />, path: `${basePath}/credentials`, section: '平台管理' },
  ]
}

const hermesLogo = {
  icon: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#059669" />
      <path d="M8 12h16M8 16h16M8 20h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  text: 'Hermes',
}

export function HermesLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { domainId } = useParams<{ domainId: string }>()
  const { data: domains = [], refresh: refreshDomains } = useRequest(() => domainApi.getList())

  if (!domainId) {
    navigate('/', { replace: true })
    return null
  }

  const basePath = `/d/${encodeURIComponent(domainId)}`
  const menus = buildMenus(basePath)

  const handleDomainChange = (newDomainId: string) => {
    if (newDomainId === domainId) return
    const prefix = `/d/${encodeURIComponent(domainId)}`
    const rest = location.pathname === prefix || location.pathname === `${prefix}/`
      ? ''
      : location.pathname.slice(prefix.length) || ''
    navigate(`/d/${encodeURIComponent(newDomainId)}${rest}`)
  }

  const currentDomain = domains.find((d) => d.domain_id === domainId)
  const currentDomainLabel = currentDomain?.name || domainId

  return (
    <DomainContext.Provider value={domainId}>
      <MainLayout
        renderSidebar={(collapsed) => (
          <Sidebar
            collapsed={collapsed}
            menus={menus}
            logo={hermesLogo}
            brandColor={BRAND_COLOR}
            onLogoClick={() => navigate(basePath)}
            selectedKeys={[location.pathname]}
            onMenuClick={(key) => navigate(key)}
          />
        )}
        header={
          <Header
            left={
              <DomainSwitcher
                domainId={domainId}
                domains={domains}
                currentLabel={currentDomainLabel}
                onDomainChange={handleDomainChange}
              />
            }
            center={<SearchTrigger />}
            right={<UserMenu brandColor={BRAND_COLOR} />}
          />
        }
      />
    </DomainContext.Provider>
  )
}
