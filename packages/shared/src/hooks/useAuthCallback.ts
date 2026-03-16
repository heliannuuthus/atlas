import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAtlasAuth } from './useAtlasAuth'

/** 从当前 URL 读取 OAuth 回调参数并交换 token，读取后立即清除 URL 防止重复使用 code。 */
export function useAuthCallback(options?: { defaultPath?: string }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { handleCallback } = useAtlasAuth()
  const [processing, setProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const defaultPath = options?.defaultPath ?? '/'
  const initiated = useRef(false)

  useEffect(() => {
    if (initiated.current) return
    initiated.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const errorParam = searchParams.get('error')
    const errorDesc = searchParams.get('error_description')

    window.history.replaceState({}, '', window.location.pathname)

    if (errorParam) {
      setError(errorDesc || errorParam)
      setProcessing(false)
      return
    }

    if (!code) {
      console.log('[Atlas:Auth] useAuthCallback: no code in URL')
      setProcessing(false)
      return
    }

    console.log('[Atlas:Auth] useAuthCallback: exchanging code for tokens...')
    handleCallback(code, state ?? undefined)
      .then(result => {
        console.log('[Atlas:Auth] useAuthCallback: success, result=', result)
        navigate(result.returnTo || defaultPath, { replace: true })
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Token exchange failed')
        setProcessing(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { processing, error }
}
