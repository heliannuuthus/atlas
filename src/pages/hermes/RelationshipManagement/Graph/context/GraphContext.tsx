import { createContext, useContext, useCallback, useState, type ReactNode } from 'react'
import { useReactFlow, type Node, type Edge } from 'reactflow'
import type { Relationship } from '@/types/hermes'

interface GraphContextType {
  // 状态
  isDirty: boolean
  selectedServiceId: string | undefined
  pendingRelations: Relationship[] // 待保存的新关系
  deletedRelations: Relationship[] // 待删除的关系

  // 操作
  setSelectedServiceId: (id: string | undefined) => void
  addPendingRelation: (relation: Relationship) => void
  removePendingRelation: (relation: Relationship) => void
  markRelationDeleted: (relation: Relationship) => void
  deleteNode: (nodeId: string) => void
  deleteEdge: (edgeId: string) => void
  resetChanges: () => void
  setDirty: () => void
  clearDirty: () => void
}

const GraphContext = createContext<GraphContextType | null>(null)

export function useGraphContext() {
  const context = useContext(GraphContext)
  if (!context) {
    throw new Error('useGraphContext must be used within a GraphContextProvider')
  }
  return context
}

interface GraphContextProviderProps {
  children: ReactNode
}

export function GraphContextProvider({ children }: GraphContextProviderProps) {
  const [isDirty, setIsDirty] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>()
  const [pendingRelations, setPendingRelations] = useState<Relationship[]>([])
  const [deletedRelations, setDeletedRelations] = useState<Relationship[]>([])

  const reactFlowInstance = useReactFlow()

  const setDirty = useCallback(() => {
    setIsDirty(true)
  }, [])

  const clearDirty = useCallback(() => {
    setIsDirty(false)
  }, [])

  const addPendingRelation = useCallback((relation: Relationship) => {
    setPendingRelations((prev) => [...prev, relation])
    setIsDirty(true)
  }, [])

  const removePendingRelation = useCallback((relation: Relationship) => {
    setPendingRelations((prev) =>
      prev.filter(
        (r) =>
          !(
            r.subject_type === relation.subject_type &&
            r.subject_id === relation.subject_id &&
            r.relation === relation.relation &&
            r.object_type === relation.object_type &&
            r.object_id === relation.object_id
          )
      )
    )
  }, [])

  const markRelationDeleted = useCallback((relation: Relationship) => {
    setDeletedRelations((prev) => [...prev, relation])
    setIsDirty(true)
  }, [])

  const deleteNode = useCallback(
    (nodeId: string) => {
      reactFlowInstance.setNodes((nodes) => nodes.filter((n) => n.id !== nodeId))
      // 同时删除连接到该节点的边
      reactFlowInstance.setEdges((edges) =>
        edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
      )
      setIsDirty(true)
    },
    [reactFlowInstance]
  )

  const deleteEdge = useCallback(
    (edgeId: string) => {
      const edge = reactFlowInstance.getEdges().find((e) => e.id === edgeId)
      if (edge?.data?.relation) {
        // 如果是已存在的关系，标记为待删除
        markRelationDeleted(edge.data.relation as Relationship)
      } else {
        // 如果是待保存的关系，从 pending 中移除
        const pendingRelation = pendingRelations.find((r) => {
          const expectedEdgeId = `${r.subject_type}:${r.subject_id}-${r.object_type}:${r.object_id}`
          return edgeId === expectedEdgeId
        })
        if (pendingRelation) {
          removePendingRelation(pendingRelation)
        }
      }
      reactFlowInstance.setEdges((edges) => edges.filter((e) => e.id !== edgeId))
      setIsDirty(true)
    },
    [reactFlowInstance, pendingRelations, markRelationDeleted, removePendingRelation]
  )

  const resetChanges = useCallback(() => {
    setPendingRelations([])
    setDeletedRelations([])
    setIsDirty(false)
  }, [])

  const value: GraphContextType = {
    isDirty,
    selectedServiceId,
    pendingRelations,
    deletedRelations,
    setSelectedServiceId,
    addPendingRelation,
    removePendingRelation,
    markRelationDeleted,
    deleteNode,
    deleteEdge,
    resetChanges,
    setDirty,
    clearDirty,
  }

  return <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
}
