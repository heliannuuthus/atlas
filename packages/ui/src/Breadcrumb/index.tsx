import { useNavigate, useLocation } from 'react-router-dom'
import { Breadcrumb as AntBreadcrumb } from 'antd'
import type { BreadcrumbProps } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

interface BreadcrumbConfig {
  appName: string
  defaultPath: string
  /** 若提供，面包屑只显示该路径之后的片段，且 navigate 时会拼回此前缀 */
  basePath?: string
  routeNameMap?: Record<string, string>
}

interface AppBreadcrumbProps {
  config: BreadcrumbConfig
}

const defaultRouteNames: Record<string, string> = {
  create: '创建',
  edit: '编辑',
  detail: '详情',
  dashboard: '概览',
}

export function Breadcrumb({ config }: AppBreadcrumbProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const routeNameMap = { ...defaultRouteNames, ...config.routeNameMap }

  const generateBreadcrumbs = (): BreadcrumbProps['items'] => {
    const basePath = config.basePath ?? ''
    const pathForBreadcrumb = basePath
      ? location.pathname === basePath
        ? ''
        : location.pathname.startsWith(basePath + '/')
          ? location.pathname.slice(basePath.length)
          : location.pathname
      : location.pathname
    const pathSegments = pathForBreadcrumb.split('/').filter(Boolean)
    const homeTitle = routeNameMap['home'] ?? '首页'

    if (pathSegments.length === 0) {
      return [
        {
          title: (
            <span className={`${styles.breadcrumbItem} ${styles.moduleRoot}`}>
              {config.appName}
            </span>
          ),
        },
        { title: <span className={`${styles.breadcrumbItem} ${styles.active}`}>{homeTitle}</span> },
      ]
    }

    const items: BreadcrumbProps['items'] = [
      {
        title: (
          <span className={`${styles.breadcrumbItem} ${styles.moduleRoot}`}>{config.appName}</span>
        ),
      },
    ]

    let currentPath = basePath
    pathSegments.forEach((segment, index) => {
      currentPath += (currentPath.endsWith('/') ? '' : '/') + segment
      const isLast = index === pathSegments.length - 1
      const title = routeNameMap[segment] || segment

      items.push({
        title: (
          <span className={`${styles.breadcrumbItem} ${isLast ? styles.active : ''}`}>{title}</span>
        ),
        onClick: isLast ? undefined : () => navigate(currentPath),
      })
    })

    return items
  }

  const breadcrumbItems = generateBreadcrumbs()
  if (!breadcrumbItems || breadcrumbItems.length === 0) return null

  return (
    <div className={styles.breadcrumb}>
      <AntBreadcrumb
        separator={<RightOutlined className={styles.separator} />}
        items={breadcrumbItems}
      />
    </div>
  )
}
