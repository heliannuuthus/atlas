import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { useRef } from 'react'
import { Bell, BookOpen, Copy, LogOut, Settings, UserRound } from 'lucide-react'
import { useAtlasAuth } from '@atlas/shared'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/tooltip'
import { toast } from '../../../components/toast'
import styles from './index.module.scss'

const getUserInitials = (name?: string) => {
  if (!name) return 'U'
  const chars = name.trim()
  if (/^[\u4e00-\u9fa5]/.test(chars)) return chars.substring(0, 1)
  const parts = chars.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return chars.substring(0, 2).toUpperCase()
}

const truncateOpenId = (openId: string, head = 8, tail = 4) => {
  if (openId.length <= head + tail + 3) return openId
  return `${openId.slice(0, head)}…${openId.slice(-tail)}`
}

function UserAvatar({
  src,
  name,
  size,
  brandColor,
}: {
  src?: string | null
  name?: string
  size: number
  brandColor: string
}) {
  return (
    <AvatarPrimitive.Root className={styles.avatar} style={{ width: size, height: size }}>
      <AvatarPrimitive.Image src={src ?? undefined} alt="" className={styles.avatarImage} />
      <AvatarPrimitive.Fallback
        className={styles.avatarFallback}
        style={{ backgroundColor: brandColor }}
      >
        {getUserInitials(name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}

interface UserMenuProps {
  brandColor?: string
  docUrl?: string
  showDocs?: boolean
  documentBadge?: boolean
  compact?: boolean
  showNotifications?: boolean
  notificationBadge?: boolean
  variant?: 'default' | 'floating'
  onProfile?: () => void
  onSettings?: () => void
}

export function UserMenu({
  brandColor = '#2557d6',
  docUrl,
  showDocs = false,
  documentBadge = false,
  compact = false,
  showNotifications = true,
  notificationBadge = false,
  variant = 'default',
  onProfile,
  onSettings,
}: UserMenuProps) {
  const { logout, user } = useAtlasAuth()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pointerInteractionRef = useRef(false)
  const userName = user?.nic
  const userAvatar = user?.pic ?? null

  const copyOpenId = async () => {
    if (!user?.sub) return
    await navigator.clipboard.writeText(user.sub)
    toast.success('OpenID 已复制')
  }

  return (
    <div className={styles.actions}>
      {showDocs ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={styles.badgeAnchor}>
              {docUrl ? (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconBtn}
                  aria-label="打开文档"
                >
                  <BookOpen aria-hidden="true" />
                </a>
              ) : (
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.iconBtnDisabled}`}
                  aria-label="文档即将开放"
                  aria-disabled="true"
                  disabled
                >
                  <BookOpen aria-hidden="true" />
                </button>
              )}
              {documentBadge ? (
                <span className={styles.documentDot} style={{ backgroundColor: brandColor }} />
              ) : null}
            </span>
          </TooltipTrigger>
          <TooltipContent>{docUrl ? '文档' : '文档（即将开放）'}</TooltipContent>
        </Tooltip>
      ) : null}

      {showNotifications ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={styles.badgeAnchor}>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label={notificationBadge ? '查看未读通知' : '查看通知'}
              >
                <Bell aria-hidden="true" />
              </button>
              {notificationBadge ? <span className={styles.notificationDot} /> : null}
            </span>
          </TooltipTrigger>
          <TooltipContent>通知</TooltipContent>
        </Tooltip>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            className={`${styles.userTrigger} ${compact ? styles.compact : ''} ${variant === 'floating' ? styles.floating : ''}`}
            aria-label="打开用户菜单"
            onPointerDown={() => {
              pointerInteractionRef.current = true
            }}
            onKeyDown={() => {
              pointerInteractionRef.current = false
            }}
          >
            <UserAvatar src={userAvatar} name={userName} size={32} brandColor={brandColor} />
            {!compact ? (
              <span className={styles.userTriggerText}>
                <span className={styles.userTriggerName}>{userName || '用户'}</span>
                {user?.sub ? (
                  <span className={styles.userTriggerOpenid}>{truncateOpenId(user.sub)}</span>
                ) : null}
              </span>
            ) : null}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          collisionPadding={12}
          className={`${styles.menuPopup} ${variant === 'floating' ? styles.menuPopupFloating : ''}`}
          onPointerDownCapture={() => {
            pointerInteractionRef.current = true
          }}
          onKeyDownCapture={() => {
            pointerInteractionRef.current = false
          }}
          onCloseAutoFocus={event => {
            if (pointerInteractionRef.current) {
              event.preventDefault()
              triggerRef.current?.blur()
            }
            pointerInteractionRef.current = false
          }}
        >
          <div className={styles.userSummary}>
            <UserAvatar src={userAvatar} name={userName} size={38} brandColor={brandColor} />
            <div className={styles.userSummaryText}>
              <strong>{userName || '用户'}</strong>
              {user?.sub ? (
                <span className={styles.userId} translate="no">
                  {truncateOpenId(user.sub, 12, 6)}
                </span>
              ) : (
                <span className={styles.userId}>尚未登录</span>
              )}
            </div>
            {user?.sub ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={() => void copyOpenId()}
                    aria-label="复制 OpenID"
                  >
                    <Copy aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>复制 OpenID</TooltipContent>
              </Tooltip>
            ) : null}
          </div>
          <DropdownMenuSeparator />
          {onProfile ? (
            <DropdownMenuItem onSelect={onProfile}>
              <UserRound aria-hidden="true" />
              个人中心
            </DropdownMenuItem>
          ) : null}
          {onSettings ? (
            <DropdownMenuItem onSelect={onSettings}>
              <Settings aria-hidden="true" />
              设置
            </DropdownMenuItem>
          ) : null}
          {onProfile || onSettings ? <DropdownMenuSeparator /> : null}
          <DropdownMenuItem onSelect={logout} className={styles.logoutItem}>
            <LogOut aria-hidden="true" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
