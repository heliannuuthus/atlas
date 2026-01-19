import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { localStorage, STORAGE_KEYS } from '@/utils/storage'

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
    const value = localStorage.get(name)
    return value ? JSON.stringify(value) : null
  },
  setItem: (name: string, value: string): void => {
    localStorage.set(name, JSON.parse(value))
  },
  removeItem: (name: string): void => {
    localStorage.remove(name)
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
      storage: customStorage as any,
    }
  )
)
