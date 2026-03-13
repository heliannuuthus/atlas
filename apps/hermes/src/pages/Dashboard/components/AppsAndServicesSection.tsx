import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { CloudServerOutlined, AppstoreAddOutlined, LinkOutlined } from '@ant-design/icons'
import { useBasePath } from '@/contexts/DomainContext'
import type { Domain, Service, Application } from '@/types'
import styles from '../index.module.scss'

interface AppsAndServicesSectionProps {
  domains: Domain[]
  services: Service[]
  applications: Application[]
  loading?: boolean
}

export function AppsAndServicesSection({
  domains,
  services,
  applications,
  loading,
}: AppsAndServicesSectionProps) {
  const navigate = useNavigate()
  const basePath = useBasePath()

  if (loading) {
    return (
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>应用与服务</h3>
        <div className={styles.appServiceShimmer} />
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>应用与服务</h3>
      <p className={styles.sectionDesc}>
        服务承载 API 与权限模型，是关系配置的维度；应用代表接入方，需在控制台关联一个或多个服务后才能使用其能力。下方列出当前域下的服务与应用，点击可进入详情。
      </p>
      <div className={styles.appServiceGrid}>
        <div className={styles.appServiceCol}>
          <div className={styles.appServiceColHeader}>
            <CloudServerOutlined className={styles.appServiceColIcon} />
            <span>服务</span>
            <span className={styles.appServiceColCount}>{services.length}</span>
          </div>
          <ul className={styles.appServiceList}>
            {domains.map((d) => {
              const domainServices = services.filter((s) => s.domain_id === d.domain_id)
              if (domainServices.length === 0) return null
              return (
                <li key={d.domain_id} className={styles.appServiceGroup}>
                  <span className={styles.appServiceGroupName}>{d.name || d.domain_id}</span>
                  {domainServices.map((s) => (
                    <Button
                      key={s.service_id}
                      type="text"
                      className={styles.appServiceItem}
                      onClick={() => navigate(`${basePath}/services/${s.service_id}`)}
                    >
                      {s.name || s.service_id}
                    </Button>
                  ))}
                </li>
              )
            })}
          </ul>
          <Button
            type="text"
            className={styles.appServiceMore}
            onClick={() => navigate(`${basePath}/services`)}
          >
            服务 →
          </Button>
        </div>
        <div className={styles.appServiceCol}>
          <div className={styles.appServiceColHeader}>
            <AppstoreAddOutlined className={styles.appServiceColIcon} />
            <span>应用</span>
            <span className={styles.appServiceColCount}>{applications.length}</span>
          </div>
          <ul className={styles.appServiceList}>
            {domains.map((d) => {
              const domainApps = applications.filter((a) => a.domain_id === d.domain_id)
              if (domainApps.length === 0) return null
              return (
                <li key={d.domain_id} className={styles.appServiceGroup}>
                  <span className={styles.appServiceGroupName}>{d.name || d.domain_id}</span>
                  {domainApps.map((a) => (
                    <Button
                      key={a.app_id}
                      type="text"
                      className={styles.appServiceItem}
                      onClick={() => navigate(`${basePath}/applications/${a.app_id}`)}
                    >
                      {a.name || a.app_id}
                    </Button>
                  ))}
                </li>
              )
            })}
          </ul>
          <Button
            type="text"
            className={styles.appServiceMore}
            onClick={() => navigate(`${basePath}/applications`)}
          >
            应用 →
          </Button>
        </div>
      </div>
      <div className={styles.appServiceHint}>
        <LinkOutlined />
        <span>在应用详情中为应用配置「可访问服务」后，该应用即可使用对应服务的关系与 Token 能力；未关联的服务不会对该应用生效。</span>
      </div>
    </section>
  )
}
