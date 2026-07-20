import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, importSPKI, decodeJwt } from 'jose'
import { formatKey } from '@/codebase/utils/format'

const BYPASS_PREFIXES = ['/_next/', '/api/']
const BYPASS_EXACT = ['/self-host', '/favicon.ico', '/robots.txt', '/login']

export async function middleware(request: NextRequest) {
  if (process.env.DISABLE_MIDDLEWARE === 'true') {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  if (BYPASS_EXACT.includes(pathname) || BYPASS_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  let accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  let isValid = false

  if (accessToken) {
    try {
      const publicKeyStr = process.env.JWT_PUBLIC || ''
      if (publicKeyStr) {
        const formattedKey = formatKey(publicKeyStr, 'PUBLIC')
        const publicKey = await importSPKI(formattedKey, 'RS256')
        await jwtVerify(accessToken, publicKey)
        isValid = true
      }
    } catch (error) {
      console.error('JWT validation failed in middleware:', error)
    }
  }

  // Thử refresh token nếu access token hết hạn hoặc không có
  if (!isValid && refreshToken) {
    try {
      const body = new URLSearchParams()
      body.append('refreshToken', refreshToken)

      const res = await fetch(`${process.env.ENDPOINT_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-api-key': process.env.SCERET_KEY || ''
        },
        body: body.toString()
      })

      const data = await res.json()

      if (res.ok && data.status && data.accessToken) {
        accessToken = data.accessToken
        isValid = true

        // Pass the new access token to the downstream Server Components
        const requestHeaders = new Headers(request.headers)
        request.cookies.set('accessToken', accessToken as string)
        requestHeaders.set('cookie', request.cookies.toString())

        const response = NextResponse.next({
          request: {
            headers: requestHeaders
          }
        })

        // Decode to get exact expiration from backend
        const accessPayload = decodeJwt(accessToken as string)

        // Also set the cookie for the browser
        response.cookies.set('accessToken', accessToken as string, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          expires: accessPayload.exp ? new Date(accessPayload.exp * 1000) : undefined
        })
        return response
      } else {
        console.error('Refresh token API returned error:', data)
      }
    } catch (refreshError) {
      console.error('Refresh token failed:', refreshError)
    }
  }

  if (isValid) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/self-host'
  const response = NextResponse.redirect(url)
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|img|favicon.ico).*)']
}
