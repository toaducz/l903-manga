import Link from 'next/link'

export default function LandingHomepage() {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white px-4'>
      <h1 className='text-4xl md:text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 h-20'>
        L903 Manga
      </h1>
      <p className='text-lg md:text-xl text-gray-200 mb-10 text-center max-w-2xl font-light'>
        Chào mừng bạn đến với L903 Manga — nền tảng đọc truyện tranh hiện đại, sử dụng dữ liệu từ MangaDex.
      </p>
      <Link href='/' replace>
        <button className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg cursor-pointer active:scale-95 transition-all'>
          Trải nghiệm L903 Manga
        </button>
      </Link>
      <h1 className='pt-10 text-4xl md:text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 h-40'>
        Mangadex vừa bị đấm bị cú siêu đau nên khả năng truyện hay bay màu rồi nhé!
      </h1>

      <Link href='https://mangadex.org/compliance/copyright-faq' replace>
        <p className='italic pt-5 underline underline-offset-4 cursor-pointer active:scale-95 transition-all'>
          Chi tiết sự việc
        </p>
      </Link>
    </main>
  )
}
