import { useRequest } from 'ahooks'
import { Form, Input, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { groupApi } from '@/services'
import { PageHeader, FormActions } from '@/components'
import styles from './index.module.scss'

const { TextArea } = Input

export function Create() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      await groupApi.create({
        group_id: values.group_id as string,
        name: values.name as string,
        description: values.description as string | undefined,
      })
      message.success('创建成功')
      navigate('/hermes/groups')
    },
    { manual: true, onError: () => message.error('创建失败') }
  )

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="新建组" backPath="/hermes/groups" />
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item
            name="group_id"
            label="组ID"
            rules={[{ required: true, message: '请输入组ID' }]}
          >
            <Input placeholder="请输入组ID" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item>
            <FormActions loading={loading} submitText="创建" cancelPath="/hermes/groups" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
