'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
import { getTopMangaByTagId } from '@/codebase/api/manga/get-top-manga-by-tag-id'
import { Manga } from '@/codebase/api/paginate'
import { FiArrowRight } from 'react-icons/fi'
import { getMangaInfo } from '@/codebase/utils/manga'

function MiniPoster({ manga }: { manga: Manga }) {
  // const [loaded, setLoaded] = useState(false)

  const { title, proxyImageUrl: imgUrl } = getMangaInfo(manga)

  return (
    <Link
      href={`/manga-detail/${manga.id}`}
      className='block relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group border border-white/5 hover:border-white/20 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.97] bg-slate-900'
    >
      {imgUrl && (
        <Image
          unoptimized
          src={imgUrl}
          alt={`bg-${title}`}
          fill
          sizes='150px'
          loading='lazy'
          className={`object-cover transition-all duration-500 group-hover:scale-110`}
          // onLoad={() => setLoaded(true)}
          placeholder='blur'
          blurDataURL='@/assets/image/mie.jpg'
        />
      )}
      {/* {!loaded && <div className='absolute inset-0 bg-slate-800 animate-pulse' />} */}

      {/* Gradient scrim + title */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2.5'>
        <p className='text-[9px] font-black text-white leading-tight uppercase line-clamp-2 tracking-tight drop-shadow-xl'>
          {title}
        </p>
      </div>
    </Link>
  )
}

/* ────────────────────────── Skeleton Loader ────────────────────────── */
function SkeletonPosters({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='aspect-[2/3] rounded-xl bg-slate-800/60 animate-pulse' />
      ))}
    </>
  )
}

/* ─────────────────────────── Genre Card Props ─────────────────────────── */
export interface GenreCardConfig {
  /** MangaDex tag UUID(s) */
  tagIds: string[]
  /** Vietnamese label shown in the card */
  label: string
  /** Smaller subtitle / mood text */
  subtitle: string
  /** Small badge above label, e.g. "BỘ SƯU TẬP #01" */
  badge?: string
  /** Right-side label, e.g. "HOT TREND" */
  badgeRight?: string
  /** One of the preset color themes */
  theme: 'pink' | 'orange' | 'blue' | 'green' | 'purple'
  /** Number of posters to show */
  count?: number
  /** Makes the card take up 2 columns in an md:grid-cols-3 layout */
  hero?: boolean
  /** Description text shown only in hero mode */
  description?: string
  /** Filter-search URL query string, e.g. "?tags=uuid" */
  filterHref?: string
}

const THEME = {
  pink: {
    glow: 'from-pink-500/10',
    badge: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    icon: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    badgeRight: 'text-pink-400',
    cta: 'hover:text-pink-400',
  },
  orange: {
    glow: 'from-orange-500/10',
    badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    icon: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    badgeRight: 'text-orange-400',
    cta: 'hover:text-orange-400',
  },
  blue: {
    glow: 'from-blue-500/10',
    badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    icon: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    badgeRight: 'text-blue-400',
    cta: 'hover:text-blue-400',
  },
  green: {
    glow: 'from-emerald-500/10',
    badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    badgeRight: 'text-emerald-400',
    cta: 'hover:text-emerald-400',
  },
  purple: {
    glow: 'from-purple-500/10',
    badge: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    icon: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    badgeRight: 'text-purple-400',
    cta: 'hover:text-purple-400',
  },
}

/* ─────────────────────────── GenreCollectionCard ─────────────────────────── */
export default function GenreCollectionCard({
  tagIds,
  label,
  subtitle,
  badge,
  badgeRight,
  theme,
  count = 4,
  hero = false,
  description,
  filterHref,
}: GenreCardConfig) {
  const { data, isLoading } = useQuery(
    getTopMangaByTagId({ id: tagIds, offset: 0, limit: count })
  )

  const t = THEME[theme]
  const mangas = data?.data ?? []

  const posterGrid = (
    <div className={`grid gap-3 ${hero ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'}`}>
      {isLoading ? (
        <SkeletonPosters count={count} />
      ) : (
        mangas.slice(0, count).map(m => <MiniPoster key={m.id} manga={m} />)
      )}
    </div>
  )

  if (hero) {
    /* ── Wide Hero Card: Vertical layout with immersive background ── */
    const firstManga = mangas[0]
    const bgCoverArt = firstManga?.relationships.find(r => r.type === 'cover_art')
    const bgFileName = bgCoverArt?.attributes?.fileName
    const bgUrl = bgFileName
      ? `/api/image?url=${encodeURIComponent(`https://uploads.mangadex.org/covers/${firstManga.id}/${bgFileName}`)}`
      : ''

    return (
      <div className='md:col-span-2 relative group overflow-hidden rounded-[3rem] border border-white/5 glass-card flex flex-col min-h-[500px]'>
        {/* Background Image Layer */}
        {bgUrl && (
          <div className='absolute inset-0 z-0 opacity-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110'>
            <Image
              unoptimized
              src={bgUrl}
              alt='background'
              fill
              className='object-cover blur-3xl scale-110'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent' />
          </div>
        )}

        <div className={`absolute inset-0 bg-gradient-to-br ${t.glow} via-transparent to-transparent opacity-40 pointer-events-none`} />

        {/* Content Section */}
        <div className='relative z-10 p-8 md:p-12 flex flex-col h-full'>
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12'>
            <div className='space-y-6 max-w-xl'>
              {badge && (
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.4em] w-fit shadow-2xl ${t.badge}`}>
                  {badge}
                </span>
              )}
              <h3 className='text-4xl md:text-6xl font-display font-black text-white tracking-tight leading-[0.9] uppercase'>
                {label}
              </h3>
              {description && (
                <p className='text-base md:text-lg text-gray-400 font-medium leading-relaxed'>{description}</p>
              )}
            </div>

            {filterHref && (
              <Link
                href={filterHref}
                className={`group/cta flex items-center gap-4 px-8 py-4 glass-card rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95 cursor-pointer ${t.cta}`}
              >
                Khám phá ngay
                <FiArrowRight className='group-hover/cta:translate-x-2 transition-transform duration-300' />
              </Link>
            )}
          </div>

          {/* Posters Grid */}
          <div className='mt-auto pt-8 border-t border-white/5'>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
              {isLoading ? (
                <SkeletonPosters count={4} />
              ) : (
                mangas.slice(0, 4).map(m => <MiniPoster key={m.id} manga={m} />)
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Standard single-col card ── */
  return (
    <div className='relative group overflow-hidden rounded-[2.5rem] border border-white/5 glass-card flex flex-col min-h-[380px]'>
      <div className={`absolute inset-0 bg-gradient-to-br ${t.glow} via-transparent to-transparent opacity-50 pointer-events-none`} />

      <div className='relative z-10 p-8 flex flex-col h-full gap-6'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <div className='flex flex-col gap-1'>
            <h3 className='text-3xl font-display font-black text-white tracking-tight uppercase'>
              {label}
            </h3>
            <p className='text-[9px] font-black text-gray-500 uppercase tracking-widest'>{subtitle}</p>
          </div>
          {badgeRight && (
            <span className={`text-[8px] font-black uppercase tracking-widest ${t.badgeRight}`}>
              {badgeRight}
            </span>
          )}
        </div>

        {/* Posters */}
        <div className='flex-1'>
          {posterGrid}
        </div>

        {/* CTA */}
        {filterHref && (
          <Link
            href={filterHref}
            className={`flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-widest transition-colors mt-auto w-fit cursor-pointer ${t.cta}`}
          >
            Xem thêm <FiArrowRight className='transition-transform duration-300 group-hover:translate-x-1' />
          </Link>
        )}
      </div>
    </div>
  )
}
