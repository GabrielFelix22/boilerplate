export function formatDate(date: Date | undefined): string {
  if (!date) return ''
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function generateId({ length = 8 }: { length?: number } = {}): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

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