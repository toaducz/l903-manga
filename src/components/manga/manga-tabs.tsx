'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MangaByTagPage from '@/components/views/manga-by-tag-page'

const demographics = [
  { key: 'shounen', label: 'Shounen' },
  { key: 'seinen', label: 'Seinen' },
  { key: 'shoujo', label: 'Shoujo' }
]

export default function MangaTabs() {
  const [activeTab, setActiveTab] = useState('shounen')

  return (
    <div className='w-full'>
      {/* Tabs header */}
      <div className='flex justify-center items-center gap-4 py-2'>
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
      <div className='mt-8'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <MangaByTagPage limitManga={12} publicationDemographic={activeTab} pagination={true} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
