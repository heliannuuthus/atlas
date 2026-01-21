export class ApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public status?: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return '未知错误'
}
