import { useState } from 'react'
import Image from 'next/image'

interface ImageWithLoadingProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
}

export const ImageWithLoading = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false
}: ImageWithLoadingProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div>
      <div className={`relative w-full max-w-screen-md min-h-[500px] ${className}`}>
        {!isLoaded && (
          <div className='absolute inset-0 flex items-center justify-center bg-slate-900 rounded shadow-lg'>
            <div className='flex flex-col items-center gap-3 text-gray-400'>
              <div className='w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin' />
              <span className='text-xs font-bold uppercase tracking-widest'>Đang tải trang...</span>
            </div>
          </div>
        )}
        <Image
          unoptimized
          src={src}
          alt={alt}
          width={800}
          height={1200}
          loading={loading}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          className={`rounded shadow-lg ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </div>
  )
}
