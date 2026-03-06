import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckOutlined, HomeOutlined } from '@ant-design/icons'
import { useBusinessStore } from '@/store/business'
import {
  businessConfigs,
  getEnabledBusinesses,
} from '@/config/business'
import styles from './index.module.scss'

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M16.5 7.5l-2.8 6.2-6.2 2.8 2.8-6.2 6.2-2.8z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="white" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function GuideBall() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentBusiness, setCurrentBusiness } = useBusinessStore()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)

  const enabledBusinesses = getEnabledBusinesses()

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as Node
    if (
      panelRef.current &&
      !panelRef.current.contains(target) &&
      ballRef.current &&
      !ballRef.current.contains(target)
    ) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, handleClickOutside])

  const handleServiceClick = (bizId: string) => {
    if (bizId === 'home') {
      navigate('/')
      setOpen(false)
      return
    }
    const target = enabledBusinesses.find((b) => b.id === bizId)
    if (target) {
      if (target.id !== currentBusiness?.id) {
        setCurrentBusiness(target)
        const config = businessConfigs[target.id]
        navigate(config?.defaultPath || target.path)
      }
      setOpen(false)
    }
  }

  const isActive = (bizId: string) => {
    return location.pathname.startsWith(`/${bizId}`)
  }

  return (
    <div className={styles.container}>
      {open && (
        <div ref={panelRef} className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>切换服务</span>
          </div>
          <div className={styles.serviceList}>
            {enabledBusinesses.map((biz) => {
              const active = isActive(biz.id)
              const initial = biz.name.charAt(0).toUpperCase()
              return (
                <div
                  key={biz.id}
                  className={`${styles.serviceItem} ${active ? styles.active : ''}`}
                  onClick={() => handleServiceClick(biz.id)}
                >
                  <div
                    className={styles.serviceAvatar}
                    style={{
                      backgroundColor: active ? biz.color : `${biz.color}18`,
                      color: active ? '#fff' : biz.color,
                    }}
                  >
                    {initial}
                  </div>
                  <div className={styles.serviceInfo}>
                    <span className={styles.serviceName}>{biz.name}</span>
                    {biz.description && (
                      <span className={styles.serviceDesc}>{biz.description}</span>
                    )}
                  </div>
                  {active && <CheckOutlined className={styles.checkIcon} />}
                </div>
              )
            })}
          </div>
          <div className={styles.panelFooter}>
            <div
              className={styles.homeLink}
              onClick={() => handleServiceClick('home')}
            >
              <HomeOutlined />
              <span>返回主页</span>
            </div>
          </div>
        </div>
      )}

      <div
        ref={ballRef}
        className={`${styles.ball} ${open ? styles.ballOpen : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className={styles.ballInner}>
          <CompassIcon className={`${styles.ballIcon} ${open ? styles.hidden : ''}`} />
          <CloseIcon className={`${styles.ballIcon} ${open ? '' : styles.hidden}`} />
        </div>
        {!open && <div className={styles.ballRing} />}
      </div>
    </div>
  )
}
