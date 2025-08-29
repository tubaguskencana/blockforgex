import { Form } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { upsert } from '../../store/appSlice'
import { selectApp } from '../../store'
import { useEffect } from 'react'
import { Plant01Icon, BulbChargingIcon, Rocket01Icon, CrownIcon } from 'hugeicons-react'
import RadioCardGroup from '../../components/RadioCardGroup'

export default function Step6({ onNext, setSubmitter }) {
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

    const proficiencyOptions = [
        {
            value: 'beginner',
            title: 'Beginner',
            description: 'I can interact in a simple way, if the other person talks slowly and is able to cooperate.',
            icon: <Plant01Icon />
        },
        {
            value: 'intermediate',
            title: 'Intermediate',
            description: 'I can explain my decisions and follow most instructions in text or speech, though I sometimes need repetition.',
            icon: <BulbChargingIcon />
        },
        {
            value: 'advanced',
            title: 'Advanced',
            description: 'I understand and use complex language, speak on technical topics, and communicate spontaneously with ease.',
            icon: <Rocket01Icon />
        },
        {
            value: 'proficient',
            title: 'Proficient',
            description: 'I understand almost everything I hear or read and speak confidently with nuance in complex situations.',
            icon: <CrownIcon />
        }
    ]

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            initialValues={{ proficiency: app.proficiency || 'beginner' }}
            className="[&_.ant-form-item-label>label]:font-medium"
        >
            <RadioCardGroup
                name="proficiency"
                options={proficiencyOptions}
                requiredMessage="Please select your English proficiency level"
            />
        </Form>
    )
}
