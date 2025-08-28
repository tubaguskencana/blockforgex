import { Form, Radio } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { upsert } from '../../store/appSlice'
import { selectApp } from '../../store'
import { useEffect } from 'react'
import { InboxOutlined, ApartmentOutlined, ClockCircleOutlined, HourglassOutlined } from '@ant-design/icons' // contoh ikon
import { Task01Icon } from 'hugeicons-react'
import { CheckListIcon } from 'hugeicons-react'

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
                <Radio.Group className="w-full">
                    <div className="grid gap-4">
                        {/* Individual */}
                        <Radio value="fulltime" className="rf-choice group w-full">
                            <div
                                className="
            relative w-full rounded-xl border border-[#E6E6E6] bg-white p-4
            group-[.ant-radio-wrapper-checked]:border-[#4F46E5]
            group-[.ant-radio-wrapper-checked]:bg-[#F9F9FD]
            group-[.ant-radio-wrapper-checked]:shadow-[inset_0_0_0_2px_rgba(79,70,229,0.20)]
          "
                            >
                                <div className="flex items-start gap-3">
                                    {/* ICON KIRI */}
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E6E6E6] bg-[#F4F4FB]">
                                        {/* ganti ikonmu sendiri */}
                                        <ClockCircleOutlined />
                                    </div>

                                    {/* TEKS TENGAH */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-[#4F46E5] leading-[1.2]">
                                                Fulltime
                                            </div>
                                        </div>
                                        <p className="mt-1 text-gray-500">
                                            40 hours per week.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Radio>

                        {/* Company */}
                        <Radio value="parttime" className="rf-choice group w-full">
                            <div
                                className="
            relative w-full rounded-xl border border-[#E6E6E6] bg-white p-4
            group-[.ant-radio-wrapper-checked]:border-[#4F46E5]
            group-[.ant-radio-wrapper-checked]:bg-[#F9F9FD]
            group-[.ant-radio-wrapper-checked]:shadow-[inset_0_0_0_2px_rgba(79,70,229,0.20)]
          "
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E6E6E6] bg-[#F4F4FB]">
                                        <HourglassOutlined />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-[#4F46E5] leading-[1.2]">
                                                Part-time
                                            </div>
                                        </div>
                                        <p className="mt-1 text-gray-500">
                                            20-30 hours per week.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Radio>
                        <Radio value="asneeded" className="rf-choice group w-full">
                            <div
                                className="
            relative w-full rounded-xl border border-[#E6E6E6] bg-white p-4
            group-[.ant-radio-wrapper-checked]:border-[#4F46E5]
            group-[.ant-radio-wrapper-checked]:bg-[#F9F9FD]
            group-[.ant-radio-wrapper-checked]:shadow-[inset_0_0_0_2px_rgba(79,70,229,0.20)]
          "
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E6E6E6] bg-[#F4F4FB]">
                                        <CheckListIcon />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold text-[#4F46E5] leading-[1.2]">
                                                As Needed
                                            </div>
                                        </div>
                                        <p className="mt-1 text-gray-500">
                                            Flexible hours, on my own time.
                                        </p>
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
