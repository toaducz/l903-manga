'use client'

import React from 'react'
import MangaItems from '../manga/manga-items'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { useQuery } from '@tanstack/react-query'
import Loading from '../status/Loading'
import Error from '../status/error'
import { getTopMangaByTagId } from '@/codebase/api/manga/get-top-manga-by-tag-id'
import { useRouter } from 'next/navigation'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// import { motion } from 'framer-motion'

interface Props {
  id?: string[]
  publicationDemographic?: string
}

const SlideMangaCard: React.FC<Props> = ({ id, publicationDemographic }) => {
  const router = useRouter()
  const {
    data: newManga,
    isLoading,
    isError
  } = useQuery(getTopMangaByTagId({ id: id, offset: 0, limit: 10, publicationDemographic: publicationDemographic }))

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault()

    router.push(`/manga-page/${id}`)
  }

  // console.log('newManga', newManga)

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error />
  }

  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={'auto'}
        spaceBetween={16}
        navigation
        // pagination={{ clickable: true }}
        className='pb-4 pt-25'
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        style={{ display: 'flex', justifyContent: 'center' }}
      // breakpoints={{
      //   0: {
      //     slidesPerView: 1,
      //   },
      //   768: {
      //     slidesPerView: 'auto',
      //   },
      // }}
      >
        {newManga?.data.map(manga => (
          <SwiperSlide key={manga.id} style={{ width: '300px' }}>
            <MangaItems manga={manga} isResponsive={false} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='text-left mt-4'>
        <button
          onClick={handleClick}
          className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-700 text-white rounded-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] hover:bg-blue-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        >
          Xem thêm
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default SlideMangaCard
