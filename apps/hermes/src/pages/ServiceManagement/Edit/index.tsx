import { useRequest } from 'ahooks'
import { Form, Input, InputNumber, Card, message, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { serviceApi } from '@/services'
import { PageHeader, FormActions } from '@atlas/shared'
import styles from './index.module.scss'

const { TextArea } = Input

export function Edit() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const domainId = useDomainId()
  const navigate = useAppNavigate()
  const [form] = Form.useForm()

  const { data: _data, loading: detailLoading } = useRequest(
    () => serviceApi.getDetail(domainId!, serviceId!),
    {
      ready: !!domainId && !!serviceId,
      onSuccess: (_data) => {
        form.setFieldsValue({
          name: _data.name,
          description: _data.description,
          access_token_expires_in: _data.access_token_expires_in,
          refresh_token_expires_in: _data.refresh_token_expires_in,
        })
      },
      onError: () => {
        message.error('获取服务信息失败')
      },
    }
  )

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      await serviceApi.update(domainId!, serviceId!, {
        name: values.name as string | undefined,
        description: values.description as string | undefined,
        access_token_expires_in: values.access_token_expires_in as number | undefined,
        refresh_token_expires_in: values.refresh_token_expires_in as number | undefined,
      })
      message.success('更新成功')
      navigate(`/services/${serviceId}`)
    },
    {
      manual: true,
      onError: () => {
        message.error('更新失败')
      },
    }
  )

  if (detailLoading) {
    return <Spin size="large" />
  }

  return (
    <div className={styles.container}>
      <PageHeader title="编辑服务" onBack={() => navigate(`/services/${serviceId}`)} />
      <Card variant="borderless">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
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
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="refresh_token_expires_in"
            label="Refresh Token 过期时间（秒）"
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <FormActions
              loading={loading}
              submitText="保存"
              cancelPath={`/services/${serviceId}`}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
