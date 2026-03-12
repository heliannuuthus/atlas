import { Result, Button } from 'antd'
import { useAppNavigate } from '@/contexts/DomainContext'

export function UserManagement() {
  const navigate = useAppNavigate()

  return (
    <Result
      status="info"
      title="用户管理"
      subTitle="功能开发中，敬请期待"
      extra={
        <Button type="primary" onClick={() => navigate('')}>
          返回概览
        </Button>
      }
    />
  )
}
