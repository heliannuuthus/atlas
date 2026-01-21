import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/utils/storage'

export interface Tenant {
  id: string
  name: string
  code: string
  logo?: string
  description?: string
}

interface TenantState {
  currentTenant: Tenant | null
  tenantList: Tenant[]
  setCurrentTenant: (tenant: Tenant | null) => void
  setTenantList: (list: Tenant[]) => void
}

const customStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = window.localStorage.getItem(name)
      return value
    } catch (error) {
      console.error(`Storage getItem error for "${name}":`, error)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      window.localStorage.setItem(name, value)
    } catch (error) {
      console.error(`Storage setItem error for "${name}":`, error)
    }
  },
  removeItem: (name: string): void => {
    try {
      window.localStorage.removeItem(name)
    } catch (error) {
      console.error(`Storage removeItem error for "${name}":`, error)
    }
  },
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      currentTenant: null,
      tenantList: [],
      setCurrentTenant: (tenant) => set({ currentTenant: tenant }),
      setTenantList: (list) => set({ tenantList: list }),
    }),
    {
      name: STORAGE_KEYS.CURRENT_TENANT,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storage: customStorage as any,
    }
  )
)
