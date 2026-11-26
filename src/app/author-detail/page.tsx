'use client'

import { Suspense, useEffect, useState } from 'react'
import AuthorDetailPage from '@/components/views/author-detail-page'
import { Author } from '@/codebase/api/paginate'
import Loading from '@/components/status/loading'

export default function AuthorDetailPageWrapper() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthorDetailContent />
    </Suspense>
  )
}

function AuthorDetailContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [author, setAuthor] = useState<Author | null>(null)

  useEffect(() => {
    const storedAuthor = localStorage.getItem('authorDetail')
    if (storedAuthor) {
      setAuthor(JSON.parse(storedAuthor))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10)
    return () => clearTimeout(timer)
  }, [])

  if (!author) {
    return <p className='text-center text-red-500 mt-8'>Không tìm thấy tác giả</p>
  }

  return (
    <div
      className={`transition-all duration-500 ease-in-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2'
      }`}
    >
      <AuthorDetailPage author={author} />
    </div>
  )
}
