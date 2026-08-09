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
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        type="submit"
        disabled={loading}
        style={{
          minHeight: 36,
          padding: '0 16px',
          border: 0,
          borderRadius: 6,
          background: '#b94e20',
          color: '#fff',
          fontWeight: 600,
        }}
      >
        {submitText}
      </button>
      <button
        type="button"
        onClick={handleCancel}
        style={{
          minHeight: 36,
          padding: '0 16px',
          border: '1px solid #e4e4e7',
          borderRadius: 6,
          background: '#fff',
          color: '#3f3f46',
          fontWeight: 600,
        }}
      >
        {cancelText}
      </button>
    </div>
  )
}
