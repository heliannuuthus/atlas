import { Tag } from 'antd'
import { MiniprogramPlatform } from '@/types/miniprogram'

const platformConfig: Record<MiniprogramPlatform, { color: string; text: string }> = {
  [MiniprogramPlatform.WECHAT]: { color: 'green', text: '微信' },
  [MiniprogramPlatform.ALIPAY]: { color: 'blue', text: '支付宝' },
  [MiniprogramPlatform.BYTEDANCE]: { color: 'purple', text: '字节跳动' },
}

interface PlatformTagProps {
  platform: MiniprogramPlatform
}

export function PlatformTag({ platform }: PlatformTagProps) {
  const config = platformConfig[platform]
  return <Tag color={config.color}>{config.text}</Tag>
}
