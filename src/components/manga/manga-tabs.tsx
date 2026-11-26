'use client'

import { useState } from 'react'
import MangaByTagPage from '@/components/views/manga-by-tag-page'
import Link from 'next/link'
import { Manga, DataResponse } from '@/codebase/api/paginate'

const demographics = [
  { key: 'shounen', label: 'Shounen' },
  { key: 'seinen', label: 'Seinen' },
  { key: 'shoujo', label: 'Shoujo' }
]

interface MangaTabsProps {
  initialShounenData?: DataResponse<Manga>
}

export default function MangaTabs({ initialShounenData }: MangaTabsProps) {
  const [activeTab, setActiveTab] = useState('shounen')

  return (
    <div className='w-full'>
      {/* Tabs header */}
      <div className='flex justify-center items-center gap-4 py-2'>
        <div className='bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-1 md:gap-2'>
          {demographics.map(demo => (
            <button
              key={demo.key}
              onClick={() => setActiveTab(demo.key)}
              className={`px-4 py-2 md:px-8 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.2em] transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === demo.key
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs content (instant switch without AnimatePresence wait delay) */}
      <div className='mt-8'>
        <MangaByTagPage
          limitManga={12}
          publicationDemographic={activeTab}
          pagination={false}
          initialData={activeTab === 'shounen' ? initialShounenData : undefined}
        />

        <div className='flex justify-center mt-12'>
          <Link
            href={`/demographics/${activeTab}?name=${demographics.find(d => d.key === activeTab)?.label}`}
            className='px-8 py-3.5 glass-card rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 hover:border-primary/30 transition-colors duration-200 cursor-pointer'
          >
            Xem tất cả {demographics.find(d => d.key === activeTab)?.label}
          </Link>
        </div>
      </div>
    </div>
  )
}
