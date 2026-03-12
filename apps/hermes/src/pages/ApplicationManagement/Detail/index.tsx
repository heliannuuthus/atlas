import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRequest } from 'ahooks'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Alert,
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
  Avatar,
  Segmented,
  Upload,
} from 'antd'
import type { UploadProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useParams } from 'react-router-dom'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import {
  InfoCircleOutlined,
  SettingOutlined,
  ArrowLeftOutlined,
  NodeIndexOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ApiOutlined,
  LinkOutlined,
  HolderOutlined,
  UserOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  CameraOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { chaosRequest } from '@atlas/shared'
import { applicationApi, domainApi, serviceApi } from '@/services'
import type { ApplicationServiceRelation, ApplicationIDPConfig } from '@/types'
import {
  validateRedirectUri,
  validateAllowedOrigin,
  validateRedirectUrisArray,
  validateAllowedOriginsArray,
  validateLogoutUrisArray,
} from '@/utils/uri-validation'
import { formatDateTime } from '@atlas/shared'
import { AppServiceRelationGraph } from './AppServiceRelationGraph'
import styles from './index.module.scss'

const { Text, Link } = Typography
const { TextArea } = Input

const URI_TAG_MAX_LEN = 48

interface UriTagListProps {
  value?: string[]
  onChange?: (value: string[]) => void
  validate: (uri: string) => string | null
  placeholder?: string
  className?: string
}

function UriTagList({ value = [], onChange, validate, placeholder, className }: UriTagListProps) {
  const [inputVal, setInputVal] = useState('')
  const [addError, setAddError] = useState<string | null>(null)

  const handleAdd = () => {
    const trimmed = inputVal.trim()
    if (!trimmed) return
    const err = validate(trimmed)
    if (err) {
      setAddError(err)
      return
    }
    if (value.includes(trimmed)) {
      setAddError('该地址已存在')
      return
    }
    onChange?.([...value, trimmed])
    setInputVal('')
    setAddError(null)
  }

  const handleRemove = (uri: string) => {
    onChange?.(value.filter((v) => v !== uri))
  }

  return (
    <div className={className}>
      <div className={styles.uriTagList}>
        <div className={styles.uriTagAdd}>
          <Input
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value)
              setAddError(null)
            }}
            onPressEnter={(e) => {
              e.preventDefault()
              handleAdd()
            }}
            placeholder={placeholder}
            status={addError ? 'error' : undefined}
            size="small"
            className={styles.uriTagInput}
          />
          <Tooltip title={addError || '添加'}>
            <Button type="text" size="small" icon={<PlusOutlined />} onClick={handleAdd} className={styles.uriTagAddBtn} />
          </Tooltip>
        </div>
        {value.map((uri) => (
          <Tooltip key={uri} title={uri} placement="topLeft">
            <Tag closable onClose={() => handleRemove(uri)} className={styles.uriTag}>
              {uri.length > URI_TAG_MAX_LEN ? `${uri.slice(0, URI_TAG_MAX_LEN)}…` : uri}
            </Tag>
          </Tooltip>
        ))}
      </div>
      {addError && <Text type="danger" className={styles.uriTagError}>{addError}</Text>}
    </div>
  )
}

/** 时间单位与秒的换算 */
const UNIT_TO_SECONDS: Record<string, number> = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
}

const UNIT_OPTIONS: { label: string; value: string }[] = [
  { label: '秒', value: 'second' },
  { label: '分钟', value: 'minute' },
  { label: '小时', value: 'hour' },
  { label: '天', value: 'day' },
]

type TokenUnit = 'second' | 'minute' | 'hour' | 'day'

/** 单个输入框带单位切换，保存后默认展示秒 */
function TokenExpiryField({
  value,
  onChange,
  placeholder = '默认',
  min = 0,
}: {
  value?: number
  onChange?: (value: number | null) => void
  placeholder?: string
  min?: number
}) {
  const [unit, setUnit] = useState<TokenUnit>('second')
  const factor = UNIT_TO_SECONDS[unit] ?? 1
  const displayValue = value == null ? undefined : value / factor

  const handleChange = (v: number | null) => {
    if (v == null) {
      onChange?.(null)
      return
    }
    onChange?.(Math.round(v * factor))
  }

  return (
    <Space.Compact size="middle">
      <InputNumber
        min={min}
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        style={{ flex: 1, minWidth: 120 }}
        precision={unit === 'second' ? 0 : 2}
      />
      <Select
        style={{ minWidth: 18, width: 100 }}
        value={unit}
        onChange={(v) => setUnit(v as TokenUnit)}
        options={UNIT_OPTIONS}
        size="middle"
        className={styles.tokenUnitSelect}
      />
    </Space.Compact>
  )
}

/** ID Token 超过 1 小时视为过长，需提示风险 */
const ID_TOKEN_WARNING_THRESHOLD_SEC = 3600

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

const IDP_ICON_SIZE = 20

const IdpIconGoogle = () => (
  <svg width={IDP_ICON_SIZE} height={IDP_ICON_SIZE} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const IdpIconGithub = () => (
  <svg width={IDP_ICON_SIZE} height={IDP_ICON_SIZE} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const IDP_TYPE_ICONS: Record<string, React.ReactNode> = {
  user: <UserOutlined style={{ color: '#1677ff' }} />,
  staff: <IdcardOutlined style={{ color: '#6366f1' }} />,
  github: <IdpIconGithub />,
  google: <IdpIconGoogle />,
  'wechat-mp': <ApiOutlined style={{ color: '#07c160' }} />,
  'wechat-web': <ApiOutlined style={{ color: '#07c160' }} />,
  'tt-mp': <ApiOutlined />,
  'tt-web': <ApiOutlined />,
  'alipay-mp': <ApiOutlined style={{ color: '#1677ff' }} />,
  'alipay-web': <ApiOutlined style={{ color: '#1677ff' }} />,
  wecom: <ApiOutlined style={{ color: '#297dce' }} />,
  passkey: <SafetyCertificateOutlined style={{ color: '#faad14' }} />,
  global: <GlobalOutlined style={{ color: '#722ed1' }} />,
}

function idpIcon(type: string) {
  return IDP_TYPE_ICONS[type] ?? <ApiOutlined />
}

function parseStrategyList(strategy?: string): string[] {
  if (!strategy?.trim()) return []
  return strategy.split(',').map((s) => s.trim()).filter(Boolean)
}

function IdpSortableItem({
  item,
  index,
  onEdit,
  onDelete,
}: {
  item: ApplicationIDPConfig
  index: number
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.type })
  const strategies = parseStrategyList(item.strategy)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.idpSortableItem} data-dragging={isDragging}>
      <span {...attributes} {...listeners} className={styles.idpDragHandle}>
        <HolderOutlined />
      </span>
      <span className={styles.idpOrder}>{index + 1}</span>
      <span className={styles.idpIconWrap} data-type={item.type}>{idpIcon(item.type)}</span>
      <div className={styles.idpContent}>
        <div className={styles.idpTitleRow}>
          <span className={styles.idpName}>{idpLabel(item.type)}</span>
          <span className={styles.idpTypeTag}>{item.type}</span>
        </div>
        <div className={styles.idpAppId}>
          <Typography.Text
            copyable={{ text: item.app_id, tooltips: ['复制', '已复制'] }}
            className={styles.idpAppIdValue}
          >
            {item.app_id}
          </Typography.Text>
        </div>
      </div>
      <div className={styles.idpStrategyCol}>
        <span className={styles.idpStrategyLabel}>认证策略</span>
        {strategies.length === 0 ? (
          <span className={styles.idpStrategyValue}>默认</span>
        ) : (
          strategies.map((s) => <Tag key={s} bordered={false} className={styles.idpStrategyTag}>{s}</Tag>)
        )}
      </div>
      <Button type="text" size="small" icon={<EditOutlined />} onClick={onEdit} className={styles.idpEditBtn} />
      <Popconfirm
        title="确认移除该身份源？"
        onConfirm={onDelete}
        okText="移除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Button type="text" size="small" danger icon={<DeleteOutlined />} className={styles.idpDeleteBtn} />
      </Popconfirm>
    </div>
  )
}

export function Detail() {
  const { appId } = useParams<{ appId: string }>()
  const domainId = useDomainId()
  const navigate = useAppNavigate()
  const [activeTab, setActiveTab] = useState('basic')
  const [relationViewMode, setRelationViewMode] = useState<'table' | 'graph'>('graph')
  const [editedRelations, setEditedRelations] = useState<ApplicationServiceRelation[] | null>(null)
  const [settingsDirty, setSettingsDirty] = useState(false)
  const [settingsForm] = Form.useForm()
  const [idpModalOpen, setIdpModalOpen] = useState(false)
  const [idpEditModalOpen, setIdpEditModalOpen] = useState(false)
  const [idpEditTarget, setIdpEditTarget] = useState<ApplicationIDPConfig | null>(null)
  const [idpForm] = Form.useForm()
  const [idpEditForm] = Form.useForm()
  const [idpOrder, setIdpOrder] = useState<ApplicationIDPConfig[]>([])
  const [tokenFieldKey, setTokenFieldKey] = useState(0)

  const { data, loading, refresh } = useRequest(
    () => applicationApi.getDetail(domainId!, appId!),
    { ready: !!domainId && !!appId, onError: () => message.error('获取应用信息失败') },
  )

  const { data: serviceRelations, loading: svcRelLoading, refresh: refreshServiceRelations } = useRequest(
    () => applicationApi.getServiceRelations(domainId!, appId!),
    { ready: !!domainId && !!appId && activeTab === 'relations' },
  )

  const { data: services } = useRequest(
    () => serviceApi.getList(domainId!),
    { ready: !!domainId && activeTab === 'relations' },
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
      .filter((d) => !configured.has(d.idp_type))
      .map((d) => ({
        label: (
          <Space>
            <span style={{ fontSize: 16, display: 'flex' }}>{idpIcon(d.idp_type)}</span>
            {idpLabel(d.idp_type)}
          </Space>
        ),
        value: d.idp_type,
      }))
  }, [domainIdps, idpConfigs])

  const { run: runSaveSettings, loading: saving } = useRequest(
    async (values: {
      name: string
      description?: string
      logo_url?: string
      allowed_redirect_uris?: string[]
      allowed_origins?: string[]
      allowed_logout_uris?: string[]
      id_token_expires_in?: number
      refresh_token_expires_in?: number
      refresh_token_absolute_expires_in?: number
    }) => {
      const allowedRedirectUris = values.allowed_redirect_uris ?? []
      const allowedOrigins = values.allowed_origins ?? []
      const allowedLogoutUris = values.allowed_logout_uris ?? []
      await applicationApi.update(domainId!, appId!, {
        name: values.name,
        description: values.description || undefined,
        logo_url: values.logo_url?.trim() || undefined,
        allowed_redirect_uris: allowedRedirectUris,
        allowed_origins: allowedOrigins,
        allowed_logout_uris: allowedLogoutUris,
        id_token_expires_in: values.id_token_expires_in,
        refresh_token_expires_in: values.refresh_token_expires_in,
        refresh_token_absolute_expires_in: values.refresh_token_absolute_expires_in,
      })
      refresh()
      setSettingsDirty(false)
      setTokenFieldKey((k) => k + 1)
      message.success('已保存')
    },
    { manual: true, onError: () => message.error('保存失败') },
  )

  const { run: runCreateIdp, loading: creatingIdp } = useRequest(
    async (values: { type: string }) => {
      const priority = (idpConfigs ?? []).length
      await applicationApi.createIDPConfig(domainId!, appId!, { type: values.type, priority })
      refreshIdpConfigs()
      setIdpModalOpen(false)
      idpForm.resetFields()
      message.success('已添加')
    },
    { manual: true, onError: () => message.error('添加失败') },
  )

  const { run: runReorderIdps } = useRequest(
    async (ordered: ApplicationIDPConfig[]) => {
      for (let i = 0; i < ordered.length; i++) {
        if (ordered[i].priority !== i) {
          await applicationApi.updateIDPConfig(domainId!, appId!, ordered[i].type, { priority: i })
        }
      }
      refreshIdpConfigs()
      message.success('已更新顺序')
    },
    { manual: true, onError: () => message.error('更新顺序失败') },
  )

  const { run: runUpdateIdp, loading: updatingIdp } = useRequest(
    async (idpType: string, values: { strategy?: string; delegate?: string; require?: string }) => {
      await applicationApi.updateIDPConfig(domainId!, appId!, idpType, {
        strategy: values.strategy?.trim() || undefined,
        delegate: values.delegate?.trim() || undefined,
        require: values.require?.trim() || undefined,
      })
      refreshIdpConfigs()
      setIdpEditModalOpen(false)
      setIdpEditTarget(null)
      idpEditForm.resetFields()
      message.success('已保存')
    },
    { manual: true, onError: () => message.error('保存失败') },
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
      logo_url: data.logo_url ?? '',
      allowed_redirect_uris: uris,
      allowed_origins: origins,
      allowed_logout_uris: logoutUris,
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
      logo_url: data.logo_url ?? '',
      allowed_redirect_uris: uris,
      allowed_origins: origins,
      allowed_logout_uris: logoutUris,
      id_token_expires_in: data.id_token_expires_in || undefined,
      refresh_token_expires_in: data.refresh_token_expires_in || undefined,
      refresh_token_absolute_expires_in: data.refresh_token_absolute_expires_in || undefined,
    })
    setSettingsDirty(false)
  }

  const handleIdpModalOk = async () => {
    try {
      const values = await idpForm.validateFields()
      await runCreateIdp(values)
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'errorFields' in e) return
    }
  }

  const openAddIdp = () => {
    idpForm.resetFields()
    setIdpModalOpen(true)
  }

  const handleEditIdp = (item: ApplicationIDPConfig) => {
    setIdpEditTarget(item)
    idpEditForm.setFieldsValue({
      strategy: item.strategy ?? '',
      delegate: item.delegate ?? '',
      require: item.require ?? '',
    })
    setIdpEditModalOpen(true)
  }

  const handleIdpEditOk = async () => {
    if (!idpEditTarget) return
    try {
      const values = await idpEditForm.validateFields()
      await runUpdateIdp(idpEditTarget.type, values)
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'errorFields' in e) return
    }
  }

  const sortedIdpConfigs = useMemo(() => {
    const list = idpConfigs ?? []
    return [...list].sort((a, b) => a.priority - b.priority)
  }, [idpConfigs])

  useEffect(() => {
    setIdpOrder(sortedIdpConfigs)
  }, [sortedIdpConfigs])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleServiceClick = useCallback(
    (serviceId: string) => navigate(`/services/${serviceId}`),
    [navigate]
  )

  const relationDirty = useMemo(() => {
    if (editedRelations === null || serviceRelations == null) return false
    const norm = (a: ApplicationServiceRelation[]) =>
      JSON.stringify(a.map((r) => ({ service_id: r.service_id, relations: [...(r.relations ?? [])].sort() })).sort((x, y) => x.service_id.localeCompare(y.service_id)))
    return norm(editedRelations) !== norm(serviceRelations)
  }, [editedRelations, serviceRelations])

  const { run: runSaveRelations, loading: savingRelations } = useRequest(
    async () => {
      if (!domainId || !appId || editedRelations === null) return
      const origMap = new Map(
        (serviceRelations ?? []).map((r) => [r.service_id, r.relations])
      )
      const editedMap = new Map(editedRelations.map((r) => [r.service_id, r.relations ?? []]))

      for (const [serviceId, relations] of editedMap) {
        const orig = origMap.get(serviceId)
        const same =
          orig &&
          orig.length === relations.length &&
          orig.every((v, i) => v === relations[i])
        if (!same) {
          await serviceApi.setServiceAppRelations(domainId, serviceId, appId, relations)
        }
      }
      for (const serviceId of origMap.keys()) {
        if (!editedMap.has(serviceId)) {
          await serviceApi.setServiceAppRelations(domainId, serviceId, appId, [])
        }
      }
      setEditedRelations(null)
      refreshServiceRelations()
      message.success('已保存')
    },
    { manual: true, onError: () => message.error('保存失败') }
  )

  const handleCancelRelations = useCallback(() => {
    setEditedRelations(null)
  }, [])

  const handleIdpDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldList = [...idpOrder]
      const oldIndex = oldList.findIndex((i) => i.type === active.id)
      const newIndex = oldList.findIndex((i) => i.type === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const newList = arrayMove(oldList, oldIndex, newIndex)
      setIdpOrder(newList)
      runReorderIdps(newList)
    },
    [idpOrder, runReorderIdps],
  )

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
      key: 'basic',
      label: (
        <span className={styles.tabLabel}>
          <InfoCircleOutlined />
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
              <div className={styles.sectionBody}>
                <div className={styles.basicInfoWrap}>
                  <div className={styles.basicInfoRow}>
                    <Form.Item noStyle shouldUpdate={(prev, curr) => prev.logo_url !== curr.logo_url || prev.name !== curr.name}>
                      {({ getFieldValue, setFieldValue }) => {
                        const uploadProps: UploadProps = {
                          name: 'file',
                          accept: 'image/*',
                          showUploadList: false,
                          customRequest: async ({ file, onSuccess, onError }) => {
                            try {
                              const formData = new FormData()
                              formData.append('file', file as Blob)
                              const res = await chaosRequest.post<{
                                key: string
                                file_name: string
                                file_size: number
                                content_type: string
                                public_url: string
                              }>('/chaos/files', formData, {
                                headers: { 'Content-Type': undefined },
                              } as import('axios').AxiosRequestConfig)
                              setFieldValue('logo_url', (res as { public_url?: string })?.public_url || '')
                              setSettingsDirty(true)
                              onSuccess?.(res)
                              message.success('头像上传成功')
                            } catch (e) {
                              onError?.(e as Error)
                              message.error('上传失败，请检查 Chaos 文件服务权限')
                            }
                          },
                        }
                        return (
                          <Upload {...uploadProps}>
                            <div className={styles.avatarPreview}>
                              <Avatar
                                src={getFieldValue('logo_url')?.trim() || undefined}
                                shape="circle"
                                size={56}
                                className={styles.avatarImg}
                              >
                                {getFieldValue('name')?.charAt(0)?.toUpperCase() || data?.name?.charAt(0)?.toUpperCase() || 'A'}
                              </Avatar>
                              <span className={styles.avatarHint}>
                                <CameraOutlined />
                                点击上传
                              </span>
                            </div>
                          </Upload>
                        )
                      }}
                    </Form.Item>
                    <div className={styles.basicInfoFields}>
                      <Form.Item name="name" label="名称">
                        <Input placeholder="应用名称" />
                      </Form.Item>
                      <Form.Item name="description" label="描述">
                        <TextArea rows={3} placeholder="可选的应用描述" />
                      </Form.Item>
                    </div>
                  </div>
                  <Form.Item name="logo_url" noStyle hidden>
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
      ),
    },
    {
      key: 'config',
      label: (
        <span className={styles.tabLabel}>
          <SettingOutlined />
          配置信息
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
              <div className={styles.sectionBody}>
                <div className={styles.uriSection}>
                  <Form.Item
                      name="allowed_redirect_uris"
                    label="重定向 URI"
                    tooltip="OAuth 授权成功后跳转的地址，需与请求中的 redirect_uri 完全一致。"
                    rules={[
                      {
                        validator: (_, value: string[]) => {
                          const err = validateRedirectUrisArray(value ?? [])
                          return err ? Promise.reject(new Error(err)) : Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <UriTagList
                      validate={validateRedirectUri}
                      placeholder="https://example.com/callback"
                      className={styles.uriTagListWrap}
                    />
                  </Form.Item>
                </div>
                <div className={styles.uriSection}>
                  <Form.Item
                    name="allowed_origins"
                    label="允许的来源 (CORS)"
                    tooltip="允许从浏览器端发起跨域请求的来源，仅 scheme://host[:port]，不含路径。"
                    rules={[
                      {
                        validator: (_, value: string[]) => {
                          const err = validateAllowedOriginsArray(value ?? [])
                          return err ? Promise.reject(new Error(err)) : Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <UriTagList
                      validate={validateAllowedOrigin}
                      placeholder="https://example.com"
                      className={styles.uriTagListWrap}
                    />
                  </Form.Item>
                </div>
                <div className={styles.uriSection}>
                  <Form.Item
                    name="allowed_logout_uris"
                    label="登出后跳转 URI"
                    tooltip="登出后允许跳转的地址（post_logout_redirect_uri）。"
                    rules={[
                      {
                        validator: (_, value: string[]) => {
                          const err = validateLogoutUrisArray(value ?? [])
                          return err ? Promise.reject(new Error(err)) : Promise.resolve()
                        },
                      },
                    ]}
                  >
                    <UriTagList
                      validate={validateRedirectUri}
                      placeholder="https://example.com"
                      className={styles.uriTagListWrap}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className={styles.sectionDivider} />
            <div className={styles.section}>
              <div className={styles.sectionBody}>
                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.id_token_expires_in !== curr.id_token_expires_in}>
                  {({ getFieldValue }) => {
                    const idTokenSec = getFieldValue('id_token_expires_in')
                    const showIdTokenWarning =
                      idTokenSec != null && idTokenSec > 0 && idTokenSec > ID_TOKEN_WARNING_THRESHOLD_SEC
                    return showIdTokenWarning ? (
                      <Alert
                        type="warning"
                        icon={<WarningOutlined />}
                        title="ID Token 有效期过长"
                        description="过期时间设得太长，一旦泄露容易被他人长期滥用。建议缩短到 1 小时以内，并及时调校。"
                        showIcon
                        className={styles.tokenWarning}
                      />
                    ) : null
                  }}
                </Form.Item>
                <div className={styles.tokenFields}>
                  <Form.Item
                    name="id_token_expires_in"
                    label="ID Token 有效期"
                    tooltip="用户登录后拿到的身份凭证，多久过期。设太长时间容易被别人截获后滥用，建议别超过 1 小时。"
                    rules={[{ type: 'number', min: 0, message: '不能为负数' }]}
                  >
                    <TokenExpiryField key={`${tokenFieldKey}-id`} />
                  </Form.Item>
                  <Form.Item
                    name="refresh_token_expires_in"
                    label="Refresh Token 有效期"
                    tooltip="用来续期 ID Token 的「沉睡」时间：这段时间内没用过就会过期。比如 7 天，意思是 7 天不登录就失效。"
                    rules={[{ type: 'number', min: 0, message: '不能为负数' }]}
                  >
                    <TokenExpiryField key={`${tokenFieldKey}-refresh`} />
                  </Form.Item>
                  <Form.Item
                    name="refresh_token_absolute_expires_in"
                    label="Refresh Token 绝对有效期"
                    tooltip="Refresh Token 从生成起最多能用多久，到时间就彻底失效，必须重新登录。"
                    rules={[{ type: 'number', min: 0, message: '不能为负数' }]}
                  >
                    <TokenExpiryField key={`${tokenFieldKey}-absolute`} />
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
          认证来源
          {idpConfigs != null && idpConfigs.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>
              {idpConfigs.length}
            </Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.idpTab}>
          {idpLoading ? (
            <Spin />
          ) : (idpOrder.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="尚未配置身份源" />
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleIdpDragEnd}>
              <SortableContext items={idpOrder.map((i) => i.type)} strategy={verticalListSortingStrategy}>
                <div className={styles.idpSortableList}>
                  {idpOrder.map((item, index) => (
                    <IdpSortableItem
                      key={item.type}
                      item={item}
                      index={index}
                      onEdit={() => handleEditIdp(item)}
                      onDelete={() => runDeleteIdp(item.type)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ))}
        </div>
      ),
    },
    {
      key: 'relations',
      label: (
        <span className={styles.tabLabel}>
          <NodeIndexOutlined />
          关联关系
          {serviceRelations != null && serviceRelations.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>
              {serviceRelations.length}
            </Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.permissionsTab}>
          {relationViewMode === 'graph' ? (
            svcRelLoading ? (
              <div className={styles.relationGraphLoading}>
                <Spin />
              </div>
            ) : (
              <AppServiceRelationGraph
                appName={data?.name || data?.app_id || ''}
                relations={editedRelations ?? serviceRelations ?? []}
                availableServices={services ?? []}
                editable
                onServiceClick={handleServiceClick}
                onChange={setEditedRelations}
              />
            )
          ) : (
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
          )}
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
            activeTab === 'basic' || activeTab === 'config' ? (
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
            ) : activeTab === 'idp' ? (
              <Button type="primary" icon={<PlusOutlined />} onClick={openAddIdp}>
                添加身份源
              </Button>
            ) : activeTab === 'relations' ? (
              <Space size="small">
                <Segmented
                  value={relationViewMode}
                  onChange={(v) => setRelationViewMode(v as 'table' | 'graph')}
                  options={[
                    { label: '图谱', value: 'graph' },
                    { label: '表格', value: 'table' },
                  ]}
                  size="small"
                />
                {relationDirty && (
                  <>
                    <Button icon={<CloseOutlined />} onClick={handleCancelRelations}>
                      取消
                    </Button>
                    <Button
                      type="primary"
                      icon={<SaveOutlined />}
                      loading={savingRelations}
                      onClick={() => runSaveRelations()}
                    >
                      保存
                    </Button>
                  </>
                )}
              </Space>
            ) : null
          }
        />
      </Card>

      <Modal
        title="添加身份源"
        open={idpModalOpen}
        onOk={handleIdpModalOk}
        onCancel={() => {
          setIdpModalOpen(false)
          idpForm.resetFields()
        }}
        confirmLoading={creatingIdp}
        destroyOnClose
      >
        <Form form={idpForm} layout="vertical" className={styles.idpModalForm}>
          <Form.Item
            name="type"
            label="身份源类型"
            rules={[{ required: true, message: '请选择身份源类型' }]}
          >
            <Select options={availableIdpTypes} placeholder="选择身份源类型" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`编辑身份源 · ${idpEditTarget ? idpLabel(idpEditTarget.type) : ''}`}
        open={idpEditModalOpen}
        onOk={handleIdpEditOk}
        onCancel={() => {
          setIdpEditModalOpen(false)
          setIdpEditTarget(null)
          idpEditForm.resetFields()
        }}
        confirmLoading={updatingIdp}
        destroyOnClose
      >
        <Form form={idpEditForm} layout="vertical" className={styles.idpModalForm}>
          <Form.Item name="strategy" label="认证策略">
            <Input placeholder="如 password,webauthn，逗号分隔" />
          </Form.Item>
          <Form.Item name="delegate" label="委托策略">
            <Input placeholder="如 email_otp,totp,webauthn" />
          </Form.Item>
          <Form.Item name="require" label="必选策略">
            <Input placeholder="如 captcha" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
