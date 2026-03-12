import { useRequest } from 'ahooks'
import { Form, Input, Card, message, Switch } from 'antd'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { applicationApi } from '@/services'
import {
  validateRedirectUrisMultiLine,
  validateAllowedOriginsMultiLine,
  validateLogoutUrisMultiLine,
} from '@/utils/uri-validation'
import { PageHeader, FormActions } from '@atlas/shared'
import styles from './index.module.scss'

const { TextArea } = Input

export function Create() {
  const navigate = useAppNavigate()
  const domainId = useDomainId()
  const [form] = Form.useForm()

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      const allowedRedirectUris = values.allowed_redirect_uris
        ? (values.allowed_redirect_uris as string).split('\n').map((s: string) => s.trim()).filter(Boolean)
        : []
      const allowedOrigins = values.allowed_origins
        ? (values.allowed_origins as string).split('\n').map((s: string) => s.trim()).filter(Boolean)
        : []
      const allowedLogoutUris = values.allowed_logout_uris
        ? (values.allowed_logout_uris as string).split('\n').map((s: string) => s.trim()).filter(Boolean)
        : []
      await applicationApi.create(domainId!, {
        app_id: (values.app_id as string)?.trim() ?? '',
        name: values.name as string,
        description: (values.description as string)?.trim() ?? '',
        allowed_redirect_uris: allowedRedirectUris,
        allowed_origins: allowedOrigins,
        allowed_logout_uris: allowedLogoutUris,
        need_key: values.need_key as boolean,
      })
      message.success('创建成功')
      navigate('/applications')
    },
    { manual: true, onError: () => message.error('创建失败') }
  )

  return (
    <div className={styles.container}>
      <PageHeader title="新建应用" onBack={() => navigate('/applications')} />
      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item name="app_id" label="应用标识">
            <Input placeholder="选填，不填则自动生成" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
            <TextArea rows={3} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            name="allowed_redirect_uris"
            label="重定向 URI（每行一个）"
            rules={[
              {
                validator: (_, value) => {
                  const err = validateRedirectUrisMultiLine(value ?? '')
                  return err ? Promise.reject(new Error(err)) : Promise.resolve()
                },
              },
            ]}
          >
            <TextArea rows={3} placeholder="https://example.com/callback" />
          </Form.Item>
          <Form.Item
            name="allowed_origins"
            label="允许的来源 CORS（每行一个）"
            rules={[
              {
                validator: (_, value) => {
                  const err = validateAllowedOriginsMultiLine(value ?? '')
                  return err ? Promise.reject(new Error(err)) : Promise.resolve()
                },
              },
            ]}
          >
            <TextArea rows={2} placeholder="https://example.com" />
          </Form.Item>
          <Form.Item
            name="allowed_logout_uris"
            label="登出后跳转 URI（每行一个）"
            rules={[
              {
                validator: (_, value) => {
                  const err = validateLogoutUrisMultiLine(value ?? '')
                  return err ? Promise.reject(new Error(err)) : Promise.resolve()
                },
              },
            ]}
          >
            <TextArea rows={2} placeholder="https://example.com" />
          </Form.Item>
          <Form.Item name="need_key" label="需要密钥" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
          <Form.Item>
            <FormActions loading={loading} submitText="创建" cancelPath="/applications" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
