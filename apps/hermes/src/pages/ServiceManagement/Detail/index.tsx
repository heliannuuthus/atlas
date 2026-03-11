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
import { useParams } from 'react-router-dom'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { InfoCircleOutlined, ShareAltOutlined, NodeIndexOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons'
import { serviceApi, relationshipApi } from '@/services'
import type { Relationship, ServiceApplicationRelation } from '@/types'
import { PageHeader, formatDuration, formatDateTime, formatRelativeTime, isExpiringSoon } from '@atlas/shared'
import styles from './index.module.scss'

const { Text, Link } = Typography

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
  const domainId = useDomainId()
  const navigate = useAppNavigate()

  const { data, loading } = useRequest(
    () => serviceApi.getDetail(domainId!, serviceId!),
    { ready: !!domainId && !!serviceId, onError: () => message.error('获取服务信息失败') }
  )

  const { data: appRelations, loading: appRelLoading } = useRequest(
    () => serviceApi.getApplicationRelations(domainId!, serviceId!),
    { ready: !!domainId && !!serviceId }
  )

  // 获取该服务相关的关系列表（ReBAC 关系图）
  const { data: relationships, loading: relLoading } = useRequest(
    () => relationshipApi.getList({ service_id: serviceId }),
    {
      ready: !!serviceId,
    }
  )

  const appRelationColumns: ColumnsType<ServiceApplicationRelation> = [
    {
      title: '应用',
      dataIndex: 'app_id',
      key: 'app_id',
      width: 180,
      render: (value) => (
        <Link onClick={() => navigate(`/applications/${value}`)} ellipsis>
          {value}
        </Link>
      ),
    },
    {
      title: '授予的权限',
      dataIndex: 'relations',
      key: 'relations',
      render: (relations: string[]) =>
        (relations || []).map((r) => (
          <Tag key={r} color="processing" bordered={false}>
            {r}
          </Tag>
        )),
    },
  ]

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
        <Descriptions column={2} className={styles.descriptions}>
          <Descriptions.Item label="服务ID">{data.service_id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="域ID">{data.domain_id}</Descriptions.Item>
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
      key: 'granted-apps',
      label: (
        <span>
          <AppstoreOutlined />
          已授权应用
          {appRelations && appRelations.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>
              {appRelations.length}
            </Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.relationshipsTab}>
          <div className={styles.tabHeader}>
            <Text type="secondary">
              本服务已授权给以下应用及其可用的权限类型（ReBAC）。具体授权在应用详情中配置。
            </Text>
          </div>
          <Table
            columns={appRelationColumns}
            dataSource={appRelations || []}
            loading={appRelLoading}
            rowKey="app_id"
            size="small"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无已授权应用" />
              ),
            }}
          />
        </div>
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
            <Text type="secondary">该服务下的主体-关系-对象授权关系，可在关系图谱中编辑</Text>
            <Space>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => navigate(`/services/${serviceId}/relationships/create`)}
              >
                配置关系
              </Button>
              <Button
                icon={<NodeIndexOutlined />}
                onClick={() => navigate(`/services/${serviceId}/relationships/graph`)}
              >
                在图谱中查看
              </Button>
            </Space>
          </div>
          <Table
            columns={relationColumns}
            dataSource={relationships || []}
            loading={relLoading}
            rowKey={(r) => `${r.service_id}:${r.subject_id}:${r.relation}:${r.object_id}`}
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
      <PageHeader
        title={data.name || '服务详情'}
        onBack={() => navigate('/services')}
        extra={
          <Button type="primary" onClick={() => navigate(`/services/${serviceId}/edit`)}>
            编辑服务
          </Button>
        }
      />
      <div className={styles.content}>
        <Card bordered={false} className={styles.mainCard}>
          <Tabs items={tabItems} className={styles.tabs} />
        </Card>
      </div>
    </div>
  )
}
