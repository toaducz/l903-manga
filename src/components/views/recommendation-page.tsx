'use client'

import React from 'react'
import Image from 'next/image'
import { getMangaById } from '@/codebase/api/manga/get-manga-by-id'
import { useQueries } from '@tanstack/react-query'
import Link from 'next/link'

export default function RecommendationContentPage() {
  const ids = [
    '6d6d9fda-5cd3-40ac-948b-776b1a1a0eb1', // Megane Suki
    '3df1a9a3-a1be-47a3-9e90-9b3e55b1d0ac', // Bokuyaba
    'a96676e5-8ae2-425e-b549-7f15dd34a6d8', //Komi
    'cddd1849-ab36-4304-8103-06ba4062b5e6', //Kubo-san
    '6ce4c88e-381e-4c4a-a858-7585fff92f47', // we never learn
    'a2febd3e-6252-46eb-bd63-01d51deaaec5', // 5tobún
    '25e1d17b-6a4d-4698-a4f6-bf53460c10af', // Kaoru Hana wa Rin to Saku
    'ee96e2b7-9af2-4864-9656-649f4d3b6fec', // không thể tử tế?
  ]

  const customDescriptions: { [key: string]: string } = {
    '6d6d9fda-5cd3-40ac-948b-776b1a1a0eb1': 'Hay vl',
    '3df1a9a3-a1be-47a3-9e90-9b3e55b1d0ac': 'Bokuyaba là đỉnh cao rom-com',
    'a96676e5-8ae2-425e-b549-7f15dd34a6d8': 'Chadnado',
    'cddd1849-ab36-4304-8103-06ba4062b5e6': 'ok 👍',
    '6ce4c88e-381e-4c4a-a858-7585fff92f47': 'Pick sai kèo cay vcl',
    'a2febd3e-6252-46eb-bd63-01d51deaaec5': 'Pick sai kèo cay vcl',
    '25e1d17b-6a4d-4698-a4f6-bf53460c10af': 'Truyền nhân của Gái mang kính, Gái xe buýt =))',
    'ee96e2b7-9af2-4864-9656-649f4d3b6fec': 'Gái Gyaru có thể tử tế với Otaku',
  }

  const mangaQueries = useQueries({
    queries: ids.map(id => getMangaById({ id }))
  })

  // console.log(mangaQueries)

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-8 sm:p-12'>
      <h1 className='text-3xl sm:text-5xl font-bold text-white text-center mb-8 sm:mb-12 tracking-tight pt-15'>
        Peak Romcom là đây mấy con gà biết gì 🐧
      </h1>
      <div className='grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto'>
        {mangaQueries.map((query, index) => {
          if (query.isLoading) {
            return (
              <div key={index} className='relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse'>
                <div className='h-80 sm:h-96 w-full bg-gray-700' />
                <div className='p-4 sm:p-6 space-y-4'>
                  <div className='h-6 bg-gray-700 rounded w-3/4' />
                  <div className='space-y-2'>
                    <div className='h-4 bg-gray-700 rounded w-full' />
                    <div className='h-4 bg-gray-700 rounded w-5/6' />
                  </div>
                </div>
              </div>
            )
          }

          const manga = query.data?.data
          if (!manga) return null

          const title =
            manga.attributes.altTitles.find(t => t.vi)?.vi ||
            manga.attributes.title.en ||
            manga.attributes.altTitles.find(t => t.ja)?.ja
          const description =
            customDescriptions[manga.id] ||
            manga.attributes.description.vi ||
            manga.attributes.description.en ||
            'Không có mô tả.'
          const coverArt = manga.relationships.find(rel => rel.type === 'cover_art')
          const coverArtFileName = coverArt?.attributes?.fileName
          const coverImageUrl = coverArtFileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}`
            : ''
          const proxyImageUrl = `/api/image?url=${encodeURIComponent(coverImageUrl)}`

          return (
            <Link
              href={`/manga-detail/${manga.id}`}
              key={index}
              className='group relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
            >
              <div className='relative h-80 sm:h-96 w-full'>
                <Image
                  unoptimized
                  src={proxyImageUrl}
                  alt={'favorite'}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-500 ease-out'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  priority={index < 2} // Prioritize loading for first two images
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300' />
                <div className='absolute bottom-0 w-full p-4 sm:p-6'>
                  <h2 className='text-xl sm:text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300'>
                    {title}
                  </h2>
                </div>
              </div>
              <div className='p-4 sm:p-6 text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-4 group-hover:text-gray-100 transition-colors duration-300'>
                {description}
              </div>
              <div className='absolute top-4 right-4 bg-yellow-400 text-gray-900 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                Đọc Ngay
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
