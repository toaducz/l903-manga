'use client'

import { useEffect, useState, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTopMangaByTagId } from '@/codebase/api/manga/get-top-manga-by-tag-id'
import MangaByTagPage from '@/components/views/manga-by-tag-page'
import Loading from '@/components/status/loading'
import Error from '@/components/status/error'
import TagMultiSelect from '@/components/common/tag-multi-select'
import { useParams } from 'next/navigation'

function MangaPageContent() {
  const params = useParams()
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const id = params.id ? decodeURIComponent(params.id as string) : ''
  // console.log("params id", id)
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    if (id) {
      const idArray = Array.isArray(id) ? id : id.split(',')
      setIds(idArray)
    }
  }, [id])

  // console.log("ids", ids)

  const {
    data: manga,
    isFetching,
    isError,
    isSuccess
  } = useQuery(getTopMangaByTagId({ id: ids, offset: 0, limit: 20 }))

  useEffect(() => {
    setSelectedTags(ids)
    // console.log('id', ids)
  }, [ids])

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
    <div>
      <div className='pt-30 md:pt-25'>
        <TagMultiSelect setTag={setSelectedTags} selectedTags={selectedTags} />
      </div>
      <div
        className={` flex justify-center items-center transition-all duration-500 ease-in-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2'
        }`}
      >
        <MangaByTagPage id={selectedTags} />
      </div>
    </div>
  )
}

export default function MangaRandomPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MangaPageContent />
    </Suspense>
  )
}
