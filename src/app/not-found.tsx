import Image from 'next/image'
import Link from 'next/link'
import bocchi from '@/assets/image/mie.jpg'

export default function NotFoundPage() {
  return (
    <div className='fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black text-slate-100 px-6 py-12'>
      <div className='flex flex-col items-center text-center  space-y-6'>
        <Image
          unoptimized
          src={bocchi}
          alt='Not Found'
          width={150}
          height={150}
          className='rounded-lg mb-6 object-contain'
        />

        <h1 className='text-2xl md:text-3xl font-bold mb-3'>Đang phát triển...</h1>
        <p>Hiện trang này đang được phát triển hoặc không tồn tại, bạn quay lại sau nhé!</p>
        <Link
          href='/'
          className='mt-3 inline-block px-5 py-2 bg-gray-700 text-white font-medium rounded-lg hover:opacity-80 transition'
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  )
}