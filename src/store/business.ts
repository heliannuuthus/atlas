import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BusinessModule } from '@/types/business'
import { getCurrentBusiness, getEnabledBusinesses } from '@/config/business'

interface BusinessState {
  currentBusiness: BusinessModule | null
  recentBusinesses: BusinessModule[]
  setCurrentBusiness: (business: BusinessModule | null) => void
  addRecentBusiness: (business: BusinessModule) => void
  getRecentBusinesses: () => BusinessModule[]
}

const customStorage = {
  getItem: (name: string): string | null => {
    try {
      return window.localStorage.getItem(name)
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

const MAX_RECENT = 5

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      currentBusiness: null,
      recentBusinesses: [],
      setCurrentBusiness: business => {
        set({ currentBusiness: business })
        if (business) {
          get().addRecentBusiness(business)
        }
      },
      addRecentBusiness: business => {
        const { recentBusinesses } = get()
        const filtered = recentBusinesses.filter(b => b.id !== business.id)
        const updated = [business, ...filtered].slice(0, MAX_RECENT)
        set({ recentBusinesses: updated })
      },
      getRecentBusinesses: () => {
        const { recentBusinesses } = get()
        const enabled = getEnabledBusinesses()
        return recentBusinesses.filter(b => enabled.some(e => e.id === b.id))
      },
    }),
    {
      name: 'business',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storage: customStorage as any,
    }
  )
)

export function syncBusinessFromPath(pathname: string) {
  const business = getCurrentBusiness(pathname)
  if (business) {
    useBusinessStore.getState().setCurrentBusiness(business)
  }
}
