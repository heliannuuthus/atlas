import { useRequest } from 'ahooks'
import {
  ApartmentOutlined,
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { domainApi, serviceApi, applicationApi, groupApi, relationshipApi } from '@/services'

import { StatCard } from './components/StatCard'
import { QuickActions } from './components/QuickActions'
import { RecentActivity } from './components/RecentActivity'
import { RelationGraphPreview } from './components/RelationGraphPreview'
import styles from './index.module.scss'

export function Dashboard() {
  const { data: domains, loading: domainsLoading } = useRequest(() => domainApi.getList())
  const { data: services, loading: servicesLoading } = useRequest(() => serviceApi.getList())
  const { data: applications, loading: applicationsLoading } = useRequest(() => applicationApi.getList())
  const { data: groups, loading: groupsLoading } = useRequest(() => groupApi.getList())
  const { data: relationships, loading: relationshipsLoading } = useRequest(() => relationshipApi.getList())

  const loading = domainsLoading || servicesLoading || applicationsLoading || groupsLoading || relationshipsLoading

  return (
    <div className={styles.dashboard}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>概览</h2>
        <p className={styles.pageDesc}>身份与访问管理</p>
      </div>

      <div className={styles.statsRow}>
        <StatCard icon={<ApartmentOutlined />} title="域" count={domains?.length ?? 0} color="#059669" path="/domains" loading={domainsLoading} />
        <StatCard icon={<CloudServerOutlined />} title="服务" count={services?.length ?? 0} color="#18181b" path="/services" loading={servicesLoading} />
        <StatCard icon={<AppstoreAddOutlined />} title="应用" count={applications?.length ?? 0} color="#059669" path="/applications" loading={applicationsLoading} />
        <StatCard icon={<TeamOutlined />} title="组" count={groups?.length ?? 0} color="#047857" path="/groups" loading={groupsLoading} />
        <StatCard icon={<ShareAltOutlined />} title="关系" count={relationships?.length ?? 0} color="#d97706" path="/relationships" loading={relationshipsLoading} />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.mainLeft}>
          <RelationGraphPreview relationships={relationships ?? []} loading={relationshipsLoading} />
        </div>
        <div className={styles.mainRight}>
          <QuickActions />
          <RecentActivity
            services={services ?? []}
            applications={applications ?? []}
            groups={groups ?? []}
            relationships={relationships ?? []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
