import { useRequest } from 'ahooks'
import { Form, Input, Card, message, Spin } from 'antd'
import { useParams } from 'react-router-dom'
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

export function Edit() {
  const { appId } = useParams<{ appId: string }>()
  const domainId = useDomainId()
  const navigate = useAppNavigate()
  const [form] = Form.useForm()

  const { data: _data, loading: detailLoading } = useRequest(
    () => applicationApi.getDetail(domainId!, appId!),
    {
      ready: !!domainId && !!appId,
      onSuccess: (data) => {
        let redirectUris: string[] = []
        let allowedOrigins: string[] = []
        try {
          const raw = data.allowed_redirect_uris
          redirectUris = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
        } catch {
          redirectUris = []
        }
        try {
          const raw = data.allowed_origins
          allowedOrigins = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
        } catch {
          allowedOrigins = []
        }
        let logoutUris: string[] = []
        try {
          const raw = data.allowed_logout_uris
          logoutUris = Array.isArray(raw) ? raw : (typeof raw === 'string' ? JSON.parse(raw) : [])
        } catch {
          logoutUris = []
        }
        form.setFieldsValue({
          name: data.name,
          allowed_redirect_uris: redirectUris.join('\n'),
          allowed_origins: allowedOrigins.join('\n'),
          allowed_logout_uris: logoutUris.join('\n'),
        })
      },
      onError: () => message.error('获取应用信息失败'),
    }
  )

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
      await applicationApi.update(domainId!, appId!, {
        name: values.name as string,
        allowed_redirect_uris: allowedRedirectUris,
        allowed_origins: allowedOrigins,
        allowed_logout_uris: allowedLogoutUris,
      })
      message.success('更新成功')
      navigate(`/applications/${appId}`)
    },
    { manual: true, onError: () => message.error('更新失败') }
  )

  if (detailLoading) return <Spin size="large" />

  return (
    <div className={styles.container}>
      <PageHeader title="编辑应用" onBack={() => navigate(`/applications/${appId}`)} />
      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
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
          <Form.Item>
            <FormActions loading={loading} submitText="保存" cancelPath={`/applications/${appId}`} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
