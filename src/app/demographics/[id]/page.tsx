'use client'

import { motion, AnimatePresence } from 'framer-motion'
import MangaByTagPage from '@/components/views/manga-by-tag-page'
import { useParams, useSearchParams } from 'next/navigation'
import { FiGrid } from 'react-icons/fi'
// import Link from 'next/link'
import { RecoilRoot } from 'recoil'

export default function DemographicDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const name = searchParams.get('name') || ''

  return (
    <RecoilRoot>
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
            {/* Tabs content with Framer Motion */}
            <div>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MangaByTagPage limitManga={24} publicationDemographic={id} pagination={true} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </RecoilRoot>
  )
}
