import { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { useRequest } from 'ahooks'
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  type EdgeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { message, Table, Card, Popconfirm, Button, Spin, ConfigProvider } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ThemeConfig } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import * as hermesApi from '@/services/hermes'
import type { Relationship } from '@/types/hermes'
import { formatDateTime, isExpiringSoon } from '@/utils/format'
import { GraphContextProvider, useGraphContext } from './context/GraphContext'
import { SubjectNode, type SubjectNodeData } from './nodes/SubjectNode'
import { ObjectNode, type ObjectNodeData } from './nodes/ObjectNode'
import { RelationEdge, EdgeArrowDefs, type RelationEdgeData } from './edges/RelationEdge'
import { AddNodes } from './AddNodes'
import { CanvasHeader } from './CanvasHeader'
import { CreateRelationDialog } from './dialogs/CreateRelationDialog'
import styles from './index.module.scss'

// 节点类型注册
const nodeTypes: NodeTypes = {
  subject: SubjectNode,
  object: ObjectNode,
}

// 边类型注册
const edgeTypes: EdgeTypes = {
  relation: RelationEdge,
}

function GraphCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  const {
    isDirty,
    selectedServiceId,
    pendingRelations,
    setSelectedServiceId,
    addPendingRelation,
    resetChanges,
    setDirty,
    clearDirty: _clearDirty,
    deleteEdge: _contextDeleteEdge,
  } = useGraphContext()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [saving, setSaving] = useState(false)

  // 创建关系对话框
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingConnection, setPendingConnection] = useState<{
    source: { type: string; id: string }
    target: { type: string; id: string }
  } | null>(null)

  // 获取数据
  const { data: services, loading: servicesLoading } = useRequest(() =>
    hermesApi.listServices()
  )

  const { data: applications, loading: applicationsLoading } = useRequest(() =>
    hermesApi.listApplications()
  )

  const { data: groups, loading: groupsLoading } = useRequest(() =>
    hermesApi.listGroups()
  )

  const {
    data: relationships,
    loading: relationshipsLoading,
    refresh: refreshRelationships,
  } = useRequest(
    () => hermesApi.listRelationships({ service_id: selectedServiceId }),
    {
      refreshDeps: [selectedServiceId],
    }
  )

  // 模拟用户列表（实际应该从 API 获取）
  const users = useMemo(() => {
    if (!relationships) return []
    const userIds = new Set<string>()
    relationships.forEach((r) => {
      if (r.subject_type === 'user') userIds.add(r.subject_id)
    })
    return Array.from(userIds)
  }, [relationships])

  // 从关系数据构建节点和边
  useEffect(() => {
    if (!relationships) return

    const nodeMap = new Map<string, Node>()
    const newEdges: Edge[] = []

    relationships.forEach((rel, index) => {
      // 创建主体节点
      const subjectNodeId = `${rel.subject_type}:${rel.subject_id}`
      if (!nodeMap.has(subjectNodeId)) {
        nodeMap.set(subjectNodeId, {
          id: subjectNodeId,
          type: 'subject',
          position: { x: 100, y: 100 + index * 120 },
          data: {
            type: rel.subject_type,
            id: rel.subject_id,
          } as SubjectNodeData,
        })
      }

      // 创建对象节点
      const objectNodeId = `${rel.object_type}:${rel.object_id}`
      if (!nodeMap.has(objectNodeId)) {
        const isSubjectType = ['user', 'group', 'application'].includes(rel.object_type)
        nodeMap.set(objectNodeId, {
          id: objectNodeId,
          type: isSubjectType ? 'subject' : 'object',
          position: { x: 450, y: 100 + index * 120 },
          data: isSubjectType
            ? ({ type: rel.object_type, id: rel.object_id } as SubjectNodeData)
            : ({ type: rel.object_type, id: rel.object_id } as ObjectNodeData),
        })
      }

      // 创建边
      const edgeId = `${subjectNodeId}-${objectNodeId}-${rel.relation}`
      newEdges.push({
        id: edgeId,
        source: subjectNodeId,
        target: objectNodeId,
        type: 'relation',
        data: {
          relation: rel.relation,
          expiresAt: rel.expires_at,
          isPending: false,
        } as RelationEdgeData,
      })
    })

    setNodes(Array.from(nodeMap.values()))
    setEdges(newEdges)
  }, [relationships, setNodes, setEdges])

  // 拖放处理
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowInstance || !reactFlowWrapper.current) return

      const data = event.dataTransfer.getData('application/reactflow')
      if (!data) return

      const { nodeType, nodeData } = JSON.parse(data)
      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })

      const nodeId = `${nodeData.type}:${nodeData.id}`

      // 检查节点是否已存在
      const existingNode = nodes.find((n) => n.id === nodeId)
      if (existingNode) {
        message.warning('该节点已存在于画布中')
        return
      }

      const newNode: Node = {
        id: nodeId,
        type: nodeType === 'subject' ? 'subject' : 'object',
        position,
        data: nodeData,
      }

      setNodes((nds) => [...nds, newNode])
      setDirty()
    },
    [reactFlowInstance, nodes, setNodes, setDirty]
  )

  const handleDragStart = useCallback(
    (
      event: React.DragEvent,
      nodeType: 'subject' | 'object',
      data: { type: string; id: string; label?: string }
    ) => {
      event.dataTransfer.setData(
        'application/reactflow',
        JSON.stringify({ nodeType, nodeData: data })
      )
      event.dataTransfer.effectAllowed = 'move'
    },
    []
  )

  // 连线处理
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return
      if (!selectedServiceId) {
        message.warning('请先选择服务')
        return
      }

      // 解析节点信息
      const [sourceType, sourceId] = connection.source.split(':')
      const [targetType, targetId] = connection.target.split(':')

      // 设置待创建的连接
      setPendingConnection({
        source: { type: sourceType, id: sourceId },
        target: { type: targetType, id: targetId },
      })
      setDialogOpen(true)
    },
    [selectedServiceId]
  )

  // 确认创建关系
  const handleCreateRelation = useCallback(
    (data: { relation: string; expiresAt?: string }) => {
      if (!pendingConnection || !selectedServiceId) return

      const newRelation: Relationship = {
        _id: 0,
        service_id: selectedServiceId,
        subject_type: pendingConnection.source.type as 'user' | 'group' | 'application',
        subject_id: pendingConnection.source.id,
        relation: data.relation,
        object_type: pendingConnection.target.type,
        object_id: pendingConnection.target.id,
        created_at: new Date().toISOString(),
        expires_at: data.expiresAt,
      }

      // 添加边到画布
      const edgeId = `${pendingConnection.source.type}:${pendingConnection.source.id}-${pendingConnection.target.type}:${pendingConnection.target.id}-${data.relation}`
      const newEdge: Edge = {
        id: edgeId,
        source: `${pendingConnection.source.type}:${pendingConnection.source.id}`,
        target: `${pendingConnection.target.type}:${pendingConnection.target.id}`,
        type: 'relation',
        data: {
          relation: data.relation,
          expiresAt: data.expiresAt,
          isPending: true,
        } as RelationEdgeData,
      }

      setEdges((eds) => addEdge(newEdge, eds))
      addPendingRelation(newRelation)

      setDialogOpen(false)
      setPendingConnection(null)
    },
    [pendingConnection, selectedServiceId, setEdges, addPendingRelation]
  )

  // 保存更改
  const handleSave = useCallback(async () => {
    if (!selectedServiceId) {
      message.warning('请先选择服务')
      return
    }

    setSaving(true)
    try {
      // 创建新关系
      for (const rel of pendingRelations) {
        await hermesApi.createRelationship({
          service_id: rel.service_id,
          subject_type: rel.subject_type,
          subject_id: rel.subject_id,
          relation: rel.relation,
          object_type: rel.object_type,
          object_id: rel.object_id,
          expires_at: rel.expires_at,
        })
      }

      message.success('保存成功')
      resetChanges()
      refreshRelationships()
    } catch {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }, [selectedServiceId, pendingRelations, resetChanges, refreshRelationships])

  // 重置画布
  const handleReset = useCallback(() => {
    resetChanges()
    refreshRelationships()
  }, [resetChanges, refreshRelationships])

  // 全屏切换
  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  // 删除关系
  const handleDeleteRelation = useCallback(
    async (rel: Relationship) => {
      try {
        await hermesApi.deleteRelationship({
          service_id: rel.service_id,
          subject_type: rel.subject_type,
          subject_id: rel.subject_id,
          relation: rel.relation,
          object_type: rel.object_type,
          object_id: rel.object_id,
        })
        message.success('删除成功')
        refreshRelationships()
      } catch {
        message.error('删除失败')
      }
    },
    [refreshRelationships]
  )

  // 表格列定义
  const columns: ColumnsType<Relationship> = [
    { title: '主体类型', dataIndex: 'subject_type', width: 100 },
    { title: '主体ID', dataIndex: 'subject_id', width: 150, ellipsis: true },
    { title: '关系', dataIndex: 'relation', width: 100 },
    { title: '对象类型', dataIndex: 'object_type', width: 100 },
    { title: '对象ID', dataIndex: 'object_id', width: 150, ellipsis: true },
    {
      title: '过期时间',
      dataIndex: 'expires_at',
      width: 160,
      render: (text) => {
        if (!text) return '-'
        const expiring = isExpiringSoon(text)
        return (
          <span style={{ color: expiring ? '#faad14' : undefined }}>
            {formatDateTime(text)}
          </span>
        )
      },
    },
    {
      title: '操作',
      width: 80,
      render: (_, record) => (
        <Popconfirm title="确定要删除吗？" onConfirm={() => handleDeleteRelation(record)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ]

  const loading = servicesLoading || applicationsLoading || groupsLoading

  const tableCardTheme: ThemeConfig = useMemo(() => ({
    components: {
      Card: {
        paddingLG: 0,
      },
      Table: {
        headerBg: '#fafafa',
        fontSize: 13,
      },
    },
  }), [])

  return (
    <div className={`${styles.graphPage} ${isFullscreen ? styles.fullscreen : ''}`}>
      <CanvasHeader
        services={services || []}
        selectedServiceId={selectedServiceId}
        onServiceChange={setSelectedServiceId}
        onSave={handleSave}
        onReset={handleReset}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        isDirty={isDirty}
        saving={saving}
        relationCount={relationships?.length || 0}
      />

      <div className={styles.graphContainer}>
        {/* 左侧节点面板 */}
        <div className={styles.sidePanel}>
          {loading ? (
            <div className={styles.loading}>
              <Spin />
            </div>
          ) : (
            <AddNodes
              users={users}
              groups={groups || []}
              applications={applications || []}
              onDragStart={handleDragStart}
            />
          )}
        </div>

        {/* 画布区域 */}
        <div className={styles.canvasWrapper} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls />
            <EdgeArrowDefs />
          </ReactFlow>
        </div>
      </div>

      {/* 下方数据表格 */}
      <ConfigProvider theme={tableCardTheme}>
        <Card className={styles.tableCard} title={null} size="small">
          <Table
            columns={columns}
            dataSource={relationships || []}
            loading={relationshipsLoading}
            rowKey="_id"
            size="small"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 900 }}
          />
        </Card>
      </ConfigProvider>

      {/* 创建关系对话框 */}
      <CreateRelationDialog
        open={dialogOpen}
        sourceNode={pendingConnection?.source || null}
        targetNode={pendingConnection?.target || null}
        serviceId={selectedServiceId || ''}
        onConfirm={handleCreateRelation}
        onCancel={() => {
          setDialogOpen(false)
          setPendingConnection(null)
        }}
      />
    </div>
  )
}

// 包装组件，提供 ReactFlow 和 Context
export function Graph() {
  return (
    <ReactFlowProvider>
      <GraphContextProvider>
        <GraphCanvas />
      </GraphContextProvider>
    </ReactFlowProvider>
  )
}
