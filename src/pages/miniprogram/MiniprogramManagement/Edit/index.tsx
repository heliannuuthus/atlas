import { useParams, useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Form, Input, Select, Button, Card, message, Spin } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  getMiniprogramDetail,
  updateMiniprogram,
} from '@/mock/api/miniprogram'
import { MiniprogramPlatform } from '@/types/miniprogram'
import styles from './index.module.scss'

const { TextArea } = Input

export function Edit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { data, loading } = useRequest(
    () => getMiniprogramDetail(id!),
    {
      ready: !!id,
      onSuccess: (data) => {
        form.setFieldsValue(data)
      },
    }
  )

  const { run: handleSubmit, loading: submitting } = useRequest(
    async (values: any) => {
      await updateMiniprogram(id!, values)
      message.success('更新成功')
      navigate(`/miniprogram/${id}`)
    },
    {
      manual: true,
      onError: () => {
        message.error('更新失败')
      },
    }
  )

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/miniprogram/${id}`)}
          >
            返回
          </Button>
          <div className={styles.title}>编辑小程序</div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          <Form.Item
            name="name"
            label="小程序名称"
            rules={[{ required: true, message: '请输入小程序名称' }]}
          >
            <Input placeholder="请输入小程序名称" />
          </Form.Item>

          <Form.Item
            name="appId"
            label="AppID"
            rules={[{ required: true, message: '请输入AppID' }]}
          >
            <Input placeholder="请输入AppID" />
          </Form.Item>

          <Form.Item
            name="platform"
            label="平台"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select placeholder="请选择平台">
              <Select.Option value={MiniprogramPlatform.WECHAT}>
                微信小程序
              </Select.Option>
              <Select.Option value={MiniprogramPlatform.ALIPAY}>
                支付宝小程序
              </Select.Option>
              <Select.Option value={MiniprogramPlatform.BYTEDANCE}>
                字节跳动小程序
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="请输入版本号，如：1.0.0" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea
              rows={4}
              placeholder="请输入小程序描述"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item name="logo" label="Logo URL">
            <Input placeholder="请输入Logo URL" />
          </Form.Item>

          <Form.Item name="owner" label="负责人">
            <Input placeholder="请输入负责人" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              保存
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate(`/miniprogram/${id}`)}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
