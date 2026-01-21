import { useRequest } from 'ahooks'
import { Form, Input, InputNumber, Select, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { serviceApi, domainApi } from '@/services'
import { PageHeader, FormActions } from '@/components'
import styles from './index.module.scss'

const { TextArea } = Input

export function Create() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { data: domains } = useRequest(() => domainApi.getList())

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      await serviceApi.create({
        service_id: values.service_id as string,
        domain_id: values.domain_id as string,
        name: values.name as string,
        description: values.description as string | undefined,
        access_token_expires_in: values.access_token_expires_in as number | undefined,
        refresh_token_expires_in: values.refresh_token_expires_in as number | undefined,
      })
      message.success('创建成功')
      navigate('/hermes/services')
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
      <Card>
        <PageHeader title="新建服务" backPath="/hermes/services" />

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
            name="domain_id"
            label="域"
            rules={[{ required: true, message: '请选择域' }]}
          >
            <Select placeholder="请选择域">
              {domains?.map((domain) => (
                <Select.Option key={domain.domain_id} value={domain.domain_id}>
                  {domain.name} ({domain.domain_id})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={4} placeholder="请输入描述" />
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
              cancelPath="/hermes/services"
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
