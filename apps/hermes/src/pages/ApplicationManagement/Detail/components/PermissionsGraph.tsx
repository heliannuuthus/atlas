import { memo, useMemo, useCallback, useState, useEffect } from 'react'
import { useRequest } from 'ahooks'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  Position,
  Handle,
  getBezierPath,
  EdgeLabelRenderer,
  type NodeProps,
  type EdgeProps,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  Tag,
  Tooltip,
  Button,
  Modal,
  Form,
  Select,
  Input,
  Space,
  Badge,
  Avatar,
  message,
} from 'antd'
import {
  CloudServerOutlined,
  AppstoreOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useDomainId } from '@/contexts/DomainContext'
import { serviceApi } from '@/services'
import type { ApplicationServiceRelation, Service } from '@/types'
import styles from './PermissionsGraph.module.scss'

const TAG_COLOR_PALETTE = ['blue', 'purple', 'cyan', 'orange', 'magenta', 'gold'] as const

function hashColor(str: string): (typeof TAG_COLOR_PALETTE)[number] {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return TAG_COLOR_PALETTE[Math.abs(h) % TAG_COLOR_PALETTE.length]
}

// ── 节点：应用 ──

interface AppNodeData {
  appId: string
  name: string
  logoUrl?: string
}

function AppNodeComponent({ data }: NodeProps<AppNodeData>) {
  return (
    <div className={styles.appNode}>
      <Handle type="source" position={Position.Right} className={styles.handle} />
      <div className={styles.graphNodeHeader}>
        <AppstoreOutlined className={styles.graphNodeIcon} style={{ color: '#059669' }} />
        <span className={styles.graphNodeType}>application</span>
      </div>
      <div className={styles.graphNodeBody}>
        <Avatar
          size={28}
          src={data.logoUrl}
          icon={!data.logoUrl && <AppstoreOutlined />}
          style={{ backgroundColor: '#059669', flexShrink: 0 }}
        />
        <div className={styles.graphNodeInfo}>
          <Tooltip title={data.name || data.appId}>
            <span className={styles.graphNodeLabel}>{data.name || data.appId}</span>
          </Tooltip>
          {data.name && (
            <span className={styles.graphNodeId}>{data.appId}</span>
          )}
        </div>
      </div>
    </div>
  )
}
const AppNode = memo(AppNodeComponent)

// ── 节点：服务 ──

interface ServiceNodeData {
  serviceId: string
  name: string
}

function ServiceNodeComponent({ data }: NodeProps<ServiceNodeData>) {
  return (
    <div className={styles.serviceNode}>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <div className={styles.graphNodeHeader}>
        <CloudServerOutlined className={styles.graphNodeIcon} style={{ color: '#0ea5e9' }} />
        <span className={styles.graphNodeType}>service</span>
      </div>
      <div className={styles.graphNodeBody}>
        <Avatar
          size={28}
          icon={<CloudServerOutlined />}
          style={{ backgroundColor: '#0ea5e9', flexShrink: 0 }}
        />
        <div className={styles.graphNodeInfo}>
          <Tooltip title={data.name || data.serviceId}>
            <span className={styles.graphNodeLabel}>{data.name || data.serviceId}</span>
          </Tooltip>
          {data.name && (
            <span className={styles.graphNodeId}>{data.serviceId}</span>
          )}
        </div>
      </div>
    </div>
  )
}
const ServiceNode = memo(ServiceNodeComponent)

// ── 边：权限 ──

interface PermissionEdgeData {
  relations: string[]
  serviceId: string
  appId: string
  isPending?: boolean
  onDeleteRelation?: (serviceId: string, relation: string) => void
}

function PermissionEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<PermissionEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const isPending = data?.isPending

  return (
    <>
      <path
        id={id}
        className={styles.permissionEdgePath}
        d={edgePath}
        stroke={isPending ? '#171717' : '#a3a3a3'}
        strokeWidth={1.5}
        strokeDasharray={isPending ? '5,5' : undefined}
        fill="none"
        markerEnd="url(#perm-arrow)"
      />
      <EdgeLabelRenderer>
        <div
          className={styles.permissionEdgeLabelWrap}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <div className={`${styles.permissionEdgeLabel} ${isPending ? styles.pending : ''}`}>
            {(data?.relations ?? []).map((r) => (
              <Tag
                key={r}
                color={hashColor(r)}
                className={styles.permissionTag}
                closable
                onClose={(e) => {
                  e.preventDefault()
                  data?.onDeleteRelation?.(data.serviceId, r)
                }}
              >
                {r}
              </Tag>
            ))}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
const PermissionEdge = memo(PermissionEdgeComponent)

function ArrowDefs() {
  return (
    <svg style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <marker
          id="perm-arrow"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#a3a3a3" />
        </marker>
      </defs>
    </svg>
  )
}

const nodeTypes: NodeTypes = {
  app: AppNode,
  service: ServiceNode,
}

const edgeTypes: EdgeTypes = {
  permission: PermissionEdge,
}

// ── 关系选项 ──

const RELATION_OPTIONS = [
  { value: '*', label: '* (全部权限)' },
  { value: 'owner', label: 'owner' },
  { value: 'admin', label: 'admin' },
  { value: 'member', label: 'member' },
  { value: 'viewer', label: 'viewer' },
  { value: 'editor', label: 'editor' },
  { value: 'reader', label: 'reader' },
  { value: 'writer', label: 'writer' },
]

// ── 添加权限对话框 ──

interface AddPermissionDialogProps {
  open: boolean
  services: Service[]
  existingServiceIds: string[]
  onConfirm: (serviceId: string, relation: string) => void
  onCancel: () => void
}

function AddPermissionDialog({
  open,
  services,
  existingServiceIds: _existingServiceIds,
  onConfirm,
  onCancel,
}: AddPermissionDialogProps) {
  const [form] = Form.useForm()
  const [customRelation, setCustomRelation] = useState(false)
  const [prevOpen, setPrevOpen] = useState(false)
  if (open && !prevOpen) {
    setCustomRelation(false)
  }
  if (open !== prevOpen) {
    setPrevOpen(open)
  }

  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onConfirm(values.service_id, values.relation)
      form.resetFields()
    } catch {
      // validation failed
    }
  }

  const serviceOptions = services.map((s) => ({
    value: s.service_id,
    label: `${s.name || s.service_id}`,
  }))

  return (
    <Modal
      title="添加权限"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="添加"
      cancelText="取消"
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="service_id"
          label="服务"
          rules={[{ required: true, message: '请选择服务' }]}
        >
          <Select
            showSearch
            placeholder="选择服务"
            options={serviceOptions}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          name="relation"
          label="权限类型"
          rules={[{ required: true, message: '请选择或输入权限类型' }]}
        >
          {customRelation ? (
            <Input
              placeholder="自定义权限类型"
              suffix={
                <a onClick={() => setCustomRelation(false)} style={{ fontSize: 12 }}>
                  选择预设
                </a>
              }
            />
          ) : (
            <Select
              placeholder="选择权限类型"
              options={RELATION_OPTIONS}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{
                      padding: '8px 12px',
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <a onClick={() => setCustomRelation(true)}>自定义权限类型</a>
                  </div>
                </>
              )}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

// ── 主组件 ──

export interface PermissionsGraphProps {
  appId: string
  appName?: string
  appLogoUrl?: string
  data: ApplicationServiceRelation[]
  services?: Service[]
  className?: string
  onRelationsChange?: () => void
}

const NODE_GAP_Y = 110
const APP_X = 50
const SERVICE_X = 500

function PermissionsGraphInner({
  appId,
  appName,
  appLogoUrl,
  data,
  className,
  onRelationsChange,
}: PermissionsGraphProps) {
  const domainId = useDomainId()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // 跟踪待添加 / 待删除的变更
  const [pendingAdds, setPendingAdds] = useState<{ serviceId: string; relation: string }[]>([])
  const [pendingDeletes, setPendingDeletes] = useState<{ serviceId: string; relation: string }[]>([])

  const isDirty = pendingAdds.length > 0 || pendingDeletes.length > 0

  const { data: allServices } = useRequest(
    () => serviceApi.getList(domainId!),
    { ready: !!domainId },
  )

  // 将 services 转成 Map 用于查名称
  const serviceMap = useMemo(() => {
    const m = new Map<string, Service>()
    ;(allServices?.items ?? []).forEach((s) => m.set(s.service_id, s))
    return m
  }, [allServices])

  // 合并原始数据 + 待操作
  const mergedData = useMemo(() => {
    const map = new Map<string, Set<string>>()
    data.forEach((r) => map.set(r.service_id, new Set(r.relations ?? [])))

    pendingAdds.forEach(({ serviceId, relation }) => {
      if (!map.has(serviceId)) map.set(serviceId, new Set())
      map.get(serviceId)!.add(relation)
    })

    pendingDeletes.forEach(({ serviceId, relation }) => {
      map.get(serviceId)?.delete(relation)
    })

    // 删空了的服务移除
    const result: (ApplicationServiceRelation & { pending?: boolean })[] = []
    map.forEach((rels, sid) => {
      if (rels.size === 0) return
      const isOriginal = data.some((d) => d.service_id === sid)
      result.push({
        service_id: sid,
        relations: Array.from(rels),
        pending: !isOriginal || pendingAdds.some((a) => a.serviceId === sid),
      })
    })
    return result
  }, [data, pendingAdds, pendingDeletes])

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const handleDeleteRelation = useCallback(
    (serviceId: string, relation: string) => {
      const isInPending = pendingAdds.some(
        (a) => a.serviceId === serviceId && a.relation === relation
      )
      if (isInPending) {
        setPendingAdds((prev) =>
          prev.filter((a) => !(a.serviceId === serviceId && a.relation === relation))
        )
      } else {
        setPendingDeletes((prev) => [...prev, { serviceId, relation }])
      }
    },
    [pendingAdds]
  )

  // 从合并后数据构建 nodes + edges
  useEffect(() => {
    if (!mergedData.length) {
      setNodes([])
      setEdges([])
      return
    }

    const totalHeight = (mergedData.length - 1) * NODE_GAP_Y
    const appY = totalHeight / 2

    const newNodes: Node[] = [
      {
        id: `app:${appId}`,
        type: 'app',
        position: { x: APP_X, y: appY },
        data: {
          appId,
          name: appName || appId,
          logoUrl: appLogoUrl,
        } as AppNodeData,
        draggable: true,
      },
    ]

    const newEdges: Edge[] = []

    mergedData.forEach((rel, idx) => {
      const svc = serviceMap.get(rel.service_id)
      const serviceNodeId = `service:${rel.service_id}`
      newNodes.push({
        id: serviceNodeId,
        type: 'service',
        position: { x: SERVICE_X, y: idx * NODE_GAP_Y },
        data: {
          serviceId: rel.service_id,
          name: svc?.name || rel.service_id,
        } as ServiceNodeData,
        draggable: true,
      })

      newEdges.push({
        id: `edge:${appId}-${rel.service_id}`,
        source: `app:${appId}`,
        target: serviceNodeId,
        type: 'permission',
        data: {
          relations: rel.relations,
          serviceId: rel.service_id,
          appId,
          isPending: rel.pending,
          onDeleteRelation: handleDeleteRelation,
        } as PermissionEdgeData,
      })
    })

    setNodes(newNodes)
    setEdges(newEdges)
  }, [mergedData, appId, appName, appLogoUrl, serviceMap, setNodes, setEdges, handleDeleteRelation])

  const handleAddPermission = useCallback(
    (serviceId: string, relation: string) => {
      const exists = mergedData.some(
        (d) => d.service_id === serviceId && d.relations.includes(relation)
      )
      if (exists) {
        message.warning('该权限已存在')
        return
      }
      setPendingAdds((prev) => [...prev, { serviceId, relation }])
      setDialogOpen(false)
    },
    [mergedData]
  )

  const handleSave = useCallback(async () => {
    if (!domainId) return
    setSaving(true)
    try {
      // 对每个有变更的服务，拿合并后的 relations 调用 setServiceAppRelations
      const changedServiceIds = new Set([
        ...pendingAdds.map((a) => a.serviceId),
        ...pendingDeletes.map((d) => d.serviceId),
      ])

      for (const sid of changedServiceIds) {
        const merged = mergedData.find((d) => d.service_id === sid)
        const relations = merged?.relations ?? []
        await serviceApi.setServiceAppRelations(domainId, sid, appId, relations)
      }

      message.success('保存成功')
      setPendingAdds([])
      setPendingDeletes([])
      onRelationsChange?.()
    } catch {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }, [domainId, appId, pendingAdds, pendingDeletes, mergedData, onRelationsChange])

  const handleReset = useCallback(() => {
    setPendingAdds([])
    setPendingDeletes([])
  }, [])

  const existingServiceIds = useMemo(
    () => mergedData.map((d) => d.service_id),
    [mergedData]
  )

  const graphHeight = Math.max(320, mergedData.length * NODE_GAP_Y + 80)

  const content = (
    <div className={`${styles.graphWrapper} ${isFullscreen ? styles.fullscreen : ''} ${className ?? ''}`}>
      {/* 顶栏 */}
      <div className={styles.graphToolbar}>
        <div className={styles.toolbarLeft}>
          <span className={styles.toolbarTitle}>权限关系图</span>
          <span className={styles.toolbarCount}>
            {mergedData.length} 个服务
          </span>
        </div>
        <div className={styles.toolbarRight}>
          <Space size="small">
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setDialogOpen(true)}
            >
              添加权限
            </Button>
            {isDirty && (
              <Button size="small" icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            )}
            <Badge dot={isDirty} offset={[-4, 4]}>
              <Button
                size="small"
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
                disabled={!isDirty}
              >
                保存
              </Button>
            </Badge>
            <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
              <Button
                size="small"
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={() => setIsFullscreen((v) => !v)}
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      {/* 画布 */}
      <div className={styles.graphCanvas} style={isFullscreen ? undefined : { height: graphHeight }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          panOnScroll
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          minZoom={0.4}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls showInteractive={false} />
          <ArrowDefs />
        </ReactFlow>
      </div>

      <AddPermissionDialog
        open={dialogOpen}
        services={allServices?.items ?? []}
        existingServiceIds={existingServiceIds}
        onConfirm={handleAddPermission}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  )

  return content
}

export const PermissionsGraph = memo(function PermissionsGraph(props: PermissionsGraphProps) {
  return (
    <ReactFlowProvider>
      <PermissionsGraphInner {...props} />
    </ReactFlowProvider>
  )
})
