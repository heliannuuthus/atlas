/** 应用侧 URI 校验：重定向 URI、跨域源、登出 URI 需符合安全限制 */

const FORBIDDEN_SCHEMES = ['javascript', 'data', 'file', 'vbscript']
const MAX_URI_LEN = 512

function isSecureOrigin(url: URL): boolean {
  if (url.protocol === 'https:') return true
  if (url.protocol === 'http:') {
    const host = url.hostname.toLowerCase()
    return host === 'localhost' || host === '127.0.0.1'
  }
  return false
}

export function validateRedirectUri(uri: string): string | null {
  const trimmed = uri.trim()
  if (!trimmed) return 'URI 不能为空'
  if (trimmed.length > MAX_URI_LEN) return `URI 长度不能超过 ${MAX_URI_LEN} 字符`
  try {
    const u = new URL(trimmed)
    if (!u.protocol || !u.host) return '必须包含 scheme 和 host'
    const scheme = u.protocol.replace(':', '').toLowerCase()
    if (FORBIDDEN_SCHEMES.includes(scheme)) return `不允许使用 ${scheme} 协议`
    if (!isSecureOrigin(u)) return '必须使用 https（localhost 除外）'
    return null
  } catch {
    return 'URI 格式无效'
  }
}

export function validateAllowedOrigin(origin: string): string | null {
  const trimmed = origin.trim()
  if (!trimmed) return '跨域源不能为空'
  if (trimmed.length > MAX_URI_LEN) return `跨域源长度不能超过 ${MAX_URI_LEN} 字符`
  try {
    const u = new URL(trimmed)
    if (!u.protocol || !u.host) return '必须包含 scheme 和 host'
    if (u.pathname && u.pathname !== '/') return '跨域源不应包含路径（仅 scheme://host[:port]）'
    const scheme = u.protocol.replace(':', '').toLowerCase()
    if (FORBIDDEN_SCHEMES.includes(scheme)) return `不允许使用 ${scheme} 协议`
    if (!isSecureOrigin(u)) return '必须使用 https（localhost 除外）'
    return null
  } catch {
    return '跨域源格式无效'
  }
}

export function validateRedirectUrisMultiLine(value: string): string | null {
  const lines = value.split('\n').map((s) => s.trim()).filter(Boolean)
  for (let i = 0; i < lines.length; i++) {
    const err = validateRedirectUri(lines[i])
    if (err) return `第 ${i + 1} 行: ${err}`
  }
  return null
}

export function validateRedirectUrisArray(uris: string[]): string | null {
  for (let i = 0; i < uris.length; i++) {
    const err = validateRedirectUri(uris[i])
    if (err) return `第 ${i + 1} 项: ${err}`
  }
  return null
}

export function validateAllowedOriginsArray(origins: string[]): string | null {
  for (let i = 0; i < origins.length; i++) {
    const err = validateAllowedOrigin(origins[i])
    if (err) return `第 ${i + 1} 项: ${err}`
  }
  return null
}

export function validateLogoutUrisArray(uris: string[]): string | null {
  for (let i = 0; i < uris.length; i++) {
    const err = validateRedirectUri(uris[i])
    if (err) return `第 ${i + 1} 项: ${err}`
  }
  return null
}

export function validateAllowedOriginsMultiLine(value: string): string | null {
  const lines = value.split('\n').map((s) => s.trim()).filter(Boolean)
  for (let i = 0; i < lines.length; i++) {
    const err = validateAllowedOrigin(lines[i])
    if (err) return `第 ${i + 1} 行: ${err}`
  }
  return null
}

export function validateLogoutUrisMultiLine(value: string): string | null {
  const lines = value.split('\n').map((s) => s.trim()).filter(Boolean)
  for (let i = 0; i < lines.length; i++) {
    const err = validateRedirectUri(lines[i])
    if (err) return `第 ${i + 1} 行: ${err}`
  }
  return null
}
