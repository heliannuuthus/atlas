import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Space, message, Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { chaosTemplateApi, type TemplateCreateRequest } from '@/services'
import styles from './index.module.scss'

const { TextArea } = Input

export function Create() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: TemplateCreateRequest) => {
    setLoading(true)
    try {
      await chaosTemplateApi.create(values)
      message.success('创建成功')
      navigate('/templates')
    } catch {
      message.error('创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/templates')} />
            <span className={styles.title}>创建邮件模板</span>
          </Space>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="template_id"
                label="模板ID"
                rules={[
                  { required: true, message: '请输入模板ID' },
                  { pattern: /^[a-z0-9_-]+$/, message: '只能包含小写字母、数字、下划线、横线' },
                ]}
              >
                <Input placeholder="例如: otp_login, welcome_email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="模板名称"
                rules={[{ required: true, message: '请输入模板名称' }]}
              >
                <Input placeholder="例如: 登录验证码" />
              </Form.Item>
            </Col>
          </Row>

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
            <TextArea
              rows={12}
              placeholder={`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
  <h1>您的验证码</h1>
  <p>验证码: <strong>{{.Code}}</strong></p>
  <p>{{.ExpiresInMinutes}} 分钟内有效</p>
</body>
</html>`}
            />
          </Form.Item>

          <Form.Item name="variables" label="变量说明" extra="JSON 格式，用于前端预览时的示例数据">
            <TextArea rows={4} placeholder='{"Code": "123456", "ExpiresInMinutes": 5}' />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                创建
              </Button>
              <Button onClick={() => navigate('/templates')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
