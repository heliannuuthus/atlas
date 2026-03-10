import { useRequest } from 'ahooks'
import { domainApi, serviceApi, applicationApi, groupApi, relationshipApi } from '@/services'
import { useDomainId } from '@/contexts/DomainContext'

import { CurrentDomainStats } from './components/CurrentDomainStats'
import { OverviewCharts } from './components/OverviewCharts'
import { AppsAndServicesSection } from './components/AppsAndServicesSection'
import { RelationsByServiceSection } from './components/RelationsByServiceSection'
import { QuickActions } from './components/QuickActions'
import { RecentActivity } from './components/RecentActivity'
import styles from './index.module.scss'

export function Dashboard() {
  const domainId = useDomainId()
  const { data: currentDomain } = useRequest(
    () => domainApi.getDetail(domainId!),
    { ready: !!domainId }
  )
  const { data: services = [], loading: servicesLoading } = useRequest(
    () => serviceApi.getList(domainId!),
    { ready: !!domainId }
  )
  const { data: applications = [], loading: applicationsLoading } = useRequest(
    () => applicationApi.getList(domainId!),
    { ready: !!domainId }
  )
  const { data: allGroups = [], loading: groupsLoading } = useRequest(() => groupApi.getList())
  const { data: allRelationships = [], loading: relationshipsLoading } = useRequest(() => relationshipApi.getList())

  const serviceIds = new Set(services.map((s) => s.service_id))
  const groups = allGroups.filter((g) => serviceIds.has(g.service_id))
  const relationships = allRelationships.filter((r) => serviceIds.has(r.service_id))

  const relationshipCountByServiceId = services.reduce<Record<string, number>>((acc, s) => {
    acc[s.service_id] = relationships.filter((r) => r.service_id === s.service_id).length
    return acc
  }, {})

  const loading = servicesLoading || applicationsLoading || groupsLoading || relationshipsLoading

  return (
    <div className={styles.dashboard}>
      <header className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>概览</h2>
        <p className={styles.pageDesc}>
          本页汇总当前域下的服务、应用及以服务为维度的关系分布。可从下方卡片快速进入具体资源，或使用右侧快捷操作创建新资源、打开关系图谱。
        </p>
      </header>

      <CurrentDomainStats
        domain={currentDomain ?? null}
        domainId={domainId}
        appCount={applications.length}
        serviceCount={services.length}
        loading={!domainId}
      />

      <div className={styles.dashboardBody}>
        <main className={styles.main}>
          <OverviewCharts
            serviceCount={services.length}
            appCount={applications.length}
            relationshipCount={relationships.length}
            groupCount={groups.length}
            services={services}
            relationshipCountByServiceId={relationshipCountByServiceId}
            loading={loading}
          />
          <AppsAndServicesSection
            domains={currentDomain ? [currentDomain] : []}
            services={services}
            applications={applications}
            loading={servicesLoading || applicationsLoading}
          />
          <RelationsByServiceSection
            relationships={relationships}
            services={services}
            loading={relationshipsLoading}
          />
        </main>
        <aside className={styles.aside}>
          <QuickActions />
          <RecentActivity
            services={services}
            applications={applications}
            groups={groups}
            relationships={relationships}
            loading={loading}
          />
        </aside>
      </div>
    </div>
  )
}
