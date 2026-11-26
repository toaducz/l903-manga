// app/api/proxy/route.ts
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Missing endpoint' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const params = new URLSearchParams(searchParams)
  params.delete('endpoint') // tránh lặp

  const url = `https://api.mangadex.org/${endpoint}?${params.toString()}`
  const isDynamicEndpoint = endpoint.includes('random') || endpoint.startsWith('at-home/server')

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'L903-Manga',
        Accept: 'application/json'
      },
      ...(isDynamicEndpoint ? { cache: 'no-store' as const } : { next: { revalidate: 300 } })
    })

    if (!res.ok) {
      const errorText = await res.text()
      return new Response(JSON.stringify({ error: errorText || 'Upstream request failed' }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...(isDynamicEndpoint
          ? { 'Cache-Control': 'no-store' }
          : { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' })
      }
    })
  } catch (error) {
    console.error('API proxy error:', error)
    return new Response(JSON.stringify({ error: 'Internal proxy error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
