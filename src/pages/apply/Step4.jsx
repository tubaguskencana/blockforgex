import { Form, Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { upsert } from '../../store/appSlice'
import { selectApp } from '../../store'

const fmt = (n) => {
    if (n == null || n === '') return ''
    const num = Number(String(n).replace(/[^\d]/g, ''))
    if (!Number.isFinite(num)) return ''
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
const unfmt = (s) => Number(String(s || '').replace(/[^\d]/g, '')) || 0

export default function Step4({ onNext, setSubmitter }) {
    const dispatch = useDispatch()
    const app = useSelector(selectApp)
    const [form] = Form.useForm()

    useEffect(() => {
        setSubmitter?.(form.submit)
        return () => setSubmitter?.(null)
    }, [form, setSubmitter])

    const onFinish = (values) => {
        const amount = unfmt(values.minMonthlyRate)
        dispatch(upsert({ minMonthlyRate: amount })) // simpan sebagai number
        onNext?.()
    }

    const onBlurFormat = () => {
        const v = form.getFieldValue('minMonthlyRate')
        form.setFieldsValue({ minMonthlyRate: fmt(v) })
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            className="[&_.ant-form-item-label>label]:font-medium"
            initialValues={{
                // tampilkan terformat jika sebelumnya sudah ada di redux
                minMonthlyRate: app.minMonthlyRate ? fmt(app.minMonthlyRate) : '',
            }}
        >
            <Form.Item
                label="I want to earn per month (full-time, before tax, USD)"
                name="minMonthlyRate"
                rules={[
                    { required: true, message: 'Please enter your monthly rate' },
                    {
                        validator: (_, value) => {
                            const num = unfmt(value)
                            return num > 0 ? Promise.resolve() : Promise.reject(new Error('Amount must be greater than 0'))
                        },
                    },
                ]}
            >
                <Input
                    className="rf-input conversion"
                    placeholder="1,000"
                    inputMode="numeric"
                    onBlur={onBlurFormat}
                    prefix={<span className="text-[#1F2937] font-semibold pl-8">$</span>}
                    suffix={<span className="text-[#1F293780] pr-8">/month</span>}
                />
            </Form.Item>
        </Form>
    )
}
