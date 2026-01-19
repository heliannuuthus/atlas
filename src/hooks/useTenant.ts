import { useEffect } from 'react'
import { useTenantStore } from '@/store/tenant'
import { mockTenantList } from '@/mock/data/tenant'

/**
 * 租户 Hook
 * 自动初始化租户数据
 */
export function useTenant() {
  const { currentTenant, tenantList, setCurrentTenant, setTenantList } =
    useTenantStore()

  useEffect(() => {
    // 初始化租户列表
    if (tenantList.length === 0) {
      setTenantList(mockTenantList)
      // 设置默认租户
      if (!currentTenant && mockTenantList.length > 0) {
        setCurrentTenant(mockTenantList[0])
      }
    }
  }, [tenantList.length, currentTenant, setTenantList, setCurrentTenant])

  return {
    currentTenant,
    tenantList,
    setCurrentTenant,
  }
}
