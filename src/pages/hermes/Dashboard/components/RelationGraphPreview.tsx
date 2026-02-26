import { useMemo } from 'react'
import { Card, Button, Empty } from 'antd'
import type { CardProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FullscreenOutlined, NodeIndexOutlined } from '@ant-design/icons'
import type { Relationship } from '@/types/hermes'
import styles from '../index.module.scss'

interface RelationGraphPreviewProps {
  relationships: Relationship[]
  loading?: boolean
}

export function RelationGraphPreview({ relationships, loading }: RelationGraphPreviewProps) {
  const navigate = useNavigate()

  const previewRelations = relationships.slice(0, 5)

  const cardStyles = useMemo<CardProps['styles']>(() => ({
    body: { padding: '16px 20px' },
  }), [])

  return (
    <Card
      title="关系图谱预览"
      className={styles.graphPreview}
      loading={loading}
      styles={cardStyles}
      extra={
        <Button
          type="text"
          icon={<FullscreenOutlined />}
          onClick={() => navigate('/hermes/relationships/graph')}
        >
          全屏
        </Button>
      }
    >
      {previewRelations.length > 0 ? (
        <div className={styles.graphContainer}>
          <div className={styles.relationList}>
            {previewRelations.map((rel, index) => (
              <div key={index} className={styles.relationItem}>
                <div className={styles.relationSubject}>
                  <span className={styles.entityType}>{rel.subject_type}</span>
                  <span className={styles.entityId}>{rel.subject_id}</span>
                </div>
                <div className={styles.relationArrow}>
                  <span className={styles.relationName}>{rel.relation}</span>
                  <span className={styles.arrow}>→</span>
                </div>
                <div className={styles.relationObject}>
                  <span className={styles.entityType}>{rel.object_type}</span>
                  <span className={styles.entityId}>{rel.object_id}</span>
                </div>
              </div>
            ))}
          </div>
          {relationships.length > 5 && (
            <div className={styles.moreHint}>
              还有 {relationships.length - 5} 条关系...
            </div>
          )}
          <Button
            type="primary"
            icon={<NodeIndexOutlined />}
            onClick={() => navigate('/hermes/relationships/graph')}
            className={styles.viewGraphBtn}
          >
            打开关系图谱编辑器
          </Button>
        </div>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无关系数据"
        >
          <Button
            type="primary"
            onClick={() => navigate('/hermes/relationships/graph')}
          >
            创建第一条关系
          </Button>
        </Empty>
      )}
    </Card>
  )
}
