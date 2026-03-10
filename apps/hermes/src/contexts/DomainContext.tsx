import { createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import type { NavigateOptions } from 'react-router-dom'

export const DomainContext = createContext<string | null>(null)

export function useDomainId(): string | null {
  return useContext(DomainContext)
}

export function useBasePath(): string {
  const domainId = useContext(DomainContext)
  if (!domainId) return ''
  return `/d/${encodeURIComponent(domainId)}`
}

/** 在域工作区内使用的 navigate：以 / 开头的路径会自动加上当前 basePath */
export function useAppNavigate() {
  const navigate = useNavigate()
  const basePath = useBasePath()

  return (to: string | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      navigate(to)
      return
    }
    const path = to.startsWith('/d/') || to === '/' ? to : `${basePath}${to.startsWith('/') ? '' : '/'}${to}`
    navigate(path, options)
  }
}
