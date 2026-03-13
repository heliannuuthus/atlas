import { useRequest } from 'ahooks'
import type { Service, Options } from 'ahooks/lib/useRequest/src/types'

export function useApi<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>
) {
  return useRequest(service, {
    ...options,
    onError: (error, params) => {
      console.error('API Error:', error)
      options?.onError?.(error, params)
    },
  })
}
