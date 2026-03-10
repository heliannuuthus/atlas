import { useState } from 'react'
import { useRequest } from 'ahooks'
import { Card, Table, Button, Space, Input, Tag, Empty, Popconfirm, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { chaosTemplateApi, type EmailTemplate } from '@/services'
import styles from './index.module.scss'

const { Search } = Input

export function List() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const { data, loading, refresh } = useRequest(() => chaosTemplateApi.getList())

  const handleDelete = async (templateId: string) => {
    try {
      await chaosTemplateApi.delete(templateId)
      message.success('删除成功')
      refresh()
    } catch {
      message.error('删除失败')
    }
  }

  const filteredData = (data || []).filter(item => {
    if (!keyword) return true
    return (
      item.name.toLowerCase().includes(keyword.toLowerCase()) ||
      item.template_id.toLowerCase().includes(keyword.toLowerCase())
    )
  })

  const columns: ColumnsType<EmailTemplate> = [
    {
      title: '模板ID',
      dataIndex: 'template_id',
      key: 'template_id',
      width: 180,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '主题',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: value => <Tag bordered={false}>{value}</Tag>,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Space>
          {record.is_enabled ? (
            <Tag color="success" bordered={false}>
              启用
            </Tag>
          ) : (
            <Tag color="default" bordered={false}>
              禁用
            </Tag>
          )}
          {record.is_builtin && (
            <Tag color="blue" bordered={false}>
              内置
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/chaos/templates/${record.template_id}`)}
          >
            查看
          </Button>
          {!record.is_builtin && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/chaos/templates/${record.template_id}/edit`)}
              >
                编辑
              </Button>
              <Popconfirm
                title="确定删除此模板？"
                onConfirm={() => handleDelete(record.template_id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ]

  const emptyState = (
    <Empty
      image={<FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
      imageStyle={{ height: 60 }}
      description="暂无邮件模板"
    >
      <Button type="primary" onClick={() => navigate('/chaos/templates/create')}>
        创建第一个模板
      </Button>
    </Empty>
  )

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>邮件模板管理</div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/chaos/templates/create')}
          >
            新建模板
          </Button>
        </div>

        <div className={styles.filters}>
          <Space size="middle">
            <Search
              placeholder="搜索模板名称、模板ID"
              allowClear
              style={{ width: 300 }}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              刷新
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="template_id"
          scroll={{ x: 1000 }}
          locale={{ emptyText: emptyState }}
        />
      </Card>
    </div>
  )
}
