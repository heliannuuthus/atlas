import { useMemo } from 'react'
import { Select, Avatar } from 'antd'
import { useTenant } from '@/hooks/useTenant'
import styles from './index.module.scss'

export function TenantSelector() {
  const { currentTenant, tenantList, setCurrentTenant } = useTenant()

  const handleChange = (value: string) => {
    const tenant = tenantList.find(t => t.id === value)
    if (tenant) {
      setCurrentTenant(tenant)
    }
  }

  const selectStyle = useMemo<React.CSSProperties>(
    () => ({
      width: 200,
    }),
    []
  )

  return (
    <Select
      value={currentTenant?.id}
      onChange={handleChange}
      style={selectStyle}
      placeholder="选择租户"
    >
      {tenantList.map(tenant => (
        <Select.Option key={tenant.id} value={tenant.id}>
          <div className={styles.option}>
            {tenant.logo && <Avatar src={tenant.logo} size={20} className={styles.avatar} />}
            <span>{tenant.name}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  )
}
