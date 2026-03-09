import { useRequest } from 'ahooks'
import {
  Card,
  Descriptions,
  Spin,
  message,
  Tag,
  Tabs,
  Table,
  Empty,
  Typography,
  Tooltip,
  Button,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useParams, useNavigate } from 'react-router-dom'
import { InfoCircleOutlined, ShareAltOutlined, NodeIndexOutlined } from '@ant-design/icons'
import { serviceApi, relationshipApi } from '@/services'
import type { Relationship } from '@/types'
import { PageHeader, formatDuration, formatDateTime, formatRelativeTime, isExpiringSoon } from '@atlas/shared'
import styles from './index.module.scss'

const { Text } = Typography

// 主体类型标签颜色映射
const subjectTypeColors: Record<string, string> = {
  user: 'blue',
  group: 'green',
  application: 'orange',
}

// 主体类型显示名称
const subjectTypeLabels: Record<string, string> = {
  user: '用户',
  group: '组',
  application: '应用',
}

export function Detail() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()

  const { data, loading } = useRequest(() => serviceApi.getDetail(serviceId!), {
    ready: !!serviceId,
    onError: () => {
      message.error('获取服务信息失败')
    },
  })

  // 获取该服务相关的关系列表
  const { data: relationships, loading: relLoading } = useRequest(
    () => relationshipApi.getList({ service_id: serviceId }),
    {
      ready: !!serviceId,
    }
  )

  const relationColumns: ColumnsType<Relationship> = [
    {
      title: '主体',
      key: 'subject',
      width: 200,
      render: (_, record) => (
        <div className={styles.entityCell}>
          <Tag color={subjectTypeColors[record.subject_type]} bordered={false}>
            {subjectTypeLabels[record.subject_type] || record.subject_type}
          </Tag>
          <Tooltip title={record.subject_id}>
            <Text ellipsis style={{ maxWidth: 120 }}>
              {record.subject_id}
            </Text>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '关系',
      dataIndex: 'relation',
      key: 'relation',
      width: 100,
      render: value => (
        <Tag color="processing" bordered={false}>
          {value}
        </Tag>
      ),
    },
    {
      title: '对象',
      key: 'object',
      width: 200,
      render: (_, record) => (
        <div className={styles.entityCell}>
          <Tag bordered={false}>{record.object_type}</Tag>
          <Tooltip title={record.object_id}>
            <Text ellipsis style={{ maxWidth: 120 }}>
              {record.object_id}
            </Text>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '过期时间',
      dataIndex: 'expires_at',
      key: 'expires_at',
      width: 140,
      render: text => {
        if (!text) return <Text type="secondary">永久</Text>
        const expiring = isExpiringSoon(text)
        return <Text type={expiring ? 'warning' : undefined}>{formatRelativeTime(text)}</Text>
      },
    },
  ]

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  if (!data) {
    return null
  }

  const tabItems = [
    {
      key: 'info',
      label: (
        <span>
          <InfoCircleOutlined />
          基本信息
        </span>
      ),
      children: (
        <Descriptions column={2} bordered className={styles.descriptions}>
          <Descriptions.Item label="服务ID">{data.service_id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="域ID">{data.domain_id}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={data.status === 0 ? 'green' : 'red'} bordered={false}>
              {data.status === 0 ? '启用' : '禁用'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {data.description || <Text type="secondary">-</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Access Token 有效期">
            {formatDuration(data.access_token_expires_in)}
          </Descriptions.Item>
          <Descriptions.Item label="Refresh Token 有效期">
            {formatDuration(data.refresh_token_expires_in)}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatDateTime(data.created_at)}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{formatDateTime(data.updated_at)}</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'relationships',
      label: (
        <span>
          <ShareAltOutlined />
          关联关系
          {relationships && relationships.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>
              {relationships.length}
            </Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.relationshipsTab}>
          <div className={styles.tabHeader}>
            <Text type="secondary">展示该服务下的所有授权关系</Text>
            <Button
              icon={<NodeIndexOutlined />}
              onClick={() => navigate('/relationships/graph')}
            >
              在图谱中查看
            </Button>
          </div>
          <Table
            columns={relationColumns}
            dataSource={relationships || []}
            loading={relLoading}
            rowKey="_id"
            size="small"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无关联关系" />,
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="服务详情" backPath="/services" />
        <Tabs items={tabItems} className={styles.tabs} />
      </Card>
    </div>
  )
}
