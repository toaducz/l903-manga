'use client'

import { useEffect, useRef } from 'react'

/**
 * Displays chapter reading progress using GPU-composited scaleX without re-rendering parent ReaderContent.
 */
export default function ReaderScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false

    const updateProgress = () => {
      if (!barRef.current) return
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const ratio = totalHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / totalHeight)) : 0
      barRef.current.style.transform = `scaleX(${ratio})`
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        updateProgress()
        ticking = false
      })
    }

    updateProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='fixed top-0 left-0 w-full h-1 z-[100] bg-white/5 pointer-events-none'>
      <div
        ref={barRef}
        className='h-full w-full bg-primary neon-glow origin-left'
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  )
}
