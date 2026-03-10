import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from 'antd'
import { BookOutlined, ApartmentOutlined, CheckOutlined, HomeOutlined } from '@ant-design/icons'
import { servicePlatforms, type ServicePlatformId } from '@/config/services'
import type { ServicePlatform } from '@/types/service'
import styles from './index.module.scss'

const iconMap: Record<string, React.ReactNode> = {
  zwei: <BookOutlined />,
  hermes: <ApartmentOutlined />,
}

const serviceRouteMap: Record<string, string> = {
  zwei: '/zwei',
  hermes: '/hermes/domains',
}

export function ServiceSwitcher() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [pulsing, setPulsing] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // 根据当前路径判断当前服务
  const getCurrentServiceId = (): ServicePlatformId | null => {
    const path = location.pathname
    if (path.startsWith('/zwei')) return 'zwei'
    if (path.startsWith('/hermes')) return 'hermes'
    if (path.startsWith('/chaos')) return 'chaos'
    return null
  }

  const currentServiceId = getCurrentServiceId()

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsing(prev => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (open) {
      queueMicrotask(() => setPulsing(false))
    }
  }, [open])

  useEffect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget as Node | null
      if (containerRef.current && relatedTarget && !containerRef.current.contains(relatedTarget)) {
        setOpen(false)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  const handleServiceClick = (service: (typeof servicePlatforms)[number]) => {
    const serviceWithUrl = service as ServicePlatform & { url?: string }

    // 如果配置了外部 URL，跳转到外部
    if (serviceWithUrl.url) {
      window.location.assign(serviceWithUrl.url)
      return
    }

    // 如果是当前服务，不跳转
    if (service.id === currentServiceId) {
      setOpen(false)
      return
    }

    // 跳转到对应服务的默认路由
    const route = serviceRouteMap[service.id]
    if (route) {
      navigate(route)
    }

    setOpen(false)
  }

  const handleWaveBarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate('/')
    setOpen(false)
  }

  const homeIconButtonStyle = useMemo<React.CSSProperties>(
    () => ({
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      background: 'transparent',
      borderRadius: 6,
      color: '#8c8c8c',
      fontSize: 18,
      boxShadow: 'none',
    }),
    []
  )

  return (
    <div ref={containerRef} className={styles.container} onMouseEnter={() => setOpen(true)}>
      <div className={styles.waveBar} onClick={handleWaveBarClick} title="返回主页">
        <div className={`${styles.waveIndicator} ${pulsing && !open ? styles.pulsing : ''}`} />
      </div>

      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.brandLeft}>
              <div className={styles.logo}>
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="atlasLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1890ff" />
                      <stop offset="50%" stopColor="#722ed1" />
                      <stop offset="100%" stopColor="#13c2c2" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" r="28" fill="url(#atlasLogoGradient)" opacity="0.1" />
                  <path
                    d="M32 12 L42 24 L38 28 L32 20 L26 28 L22 24 Z"
                    fill="url(#atlasLogoGradient)"
                    opacity="0.9"
                  />
                  <path
                    d="M32 20 L42 32 L38 36 L32 28 L26 36 L22 32 Z"
                    fill="url(#atlasLogoGradient)"
                    opacity="0.7"
                  />
                  <path
                    d="M32 28 L42 40 L38 44 L32 36 L26 44 L22 40 Z"
                    fill="url(#atlasLogoGradient)"
                    opacity="0.5"
                  />
                  <circle cx="32" cy="32" r="3" fill="url(#atlasLogoGradient)" />
                </svg>
              </div>
              <div className={styles.brandName}>Atlas</div>
            </div>
            <div className={styles.panelHeaderRight}>
              <div className={styles.brandSlogan}>统一管理平台</div>
              <Button
                type="text"
                onClick={() => {
                  navigate('/')
                  setOpen(false)
                }}
                style={homeIconButtonStyle}
                title="返回主页"
                icon={<HomeOutlined />}
              />
            </div>
          </div>
          <div className={styles.platformList}>
            {servicePlatforms.map(service => {
              const isActive = service.id === currentServiceId
              return (
                <div
                  key={service.id}
                  className={`${styles.platformItem} ${isActive ? styles.active : ''}`}
                  onClick={() => handleServiceClick(service)}
                >
                  <div className={styles.platformIcon} style={{ color: service.color }}>
                    {iconMap[service.id]}
                  </div>
                  <div className={styles.platformInfo}>
                    <div className={styles.platformName}>{service.name}</div>
                    <div className={styles.platformDesc}>{service.description}</div>
                  </div>
                  {isActive && <CheckOutlined className={styles.checkIcon} />}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
