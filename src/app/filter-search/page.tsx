'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GetMangaByFilterSearch } from '@/codebase/api/manga/get-manga-by-filter-search'
import TagMultiSelect from '@/components/common/tag-multi-select'
// import { Manga } from '@/codebase/api/paginate';
import MangaItems from '@/components/manga/manga-items'
import Pagination from '@/components/common/pagination'
import Loading from '@/components/status/loading'
import Error from '@/components/status/error'

export default function AdvancedSearchPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [year, setYear] = useState<string>('desc')
  const [followedCount, setFollowedCount] = useState<string>('desc')
  const [latestUploadedChapter, setLatestUploadedChapter] = useState<string>('desc')
  const [publicationDemographic, setPublicationDemographic] = useState<string>('none')
  const [contentRating] = useState<string[]>(['safe', 'suggestive', 'erotica'])
  const [offset, setOffset] = useState(0)
  const limit = 20

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const {
    data: result,
    isFetching,
    isError
  } = useQuery(
    GetMangaByFilterSearch({
      id: selectedTags,
      title: debouncedSearch,
      offset,
      limit,
      publicationDemographic,
      followedCount,
      latestUploadedChapter,
      year,
      contentRating
    })
  )

  useEffect(() => {
    setOffset(0)
  }, [debouncedSearch, selectedTags, year, followedCount, latestUploadedChapter, publicationDemographic])

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setDebouncedSearch(search.trim())
    setOffset(0) // Reset offset khi tìm kiếm mới
  }

  return (
    <div className='min-h-screen bg-slate-900 pb-12 pt-8'>
      <div className='max-w-4xl mx-auto p-8 glass-card rounded-3xl shadow-2xl space-y-8 border-white/5'>
        <div className='text-center space-y-2'>
          <h2 className='text-3xl font-display font-black text-white tracking-tight uppercase'>Tìm kiếm nâng cao</h2>
          <div className='h-1 w-20 bg-primary mx-auto rounded-full neon-glow' />
        </div>

        {/* Form nhập tên truyện */}
        <form onSubmit={handleSearch} className='relative group'>
          <input
            type='text'
            placeholder='Tìm theo tên truyện...'
            className='w-full px-6 py-4 rounded-2xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-gray-500 text-sm font-bold transition-all group-hover:bg-white/10'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>

        {/* TagMultiSelect */}
        <div className='space-y-4'>
          <TagMultiSelect setTag={setSelectedTags} selectedTags={selectedTags} />
        </div>

        {/* Các select dropdown */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Publication Demographic */}
          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2'>Nhóm tuổi</label>
            <select
              value={publicationDemographic}
              onChange={e => setPublicationDemographic(e.target.value)}
              className='w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs font-bold transition-all cursor-pointer'
            >
              <option value='none'>Tất cả</option>
              <option value='shounen'>Shounen</option>
              <option value='shoujo'>Shoujo</option>
              <option value='seinen'>Seinen</option>
              <option value='josei'>Josei</option>
            </select>
          </div>

          {/* Year */}
          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2'>Năm xuất bản</label>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className='w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs font-bold transition-all cursor-pointer'
            >
              <option value='desc'>Mới nhất</option>
              <option value='asc'>Cũ nhất</option>
            </select>
          </div>

          {/* Followed Count */}
          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2'>Theo dõi</label>
            <select
              value={followedCount}
              onChange={e => setFollowedCount(e.target.value)}
              className='w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs font-bold transition-all cursor-pointer'
            >
              <option value='desc'>Nhiều nhất</option>
              <option value='asc'>Ít nhất</option>
            </select>
          </div>

          {/* Chap mới */}
          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2'>Cập nhật</label>
            <select
              value={latestUploadedChapter}
              onChange={e => setLatestUploadedChapter(e.target.value)}
              className='w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs font-bold transition-all cursor-pointer'
            >
              <option value='desc'>Mới nhất</option>
              <option value='asc'>Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kết quả tìm kiếm */}
      <div className='max-w-screen-2xl mx-auto mt-16 px-4 md:px-8'>
        {isFetching && <Loading fullScreen={false} />}
        {isError && <Error />}
        {result?.data?.length === 0 && <Error message='Không tìm thấy kết quả phù hợp!' />}

        {result?.data && (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full'>
            {result.data.map(manga => (
              <MangaItems key={manga.id} manga={manga} isResponsive={false} />
            ))}
          </div>
        )}
        <Pagination
          total={result?.total || 0}
          offset={offset}
          limit={limit}
          onPageChange={newOffset => setOffset(newOffset)}
        />
      </div>
    </div>
  )
}
