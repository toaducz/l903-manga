import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing url', { status: 400 })
  }

  try {
    const parsedUrl = new URL(url)

    // Cho phép domain ảnh bìa và ảnh nội dung
    const allowedDomains = ['uploads.mangadex.org', 'mangadex.network']

    const isAllowed = allowedDomains.some(domain => parsedUrl.hostname.endsWith(domain))

    if (!isAllowed) {
      return new NextResponse('URL not allowed', { status: 403 })
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'L903-Manga',
        Referer: 'https://mangadex.org' // Để vượt qua hotlink protection
      },
      cache: 'force-cache', // Cache trên server Next.js
      next: { revalidate: 86400 } // Revalidate sau 24h
    })

    if (!res.ok) {
      return new NextResponse('Failed to fetch image', { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'image/png'
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.byteLength.toString()
      }
    })
  } catch (err) {
    console.error('Proxy error:', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
