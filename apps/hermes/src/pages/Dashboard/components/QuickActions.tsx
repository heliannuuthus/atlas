import { Button } from 'antd'
import {
  PlusOutlined,
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { useAppNavigate } from '@/contexts/DomainContext'
import styles from '../index.module.scss'

const actions = [
  { icon: <CloudServerOutlined />, label: '创建服务', path: 'services', openCreate: true, color: '#18181b' },
  { icon: <AppstoreAddOutlined />, label: '创建应用', path: 'applications', openCreate: true, color: '#059669' },
  { icon: <TeamOutlined />, label: '创建组', path: 'groups/create', color: '#059669' },
  { icon: <ShareAltOutlined />, label: '配置关系', path: 'relationships/graph', color: '#d97706' },
]

export function QuickActions() {
  const navigate = useAppNavigate()

  return (
    <div className={styles.quickActionsCard}>
      <div className={styles.cardLabel}>快捷操作</div>
      <div className={styles.cardDescSmall}>创建服务、应用或组，或打开关系图谱配置主体与对象的权限。</div>
      <div className={styles.quickGrid}>
        {actions.map((action) => (
          <Button
            key={action.path + (action.openCreate ? ':create' : '')}
            type="text"
            className={styles.quickBtn}
            onClick={() =>
              navigate(`/${action.path}`, action.openCreate ? { state: { openCreate: true } } : undefined)
            }
          >
            <span className={styles.quickBtnIcon}>{action.icon}</span>
            <span className={styles.quickBtnLabel}>
              <PlusOutlined style={{ fontSize: 9, marginRight: 3 }} />
              {action.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}
