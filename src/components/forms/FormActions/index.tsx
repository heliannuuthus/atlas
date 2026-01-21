import { Button, Space } from 'antd'
import { useNavigate } from 'react-router-dom'

interface FormActionsProps {
  loading?: boolean
  submitText?: string
  cancelText?: string
  cancelPath?: string
  onCancel?: () => void | Promise<void>
}

export function FormActions({
  loading = false,
  submitText = '提交',
  cancelText = '取消',
  cancelPath,
  onCancel,
}: FormActionsProps) {
  const navigate = useNavigate()

  const handleCancel = () => {
    if (onCancel) {
      void onCancel()
    } else if (cancelPath) {
      navigate(cancelPath)
    }
  }

  return (
    <Space>
      <Button type="primary" htmlType="submit" loading={loading}>
        {submitText}
      </Button>
      <Button onClick={handleCancel}>{cancelText}</Button>
    </Space>
  )
}
