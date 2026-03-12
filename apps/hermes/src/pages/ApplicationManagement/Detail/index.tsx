import { useState, useEffect, useMemo } from 'react'
import { useRequest } from 'ahooks'
import {
  Card,
  Spin,
  message,
  Tabs,
  Table,
  Empty,
  Typography,
  Tag,
  Tooltip,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Popconfirm,
  Space,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useParams } from 'react-router-dom'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import {
  SettingOutlined,
  CloudServerOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ApiOutlined,
} from '@ant-design/icons'
import { applicationApi, domainApi } from '@/services'
import type { ApplicationServiceRelation, ApplicationIDPConfig } from '@/types'
import {
  validateRedirectUrisMultiLine,
  validateAllowedOriginsMultiLine,
  validateLogoutUrisMultiLine,
} from '@/utils/uri-validation'
import { formatDateTime } from '@atlas/shared'
import styles from './index.module.scss'

const { Text, Link } = Typography
const { TextArea } = Input

const IDP_TYPE_LABELS: Record<string, string> = {
  user: '账号密码',
  staff: '员工账号',
  github: 'GitHub',
  google: 'Google',
  'wechat-mp': '微信小程序',
  'wechat-web': '微信网页',
  'tt-mp': '抖音小程序',
  'tt-web': '抖音网页',
  'alipay-mp': '支付宝小程序',
  'alipay-web': '支付宝网页',
  wecom: '企业微信',
  passkey: 'Passkey',
  global: '全局身份',
}

function idpLabel(type: string) {
  return IDP_TYPE_LABELS[type] ?? type
}

export function Detail() {
  const { appId } = useParams<{ appId: string }>()
  const domainId = useDomainId()
  const navigate = useAppNavigate()
  const [activeTab, setActiveTab] = useState('settings')
  const [settingsDirty, setSettingsDirty] = useState(false)
  const [settingsForm] = Form.useForm()
  const [idpModalOpen, setIdpModalOpen] = useState(false)
  const [editingIdp, setEditingIdp] = useState<ApplicationIDPConfig | null>(null)
  const [idpForm] = Form.useForm()

  const { data, loading, refresh } = useRequest(
    () => applicationApi.getDetail(domainId!, appId!),
    { ready: !!domainId && !!appId, onError: () => message.error('获取应用信息失败') },
  )

  const { data: serviceRelations, loading: svcRelLoading } = useRequest(
    () => applicationApi.getServiceRelations(domainId!, appId!),
    { ready: !!domainId && !!appId && activeTab === 'permissions' },
  )

  const {
    data: idpConfigs,
    loading: idpLoading,
    refresh: refreshIdpConfigs,
  } = useRequest(() => applicationApi.getIDPConfigs(domainId!, appId!), {
    ready: !!domainId && !!appId && activeTab === 'idp',
  })

  const { data: domainIdps } = useRequest(() => domainApi.getIDPs(domainId!), {
    ready: !!domainId && idpModalOpen,
  })

  const availableIdpTypes = useMemo(() => {
    if (!domainIdps) return []
    const configured = new Set((idpConfigs ?? []).map((c) => c.type))
    return domainIdps
      .filter((d) => !configured.has(d.idp_type) || editingIdp?.type === d.idp_type)
      .map((d) => ({ label: idpLabel(d.idp_type), value: d.idp_type }))
  }, [domainIdps, idpConfigs, editingIdp])

  const { run: runSaveSettings, loading: saving } = useRequest(
    async (values: {
      name: string
      description?: string
      allowed_redirect_uris?: string
      allowed_origins?: string
      allowed_logout_uris?: string
      id_token_expires_in?: number
      refresh_token_expires_in?: number
      refresh_token_absolute_expires_in?: number
    }) => {
      const allowedRedirectUris = values.allowed_redirect_uris
        ? values.allowed_redirect_uris.split('\n').map((s) => s.trim()).filter(Boolean)
        : []
      const allowedOrigins = values.allowed_origins
        ? values.allowed_origins.split('\n').map((s) => s.trim()).filter(Boolean)
        : []
      const allowedLogoutUris = values.allowed_logout_uris
        ? values.allowed_logout_uris.split('\n').map((s) => s.trim()).filter(Boolean)
        : []
      await applicationApi.update(domainId!, appId!, {
        name: values.name,
        description: values.description || undefined,
        allowed_redirect_uris: allowedRedirectUris,
        allowed_origins: allowedOrigins,
        allowed_logout_uris: allowedLogoutUris,
        id_token_expires_in: values.id_token_expires_in,
        refresh_token_expires_in: values.refresh_token_expires_in,
        refresh_token_absolute_expires_in: values.refresh_token_absolute_expires_in,
      })
      refresh()
      setSettingsDirty(false)
      message.success('已保存')
    },
    { manual: true, onError: () => message.error('保存失败') },
  )

  const { run: runCreateIdp, loading: creatingIdp } = useRequest(
    async (values: { type: string; priority?: number; strategy?: string; delegate?: string; require?: string }) => {
      await applicationApi.createIDPConfig(domainId!, appId!, values)
      refreshIdpConfigs()
      setIdpModalOpen(false)
      idpForm.resetFields()
      message.success('已添加')
    },
    { manual: true, onError: () => message.error('添加失败') },
  )

  const { run: runUpdateIdp, loading: updatingIdp } = useRequest(
    async (idpType: string, values: { priority?: number; strategy?: string; delegate?: string; require?: string }) => {
      await applicationApi.updateIDPConfig(domainId!, appId!, idpType, values)
      refreshIdpConfigs()
      setIdpModalOpen(false)
      setEditingIdp(null)
      idpForm.resetFields()
      message.success('已更新')
    },
    { manual: true, onError: () => message.error('更新失败') },
  )

  const { run: runDeleteIdp } = useRequest(
    async (idpType: string) => {
      await applicationApi.deleteIDPConfig(domainId!, appId!, idpType)
      refreshIdpConfigs()
      message.success('已删除')
    },
    { manual: true, onError: () => message.error('删除失败') },
  )

  useEffect(() => {
    if (!data) return
    let uris: string[] = []
    try {
      const raw = data.allowed_redirect_uris
      uris = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
    } catch {
      /* ignore */
    }
    let origins: string[] = []
    try {
      const raw = data.allowed_origins
      origins = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
    } catch {
      /* ignore */
    }
    let logoutUris: string[] = []
    try {
      const raw = data.allowed_logout_uris
      logoutUris = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
    } catch {
      /* ignore */
    }
    settingsForm.setFieldsValue({
      name: data.name,
      description: data.description ?? '',
      allowed_redirect_uris: uris.join('\n'),
      allowed_origins: origins.join('\n'),
      allowed_logout_uris: logoutUris.join('\n'),
      id_token_expires_in: data.id_token_expires_in || undefined,
      refresh_token_expires_in: data.refresh_token_expires_in || undefined,
      refresh_token_absolute_expires_in: data.refresh_token_absolute_expires_in || undefined,
    })
    setSettingsDirty(false)
  }, [data, settingsForm])

  const handleSaveSettings = async () => {
    try {
      const values = await settingsForm.validateFields()
      await runSaveSettings(values)
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'errorFields' in e) return
    }
  }

  const handleCancelSettings = () => {
    if (!data) return
    let uris: string[] = []
    try {
      const raw = data.allowed_redirect_uris
      uris = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
    } catch {
      /* ignore */
    }
    let origins: string[] = []
    try {
      const raw = data.allowed_origins
      origins = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
    } catch {
      /* ignore */
    }
    let logoutUris: string[] = []
    try {
      const raw = data.allowed_logout_uris
      logoutUris = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
    } catch {
      /* ignore */
    }
    settingsForm.setFieldsValue({
      name: data.name,
      description: data.description ?? '',
      allowed_redirect_uris: uris.join('\n'),
      allowed_origins: origins.join('\n'),
      allowed_logout_uris: logoutUris.join('\n'),
      id_token_expires_in: data.id_token_expires_in || undefined,
      refresh_token_expires_in: data.refresh_token_expires_in || undefined,
      refresh_token_absolute_expires_in: data.refresh_token_absolute_expires_in || undefined,
    })
    setSettingsDirty(false)
  }

  const handleIdpModalOk = async () => {
    try {
      const values = await idpForm.validateFields()
      if (editingIdp) {
        await runUpdateIdp(editingIdp.type, values)
      } else {
        await runCreateIdp(values)
      }
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'errorFields' in e) return
    }
  }

  const openEditIdp = (record: ApplicationIDPConfig) => {
    setEditingIdp(record)
    idpForm.setFieldsValue({
      type: record.type,
      priority: record.priority,
      strategy: record.strategy ?? undefined,
      delegate: record.delegate ?? undefined,
      require: record.require ?? undefined,
    })
    setIdpModalOpen(true)
  }

  const openAddIdp = () => {
    setEditingIdp(null)
    idpForm.resetFields()
    setIdpModalOpen(true)
  }

  const idpColumns: ColumnsType<ApplicationIDPConfig> = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 160,
      render: (t: string) => (
        <Tag color="blue" bordered={false}>
          {idpLabel(t)}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: '策略',
      dataIndex: 'strategy',
      key: 'strategy',
      width: 120,
      render: (v: string) => v || <Text type="secondary">—</Text>,
    },
    {
      title: '委托',
      dataIndex: 'delegate',
      key: 'delegate',
      width: 120,
      render: (v: string) => v || <Text type="secondary">—</Text>,
    },
    {
      title: '必需',
      dataIndex: 'require',
      key: 'require',
      width: 120,
      render: (v: string) => v || <Text type="secondary">—</Text>,
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEditIdp(record)} />
          <Popconfirm
            title="确认删除该身份源配置？"
            onConfirm={() => runDeleteIdp(record.type)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const serviceRelationColumns: ColumnsType<ApplicationServiceRelation> = [
    {
      title: '服务',
      dataIndex: 'service_id',
      key: 'service_id',
      width: 180,
      render: (value) => (
        <Link onClick={() => navigate(`/services/${value}`)}>{value}</Link>
      ),
    },
    {
      title: '授予的权限',
      dataIndex: 'relations',
      key: 'relations',
      render: (relations: string[]) =>
        (relations || []).map((r) => (
          <Tag key={r} color="processing" bordered={false}>
            {r}
          </Tag>
        )),
    },
  ]

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  if (!data) return null

  const tabItems = [
    {
      key: 'settings',
      label: (
        <span className={styles.tabLabel}>
          <SettingOutlined />
          基本信息
        </span>
      ),
      children: (
        <div className={styles.settingsTab}>
          <Form
            form={settingsForm}
            layout="vertical"
            className={styles.settingsForm}
            onValuesChange={() => setSettingsDirty(true)}
          >
            <div className={styles.section}>
              <div className={styles.sectionTitle}>基本信息</div>
              <div className={styles.sectionBody}>
                <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入应用名称' }]}>
                  <Input placeholder="应用名称" />
                </Form.Item>
                <Form.Item name="description" label="描述">
                  <TextArea rows={2} placeholder="可选的应用描述" />
                </Form.Item>
              </div>
            </div>

            <div className={styles.sectionDivider} />

            <div className={styles.section}>
              <div className={styles.sectionTitle}>回调地址</div>
              <Text type="secondary" className={styles.sectionHint}>
                登录或授权后允许跳转的 URI，需与请求中的 redirect_uri 完全一致。每行填写一个地址。
              </Text>
              <div className={styles.sectionBody}>
                <Form.Item
                  name="allowed_redirect_uris"
                  label="重定向 URI"
                  rules={[
                    {
                      validator: (_, value) => {
                        const err = validateRedirectUrisMultiLine(value ?? '')
                        return err ? Promise.reject(new Error(err)) : Promise.resolve()
                      },
                    },
                  ]}
                >
                  <TextArea rows={3} placeholder="https://example.com/callback" />
                </Form.Item>
                <Form.Item
                  name="allowed_origins"
                  label="允许的来源 (CORS)"
                  tooltip="允许从浏览器端发起跨域请求的来源。每行一个。"
                  rules={[
                    {
                      validator: (_, value) => {
                        const err = validateAllowedOriginsMultiLine(value ?? '')
                        return err ? Promise.reject(new Error(err)) : Promise.resolve()
                      },
                    },
                  ]}
                >
                  <TextArea rows={2} placeholder="https://example.com" />
                </Form.Item>
                <Form.Item
                  name="allowed_logout_uris"
                  label="登出后跳转 URI"
                  tooltip="登出后允许跳转的地址（post_logout_redirect_uri）。每行一个。"
                  rules={[
                    {
                      validator: (_, value) => {
                        const err = validateLogoutUrisMultiLine(value ?? '')
                        return err ? Promise.reject(new Error(err)) : Promise.resolve()
                      },
                    },
                  ]}
                >
                  <TextArea rows={2} placeholder="https://example.com" />
                </Form.Item>
              </div>
            </div>

            <div className={styles.sectionDivider} />

            <div className={styles.section}>
              <div className={styles.sectionTitle}>Token 配置</div>
              <Text type="secondary" className={styles.sectionHint}>
                配置各类 Token 的有效期（单位：秒）。设为 0 或留空则使用系统默认值。
              </Text>
              <div className={styles.sectionBody}>
                <div className={styles.tokenFields}>
                  <Form.Item name="id_token_expires_in" label="ID Token 有效期">
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      placeholder="默认"
                      addonAfter="秒"
                    />
                  </Form.Item>
                  <Form.Item name="refresh_token_expires_in" label="Refresh Token 有效期">
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      placeholder="默认"
                      addonAfter="秒"
                    />
                  </Form.Item>
                  <Form.Item name="refresh_token_absolute_expires_in" label="Refresh Token 绝对有效期">
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      placeholder="默认"
                      addonAfter="秒"
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
      ),
    },
    {
      key: 'idp',
      label: (
        <span className={styles.tabLabel}>
          <ApiOutlined />
          身份源
          {idpConfigs != null && idpConfigs.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>
              {idpConfigs.length}
            </Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.idpTab}>
          <div className={styles.idpHeader}>
            <Text type="secondary">
              配置本应用允许使用的身份提供商（IDP）。优先级数值越小越优先。
            </Text>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddIdp}>
              添加身份源
            </Button>
          </div>
          <Table
            columns={idpColumns}
            dataSource={idpConfigs ?? []}
            loading={idpLoading}
            rowKey="type"
            size="small"
            pagination={false}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="尚未配置身份源"
                />
              ),
            }}
          />
        </div>
      ),
    },
    {
      key: 'permissions',
      label: (
        <span className={styles.tabLabel}>
          <CloudServerOutlined />
          权限
          {serviceRelations != null && serviceRelations.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>
              {serviceRelations.length}
            </Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.permissionsTab}>
          <div className={styles.permissionsHeader}>
            <Text type="secondary">
              各服务授予本应用的权限类型（ReBAC）。在此查看本应用可访问的服务及每种服务下授予的权限。
            </Text>
          </div>
          <Table
            columns={serviceRelationColumns}
            dataSource={serviceRelations ?? []}
            loading={svcRelLoading}
            rowKey="service_id"
            size="small"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无服务授予的权限"
                />
              ),
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card bordered={false} className={styles.overviewCard}>
        <div className={styles.overviewHeader}>
          <Tooltip title="返回应用列表" placement="bottomLeft">
            <Button
              type="text"
              icon={<ArrowLeftOutlined className={styles.backIcon} />}
              onClick={() => navigate('/applications')}
              className={styles.backBtn}
            />
          </Tooltip>
          <div className={styles.overviewTitleRow}>
            <Typography.Title level={4} className={styles.overviewName}>
              {data.name || data.app_id}
            </Typography.Title>
          </div>
        </div>
        <div className={styles.overviewMeta}>
          <div className={styles.metaBlock}>
            <div className={styles.metaRow}>
              <dt>应用标识</dt>
              <dd>
                <Text
                  copyable={{ text: data.app_id, tooltips: ['复制', '已复制'] }}
                  className={styles.metaValue}
                >
                  {data.app_id}
                </Text>
              </dd>
            </div>
            <div className={styles.metaRow}>
              <dt>域标识</dt>
              <dd>
                <Text
                  copyable={
                    data.domain_id
                      ? { text: data.domain_id, tooltips: ['复制', '已复制'] }
                      : false
                  }
                  className={styles.metaValue}
                >
                  {data.domain_id}
                </Text>
              </dd>
            </div>
          </div>
          <div className={styles.metaBlock}>
            <div className={styles.metaRow}>
              <dt>创建时间</dt>
              <dd className={styles.metaValue}>{formatDateTime(data.created_at)}</dd>
            </div>
            <div className={styles.metaRow}>
              <dt>更新时间</dt>
              <dd className={styles.metaValue}>{formatDateTime(data.updated_at)}</dd>
            </div>
          </div>
        </div>
      </Card>

      <Card bordered={false} className={styles.mainCard}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.tabs}
          tabBarExtraContent={
            activeTab === 'settings' ? (
              <Space size="small">
                {settingsDirty && (
                  <Button icon={<CloseOutlined />} onClick={handleCancelSettings}>
                    取消
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={saving}
                  onClick={handleSaveSettings}
                >
                  保存
                </Button>
              </Space>
            ) : null
          }
        />
      </Card>

      <Modal
        title={editingIdp ? '编辑身份源' : '添加身份源'}
        open={idpModalOpen}
        onOk={handleIdpModalOk}
        onCancel={() => {
          setIdpModalOpen(false)
          setEditingIdp(null)
          idpForm.resetFields()
        }}
        confirmLoading={creatingIdp || updatingIdp}
        destroyOnClose
      >
        <Form form={idpForm} layout="vertical" className={styles.idpModalForm}>
          <Form.Item
            name="type"
            label="身份源类型"
            rules={[{ required: true, message: '请选择身份源类型' }]}
          >
            <Select
              options={availableIdpTypes}
              placeholder="选择身份源类型"
              disabled={!!editingIdp}
            />
          </Form.Item>
          <Form.Item name="priority" label="优先级" tooltip="数值越小优先级越高，默认 0">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
          <Form.Item name="strategy" label="策略">
            <Input placeholder="如：password" allowClear />
          </Form.Item>
          <Form.Item name="delegate" label="委托">
            <Input placeholder="委托身份源" allowClear />
          </Form.Item>
          <Form.Item name="require" label="必需条件">
            <Input placeholder="必需条件" allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
