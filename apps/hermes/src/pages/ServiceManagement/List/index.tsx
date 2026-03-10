import { useState } from 'react'
import { useRequest, useDebounce } from 'ahooks'
import { Button, Input, Empty, Modal, Select, Space } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  CloudServerOutlined,
  RightOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { serviceApi } from '@/services'
import type { Service } from '@/types'
import { formatDuration } from '@atlas/shared'
import styles from './index.module.scss'

export function List() {
  const navigate = useAppNavigate()
  const domainId = useDomainId()
  const [keyword, setKeyword] = useState('')
  const [searchBy, setSearchBy] = useState<'id' | 'name'>('name')

  const trimmedKeyword = keyword.trim()
  const debouncedKeyword = useDebounce(trimmedKeyword, { wait: 300 })
  const { data, loading, refresh } = useRequest(
    () => {
      const params = debouncedKeyword
        ? searchBy === 'id'
          ? { service_id: debouncedKeyword }
          : { name: debouncedKeyword }
        : undefined
      return serviceApi.getList(domainId!, params)
    },
    { ready: !!domainId, refreshDeps: [domainId, debouncedKeyword, searchBy] }
  )

  const list = data ?? []

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>服务</h1>
        <p className={styles.heroDesc}>
          服务是权限与关系的承载单元。每个服务可独立配置主体与对象之间的 ReBAC 关系、Token 有效期，并授权给指定应用使用。
          创建服务后，可在此查看详情与已授权应用，或在<strong>关系图谱</strong>中可视化配置关系与组。
        </p>
      </section>

      <div className={styles.toolbar}>
        <Space.Compact className={styles.searchCompact}>
          <Select
            value={searchBy}
            onChange={(v) => setSearchBy(v as 'id' | 'name')}
            options={[
              { label: '名称', value: 'name' },
              { label: '标识', value: 'id' },
            ]}
            style={{ width: 88 }}
          />
          <Input
            placeholder={searchBy === 'id' ? '输入服务 ID' : '输入服务名称'}
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 220 }}
          />
        </Space.Compact>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/services/create')}
          className={styles.createBtn}
        >
          创建服务
        </Button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.cardSkeleton} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className={styles.emptyWrap}>
          <Empty
            image={<CloudServerOutlined style={{ fontSize: 56, color: '#d9d9d9' }} />}
            imageStyle={{ height: 72 }}
            description="暂无服务"
          >
            <Button type="primary" onClick={() => navigate('/services/create')}>
              创建第一个服务
            </Button>
          </Empty>
        </div>
      ) : (
        <div className={styles.grid}>
          {list.map((service) => (
            <div
              key={service.service_id}
              className={styles.cardWrap}
              onClick={() => navigate(`/services/${service.service_id}`)}
            >
              <article className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>
                    <CloudServerOutlined />
                  </span>
                  <div className={styles.cardTitleBlock}>
                    <span className={styles.cardName}>{service.name || service.service_id}</span>
                    <span className={styles.cardId}>{service.service_id}</span>
                  </div>
                </div>
                {service.description ? (
                  <p className={styles.cardDesc}>{service.description}</p>
                ) : (
                  <p className={styles.cardDescMuted}>暂无描述</p>
                )}
                <div className={styles.cardMeta}>
                  <span title="Access Token 有效期">
                    Access {formatDuration(service.access_token_expires_in)}
                  </span>
                  <span className={styles.cardMetaDivider}>·</span>
                  <span title="Refresh Token 有效期">
                    Refresh {formatDuration(service.refresh_token_expires_in)}
                  </span>
                </div>
                <span className={styles.cardArrow}>
                  <RightOutlined />
                </span>
              </article>
              <div
                className={styles.cardOverlay}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.cardOverlayActions}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    className={styles.cardOverlayBtn}
                    onClick={() => navigate(`/services/${service.service_id}/edit`)}
                  >
                    编辑
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    className={styles.cardOverlayBtn}
                    onClick={() => {
                      Modal.confirm({
                        title: '删除服务',
                        content: `确定删除服务「${service.name || service.service_id}」？关联的关系、组等将一并删除。`,
                        okText: '删除',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk: async () => {
                          await serviceApi.delete(domainId!, service.service_id)
                          refresh()
                        },
                      })
                    }}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
