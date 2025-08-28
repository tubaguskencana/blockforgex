import { useEffect, useState } from 'react'

export default function useIsDesktop() {
  const getMatch = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 1024px)').matches

  const [isDesktop, setIsDesktop] = useState(getMatch)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => setIsDesktop(e.matches)
    if (mq.addEventListener) mq.addEventListener('change', onChange)
    else mq.addListener(onChange)
    setIsDesktop(mq.matches)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange)
      else mq.removeListener(onChange)
    }
  }, [])

  return isDesktop
}
