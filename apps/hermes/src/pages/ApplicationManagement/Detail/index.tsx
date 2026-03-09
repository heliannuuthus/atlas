import { useRequest } from 'ahooks'
import { Card, Descriptions, Spin, message, Tabs, Table, Empty, Typography, Tag, Tooltip, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useParams, useNavigate } from 'react-router-dom'
import { InfoCircleOutlined, ShareAltOutlined, CloudServerOutlined, NodeIndexOutlined } from '@ant-design/icons'
import { applicationApi, relationshipApi } from '@/services'
import type { Relationship, ApplicationServiceRelation } from '@/types'
import { PageHeader, formatDateTime, formatRelativeTime, isExpiringSoon } from '@atlas/shared'
import styles from './index.module.scss'

const { Text, Link } = Typography

export function Detail() {
  const { appId } = useParams<{ appId: string }>()
  const navigate = useNavigate()

  const { data, loading } = useRequest(() => applicationApi.getDetail(appId!), {
    ready: !!appId,
    onError: () => message.error('获取应用信息失败'),
  })

  // 获取该应用作为主体的关系列表
  const { data: relationships, loading: relLoading } = useRequest(
    () => relationshipApi.getList({ subject_type: 'application', subject_id: appId }),
    {
      ready: !!appId,
    }
  )

  // 获取应用服务关系
  const { data: serviceRelations, loading: svcRelLoading } = useRequest(
    () => applicationApi.getServiceRelations(appId!),
    {
      ready: !!appId,
    }
  )

  const relationColumns: ColumnsType<Relationship> = [
    {
      title: '服务',
      dataIndex: 'service_id',
      key: 'service_id',
      width: 120,
      render: (value) => <Tag bordered={false}>{value}</Tag>,
    },
    {
      title: '关系',
      dataIndex: 'relation',
      key: 'relation',
      width: 100,
      render: (value) => <Tag color="processing" bordered={false}>{value}</Tag>,
    },
    {
      title: '对象',
      key: 'object',
      width: 200,
      render: (_, record) => (
        <div className={styles.entityCell}>
          <Tag bordered={false}>{record.object_type}</Tag>
          <Tooltip title={record.object_id}>
            <Text ellipsis style={{ maxWidth: 120 }}>{record.object_id}</Text>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '过期时间',
      dataIndex: 'expires_at',
      key: 'expires_at',
      width: 140,
      render: (text) => {
        if (!text) return <Text type="secondary">永久</Text>
        const expiring = isExpiringSoon(text)
        return (
          <Text type={expiring ? 'warning' : undefined}>
            {formatRelativeTime(text)}
          </Text>
        )
      },
    },
  ]

  const serviceRelationColumns: ColumnsType<ApplicationServiceRelation> = [
    {
      title: '服务ID',
      dataIndex: 'service_id',
      key: 'service_id',
      render: (value) => (
        <Link onClick={() => navigate(`/services/${value}`)}>
          {value}
        </Link>
      ),
    },
    {
      title: '关系类型',
      dataIndex: 'relation',
      key: 'relation',
      render: (value) => <Tag color="processing" bordered={false}>{value}</Tag>,
    },
  ]

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  if (!data) return null

  let redirectUris: string[] = []
  try {
    redirectUris = Array.isArray(data.redirect_uris)
      ? data.redirect_uris
      : data.redirect_uris
        ? JSON.parse(data.redirect_uris)
        : []
  } catch {
    redirectUris = []
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
          <Descriptions.Item label="应用ID">{data.app_id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="域ID">{data.domain_id}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatDateTime(data.created_at)}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{formatDateTime(data.updated_at)}</Descriptions.Item>
          <Descriptions.Item label="重定向URI" span={2}>
            {redirectUris.length > 0 ? (
              <div className={styles.uriList}>
                {redirectUris.map((uri, i) => (
                  <Tag key={i} bordered={false}>{uri}</Tag>
                ))}
              </div>
            ) : (
              <Text type="secondary">-</Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'services',
      label: (
        <span>
          <CloudServerOutlined />
          可访问服务
          {serviceRelations && serviceRelations.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>{serviceRelations.length}</Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.relationshipsTab}>
          <div className={styles.tabHeader}>
            <Text type="secondary">该应用可访问的服务列表</Text>
          </div>
          <Table
            columns={serviceRelationColumns}
            dataSource={serviceRelations || []}
            loading={svcRelLoading}
            rowKey="service_id"
            size="small"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无可访问服务"
                />
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
          授权关系
          {relationships && relationships.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>{relationships.length}</Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.relationshipsTab}>
          <div className={styles.tabHeader}>
            <Text type="secondary">该应用作为主体的授权关系</Text>
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
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无授权关系"
                />
              ),
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="应用详情" backPath="/applications" />
        <Tabs items={tabItems} className={styles.tabs} />
      </Card>
    </div>
  )
}
