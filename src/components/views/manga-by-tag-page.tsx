'use client'

import { getTopMangaByTagId } from '@/codebase/api/manga/get-top-manga-by-tag-id'
import { useQuery } from '@tanstack/react-query'
import MangaItems from '@/components/manga/manga-items'
import Pagination from '@/components/common/pagination'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import Error from '@/components/status/error'
import { Manga, DataResponse } from '@/codebase/api/paginate'

interface MangaByTagPageProps {
  id?: string[]
  publicationDemographic?: string
  pagination?: boolean
  limitManga?: number
  initialData?: DataResponse<Manga>
}

export function MangaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className='flex flex-col items-center justify-center p-4 w-full'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full max-w-screen-2xl'>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className='aspect-[2/3] w-full rounded-2xl bg-white/5 border border-white/5 animate-pulse relative overflow-hidden flex flex-col justify-end p-4 gap-2'
          >
            <div className='h-4 bg-white/10 rounded w-3/4' />
            <div className='h-3 bg-white/10 rounded w-1/2' />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MangaByTagPage({
  id,
  publicationDemographic,
  pagination = true,
  limitManga = 20,
  initialData
}: MangaByTagPageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const limit = limitManga ?? 20
  const offset = useMemo(() => parseInt(searchParams.get('offset') || '0', 10), [searchParams])
  const setOffset = (newOffset: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('offset', newOffset.toString())
    router.push(`?${params.toString()}`)
  }

  const queryOptions = getTopMangaByTagId({
    id: id,
    publicationDemographic: publicationDemographic,
    offset: offset,
    limit: limit
  })

  const {
    data: top,
    isLoading,
    isError
  } = useQuery({
    ...queryOptions,
    initialData: offset === 0 ? initialData : undefined // Only use initialData for page 1
  })

  if (isLoading) {
    return <MangaGridSkeleton count={limit} />
  }

  if (isError) {
    return <Error />
  }

  return (
    <div className='flex flex-col items-center justify-center p-4 w-full'>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full max-w-screen-2xl'>
        {top?.data?.map((manga, index) => (
          <MangaItems key={index} manga={manga} isResponsive={false} />
        ))}
      </div>
      {pagination && (
        <div className='w-full'>
          <Pagination
            total={top?.total || 0}
            offset={offset}
            limit={limit}
            onPageChange={newOffset => setOffset(newOffset)}
          />
        </div>
      )}
    </div>
  )
}
