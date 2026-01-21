import { useEffect, useRef } from 'react'
import { useTenantStore } from '@/store/tenant'
import { mockTenantList } from '@/mock/data/tenant'

/**
 * 租户 Hook
 * 自动初始化租户数据
 */
export function useTenant() {
  const { currentTenant, tenantList, setCurrentTenant, setTenantList } =
    useTenantStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return

    try {
      const store = useTenantStore.getState()
      if (store.tenantList.length === 0) {
        setTenantList(mockTenantList)
        if (!store.currentTenant && mockTenantList.length > 0) {
          setCurrentTenant(mockTenantList[0])
        }
      }
      initialized.current = true
    } catch (error) {
      console.error('Failed to initialize tenant:', error)
      initialized.current = true
    }
  }, [])

  return {
    currentTenant,
    tenantList,
    setCurrentTenant,
  }
}
