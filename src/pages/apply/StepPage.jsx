import { useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Typography, Button, Space, Avatar } from 'antd'
import { useSelector } from 'react-redux'
import { selectApp } from '../../store'
import { getInitials } from '../../utils/name'

import Step1 from './Step1'
import Step2 from './Step2'
import Step7 from './Step7'
import Step3 from './Step3'

const { Text } = Typography

export default function StepPage({ total = 7 }) {
    const { fullName } = useSelector(selectApp)
    const initials = getInitials(fullName)

    const { step } = useParams()
    const n = Math.max(1, Math.min(Number(step) || 1, total))
    const navigate = useNavigate()
    const go = (k) => navigate(`/apply/step/${k}`)
    const next = () => go(Math.min(n + 1, total))
    const prev = () => go(Math.max(n - 1, 1))

    // progress termasuk step 1
    const progress = (n / total) * 100

    // tempat menyimpan fungsi submit dari anak (form)
    const submitRef = useRef(null)

    const handleContinue = () => {
        // kalau anak mendaftarkan submit, pakai itu agar validasi jalan
        if (submitRef.current) {
            submitRef.current() // ini memicu onFinish / onFinishFailed di anak
        } else {
            if (n < total) next()
        }
    }

    const body = useMemo(() => {
        // pass setter agar anak bisa mendaftarkan submit()
        switch (n) {
            case 1: return <Step1 onNext={next} setSubmitter={(fn) => (submitRef.current = fn)} />
            case 2: return <Step2 onNext={next} setSubmitter={(fn) => (submitRef.current = fn)} />
            case 3: return <Step3 onNext={next} setSubmitter={(fn) => (submitRef.current = fn)} />
            case 7: return <Step7 setSubmitter={(fn) => (submitRef.current = fn)} />
            default: return <Step1 onNext={next} setSubmitter={(fn) => (submitRef.current = fn)} />
        }
    }, [n])

    return (
        <section className="min-h-[calc(90vh-80px)] flex flex-col">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <Text className="text-xl font-medium leading-[1.4] tracking-[0.13em] text-center">
                        STEP {n} OF {total}
                    </Text>

                    {fullName && n > 1 && (
                        <div className="flex items-center gap-2">
                            <Avatar size={28} className="rf-avatar-initials">{initials}</Avatar>
                            <Text className="text-gray-600">{fullName}</Text>
                        </div>
                    )}
                </div>

                <div className="mt-3 h-0.5 w-full bg-gray-200 rounded">
                    <div className="h-0.5 bg-indigo-600 rounded" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="flex-1">
                {body}
            </div>

            <div className="z-10 mt-8 bg-white pt-4">
                <div className="flex items-center justify-between">
                    <Button
                        onClick={prev}
                        className={`rf-btn-default ${n <= 1 ? 'invisible' : ''}`}
                    >
                        Back
                    </Button>

                    <Space align="center">
                        <Button
                            type="primary"
                            onClick={handleContinue}
                            className="rf-btn-primary"
                        >
                            {n < total ? 'Continue' : 'Submit'}
                        </Button>
                    </Space>
                </div>
            </div>
        </section>
    )
}
