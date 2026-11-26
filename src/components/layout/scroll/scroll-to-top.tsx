'use client'

import { useState, useEffect } from 'react'

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 200
      setVisible(prev => (prev === next ? prev : next))
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label='Cuộn lên đầu trang'
      className={`w-13 fixed bottom-20 right-6 z-50 p-3 bg-slate-800 hover:bg-slate-600 text-white rounded-full shadow-lg transition-colors duration-200 cursor-pointer ${
        visible ? 'opacity-100' : 'opacity-30'
      }`}
    >
      ↑
    </button>
  )
}

export default ScrollToTopButton
