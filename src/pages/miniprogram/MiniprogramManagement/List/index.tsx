import { useState } from 'react'
import { useRequest } from 'ahooks'
import { Card, Table, Button, Space, Input, Select, message, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getMiniprogramList, deleteMiniprogram } from '@/mock/api/miniprogram'
import type { Miniprogram } from '@/types/miniprogram'
import { MiniprogramStatus, MiniprogramPlatform } from '@/types/miniprogram'
import { StatusTag } from '@/components/StatusTag'
import { PlatformTag } from '@/components/PlatformTag'
import styles from './index.module.scss'

const { Search } = Input

const statusOptions = [
  { label: '全部状态', value: undefined },
  { label: '草稿', value: MiniprogramStatus.DRAFT },
  { label: '审核中', value: MiniprogramStatus.REVIEWING },
  { label: '已发布', value: MiniprogramStatus.PUBLISHED },
  { label: '已下线', value: MiniprogramStatus.OFFLINE },
  { label: '审核拒绝', value: MiniprogramStatus.REJECTED },
]

const platformOptions = [
  { label: '全部平台', value: undefined },
  { label: '微信小程序', value: MiniprogramPlatform.WECHAT },
  { label: '支付宝小程序', value: MiniprogramPlatform.ALIPAY },
  { label: '字节跳动小程序', value: MiniprogramPlatform.BYTEDANCE },
]

export function List() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<MiniprogramStatus | undefined>()
  const [platform, setPlatform] = useState<MiniprogramPlatform | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, loading, refresh } = useRequest(
    () =>
      getMiniprogramList({
        page,
        pageSize,
        keyword,
        status,
        platform,
      }),
    {
      refreshDeps: [page, pageSize, keyword, status, platform],
    }
  )

  const handleDelete = async (id: string) => {
    try {
      await deleteMiniprogram(id)
      message.success('删除成功')
      await refresh()
    } catch {
      message.error('删除失败')
    }
  }

  const columns: ColumnsType<Miniprogram> = [
    {
      title: '小程序名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text, record) => (
        <div className={styles.nameCell}>
          {record.logo && <img src={record.logo} alt={text} className={styles.logo} />}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'AppID',
      dataIndex: 'appId',
      key: 'appId',
      width: 200,
      ellipsis: true,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: platform => <PlatformTag platform={platform} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: status => <StatusTag status={status} />,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      width: 100,
    },
    {
      title: '负责人',
      dataIndex: 'owner',
      key: 'owner',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: text => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/miniprogram/${record.id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/miniprogram/${record.id}/edit`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>小程序管理</div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/miniprogram/create')}
          >
            新建小程序
          </Button>
        </div>

        <div className={styles.filters}>
          <Space size="middle">
            <Search
              placeholder="搜索小程序名称、AppID"
              allowClear
              style={{ width: 300 }}
              value={keyword}
              onChange={e => {
                setKeyword(e.target.value)
                setPage(1)
              }}
              onSearch={() => refresh()}
            />
            <Select
              placeholder="选择状态"
              style={{ width: 150 }}
              value={status}
              onChange={value => {
                setStatus(value)
                setPage(1)
              }}
              options={statusOptions}
            />
            <Select
              placeholder="选择平台"
              style={{ width: 150 }}
              value={platform}
              onChange={value => {
                setPlatform(value)
                setPage(1)
              }}
              options={platformOptions}
            />
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              刷新
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data?.list || []}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            current: page,
            pageSize,
            total: data?.total,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage)
              setPageSize(newPageSize)
            },
          }}
        />
      </Card>
    </div>
  )
}
