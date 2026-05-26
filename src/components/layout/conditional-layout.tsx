'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import ScrollToTop from '@/components/layout/scroll/scroll-to-top'
import Footer from '@/components/layout/footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isReaderPage = pathname.startsWith('/reader/')
  const isDetailPage = pathname.startsWith('/manga-detail/')
  const isSelfHostPage = pathname === '/self-host'

  if (isSelfHostPage) {
    return <main className='min-h-screen bg-background'>{children}</main>
  }

  const isLandingPage = pathname === '/homepage' || pathname === '/login'
  const hideNavbar = isReaderPage || isDetailPage || isLandingPage

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className={`min-h-screen bg-background ${!hideNavbar ? 'pt-20 md:pt-24' : ''}`}>{children}</main>
      <ScrollToTop />
      {!hideNavbar && <Footer />}
    </>
  )
}
