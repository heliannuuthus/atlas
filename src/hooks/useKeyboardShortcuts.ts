import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBusinessStore } from '@/store/business'
import { getEnabledBusinesses } from '@/config/business'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const { setCurrentBusiness } = useBusinessStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifier = isMac ? e.metaKey : e.ctrlKey

      if (!modifier) return

      const businesses = getEnabledBusinesses()

      for (let i = 0; i < businesses.length && i < 9; i++) {
        const key = String(i + 1)
        if (e.key === key) {
          e.preventDefault()
          const business = businesses[i]
          if (business) {
            setCurrentBusiness(business)
            navigate(business.path)
          }
          break
        }
      }

      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [navigate, setCurrentBusiness])
}
