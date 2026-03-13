import { Button } from 'antd'
import { ShareAltOutlined, NodeIndexOutlined } from '@ant-design/icons'
import { useAppNavigate, useBasePath } from '@/contexts/DomainContext'
import type { Relationship, Service } from '@/types'
import styles from '../index.module.scss'

interface RelationsByServiceSectionProps {
  relationships: Relationship[]
  services: Service[]
  loading?: boolean
}

export function RelationsByServiceSection({
  relationships,
  services,
  loading,
}: RelationsByServiceSectionProps) {
  const navigate = useAppNavigate()
  const basePath = useBasePath()

  const byService = services
    .map((s) => ({
      service: s,
      count: relationships.filter((r) => r.service_id === s.service_id).length,
      preview: relationships
        .filter((r) => r.service_id === s.service_id)
        .slice(0, 2),
    }))
    .sort((a, b) => b.count - a.count)

  if (loading) {
    return (
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>服务内关系</h3>
        <div className={styles.relationByServiceShimmer} />
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>服务内关系</h3>
        <p className={styles.sectionDesc}>
          关系按「服务」维度配置，用于表达谁（用户/组/应用）对该服务下的资源拥有何种权限。当前域下尚无服务，请先创建一个服务，再在「关系 → 图谱」中为该服务配置主体与对象的关系。
        </p>
        <Button
          type="primary"
          className={styles.relationByServiceBtn}
          onClick={() => navigate('/services', { state: { openCreate: true } })}
        >
          创建服务
        </Button>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>服务内关系</h3>
      <p className={styles.sectionDesc}>
        每条关系隶属于一个服务，格式为「主体 — 关系类型 — 对象」，表示该主体对该服务下的资源具备何种权限。应用关联服务后，会沿用该服务的关系模型做鉴权。下方按服务汇总关系数量与预览，可进入列表或图谱继续编辑。
      </p>
      <div className={styles.relationByServiceGrid}>
        {byService.map(({ service, count, preview }) => (
          <div key={service.service_id} className={styles.relationByServiceCard}>
            <div className={styles.relationByServiceCardHead}>
              <span className={styles.relationByServiceCardName}>
                {service.name || service.service_id}
              </span>
              <span className={styles.relationByServiceCardCount}>{count} 条</span>
            </div>
            {preview.length > 0 ? (
              <ul className={styles.relationByServicePreview}>
                {preview.map((r, i) => (
                  <li key={i} className={styles.relationByServicePreviewItem}>
                    <span>{r.subject_type}:{r.subject_id}</span>
                    <span className={styles.relationByServiceArrow}>→</span>
                    <span>{r.relation}</span>
                    <span className={styles.relationByServiceArrow}>→</span>
                    <span>{r.object_type}:{r.object_id}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.relationByServiceEmpty}>暂无关系</p>
            )}
            <Button
              type="default"
              className={styles.relationByServiceBtn}
              icon={<NodeIndexOutlined />}
              onClick={() => navigate(`${basePath}/relationships`, { state: { service_id: service.service_id } })}
            >
              {count > 0 ? '查看关系' : '配置关系'}
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="default"
        className={styles.relationByServiceFull}
        icon={<ShareAltOutlined />}
        onClick={() => navigate(`${basePath}/relationships/graph`)}
      >
        打开关系图谱
      </Button>
    </section>
  )
}
