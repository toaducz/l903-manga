'use client'

import MangaByTagPage from '@/components/views/manga-by-tag-page'
import { useParams, useSearchParams } from 'next/navigation'
import { FiGrid } from 'react-icons/fi'

export default function DemographicDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const name = searchParams.get('name') || ''

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-screen-2xl mx-auto px-4 md:px-12'>
        <div className='mb-12 space-y-6'>
          <div className='flex items-center gap-3 text-primary'>
            <FiGrid size={20} className='neon-glow' />
            <span className='text-[10px] font-black uppercase tracking-[0.4em]'>Đối Tượng Độc Giả</span>
          </div>
          <h1 className='text-5xl md:text-7xl font-display font-black text-white tracking-tight uppercase'>
            {name}
          </h1>
        </div>

        <div className='w-full'>
          <MangaByTagPage limitManga={24} publicationDemographic={id} pagination={true} />
        </div>
      </div>
    </div>
  )
}
