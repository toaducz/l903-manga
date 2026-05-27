import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SubmitButton } from '@/components/common/submit-button'
import { decodeJwt } from 'jose'

type LoginSuccessResponse = {
    status: true;
    accessToken: string;
    refreshToken: string;
}

type LoginErrorResponse = {
    success: false;
    statusCode: number;
    path: string;
    message: string;
    remainingTime?: number;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const error = params?.error as string | undefined

    async function handleLogin(formData: FormData) {
        'use server'

        const username = formData.get('username') as string
        const password = formData.get('password') as string

        if (!username || !password) {
            redirect('/login?error=Vui lòng nhập tài khoản và mật khẩu')
        }

        let redirectUrl = '/'

        try {
            const urlEncodedBody = new URLSearchParams()
            urlEncodedBody.append('username', username)
            urlEncodedBody.append('password', password)

            const headersList = await headers()
            const userAgent = headersList.get('user-agent') || ''

            const res = await fetch(`${process.env.ENDPOINT_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-api-key': process.env.SCERET_KEY || '',
                    'user-agent': userAgent
                },
                body: urlEncodedBody
            })

            const data = await res.json() as LoginResponse

            if ('status' in data && data.status === true) {
                const cookieStore = await cookies()

                // Decode tokens to extract exact expiration dates
                const accessPayload = decodeJwt(data.accessToken)
                const refreshPayload = decodeJwt(data.refreshToken)

                cookieStore.set('accessToken', data.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    expires: accessPayload.exp ? new Date(accessPayload.exp * 1000) : undefined
                })

                cookieStore.set('refreshToken', data.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    expires: refreshPayload.exp ? new Date(refreshPayload.exp * 1000) : undefined
                })
            } else if ('success' in data && data.success === false) {
                let errorMessage = data.message || 'Đăng nhập thất bại'
                if (data.statusCode === 429 && data.remainingTime) {
                    errorMessage = `Bạn đã gọi quá giới hạn. Vui lòng thử lại sau ${data.remainingTime} giây.`
                }
                redirectUrl = `/login?error=${encodeURIComponent(errorMessage)}`
            } else {
                redirectUrl = '/login?error=Lỗi phản hồi không hợp lệ từ máy chủ'
            }
        } catch (err) {
            console.error('Login error:', err)
            redirectUrl = '/login?error=Lỗi kết nối đến máy chủ'
        }

        redirect(redirectUrl)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-[#121212] p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-800">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Đăng Nhập
                    </h2>
                </div>

                {error && (
                    <div className="rounded-md bg-red-900/50 p-4 border border-red-500/50">
                        <p className="text-sm text-red-200 text-center">{error}</p>
                    </div>
                )}

                <form action={handleLogin} className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                Tài khoản
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Nhập tài khoản"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                            />
                        </div>
                    </div>

                    <div>
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    )
}
