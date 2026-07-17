type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

type HeaderType = Record<string, string>

export async function request<T, P extends Record<string, unknown> = Record<string, unknown>>(
  endpoint: string,
  method: MethodType = 'GET',
  payload?: P,
  url?: string,
  headers: HeaderType = {}
): Promise<T> {
  const isServer = typeof window === 'undefined'

  if (isServer) {
    const searchParams = new URLSearchParams()

    if (payload) {
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => searchParams.append(key, String(val)))
        } else {
          searchParams.append(key, String(value))
        }
      })
    }

    const targetUrl = `https://api.mangadex.org/${endpoint}?${searchParams.toString()}`

    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
        'User-Agent': 'L903-Manga',
        ...headers
      },
      next: { revalidate: 3600 } // Default revalidate 1 hour for server fetches
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Server request failed: ${response.status} - ${errorBody}`)
    }

    return response.json() as T
  } else {
    const searchParams = new URLSearchParams()

    if (method === 'GET' && payload) {
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(val => searchParams.append(key, String(val)))
        } else {
          searchParams.append(key, String(value))
        }
      })
    }

    searchParams.set('endpoint', endpoint)

    const proxyUrl = `/api/proxy?${searchParams.toString()}`

    const response = await fetch(proxyUrl, {
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
        ...headers
      }
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Request failed: ${response.status} - ${errorBody}`)
    }

    try {
      return (await response.json()) as T
    } catch (error) {
      console.error('Failed to parse response', error)
      throw new Error('Invalid JSON response')
    }
  }
}
