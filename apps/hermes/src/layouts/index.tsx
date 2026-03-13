import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import {
  CloudServerOutlined,
  AppstoreAddOutlined,
  ShareAltOutlined,
  TeamOutlined,
  DashboardOutlined,
  NodeIndexOutlined,
  UnorderedListOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { Select, Divider, Button } from 'antd'
import { MainLayout, Sidebar, Header, UserMenu, SearchTrigger } from '@atlas/ui'
import type { SidebarMenuItem } from '@atlas/ui'
import { DomainContext } from '@/contexts/DomainContext'
import { domainApi } from '@/services'

const BRAND_COLOR = '#059669'

function buildMenus(basePath: string): SidebarMenuItem[] {
  return [
    { key: 'applications', label: '应用', icon: <AppstoreAddOutlined />, path: `${basePath}/applications` },
    { key: 'services', label: '服务', icon: <CloudServerOutlined />, path: `${basePath}/services` },
    { key: 'groups', label: '组', icon: <TeamOutlined />, path: `${basePath}/groups`, section: '平台管理' },
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
  const { data: domains = [] } = useRequest(() => domainApi.getList())

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
              <Select
                value={domainId}
                onChange={handleDomainChange}
                options={domains.map((d) => ({ label: d.name || d.domain_id, value: d.domain_id }))}
                placeholder="选择域"
                style={{ minWidth: 160 }}
                size="middle"
                popupRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <div style={{ padding: '0 4px 4px' }}>
                      <Button
                        type="text"
                        size="small"
                        block
                        style={{ textAlign: 'left' }}
                        onClick={() => navigate('/', { replace: true })}
                      >
                        前往域列表
                      </Button>
                    </div>
                  </>
                )}
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
