'use client'

import { useSyncExternalStore } from 'react'
import { Manga } from '@/codebase/api/paginate'
import MangaDetailPage from '@/components/views/manga-detail-page'
import MangaDetailMobile from '@/app/manga-detail/components/manga-detail-mobile'
import Loading from '@/components/status/loading'

interface MangaDetailResponsiveProps {
  manga: Manga
}

const subscribe = (callback: () => void) => {
  const mediaQuery = window.matchMedia('(min-width: 768px)')
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

const getSnapshot = () => window.matchMedia('(min-width: 768px)').matches
const getServerSnapshot = () => null

/**
 * Mounts only Desktop or Mobile detail view based on viewport width,
 * avoiding duplicate API requests and doubled DOM nodes.
 */
export default function MangaDetailResponsive({ manga }: MangaDetailResponsiveProps) {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (isDesktop === null) {
    return (
      <div className='min-h-screen bg-black'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='bg-black'>
      {isDesktop ? <MangaDetailPage manga={manga} /> : <MangaDetailMobile manga={manga} />}
    </div>
  )
}
