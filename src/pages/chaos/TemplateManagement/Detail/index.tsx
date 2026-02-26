import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Spin,
  Modal,
  Input,
  message,
  Typography,
} from 'antd'
import {
  ArrowLeftOutlined,
  EditOutlined,
  EyeOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { chaosTemplateApi, chaosMailApi } from '@/services'
import styles from './index.module.scss'

const { Text } = Typography

export function Detail() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const [sendVisible, setSendVisible] = useState(false)
  const [sendTo, setSendTo] = useState('')
  const [sending, setSending] = useState(false)

  const { data, loading } = useRequest(
    () => chaosTemplateApi.getDetail(templateId!),
    { ready: !!templateId }
  )

  const handlePreview = async () => {
    if (!templateId) return
    try {
      const variables = data?.variables ? JSON.parse(data.variables) : {}
      const result = await chaosTemplateApi.render(templateId, variables)
      setPreviewSubject(result.subject)
      setPreviewHtml(result.body)
      setPreviewVisible(true)
    } catch {
      message.error('预览失败，请检查模板语法')
    }
  }

  const handleSend = async () => {
    if (!templateId || !sendTo) return
    setSending(true)
    try {
      const variables = data?.variables ? JSON.parse(data.variables) : {}
      await chaosMailApi.send({
        to: sendTo,
        template_id: templateId,
        data: variables,
      })
      message.success('发送成功')
      setSendVisible(false)
      setSendTo('')
    } catch {
      message.error('发送失败')
    } finally {
      setSending(false)
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

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/chaos/templates')}
            />
            <span className={styles.title}>{data.name}</span>
            {data.is_builtin && <Tag color="blue">内置</Tag>}
            {data.is_enabled ? (
              <Tag color="success">启用</Tag>
            ) : (
              <Tag color="default">禁用</Tag>
            )}
          </Space>
          <Space>
            <Button icon={<EyeOutlined />} onClick={handlePreview}>
              预览
            </Button>
            <Button icon={<SendOutlined />} onClick={() => setSendVisible(true)}>
              测试发送
            </Button>
            {!data.is_builtin && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/chaos/templates/${templateId}/edit`)}
              >
                编辑
              </Button>
            )}
          </Space>
        </div>

        <Descriptions column={2} bordered className={styles.descriptions}>
          <Descriptions.Item label="模板ID">{data.template_id}</Descriptions.Item>
          <Descriptions.Item label="类型">{data.type}</Descriptions.Item>
          <Descriptions.Item label="邮件主题" span={2}>
            {data.subject}
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {data.description || <Text type="secondary">-</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(data.created_at).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(data.updated_at).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>邮件内容</div>
          <pre className={styles.codeBlock}>{data.content}</pre>
        </div>

        {data.variables && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>变量说明</div>
            <pre className={styles.codeBlock}>{data.variables}</pre>
          </div>
        )}
      </Card>

      <Modal
        title={`预览 - ${previewSubject}`}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        <div
          className={styles.preview}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </Modal>

      <Modal
        title="测试发送"
        open={sendVisible}
        onCancel={() => setSendVisible(false)}
        onOk={handleSend}
        confirmLoading={sending}
        okText="发送"
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            使用模板变量中的示例数据发送测试邮件
          </Text>
        </div>
        <Input
          placeholder="输入收件人邮箱"
          value={sendTo}
          onChange={(e) => setSendTo(e.target.value)}
        />
      </Modal>
    </div>
  )
}
