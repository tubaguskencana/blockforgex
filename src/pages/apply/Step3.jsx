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
  Bali: [
    { value: 'Denpasar', label: 'Denpasar' },
  ],
}

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

  // reset berantai saat parent berubah
  const onValuesChange = (changed, all) => {
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
      className="[&_.ant-form-item-label>label]:font-medium"
      initialValues={{
        country: app.country ?? 'ID',
        state: app.state ?? 'Jakarta',
        city: app.city ?? 'South Jakarta',
      }}
    >
      <Form.Item
        label="Country"
        name="country"
        rules={[{ required: true, message: 'Please select your country' }]}
      >
        <Select
          className="rf-select !py-2 !px-4"
          options={COUNTRIES}
          dropdownMatchSelectWidth
        />
      </Form.Item>

      <Form.Item
        label="State"
        name="state"
        rules={[{ required: true, message: 'Please select your state' }]}
      >
        <Select
          className="rf-select"
          options={states}
          dropdownMatchSelectWidth
        />
      </Form.Item>

      <Form.Item
        label="City"
        name="city"
        rules={[{ required: true, message: 'Please select your city' }]}
      >
        <Select
          className="rf-select"
          options={cities}
          dropdownMatchSelectWidth
        />
      </Form.Item>
    </Form>
  )
}
