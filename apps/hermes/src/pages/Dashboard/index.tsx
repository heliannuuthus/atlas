import { useRequest } from 'ahooks'
import { domainApi, serviceApi, applicationApi, groupApi, relationshipApi } from '@/services'
import { useDomainId } from '@/contexts/DomainContext'

import { OverviewCharts } from './components/OverviewCharts'
import styles from './index.module.scss'

export function Dashboard() {
  const domainId = useDomainId()
  const { data: currentDomain, loading: domainLoading } = useRequest(
    () => domainApi.getDetail(domainId!),
    { ready: !!domainId }
  )
  const { data: servicesData, loading: servicesLoading } = useRequest(
    () => serviceApi.getList(domainId!),
    { ready: !!domainId }
  )
  const { data: applicationsData, loading: applicationsLoading } = useRequest(
    () => applicationApi.getList(domainId!),
    { ready: !!domainId }
  )
  const { data: groupsData, loading: groupsLoading } = useRequest(() => groupApi.getList())
  const { data: relationshipsData, loading: relationshipsLoading } = useRequest(() =>
    relationshipApi.getList()
  )

  const services = servicesData?.items ?? []
  const applications = applicationsData?.items ?? []
  const allGroups = groupsData?.items ?? []
  const allRelationships = relationshipsData?.items ?? []

  const serviceIds = new Set(services.map(s => s.service_id))
  const groups = allGroups.filter(g => serviceIds.has(g.service_id))
  const relationships = allRelationships.filter(r => serviceIds.has(r.service_id))

  const relationshipCountByServiceId = services.reduce<Record<string, number>>((acc, s) => {
    acc[s.service_id] = relationships.filter(r => r.service_id === s.service_id).length
    return acc
  }, {})

  const chartsLoading =
    servicesLoading || applicationsLoading || groupsLoading || relationshipsLoading

  return (
    <div className={styles.dashboard}>
      <div className={styles.domainIntro}>
        {domainLoading || !domainId ? (
          <div className={styles.domainIntroShimmer} />
        ) : (
          <>
            <h1 className={styles.domainName}>{currentDomain?.name || domainId}</h1>
            {currentDomain?.description && (
              <p className={styles.domainDesc}>{currentDomain.description}</p>
            )}
            <p className={styles.domainId}>域 ID：{domainId}</p>
          </>
        )}
      </div>

      <OverviewCharts
        serviceCount={services.length}
        appCount={applications.length}
        relationshipCount={relationships.length}
        groupCount={groups.length}
        services={services}
        relationshipCountByServiceId={relationshipCountByServiceId}
        loading={chartsLoading}
      />
    </div>
  )
}
