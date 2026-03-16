import {
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { isExpiringSoon, formatRelativeTime } from '@atlas/shared'
import type { Service, Application, Group, Relationship } from '@/types'
import styles from '../index.module.scss'

interface RecentActivityProps {
  services: Service[]
  applications: Application[]
  groups: Group[]
  relationships: Relationship[]
  loading?: boolean
}

interface ActivityItem {
  type: 'service' | 'application' | 'group' | 'relationship'
  name: string
  action: string
  time: string
  warning?: boolean
}

const typeConfig = {
  service: { icon: <CloudServerOutlined />, label: '服务', color: '#18181b' },
  application: { icon: <AppstoreAddOutlined />, label: '应用', color: '#059669' },
  group: { icon: <TeamOutlined />, label: '组', color: '#059669' },
  relationship: { icon: <ShareAltOutlined />, label: '关系', color: '#d97706' },
}

export function RecentActivity({
  services,
  applications,
  groups,
  relationships,
  loading,
}: RecentActivityProps) {
  const activities: ActivityItem[] = []

  services.slice(0, 3).forEach(s => {
    activities.push({ type: 'service', name: s.name, action: '已更新', time: s.updated_at })
  })
  applications.slice(0, 3).forEach(a => {
    activities.push({ type: 'application', name: a.name, action: '已更新', time: a.updated_at })
  })
  groups.slice(0, 2).forEach(g => {
    activities.push({ type: 'group', name: g.name, action: '已更新', time: g.updated_at })
  })
  relationships
    .filter(r => r.expires_at && isExpiringSoon(r.expires_at))
    .slice(0, 3)
    .forEach(r => {
      activities.push({
        type: 'relationship',
        name: `${r.subject_id} → ${r.object_id}`,
        action: formatRelativeTime(r.expires_at!),
        time: r.expires_at!,
        warning: true,
      })
    })

  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  if (loading) {
    return (
      <div className={styles.activityCard}>
        <div className={styles.cardLabel}>最近动态</div>
        <div className={styles.cardDescSmall}>
          基于更新时间与即将过期的关系汇总，便于快速关注变更与即将到期的权限。
        </div>
        <div className={styles.activityEmpty}>加载中...</div>
      </div>
    )
  }

  return (
    <div className={styles.activityCard}>
      <div className={styles.cardLabel}>最近动态</div>
      <div className={styles.cardDescSmall}>
        基于更新时间与即将过期的关系汇总，便于快速关注变更与即将到期的权限。
      </div>
      {activities.length === 0 ? (
        <div className={styles.activityEmpty}>暂无动态</div>
      ) : (
        <div className={styles.timeline}>
          {activities.slice(0, 8).map((item, i) => {
            const cfg = typeConfig[item.type]
            return (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot} style={{ color: cfg.color }}>
                  {cfg.icon}
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineRow}>
                    <span className={styles.timelineTag}>{cfg.label}</span>
                    <span className={styles.timelineName}>{item.name}</span>
                  </div>
                  <div className={styles.timelineAction}>
                    {item.warning ? (
                      <span className={styles.timelineWarning}>
                        <ClockCircleOutlined style={{ marginRight: 3 }} />
                        {item.action}
                      </span>
                    ) : (
                      <span>{item.action}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
