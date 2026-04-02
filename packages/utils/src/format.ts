/**
 * Faz o parsing de uma data para um objeto Date.
 * Aceita Date, string ISO, ou timestamp numérico.
 */
export function parseDate(
	value: Date | string | number | null | undefined,
): Date | null {
	if (!value) return null

	const date = value instanceof Date ? value : new Date(value)
	return isNaN(date.getTime()) ? null : date
}

export function formatDate(
	date: Date | string | number | null | undefined,
	opts: Intl.DateTimeFormatOptions = {},
	locale = 'pt-BR',
): string {
	const parsed = parseDate(date)
	if (!parsed) return ''

	return new Intl.DateTimeFormat(locale, {
		day: opts.day ?? '2-digit',
		month: opts.month ?? '2-digit',
		year: opts.year ?? 'numeric',
		...opts,
	}).format(parsed)
}

export function toIsoDate(value: Date | string | number | undefined) {
	if (!value) return ''

	try {
		if (value instanceof Date) {
			return value.toISOString().slice(0, 10)
		}

		if (typeof value === 'number') {
			return new Date(value).toISOString().slice(0, 10)
		}

		const str = String(value)

		if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
			return str.slice(0, 10)
		}

		return new Date(str).toISOString().slice(0, 10)
	} catch (_err) {
		return ''
	}
}

export type DeadlineInfo = {
	remainingDays: number
	label: string
	formattedDate: string
}

export const getDeadlineInfo = (
	value: string | Date | number | null | undefined,
	locale = 'pt-BR',
): DeadlineInfo | null => {
	const target = parseDate(value)
	if (!target) return null

	const startOfDay = (d: Date) => {
		const copy = new Date(d.getTime())
		copy.setHours(0, 0, 0, 0)
		return copy
	}

	const today = startOfDay(new Date())
	const deadline = startOfDay(target)

	const msPerDay = 1000 * 60 * 60 * 24
	const diffMs = deadline.getTime() - today.getTime()
	const remainingDays = Math.ceil(diffMs / msPerDay)

	let label
	if (remainingDays === 0) {
		label = 'Último dia'
	} else if (remainingDays < 0) {
		label = 'Prazo esgotado'
	} else {
		label = `${remainingDays} dia(s) restante(s)`
	}

	return {
		remainingDays,
		label,
		formattedDate: formatDate(target, {}, locale),
	}
}

/**
 * Converte DateTime ISO-8601 (YYYY-MM-DDTHH:mm:ss.sssZ) para Date ISO (YYYY-MM-DD)
 */
export function isoDateTimeToIsoDate(isoDateTime?: string | null): string {
	if (!isoDateTime) return ''
	return isoDateTime.split('T')[0]
}

/**
 * Converte uma data no formato ISO (YYYY-MM-DD) para ISO-8601 DateTime (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
export function isoDateToIsoDateTime(isoDate?: string): string | undefined {
	if (!isoDate) return undefined
	if (isoDate.includes('T')) return isoDate
	return `${isoDate}T00:00:00.000Z`
}

/**
 * Extrai UID de um arquivo remoto baseado na URL ou do campo remoteUid
 * @param file - Arquivo com propriedades remoteUrl e remoteUid opcionais
 * @returns UID do arquivo ou undefined se não for um arquivo remoto
 */
export function getRemoteFileUid(file: File & { remoteUrl?: string; remoteUid?: string }): string | undefined {
	if (file.remoteUid) return file.remoteUid
	if (!file.remoteUrl) return undefined
	const parts = file.remoteUrl.split('/')
	const lastPart = parts[parts.length - 1]
	return lastPart.split('?')[0]
}

/**
 * Filtra arquivos que são novos (não remotos)
 */
export function filterNewFiles(files: File[]): File[] {
	return files.filter((file: File & { remoteUrl?: string }) => !file.remoteUrl)
}

/**
 * Gera um ID aleatório com o comprimento especificado
 */
export function generateId({ length = 8 }: { length?: number } = {}): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

// ========================================
// Brazilian Format Utilities
// ========================================

/**
 * Formata um valor em centavos para moeda BRL
 * @param value - String contendo apenas dígitos (valor em centavos)
 * @example formatCurrency('150000') // 'R$ 1.500,00'
 */
export const formatCurrency = (value: string) => {
	const digits = value.replace(/\D/g, '')
	if (!digits) return ''
	const numberValue = Number(digits) / 100
	return numberValue.toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	})
}

/**
 * Formata um número de matrícula de imóvel com pontos separadores
 * @param value - Número da matrícula (pode conter caracteres não numéricos)
 * @example formatMatricula('123456789') // '123.456.789'
 */
export const formatMatricula = (value: string) => {
	const digits = value.replace(/\D/g, '').slice(0, 12)
	return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Formata um CPF ou CNPJ com pontuação
 * @param value - Número do CPF ou CNPJ (pode conter caracteres não numéricos)
 * @example formatCpfCnpj('12345678901') // '123.456.789-01'
 * @example formatCpfCnpj('12345678000195') // '12.345.678/0001-95'
 */
export const formatCpfCnpj = (value: string) => {
	const digits = value.replace(/\D/g, '').slice(0, 14)

	if (digits.length <= 11) {
		const p1 = digits.slice(0, 3)
		const p2 = digits.slice(3, 6)
		const p3 = digits.slice(6, 9)
		const p4 = digits.slice(9, 11)

		let result = [p1, p2, p3].filter(Boolean).join('.')
		if (p4) result += `${result ? '-' : ''}${p4}`
		return result
	}

	const p1 = digits.slice(0, 2)
	const p2 = digits.slice(2, 5)
	const p3 = digits.slice(5, 8)
	const p4 = digits.slice(8, 12)
	const p5 = digits.slice(12, 14)

	let result = [p1, p2, p3].filter(Boolean).join('.')
	if (p4) result += `/${p4}`
	if (p5) result += `-${p5}`
	return result
}
