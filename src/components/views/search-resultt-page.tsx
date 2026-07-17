'use client'

import { searchManga } from '@/codebase/api/manga/search-manga'
import Loading from '@/components/status/Loading'
import { useQuery } from '@tanstack/react-query'
import MangaItems from '@/components/manga/manga-items'
import Pagination from '@/components/common/pagination'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import Error from '@/components/status/error'

interface SearchProps {
  title: string
}

export default function SearchResultPage({ title }: SearchProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const limit = 18
  const offset = useMemo(() => parseInt(searchParams.get('offset') || '0', 10), [searchParams])
  const setOffset = (newOffset: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('offset', newOffset.toString())
    router.push(`?${params.toString()}`)
  }
  const { data: result, isLoading, isError } = useQuery(searchManga({ title: title, offset: offset, limit: limit }))

  // console.log(result?.data)
  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  if (result?.data.length === 0) {
    const mess = 'Kết quả tìm kiếm cho:' + title + ' là không có'
    return (
      <div>
        <Error message={mess} />
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-black'>
      <div className='pt-20'>
        <h2 className='text-2xl font-semibold text-gray-100 mb-6'>Kết quả tìm kiếm cho: {title}</h2>
      </div>
      <div className='w-full max-w-screen-2xl mx-auto'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full p-4'>
          {result?.data?.map((manga, index) => (
            <MangaItems key={index} manga={manga} isResponsive={false} />
          ))}
        </div>
      </div>
      <div>
        {/* Danh sách manga render ở đây */}

        <Pagination
          total={result?.total || 0}
          offset={offset}
          limit={limit}
          onPageChange={newOffset => setOffset(newOffset)}
        />
      </div>
    </div>
  )
}
