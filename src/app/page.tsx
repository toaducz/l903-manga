'use client'

import React, { Suspense } from 'react'
import { RecoilRoot } from 'recoil'
import Link from 'next/link'
import SlideMangaCardFullWidth from '@/components/slide/slide-manga-cardwidth'
import MangaTabs from '@/components/manga/manga-tabs'
import { FiZap, FiStar, FiClock, FiGrid, FiArrowRight } from 'react-icons/fi'
import { FaGithub, FaCode, FaRocket } from 'react-icons/fa'
import MangaByTagPage from '@/components/views/manga-by-tag-page'
import GenreCollectionCard from '@/components/views/genre-collection-card'

export default function Home() {
  const COMEDY = '4d32cc48-9f00-4cca-9b5a-a839f0764984'
  const ROMANCE = '423e2eae-a7a2-4a8b-ac03-a8351462d71d'
  const ACTION = '391b0423-d847-456f-aff0-8b0cfc03066b'

  return (
    <RecoilRoot>
      <div className='min-h-screen bg-background pb-32'>
        <div className='max-w-screen-2xl mx-auto px-4 md:px-12'>
          <Suspense fallback={<div className='h-[70vh] animate-pulse bg-white/5 rounded-[3rem] mt-24' />}>
            {/* Hero Slider */}
            <section className='pt-8 md:pt-2'>
              <SlideMangaCardFullWidth id={''} />
            </section>

            {/* Featured Section */}
            <section className='mt-24'>
              <div className='flex items-center justify-between mb-2'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-3 text-primary'>
                    <FiZap size={20} className='neon-glow' />
                    <span className='text-[10px] font-black uppercase tracking-[0.4em]'>Khám Phá</span>
                  </div>
                  <h2 className='text-4xl md:text-5xl font-display font-black text-white tracking-tight'>
                    Dành Cho Bạn
                  </h2>
                </div>
                {/* <button className='px-6 py-2.5 glass-card rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-primary/50 transition-all cursor-pointer active:scale-95'>
                  Xem Tất Cả
                </button> */}
              </div>
              <MangaTabs />
            </section>

            {/* Recently Updated */}
            <section className='mt-12'>
              <div className='flex items-center gap-3 text-primary mb-4'>
                <FiClock size={20} className='neon-glow' />
                <span className='text-[10px] font-black uppercase tracking-[0.4em]'>Mới Nhất</span>
              </div>
              <h2 className='text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-12'>
                Vừa Cập Nhật
              </h2>
              <MangaByTagPage limitManga={12} pagination={false} />
              <div className='mt-12 flex justify-center'>
                <button className='px-12 py-4 glass-card rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer active:scale-95'>
                  Khám phá thêm truyện mới
                </button>
              </div>
            </section>

            {/* Featured Collections - Bento Grid using GenreCollectionCard */}
            <section className='mt-12'>
              <div className='flex items-center justify-between mb-10'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-3 text-primary'>
                    <FiStar size={20} className='neon-glow' />
                    <span className='text-[10px] font-black uppercase tracking-[0.4em]'>Bộ Sưu Tập</span>
                  </div>
                  <h2 className='text-4xl font-display font-black text-white tracking-tight'>Nổi Bật Trong Tuần</h2>
                </div>
                <Link
                  href='/genres'
                  className='flex items-center gap-2 px-6 py-2.5 glass-card rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-primary/50 transition-all border border-white/5'
                >
                  <FiGrid size={12} />
                  Tất cả thể loại
                </Link>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {/* Romance - Hero wide card */}
                <GenreCollectionCard
                  tagIds={[ROMANCE]}
                  label='ROMANCE'
                  subtitle='Tình yêu ngọt ngào'
                  badge='BỘ SƯU TẬP #01'
                  theme='pink'
                  count={4}
                  hero={true}
                  description='Những câu chuyện tình yêu ngọt ngào, sâu lắng dành cho những tâm hồn mơ mộng.'
                  filterHref={`/filter-search?tags=${ROMANCE}`}
                />

                {/* Comedy */}
                <GenreCollectionCard
                  tagIds={[COMEDY]}
                  label='HÀI HƯỚC'
                  subtitle='Cười xuyên màn đêm'
                  badgeRight='HOT TREND'
                  theme='orange'
                  count={4}
                  filterHref={`/filter-search?tags=${COMEDY}`}
                />

                {/* Action */}
                <GenreCollectionCard
                  tagIds={[ACTION]}
                  label='HÀNH ĐỘNG'
                  subtitle='Kịch tính & Hồi hộp'
                  badgeRight='ADRENALINE'
                  theme='blue'
                  count={4}
                  filterHref={`/filter-search?tags=${ACTION}`}
                />

                {/* Explore All - Link Card */}
                <Link
                  href='/genres'
                  className='lg:col-span-2 group relative overflow-hidden rounded-[2.5rem] border border-dashed border-white/10 hover:border-primary/40 transition-all flex items-center justify-center p-12 min-h-[180px]'
                >
                  <div className='text-center space-y-4'>
                    <div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white text-2xl mx-auto group-hover:bg-primary group-hover:text-black transition-all duration-500'>
                      <FiArrowRight />
                    </div>
                    <h3 className='text-xl font-black text-white uppercase tracking-[0.2em]'>Xem toàn bộ thể loại</h3>
                    <p className='text-xs text-gray-500 font-bold uppercase tracking-widest'>
                      Khám phá hàng ngàn bộ truyện hấp dẫn khác
                    </p>
                  </div>
                </Link>
              </div>
            </section>

            {/* Self-Host / Open Source Mission */}
            <section className='mt-20 mb-20'>
              <div className='relative p-10 md:p-20 glass-card rounded-[4rem] overflow-hidden border-white/10 group'>
                <div className='absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 opacity-50' />

                <div className='relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
                  <div className='space-y-10'>
                    <div className='space-y-4'>
                      <div className='flex items-center gap-3 text-blue-400'>
                        <FaRocket className='animate-bounce' />
                        <span className='text-[10px] font-black uppercase tracking-[0.4em]'>Dự Án L903 Manga</span>
                      </div>
                      <h2 className='text-4xl md:text-7xl font-display font-black text-white leading-[1.1]'>
                        Mã Nguồn{' '}
                        <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500'>
                          Mở 100%
                        </span>
                      </h2>
                      <p className='text-lg text-gray-400 font-medium leading-relaxed max-w-xl'>
                        Dự án nhằm mục đích học tập và nghiên cứu. Bạn hoàn toàn có thể tự triển khai bản sao của riêng
                        mình với đầy đủ tính năng.
                      </p>
                    </div>

                    <div className='flex flex-wrap gap-4'>
                      <a
                        href='https://github.com/toaducz/l903-manga'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='group relative flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-white/20'
                      >
                        <FaGithub className='text-xl' />
                        Truy cập GitHub ngay
                      </a>
                      <button
                        disabled
                        className='px-8 py-5 glass-card text-gray-500 font-black rounded-2xl text-sm uppercase tracking-widest cursor-not-allowed opacity-50'
                      >
                        Tài liệu (Sắp tới)
                      </button>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='p-8 glass-card border-white/5 rounded-[2rem] hover:border-blue-500/30 transition-all group/card'>
                      <FaCode className='text-blue-400 mb-6 text-3xl group-hover/card:scale-110 transition-transform' />
                      <h3 className='font-black text-white mb-2 uppercase tracking-tight'>Tùy Biến</h3>
                      <p className='text-gray-500 text-xs font-bold leading-relaxed'>
                        Dễ dàng thay đổi giao diện và tính năng theo ý thích.
                      </p>
                    </div>
                    <div className='p-8 glass-card border-white/5 rounded-[2rem] hover:border-purple-500/30 transition-all group/card'>
                      <FaRocket className='text-purple-400 mb-6 text-3xl group-hover/card:scale-110 transition-transform' />
                      <h3 className='font-black text-white mb-2 uppercase tracking-tight'>Deploy Nhanh</h3>
                      <p className='text-gray-500 text-xs font-bold leading-relaxed'>
                        Hỗ trợ Vercel, Netlify và Docker chỉ với 1 click.
                      </p>
                    </div>
                    <div className='sm:col-span-2 p-8 glass-card border-white/5 rounded-[2rem] hover:border-primary/30 transition-all group/card flex items-center gap-8'>
                      <div className='shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl group-hover/card:scale-110 transition-transform'>
                        <FaGithub />
                      </div>
                      <div>
                        <h3 className='font-black text-white mb-1 uppercase tracking-tight'>Cộng đồng đóng góp</h3>
                        <p className='text-gray-500 text-xs font-bold leading-relaxed'>
                          Luôn cập nhật các tính năng mới nhất từ cộng đồng mã nguồn mở.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className='absolute right-[-10%] top-[-20%] w-[50%] aspect-square bg-blue-600/10 blur-[120px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000' />
                <div className='absolute left-[-10%] bottom-[-20%] w-[50%] aspect-square bg-purple-600/10 blur-[120px] rounded-full group-hover:bg-purple-600/20 transition-all duration-1000' />
              </div>
            </section>
          </Suspense>
        </div>
      </div>
    </RecoilRoot>
  )
}
