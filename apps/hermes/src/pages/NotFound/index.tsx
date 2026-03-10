import { useNavigate } from 'react-router-dom'
import { Result, Button } from 'antd'
import { useDomainId } from '@/contexts/DomainContext'

export function NotFound() {
  const navigate = useNavigate()
  const domainId = useDomainId()
  const basePath = domainId ? `/d/${encodeURIComponent(domainId)}` : '/'

  return (
    <Result
      status={404}
      title="404"
      subTitle="页面不存在"
      extra={
        <Button type="primary" onClick={() => navigate(basePath)}>
          返回{domainId ? '概览' : '首页'}
        </Button>
      }
    />
  )
}
