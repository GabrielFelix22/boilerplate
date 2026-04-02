import type { AxiosError } from 'axios'

const DEFAULT_ERROR_MESSAGE =
	'Ocorreu um erro ao processar sua solicitação. Tente novamente.'
const NETWORK_ERROR_MESSAGE =
	'Não foi possível se conectar ao servidor. Verifique sua internet ou tente novamente mais tarde.'

const isRecord = (value: unknown): value is Record<string, unknown> => {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Extrai recursivamente a primeira mensagem encontrada em uma estrutura de dados
 */
const extractFirstMessage = (input: unknown): string | null => {
	if (!input) return null

	if (typeof input === 'string') {
		const trimmed = input.trim()
		return trimmed.length ? trimmed : null
	}

	if (Array.isArray(input)) {
		for (const item of input) {
			const nested = extractFirstMessage(item)
			if (nested) return nested
		}
		return null
	}

	if (isRecord(input)) {
		for (const value of Object.values(input)) {
			const nested = extractFirstMessage(value)
			if (nested) return nested
		}
	}

	return null
}

/**
 * Resolve a mensagem de erro a partir de um erro do Axios
 * Prioriza mensagens do backend em response.data.message
 */
export const resolveErrorMessage = (error: unknown): string => {
	const err = error as AxiosError | null

	// Erros de rede
	if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
		return NETWORK_ERROR_MESSAGE
	}

	const data = err?.response?.data

	// Se a resposta for uma string simples
	if (typeof data === 'string') {
		const trimmed = data.trim()
		if (trimmed.length) return trimmed
	}

	// Se for um objeto, busca por chaves comuns de mensagem
	if (isRecord(data)) {
		const directKeys = [
			'message',
			'mensagem',
			'detail',
			'erro',
			'error',
			'title',
		] as const
		for (const key of directKeys) {
			const value = data[key]
			if (typeof value === 'string') {
				const trimmed = value.trim()
				if (trimmed.length) return trimmed
			}
		}

		// Busca em estruturas aninhadas
		const nestedMessage = extractFirstMessage(
			data.errors ?? data.erros ?? data.details ?? data.data ?? null,
		)

		if (nestedMessage) return nestedMessage
	}

	// Fallback para a mensagem do axios
	const axiosMessage = err?.message?.trim()
	if (axiosMessage) return axiosMessage

	// Fallback para qualquer erro genérico
	if (error instanceof Error) {
		const fallbackMessage = error.message?.trim()
		if (fallbackMessage) return fallbackMessage
	}

	return DEFAULT_ERROR_MESSAGE
}
