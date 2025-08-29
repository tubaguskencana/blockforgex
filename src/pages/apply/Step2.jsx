import { Form } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { upsert } from '../../store/appSlice'
import { selectApp } from '../../store'
import { useEffect } from 'react'
import { Briefcase07Icon, WorkflowSquare08Icon } from 'hugeicons-react'
import RadioCardGroup from '../../components/RadioCardGroup'

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

    const businessTypeOptions = [
        {
            value: 'individual',
            title: 'Independent Freelancer & Contractor',
            description: 'Providing reliable, flexible, and high-quality support for your projects.',
            icon: <Briefcase07Icon />
        },
        {
            value: 'company',
            title: 'Company / Organization Applicant',
            description: 'Representing our team to deliver trusted expertise, scalable solutions, and long-term collaboration.',
            icon: <WorkflowSquare08Icon />
        }
    ]

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
                label=""
                name="businessType"
                rules={[{ required: true, message: 'Please select your business type' }]}
            >
                <RadioCardGroup
                    options={businessTypeOptions}
                />
            </Form.Item>
        </Form>
    )
}
