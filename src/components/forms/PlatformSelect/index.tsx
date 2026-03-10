import { Select } from 'antd'
import { MiniprogramPlatform } from '@/types/miniprogram'

interface PlatformSelectProps {
  value?: MiniprogramPlatform
  onChange?: (value: MiniprogramPlatform) => void
  placeholder?: string
}

const platformOptions = [
  { label: '微信小程序', value: MiniprogramPlatform.WECHAT },
  { label: '支付宝小程序', value: MiniprogramPlatform.ALIPAY },
  { label: '字节跳动小程序', value: MiniprogramPlatform.BYTEDANCE },
]

export function PlatformSelect({
  value,
  onChange,
  placeholder = '请选择平台',
}: PlatformSelectProps) {
  return (
    <Select value={value} onChange={onChange} placeholder={placeholder}>
      {platformOptions.map(option => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  )
}
