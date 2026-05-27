'use client'

import { Chapter } from '@/codebase/api/manga/get-chapter'
import { getLanguageName } from '@/codebase/constants/enums'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { getChaptersByMangaId } from '@/codebase/api/manga/get-chapter'
import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface ChapterNavButtonProps {
  chapter: Chapter | null
  direction: 'prev' | 'next'
  mangaId: string
  offset: string
  langFilterValue: string | string[]
  langValue: string
  order: string
  limit: number
  total: number
  variant?: 'default' | 'minimal'
}

const ChapterNavButton = ({
  chapter,
  direction,
  mangaId,
  offset,
  langFilterValue,
  langValue,
  order,
  limit,
  total,
  variant = 'default'
}: ChapterNavButtonProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [hasMoreChapters, setHasMoreChapters] = useState(true)

  // Kiểm tra xem có chapter mới cho offset tiếp theo/trước đó
  useEffect(() => {
    const checkChapters = async () => {
      const isAsc = order === 'asc'
      const newOffset = isAsc
        ? (direction === 'next' ? Number(offset) + limit : Number(offset) - limit)
        : (direction === 'next' ? Number(offset) - limit : Number(offset) + limit)

      if (newOffset < 0 || newOffset >= total) {
        setHasMoreChapters(false)
        return
      }

      try {
        const chaptersData = await queryClient.fetchQuery(
          getChaptersByMangaId({
            id: mangaId,
            offset: newOffset,
            limit,
            order,
            lang: Array.isArray(langFilterValue) ? langFilterValue : [langFilterValue]
          })
        )
        setHasMoreChapters(!!chaptersData?.data?.length)
      } catch (error) {
        console.error('Error checking chapters:', error)
        setHasMoreChapters(false)
      }
    }

    if (!chapter) {
      checkChapters()
    }
  }, [chapter, direction, mangaId, offset, limit, total, langFilterValue, order, queryClient])

  // Kiểm tra điều kiện vô hiệu hóa nút
  const isAsc = order === 'asc'
  const isDisabled = !chapter && (isAsc
    ? (direction === 'next' && (!hasMoreChapters || Number(offset) >= total)) ||
      (direction === 'prev' && (!hasMoreChapters || Number(offset) <= 0))
    : (direction === 'next' && (!hasMoreChapters || Number(offset) <= 0)) ||
      (direction === 'prev' && (!hasMoreChapters || Number(offset) >= total)))

  // const isNextDisabled = !hasMoreChapters || Number(offset) >= total
  // const isPrevDisabled = Number(offset) <= 0

  // console.log('Offset:', offset)
  // // console.log('Total Chapters:', total);
  // console.log('Has More Chapters:', hasMoreChapters)
  // console.log('Is Next Disabled:', isNextDisabled)
  // console.log('Is Prev Disabled:', isPrevDisabled)

  const handleClick = async () => {
    if (!chapter) {
      const isAsc = order === 'asc'
      // Nếu không có chapter, tăng/giảm offset và lấy danh sách chapter mới
      if (direction === 'next' && (isAsc ? Number(offset) < total : Number(offset) > 0) && hasMoreChapters) {
        const newOffset = isAsc ? Number(offset) + limit : Number(offset) - limit
        try {
          const chaptersData = await queryClient.fetchQuery(
            getChaptersByMangaId({
              id: mangaId,
              offset: newOffset,
              limit,
              order,
              lang: Array.isArray(langFilterValue) ? langFilterValue : [langFilterValue]
            })
          )

          if (chaptersData?.data?.length) {
            // Chọn chapter đầu tiên (hoặc cuối cùng nếu order là desc)
            const selectedChapter =
              order === 'asc' ? chaptersData.data[0] : chaptersData.data[chaptersData.data.length - 1]
            router.push(
              `/reader/${selectedChapter.id}?mangaId=${mangaId}&offset=${newOffset}&chapterId=${selectedChapter.id}&number=${selectedChapter.attributes.chapter}&lang=${getLanguageName(selectedChapter.attributes.translatedLanguage)}&langFilter=${langFilterValue}&langValue=${langValue}&order=${order}`,
              { scroll: false }
            )
          }
        } catch (error) {
          console.error('Error fetching chapters:', error)
        }
      } else if (direction === 'prev' && (isAsc ? Number(offset) > 0 : Number(offset) < total) && hasMoreChapters) {
        const newOffset = isAsc ? Number(offset) - limit : Number(offset) + limit
        try {
          const chaptersData = await queryClient.fetchQuery(
            getChaptersByMangaId({
              id: mangaId,
              offset: newOffset,
              limit,
              order,
              lang: Array.isArray(langFilterValue) ? langFilterValue : [langFilterValue]
            })
          )

          if (chaptersData?.data?.length) {
            const selectedChapter =
              order === 'asc' ? chaptersData.data[chaptersData.data.length - 1] : chaptersData.data[0]
            router.push(
              `/reader/${selectedChapter.id}?mangaId=${mangaId}&offset=${newOffset}&chapterId=${selectedChapter.id}&number=${selectedChapter.attributes.chapter}&lang=${getLanguageName(selectedChapter.attributes.translatedLanguage)}&langFilter=${langFilterValue}&langValue=${langValue}&order=${order}`,
              { scroll: false }
            )
          }
        } catch (error) {
          console.error('Error fetching chapters:', error)
        }
      }
      return
    }

    // Nếu có chapter, chuyển đến chapter trước/sau
    router.push(
      `/reader/${chapter.id}?mangaId=${mangaId}&offset=${offset}&chapterId=${chapter.id}&number=${chapter.attributes.chapter}&lang=${getLanguageName(chapter.attributes.translatedLanguage)}&langFilter=${langFilterValue}&langValue=${langValue}&order=${order}`,
      { scroll: false }
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`p-2 rounded-lg transition-all duration-300 border cursor-pointer ${
          isDisabled
            ? 'bg-transparent border-white/5 text-gray-700 cursor-not-allowed opacity-30'
            : 'bg-white/5 border-white/10 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary hover:neon-glow active:scale-90'
        }`}
        title={direction === 'prev' ? 'Chương Trước' : 'Chương Tiếp'}
      >
        {direction === 'prev' ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`flex items-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 shadow-2xl border cursor-pointer group ${
        isDisabled
          ? 'bg-white/5 border-white/5 text-gray-600 cursor-not-allowed opacity-50'
          : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:neon-glow active:scale-95'
      }`}
    >
      {direction === 'prev' && (
        <FiChevronLeft size={18} className='group-hover:-translate-x-1 transition-transform' />
      )}
      {direction === 'prev' ? 'Chương Trước' : 'Chương Tiếp'}
      {direction === 'next' && (
        <FiChevronRight size={18} className='group-hover:translate-x-1 transition-transform' />
      )}
    </button>
  )
}

export default ChapterNavButton
