import { useMemo } from 'react'
import { Card, List, Typography, Tag } from 'antd'
import type { CardProps } from 'antd'
import {
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { isExpiringSoon, formatRelativeTime } from '@/utils/format'
import type { Service, Application, Group, Relationship } from '@/types/hermes'
import styles from '../index.module.scss'

const { Text } = Typography

interface RecentActivityProps {
  services: Service[]
  applications: Application[]
  groups: Group[]
  relationships: Relationship[]
  loading?: boolean
}

interface ActivityItem {
  type: 'service' | 'application' | 'group' | 'relationship'
  id: string
  name: string
  action: string
  time: string
  warning?: boolean
}

export function RecentActivity({
  services,
  applications,
  groups,
  relationships,
  loading,
}: RecentActivityProps) {
  // 合并所有实体并按更新时间排序
  const activities: ActivityItem[] = []

  // 服务
  services.slice(0, 3).forEach(s => {
    activities.push({
      type: 'service',
      id: s.service_id,
      name: s.name,
      action: '已更新',
      time: s.updated_at,
    })
  })

  // 应用
  applications.slice(0, 3).forEach(a => {
    activities.push({
      type: 'application',
      id: a.app_id,
      name: a.name,
      action: '已更新',
      time: a.updated_at,
    })
  })

  // 组
  groups.slice(0, 2).forEach(g => {
    activities.push({
      type: 'group',
      id: g.group_id,
      name: g.name,
      action: '已更新',
      time: g.updated_at,
    })
  })

  // 即将过期的关系
  relationships
    .filter(r => r.expires_at && isExpiringSoon(r.expires_at))
    .slice(0, 3)
    .forEach(r => {
      activities.push({
        type: 'relationship',
        id: `${r.subject_id}-${r.object_id}`,
        name: `${r.subject_id} → ${r.object_id}`,
        action: formatRelativeTime(r.expires_at!),
        time: r.expires_at!,
        warning: true,
      })
    })

  // 按时间排序
  activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'service':
        return <CloudServerOutlined style={{ color: '#1677ff' }} />
      case 'application':
        return <AppstoreAddOutlined style={{ color: '#722ed1' }} />
      case 'group':
        return <TeamOutlined style={{ color: '#52c41a' }} />
      case 'relationship':
        return <ShareAltOutlined style={{ color: '#fa8c16' }} />
    }
  }

  const getTypeLabel = (type: ActivityItem['type']) => {
    switch (type) {
      case 'service':
        return '服务'
      case 'application':
        return '应用'
      case 'group':
        return '组'
      case 'relationship':
        return '关系'
    }
  }

  const cardStyles = useMemo<CardProps['styles']>(
    () => ({
      body: { padding: '0 16px 16px' },
    }),
    []
  )

  const listItemStyle = useMemo<React.CSSProperties>(
    () => ({
      padding: '12px 0',
    }),
    []
  )

  const tagStyle = useMemo<React.CSSProperties>(
    () => ({
      margin: 0,
      fontSize: 11,
      padding: '0 6px',
      lineHeight: '18px',
    }),
    []
  )

  return (
    <Card title="最近动态" className={styles.recentActivity} styles={cardStyles}>
      <List
        loading={loading}
        dataSource={activities.slice(0, 6)}
        renderItem={item => (
          <List.Item style={listItemStyle}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>{getIcon(item.type)}</div>
              <div className={styles.activityContent}>
                <div className={styles.activityTitle}>
                  <Tag bordered={false} style={tagStyle}>
                    {getTypeLabel(item.type)}
                  </Tag>
                  <Text strong>{item.name}</Text>
                </div>
                <div className={styles.activityMeta}>
                  {item.warning ? (
                    <Text type="warning">
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {item.action}
                    </Text>
                  ) : (
                    <Text type="secondary">{item.action}</Text>
                  )}
                </div>
              </div>
            </div>
          </List.Item>
        )}
        locale={{ emptyText: '暂无动态' }}
      />
    </Card>
  )
}
