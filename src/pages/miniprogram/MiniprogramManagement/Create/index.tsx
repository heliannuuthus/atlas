import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Form, Input, Select, Button, Card, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { createMiniprogram } from '@/mock/api/miniprogram'
import {
  MiniprogramPlatform,
  MiniprogramStatus,
} from '@/types/miniprogram'
import styles from './index.module.scss'

const { TextArea } = Input

export function Create() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { run: handleSubmit, loading } = useRequest(
    async (values: any) => {
      await createMiniprogram({
        ...values,
        status: MiniprogramStatus.DRAFT,
      })
      message.success('创建成功')
      navigate('/miniprogram')
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
        <div className={styles.header}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/miniprogram')}
          >
            返回
          </Button>
          <div className={styles.title}>新建小程序</div>
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
            initialValue="1.0.0"
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
            <Button type="primary" htmlType="submit" loading={loading}>
              创建
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate('/miniprogram')}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
