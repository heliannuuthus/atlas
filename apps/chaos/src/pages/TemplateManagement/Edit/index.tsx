import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Switch,
  message,
  Spin,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { chaosTemplateApi, type TemplateUpdateRequest } from '@/services'
import styles from './index.module.scss'

const { TextArea } = Input

export function Edit() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  const { data, loading } = useRequest(
    () => chaosTemplateApi.getDetail(templateId!),
    { ready: !!templateId }
  )

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    }
  }, [data, form])

  const handleSubmit = async (values: TemplateUpdateRequest) => {
    if (!templateId) return
    setSaving(true)
    try {
      await chaosTemplateApi.update(templateId, values)
      message.success('保存成功')
      navigate(`/templates/${templateId}`)
    } catch {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/templates/${templateId}`)}
            />
            <span className={styles.title}>编辑模板</span>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="例如: 登录验证码" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={2} placeholder="模板描述（可选）" />
          </Form.Item>

          <Form.Item
            name="subject"
            label="邮件主题"
            rules={[{ required: true, message: '请输入邮件主题' }]}
            extra="支持模板变量，如 {{.Code}}"
          >
            <Input placeholder="例如: 您的验证码是 {{.Code}}" />
          </Form.Item>

          <Form.Item
            name="content"
            label="邮件内容"
            rules={[{ required: true, message: '请输入邮件内容' }]}
            extra="HTML 格式，支持 Go template 语法"
          >
            <TextArea rows={12} />
          </Form.Item>

          <Form.Item
            name="variables"
            label="变量说明"
            extra="JSON 格式，用于前端预览时的示例数据"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="is_enabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                保存
              </Button>
              <Button onClick={() => navigate(`/templates/${templateId}`)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
