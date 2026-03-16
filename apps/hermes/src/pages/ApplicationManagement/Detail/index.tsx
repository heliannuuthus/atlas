import { useState, useEffect, useMemo } from 'react'
import { useRequest } from 'ahooks'
import {
  Spin,
  message,
  Tabs,
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
  Avatar,
  Upload,
  Segmented,
} from 'antd'
import { useParams } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
  QuestionCircleOutlined,
  AppstoreAddOutlined,
  CameraOutlined,
  CopyOutlined,
  KeyOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { applicationApi, domainApi } from '@/services'
import type { ApplicationIDPConfig } from '@/types'
import {
  validateRedirectUrisArray,
  validateAllowedOriginsArray,
  validateLogoutUrisArray,
} from '@/utils/uri-validation'
import { formatDateTime } from '@atlas/shared'
import { ServicePermissionsView } from './components/ServicePermissionsView'
import styles from './index.module.scss'

const { Text } = Typography
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

const ASSET_ICON_BASE = 'https://asset.heliannuuthus.com/icons'

const IDP_ICON_URLS: Record<string, string> = {
  user: `${ASSET_ICON_BASE}/user.svg`,
  staff: `${ASSET_ICON_BASE}/staff.svg`,
  github: `${ASSET_ICON_BASE}/github.svg`,
  google: `${ASSET_ICON_BASE}/google.svg`,
  'wechat-mp': `${ASSET_ICON_BASE}/wechat.svg`,
  'wechat-web': `${ASSET_ICON_BASE}/wechat.svg`,
  'tt-mp': `${ASSET_ICON_BASE}/tt.svg`,
  'tt-web': `${ASSET_ICON_BASE}/tt.svg`,
  'alipay-mp': `${ASSET_ICON_BASE}/alipay.svg`,
  'alipay-web': `${ASSET_ICON_BASE}/alipay.svg`,
  wecom: `${ASSET_ICON_BASE}/wecom.svg`,
  passkey: `${ASSET_ICON_BASE}/passkey.svg`,
  global: `${ASSET_ICON_BASE}/global.svg`,
}

function idpLabel(type: string) {
  return IDP_TYPE_LABELS[type] ?? type
}

const STRATEGY_CONFIG: Record<string, { label: string; color: string }> = {
  password: { label: '密码登录', color: 'blue' },
  webauthn: { label: 'Passkey', color: 'purple' },
  turnstile: { label: '验证码', color: 'orange' },
  captcha: { label: '验证码', color: 'orange' },
}

function getStrategyTags(strategy: string | undefined | null): { label: string; color: string }[] {
  if (!strategy || !strategy.trim()) return [{ label: '通用', color: 'default' }]
  const parts = strategy
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  if (parts.length === 0) return [{ label: '通用', color: 'default' }]
  return parts.map(p => {
    const cfg = STRATEGY_CONFIG[p]
    return cfg ? { label: cfg.label, color: cfg.color } : { label: p, color: 'cyan' }
  })
}

// ── URI Tags Input ──

interface UriTagsInputProps {
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
}

function UriTagsInput({ value = [], onChange, placeholder }: UriTagsInputProps) {
  const [inputVal, setInputVal] = useState('')

  const addItem = (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed || value.includes(trimmed)) return
    onChange?.([...value, trimmed])
    setInputVal('')
  }

  const removeItem = (idx: number) => {
    onChange?.(value.filter((_, i) => i !== idx))
  }

  return (
    <div className={styles.uriTagsInput}>
      {value.map((item, idx) => (
        <Tag key={item} closable onClose={() => removeItem(idx)} className={styles.uriTag}>
          {item}
        </Tag>
      ))}
      <Input
        value={inputVal}
        onChange={e => setInputVal(e.target.value)}
        onBlur={() => addItem(inputVal)}
        onPressEnter={e => {
          e.preventDefault()
          addItem(inputVal)
        }}
        placeholder={placeholder}
        className={styles.uriTagsInputField}
        bordered={false}
      />
    </div>
  )
}

// ── Duration Input ──

const DURATION_UNITS = [
  { value: 's', label: '秒', factor: 1 },
  { value: 'm', label: '分', factor: 60 },
  { value: 'h', label: '时', factor: 3600 },
  { value: 'd', label: '天', factor: 86400 },
] as const

function secondsToDisplay(seconds: number | undefined): {
  num: number | undefined
  unit: (typeof DURATION_UNITS)[number]['value']
} {
  if (seconds == null || seconds < 0) return { num: undefined, unit: 's' }
  if (seconds === 0) return { num: 0, unit: 's' }
  for (let i = DURATION_UNITS.length - 1; i >= 0; i--) {
    const u = DURATION_UNITS[i]
    if (seconds >= u.factor && seconds % u.factor === 0)
      return { num: seconds / u.factor, unit: u.value }
  }
  return { num: seconds, unit: 's' }
}

interface DurationInputProps {
  value?: number
  onChange?: (seconds: number | undefined) => void
  placeholder?: string
  min?: number
}

function DurationInput({ value, onChange, placeholder = '默认', min = 0 }: DurationInputProps) {
  const display = secondsToDisplay(value)
  const [selectedUnit, setSelectedUnit] = useState(display.unit)

  useEffect(() => {
    setSelectedUnit(secondsToDisplay(value).unit)
  }, [value])

  const factor = DURATION_UNITS.find(u => u.value === selectedUnit)?.factor ?? 1
  const displayNum = value != null ? value / factor : undefined

  return (
    <div className={styles.durationInput}>
      <InputNumber
        min={min}
        value={displayNum}
        onChange={v => onChange?.(v != null ? Math.round(Number(v)) * factor : undefined)}
        placeholder={placeholder}
        className={styles.durationNumber}
      />
      <Segmented
        value={selectedUnit}
        onChange={v => {
          const newUnit = v as (typeof DURATION_UNITS)[number]['value']
          const newFactor = DURATION_UNITS.find(u => u.value === newUnit)?.factor ?? 1
          setSelectedUnit(newUnit)
          if (displayNum != null) {
            onChange?.(Math.round(displayNum) * newFactor)
          }
        }}
        options={DURATION_UNITS.map(u => ({ label: u.label, value: u.value }))}
        size="small"
        className={styles.durationSegmented}
      />
    </div>
  )
}

// ── Sortable IDP Card ──

interface SortableIdpCardProps {
  idp: ApplicationIDPConfig
  onEdit: (idp: ApplicationIDPConfig) => void
  onDelete: (idpType: string) => void
}

function SortableIdpCard({ idp, onEdit, onDelete }: SortableIdpCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: idp.type,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.idpCard} data-dragging={isDragging}>
      <div
        className={styles.idpCardDragHandle}
        {...attributes}
        {...listeners}
        aria-label="拖拽排序"
      >
        <HolderOutlined />
      </div>
      <div className={styles.idpCardMain}>
        <span className={styles.idpTypeCell}>
          {IDP_ICON_URLS[idp.type] && (
            <img src={IDP_ICON_URLS[idp.type]} alt="" className={styles.idpIcon} aria-hidden />
          )}
          <span className={styles.idpTypeLabel}>{idpLabel(idp.type)}</span>
        </span>
        <span className={styles.idpStrategy}>
          {getStrategyTags(idp.strategy ?? undefined).map(({ label, color }) => (
            <Tag key={label} color={color} className={styles.idpStrategyTag}>
              {label}
            </Tag>
          ))}
        </span>
      </div>
      <Space size="small" className={styles.idpCardActions}>
        <Button type="text" size="small" icon={<EditOutlined />} onClick={() => onEdit(idp)} />
        <Popconfirm
          title="确认删除该身份源配置？"
          onConfirm={() => onDelete(idp.type)}
          okText="删除"
          cancelText="取消"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    </div>
  )
}

// ── Stat Card ──

function StatCard({
  label,
  value,
  icon,
  copyable,
}: {
  label: string
  value: string
  icon?: React.ReactNode
  copyable?: boolean
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statLabel}>{label}</span>
        {icon && <span className={styles.statIcon}>{icon}</span>}
      </div>
      <span className={styles.statValue}>
        {copyable ? (
          <Text
            copyable={{
              text: value,
              tooltips: ['复制', '已复制'],
              icon: <CopyOutlined className={styles.statCopyIcon} />,
            }}
          >
            {value}
          </Text>
        ) : (
          value
        )}
      </span>
    </div>
  )
}

// ── Parse URIs helper ──

function parseUriArray(raw: unknown): string[] {
  try {
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return []
}

// ── Main Detail Component ──

export function Detail() {
  const { appId } = useParams<{ appId: string }>()
  const domainId = useDomainId()
  const navigate = useAppNavigate()
  const [activeTab, setActiveTab] = useState('basic')
  const [settingsDirty, setSettingsDirty] = useState(false)
  const [settingsForm] = Form.useForm()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [idpModalOpen, setIdpModalOpen] = useState(false)
  const [editingIdp, setEditingIdp] = useState<ApplicationIDPConfig | null>(null)
  const [idpForm] = Form.useForm()

  const { data, loading, refresh } = useRequest(() => applicationApi.getDetail(domainId!, appId!), {
    ready: !!domainId && !!appId,
    onError: () => message.error('获取应用信息失败'),
  })

  const [prevData, setPrevData] = useState(data)
  if (data !== prevData) {
    setPrevData(data)
    setSettingsDirty(false)
  }

  const {
    data: serviceRelations,
    loading: svcRelLoading,
    refresh: refreshRelations,
  } = useRequest(() => applicationApi.getServiceRelations(domainId!, appId!), {
    ready: !!domainId && !!appId && activeTab === 'relations',
  })

  const {
    data: idpConfigs,
    loading: idpLoading,
    refresh: refreshIdpConfigs,
  } = useRequest(() => applicationApi.getIDPConfigs(domainId!, appId!), {
    ready: !!domainId && !!appId && activeTab === 'auth',
  })

  const { data: domainIdps } = useRequest(() => domainApi.getIDPs(domainId!), {
    ready: !!domainId && idpModalOpen,
  })

  const availableIdpTypes = useMemo(() => {
    if (!domainIdps) return []
    const configured = new Set((idpConfigs ?? []).map(c => c.type))
    return domainIdps
      .filter(d => !configured.has(d.idp_type) || editingIdp?.type === d.idp_type)
      .map(d => ({ label: idpLabel(d.idp_type), value: d.idp_type }))
  }, [domainIdps, idpConfigs, editingIdp])

  const { run: runSaveSettings, loading: saving } = useRequest(
    async (values: {
      name: string
      description?: string
      allowed_redirect_uris?: string[]
      allowed_origins?: string[]
      allowed_logout_uris?: string[]
      id_token_expires_in?: number
      refresh_token_expires_in?: number
      refresh_token_absolute_expires_in?: number
    }) => {
      const allowedRedirectUris = (values.allowed_redirect_uris ?? [])
        .map(s => s.trim())
        .filter(Boolean)
      const allowedOrigins = (values.allowed_origins ?? []).map(s => s.trim()).filter(Boolean)
      const allowedLogoutUris = (values.allowed_logout_uris ?? [])
        .map(s => s.trim())
        .filter(Boolean)
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
    { manual: true, onError: () => message.error('保存失败') }
  )

  const { run: runCreateIdp, loading: creatingIdp } = useRequest(
    async (values: {
      type: string
      priority?: number
      strategy?: string
      delegate?: string
      require?: string
    }) => {
      await applicationApi.createIDPConfig(domainId!, appId!, values)
      refreshIdpConfigs()
      setIdpModalOpen(false)
      idpForm.resetFields()
      message.success('已添加')
    },
    { manual: true, onError: () => message.error('添加失败') }
  )

  const { run: runUpdateIdp, loading: updatingIdp } = useRequest(
    async (
      idpType: string,
      values: { priority?: number; strategy?: string; delegate?: string; require?: string }
    ) => {
      await applicationApi.updateIDPConfig(domainId!, appId!, idpType, values)
      refreshIdpConfigs()
      setIdpModalOpen(false)
      setEditingIdp(null)
      idpForm.resetFields()
      message.success('已更新')
    },
    { manual: true, onError: () => message.error('更新失败') }
  )

  const { run: runDeleteIdp } = useRequest(
    async (idpType: string) => {
      await applicationApi.deleteIDPConfig(domainId!, appId!, idpType)
      refreshIdpConfigs()
      message.success('已删除')
    },
    { manual: true, onError: () => message.error('删除失败') }
  )

  const { run: runBatchUpdatePriority, loading: batchUpdating } = useRequest(
    async (ordered: ApplicationIDPConfig[]) => {
      const updates = ordered.map((idp, index) =>
        applicationApi.updateIDPConfig(domainId!, appId!, idp.type, {
          priority: ordered.length - 1 - index,
        })
      )
      await Promise.all(updates)
      refreshIdpConfigs()
      message.success('优先级已更新')
    },
    { manual: true, onError: () => message.error('更新优先级失败') }
  )

  const handleIdpDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !idpConfigs?.length) return
    const oldIndex = idpConfigs.findIndex(c => c.type === active.id)
    const newIndex = idpConfigs.findIndex(c => c.type === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = arrayMove(idpConfigs, oldIndex, newIndex)
    runBatchUpdatePriority(reordered)
  }

  useEffect(() => {
    if (!data) return
    settingsForm.setFieldsValue({
      name: data.name,
      description: data.description ?? '',
      allowed_redirect_uris: parseUriArray(data.allowed_redirect_uris),
      allowed_origins: parseUriArray(data.allowed_origins),
      allowed_logout_uris: parseUriArray(data.allowed_logout_uris),
      id_token_expires_in: data.id_token_expires_in || undefined,
      refresh_token_expires_in: data.refresh_token_expires_in || undefined,
      refresh_token_absolute_expires_in: data.refresh_token_absolute_expires_in || undefined,
    })
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
    settingsForm.setFieldsValue({
      name: data.name,
      description: data.description ?? '',
      allowed_redirect_uris: parseUriArray(data.allowed_redirect_uris),
      allowed_origins: parseUriArray(data.allowed_origins),
      allowed_logout_uris: parseUriArray(data.allowed_logout_uris),
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

  const idpSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

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
      key: 'basic',
      label: '基本信息',
      children: (
        <div className={styles.tabContent}>
          <Form
            form={settingsForm}
            layout="vertical"
            className={styles.settingsForm}
            onValuesChange={() => setSettingsDirty(true)}
          >
            <div className={styles.logoField}>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={file => {
                  const reader = new FileReader()
                  reader.onload = e => {
                    setLogoPreview(e.target?.result as string)
                    setSettingsDirty(true)
                  }
                  reader.readAsDataURL(file)
                  return false
                }}
              >
                <div className={styles.logoUpload}>
                  <Avatar
                    src={logoPreview ?? data.logo_url}
                    shape="circle"
                    size={80}
                    icon={<AppstoreAddOutlined />}
                  />
                  <div className={styles.logoOverlay}>
                    <CameraOutlined />
                  </div>
                </div>
              </Upload>
            </div>
            <Form.Item
              name="name"
              label="名称"
              rules={[
                { required: true, message: '请输入应用名称' },
                { max: 32, message: '名称不超过 32 个字符' },
              ]}
            >
              <Input placeholder="应用名称" maxLength={32} showCount />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <TextArea rows={3} placeholder="可选的应用描述" />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: 'config',
      label: '配置信息',
      children: (
        <div className={styles.tabContent}>
          <Form
            form={settingsForm}
            layout="vertical"
            className={styles.settingsForm}
            onValuesChange={() => setSettingsDirty(true)}
          >
            <Form.Item
              name="allowed_redirect_uris"
              label={
                <span>
                  允许的重定向地址
                  <Tooltip title="登录或授权后允许跳转的 URI，需与请求中的 redirect_uri 完全一致">
                    <QuestionCircleOutlined className={styles.labelTooltipIcon} />
                  </Tooltip>
                </span>
              }
              rules={[
                {
                  validator: (_, value) => {
                    const err = validateRedirectUrisArray(Array.isArray(value) ? value : [])
                    return err ? Promise.reject(new Error(err)) : Promise.resolve()
                  },
                },
              ]}
            >
              <UriTagsInput placeholder="输入地址后失焦或回车添加" />
            </Form.Item>
            <Form.Item
              name="allowed_origins"
              label={
                <span>
                  允许的来源
                  <Tooltip title="允许从浏览器端发起跨域请求的来源，仅 scheme://host[:port]">
                    <QuestionCircleOutlined className={styles.labelTooltipIcon} />
                  </Tooltip>
                </span>
              }
              rules={[
                {
                  validator: (_, value) => {
                    const err = validateAllowedOriginsArray(Array.isArray(value) ? value : [])
                    return err ? Promise.reject(new Error(err)) : Promise.resolve()
                  },
                },
              ]}
            >
              <UriTagsInput placeholder="输入地址后失焦或回车添加" />
            </Form.Item>
            <Form.Item
              name="allowed_logout_uris"
              label={
                <span>
                  登出跳转地址
                  <Tooltip title="用户点击登出后，可跳转回的白名单地址">
                    <QuestionCircleOutlined className={styles.labelTooltipIcon} />
                  </Tooltip>
                </span>
              }
              rules={[
                {
                  validator: (_, value) => {
                    const err = validateLogoutUrisArray(Array.isArray(value) ? value : [])
                    return err ? Promise.reject(new Error(err)) : Promise.resolve()
                  },
                },
              ]}
            >
              <UriTagsInput placeholder="输入地址后失焦或回车添加" />
            </Form.Item>

            <div className={styles.sectionDivider} />

            <div className={styles.tokenSection}>
              <div className={styles.tokenRow}>
                <div className={styles.tokenRowInfo}>
                  <span className={styles.tokenRowTitle}>
                    ID Token 有效期
                    <Tooltip title="0 或留空使用系统默认值">
                      <QuestionCircleOutlined className={styles.labelTooltipIcon} />
                    </Tooltip>
                  </span>
                  <span className={styles.tokenRowDesc}>用户登录后签发的身份令牌</span>
                </div>
                <Form.Item name="id_token_expires_in" noStyle>
                  <DurationInput placeholder="默认" />
                </Form.Item>
              </div>
              <div className={styles.tokenRow}>
                <div className={styles.tokenRowInfo}>
                  <span className={styles.tokenRowTitle}>
                    Refresh Token 有效期
                    <Tooltip title="0 或留空使用系统默认值">
                      <QuestionCircleOutlined className={styles.labelTooltipIcon} />
                    </Tooltip>
                  </span>
                  <span className={styles.tokenRowDesc}>用于无感刷新访问令牌</span>
                </div>
                <Form.Item name="refresh_token_expires_in" noStyle>
                  <DurationInput placeholder="默认" />
                </Form.Item>
              </div>
              <div className={styles.tokenRow}>
                <div className={styles.tokenRowInfo}>
                  <span className={styles.tokenRowTitle}>
                    Refresh Token 绝对有效期
                    <Tooltip title="0 或留空使用系统默认值">
                      <QuestionCircleOutlined className={styles.labelTooltipIcon} />
                    </Tooltip>
                  </span>
                  <span className={styles.tokenRowDesc}>
                    刷新令牌的最长存活时间，超时需重新登录
                  </span>
                </div>
                <Form.Item name="refresh_token_absolute_expires_in" noStyle>
                  <DurationInput placeholder="默认" />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      ),
    },
    {
      key: 'auth',
      label: '认证方式',
      children: (
        <div className={styles.tabContent}>
          <Spin spinning={idpLoading || batchUpdating}>
            {!idpConfigs?.length ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="尚未配置身份源"
                className={styles.emptyState}
              />
            ) : (
              <>
                <Text type="secondary" className={styles.idpListHint}>
                  拖拽左侧手柄可调整优先级，排在上方的身份源优先使用
                </Text>
                <DndContext
                  sensors={idpSensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleIdpDragEnd}
                >
                  <SortableContext
                    items={(idpConfigs ?? []).map(c => c.type)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className={styles.idpList}>
                      {(idpConfigs ?? []).map(idp => (
                        <SortableIdpCard
                          key={idp.type}
                          idp={idp}
                          onEdit={openEditIdp}
                          onDelete={runDeleteIdp}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </>
            )}
          </Spin>
        </div>
      ),
    },
    {
      key: 'relations',
      label: '关联关系',
      children: (
        <ServicePermissionsView
          appId={appId!}
          appName={data.name}
          appLogoUrl={data.logo_url}
          data={serviceRelations ?? []}
          loading={svcRelLoading}
          onNavigateToService={id => navigate(`/services/${id}`)}
          onRelationsChange={refreshRelations}
        />
      ),
    },
  ]

  return (
    <div className={styles.container}>
      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <div className={styles.pageTitle}>
            <Avatar
              src={data.logo_url}
              size={52}
              icon={<AppstoreAddOutlined />}
              className={styles.pageTitleAvatar}
            />
            <div className={styles.pageTitleText}>
              <h1>{data.name || data.app_id}</h1>
              {data.description && <p>{data.description}</p>}
            </div>
          </div>
        </div>
        <div className={styles.pageHeaderRight}>
          {(activeTab === 'basic' || activeTab === 'config') && (
            <Space size="small">
              {settingsDirty && <Button onClick={handleCancelSettings}>取消</Button>}
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={handleSaveSettings}
              >
                保存
              </Button>
            </Space>
          )}
          {activeTab === 'auth' && (
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddIdp}>
              添加身份源
            </Button>
          )}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className={styles.statsRow}>
        <StatCard label="应用标识" value={data.app_id} icon={<KeyOutlined />} copyable />
        <StatCard label="域标识" value={data.domain_id} icon={<GlobalOutlined />} copyable />
        <StatCard label="创建时间" value={formatDateTime(data.created_at)} icon={<ClockCircleOutlined />} />
        <StatCard label="更新时间" value={formatDateTime(data.updated_at)} icon={<SyncOutlined />} />
      </div>

      {/* ── Tabs ── */}
      <div className={styles.mainContent}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className={styles.tabs}
        />
      </div>

      {/* ── IDP Modal ── */}
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
        destroyOnHidden
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
