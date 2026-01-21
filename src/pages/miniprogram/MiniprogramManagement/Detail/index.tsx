import { useParams, useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Spin,
  message,
} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { getMiniprogramDetail, publishMiniprogram } from '@/mock/api/miniprogram'
import { StatusTag, PlatformTag, PageHeader } from '@/components'
import { MiniprogramStatus } from '@/types/miniprogram'
import styles from './index.module.scss'

export function Detail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, loading, refresh } = useRequest(
    async () => {
      if (!id) throw new Error('ID is required')
      return await getMiniprogramDetail(id)
    },
    {
      ready: !!id,
    }
  )

  const handlePublish = async () => {
    if (!id) return
    try {
      await publishMiniprogram(id)
      message.success('提交审核成功')
      await refresh()
    } catch (error) {
      message.error('提交审核失败')
    }
  }

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

  const extra = (
    <Space>
      {data.status === MiniprogramStatus.DRAFT && (
        <Button type="primary" onClick={handlePublish}>
          提交审核
        </Button>
      )}
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => navigate(`/miniprogram/${id}/edit`)}
      >
        编辑
      </Button>
    </Space>
  )

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader
          title="小程序详情"
          backPath="/miniprogram"
          extra={extra}
        />

        <div className={styles.content}>
          <Card title="基本信息" className={styles.card}>
            <Descriptions column={2}>
              <Descriptions.Item label="小程序名称">
                <div className={styles.nameRow}>
                  {data.logo && (
                    <img src={data.logo} alt={data.name} className={styles.logo} />
                  )}
                  <span>{data.name}</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="AppID">{data.appId}</Descriptions.Item>
              <Descriptions.Item label="平台">
                <PlatformTag platform={data.platform} />
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <StatusTag status={data.status} />
              </Descriptions.Item>
              <Descriptions.Item label="版本">{data.version}</Descriptions.Item>
              <Descriptions.Item label="负责人">{data.owner || '-'}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                {new Date(data.createdAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间" span={2}>
                {new Date(data.updatedAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
              {data.publishedAt && (
                <Descriptions.Item label="发布时间" span={2}>
                  {new Date(data.publishedAt).toLocaleString('zh-CN')}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="描述" span={2}>
                {data.description || '-'}
              </Descriptions.Item>
              {data.tags && data.tags.length > 0 && (
                <Descriptions.Item label="标签" span={2}>
                  <Space>
                    {data.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {data.qrCode && (
            <Card title="二维码" className={styles.card}>
              <div className={styles.qrcode}>
                <img src={data.qrCode} alt="小程序二维码" />
              </div>
            </Card>
          )}
        </div>
      </Card>
    </div>
  )
}
