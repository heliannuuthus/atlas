/**
 * 格式化工具函数
 */

/**
 * 将秒数格式化为人性化的时间字符串
 * @param seconds 秒数
 * @returns 格式化后的字符串，如 "2 小时"、"7 天"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} 秒`
  }

  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} 分钟`
  }

  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    return `${hours} 小时`
  }

  const days = Math.floor(seconds / 86400)
  return `${days} 天`
}

/**
 * 将秒数格式化为详细的时间字符串
 * @param seconds 秒数
 * @returns 格式化后的字符串，如 "2 小时 30 分钟"
 */
export function formatDurationDetailed(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} 秒`
  }

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const parts: string[] = []
  if (days > 0) parts.push(`${days} 天`)
  if (hours > 0) parts.push(`${hours} 小时`)
  if (minutes > 0) parts.push(`${minutes} 分钟`)

  return parts.join(' ') || '0 秒'
}

/**
 * 格式化日期时间
 * @param date 日期字符串或 Date 对象
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 格式化相对时间（如"3 天后过期"）
 * @param date 目标日期
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '-'
  const target = typeof date === 'string' ? new Date(date) : date
  if (isNaN(target.getTime())) return '-'
  const now = new Date()
  const diff = target.getTime() - now.getTime()

  if (diff < 0) {
    return '已过期'
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) {
    return `${days} 天后过期`
  }

  if (hours > 0) {
    return `${hours} 小时后过期`
  }

  return '即将过期'
}

/**
 * 检查日期是否即将过期（7天内）
 * @param date 目标日期
 * @returns 是否即将过期
 */
export function isExpiringSoon(date: string | Date | null | undefined): boolean {
  if (!date) return false

  const target = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  const sevenDays = 7 * 24 * 60 * 60 * 1000

  return diff > 0 && diff < sevenDays
}
