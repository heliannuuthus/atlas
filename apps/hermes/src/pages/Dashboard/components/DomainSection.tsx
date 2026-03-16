import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ApartmentOutlined } from '@ant-design/icons'
import { useBasePath } from '@/contexts/DomainContext'
import type { Domain, Service, Application } from '@/types'
import styles from '../index.module.scss'

interface DomainSectionProps {
  domains: Domain[]
  services: Service[]
  applications: Application[]
  loading?: boolean
}

export function DomainSection({ domains, services, applications, loading }: DomainSectionProps) {
  const navigate = useNavigate()
  const basePath = useBasePath()

  const domainStats = domains.map(d => ({
    ...d,
    serviceCount: services.filter(s => s.domain_id === d.domain_id).length,
    appCount: applications.filter(a => a.domain_id === d.domain_id).length,
  }))

  if (loading) {
    return (
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>域</h3>
        <div className={styles.domainGrid}>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.domainCardShimmer} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>域</h3>
      <p className={styles.sectionDesc}>
        当前工作域的基本信息。每个域下的应用与服务数量会在此展示，点击卡片可进入域详情查看该域下的服务列表与应用列表。
      </p>
      <div className={styles.domainGrid}>
        {domainStats.map(d => (
          <Button
            key={d.domain_id}
            type="text"
            className={styles.domainCard}
            onClick={() => navigate(`${basePath}/domains`)}
          >
            <div className={styles.domainCardIcon}>
              <ApartmentOutlined />
            </div>
            <div className={styles.domainCardBody}>
              <span className={styles.domainCardName}>{d.name || d.domain_id}</span>
              <span className={styles.domainCardMeta}>
                {d.appCount} 应用 · {d.serviceCount} 服务
              </span>
            </div>
          </Button>
        ))}
      </div>
    </section>
  )
}
