'use client'

import React, { useState } from 'react'
import { Manga } from '@/codebase/api/paginate'
import Image from 'next/image'
import Link from 'next/link'
import { translateText } from '@/codebase/utils/translate'
import { MangaStatus, OriginalLanguage, ContentRating } from '@/codebase/constants/enums'
import { getAuthorById } from '@/codebase/api/author/get-author-by-id'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { splitTextIntoChunks } from '@/codebase/utils/format'
import { contentRatingColors } from '@/codebase/constants/static'
import ReactMarkdown from 'react-markdown'
import MangaChaptersList from '@/components/manga/manga-chapter-list'
import { getChaptersByMangaId } from '@/codebase/api/manga/get-chapter'
import RelatedManga from '@/components/manga/related-manga'
import { FiArrowLeft, FiShare2, FiInfo, FiHome } from 'react-icons/fi'
import { copyToClipboard } from '@/codebase/utils/copy-to-clipboard'
import { saveReaderContext } from '@/codebase/utils/reader-context'
import { getMangaInfo } from '@/codebase/utils/manga'

interface MangaDetailMobileProps {
  manga: Manga
}

type MangaSortBy = 'chapters' | 'related'

const MangaDetailMobile: React.FC<MangaDetailMobileProps> = ({ manga }) => {
  const router = useRouter()
  const [isTranslate, setIsTranslate] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<MangaSortBy>('chapters')
  const [translatedDescription, setTranslatedDescription] = useState<string>('')
  const [isTranslationLoading, setIsTranslationLoading] = useState(false)

  const attributes = manga.attributes
  const isVietnameseAvailable = attributes.availableTranslatedLanguages.includes('vi')
  const lang = isVietnameseAvailable ? 'vi' : 'en'
  const { title, subTitle, proxyImageUrl } = getMangaInfo(manga)
  const authorId = manga.relationships.find(item => item.type === 'author')?.id
  const { data: author } = useQuery(getAuthorById({ id: authorId! }))
  const { data: chapter } = useQuery(getChaptersByMangaId({ id: manga.id, lang: [lang] }))
  const firstChapterId = chapter?.data.length !== 0 ? chapter?.data[0].id : ''
  const relatedMangaIds = manga.relationships.filter(rel => rel.type === 'manga').map(rel => rel.id)

  const handleTranslate = async (text: string) => {
    if (!isTranslate && !translatedDescription) {
      setIsTranslationLoading(true)
      try {
        const chunks = splitTextIntoChunks(text)
        const translatedChunks: string[] = []
        for (const chunk of chunks) {
          const translated = await translateText(chunk)
          translatedChunks.push(translated)
        }
        setTranslatedDescription(translatedChunks.join(' '))
        setIsTranslate(true)
      } catch (error: unknown) {
        console.error('Translation failed:', error)
        setTranslatedDescription('Lỗi khi dịch. Vui lòng thử lại sau.')
        setIsTranslate(true)
      } finally {
        setIsTranslationLoading(false)
      }
    } else {
      setIsTranslate(!isTranslate)
    }
  }

  const rating = attributes.contentRating as keyof typeof ContentRating

  return (
    <div className='relative min-h-screen bg-background text-foreground pb-20'>
      {/* Header Actions */}
      <div className='fixed top-0 inset-x-0 z-[100] px-4 py-4 flex items-center justify-between pointer-events-none'>
        <div className='flex gap-2 pointer-events-auto'>
          <button
            onClick={() => router.back()}
            className='p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white active:scale-95'
          >
            <FiArrowLeft size={20} />
          </button>
          <button
            onClick={() => router.push('/')}
            className='p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white active:scale-95'
          >
            <FiHome size={20} />
          </button>
        </div>
        <button
          onClick={async () => {
            const success = await copyToClipboard(window.location.href)
            if (success) alert('Đã sao chép liên kết!')
          }}
          className='p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white pointer-events-auto active:scale-95'
        >
          <FiShare2 size={20} />
        </button>
      </div>

      {/* Hero Banner */}
      <div className='relative h-[250px] w-full bg-slate-900'>
        <Image
          unoptimized
          src={proxyImageUrl}
          alt='Background'
          fill
          priority
          className='object-cover object-top opacity-50 blur-sm'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent' />
      </div>


      {/* Main Content */}
      <div className='relative z-10 -mt-40 px-4'>

        <div className='flex gap-4'>
          {/* Poster */}
          <div className='relative w-[110px] aspect-[2/3] rounded-lg overflow-hidden shadow-xl shrink-0 border border-white/10 bg-slate-800'>
            <Image
              unoptimized
              src={proxyImageUrl}
              alt={title || 'Cover'}
              fill
              className='object-cover'
            />

          </div>

          {/* Quick Info */}
          <div className='flex flex-col justify-start pb-1'>
            <p className='text-2xl font-black text-white leading-tight line-clamp-3 mb-1 drop-shadow-md'>
              {title}
            </p>
            {subTitle && (
              <p className='text-xs text-primary font-bold line-clamp-1 opacity-90 drop-shadow-sm mb-2'>
                {subTitle}
              </p>
            )}

            <div className='flex flex-wrap items-center gap-2'>
              <span className='px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded text-[9px] font-black uppercase tracking-widest'>
                {MangaStatus[attributes.status as keyof typeof MangaStatus]}
              </span>
              {attributes.year && (
                <span className='px-2 py-0.5 bg-white/10 text-gray-300 border border-white/10 rounded text-[9px] font-black uppercase tracking-widest'>
                  {attributes.year}
                </span>
              )}

            </div>
            {rating && (
              <div className='mt-2'>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${contentRatingColors[rating]} bg-black/80 backdrop-blur-sm`}>
                  {ContentRating[rating]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 mt-6'>
          <button
            className='flex-1 py-3 bg-primary text-primary-foreground font-black rounded-xl active:scale-[0.98] transition-transform text-xs tracking-widest uppercase shadow-lg'
            onClick={() => {
              if (firstChapterId) {
                saveReaderContext({
                  mangaId: manga.id,
                  offset: 0,
                  langFilterValue: [lang],
                  langValue: lang,
                  order: 'desc'
                })
                router.push(`/reader/${firstChapterId}`)
              }
            }}
          >
            Đọc ngay
          </button>
          <button
            disabled
            className='flex-1 py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl opacity-60 text-xs tracking-widest uppercase'
          >
            + Thư viện
          </button>
        </div>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 mt-6'>
          {attributes.tags.map(tag => (
            <Link
              key={tag.id}
              href={`/filter-search?tags=${tag.id}`}
              className='px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-300 uppercase tracking-widest active:bg-white/10'
            >
              {tag.attributes.name.en}
            </Link>
          ))}
        </div>

        {/* Author & Meta */}
        <div className='mt-6 py-4 border-y border-white/10 flex flex-col gap-3 text-[11px] font-bold text-gray-400'>
          <div className='flex justify-between items-center'>
            <span className='uppercase tracking-widest'>Tác giả</span>
            <span
              className='text-white active:text-primary'
              onClick={() => {
                if (author?.data) {
                  localStorage.setItem('authorDetail', JSON.stringify(author.data))
                  router.push('/author-detail')
                }
              }}
            >
              {author?.data.attributes.name || 'Đang cập nhật'}
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='uppercase tracking-widest'>Ngôn ngữ</span>
            <span className='text-white flex items-center gap-1.5'>
              <span className='w-1.5 h-1.5 rounded-full bg-green-500' />
              {isVietnameseAvailable ? 'Tiếng Việt' : 'Tiếng Anh'}
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='uppercase tracking-widest'>Nguồn gốc</span>
            <span className='text-white flex items-center gap-1.5'>
              <FiInfo className='text-primary' />
              {OriginalLanguage[attributes.originalLanguage as keyof typeof OriginalLanguage] || 'N/A'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className='mt-6 bg-white/5 border border-white/10 rounded-2xl p-4'>
          <div className={`prose prose-invert max-w-none text-gray-300 text-xs leading-relaxed ${!isExpanded ? 'line-clamp-4' : ''}`}>
            {isTranslate ? (
              <ReactMarkdown>{translatedDescription}</ReactMarkdown>
            ) : (
              attributes.description.vi || <ReactMarkdown>{attributes.description.en}</ReactMarkdown> ||
              'Chưa có mô tả cho truyện này.'
            )}
          </div>

          {isTranslationLoading && (
            <div className='mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden'>
              <div className='h-full w-1/2 bg-primary animate-[translate_1s_infinite_linear]' />
            </div>
          )}

          <div className='flex justify-between items-center mt-4 pt-3 border-t border-white/10'>
            <button
              onClick={() => handleTranslate(attributes.description.en)}
              className='text-[10px] font-black text-primary uppercase tracking-widest active:text-white'
            >
              {isTranslate ? 'Bản gốc' : 'Dịch tiếng Việt'}
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-[10px] font-black text-gray-400 uppercase tracking-widest active:text-white'
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='mt-8 border-b border-white/10 flex'>
          {[
            { id: 'chapters', label: 'CHƯƠNG' },
            { id: 'related', label: 'LIÊN QUAN' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MangaSortBy)}
              className={`flex-1 pb-3 text-[11px] font-black tracking-widest relative ${activeTab === tab.id ? 'text-primary' : 'text-gray-500'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary' />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='mt-6'>
          {activeTab === 'chapters' && (
            <MangaChaptersList mangaId={manga.id} langValue={'vi'} langFilterValue={['vi']} />
          )}
          {activeTab === 'related' && (
            <RelatedManga ids={relatedMangaIds} />
          )}
        </div>
      </div>
    </div>
  )
}

export default MangaDetailMobile
