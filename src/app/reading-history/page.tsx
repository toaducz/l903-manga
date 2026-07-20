'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Chapter } from '@/codebase/api/manga/get-chapter'
import { FaBookOpen, FaTrash } from 'react-icons/fa'
import { ImageWithLoading } from '@/components/image/image-with-loading'
import { getCover } from '@/codebase/api/cover/get-covers'
import Loading from '@/components/status/Loading'
import ScrollToBottomButton from '@/components/layout/scroll/scroll-to-bottom'

type ReadingItem = {
  mangaId: string
  chapterId: string
  chapter: Chapter[]
  title: string
  number: string
  lang: string
  updatedAt: number
}

export default function ReadingHistoryPage() {
  const [history, setHistory] = useState<ReadingItem[]>([])

  useEffect(() => {
    const getReadingHistory = (): ReadingItem[] => {
      if (typeof window === 'undefined') return []

      const current = localStorage.getItem('reading_history')
      if (!current) return []

      try {
        return JSON.parse(current)
      } catch {
        return []
      }
    }

    const data = getReadingHistory()
    setHistory(data)
  }, [])

  const handleClearHistory = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('reading_history')
    setHistory([])
  }

  if (history.length === 0) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6'>
        <FaBookOpen className='text-6xl mb-4 opacity-70' />
        <h1 className='text-3xl font-bold mb-4 text-center'>Chưa có lịch sử đọc truyện</h1>
        <p className='text-lg text-gray-300 mb-6 text-center'>Bắt đầu đọc ngay để lưu lại những chương yêu thích!</p>
        <Link
          href='/'
          className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50'
        >
          Quay về trang chủ
        </Link>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 pt-24 pb-12'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold mb-8 text-center'>Lịch sử đọc truyện</h1>
        <div className='scale-100'>
          <div className='grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]'>
            {history.map((item, index) => (
              <HistoryItem item={item} key={index} />
            ))}
          </div>
        </div>
        <div className='mt-12 flex justify-center'>
          <button
            onClick={handleClearHistory}
            className='flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50'
            aria-label='Xóa lịch sử đọc truyện'
          >
            <FaTrash />
            Xóa lịch sử đọc truyện
          </button>
        </div>
      </div>
      <ScrollToBottomButton />
    </div>
  )
}

type HistoryItemProps = {
  item: ReadingItem
}

function HistoryItem({ item }: HistoryItemProps) {
  const { data: covers, isLoading } = useQuery(getCover({ id: item.mangaId, limit: 1 }))

  const filename = covers?.data[0].attributes.fileName
  const coverImageUrl = filename
    ? `/api/image?url=${encodeURIComponent(`https://uploads.mangadex.org/covers/${item.mangaId}/${filename}.256.jpg`)}`
    : '/no-image.jpg'

  // console.log(coverImageUrl)

  if (isLoading) {
    ;<Loading />
  }

  return (
    <Link
      href={`/reader/${item.chapterId}?mangaId=${item.mangaId}&chapterId=${item.chapterId}&chapter=${encodeURIComponent(
        JSON.stringify(item.chapter)
      )}&number=${item.number}&lang=${item.lang}`}
      className='
        w-full mx-auto group bg-white/10 backdrop-blur-md shadow-lg 
        hover:shadow-xl hover:bg-white/20 transition-all duration-300 
        md:max-w-[300px] md:rounded-xl md:p-6 md:transform md:hover:scale-105 md:scale-100
        flex items-center p-3 rounded-lg mb-3 
        md:block
      '
    >
      <div
        className='
          overflow-hidden rounded-md
          w-24 h-24 flex-shrink-0
          md:w-full md:h-full md:max-h-[18rem]
        '
      >
        <ImageWithLoading src={coverImageUrl} alt={item.title + ' cover'} className='w-full h-full object-cover' />
      </div>
      <div className='ml-4 flex-1 md:ml-0 md:space-y-3 md:pt-3'>
        <div className='md:h-13'>
          <h3 className='font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 text-base md:text-xl'>
            {item.title}
          </h3>
        </div>
        <div className='text-sm text-gray-300 mt-1 md:text-base md:mt-0'>
          <p className='text-gray-300'>Chapter: {item.number}</p>
          <p className='text-gray-300'>Ngôn ngữ: {item.lang.toUpperCase()}</p>
          <p className='text-gray-400 text-xs mt-1 md:text-sm'>
            Đọc lần cuối: {new Date(item.updatedAt).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>
    </Link>
  )
}
