import { useRequest } from 'ahooks'
import {
  Card,
  Descriptions,
  Spin,
  message,
  Tabs,
  Table,
  Empty,
  Typography,
  Tag,
  Tooltip,
  Button,
  Avatar,
  List,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useParams, useNavigate } from 'react-router-dom'
import {
  InfoCircleOutlined,
  TeamOutlined,
  ShareAltOutlined,
  NodeIndexOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { groupApi, relationshipApi } from '@/services'
import type { Relationship } from '@/types'
import { PageHeader, formatDateTime, formatRelativeTime, isExpiringSoon } from '@atlas/shared'
import styles from './index.module.scss'

const { Text } = Typography

export function Detail() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()

  const { data, loading } = useRequest(() => groupApi.getDetail(groupId!), {
    ready: !!groupId,
    onError: () => message.error('获取组信息失败'),
  })

  const { data: members, loading: membersLoading } = useRequest(
    () => groupApi.getMembers(groupId!),
    {
      ready: !!groupId,
    }
  )

  // 获取该组作为主体的关系列表
  const { data: relationships, loading: relLoading } = useRequest(
    () => relationshipApi.getList({ subject_type: 'group', subject_id: groupId }),
    {
      ready: !!groupId,
    }
  )

  const relationColumns: ColumnsType<Relationship> = [
    {
      title: '服务',
      dataIndex: 'service_id',
      key: 'service_id',
      width: 120,
      render: value => <Tag bordered={false}>{value}</Tag>,
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

  if (!data) return null

  const memberList: string[] = members?.members || []

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
          <Descriptions.Item label="组ID">{data.group_id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {data.description || <Text type="secondary">-</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatDateTime(data.created_at)}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{formatDateTime(data.updated_at)}</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'members',
      label: (
        <span>
          <TeamOutlined />
          成员列表
          {memberList.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>
              {memberList.length}
            </Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.membersTab}>
          <div className={styles.tabHeader}>
            <Text type="secondary">该组包含的用户成员</Text>
          </div>
          {membersLoading ? (
            <div className={styles.loading}>
              <Spin />
            </div>
          ) : memberList.length > 0 ? (
            <List
              grid={{ gutter: 16, xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
              dataSource={memberList}
              renderItem={userId => (
                <List.Item>
                  <div className={styles.memberCard}>
                    <Avatar icon={<UserOutlined />} />
                    <Tooltip title={userId}>
                      <Text ellipsis className={styles.memberName}>
                        {userId}
                      </Text>
                    </Tooltip>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无成员" />
          )}
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
            <Tag bordered={false} className={styles.tabBadge}>
              {relationships.length}
            </Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.relationshipsTab}>
          <div className={styles.tabHeader}>
            <Text type="secondary">该组作为主体的授权关系</Text>
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
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无授权关系" />,
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="组详情" backPath="/groups" />
        <Tabs items={tabItems} className={styles.tabs} />
      </Card>
    </div>
  )
}
