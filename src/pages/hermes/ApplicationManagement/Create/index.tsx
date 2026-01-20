import { useRequest } from 'ahooks'
import { Form, Input, Select, Card, message, Switch } from 'antd'
import { useNavigate } from 'react-router-dom'
import { applicationApi, domainApi } from '@/services'
import { PageHeader, FormActions } from '@/components'
import styles from './index.module.scss'

const { TextArea } = Input

export function Create() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { data: domains } = useRequest(() => domainApi.getList())

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      const redirectUris = values.redirect_uris ? (values.redirect_uris as string).split('\n').filter(Boolean) : []
      await applicationApi.create({
        domain_id: values.domain_id as string,
        app_id: values.app_id as string,
        name: values.name as string,
        redirect_uris: redirectUris,
        need_key: values.need_key as boolean,
      })
      message.success('创建成功')
      navigate('/hermes/applications')
    },
    { manual: true, onError: () => message.error('创建失败') }
  )

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="新建应用" backPath="/hermes/applications" />
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item name="app_id" label="应用ID" rules={[{ required: true, message: '请输入应用ID' }]}>
            <Input placeholder="请输入应用ID" />
          </Form.Item>
          <Form.Item name="domain_id" label="域" rules={[{ required: true, message: '请选择域' }]}>
            <Select placeholder="请选择域">
              {domains?.map((domain) => <Select.Option key={domain.domain_id} value={domain.domain_id}>{domain.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="redirect_uris" label="重定向URI（每行一个）">
            <TextArea rows={4} placeholder="请输入重定向URI，每行一个" />
          </Form.Item>
          <Form.Item name="need_key" label="需要密钥" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
          <Form.Item>
            <FormActions loading={loading} submitText="创建" cancelPath="/hermes/applications" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
