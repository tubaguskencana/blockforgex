import { Form } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { upsert } from '../../store/appSlice'
import { selectApp } from '../../store'
import { useEffect } from 'react'
import { HourglassOutlined } from '@ant-design/icons' 
import { Task01Icon } from 'hugeicons-react'
import { CheckListIcon } from 'hugeicons-react'
import RadioCardGroup from '../../components/RadioCardGroup'

export default function Step5({ onNext, setSubmitter }) {
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

    const availabilityOptions = [
        {
            value: 'fulltime',
            title: 'Full-time',
            description: '40+ hours per week',
            icon: <Task01Icon />
        },
        {
            value: 'parttime',
            title: 'Part-time',
            description: '20-30 hours per week',
            icon: <HourglassOutlined />
        },
        {
            value: 'asneeded',
            title: 'As Needed',
            description: 'Flexible hours, on my own time.',
            icon: <CheckListIcon />
        }
    ]

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{ availability: app.availability || 'fulltime' }}
            className="[&_.ant-form-item-label>label]:font-medium"
        >
            <RadioCardGroup
                name="availability"
                options={availabilityOptions}
                requiredMessage="Please select your availability"
            />
        </Form>
    )
}
