import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Tooltip, Button } from 'antd'
import { DatabaseOutlined, DeleteOutlined } from '@ant-design/icons'
import { useGraphContext } from '../context/GraphContext'
import styles from '../index.module.scss'

export interface ObjectNodeData {
  type: string // 自定义对象类型
  id: string
  label?: string
}

function ObjectNodeComponent({ id, data, selected }: NodeProps<ObjectNodeData>) {
  const { deleteNode } = useGraphContext()

  return (
    <div
      className={styles.objectNode}
      style={{
        borderColor: selected ? '#8c8c8c' : '#e0e0e0',
        boxShadow: selected ? '0 0 0 2px rgba(140, 140, 140, 0.2)' : undefined,
      }}
    >
      {/* 输入 Handle（左侧） */}
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        style={{ backgroundColor: '#8c8c8c' }}
      />

      {/* 节点头部 */}
      <div className={styles.nodeHeader} style={{ borderBottomColor: '#f0f0f0' }}>
        <span className={styles.nodeIcon} style={{ color: '#8c8c8c' }}>
          <DatabaseOutlined />
        </span>
        <span className={styles.nodeType}>{data.type}</span>
        <Tooltip title="删除节点">
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation()
              deleteNode(id)
            }}
          />
        </Tooltip>
      </div>

      {/* 节点内容 */}
      <div className={styles.nodeContent}>
        <Tooltip title={data.id}>
          <span className={styles.nodeId}>{data.label || data.id}</span>
        </Tooltip>
      </div>

      {/* 输出 Handle（右侧）- 对象也可以作为源 */}
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        style={{ backgroundColor: '#8c8c8c' }}
      />
    </div>
  )
}

export const ObjectNode = memo(ObjectNodeComponent)
