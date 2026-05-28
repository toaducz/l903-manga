'use client'

import React from 'react'
import Image from 'next/image'
import { getMangaById } from '@/codebase/api/manga/get-manga-by-id'
import { useQueries } from '@tanstack/react-query'
import Link from 'next/link'
import { getMangaInfo } from '@/codebase/utils/manga'

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

  return (
    <main className='min-h-screen pb-24 px-6 max-w-[1440px] mx-auto bg-background text-foreground'>
      {/* Hero Section */}
      <section className='mb-24 flex flex-col items-start max-w-3xl'>
        <h1 className='text-[48px] font-extrabold text-foreground mb-4 uppercase tracking-tighter'>
          L903 Rom-com
        </h1>
        <p className='text-[18px] text-primary font-medium'>
          Peak Romcom là đây mấy con gà biết gì 🐧
        </p>
        <div className='mt-8 w-24 h-1 bg-primary'></div>
      </section>

      {/* Content Section: Asymmetrical Layout */}
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-20'>
        {mangaQueries.map((query, index) => {
          if (query.isLoading) {
            return (
              <div
                key={index}
                className={`group flex flex-col gap-6 animate-pulse ${
                  index % 2 === 0 ? 'lg:-translate-y-5' : 'lg:translate-y-10'
                }`}
              >
                <div className='relative aspect-[2/3] overflow-hidden bg-slate-800 rounded-lg border border-white/10'></div>
                <div className='flex flex-col gap-2'>
                  <div className='h-6 bg-slate-800 rounded w-3/4' />
                  <div className='h-4 bg-slate-800 rounded w-full' />
                </div>
              </div>
            )
          }

          const manga = query.data?.data
          if (!manga) return null

          const mangaInfo = getMangaInfo(manga)
          const title = mangaInfo.title
          const description = customDescriptions[manga.id] || mangaInfo.description
          const proxyImageUrl = mangaInfo.proxyImageUrl

          return (
            <Link
              href={`/manga-detail/${manga.id}`}
              key={index}
              className={`group flex flex-col gap-6 cursor-pointer ${
                index % 2 === 0 ? 'lg:-translate-y-5' : 'lg:translate-y-10'
              }`}
            >
              <div className='relative aspect-[2/3] overflow-hidden bg-slate-900 rounded-lg border border-white/10'>
                <Image
                  unoptimized
                  src={proxyImageUrl}
                  alt={title || 'Manga Cover'}
                  fill
                  className='object-cover'
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                  priority={index < 4}
                />
                <div className='absolute inset-0 scrim-gradient opacity-60'></div>
                {index === 0 && (
                  <div className='absolute top-4 right-4 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 backdrop-blur-md text-amber-500 text-[11px] font-bold uppercase tracking-widest z-10'>
                    Top 1
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <h3 className='text-[20px] font-bold text-foreground group-hover:text-primary'>
                  {title}
                </h3>
                <p className='text-[14px] text-foreground/70 line-clamp-2'>
                  {description}
                </p>
                <button className='mt-2 w-max px-6 py-2 bg-primary text-primary-foreground text-[13px] font-bold rounded-lg cursor-pointer hover:opacity-90'>
                  Đọc Ngay
                </button>
              </div>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
