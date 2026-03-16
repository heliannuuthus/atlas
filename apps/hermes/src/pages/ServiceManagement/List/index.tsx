import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useRequest, useDebounce } from 'ahooks'
import {
  Button,
  Input,
  Form,
  Modal,
  Select,
  Space,
  Typography,
  Tooltip,
  Avatar,
  Row,
  Col,
  Card,
  Flex,
  message,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  CloudServerOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { eq, prefix } from '@atlas/shared'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { serviceApi } from '@/services'
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
    () => {
      const filter = debouncedKeyword
        ? searchBy === 'id'
          ? { service_id: eq(debouncedKeyword) }
          : { name: prefix(debouncedKeyword) }
        : undefined
      return serviceApi.getList(domainId!, filter)
    },
    { ready: !!domainId, refreshDeps: [domainId, debouncedKeyword, searchBy] }
  )

  const list = data?.items ?? []

  const { run: runCreate, loading: createLoading } = useRequest(
    async (values: { service_id: string; name: string; description: string }) => {
      await serviceApi.create(domainId!, {
        service_id: values.service_id,
        name: values.name,
        description: values.description,
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
        <h1 className={styles.heroTitle}>服务</h1>
        <p className={styles.heroDesc}>
          服务是权限与关系的承载单元。每个服务可独立配置主体与对象之间的 ReBAC 关系、Token
          有效期，并授权给指定应用使用。 创建服务后，可在此查看详情与已授权应用，或在
          <strong>关系图谱</strong>中可视化配置关系与组。
        </p>
      </section>

      <div className={styles.toolbar}>
        <Space.Compact className={styles.searchCompact}>
          <Select
            value={searchBy}
            onChange={v => setSearchBy(v as 'id' | 'name')}
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
            onChange={e => setKeyword(e.target.value)}
            style={{ width: 220 }}
          />
        </Space.Compact>
      </div>

      {loading ? (
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6].map(i => (
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
              onKeyDown={e => e.key === 'Enter' && setCreateModalOpen(true)}
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
                      <span className={styles.cardId}>创建服务</span>
                    </div>
                    <span className={styles.cardName}>配置关系与 Token 有效期</span>
                  </Flex>
                </Flex>
                <p className={styles.cardDescMuted}>点击创建新服务</p>
              </Card>
            </div>
          </Col>
          {list.map(service => (
            <Col key={service.service_id} xs={24} sm={12} md={8} lg={8} xl={6}>
              <div
                className={styles.cardWrap}
                onClick={() => navigate(`/services/${service.service_id}`)}
              >
                <Card className={styles.card} variant="borderless">
                  <Flex gap={14} align="flex-start" className={styles.cardHead}>
                    <div className={styles.cardIcon}>
                      {service.logo_url ? (
                        <Avatar src={service.logo_url} shape="square" size={44} />
                      ) : (
                        <CloudServerOutlined />
                      )}
                    </div>
                    <Flex vertical gap={2} className={styles.cardTitleBlock}>
                      <div className={styles.cardIdWrap}>
                        <Typography.Text
                          copyable={{ text: service.service_id, tooltips: ['复制标识', '已复制'] }}
                          className={styles.cardId}
                        >
                          {service.service_id}
                        </Typography.Text>
                      </div>
                      <span className={styles.cardName}>{service.name || service.service_id}</span>
                    </Flex>
                  </Flex>
                  {service.description ? (
                    <p className={styles.cardDesc}>{service.description}</p>
                  ) : (
                    <p className={styles.cardDescMuted}>暂无描述</p>
                  )}
                </Card>

                <div className={styles.rightTrigger} />
                <div className={styles.overlayRight} onClick={e => e.stopPropagation()}>
                  <Tooltip title="查看详情" placement="left">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      className={styles.overlayBtn}
                      onClick={() => navigate(`/services/${service.service_id}`)}
                    />
                  </Tooltip>
                  <Tooltip title="编辑服务" placement="left">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      className={styles.overlayBtn}
                      onClick={() => navigate(`/services/${service.service_id}/edit`)}
                    />
                  </Tooltip>
                  <Tooltip title="删除服务" placement="left">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      className={`${styles.overlayBtn} ${styles.deleteBtn}`}
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
                    />
                  </Tooltip>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="新建服务"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false)
          form.resetFields()
        }}
        footer={null}
        destroyOnHidden
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={v => runCreate(v as { service_id: string; name: string; description: string })}
        >
          <Form.Item
            name="service_id"
            label="服务标识"
            rules={[{ required: true, message: '请输入服务标识' }]}
          >
            <Input placeholder="请输入服务标识" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
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
              <Button
                onClick={() => {
                  setCreateModalOpen(false)
                  form.resetFields()
                }}
              >
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
