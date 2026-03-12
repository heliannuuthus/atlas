import { Result, Button } from 'antd'
import { useAppNavigate } from '@/contexts/DomainContext'

export function CredentialManagement() {
  const navigate = useAppNavigate()

  return (
    <Result
      status="info"
      title="凭证管理"
      subTitle="功能开发中，敬请期待"
      extra={
        <Button type="primary" onClick={() => navigate('')}>
          返回概览
        </Button>
      }
    />
  )
}
