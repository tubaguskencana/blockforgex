// src/pages/apply/Step7.jsx
import { Form, Input, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { upsert } from '../../store/appSlice'
import { selectApp } from '../../store'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Step7({ setSubmitter }) {
  const dispatch = useDispatch()
  const app = useSelector(selectApp)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSubmitter?.(form.submit)
    return () => setSubmitter?.(null)
  }, [form, setSubmitter])

  const onFinish = async (values) => {
    // gabung data terakhir + Redux jadi satu payload
    const payload = { ...app, ...values }
    dispatch(upsert(values))

    try {
      setLoading(true)
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Submit failed')
      message.success('Application submitted!')
      navigate('/apply/success') // atau ke halaman review/thanks
    } catch (e) {
      message.error(e.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      initialValues={{ portfolio: app.portfolio }}
    >
      <Form.Item
        label="Portfolio / LinkedIn / Personal Site"
        name="portfolio"
        rules={[{ required: true, message: 'Please provide at least one link' }]}
      >
        <Input placeholder="https://…" />
      </Form.Item>

      {/* Tombol submit tidak di sini; di StepPage akan panggil form.submit() */}
      {/* Kalau mau tunjukkan loading di tombol utama, lempar state via context/Redux atau
          buat StepPage menampilkan loading saat step === total */}
    </Form>
  )
}
