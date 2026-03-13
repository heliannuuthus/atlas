import { useRequest } from 'ahooks'
import { Form, Input, InputNumber, Card, message } from 'antd'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { serviceApi } from '@/services'
import { PageHeader, FormActions } from '@atlas/shared'
import styles from './index.module.scss'

const { TextArea } = Input

export function Create() {
  const navigate = useAppNavigate()
  const domainId = useDomainId()
  const [form] = Form.useForm()

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      await serviceApi.create(domainId!, {
        service_id: values.service_id as string,
        name: values.name as string,
        description: (values.description as string)?.trim() ?? '',
        access_token_expires_in: values.access_token_expires_in as number | undefined,
        refresh_token_expires_in: values.refresh_token_expires_in as number | undefined,
      })
      message.success('创建成功')
      navigate('/services')
    },
    {
      manual: true,
      onError: () => {
        message.error('创建失败')
      },
    }
  )

  return (
    <div className={styles.container}>
      <PageHeader title="新建服务" onBack={() => navigate('/services')} />
      <Card variant="borderless">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="service_id"
            label="服务ID"
            rules={[{ required: true, message: '请输入服务ID' }]}
          >
            <Input placeholder="请输入服务ID" />
          </Form.Item>

          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>

          <Form.Item
            name="access_token_expires_in"
            label="Access Token 过期时间（秒）"
            initialValue={7200}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="refresh_token_expires_in"
            label="Refresh Token 过期时间（秒）"
            initialValue={604800}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <FormActions
              loading={loading}
              submitText="创建"
              cancelPath="/services"
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
