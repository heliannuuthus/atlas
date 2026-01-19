import { ReactNode } from 'react'
import { useTenant } from '@/hooks/useTenant'

interface LayoutProviderProps {
  children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  // 初始化租户数据
  useTenant()

  return <>{children}</>
}
