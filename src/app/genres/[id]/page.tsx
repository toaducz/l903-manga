'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MangaByTagPage from '@/components/views/manga-by-tag-page'
import { useParams, useSearchParams } from 'next/navigation'
import { FiGrid, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import { RecoilRoot } from 'recoil'

const demographics = [
  { key: 'shounen', label: 'Shounen' },
  { key: 'seinen', label: 'Seinen' },
  { key: 'shoujo', label: 'Shoujo' }
]

export default function GenreDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const name = searchParams.get('name') || 'Thể Loại'

  const [activeTab, setActiveTab] = useState('shounen')

  return (
    <RecoilRoot>
      <div className='min-h-screen bg-background pb-32'>
        <div className='max-w-screen-2xl mx-auto px-4 md:px-12'>
          <div className='mb-12 space-y-6'>
            <div className='flex items-center gap-3 text-primary'>
              <FiGrid size={20} className='neon-glow' />
              <span className='text-[10px] font-black uppercase tracking-[0.4em]'>Chi tiết thể loại</span>
            </div>
            <h1 className='text-5xl md:text-7xl font-display font-black text-white tracking-tight'>
              {name}
            </h1>
          </div>

          <div className='w-full'>
            {/* Tabs header */}
            <div className='flex justify-start items-center gap-4 py-2 mb-8'>
              <div className='bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md flex gap-1 md:gap-2'>
                {demographics.map(demo => (
                  <button
                    key={demo.key}
                    onClick={() => setActiveTab(demo.key)}
                    className={`px-4 py-2 md:px-8 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.2em] transition-all duration-500 cursor-pointer whitespace-nowrap ${
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

            {/* Tabs content with Framer Motion */}
            <div>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MangaByTagPage id={[id]} limitManga={24} publicationDemographic={activeTab} pagination={true} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </RecoilRoot>
  )
}
