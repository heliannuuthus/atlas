import { Button, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FullscreenOutlined, NodeIndexOutlined } from '@ant-design/icons'
import type { Relationship } from '@/types'
import styles from '../index.module.scss'

interface RelationGraphPreviewProps {
  relationships: Relationship[]
  loading?: boolean
}

export function RelationGraphPreview({ relationships, loading }: RelationGraphPreviewProps) {
  const navigate = useNavigate()
  const previewRelations = relationships.slice(0, 5)

  return (
    <div className={styles.graphCard}>
      <div className={styles.graphCardHeader}>
        <span className={styles.cardLabel}>关系图谱预览</span>
        <button
          className={styles.graphExpandBtn}
          onClick={() => navigate('/relationships/graph')}
          type="button"
        >
          <FullscreenOutlined />
          全屏
        </button>
      </div>

      {loading ? (
        <div className={styles.graphLoading}>加载中...</div>
      ) : previewRelations.length > 0 ? (
        <div className={styles.graphBody}>
          <div className={styles.relationList}>
            {previewRelations.map((rel, index) => (
              <div key={index} className={styles.relationItem}>
                <div className={styles.relationEntity}>
                  <span className={styles.entityType}>{rel.subject_type}</span>
                  <span className={styles.entityId}>{rel.subject_id}</span>
                </div>
                <div className={styles.relationBadge}>{rel.relation}</div>
                <span className={styles.relationArrowIcon}>→</span>
                <div className={styles.relationEntity}>
                  <span className={styles.entityType}>{rel.object_type}</span>
                  <span className={styles.entityId}>{rel.object_id}</span>
                </div>
              </div>
            ))}
          </div>
          {relationships.length > 5 && (
            <div className={styles.moreHint}>
              还有 {relationships.length - 5} 条关系
            </div>
          )}
          <Button
            type="primary"
            icon={<NodeIndexOutlined />}
            onClick={() => navigate('/relationships/graph')}
            style={{ borderRadius: 8, marginTop: 8 }}
          >
            打开关系图谱编辑器
          </Button>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无关系数据">
          <Button type="primary" onClick={() => navigate('/relationships/graph')} style={{ borderRadius: 8 }}>
            创建第一条关系
          </Button>
        </Empty>
      )}
    </div>
  )
}
