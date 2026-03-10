/**
 * 延迟函数，用于模拟 API 请求
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
