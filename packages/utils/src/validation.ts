/**
 * Remove todos os caracteres não numéricos de uma string
 */
export const stripNonDigits = (value: string) => value.replace(/\D/g, '')

/**
 * Valida se um CPF é válido
 */
export const isValidCpf = (value: string) => {
	const cpf = stripNonDigits(value)
	if (cpf.length !== 11) return false
	if (/^(\d)\1{10}$/.test(cpf)) return false

	const calcCheckDigit = (base: string, factorStart: number) => {
		let sum = 0
		for (let i = 0; i < base.length; i++) {
			sum += Number(base[i]) * (factorStart - i)
		}
		const remainder = sum % 11
		return remainder < 2 ? 0 : 11 - remainder
	}

	const d1 = calcCheckDigit(cpf.slice(0, 9), 10)
	const d2 = calcCheckDigit(cpf.slice(0, 10), 11)

	return d1 === Number(cpf[9]) && d2 === Number(cpf[10])
}

/**
 * Valida se um CNPJ é válido
 */
export const isValidCnpj = (value: string) => {
	const cnpj = stripNonDigits(value)
	if (cnpj.length !== 14) return false
	if (/^(\d)\1{13}$/.test(cnpj)) return false

	const calcCheckDigit = (base: string, weights: number[]) => {
		const sum = base
			.split('')
			.reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0)

		const remainder = sum % 11
		return remainder < 2 ? 0 : 11 - remainder
	}

	const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
	const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

	const d1 = calcCheckDigit(cnpj.slice(0, 12), firstWeights)
	const d2 = calcCheckDigit(cnpj.slice(0, 13), secondWeights)

	return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13])
}

/**
 * Valida se um valor é um CPF ou CNPJ válido
 */
export const isValidCpfOrCnpj = (value: string) => {
	const digits = stripNonDigits(value)
	if (digits.length === 11) return isValidCpf(digits)
	if (digits.length === 14) return isValidCnpj(digits)
	return false
}

/**
 * Valida se uma senha atende aos requisitos de segurança:
 * mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 caractere especial
 */
export const isStrongPassword = (value: string) =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /[0-9]/.test(value) &&
  /[^A-Za-z0-9]/.test(value)

/**
 * Valida se uma string está no formato de data ISO (YYYY-MM-DD)
 */
export const isValidIsoDate = (s: string) => {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s))
	if (!m) return false
	const y = Number(m[1])
	const mo = Number(m[2])
	const d = Number(m[3])
	const dt = new Date(y, mo - 1, d)
	return (
		dt.getFullYear() === y &&
		dt.getMonth() === mo - 1 &&
		dt.getDate() === d
	)
}

/**
 * Verifica se uma data ISO (YYYY-MM-DD) é uma data no passado
 */
export const isPastDate = (s: string) => {
	if (!isValidIsoDate(s)) return false

	const [y, mo, d] = s.split('-').map(Number)
	const dt = new Date(y, mo - 1, d)

	const today = new Date()
	today.setHours(0, 0, 0, 0)

	return dt < today
}
