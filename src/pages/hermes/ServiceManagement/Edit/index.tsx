import { useRequest } from 'ahooks'
import { Form, Input, InputNumber, Card, message, Switch } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { serviceApi } from '@/services'
import { PageHeader, FormActions } from '@/components'
import styles from './index.module.scss'

const { TextArea } = Input

export function Edit() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { data: _data, loading: detailLoading } = useRequest(
    () => serviceApi.getDetail(serviceId!),
    {
      ready: !!serviceId,
      onSuccess: (_data) => {
        form.setFieldsValue({
          name: _data.name,
          description: _data.description,
          access_token_expires_in: _data.access_token_expires_in,
          refresh_token_expires_in: _data.refresh_token_expires_in,
          status: _data.status === 0,
        })
      },
      onError: () => {
        message.error('获取服务信息失败')
      },
    }
  )

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      await serviceApi.update(serviceId!, {
        name: values.name as string | undefined,
        description: values.description as string | undefined,
        access_token_expires_in: values.access_token_expires_in as number | undefined,
        refresh_token_expires_in: values.refresh_token_expires_in as number | undefined,
        status: values.status ? 0 : 1,
      })
      message.success('更新成功')
      navigate(`/hermes/services/${serviceId}`)
    },
    {
      manual: true,
      onError: () => {
        message.error('更新失败')
      },
    }
  )

  if (detailLoading) {
    return <div>加载中...</div>
  }

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader
          title="编辑服务"
          backPath={`/hermes/services/${serviceId}`}
        />

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

          <Form.Item name="status" label="状态" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item>
            <FormActions
              loading={loading}
              submitText="保存"
              cancelPath={`/hermes/services/${serviceId}`}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
