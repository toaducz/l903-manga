'use client'
import Image from 'next/image'

interface LoadingProps {
  fullScreen?: boolean
}

export default function Loading({ fullScreen = true }: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center bg-transparent ${
        fullScreen ? 'min-h-screen' : 'py-16'
      }`}
    >
      <div>
        <Image
          unoptimized
          src='/kobo.webp'
          alt='Loading...'
          width={300}
          height={225}
          className='object-contain'
          priority={fullScreen}
        />
      </div>
    </div>
  )
}
