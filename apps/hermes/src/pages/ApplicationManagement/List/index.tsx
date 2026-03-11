import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useRequest, useDebounce } from 'ahooks'
import { Button, Input, Form, Select, Space, Typography, Modal, Tooltip, Avatar, message } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  AppstoreAddOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { applicationApi } from '@/services'
import styles from './index.module.scss'

export function List() {
  const navigate = useAppNavigate()
  const location = useLocation()
  const domainId = useDomainId()
  const [keyword, setKeyword] = useState('')
  const [searchBy, setSearchBy] = useState<'id' | 'name'>('name')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    if ((location.state as { openCreate?: boolean })?.openCreate) {
      setCreateModalOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, location.pathname, navigate])

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

  const { run: runCreate, loading: createLoading } = useRequest(
    async (values: { app_id: string; name: string }) => {
      await applicationApi.create(domainId!, {
        app_id: values.app_id,
        name: values.name,
        redirect_uris: [],
        need_key: false,
      })
      message.success('创建成功')
      setCreateModalOpen(false)
      form.resetFields()
      refresh()
    },
    { manual: true, onError: () => message.error('创建失败') }
  )

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
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.cardSkeleton} />
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          <Button
            type="text"
            className={`${styles.cardWrap} ${styles.createCard}`}
            onClick={() => setCreateModalOpen(true)}
          >
            <article className={styles.card}>
              <div className={styles.createCardInner}>
                <div className={styles.createCardIcon}>
                  <PlusOutlined />
                </div>
                <span className={styles.createCardText}>创建应用</span>
                <span className={styles.createCardHint}>配置重定向 URI 与授权</span>
              </div>
            </article>
          </Button>
          {list.map((app) => (
            <div
              key={app.app_id}
              className={styles.cardWrap}
              onClick={() => navigate(`/applications/${app.app_id}`)}
            >
              <article className={styles.card}>
                <div className={styles.cardHead}>
                  <div className={styles.cardIcon}>
                    {app.logo_url ? (
                      <Avatar src={app.logo_url} shape="square" size={44} />
                    ) : (
                      <AppstoreAddOutlined />
                    )}
                  </div>
                  <div className={styles.cardTitleBlock}>
                    <div className={styles.cardIdWrap}>
                      <Typography.Text
                        copyable={{ text: app.app_id, tooltips: ['复制标识', '已复制'] }}
                        className={styles.cardId}
                      >
                        {app.app_id}
                      </Typography.Text>
                    </div>
                    <span className={styles.cardName}>{app.name || app.app_id}</span>
                  </div>
                </div>
                {app.description ? (
                  <p className={styles.cardDesc}>{app.description}</p>
                ) : (
                  <p className={styles.cardDescMuted}>暂无描述</p>
                )}
              </article>

              <div className={styles.rightTrigger} />
              <div className={styles.overlayRight} onClick={(e) => e.stopPropagation()}>
                <Tooltip title="查看详情" placement="left">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    className={styles.overlayBtn}
                    onClick={() => navigate(`/applications/${app.app_id}`)}
                  />
                </Tooltip>
                <Tooltip title="编辑应用" placement="left">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    className={styles.overlayBtn}
                    onClick={() => navigate(`/applications/${app.app_id}/edit`)}
                  />
                </Tooltip>
                <Tooltip title="删除应用" placement="left">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    className={`${styles.overlayBtn} ${styles.deleteBtn}`}
                    onClick={() => {
                      Modal.confirm({
                        title: '删除应用',
                        content: `确定删除应用「${app.name || app.app_id}」？删除后无法恢复。`,
                        okText: '删除',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk: async () => {
                          await applicationApi.delete(domainId!, app.app_id)
                          refresh()
                        },
                      })
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="新建应用"
        open={createModalOpen}
        onCancel={() => { setCreateModalOpen(false); form.resetFields() }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(v) => runCreate(v as { app_id: string; name: string })}
        >
          <Form.Item
            name="app_id"
            label="应用 ID"
            rules={[{ required: true, message: '请输入应用 ID' }]}
          >
            <Input placeholder="请输入应用 ID" />
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item className={styles.modalFooter}>
            <Space>
              <Button onClick={() => { setCreateModalOpen(false); form.resetFields() }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={createLoading}>
                创建
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

