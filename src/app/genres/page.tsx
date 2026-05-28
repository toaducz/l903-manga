'use client'

import React, { Suspense } from 'react'
import { RecoilRoot } from 'recoil'
import Link from 'next/link'
import { FiGrid, FiHeart, FiStar, FiZap, FiCoffee, FiBook, FiTrendingUp, FiSmile, FiFeather } from 'react-icons/fi'
import MangaByTagPage from '@/components/views/manga-by-tag-page'

const ACTION_TAG = '391b0423-d847-456f-aff0-8b0cfc03066b'
const COMEDY_TAG = '4d32cc48-9f00-4cca-9b5a-a839f0764984'
const ROMANCE_TAG = '423e2eae-a7a2-4a8b-ac03-a8351462d71d'
const DRAMA_TAG = 'b9af3a63-f058-46de-a9a0-e0c13906197a'
const FANTASY_TAG = 'cdc58593-87dd-415e-bbc0-2ec27bf404cc'
const HORROR_TAG = 'cdad7e68-1419-41dd-bdce-27753074a640'
const ISEKAI_TAG = 'ace04997-f6bd-436e-b261-779182193d3d'
const SLICE_OF_LIFE_TAG = 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9'

const GENRES = [
  {
    id: ROMANCE_TAG,
    label: 'Lãng Mạn',
    subtitle: 'Tình yêu ngọt ngào',
    icon: <FiHeart />,
    color: 'pink',
    glow: 'from-pink-500/10',
    textColor: 'text-pink-400',
    borderColor: 'hover:border-pink-500/30',
  },
  {
    id: COMEDY_TAG,
    label: 'Hài Hước',
    subtitle: 'Giải trí đỉnh cao',
    icon: <FiSmile />,
    color: 'orange',
    glow: 'from-orange-500/10',
    textColor: 'text-orange-400',
    borderColor: 'hover:border-orange-500/30',
  },
  {
    id: ACTION_TAG,
    label: 'Hành Động',
    subtitle: 'Kịch tính & Hồi hộp',
    icon: <FiZap />,
    color: 'blue',
    glow: 'from-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'hover:border-blue-500/30',
  },
  {
    id: DRAMA_TAG,
    label: 'Tâm Lý',
    subtitle: 'Chiều sâu cảm xúc',
    icon: <FiFeather />,
    color: 'purple',
    glow: 'from-purple-500/10',
    textColor: 'text-purple-400',
    borderColor: 'hover:border-purple-500/30',
  },
  {
    id: FANTASY_TAG,
    label: 'Huyền Ảo',
    subtitle: 'Thế giới kỳ diệu',
    icon: <FiStar />,
    color: 'emerald',
    glow: 'from-emerald-500/10',
    textColor: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/30',
  },
  {
    id: HORROR_TAG,
    label: 'Kinh Dị',
    subtitle: 'Rùng rợn & Hồi hộp',
    icon: <FiCoffee />,
    color: 'red',
    glow: 'from-red-500/10',
    textColor: 'text-red-400',
    borderColor: 'hover:border-red-500/30',
  },
  {
    id: ISEKAI_TAG,
    label: 'Isekai',
    subtitle: 'Thế giới song song',
    icon: <FiBook />,
    color: 'cyan',
    glow: 'from-cyan-500/10',
    textColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/30',
  },
  {
    id: SLICE_OF_LIFE_TAG,
    label: 'Cuộc Sống',
    subtitle: 'Nhẹ nhàng & Thư thái',
    icon: <FiTrendingUp />,
    color: 'yellow',
    glow: 'from-yellow-500/10',
    textColor: 'text-yellow-400',
    borderColor: 'hover:border-yellow-500/30',
  },
]

export default function GenresPage() {
  return (
    <RecoilRoot>
      <div className='min-h-screen bg-background pb-32'>
        <div className='max-w-screen-2xl mx-auto px-4 md:px-12'>
          {/* Header */}
          <div className='mb-16 space-y-4'>
            <div className='flex items-center gap-3 text-primary'>
              <FiGrid size={20} className='neon-glow' />
              <span className='text-[10px] font-black uppercase tracking-[0.4em]'>Thể Loại</span>
            </div>
            <h1 className='text-5xl md:text-7xl font-display font-black text-white tracking-tight'>
              Toàn Bộ Thể Loại
            </h1>
            <p className='text-gray-400 text-lg max-w-xl'>
              Khám phá hàng ngàn bộ truyện được phân loại theo thể loại yêu thích của bạn.
            </p>
          </div>

          {/* Genre Sections */}
          <div className='space-y-24'>
            {GENRES.map((genre) => (
              <Suspense key={genre.id} fallback={<div className='h-64 glass-card rounded-[2.5rem] animate-pulse' />}>
                <section>
                  {/* Section header */}
                  <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center gap-4'>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${genre.glow.replace('from-', 'bg-').replace('/10', '/10')} border-white/10 ${genre.textColor}`}>
                        {genre.icon}
                      </div>
                      <div>
                        <h2 className='text-3xl font-display font-black text-white tracking-tight'>{genre.label}</h2>
                        <p className={`text-xs font-black uppercase tracking-widest ${genre.textColor}`}>{genre.subtitle}</p>
                      </div>
                    </div>
                    <Link
                      href={`/genres/${genre.id}?name=${encodeURIComponent(genre.label)}`}
                      className={`px-6 py-2.5 glass-card rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 ${genre.borderColor} ${genre.textColor.replace('text-', 'hover:text-')} transition-all border border-white/5`}
                    >
                      Tất cả
                    </Link>
                  </div>

                  {/* Manga grid */}
                  <MangaByTagPage id={[genre.id]} limitManga={12} pagination={false} />
                </section>
              </Suspense>
            ))}
          </div>
        </div>
      </div>
    </RecoilRoot>
  )
}
