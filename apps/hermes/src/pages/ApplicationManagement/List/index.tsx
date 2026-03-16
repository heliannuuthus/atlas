import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useRequest, useDebounce } from 'ahooks'
import { Button, Input, Form, Select, Space, Typography, Modal, Tooltip, Avatar, Row, Col, Card, Flex, message } from 'antd'
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
  const shouldOpenCreate = (location.state as { openCreate?: boolean })?.openCreate ?? false
  const [createModalOpen, setCreateModalOpen] = useState(shouldOpenCreate)
  const [form] = Form.useForm()

  useEffect(() => {
    if (shouldOpenCreate) {
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [shouldOpenCreate, location.pathname, navigate])

  const trimmedKeyword = keyword.trim()
  const debouncedKeyword = useDebounce(trimmedKeyword, { wait: 300 })
  const { data, loading, refresh } = useRequest(
    () => applicationApi.getList(domainId!),
    { ready: !!domainId, refreshDeps: [domainId] }
  )

  const list = (data?.items ?? []).filter((app) => {
    if (!debouncedKeyword) return true
    if (searchBy === 'id') return app.app_id.toLowerCase().includes(debouncedKeyword.toLowerCase())
    return (app.name ?? '').toLowerCase().includes(debouncedKeyword.toLowerCase())
  })

  const { run: runCreate, loading: createLoading } = useRequest(
    async (values: { app_id: string; name: string; description: string }) => {
      await applicationApi.create(domainId!, {
        app_id: values.app_id,
        name: values.name,
        description: values.description,
        allowed_redirect_uris: [],
        allowed_origins: [],
        allowed_logout_uris: [],
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
            placeholder={searchBy === 'id' ? '输入应用标识' : '输入应用名称'}
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 220 }}
          />
        </Space.Compact>
      </div>

      {loading ? (
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={8} xl={6}>
              <Card loading className={styles.cardSkeleton} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <div
              className={`${styles.cardWrap} ${styles.createCard}`}
              onClick={() => setCreateModalOpen(true)}
              onKeyDown={(e) => e.key === 'Enter' && setCreateModalOpen(true)}
              role="button"
              tabIndex={0}
            >
              <Card className={styles.card} variant="borderless">
                <Flex gap={14} align="flex-start" className={styles.cardHead}>
                  <div className={styles.cardIcon}>
                    <PlusOutlined />
                  </div>
                  <Flex vertical gap={2} className={styles.cardTitleBlock}>
                    <div className={styles.cardIdWrap}>
                      <span className={styles.cardId}>创建应用</span>
                    </div>
                    <span className={styles.cardName}>配置重定向 URI 与授权</span>
                  </Flex>
                </Flex>
                <p className={styles.cardDescMuted}>点击创建新应用</p>
              </Card>
            </div>
          </Col>
          {list.map((app) => (
            <Col key={app.app_id} xs={24} sm={12} md={8} lg={8} xl={6}>
              <div
                className={styles.cardWrap}
                onClick={() => navigate(`/applications/${app.app_id}`)}
              >
                <Card className={styles.card} variant="borderless">
                  <Flex gap={14} align="flex-start" className={styles.cardHead}>
                    <div className={styles.cardIcon}>
                      {app.logo_url ? (
                        <Avatar src={app.logo_url} shape="square" size={44} />
                      ) : (
                        <AppstoreAddOutlined />
                      )}
                    </div>
                    <Flex vertical gap={2} className={styles.cardTitleBlock}>
                      <div className={styles.cardIdWrap}>
                        <Typography.Text
                          copyable={{ text: app.app_id, tooltips: ['复制标识', '已复制'] }}
                          className={styles.cardId}
                        >
                          {app.app_id}
                        </Typography.Text>
                      </div>
                      <span className={styles.cardName}>{app.name || app.app_id}</span>
                    </Flex>
                  </Flex>
                  {app.description ? (
                    <p className={styles.cardDesc}>{app.description}</p>
                  ) : (
                    <p className={styles.cardDescMuted}>暂无描述</p>
                  )}
                </Card>

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
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="新建应用"
        open={createModalOpen}
        onCancel={() => { setCreateModalOpen(false); form.resetFields() }}
        footer={null}
        destroyOnHidden
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(v) =>
            runCreate({
              ...v,
              app_id: (v as { app_id?: string }).app_id?.trim() ?? '',
            } as { app_id: string; name: string; description: string })
          }
        >
          <Form.Item name="app_id" label="应用标识">
            <Input placeholder="选填，不填则自动生成" />
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea placeholder="请输入描述" rows={3} />
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

