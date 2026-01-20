import { useRequest } from 'ahooks'
import { Form, Input, Card, message } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { groupApi } from '@/services'
import { PageHeader, FormActions } from '@/components'
import styles from './index.module.scss'

const { TextArea } = Input

export function Edit() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { data, loading: detailLoading } = useRequest(() => groupApi.getDetail(groupId!), {
    ready: !!groupId,
    onSuccess: (data) => {
      form.setFieldsValue({
        name: data.name,
        description: data.description,
      })
    },
    onError: () => message.error('获取组信息失败'),
  })

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      await groupApi.update(groupId!, {
        name: values.name as string | undefined,
        description: values.description as string | undefined,
      })
      message.success('更新成功')
      navigate(`/hermes/groups/${groupId}`)
    },
    { manual: true, onError: () => message.error('更新失败') }
  )

  if (detailLoading) return <div>加载中...</div>

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="编辑组" backPath={`/hermes/groups/${groupId}`} />
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item>
            <FormActions loading={loading} submitText="保存" cancelPath={`/hermes/groups/${groupId}`} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
