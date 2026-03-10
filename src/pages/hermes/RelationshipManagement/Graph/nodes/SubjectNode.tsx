import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import { Tooltip, Button } from 'antd'
import { UserOutlined, TeamOutlined, AppstoreOutlined, DeleteOutlined } from '@ant-design/icons'
import { useGraphContext } from '../context/GraphContext'
import styles from '../index.module.scss'

export interface SubjectNodeData {
  type: 'user' | 'group' | 'application'
  id: string
  label?: string
}

const typeConfig = {
  user: {
    icon: <UserOutlined />,
    label: 'user',
    color: '#1677ff',
  },
  group: {
    icon: <TeamOutlined />,
    label: 'group',
    color: '#52c41a',
  },
  application: {
    icon: <AppstoreOutlined />,
    label: 'application',
    color: '#722ed1',
  },
}

function SubjectNodeComponent({ id, data, selected }: NodeProps<SubjectNodeData>) {
  const { deleteNode } = useGraphContext()
  const config = typeConfig[data.type]

  return (
    <div
      className={styles.subjectNode}
      style={{
        borderColor: selected ? config.color : '#e0e0e0',
        boxShadow: selected ? `0 0 0 2px ${config.color}20` : undefined,
      }}
    >
      {/* 输入 Handle（左侧） */}
      <Handle
        type="target"
        position={Position.Left}
        className={styles.handle}
        style={{ backgroundColor: config.color }}
      />

      {/* 节点头部 */}
      <div className={styles.nodeHeader} style={{ borderBottomColor: `${config.color}20` }}>
        <span className={styles.nodeIcon} style={{ color: config.color }}>
          {config.icon}
        </span>
        <span className={styles.nodeType}>{config.label}</span>
        <Tooltip title="删除节点">
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            className={styles.deleteBtn}
            onClick={e => {
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

      {/* 输出 Handle（右侧） */}
      <Handle
        type="source"
        position={Position.Right}
        className={styles.handle}
        style={{ backgroundColor: config.color }}
      />
    </div>
  )
}

export const SubjectNode = memo(SubjectNodeComponent)
