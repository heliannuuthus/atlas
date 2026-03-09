import { useNavigate } from 'react-router-dom'
import {
  PlusOutlined,
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import styles from '../index.module.scss'

const actions = [
  { icon: <CloudServerOutlined />, label: '新建服务', path: '/services/create', color: '#18181b' },
  { icon: <AppstoreAddOutlined />, label: '新建应用', path: '/applications/create', color: '#059669' },
  { icon: <TeamOutlined />, label: '新建组', path: '/groups/create', color: '#059669' },
  { icon: <ShareAltOutlined />, label: '新建关系', path: '/relationships/graph', color: '#d97706' },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className={styles.quickActionsCard}>
      <div className={styles.cardLabel}>快捷操作</div>
      <div className={styles.quickGrid}>
        {actions.map((action) => (
          <button
            key={action.path}
            className={styles.quickBtn}
            onClick={() => navigate(action.path)}
            type="button"
          >
            <span className={styles.quickBtnIcon}>
              {action.icon}
            </span>
            <span className={styles.quickBtnLabel}>
              <PlusOutlined style={{ fontSize: 9, marginRight: 3 }} />
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
