'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiSearch, FiZap, FiClock, FiGrid, FiArrowUpRight  } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const truyetranh = process.env.NEXT_PUBLIC_TRUYENTRANH ?? '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setIsMenuOpen(false)
    }
  }

  const navLinks = [
    { href: '/recommendation', label: 'Romcom gợi ý bởi L903-Manga', icon: <FiZap /> },
    { href: '/reading-history', label: 'Lịch sử đọc truyện', icon: <FiClock /> },
    { href: '/filter-search', label: 'Tìm kiếm nâng cao', icon: <FiGrid /> },
    { href: '/random', label: 'Manga Ngẫu nhiên', icon: <FiZap className='rotate-180' /> },
    { href: truyetranh, label: 'L903 Truyện tranh', icon: <FiArrowUpRight /> }
  ]

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-[200] transition-all duration-500 px-4 md:px-8 py-6 ${isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent'
          }`}
      >
        <div className='max-w-screen-2xl mx-auto flex items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center gap-8'>
            <Link
              href='/'
              className='text-2xl font-display font-black text-white tracking-tighter hover:scale-105 transition-transform'
            >
              L903<span className='text-primary neon-glow'>MANGA</span>
            </Link>

            {/* Desktop Links */}
            <div className='hidden xl:flex items-center gap-1'>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:bg-white/5 whitespace-nowrap ${pathname === link.href ? 'text-primary bg-primary/10' : 'text-gray-400'
                    }`}
                >
                  {link.label}
                  {link.href === truyetranh && link.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Search & Actions */}
          <div className='flex items-center gap-4'>
            <form onSubmit={handleSearch} className='hidden md:flex items-center relative group'>
              <FiSearch className='absolute left-4 text-gray-500 group-focus-within:text-primary transition-colors' />
              <input
                type='text'
                placeholder='Tìm truyện...'
                className='pl-12 pr-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white/10 transition-all w-64'
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </form>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-3 bg-white/5 border border-white/10 rounded-2xl text-white lg:hidden hover:bg-white/10 transition-all active:scale-90 cursor-pointer'
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/90 backdrop-blur-2xl z-[210] cursor-pointer'
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className='fixed top-0 right-0 h-full w-full max-w-sm glass-card border-l border-white/5 z-[220] p-10 flex flex-col'
            >
              <div className='flex items-center justify-between mb-12'>
                <span className='text-xl font-display font-black text-white'>MENU</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className='p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all cursor-pointer'
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSearch} className='relative mb-10'>
                <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' />
                <input
                  type='text'
                  placeholder='Tìm truyện...'
                  className='w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50'
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </form>

              <div className='flex-1 space-y-4'>
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className='flex items-center gap-4 p-5 rounded-2xl hover:bg-white/5 transition-all group'
                  >
                    <span className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'>
                      {link.icon}
                    </span>
                    <span className='text-sm font-black text-white uppercase tracking-widest'>{link.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
