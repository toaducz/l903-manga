'use client'

import { useEffect, useState, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { getRandom } from '@/codebase/api/manga/get-random'
import MangaDetailPage from '@/components/views/manga-detail-page'
import Loading from '@/components/status/loading'
import Error from '@/components/status/error'

function RandomPageContent() {
  const searchParams = useSearchParams()
  const timestamp = searchParams.get('t')

  const [isVisible, setIsVisible] = useState(false)

  const { data: manga, isFetching, isSuccess, isError } = useQuery(getRandom({ random: timestamp! }))

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setIsVisible(true), 10)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  if (isFetching) return <Loading />
  if (isError) return <Error />
  if (!manga?.data) return <p className='text-center text-red-500 mt-8'>Không tìm thấy manga</p>

  return (
    <div
      className={`transition-all duration-500 ease-in-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2'
      }`}
    >
      <MangaDetailPage manga={manga.data} />
    </div>
  )
}

export default function MangaRandomPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RandomPageContent />
    </Suspense>
  )
}
