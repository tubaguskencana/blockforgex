// src/pages/apply/Step3.jsx
import { Form, Select } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { upsert } from '../../store/appSlice'
import { selectApp } from '../../store'

const COUNTRIES = [
    { value: 'ID', label: <div className="flex items-center gap-2"><span>🇮🇩</span><span>Indonesia</span></div> },
]

const STATES_BY_COUNTRY = {
    ID: [
        { value: 'Jakarta', label: 'Jakarta' },
        { value: 'West Java', label: 'West Java' },
        { value: 'Bali', label: 'Bali' },
    ],
}

const CITIES_BY_STATE = {
    Jakarta: [
        { value: 'South Jakarta', label: 'South Jakarta' },
        { value: 'Central Jakarta', label: 'Central Jakarta' },
        { value: 'East Jakarta', label: 'East Jakarta' },
        { value: 'West Jakarta', label: 'West Jakarta' },
        { value: 'North Jakarta', label: 'North Jakarta' },
    ],
    'West Java': [
        { value: 'Bandung', label: 'Bandung' },
        { value: 'Bekasi', label: 'Bekasi' },
        { value: 'Bogor', label: 'Bogor' },
        { value: 'Depok', label: 'Depok' },
    ],
    Bali: [{ value: 'Denpasar', label: 'Denpasar' }],
}

const SELECT_CX = [
    "rf-select",
    "[&_.ant-select-selector]:!py-8",
    "[&_.ant-select-selector]:!px-4",
    "[&_.ant-select-selector]:!h-auto",
    "[&_.ant-select-selector]:flex",
    "[&_.ant-select-selector]:items-center",
    "[&_.ant-select-selection-item]:leading-none",
    "[&_.ant-select-selection-placeholder]:leading-none",
    "[&_.ant-select-arrow]:!top-[calc(100%+7px)]",
    "[&_.ant-select-arrow]:!transform",
    "[&_.ant-select-arrow]:!-translate-y-1/2",
].join(" ")

export default function Step3({ onNext, setSubmitter }) {
    const dispatch = useDispatch()
    const app = useSelector(selectApp)
    const [form] = Form.useForm()

    useEffect(() => {
        setSubmitter?.(form.submit)
        return () => setSubmitter?.(null)
    }, [form, setSubmitter])

    const onFinish = (values) => {
        dispatch(upsert(values))
        onNext?.()
    }

    const onValuesChange = (changed) => {
        if ('country' in changed) {
            form.setFieldsValue({ state: undefined, city: undefined })
        } else if ('state' in changed) {
            form.setFieldsValue({ city: undefined })
        }
    }

    const states =
        STATES_BY_COUNTRY[form.getFieldValue('country') || app.country || 'ID'] ?? []
    const cities =
        CITIES_BY_STATE[form.getFieldValue('state') || app.state || 'Jakarta'] ?? []

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            requiredMark={false}
            className="[&_.ant-form-item-label>label]:font-medium [&_.ant-form-item]:last:!mb-0"
            initialValues={{
                country: app.country ?? 'ID',
                state: app.state ?? 'Jakarta',
                city: app.city ?? 'South Jakarta',
            }}
        >
            <div className="space-y-4">

                <Form.Item
                    label="Country"
                    name="country"
                    rules={[{ required: true, message: 'Please select your country' }]}
                >
                    <Select className={SELECT_CX} options={COUNTRIES} dropdownMatchSelectWidth />
                </Form.Item>

                <Form.Item
                    label="State"
                    name="state"
                    rules={[{ required: true, message: 'Please select your state' }]}
                >
                    <Select className={SELECT_CX} options={states} dropdownMatchSelectWidth />
                </Form.Item>

                <Form.Item
                    label="City"
                    name="city"
                    rules={[{ required: true, message: 'Please select your city' }]}
                >
                    <Select className={SELECT_CX} options={cities} dropdownMatchSelectWidth />
                </Form.Item>
            </div>
        </Form>
    )
}
