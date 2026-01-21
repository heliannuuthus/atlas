import { useNavigate, useLocation } from 'react-router-dom'
import { Tabs, Badge } from 'antd'
import type { TabsProps } from 'antd'
import { useBusinessStore } from '@/store/business'
import { getEnabledBusinesses, getBusinessIcon } from '@/config/business'
import styles from './index.module.scss'

export function BusinessTabs() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentBusiness, recentBusinesses, setCurrentBusiness } =
    useBusinessStore()

  const enabledBusinesses = getEnabledBusinesses()
  const tabs = recentBusinesses.length > 0 ? recentBusinesses : enabledBusinesses

  const tabItems: TabsProps['items'] = tabs.map((business) => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const isCurrentPath = pathSegments[0] === business.id

    return {
      key: business.id,
      label: (
        <span className={styles.tabLabel}>
          <span className={styles.tabIcon}>{getBusinessIcon(business.icon)}</span>
          <span className={styles.tabName}>{business.name}</span>
          {isCurrentPath && <Badge status="processing" className={styles.badge} />}
        </span>
      ),
      closable: tabs.length > 1,
    }
  })

  const handleTabChange = (activeKey: string) => {
    const business = enabledBusinesses.find((b) => b.id === activeKey)
    if (business) {
      setCurrentBusiness(business)
      navigate(business.path)
    }
  }

  const handleTabEdit = (
    targetKey: string | React.MouseEvent | React.KeyboardEvent,
    action: 'add' | 'remove'
  ) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      const remainingTabs = tabs.filter((t) => t.id !== targetKey)
      if (remainingTabs.length > 0) {
        const nextBusiness = remainingTabs[0]
        setCurrentBusiness(nextBusiness)
        navigate(nextBusiness.path)
      }
    }
  }

  if (tabs.length <= 1) {
    return null
  }

  return (
    <div className={styles.businessTabs}>
      <Tabs
        activeKey={currentBusiness?.id || tabs[0]?.id}
        items={tabItems}
        onChange={handleTabChange}
        onEdit={handleTabEdit}
        type="editable-card"
        hideAdd
        size="small"
        className={styles.tabs}
      />
    </div>
  )
}
