import { useRequest } from 'ahooks'
import { Card, Descriptions, Spin, message, Button, Space } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { groupApi } from '@/services'
import { PageHeader } from '@/components'
import styles from './index.module.scss'

export function Detail() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()

  const { data, loading } = useRequest(() => groupApi.getDetail(groupId!), {
    ready: !!groupId,
    onError: () => message.error('获取组信息失败'),
  })

  const { data: members } = useRequest(() => groupApi.getMembers(groupId!), {
    ready: !!groupId,
  })

  if (loading) return <div className={styles.container}><Spin size="large" /></div>
  if (!data) return null

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="组详情" backPath="/hermes/groups" />
        <Descriptions column={2} bordered>
          <Descriptions.Item label="组ID">{data.group_id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>{data.description || '-'}</Descriptions.Item>
          <Descriptions.Item label="成员" span={2}>
            {members?.members && members.members.length > 0 ? (
              <Space wrap>
                {members.members.map((userId) => (
                  <span key={userId}>{userId}</span>
                ))}
              </Space>
            ) : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{new Date(data.created_at).toLocaleString('zh-CN')}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{new Date(data.updated_at).toLocaleString('zh-CN')}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}
