import { useState } from 'react'
import { useRequest, useDebounce } from 'ahooks'
import { Button, Input, Empty, Select, Space } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  AppstoreAddOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { applicationApi } from '@/services'
import type { Application } from '@/types'
import styles from './index.module.scss'

function redirectSummary(app: Application): string {
  const uris = app.redirect_uris
  if (!uris?.length) return '暂无重定向 URI'
  if (uris.length === 1) return uris[0]
  return `共 ${uris.length} 个重定向 URI`
}

export function List() {
  const navigate = useAppNavigate()
  const domainId = useDomainId()
  const [keyword, setKeyword] = useState('')
  const [searchBy, setSearchBy] = useState<'id' | 'name'>('name')

  const trimmedKeyword = keyword.trim()
  const debouncedKeyword = useDebounce(trimmedKeyword, { wait: 300 })
  const { data, loading, refresh } = useRequest(
    () => applicationApi.getList(domainId!),
    { ready: !!domainId, refreshDeps: [domainId] }
  )

  const list = (data ?? []).filter((app) => {
    if (!debouncedKeyword) return true
    if (searchBy === 'id') return app.app_id.toLowerCase().includes(debouncedKeyword.toLowerCase())
    return (app.name ?? '').toLowerCase().includes(debouncedKeyword.toLowerCase())
  })

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>应用</h1>
        <p className={styles.heroDesc}>
          应用代表接入方（Web 前端、移动端或第三方系统）。在此创建应用并配置<strong>重定向 URI</strong>后，可为应用授权访问指定服务的关系与 Token 能力；
          授权关系在服务详情或<strong>关系图谱</strong>中配置，应用侧即可按 ReBAC 策略进行鉴权与资源访问。
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
            placeholder={searchBy === 'id' ? '输入应用 ID' : '输入应用名称'}
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 220 }}
          />
        </Space.Compact>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/applications/create')}
          className={styles.createBtn}
        >
          创建应用
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
            image={<AppstoreAddOutlined style={{ fontSize: 56, color: '#d9d9d9' }} />}
            imageStyle={{ height: 72 }}
            description="暂无应用"
          >
            <Button type="primary" onClick={() => navigate('/applications/create')}>
              创建第一个应用
            </Button>
          </Empty>
        </div>
      ) : (
        <div className={styles.grid}>
          {list.map((app) => (
            <div
              key={app.app_id}
              className={styles.cardWrap}
              onClick={() => navigate(`/applications/${app.app_id}`)}
            >
              <article className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardIcon}>
                    <AppstoreAddOutlined />
                  </span>
                  <div className={styles.cardTitleBlock}>
                    <span className={styles.cardName}>{app.name || app.app_id}</span>
                    <span className={styles.cardId}>{app.app_id}</span>
                  </div>
                </div>
                <p className={styles.cardDesc}>{redirectSummary(app)}</p>
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
                    onClick={() => navigate(`/applications/${app.app_id}/edit`)}
                  >
                    编辑
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
