import { useRequest } from 'ahooks'
import { Card, Descriptions, Spin, message } from 'antd'
import { useParams } from 'react-router-dom'
import { applicationApi } from '@/services'
import { PageHeader } from '@/components'
import styles from './index.module.scss'

export function Detail() {
  const { appId } = useParams<{ appId: string }>()

  const { data, loading } = useRequest(() => applicationApi.getDetail(appId!), {
    ready: !!appId,
    onError: () => message.error('获取应用信息失败'),
  })

  if (loading) return <div className={styles.container}><Spin size="large" /></div>
  if (!data) return null

  let redirectUris: string[] = []
  try {
    redirectUris = data.redirect_uris ? JSON.parse(data.redirect_uris) : []
  } catch {}

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="应用详情" backPath="/hermes/applications" />
        <Descriptions column={2} bordered>
          <Descriptions.Item label="应用ID">{data.app_id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="域ID">{data.domain_id}</Descriptions.Item>
          <Descriptions.Item label="重定向URI" span={2}>
            {redirectUris.length > 0 ? redirectUris.map((uri, i) => <div key={i}>{uri}</div>) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{new Date(data.created_at).toLocaleString('zh-CN')}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{new Date(data.updated_at).toLocaleString('zh-CN')}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
