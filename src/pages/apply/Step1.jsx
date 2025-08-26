import { Form, Input, Radio, Checkbox, Card, Typography, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { upsert } from '../../store/appSlice'
import { selectApp } from '../../store'
import { useEffect } from 'react'
import { FileSearchOutlined, GlobalOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function Step1({ onNext, setSubmitter }) {
  const dispatch = useDispatch()
  const app = useSelector(selectApp)
  const [form] = Form.useForm()

  useEffect(() => {
    // ✅ DAFTARKAN FUNGSI YANG BENAR-BENAR MENJALANKAN SUBMIT
    setSubmitter?.(form.submit)            // atau: setSubmitter?.(() => form.submit())
    return () => setSubmitter?.(null)
  }, [form, setSubmitter])

  const onFinish = (values) => {
    dispatch(upsert(values))
    onNext()
  }

  const onFinishFailed = ({ errorFields }) => {
    if (errorFields?.length) {
      form.scrollToField?.(errorFields[0].name)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      requiredMark={false}
      initialValues={{
        fullName: app.fullName,
        email: app.email,
        jobStatus: app.jobStatus ?? 'active',
        consents: app.consents ?? [],
      }}
      className="[&_.ant-form-item-label>label]:font-medium"

    >
      <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: 'Full name is required' }]}>
        <Input className="rf-input" placeholder="Zen Nakano" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Invalid email' },
        ]}
      >
        <Input className="rf-input" placeholder="Enter your email..." />
      </Form.Item>


      <Form.Item label="Job Search Status" name="jobStatus" rules={[{ required: true, message: 'Please choose one' }]}>
        <Radio.Group className="rf-radio w-full">
          <Space size="large" wrap className="w-full">
            <Radio.Button value="active" className="rf-pill !h-auto !py-3 !px-4 !rounded-xl">
              <FileSearchOutlined className="mr-2" />
              Actively looking for a job.
            </Radio.Button>
            <Radio.Button value="casual" className="rf-pill !h-auto !py-3 !px-4 !rounded-xl">
              <GlobalOutlined className="mr-2" />
              Casually browsing.
            </Radio.Button>
          </Space>
        </Radio.Group>
      </Form.Item>


      <Card className="rounded-xl bg-gray-50/70">
        <Text strong>For evaluation and communication purposes in line with privacy policy and cookie policy, I consent to:</Text>
        <div className="h-3" />
        <Form.Item
          name="consents"
          rules={[{ type: 'array', required: true, min: 1, message: 'Please choose at least one' }]}
        >
          <Checkbox.Group className="grid gap-3">
            <Checkbox value="data">The processing and storing of my submitted personal data.</Checkbox>
            <Checkbox value="tools">The use of call recording, note-taking tools, and external assessment tools.</Checkbox>
            <Checkbox value="cookies">The use of cookies to improve functionality…</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Card>

      {/* Tombol submit tidak dibutuhkan di sini; ada di parent */}
    </Form>
  )
}
