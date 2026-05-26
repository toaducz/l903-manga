import React, { useState } from 'react'
import { Manga } from '@/codebase/api/paginate'
import Image from 'next/image'
import Link from 'next/link'
import { translateText } from '@/codebase/utils/translate'
import { MangaStatus, OriginalLanguage, ContentRating } from '@/codebase/constants/enums'
import { copyToClipboard } from '@/codebase/utils/copy-to-clipboard'
import { getAuthorById } from '@/codebase/api/author/get-author-by-id'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { splitTextIntoChunks } from '@/codebase/utils/format'
import { contentRatingColors } from '@/codebase/constants/static'
import ReactMarkdown from 'react-markdown'
import MangaChaptersList from '@/components/manga/manga-chapter-list'
import Loading from '@/components/status/Loading'
import Error from '@/components/status/error'
import { getChaptersByMangaId } from '@/codebase/api/manga/get-chapter'
import { getLanguageName } from '@/codebase/constants/enums'
import RelatedManga from '@/components/manga/related-manga'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiHeart, FiShare2, FiInfo } from 'react-icons/fi'

interface MangaDetailPageProps {
  manga: Manga
}

type MangaSortBy = 'chapters' | 'related'

const MangaDetailPage: React.FC<MangaDetailPageProps> = ({ manga }) => {
  const router = useRouter()
  const [isTranslate, setIsTranslate] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<MangaSortBy>('chapters')
  const [translatedDescription, setTranslatedDescription] = useState<string>('')
  const attributes = manga.attributes
  const isVietnameseAvailable = attributes.availableTranslatedLanguages.includes('vi')
  const lang = attributes.availableTranslatedLanguages.includes('vi') ? 'vi' : 'en'
  const coverArt = manga.relationships.find(rel => rel.type === 'cover_art')
  const coverArtFileName = coverArt?.attributes?.fileName
  const coverImageUrl = coverArtFileName ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}` : ''
  const proxyImageUrl = `/api/image?url=${encodeURIComponent(coverImageUrl)}`
  const [isTranslationLoading, setIsTranslationLoading] = useState(false)
  const authorId = manga.relationships.find(item => item.type === 'author')?.id
  const { data: author, isLoading, isError } = useQuery(getAuthorById({ id: authorId! }))
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

  const rating = manga.attributes.contentRating as keyof typeof ContentRating

  if (isLoading) return <Loading />
  if (isError) return <Error />

  return (
    <div className='relative min-h-screen bg-background text-foreground overflow-x-hidden'>
      {/* Floating Header Controls */}
      <div className='fixed top-0 inset-x-0 z-[100] px-6 py-8 flex items-center justify-between pointer-events-none'>
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className='p-3 glass-card rounded-full text-white pointer-events-auto hover:bg-white/20 transition-all active:scale-90 cursor-pointer'
        >
          <FiArrowLeft size={24} />
        </motion.button>
        <div className='flex gap-3 pointer-events-auto'>
          <div className='relative group/tooltip'>
            <motion.button
              disabled
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className='p-3 glass-card rounded-full text-white/40 cursor-not-allowed transition-all'
            >
              <FiHeart size={22} />
            </motion.button>
            <div className='absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg text-[10px] font-black text-white whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity border border-white/10 pointer-events-none'>
              SẮP CÓ?
            </div>
          </div>

          <div className='relative'>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={async () => {
                const success = await copyToClipboard(window.location.href)
                if (success) {
                  const toast = document.getElementById('share-toast')
                  if (toast) {
                    toast.style.opacity = '1'
                    toast.style.transform = 'translateY(0)'
                    setTimeout(() => {
                      toast.style.opacity = '0'
                      toast.style.transform = 'translateY(10px)'
                    }, 2000)
                  }
                }
              }}
              className='p-3 glass-card rounded-full text-white hover:text-primary transition-all cursor-pointer active:scale-90'
            >
              <FiShare2 size={22} />
            </motion.button>
            <div
              id='share-toast'
              className='absolute -bottom-12 -right-1/2 -translate-x-1/2 px-4 py-2 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-xl text-[10px] font-black text-primary whitespace-nowrap opacity-0 translate-y-2 transition-all duration-300 pointer-events-none shadow-[0_0_20px_rgba(56,189,248,0.2)]'
            >
              ĐÃ SAO CHÉP LIÊN KẾT!
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Hero Header */}
      <div
        className='
          relative 
          h-[400px] 
          md:h-[450px] 
          lg:h-[350px] 
          w-full
          bg-background
        '
      >
        <Image
          unoptimized
          src={proxyImageUrl}
          alt='Cinematic Background'
          fill
          priority
          className='object-cover object-top opacity-40 scale-105'
        />

        <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent' />
        <div className='absolute inset-0 bg-gradient-to-t via-background/60 to-transparent' />

        {/* Title Overlay for Mobile (if needed, but we have it below) */}
      </div>
      {/* <div
        className='absolute top-[350px] left-0 right-0 h-[250px]
                bg-gradient-to-b from-transparent to-background pointer-events-none'
      /> */}
      {/* Content Container */}
      <div className='relative z-10 -mt-40 md:-mt-56 lg:-mt-64 max-w-7xl mx-auto px-4 md:px-12 pb-32'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-16'>
          {/* Left: Poster Column */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            className='w-full md:w-[340px] flex-shrink-0'
          >
            <div className='relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 group'>
              <Image
                unoptimized
                src={proxyImageUrl}
                alt={'title' + attributes.title.en}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-110'
              />
              <div className='absolute top-4 right-4'>
                {rating && (
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${contentRatingColors[rating]} shadow-xl border border-white/10`}
                  >
                    {ContentRating[rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className='mt-8 grid grid-cols-2 gap-4'>
              <div className='glass-card p-5 rounded-2xl text-center border-white/5'>
                <p className='text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black'>Trạng thái</p>
                <p className='text-sm font-black text-white uppercase'>
                  {MangaStatus[attributes.status as keyof typeof MangaStatus]}
                </p>
              </div>
              <div className='glass-card p-5 rounded-2xl text-center border-white/5'>
                <p className='text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black'>Phát hành</p>
                <p className='text-sm font-black text-white'>{attributes.year || 'N/A'}</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Info Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='flex-1 flex flex-col justify-end'
          >
            <div className='space-y-8 pt-12 md:pt-0'>
              <div className='space-y-3'>
                <h1 className='text-5xl md:text-7xl font-display font-black text-white leading-[1.1] tracking-tight'>
                  {attributes.altTitles.find(item => item.vi)?.vi ?? attributes.title.en}
                </h1>
                <p className='text-2xl md:text-3xl text-primary font-bold opacity-90 tracking-tight'>
                  {attributes.altTitles.find(item => item.en)?.en || attributes.altTitles.find(item => item.ja)?.ja}
                </p>
              </div>

              {/* Tags/Genres */}
              <div className='flex flex-wrap gap-2.5'>
                {attributes.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/filter-search?tags=${tag.id}`}
                    className='px-4 py-1.5 bg-zinc-900 border border-white/10 rounded-full text-[11px] font-black text-gray-300 uppercase tracking-widest hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg'
                  >
                    {tag.attributes.name.en}
                  </Link>
                ))}
              </div>

              {/* Meta Info Row */}
              <div className='flex flex-wrap items-center gap-x-8 gap-y-4 py-6 border-y border-white/5 text-sm font-black text-gray-400 tracking-widest uppercase'>
                <div className='flex items-center gap-3'>
                  <span className='w-2 h-2 rounded-full bg-primary neon-glow' />
                  <span>Tác giả: </span>
                  <span
                    className='text-white hover:text-primary cursor-pointer transition-colors'
                    onClick={() => {
                      if (author?.data) {
                        localStorage.setItem('authorDetail', JSON.stringify(author.data))
                        router.push('/author-detail')
                      }
                    }}
                  >
                    {author?.data.attributes.name || 'Không rõ'}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='w-2 h-2 rounded-full bg-green-500' />
                  <span>{isVietnameseAvailable ? 'Tiếng Việt Sẵn Sàng' : 'Chỉ có tiếng Anh'}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <FiInfo className='text-primary' />
                  <span>
                    {OriginalLanguage[attributes.originalLanguage as keyof typeof OriginalLanguage] ||
                      'Nguồn gốc không rõ'}
                  </span>
                </div>
              </div>

              {/* Description Panel */}
              <div className='glass-card p-8 rounded-[2rem] relative overflow-hidden group border-white/5 shadow-2xl'>
                <div className='relative z-10 space-y-6'>
                  <div
                    className={`prose prose-invert max-w-none text-gray-300 font-medium leading-[1.8] text-lg transition-all duration-500 ${!isExpanded ? 'line-clamp-5' : ''
                      }`}
                  >
                    {isTranslate ? (
                      <ReactMarkdown>{translatedDescription}</ReactMarkdown>
                    ) : (
                      attributes.description.vi || <ReactMarkdown>{attributes.description.en}</ReactMarkdown> ||
                      'Không có mô tả cho truyện này.'
                    )}
                  </div>

                  {isTranslationLoading && (
                    <div className='h-1.5 w-full bg-white/5 overflow-hidden rounded-full'>
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className='h-full w-1/2 bg-primary neon-glow'
                      />
                    </div>
                  )}

                  <div className='flex flex-wrap items-center gap-6'>
                    <button
                      onClick={() => handleTranslate(attributes.description.en)}
                      className='group/btn flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer'
                    >
                      <span className='w-8 h-[1px] bg-primary group-hover/btn:w-12 transition-all' />
                      {isTranslate ? 'Xem nội dung gốc' : 'Dịch sang tiếng Việt'}
                    </button>

                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className='flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-white transition-colors cursor-pointer'
                    >
                      {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-wrap gap-5 pt-6'>
                <button
                  className='flex-1 md:flex-none px-12 py-5 bg-primary text-primary-foreground font-black rounded-2xl transition-all hover:scale-[1.03] active:scale-95 neon-glow shadow-[0_0_30px_rgba(56,189,248,0.4)] tracking-[0.1em] uppercase text-sm cursor-pointer'
                  onClick={() =>
                    router.push(
                      `/reader/${firstChapterId}?mangaId=${manga.id}&lang=${getLanguageName(
                        lang
                      )}&langFilter=${lang}&langValue=${lang}&chapterId=${firstChapterId}`
                    )
                  }
                >
                  BẮT ĐẦU ĐỌC
                </button>
                <button
                  disabled
                  className='flex-1 md:flex-none px-12 py-5 disabled:opacity-50 disabled:cursor-not-allowed glass-card text-white font-black rounded-2xl border border-white/10 hover:bg-white/20 transition-all tracking-[0.1em] uppercase text-sm cursor-pointer'
                >
                  + THƯ VIỆN (sắp có?)
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className='mt-24 border-b border-white/5'>
          <div className='flex gap-12'>
            {[
              { id: 'chapters', label: 'DANH SÁCH CHƯƠNG' },
              { id: 'related', label: 'TRUYỆN LIÊN QUAN' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MangaSortBy)}
                className={`pb-6 text-xs font-black tracking-[0.3em] transition-all relative cursor-pointer ${activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-white'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId='activeTab'
                    className='absolute bottom-0 left-0 right-0 h-[3px] bg-primary neon-glow'
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className='mt-12'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {activeTab === 'chapters' && (
                <MangaChaptersList mangaId={manga.id} langValue={'vi'} langFilterValue={['vi']} />
              )}
              {activeTab === 'related' && <RelatedManga ids={relatedMangaIds} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default MangaDetailPage
