'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AutoRedirectNotice() {
  const router = useRouter()
  const [seconds, setSeconds] = useState(5)
  const [cancelled, setCancelled] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (cancelled) return

    const countdown = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(countdown)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    timerRef.current = setTimeout(() => {
      router.replace('/')
    }, 5000)

    return () => {
      clearInterval(countdown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [cancelled, router])

  return (
    !cancelled && (
      <div className='mt-4 text-sm italic text-gray-400 '>
        Chuyển hướng tới trang chính trong {seconds} giây...{' '}
        <button onClick={() => setCancelled(true)} className='underline text-white ml-2 cursor-pointer'>
          Hủy
        </button>
      </div>
    )
  )
}
