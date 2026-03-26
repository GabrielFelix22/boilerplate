export function resolveErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object') {
    if ('response' in error) {
      const res = (error as { response?: { data?: { message?: string } } }).response
      if (res?.data?.message) return res.data.message
    }
    if ('message' in error) return String((error as { message: unknown }).message)
  }
  return 'Ocorreu um erro inesperado'
}