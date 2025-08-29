import { useMemo, useRef } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { Typography, Button, Space, Avatar } from 'antd'
import { useSelector } from 'react-redux'
import { selectApp } from '../../store'
import { getInitials } from '../../utils/name'
import logo from '../../assets/logo-blockforgex.png'

import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
import Step5 from './Step5'
import Step6 from './Step6'
import Step7 from './Step7'
import useIsDesktop from '../../hooks/useIsDesktop'


const { Text } = Typography

export default function StepPage({ total = 7 }) {
    const isDesktop = useIsDesktop()
    const { leftMeta } = useOutletContext() || {}


    const { fullName } = useSelector(selectApp)
    const initials = getInitials(fullName)

    const { step } = useParams()
    const n = Math.max(1, Math.min(Number(step) || 1, total))

    const navigate = useNavigate()
    const go = (k) => navigate(`/apply/step/${k}`)
    const next = () => go(Math.min(n + 1, total))
    const prev = () => go(Math.max(n - 1, 1))

    const progress = (n / total) * 100

    const submitRef = useRef(null)

    const handleContinue = () => {
        if (submitRef.current) {
            submitRef.current()
        } else {
            if (n < total) next()
        }
    }

    const body = useMemo(() => {
        const setSubmitter = (fn) => (submitRef.current = fn)
        switch (n) {
            case 1: return <Step1 onNext={next} setSubmitter={setSubmitter} />
            case 2: return <Step2 onNext={next} setSubmitter={setSubmitter} />
            case 3: return <Step3 onNext={next} setSubmitter={setSubmitter} />
            case 4: return <Step4 onNext={next} setSubmitter={setSubmitter} />
            case 5: return <Step5 onNext={next} setSubmitter={setSubmitter} />
            case 6: return <Step6 onNext={next} setSubmitter={setSubmitter} />
            case 7: return <Step7 setSubmitter={setSubmitter} />
            default: return <Step1 onNext={next} setSubmitter={setSubmitter} />
        }
    }, [n])

    return (
        <section className="min-h-[calc(100vh-80px)] flex flex-col">
            {!isDesktop && (
                <div className="flex items-center justify-between mb-8">
                    <img src={logo} alt="Blockforgex" className="h-11" />

                    {fullName && n > 1 && (
                        <div className="flex items-center gap-2">
                            <Avatar size={28} className="rf-avatar-initials">{initials}</Avatar>
                        </div>
                    )}
                </div>
            )}

            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <Text className="text-xl !font-medium leading-[1.4] tracking-[0.13em] text-center !text-[#4F46E5]">
                        STEP {n} OF {total}
                    </Text>

                    {fullName && n > 1 && isDesktop && (
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

            {leftMeta && !isDesktop && (
                <div className="lg:hidden mb-6">
                    <h2 className="text-xl !font-semibold">{leftMeta.title}</h2>
                    {!!leftMeta.desc && (
                        <p className="text-[#999999] text-sm mt-2">{leftMeta.desc}</p>
                    )}
                </div>
            )}

            <div className="flex-1 min-h-0">
                {body}
            </div>
            <div className="z-10 mt-auto bg-white pt-4">
                <div className="flex flex-col-reverse gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <Button
                        onClick={prev}
                        className={`${n <= 1 ? 'hidden lg:invisible' : ''} w-full lg:w-50 rf-btn-default`}
                    >
                        Back
                    </Button>

                    <Button
                        type="primary"
                        onClick={handleContinue}
                        className="w-full lg:w-50 rf-btn-primary"
                    >
                        {n < total ? 'Continue' : 'Submit'}
                    </Button>
                </div>
            </div>

        </section>
    )
}
