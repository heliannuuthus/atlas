import { useRequest } from 'ahooks'
import { Card, Descriptions, Spin, message, Tag } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { serviceApi } from '@/services'
import { PageHeader } from '@/components'
import styles from './index.module.scss'

export function Detail() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()

  const { data, loading } = useRequest(
    () => serviceApi.getDetail(serviceId!),
    {
      ready: !!serviceId,
      onError: () => {
        message.error('获取服务信息失败')
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
        <PageHeader title="服务详情" backPath="/hermes/services" />
        <Descriptions column={2} bordered>
          <Descriptions.Item label="服务ID">{data.service_id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="域ID">{data.domain_id}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={data.status === 0 ? 'green' : 'red'}>
              {data.status === 0 ? '启用' : '禁用'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {data.description || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Access Token 过期时间">
            {data.access_token_expires_in}秒
          </Descriptions.Item>
          <Descriptions.Item label="Refresh Token 过期时间">
            {data.refresh_token_expires_in}秒
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
