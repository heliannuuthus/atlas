import { useRequest } from 'ahooks'
import { Card, Descriptions, Spin, message, Tabs, Table, Empty, Typography, Tag, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useParams } from 'react-router-dom'
import { useAppNavigate } from '@/contexts/DomainContext'
import { InfoCircleOutlined, CloudServerOutlined, AppstoreAddOutlined } from '@ant-design/icons'
import { domainApi, serviceApi, applicationApi } from '@/services'
import type { Service, Application } from '@/types'
import { PageHeader, formatDateTime, formatDuration } from '@atlas/shared'
import styles from './index.module.scss'

const { Text, Link } = Typography

export function Detail() {
  const { domainId } = useParams<{ domainId: string }>()
  const navigate = useAppNavigate()

  const { data, loading } = useRequest(
    () => domainApi.getDetail(domainId!),
    {
      ready: !!domainId,
      onError: () => {
        message.error('获取域信息失败')
      },
    }
  )

  const { data: services, loading: servicesLoading } = useRequest(
    () => serviceApi.getList(domainId!),
    { ready: !!domainId }
  )

  const { data: applications, loading: appsLoading } = useRequest(
    () => applicationApi.getList(domainId!),
    { ready: !!domainId }
  )

  const serviceColumns: ColumnsType<Service> = [
    {
      title: '服务ID',
      dataIndex: 'service_id',
      key: 'service_id',
      width: 150,
      render: (value) => (
        <Link onClick={() => navigate(`/services/${value}`)}>
          {value}
        </Link>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: 'Token 有效期',
      key: 'token_expires',
      width: 200,
      render: (_, record) => (
        <div className={styles.tokenExpiry}>
          <div className={styles.tokenRow}>
            <span>Access:</span>
            <span>{formatDuration(record.access_token_expires_in)}</span>
          </div>
          <div className={styles.tokenRow}>
            <span>Refresh:</span>
            <span>{formatDuration(record.refresh_token_expires_in)}</span>
          </div>
        </div>
      ),
    },
  ]

  const applicationColumns: ColumnsType<Application> = [
    {
      title: '应用ID',
      dataIndex: 'app_id',
      key: 'app_id',
      width: 180,
      render: (value) => (
        <Link onClick={() => navigate(`/applications/${value}`)}>
          {value}
        </Link>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: (text) => formatDateTime(text),
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
          <Descriptions.Item label="域ID">{data.domain_id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {data.description || <Text type="secondary">-</Text>}
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'services',
      label: (
        <span>
          <CloudServerOutlined />
          服务列表
          {services && services.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>{services.length}</Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.relationshipsTab}>
          <div className={styles.tabHeader}>
            <Text type="secondary">该域下的所有服务</Text>
            <Button
              type="primary"
              onClick={() => navigate('/services', { state: { openCreate: true } })}
            >
              新建服务
            </Button>
          </div>
          <Table
            columns={serviceColumns}
            dataSource={services || []}
            loading={servicesLoading}
            rowKey="service_id"
            size="small"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无服务"
                />
              ),
            }}
          />
        </div>
      ),
    },
    {
      key: 'applications',
      label: (
        <span>
          <AppstoreAddOutlined />
          应用列表
          {applications && applications.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>{applications.length}</Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.relationshipsTab}>
          <div className={styles.tabHeader}>
            <Text type="secondary">该域下的所有应用</Text>
            <Button
              type="primary"
              onClick={() => navigate('/applications', { state: { openCreate: true } })}
            >
              新建应用
            </Button>
          </div>
          <Table
            columns={applicationColumns}
            dataSource={applications || []}
            loading={appsLoading}
            rowKey="app_id"
            size="small"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无应用"
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
      <PageHeader title={data.name || '域详情'} onBack={() => navigate('/')} />
      <div className={styles.content}>
        <Card bordered={false} className={styles.mainCard}>
          <Tabs items={tabItems} className={styles.tabs} />
        </Card>
      </div>
    </div>
  )
}
