'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getChapterImages } from '@/codebase/api/manga/get-chapter-images'
import Loading from '@/components/status/Loading'
import { ImageWithLoading } from '@/components/image/image-with-loading'
import Error from '@/components/status/error'
import MangaChaptersList from '@/components/manga/manga-chapter-list'
import ScrollToBottomButton from '@/components/layout/scroll/scroll-to-bottom'
import { getChaptersByMangaId } from '@/codebase/api/manga/get-chapter'
import ChapterNavButton from '@/components/manga/chapter-navigation'
import { useRouter } from 'next/navigation'
import { saveReadingHistory } from '@/codebase/utils/local-storage'
import { Chapter } from '@/codebase/api/manga/get-chapter'
import { getMangaById } from '@/codebase/api/manga/get-manga-by-id'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiChevronLeft, FiSettings, FiX, FiSun, FiMaximize } from 'react-icons/fi'

export default function ChapterReaderPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ReaderContent />
    </Suspense>
  )
}

function ReaderContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const [showControls, setShowControls] = useState(true)
  const [showChapters, setShowChapters] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [brightness, setBrightness] = useState(100)

  const offset = Number(searchParams.get('offset') ?? 0)
  const id = params.id as string
  const mangaId = searchParams.get('mangaId') ?? ''
  const chapterId = searchParams.get('chapterId') ?? ''
  const number = searchParams.get('number') ?? 'Oneshot'
  const lang = searchParams.get('lang') ?? ''
  const langFilterValue = searchParams.get('langFilter') ?? ['vi', 'en']
  const langValue = searchParams.get('langValue') ?? 'all'
  const order = searchParams.get('order') ?? 'desc'

  const {
    data: images,
    isLoading,
    error,
    isError,
    isSuccess
  } = useQuery({
    queryKey: ['chapter-images', id, offset],
    queryFn: () => getChapterImages(id),
    enabled: !!id
  })

  const { data: chaptersData } = useQuery(
    getChaptersByMangaId({
      id: mangaId,
      lang: Array.isArray(langFilterValue) ? langFilterValue : [langFilterValue],
      order: order,
      offset: offset
    })
  )

  const { data: manga } = useQuery(getMangaById({ id: mangaId }))

  const title = useMemo(
    () =>
      manga?.data.attributes.altTitles.find(t => t.vi)?.vi ??
      manga?.data.attributes.altTitles.find(t => t.en)?.en ??
      manga?.data.attributes.altTitles.find(t => t.ja)?.ja,
    [manga]
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [chapterId])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (currentScrollY / totalHeight) * 100
      setScrollProgress(progress)

      if (currentScrollY > 200 && showControls && !showSettings && !showChapters) {
        if (currentScrollY - lastScrollY > 15) {
          setShowControls(false)
          lastScrollY = currentScrollY
        } else if (currentScrollY < lastScrollY) {
          lastScrollY = currentScrollY
        }
      } else {
        lastScrollY = currentScrollY
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showControls, showSettings, showChapters])

  useEffect(() => {
    if (mangaId && chapterId && chaptersData?.data?.length && title) {
      saveReadingHistory(mangaId, chapterId, chaptersData?.data as Chapter[], title, number, lang)
    }
  }, [mangaId, chapterId, chaptersData, title, number, lang])

  const { prevChapter, nextChapter } = useMemo(() => {
    if (!chaptersData?.data || !chapterId) return { prevChapter: null, nextChapter: null }
    const chapters = chaptersData.data
    const currentIndex = chapters.findIndex(ch => ch.id === chapterId)
    if (currentIndex === -1) return { prevChapter: null, nextChapter: null }

    if (order === 'desc') {
      return {
        nextChapter: currentIndex > 0 ? chapters[currentIndex - 1] : null,
        prevChapter: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null
      }
    }

    return {
      nextChapter: currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null,
      prevChapter: currentIndex > 0 ? chapters[currentIndex - 1] : null
    }
  }, [chaptersData, chapterId, order])

  if (isLoading) return <Loading />
  if (isError || error) return <Error />
  if (!chaptersData?.data?.length && isSuccess) return <Error message='Không tìm thấy chapter!' />

  return (
    <div className='bg-black min-h-screen'>
      {/* Manga Content Container with Brightness Filter */}
      <div
        className='transition-all duration-300'
        style={{ filter: `brightness(${brightness}%)` }}
        onClick={() => {
          if (!showChapters && !showSettings) setShowControls(!showControls)
        }}
      >
        {/* Main Image List */}
        <div className='flex flex-col items-center bg-black'>
          <div className='w-full max-w-4xl flex flex-col gap-0'>
            {images?.chapter?.data.map((filename: string, index: number) => (
              <ImageWithLoading
                key={index}
                src={`/api/image?url=${encodeURIComponent(`${images.baseUrl}/data/${images.chapter.hash}/${filename}`)}`}
                alt={`${title} - Chương ${number} - Trang ${index + 1}`}
              />
            ))}
          </div>

          {/* End of Chapter Navigation */}
          <div className='w-full max-w-4xl py-20 px-6 flex flex-col items-center gap-8'>
            <div className='h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent' />

            <div className='text-center space-y-2'>
              <h3 className='text-xl font-display font-black text-white tracking-tight uppercase'>
                Bạn đã đọc hết chương {number}
              </h3>
              <p className='text-xs font-bold text-gray-500 uppercase tracking-widest'>
                Chọn chương tiếp theo để tiếp tục hành trình
              </p>
            </div>

            <div className='flex items-center gap-4 sm:gap-8'>
              <ChapterNavButton
                chapter={prevChapter}
                direction='prev'
                mangaId={mangaId}
                offset={String(offset)}
                langFilterValue={langFilterValue}
                langValue={langValue}
                order={order}
                limit={Number(chaptersData?.limit) ?? 20}
                total={Number(chaptersData?.total) ?? 100}
              />
              <ChapterNavButton
                chapter={nextChapter}
                direction='next'
                mangaId={mangaId}
                offset={String(offset)}
                langFilterValue={langFilterValue}
                langValue={langValue}
                order={order}
                limit={Number(chaptersData?.limit) ?? 20}
                total={Number(chaptersData?.total) ?? 100}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Progress Bar */}
      <div className='fixed top-0 left-0 w-full h-1 z-[100] bg-white/5 pointer-events-none'>
        <motion.div className='h-full bg-primary neon-glow' style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Floating Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* Top Bar */}
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className='fixed top-0 inset-x-0 z-[90] glass-card px-4 md:px-10 py-5 flex items-center justify-between border-b-0'
              onClick={e => e.stopPropagation()}
            >
              <div className='flex items-center gap-6'>
                <button
                  onClick={() => router.push(`/manga-detail/${mangaId}`)}
                  className='p-3 hover:bg-white/10 rounded-full transition-all text-white active:scale-90 cursor-pointer'
                >
                  <FiChevronLeft size={28} />
                </button>
                <div className='space-y-1'>
                  <h2 className='text-xs font-black text-white line-clamp-1 uppercase tracking-[0.2em] opacity-60'>
                    {title}
                  </h2>
                  <div className='flex items-center gap-3'>
                    <ChapterNavButton
                      chapter={prevChapter}
                      direction='prev'
                      mangaId={mangaId}
                      offset={String(offset)}
                      langFilterValue={langFilterValue}
                      langValue={langValue}
                      order={order}
                      limit={Number(chaptersData?.limit) ?? 20}
                      total={Number(chaptersData?.total) ?? 100}
                      variant='minimal'
                    />
                    <p className='text-sm font-black text-primary tracking-widest'>CHƯƠNG {number}</p>
                    <ChapterNavButton
                      chapter={nextChapter}
                      direction='next'
                      mangaId={mangaId}
                      offset={String(offset)}
                      langFilterValue={langFilterValue}
                      langValue={langValue}
                      order={order}
                      limit={Number(chaptersData?.limit) ?? 20}
                      total={Number(chaptersData?.total) ?? 100}
                      variant='minimal'
                    />
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-3 rounded-full transition-all cursor-pointer ${
                    showSettings ? 'bg-primary text-primary-foreground' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <FiSettings size={22} />
                </button>
                <button
                  onClick={() => {
                    setShowSettings(false)
                    setShowChapters(!showChapters)
                  }}
                  className={`p-3 rounded-full transition-all cursor-pointer ${
                    showChapters ? 'bg-primary text-primary-foreground' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <FiMenu size={22} />
                </button>
              </div>
            </motion.div>

          </>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='fixed top-24 right-6 z-[120] w-72 glass-card p-6 rounded-3xl shadow-2xl border-white/10'
            onClick={e => e.stopPropagation()}
          >
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h4 className='text-xs font-black text-white uppercase tracking-[0.2em]'>Tùy chỉnh</h4>
                <button
                  onClick={() => setShowSettings(false)}
                  className='cursor-pointer text-white hover:text-primary transition-colors'
                >
                  <FiX />
                </button>
              </div>

              <div className='space-y-4'>
                <div className='flex items-center justify-between text-xs text-gray-400 font-bold'>
                  <div className='flex items-center gap-2'>
                    <FiSun /> ĐỘ SÁNG
                  </div>
                  <span>{brightness}%</span>
                </div>
                <input
                  type='range'
                  min='30'
                  max='100'
                  value={brightness}
                  onChange={e => setBrightness(Number(e.target.value))}
                  className='w-full h-1.5 bg-white/10 rounded-full appearance-none accent-primary cursor-pointer'
                />
              </div>

              <div className='space-y-4'>
                <div className='flex items-center justify-between text-xs text-gray-400 font-bold'>
                  <div className='flex items-center gap-2'>
                    <FiMaximize /> CHẾ ĐỘ XEM
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <button className='py-2 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase cursor-pointer hover:opacity-70'>
                    Cuộn dọc
                  </button>
                  <button
                    disabled
                    className='disabled:opacity-70 cursor-not-allowed py-2 rounded-xl bg-white/5 text-white text-[10px] font-black uppercase hover:bg-white/10 transition-all'
                  >
                    Webtoon (sắp có?)
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Chapters Menu */}
      <AnimatePresence>
        {showChapters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/80 backdrop-blur-md z-[100]'
              onClick={() => {
                setShowSettings(false)
                setShowChapters(false)
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='fixed top-0 right-0 h-full w-full max-w-md glass-card border-l border-white/5 shadow-2xl z-[110] p-8 overflow-y-auto'
              onClick={e => e.stopPropagation()}
            >
              <div className='flex items-center justify-between mb-10'>
                <div className='space-y-1'>
                  <h3 className='text-2xl font-display font-black text-white tracking-tight'>DANH SÁCH CHƯƠNG</h3>
                  <p className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Chọn chương để đọc</p>
                </div>
                <button
                  onClick={() => setShowChapters(false)}
                  className='p-3 bg-white/5 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer'
                >
                  <FiX size={20} />
                </button>
              </div>
              <MangaChaptersList
                mangaId={mangaId}
                offsetParams={offset}
                chapterId={chapterId}
                langFilterValue={Array.isArray(langFilterValue) ? langFilterValue : [langFilterValue]}
                langValue={langValue}
                order={order}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ScrollToBottomButton />
    </div>
  )
}
