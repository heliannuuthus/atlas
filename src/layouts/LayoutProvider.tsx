import type { ReactNode } from 'react'
import { useTenant } from '@/hooks/useTenant'

interface LayoutProviderProps {
  children: ReactNode
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  useTenant()

  return <>{children}</>
}
