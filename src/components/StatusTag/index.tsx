import { Tag } from 'antd'
import { MiniprogramStatus } from '@/types/miniprogram'

const statusConfig: Record<MiniprogramStatus, { color: string; text: string }> = {
  [MiniprogramStatus.DRAFT]: { color: 'default', text: '草稿' },
  [MiniprogramStatus.REVIEWING]: { color: 'processing', text: '审核中' },
  [MiniprogramStatus.PUBLISHED]: { color: 'success', text: '已发布' },
  [MiniprogramStatus.OFFLINE]: { color: 'warning', text: '已下线' },
  [MiniprogramStatus.REJECTED]: { color: 'error', text: '审核拒绝' },
}

interface StatusTagProps {
  status: MiniprogramStatus
}

export function StatusTag({ status }: StatusTagProps) {
  const config = statusConfig[status]
  return <Tag color={config.color}>{config.text}</Tag>
}
