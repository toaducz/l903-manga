'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getMangaById } from '@/codebase/api/manga/get-manga-by-id'
import MangaDetailPage from '@/components/views/manga-detail-page'
import MangaDetailMobile from '@/app/manga-detail/components/manga-detail-mobile'
import Loading from '@/components/status/Loading'
import Error from '@/components/status/error'

export default function MangaDetailPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <MangaDetailContent />
    </Suspense>
  )
}

function MangaDetailContent() {
  const params = useParams()
  const id = params.id as string

  const { data: manga, isFetching, isError } = useQuery(getMangaById({ id }))

  if (isFetching) return <Loading />

  if (isError) return <Error />

  if (!manga?.data) {
    return <Error message='Không tìm thấy truyện' />
  }

  return (
    <div className="bg-black">
      <div className="hidden md:block">
        <MangaDetailPage manga={manga.data} />
      </div>
      <div className="block md:hidden">
        <MangaDetailMobile manga={manga.data} />
      </div>
    </div>
  )
}
