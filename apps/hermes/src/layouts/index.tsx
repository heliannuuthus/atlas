import { useNavigate, useParams } from 'react-router-dom'
import { CloudServerOutlined, AppstoreAddOutlined, TeamOutlined } from '@ant-design/icons'
import { TopNavLayout, UserMenu } from '@atlas/ui'
import type { TopNavMenuItem } from '@atlas/ui'
import { DomainContext } from '@/contexts/DomainContext'

const BRAND_COLOR = '#059669'

function buildMenus(basePath: string): TopNavMenuItem[] {
  return [
    {
      key: 'applications',
      label: '应用',
      icon: <AppstoreAddOutlined />,
      path: `${basePath}/applications`,
    },
    { key: 'services', label: '服务', icon: <CloudServerOutlined />, path: `${basePath}/services` },
    { key: 'groups', label: '组', icon: <TeamOutlined />, path: `${basePath}/groups` },
  ]
}

const hermesLogo = {
  icon: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#hg)" />
      <path
        d="M10 22V10h3v4.5h6V10h3v12h-3v-5h-6v5z"
        fill="#fff"
      />
    </svg>
  ),
  text: 'Hermes',
}

export function HermesLayout() {
  const navigate = useNavigate()
  const { domainId } = useParams<{ domainId: string }>()

  if (!domainId) {
    navigate('/', { replace: true })
    return null
  }

  const basePath = `/d/${encodeURIComponent(domainId)}`
  const menus = buildMenus(basePath)

  return (
    <DomainContext.Provider value={domainId}>
      <TopNavLayout
        logo={hermesLogo}
        menus={menus}
        brandColor={BRAND_COLOR}
        onLogoClick={() => navigate(basePath)}
        onMenuClick={path => navigate(path)}
        right={<UserMenu brandColor={BRAND_COLOR} />}
      />
    </DomainContext.Provider>
  )
}
