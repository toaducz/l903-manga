'use client'

import { useQuery } from '@tanstack/react-query'
import { getChaptersByMangaId } from '@/codebase/api/manga/get-chapter'
import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Error from '../status/error'
import { getLanguageName } from '@/codebase/constants/enums'
import { formatDate } from '@/codebase/utils/format'
import Pagination from '../common/pagination'
import { motion } from 'framer-motion'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import Link from 'next/link'
import { saveReaderContext } from '@/codebase/utils/reader-context'

function ChapterListSkeleton() {
  return (
    <div className='space-y-4 w-full'>
      <div className='flex items-center justify-between gap-4'>
        <div className='w-40 h-8 bg-white/5 rounded-lg animate-pulse' />
        <div className='w-28 h-8 bg-white/5 rounded-lg animate-pulse' />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className='p-4 rounded-xl border border-white/5 bg-white/5 animate-pulse flex items-center justify-between h-16'
        >
          <div className='space-y-2 flex-1'>
            <div className='h-4 bg-white/10 rounded w-1/3' />
            <div className='h-3 bg-white/10 rounded w-1/4' />
          </div>
          <div className='w-20 h-3 bg-white/10 rounded' />
        </div>
      ))}
    </div>
  )
}

interface MangaChaptersListProps {
  mangaId: string
  offsetParams?: number
  chapterId?: string
  langFilterValue?: string[]
  langValue?: string
  order?: string
}

const MangaChaptersList: React.FC<MangaChaptersListProps> = ({
  mangaId,
  offsetParams,
  chapterId,
  langFilterValue,
  langValue,
  order
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const limit = 20
  const [localOffset, setLocalOffset] = useState<number>(() => {
    if (offsetParams !== undefined && offsetParams !== null) return offsetParams
    return parseInt(searchParams.get('offset') || '0', 10)
  })

  useEffect(() => {
    if (offsetParams !== undefined && offsetParams !== null) {
      setLocalOffset(offsetParams)
    }
  }, [offsetParams])

  const [sortOrder, setSortOrder] = useState(order ?? 'desc')
  const [lang, setLang] = useState<string>(langValue ?? 'all')
  const [langFilter, setLangFilter] = useState(langFilterValue ?? ['vi', 'en', 'ja'])

  const {
    data: chapter,
    isLoading,
    isError
  } = useQuery(getChaptersByMangaId({ id: mangaId, limit, offset: localOffset, order: sortOrder, lang: langFilter }))

  const handleLangChange = (selected: string) => {
    setLang(selected)
    if (selected === 'all') {
      setLangFilter(['vi', 'en', 'ja'])
    } else {
      setLangFilter([selected])
    }
    setOffset(0)
  }

  const setOffset = (newOffset: number) => {
    setLocalOffset(newOffset)
  }

  if (isLoading) return <ChapterListSkeleton />
  if (isError || !chapter) return <Error />

  return (
    <div className='space-y-6'>
      {/* Controls Bar */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <div className='flex bg-white/5 p-1 rounded-lg border border-white/5'>
            {['all', 'vi', 'en'].map(l => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${lang === l
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                {l === 'all' ? 'TẤT CẢ' : l}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className='flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white transition-colors cursor-pointer'
        >
          {sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
          {sortOrder === 'asc' ? 'TĂNG DẦN' : 'GIẢM DẦN'}
        </button>
      </div>

      <Pagination
        total={chapter?.total || 0}
        offset={localOffset}
        limit={limit}
        onPageChange={newOffset => setOffset(newOffset)}
      />

      {/* Chapters Grid/List */}
      <div className='grid gap-3'>
        {chapter.total === 0 ? (
          <div className='text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10'>
            <p className='text-gray-400 font-bold'>Không tìm thấy bản dịch cho ngôn ngữ này. Có thể là không có nhà dịch, hoặc là...?</p>
            <Link href={`/homepage`} className='block pt-3 cursor-pointer'>
              <p className='italic text-sm text-gray-500 font-bold hover:text-primary transition-all'>Tại sao chuyện này xảy ra?</p>
            </Link>
          </div>
        ) : (
          chapter.data.map((item, index) => {
            const isActive = item.id === chapterId
            return (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                key={item.id}
                onClick={() => {
                  saveReaderContext({
                    mangaId,
                    offset: localOffset,
                    langFilterValue: langFilter,
                    langValue: lang,
                    order: sortOrder
                  })
                  router.push(`/reader/${item.id}`)
                }}
                className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${isActive
                  ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/40'
                  : 'glass-card border-white/5 hover:border-primary/40 hover:bg-white/10'
                  }`}
              >
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-1'>
                      <span className={`text-sm font-black tracking-tight ${isActive ? 'text-primary' : 'text-white'}`}>
                        CHƯƠNG {item.attributes.chapter ?? 'Oneshot'}
                      </span>
                      {isActive && <span className='w-1.5 h-1.5 rounded-full bg-primary neon-glow animate-pulse' />}
                    </div>
                    <p className='text-xs text-gray-400 font-medium line-clamp-1'>
                      {item.attributes.title || 'Chưa có tiêu đề'}
                    </p>
                  </div>

                  <div className='text-right hidden sm:block'>
                    <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1'>
                      {formatDate(item.attributes.updatedAt)}
                    </p>
                    <p className='text-[10px] font-black text-primary uppercase tracking-widest opacity-80'>
                      {getLanguageName(item.attributes.translatedLanguage)}
                    </p>
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-1/2 bg-primary transition-all rounded-r-full' />
              </motion.div>
            )
          })
        )}
      </div>

      <Pagination
        total={chapter?.total || 0}
        offset={localOffset}
        limit={limit}
        onPageChange={newOffset => setOffset(newOffset)}
      />
    </div>
  )
}

export default MangaChaptersList
