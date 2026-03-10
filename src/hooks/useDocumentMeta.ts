import { useEffect } from 'react'
import { useBusinessStore } from '@/store/business'

const DEFAULT_TITLE = 'Atlas'

export function useDocumentMeta() {
  const currentBusiness = useBusinessStore(s => s.currentBusiness)

  useEffect(() => {
    if (currentBusiness) {
      document.title = `${currentBusiness.name} - ${DEFAULT_TITLE}`
    } else {
      document.title = DEFAULT_TITLE
    }
  }, [currentBusiness])
}
