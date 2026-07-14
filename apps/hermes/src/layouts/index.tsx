import { useNavigate, useParams } from 'react-router-dom'
import { CloudServerOutlined, AppstoreAddOutlined, TeamOutlined } from '@ant-design/icons'
import { PRODUCT_BRAND_COLORS, TopNavLayout, UserMenu } from '@atlas/ui'
import type { TopNavMenuItem } from '@atlas/ui'
import { DomainContext } from '@/contexts/DomainContext'

const BRAND_COLOR = PRODUCT_BRAND_COLORS.hermes

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
