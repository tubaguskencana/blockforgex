// src/pages/apply/Step2.jsx
import { Form, Radio } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { upsert } from '../../store/appSlice'
import { selectApp } from '../../store'
import { useEffect } from 'react'
import { InboxOutlined, ApartmentOutlined } from '@ant-design/icons' // contoh ikon

export default function Step2({ onNext, setSubmitter }) {
    const dispatch = useDispatch()
    const app = useSelector(selectApp)
    const [form] = Form.useForm()

    useEffect(() => {
        setSubmitter?.(form.submit)
        return () => setSubmitter?.(null)
    }, [form, setSubmitter])

    const onFinish = (values) => {
        dispatch(upsert(values))
        onNext()
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{ businessType: app.businessType || 'individual' }}
            className="[&_.ant-form-item-label>label]:font-medium"
        >
            <Form.Item
                label="Business Type"
                name="businessType"
                rules={[{ required: true, message: 'Please select your business type' }]}
            >
                <Radio.Group className="w-full">
                    <div className="grid gap-4">
                        {/* Individual */}
                        <Radio value="individual" className="rf-choice">
                            <div className="rf-card">
                                <div className="rf-icon">{/* ganti ikon sesuai kebutuhan */}👜</div>
                                <div>
                                    <div className="rf-title">independent Freelancer & Contractor</div>
                                    <div className="rf-desc">
                                        Providing reliable, flexible, and high-quality support for your projects.
                                    </div>
                                </div>
                            </div>
                        </Radio>

                        {/* Company */}
                        <Radio value="company" className="rf-choice">
                            <div className="rf-card">
                                <div className="rf-icon">{/* ikon */}🏢</div>
                                <div>
                                    <div className="rf-title">Company / Organization Applicant</div>
                                    <div className="rf-desc">
                                        Representing our team to deliver trusted expertise, scalable solutions, and long-term collaboration.
                                    </div>
                                </div>
                            </div>
                        </Radio>
                    </div>
                </Radio.Group>
            </Form.Item>

        </Form>
    )
}
