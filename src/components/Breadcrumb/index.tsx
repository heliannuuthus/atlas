import { useNavigate, useLocation } from 'react-router-dom'
import { Breadcrumb as AntBreadcrumb } from 'antd'
import type { BreadcrumbProps } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { useBusinessStore } from '@/store/business'
import { businessConfigs } from '@/config/business'
import styles from './index.module.scss'

const routeNameMap: Record<string, string> = {
  zwei: 'Zwei',
  hermes: 'Hermes',
  domains: '域管理',
  services: '服务管理',
  applications: '应用管理',
  relationships: '关系管理',
  groups: '组管理',
  create: '创建',
  edit: '编辑',
  detail: '详情',
}

export function Breadcrumb() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentBusiness } = useBusinessStore()

  const generateBreadcrumbs = (): BreadcrumbProps['items'] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    
    if (pathSegments.length === 0) {
      return []
    }

    const items: BreadcrumbProps['items'] = []
    let currentPath = ''
    const moduleRootIndex = 0

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      const isModuleRoot = index === moduleRootIndex
      
      let title = routeNameMap[segment] || segment
      let path: string | undefined = currentPath
      
      if (index === 0) {
        const business = currentBusiness || businessConfigs[segment]?.module
        if (business) {
          title = business.name
          path = businessConfigs[segment]?.defaultPath || business.path
        }
      } else if (index === 1 && pathSegments[0] === 'hermes') {
        const menu = businessConfigs.hermes?.menus.find(m => m.path.includes(segment))
        if (menu) {
          title = menu.label
          path = menu.path
        }
      } else if (index === 2) {
        if (segment === 'create') {
          title = '创建'
          path = undefined
        } else if (segment === 'edit') {
          title = '编辑'
          path = undefined
        } else if (!isNaN(Number(segment))) {
          title = '详情'
          path = undefined
        }
      } else if (index === 3 && segment === 'edit') {
        title = '编辑'
        path = undefined
      }

      items.push({
        title: (
          <span className={`${styles.breadcrumbItem} ${isLast ? styles.active : ''} ${isModuleRoot ? styles.moduleRoot : ''}`}>
            {title}
          </span>
        ),
        onClick: isLast || !path || isModuleRoot ? undefined : () => navigate(path!),
      })
    })

    return items
  }

  const breadcrumbItems = generateBreadcrumbs()

  if (breadcrumbItems.length === 0) {
    return null
  }

  return (
    <div className={styles.breadcrumb}>
      <AntBreadcrumb
        separator={<RightOutlined className={styles.separator} />}
        items={breadcrumbItems}
      />
    </div>
  )
}
