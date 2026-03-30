import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { Button } from './button'
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip'
import { toast } from './sonner'
import { Check, Copy } from 'lucide-react'
import { cn } from '../lib/utils'

type CopyButtonProps = {
	html?: string
	text?: string | null
	displayValue?: ReactNode
	tooltipContent?: ReactNode
	mode?: 'icon' | 'text'
	variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link'
	size?: 'default' | 'sm' | 'lg' | 'icon'
	disabled?: boolean
	ariaLabelCopy?: string
	ariaLabelCopied?: string
	className?: string
	buttonProps?: Omit<
		React.ComponentProps<typeof Button>,
		'onClick' | 'variant' | 'size' | 'aria-label' | 'disabled' | 'children'
	>
}

export const CopyButton = ({
	html,
	text,
	displayValue,
	tooltipContent,
	mode = 'icon',
	variant,
	size,
	disabled,
	ariaLabelCopy = 'Copiar texto',
	ariaLabelCopied = 'Copiado',
	className,
	buttonProps,
}: CopyButtonProps) => {
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (!copied) return
		const timeout = setTimeout(() => setCopied(false), 1500)
		return () => clearTimeout(timeout)
	}, [copied])

	const handleCopy = async () => {
		if (!html && !text) return

		const hasClipboard =
			typeof navigator !== 'undefined' &&
			typeof navigator.clipboard !== 'undefined' &&
			typeof navigator.clipboard.writeText === 'function'
		if (!hasClipboard) {
			toast.error('API de área de transferência não disponível neste navegador.')
			return
		}

		try {
			let plainText = text ?? ''

			const sanitizedHtml = html ? DOMPurify.sanitize(html, {
				ALLOWED_TAGS: [
					'p', 'br', 'strong', 'em', 'u', 's', 'span', 'div',
					'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
					'ul', 'ol', 'li',
					'blockquote', 'code', 'pre',
					'a', 'img',
					'table', 'thead', 'tbody', 'tr', 'th', 'td',
				],
				ALLOWED_ATTR: [
					'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
					'class', 'style', 'id',
				],
				KEEP_CONTENT: true,
			}) : ''

			// Se não veio text explícito, tenta extrair do HTML
			if (!plainText && sanitizedHtml && typeof window !== 'undefined') {
				const div = document.createElement('div')
				div.innerHTML = sanitizedHtml
				plainText = div.innerText
			}
			plainText = plainText ?? ''
			if (!sanitizedHtml && !plainText) return

			const supportsHtmlClipboard =
				typeof navigator !== 'undefined' &&
				navigator.clipboard &&
				'write' in navigator.clipboard &&
				typeof ClipboardItem !== 'undefined'

			if (supportsHtmlClipboard && sanitizedHtml) {
				const htmlBlob = new Blob([sanitizedHtml], { type: 'text/html' })
				const textBlob = new Blob([plainText], { type: 'text/plain' })
				const item = new ClipboardItem({
					'text/html': htmlBlob,
					'text/plain': textBlob,
				})
				await navigator.clipboard.write([item])
			} else {
				await navigator.clipboard.writeText(plainText)
			}

			toast.success('Copiado para a área de transferência.')
			setCopied(true)
		} catch (e) {
			toast.error('Não foi possível copiar o texto.')
		}
	}

	const resolvedTooltip = tooltipContent ?? (copied ? 'Copiado!' : 'Copiar texto')
	const resolvedVariant = mode === 'text' ? (variant ?? 'ghost') : (variant ?? 'outline')
	const resolvedSize = mode === 'text' ? (size ?? 'default') : (size ?? 'icon')
	const defaultTextValue = (
		<span className="truncate font-mono text-xs font-normal">
			{displayValue ?? text ?? ''}
		</span>
	)

	const content = mode === 'text'
		? defaultTextValue
		: (
			<span
				className={`inline-flex items-center justify-center transition-transform duration-150 ${copied ? 'scale-110 rotate-3' : 'scale-100'
					}`}
			>
				{copied ? <Check size={18} /> : <Copy size={18} />}
			</span>
		)

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant={resolvedVariant}
					size={resolvedSize}
					onClick={handleCopy}
					disabled={disabled}
					aria-label={copied ? ariaLabelCopied : ariaLabelCopy}
					className={cn(
						mode === 'text' ? 'h-fit max-w-full justify-start p-0' : undefined,
						className,
						buttonProps?.className,
					)}
					{...buttonProps}
				>
					{content}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				{resolvedTooltip}
			</TooltipContent>
		</Tooltip>
	)
}
