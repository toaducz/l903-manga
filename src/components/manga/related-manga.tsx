import { useQueries } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { getMangaById } from '@/codebase/api/manga/get-manga-by-id'
import { Manga } from '@/codebase/api/paginate'
import MangaItems from './manga-items'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

type RelatedMangaProps = {
  ids: string[]
}

export default function RelatedManga({ ids }: RelatedMangaProps) {
  const pageSize = 10
  const [page, setPage] = useState(0)
  const [selectedRating, setSelectedRating] = useState<'all' | 'hide-pornographic'>('hide-pornographic')

  const totalPages = Math.ceil(ids.length / pageSize)

  const currentIds = useMemo(() => {
    return ids.slice(page * pageSize, (page + 1) * pageSize)
  }, [ids, page])

  const mangaQueries = useQueries({
    queries: currentIds.map(id => getMangaById({ id }))
  })

  const isLoading = mangaQueries.some(query => query.isLoading)
  const isError = mangaQueries.some(query => query.isError)

  const mangaList = mangaQueries.filter(query => query.data).map(query => query.data!.data as Manga)

  const displayedManga = mangaList.filter(manga => {
    if (!manga || !manga.attributes) return false
    if (selectedRating === 'all') return true
    return manga.attributes.contentRating !== 'pornographic'
  })

  if (currentIds.length === 0) {
    return (
      <div className='w-full py-20 flex flex-col items-center justify-center glass-card rounded-3xl border-dashed border-white/10'>
        <p className='text-gray-500 font-bold uppercase tracking-widest text-sm'>Không có kết quả</p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {/* Filters Bar */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/5'>
          {[
            { id: 'hide-pornographic', label: 'Mặc định' },
            { id: 'all', label: 'Tất cả (Cảnh báo quỷ)' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRating(r.id as 'all' | 'hide-pornographic')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                selectedRating === r.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode='wait'>
        {isLoading ? (
          <motion.div
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='aspect-[2/3] rounded-2xl bg-white/5 border border-white/5 animate-pulse' />
            ))}
          </motion.div>
        ) : isError ? (
          <div className='text-red-400 font-bold'>Lỗi.</div>
        ) : (
          <motion.div
            key='grid'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'
          >
            {displayedManga.length > 0 ? (
              displayedManga.map((manga, index) => (
                <motion.div
                  key={manga.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MangaItems manga={manga} isResponsive={false} />
                </motion.div>
              ))
            ) : (
              <div className='text-gray-400 text-center col-span-full py-20'>Không có kết quả.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-8 pt-8'>
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className='p-4 glass-card rounded-full text-white disabled:opacity-20 hover:bg-white/10 active:scale-90'
          >
            <FiChevronLeft size={24} />
          </button>

          <div className='flex items-center gap-4'>
            <span className='text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]'>PAGE</span>
            <span className='text-xl font-display font-black text-white'>{page + 1}</span>
            <span className='text-gray-700'>/</span>
            <span className='text-xl font-display font-black text-gray-500'>{totalPages}</span>
          </div>

          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            className='p-4 glass-card rounded-full text-white disabled:opacity-20 hover:bg-white/10 active:scale-90'
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  )
}
