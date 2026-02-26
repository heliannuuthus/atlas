import { memo } from 'react'
import {
  getBezierPath,
  EdgeLabelRenderer,
  type EdgeProps,
} from 'reactflow'
import { Button, Tooltip } from 'antd'
import { CloseOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useGraphContext } from '../context/GraphContext'
import { isExpiringSoon } from '@/utils/format'
import styles from '../index.module.scss'

export interface RelationEdgeData {
  relation: string
  expiresAt?: string
  isPending?: boolean // 是否为待保存的新关系
}

function RelationEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<RelationEdgeData>) {
  const { deleteEdge } = useGraphContext()

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const isExpiring = data?.expiresAt && isExpiringSoon(data.expiresAt)
  const isPending = data?.isPending

  // 边的颜色
  let strokeColor = '#8c8c8c'
  if (isExpiring) {
    strokeColor = '#faad14' // 即将过期：橙色
  } else if (isPending) {
    strokeColor = '#1677ff' // 待保存：蓝色虚线
  }

  return (
    <>
      {/* 边路径 */}
      <path
        id={id}
        className={styles.relationEdgePath}
        d={edgePath}
        stroke={strokeColor}
        strokeWidth={selected ? 2 : 1.5}
        strokeDasharray={isPending ? '5,5' : undefined}
        fill="none"
        markerEnd="url(#arrowhead)"
      />

      {/* 边标签 */}
      <EdgeLabelRenderer>
        <div
          className={styles.edgeLabelContainer}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <div
            className={styles.edgeLabel}
            style={{
              borderColor: strokeColor,
              backgroundColor: isPending ? '#e6f4ff' : '#fff',
            }}
          >
            {isExpiring && (
              <Tooltip title="即将过期">
                <ClockCircleOutlined style={{ color: '#faad14', marginRight: 4 }} />
              </Tooltip>
            )}
            <span>{data?.relation || 'relation'}</span>
            <Tooltip title="删除关系">
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                className={styles.edgeDeleteBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  deleteEdge(id)
                }}
              />
            </Tooltip>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export const RelationEdge = memo(RelationEdgeComponent)

// 箭头定义（在 SVG defs 中使用）
export function EdgeArrowDefs() {
  return (
    <svg style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#8c8c8c" />
        </marker>
      </defs>
    </svg>
  )
}
