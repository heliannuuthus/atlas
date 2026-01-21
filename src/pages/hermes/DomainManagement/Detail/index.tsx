import { useRequest } from 'ahooks'
import { Card, Descriptions, Spin, message } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { domainApi } from '@/services'
import { PageHeader } from '@/components'
import styles from './index.module.scss'

export function Detail() {
  const { domainId } = useParams<{ domainId: string }>()
  const navigate = useNavigate()

  const { data, loading } = useRequest(
    () => domainApi.getDetail(domainId!),
    {
      ready: !!domainId,
      onError: () => {
        message.error('获取域信息失败')
      },
    }
  )

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin size="large" />
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="域详情" backPath="/hermes/domains" />
        <Descriptions column={2} bordered>
          <Descriptions.Item label="域ID">{data.domain_id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {data.description || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(data.created_at).toLocaleString('zh-CN')}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(data.updated_at).toLocaleString('zh-CN')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
