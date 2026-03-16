import { useState, useMemo } from 'react'
import { Input, Collapse, Typography, Empty, ConfigProvider } from 'antd'
import type { ThemeConfig } from 'antd'
import { SearchOutlined, UserOutlined, TeamOutlined, AppstoreOutlined } from '@ant-design/icons'
import type { Application, Group } from '@/types'
import styles from './index.module.scss'

const { Text } = Typography

const collapseTheme: ThemeConfig = {
  components: {
    Collapse: {
      headerBg: 'transparent',
      contentBg: 'transparent',
      headerPadding: '10px 16px',
      contentPadding: 0,
    },
  },
}

interface AddNodesProps {
  users: string[] // 简化为用户 ID 列表
  groups: Group[]
  applications: Application[]
  onDragStart: (
    event: React.DragEvent,
    nodeType: 'subject' | 'object',
    data: { type: string; id: string; label?: string }
  ) => void
}

interface EntityItem {
  type: string
  id: string
  label?: string
}

export function AddNodes({ users, groups, applications, onDragStart }: AddNodesProps) {
  const [searchValue, setSearchValue] = useState('')

  // 构建实体列表
  const entities = useMemo(() => {
    const userList: EntityItem[] = users.map(id => ({
      type: 'user',
      id,
    }))

    const groupList: EntityItem[] = groups.map(g => ({
      type: 'group',
      id: g.group_id,
      label: g.name,
    }))

    const appList: EntityItem[] = applications.map(a => ({
      type: 'application',
      id: a.app_id,
      label: a.name,
    }))

    return { userList, groupList, appList }
  }, [users, groups, applications])

  // 搜索过滤
  const filteredEntities = useMemo(() => {
    const search = searchValue.toLowerCase().trim()
    if (!search) return entities

    const filterList = (list: EntityItem[]) =>
      list.filter(
        item => item.id.toLowerCase().includes(search) || item.label?.toLowerCase().includes(search)
      )

    return {
      userList: filterList(entities.userList),
      groupList: filterList(entities.groupList),
      appList: filterList(entities.appList),
    }
  }, [entities, searchValue])

  const handleDragStart = (
    event: React.DragEvent,
    item: EntityItem,
    nodeType: 'subject' | 'object'
  ) => {
    onDragStart(event, nodeType, item)
  }

  const renderEntityList = (
    items: EntityItem[],
    icon: React.ReactNode,
    color: string,
    nodeType: 'subject' | 'object'
  ) => {
    if (items.length === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />
    }

    return (
      <div className={styles.entityList}>
        {items.map(item => (
          <div
            key={`${item.type}:${item.id}`}
            className={styles.entityItem}
            draggable
            onDragStart={e => handleDragStart(e, item, nodeType)}
          >
            <span className={styles.entityIcon} style={{ color }}>
              {icon}
            </span>
            <div className={styles.entityInfo}>
              <Text ellipsis className={styles.entityId}>
                {item.id}
              </Text>
              {item.label && (
                <Text type="secondary" ellipsis className={styles.entityLabel}>
                  {item.label}
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const collapseItems = [
    {
      key: 'users',
      label: (
        <div className={styles.collapseHeader}>
          <UserOutlined style={{ color: '#171717' }} />
          <span>用户</span>
          <span className={styles.count}>{filteredEntities.userList.length}</span>
        </div>
      ),
      children: renderEntityList(filteredEntities.userList, <UserOutlined />, '#171717', 'subject'),
    },
    {
      key: 'groups',
      label: (
        <div className={styles.collapseHeader}>
          <TeamOutlined style={{ color: '#4d7c0f' }} />
          <span>组</span>
          <span className={styles.count}>{filteredEntities.groupList.length}</span>
        </div>
      ),
      children: renderEntityList(
        filteredEntities.groupList,
        <TeamOutlined />,
        '#4d7c0f',
        'subject'
      ),
    },
    {
      key: 'applications',
      label: (
        <div className={styles.collapseHeader}>
          <AppstoreOutlined style={{ color: '#059669' }} />
          <span>应用</span>
          <span className={styles.count}>{filteredEntities.appList.length}</span>
        </div>
      ),
      children: renderEntityList(
        filteredEntities.appList,
        <AppstoreOutlined />,
        '#059669',
        'subject'
      ),
    },
  ]

  return (
    <div className={styles.addNodes}>
      <div className={styles.addNodesHeader}>
        <Text strong>节点面板</Text>
      </div>

      <div className={styles.searchWrapper}>
        <Input
          placeholder="搜索节点..."
          prefix={<SearchOutlined />}
          allowClear
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
      </div>

      <div className={styles.hint}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          拖拽节点到画布建立关系
        </Text>
      </div>

      <div className={styles.collapseWrapper}>
        <ConfigProvider theme={collapseTheme}>
          <Collapse
            items={collapseItems}
            defaultActiveKey={['users', 'groups', 'applications']}
            bordered={false}
            expandIconPosition="end"
          />
        </ConfigProvider>
      </div>
    </div>
  )
}
