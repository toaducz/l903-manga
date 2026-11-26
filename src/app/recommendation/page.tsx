'use client'

import { Suspense } from 'react'
import RecommendationContentPage from '@/components/views/recommendation-page'
import Loading from '@/components/status/loading'

// Bọc phần tử cần sử dụng useSearchParams() bằng Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RecommendationContent />
    </Suspense>
  )
}

function RecommendationContent() {
  return <RecommendationContentPage />
}
