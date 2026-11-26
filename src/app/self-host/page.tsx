'use client'

import { FaGithub, FaCode, FaRocket } from 'react-icons/fa'

export default function SelfHostPage() {
  return (
    <div className='min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden'>
      {/* Background decoration (lightweight radial gradients) */}
      <div className='pointer-events-none absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle,rgba(37,99,235,0.14)_0%,transparent_70%)] rounded-full' />
      <div className='pointer-events-none absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[radial-gradient(circle,rgba(147,51,234,0.14)_0%,transparent_70%)] rounded-full' />

      <div className='max-w-3xl w-full text-center z-10'>
        <div className='flex justify-center mb-8'></div>

        <h1 className='text-5xl md:text-7xl font-extrabold mb-6 tracking-tight'>
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500'>
            L903 Manga
          </span>
        </h1>

        <p className='text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed font-light'>
          Dự án nhằm mục đích học tập và nghiên cứu, bạn có thể tự deploy{' '}
          <span className='text-blue-400 font-medium'>L903 Manga</span> của riêng mình bằng source code sau:
        </p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left'>
          <div className='p-6 bg-slate-800/90 border border-slate-700/50 rounded-2xl'>
            <FaCode className='text-blue-400 mb-4 text-2xl' />
            <h3 className='font-bold mb-2'>Mã nguồn mở</h3>
            <p className='text-slate-400 text-sm'>
              Toàn bộ code được công khai trên GitHub, dễ dàng tùy chỉnh theo ý muốn.
            </p>
          </div>
          <div className='p-6 bg-slate-800/90 border border-slate-700/50 rounded-2xl'>
            <FaRocket className='text-purple-400 mb-4 text-2xl' />
            <h3 className='font-bold mb-2'>Triển khai nhanh</h3>
            <p className='text-slate-400 text-sm'>Hỗ trợ Vercel, Netlify và Docker. Chỉ cần 1-click để bắt đầu.</p>
          </div>
          <div className='p-6 bg-slate-800/90 border border-slate-700/50 rounded-2xl'>
            <FaGithub className='text-indigo-400 mb-4 text-2xl' />
            <h3 className='font-bold mb-2'>Cộng đồng</h3>
            <p className='text-slate-400 text-sm'>Luôn cập nhật các tính năng mới nhất từ cộng đồng đóng góp.</p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <a
            href='https://github.com/toaducz/l903-manga'
            target='_blank'
            rel='noopener noreferrer'
            className='group relative flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full text-lg font-bold transition-colors duration-200 hover:bg-slate-200 cursor-pointer shadow-xl'
          >
            <FaGithub className='text-2xl' />
            Truy cập GitHub ngay
          </a>

          <button disabled className='flex items-center gap-2 text-slate-500 cursor-not-allowed px-6 py-3 font-medium'>
            Tài liệu hướng dẫn (Sắp tới)
          </button>
        </div>
      </div>

      <div className='mt-20 text-slate-600 text-sm font-mono'>
        © 2024 L903 Manga Project • Built with Love & Open Source
      </div>
    </div>
  )
}
