import { ApartmentOutlined, AppstoreOutlined, CloudServerOutlined } from '@ant-design/icons'
import type { Domain } from '@/types'
import styles from '../index.module.scss'

interface CurrentDomainStatsProps {
  domain: Domain | null
  domainId: string | null
  appCount: number
  serviceCount: number
  loading?: boolean
}

export function CurrentDomainStats({
  domain,
  domainId,
  appCount,
  serviceCount,
  loading,
}: CurrentDomainStatsProps) {
  if (loading || !domainId) {
    return (
      <div className={styles.currentDomainStrip}>
        <div className={styles.currentDomainShimmer} />
      </div>
    )
  }

  return (
    <div className={styles.currentDomainStrip}>
      <div className={styles.currentDomainMain}>
        <div className={styles.currentDomainName}>
          <ApartmentOutlined />
          <span>{domain?.name || domainId}</span>
        </div>
        {domain?.description && (
          <div className={styles.currentDomainDesc}>{domain.description}</div>
        )}
      </div>
      <div className={styles.currentDomainMeta}>
        <span className={styles.currentDomainStat}>
          <CloudServerOutlined />
          {serviceCount} 个服务
        </span>
        <span className={styles.currentDomainStat}>
          <AppstoreOutlined />
          {appCount} 个应用
        </span>
      </div>
    </div>
  )
}
