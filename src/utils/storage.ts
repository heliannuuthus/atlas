/**
 * 本地存储工具类
 * 支持 localStorage 和 sessionStorage
 */

export enum StorageType {
  LOCAL = 'localStorage',
  SESSION = 'sessionStorage',
}

class Storage {
  private storage: globalThis.Storage

  constructor(type: StorageType = StorageType.LOCAL) {
    this.storage =
      type === StorageType.LOCAL ? window.localStorage : window.sessionStorage
  }

  /**
   * 设置存储项
   */
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      this.storage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`Storage set error for key "${key}":`, error)
    }
  }

  /**
   * 获取存储项
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = this.storage.getItem(key)
      if (item === null) {
        return defaultValue
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Storage get error for key "${key}":`, error)
      return defaultValue
    }
  }

  /**
   * 删除存储项
   */
  remove(key: string): void {
    try {
      this.storage.removeItem(key)
    } catch (error) {
      console.error(`Storage remove error for key "${key}":`, error)
    }
  }

  /**
   * 清空所有存储项
   */
  clear(): void {
    try {
      this.storage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }

  /**
   * 检查存储项是否存在
   */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null
  }

  /**
   * 获取所有键
   */
  keys(): string[] {
    return Object.keys(this.storage)
  }

  /**
   * 获取存储大小（字节）
   */
  size(): number {
    let total = 0
    for (const key in this.storage) {
      if (this.storage.hasOwnProperty(key)) {
        total +=
          this.storage[key].length + key.length
      }
    }
    return total
  }
}

// 导出单例
export const localStorage = new Storage(StorageType.LOCAL)
export const sessionStorage = new Storage(StorageType.SESSION)

// 存储键常量
export const STORAGE_KEYS = {
  CURRENT_TENANT: 'current_tenant',
  TENANT_LIST: 'tenant_list',
  MINIPROGRAM_LIST: 'miniprogram_list',
  MINIPROGRAM_DETAIL: 'miniprogram_detail',
} as const
