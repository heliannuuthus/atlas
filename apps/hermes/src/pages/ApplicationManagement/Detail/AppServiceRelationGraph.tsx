import { useMemo, useEffect, useState, useCallback } from 'react'
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
} from 'reactflow'
import { Handle, Position, type NodeProps } from 'reactflow'
import { getBezierPath, EdgeLabelRenderer, type EdgeProps } from 'reactflow'
import 'reactflow/dist/style.css'
import { AppstoreOutlined, ApiOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Select, Modal, Form, Input, message } from 'antd'
import type { ApplicationServiceRelation } from '@/types'
import styles from './AppServiceRelationGraph.module.scss'

// ── 节点 ──

interface AppNodeData {
  label: string
}

function AppNode({ data, selected }: NodeProps<AppNodeData>) {
  return (
    <div className={styles.appNode} data-selected={selected}>
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <div className={styles.appNodeInner}>
        <AppstoreOutlined className={styles.appNodeIcon} />
        <span className={styles.appNodeLabel}>{data.label}</span>
      </div>
      <Handle type="source" position={Position.Right} className={styles.handle} />
    </div>
  )
}

interface ServiceNodeData {
  serviceId: string
  onClick?: () => void
  onDelete?: () => void
  editable?: boolean
}

function ServiceNode({ id, data, selected }: NodeProps<ServiceNodeData>) {
  return (
    <div
      className={styles.serviceNode}
      data-selected={selected}
      role="button"
      tabIndex={0}
      onClick={data.onClick}
      onKeyDown={(e) => e.key === 'Enter' && data.onClick?.()}
    >
      <Handle type="source" position={Position.Right} className={styles.handle} />
      <div className={styles.serviceNodeInner}>
        <ApiOutlined className={styles.serviceNodeIcon} />
        <span className={styles.serviceNodeLabel}>{data.serviceId}</span>
        {data.editable && data.onDelete && (
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            className={styles.serviceDeleteBtn}
            onClick={(e) => {
              e.stopPropagation()
              data.onDelete?.()
            }}
          />
        )}
      </div>
      <Handle type="target" position={Position.Left} className={styles.handle} />
    </div>
  )
}

// ── 边 ──

interface PermissionEdgeData {
  relations: string[]
  onEdit?: () => void
  onDelete?: () => void
  editable?: boolean
}

function PermissionEdge({
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

  const label = data?.relations?.includes('*') ? '*' : (data?.relations?.join(', ') ?? '')

  return (
    <>
      <path
        id={id}
        className={styles.edgePath}
        d={edgePath}
        fill="none"
        markerEnd="url(#app-service-arrowhead)"
      />
      <EdgeLabelRenderer>
        <div
          className={styles.edgeLabel}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <span
            role="button"
            tabIndex={0}
            onClick={() => data?.editable && data?.onEdit?.()}
            onKeyDown={(e) => e.key === 'Enter' && data?.editable && data?.onEdit?.()}
          >
            {label || '点击编辑'}
          </span>
          {data?.editable && data?.onDelete && (
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              className={styles.edgeDeleteBtn}
              onClick={(e) => {
                e.stopPropagation()
                data.onDelete?.()
              }}
            />
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

function EdgeArrowDefs() {
  return (
    <svg style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <marker
          id="app-service-arrowhead"
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

// ── 布局 ──

const CENTER_X = 280
const CENTER_Y = 180
const RADIUS = 140

function layoutNodes(
  appName: string,
  relations: ApplicationServiceRelation[] | undefined,
  opts: {
    onServiceClick?: (serviceId: string) => void
    onServiceDelete?: (serviceId: string) => void
    onEdgeEdit?: (serviceId: string) => void
    onEdgeDelete?: (serviceId: string) => void
    editable?: boolean
  }
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const rels = relations ?? []

  nodes.push({
    id: 'app',
    type: 'app',
    position: { x: CENTER_X - 60, y: CENTER_Y - 24 },
    data: { label: appName },
  })

  const count = rels.length
  rels.forEach((rel, i) => {
    const angle = (2 * Math.PI * i) / Math.max(count, 1) - Math.PI / 2
    const x = CENTER_X + RADIUS * Math.cos(angle) - 70
    const y = CENTER_Y + RADIUS * Math.sin(angle) - 24

    const serviceNodeId = `service:${rel.service_id}`
    nodes.push({
      id: serviceNodeId,
      type: 'service',
      position: { x, y },
      data: {
        serviceId: rel.service_id,
        onClick: () => opts.onServiceClick?.(rel.service_id),
        onDelete: opts.onServiceDelete ? () => opts.onServiceDelete(rel.service_id) : undefined,
        editable: opts.editable,
      },
    })

    edges.push({
      id: `edge-${rel.service_id}`,
      source: serviceNodeId,
      target: 'app',
      type: 'permission',
      data: {
        relations: rel.relations ?? [],
        onEdit: opts.onEdgeEdit ? () => opts.onEdgeEdit(rel.service_id) : undefined,
        onDelete: opts.onEdgeDelete ? () => opts.onEdgeDelete(rel.service_id) : undefined,
        editable: opts.editable,
      },
    })
  })

  return { nodes, edges }
}

// ── 主组件 ──

const nodeTypes: NodeTypes = {
  app: AppNode,
  service: ServiceNode,
}

const edgeTypes: EdgeTypes = {
  permission: PermissionEdge,
}

export interface AppServiceRelationGraphProps {
  appName: string
  relations: ApplicationServiceRelation[]
  availableServices: { service_id: string }[]
  editable?: boolean
  onServiceClick?: (serviceId: string) => void
  onChange?: (relations: ApplicationServiceRelation[]) => void
}

export function AppServiceRelationGraph({
  appName,
  relations,
  availableServices,
  editable = false,
  onServiceClick,
  onChange,
}: AppServiceRelationGraphProps) {
  const [localRelations, setLocalRelations] = useState<ApplicationServiceRelation[]>(() => relations ?? [])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [editForm] = Form.useForm()

  useEffect(() => {
    setLocalRelations(relations ?? [])
  }, [relations])

  const connectedServiceIds = useMemo(
    () => new Set(localRelations.map((r) => r.service_id)),
    [localRelations]
  )
  const addableServices = useMemo(
    () => (availableServices ?? []).filter((s) => !connectedServiceIds.has(s.service_id)),
    [availableServices, connectedServiceIds]
  )

  const handleAddService = useCallback(
    (serviceId: string) => {
      if (!serviceId || connectedServiceIds.has(serviceId)) return
      const next = [...localRelations, { service_id: serviceId, relations: ['*'] }]
      setLocalRelations(next)
      onChange?.(next)
    },
    [localRelations, connectedServiceIds, onChange]
  )

  const handleRemoveService = useCallback(
    (serviceId: string) => {
      const next = localRelations.filter((r) => r.service_id !== serviceId)
      setLocalRelations(next)
      onChange?.(next)
    },
    [localRelations, onChange]
  )

  const handleOpenEdit = useCallback((serviceId: string) => {
    const rel = localRelations.find((r) => r.service_id === serviceId)
    if (!rel) return
    setEditingServiceId(serviceId)
    editForm.setFieldsValue({
      relations: rel.relations?.join(', ') ?? '*',
    })
    setEditModalOpen(true)
  }, [localRelations, editForm])

  const handleSaveEdit = useCallback(() => {
    if (!editingServiceId) return
    editForm.validateFields().then((values) => {
      const raw = (values.relations as string)?.trim() || '*'
      const relationsList = raw.split(/[,，\s]+/).map((s) => s.trim()).filter(Boolean)
      if (relationsList.length === 0) {
        message.warning('至少需要一个权限类型，可使用 * 表示全部')
        return
      }
      const next = localRelations.map((r) =>
        r.service_id === editingServiceId ? { ...r, relations: relationsList } : r
      )
      setLocalRelations(next)
      onChange?.(next)
      setEditModalOpen(false)
      setEditingServiceId(null)
    })
  }, [editingServiceId, editForm, localRelations, onChange])

  const layoutOpts = useMemo(
    () => ({
      onServiceClick: editable ? undefined : onServiceClick,
      onServiceDelete: editable ? handleRemoveService : undefined,
      onEdgeEdit: editable ? handleOpenEdit : undefined,
      onEdgeDelete: editable ? handleRemoveService : undefined,
      editable,
    }),
    [editable, onServiceClick, handleRemoveService, handleOpenEdit]
  )

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => layoutNodes(appName, localRelations, layoutOpts),
    [appName, localRelations, layoutOpts]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  return (
    <div className={styles.graphWrap}>
      {editable && (
        <div className={styles.graphToolbar}>
          <Select
            placeholder="添加服务"
            allowClear
            value={null}
            onChange={(v) => v && handleAddService(v)}
            options={addableServices.map((s) => ({ label: s.service_id, value: s.service_id }))}
            className={styles.addServiceSelect}
            dropdownMatchSelectWidth={200}
            notFoundContent={addableServices.length === 0 ? '所有服务已添加' : undefined}
          />
        </div>
      )}
      <div className={styles.graphInner}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={true}
            panOnDrag
            zoomOnScroll
            minZoom={0.3}
            maxZoom={1.5}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <Controls />
            <EdgeArrowDefs />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      <Modal
        title={`编辑权限 - ${editingServiceId}`}
        open={editModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => {
          setEditModalOpen(false)
          setEditingServiceId(null)
        }}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="relations"
            label="权限类型"
            rules={[{ required: true, message: '请输入权限类型' }]}
            extra="多个权限用逗号分隔，* 表示全部"
          >
            <Input placeholder="* 或 read, write, admin" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
