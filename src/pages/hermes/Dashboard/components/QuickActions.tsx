import { Card, Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  PlusOutlined,
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import styles from '../index.module.scss'

export function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      icon: <CloudServerOutlined />,
      label: '新建服务',
      path: '/hermes/services/create',
    },
    {
      icon: <AppstoreAddOutlined />,
      label: '新建应用',
      path: '/hermes/applications/create',
    },
    {
      icon: <TeamOutlined />,
      label: '新建组',
      path: '/hermes/groups/create',
    },
    {
      icon: <ShareAltOutlined />,
      label: '新建关系',
      path: '/hermes/relationships/graph',
    },
  ]

  return (
    <Card title="快捷操作" className={styles.quickActions}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {actions.map((action) => (
          <Button
            key={action.path}
            icon={action.icon}
            onClick={() => navigate(action.path)}
            block
            className={styles.actionButton}
          >
            <PlusOutlined style={{ fontSize: 10, marginRight: 4 }} />
            {action.label}
          </Button>
        ))}
      </Space>
    </Card>
  )
}
