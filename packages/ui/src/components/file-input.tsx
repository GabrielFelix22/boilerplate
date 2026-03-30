import * as React from 'react'
import { cn } from '@repo/ui'
import { Label } from './label'
import { Button } from './button'
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip'
import { Trash2, UploadCloud } from 'lucide-react'

function formatFileSize(bytes: number) {
	if (!Number.isFinite(bytes) || bytes <= 0) return ' '
	const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const
	let i = 0
	let n = bytes

	while (n >= 1024 && i < units.length - 1) {
		n /= 1024
		i++
	}

	const value = n >= 10 || i === 0 ? Math.round(n) : Math.round(n * 10) / 10
	return `${value} ${units[i]}`
}

type Texts = {
	dropHere: string
	invalidType: string
	tooMany: (max: number) => string
	tooLarge: (maxMb: number) => string
}

function defaultTexts(): Texts {
	return {
		dropHere: 'Clique ou arraste arquivos aqui',
		invalidType: 'Alguns arquivos têm um tipo inválido',
		tooMany: m => `Você pode adicionar no máximo ${m} arquivo(s)`,
		tooLarge: m => `Alguns arquivos ultrapassam o tamanho máximo de ${m} MB`,
	}
}

function fileKey(f: File) {
	return `${f.name}-${f.size}-${f.lastModified}`
}

function matchesAccept(file: File, accept?: string): boolean {
	if (!accept) return true

	const tokens = accept
		.split(',')
		.map(s => s.trim().toLowerCase())
		.filter(Boolean)

	if (!tokens.length) return true

	const name = file.name.toLowerCase()
	const type = file.type.toLowerCase()

	return tokens.some(token => {
		if (token.startsWith('.')) return name.endsWith(token)
		if (token.endsWith('/*')) {
			const base = token.slice(0, -2)
			return type.startsWith(`${base}/`)
		}
		if (token.includes('/')) return type === token
		return false
	})
}

function formatAcceptLabel(
	accept?: string,
	maxFileSizeMb?: number,
	overrideLabel?: string,
): string | null {
	if (overrideLabel) {
		return maxFileSizeMb
			? `${overrideLabel} até ${maxFileSizeMb} MB`
			: overrideLabel
	}

	if (!accept) {
		return maxFileSizeMb ? `Até ${maxFileSizeMb} MB` : null
	}

	const tokens = accept
		.split(',')
		.map(t => t.trim())
		.filter(Boolean)

	if (!tokens.length) {
		return maxFileSizeMb ? `Até ${maxFileSizeMb} MB` : null
	}

	const labelFor = (token: string) => {
		const l = token.toLowerCase()

		if (l === 'image/*') return 'Imagem'
		if (l === 'application/pdf') return 'PDF'
		if (l === 'text/plain') return 'TXT'
		if (l.startsWith('.')) return l.slice(1).toUpperCase()

		if (l.includes('/')) {
			const [, subtype] = l.split('/')
			return subtype.toUpperCase()
		}

		return token
	}

	const labels = tokens.map(labelFor)

	let base: string
	if (labels.length === 1) base = labels[0]
	else if (labels.length === 2) base = `${labels[0]} ou ${labels[1]}`
	else base = `${labels.slice(0, -1).join(', ')} ou ${labels[labels.length - 1]}`

	return maxFileSizeMb ? `${base} até ${maxFileSizeMb} MB` : base
}

export type RemoteFileLike = {
	name?: string | null
	url?: string | null
	uid?: string | null
}

type FileWithRemote = File & { remoteUrl?: string; remoteUid?: string }

export const createRemoteFile = (
	remote?: RemoteFileLike | string | null,
): File | null => {
	if (!remote) return null

	if (typeof remote !== 'string') {
		const url = remote.url?.trim()
		const name = remote.name?.trim()
		const uid = remote.uid?.trim()
		if (!url) return null

		const finalName = name || url.split('/').pop() || 'arquivo-remoto'
		const file = new File([], finalName, {
			lastModified: 0,
			type: 'application/octet-stream',
		}) as FileWithRemote

		file.remoteUrl = url
		if (uid) file.remoteUid = uid
		return file
	}

	const url = remote.trim()
	if (!url) return null

	const name = url.split('/').pop() || 'arquivo-remoto'
	const file = new File([], name, {
		lastModified: 0,
		type: 'application/octet-stream',
	}) as FileWithRemote

	file.remoteUrl = url
	return file
}

export const openFileInNewTab = (file: FileWithRemote) => {
	const href = file.remoteUrl ?? URL.createObjectURL(file)
	window.open(href, '_blank', 'noopener')

	if (!file.remoteUrl) {
		setTimeout(() => URL.revokeObjectURL(href), 5000)
	}
}

type FileItemProps = {
	file: File
	onRemove?: () => void
	onClick?: () => void
	disabled?: boolean
	disableRemove?: boolean
}

const FileItem = ({
	file,
	onRemove,
	onClick,
	disabled,
	disableRemove,
}: FileItemProps) => {
	const sizeText = formatFileSize(file.size)
	const removeDisabled = disabled || disableRemove || !onRemove

	const NameTag = onClick ? 'button' : 'span'
	const nameProps = onClick
		? {
				type: 'button' as const,
				onClick,
				className:
					'truncate text-left font-medium underline underline-offset-2',
		  }
		: {
				className: 'truncate font-medium',
		  }

	return (
		<div className='flex h-11 items-center justify-between gap-3 rounded-md border bg-card px-3 text-sm'>
			<div className='flex min-w-0 flex-col'>
				<NameTag {...nameProps} title={file.name}>
					{file.name}
				</NameTag>
				<span className='text-xs text-muted-foreground'>{sizeText}</span>
			</div>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						type='button'
						variant='ghost'
						size='icon-sm'
						onClick={removeDisabled ? undefined : onRemove}
						disabled={removeDisabled}
						aria-label={`Remover ${file.name}`}
						className='text-destructive hover:text-destructive/90 disabled:opacity-40'
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Remover</TooltipContent>
			</Tooltip>
		</div>
	)
}

export type FileInputProps = {
	label?: string
	helperText?: string
	containerClassName?: string
	className?: string
	disabled?: boolean
	accept?: string
	multiple?: boolean
	maxFiles?: number
	maxFileSizeMb?: number
	value?: File[]
	defaultValue?: File[]
	onChange?: (files: File[]) => void
	onFileClick?: (file: File) => void
	texts?: Partial<Texts>
	acceptLabel?: string
	allowRemoteDelete?: boolean
	dropDescription?: string
}

export function FileInput({
	label,
	helperText,
	containerClassName,
	className,
	disabled,
	accept,
	multiple = true,
	maxFiles,
	maxFileSizeMb,
	value,
	defaultValue,
	onChange,
	onFileClick,
	texts: textsOverride,
	acceptLabel,
	allowRemoteDelete = false,
	dropDescription,
}: FileInputProps) {
	const texts = { ...defaultTexts(), ...textsOverride }
	const [files, setFiles] = React.useState<File[]>(() => value ?? defaultValue ?? [])
	const inputRef = React.useRef<HTMLInputElement | null>(null)
	const [error, setError] = React.useState<string | null>(null)
	const [isDragging, setIsDragging] = React.useState(false)

	const acceptText = formatAcceptLabel(accept, maxFileSizeMb, acceptLabel)

	React.useEffect(() => {
		if (value) setFiles(value)
	}, [value])

	const applyChange = React.useCallback(
		(next: File[]) => {
			if (disabled) return
			setFiles(next)
			onChange?.(next)
		},
		[onChange, disabled],
	)

	const handlePick = () => {
		if (disabled) return
		inputRef.current?.click()
	}

	const addFiles = (incoming: FileList | File[]) => {
		if (disabled) return

		setError(null)

		const incomingArr = Array.from(incoming)

		let arr = incomingArr.filter(f => matchesAccept(f, accept))
		const rejectedType = incomingArr.length !== arr.length

		let rejectedSize = false
		if (maxFileSizeMb) {
			const limitBytes = maxFileSizeMb * 1024 * 1024
			const sizeFiltered = arr.filter(f => f.size <= limitBytes)
			rejectedSize = sizeFiltered.length !== arr.length
			arr = sizeFiltered
		}

		if (rejectedType) {
			setError(texts.invalidType)
		} else if (rejectedSize && maxFileSizeMb) {
			setError(texts.tooLarge(maxFileSizeMb))
		}

		const limit = multiple ? maxFiles ?? Infinity : 1

		if (limit === 1) {
			if (arr.length > 0) {
				applyChange([arr[arr.length - 1]])
			}
			return
		}

		const merged = [...files]
		for (const f of arr) {
			if (merged.length >= limit) break
			const key = fileKey(f)
			if (!merged.some(e => fileKey(e) === key)) merged.push(f)
		}

		if (merged.length > limit) {
			setError(texts.tooMany(limit))
			merged.splice(limit)
		}

		applyChange(merged)
	}

	const onInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
		if (e.target.files) addFiles(e.target.files)
		e.currentTarget.value = ''
	}

	const handleRemove = (idx: number) => {
		if (disabled) return
		const next = files.slice()
		next.splice(idx, 1)
		applyChange(next)
	}

	const handleDragOver: React.DragEventHandler<HTMLDivElement> = e => {
		e.preventDefault()
		e.stopPropagation()
		if (disabled) return
		setIsDragging(true)
	}

	const handleDragEnter: React.DragEventHandler<HTMLDivElement> = e => {
		e.preventDefault()
		e.stopPropagation()
		if (disabled) return
		setIsDragging(true)
	}

	const handleDragLeave: React.DragEventHandler<HTMLDivElement> = e => {
		e.preventDefault()
		e.stopPropagation()
		if (disabled) return
		setIsDragging(false)
	}

	const handleDrop: React.DragEventHandler<HTMLDivElement> = e => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
		if (disabled) return

		const droppedFiles = e.dataTransfer?.files
		if (droppedFiles && droppedFiles.length > 0) {
			addFiles(droppedFiles)
		}
	}

	const buildItemProps = (f: File, i: number): FileItemProps => {
		const fileWithRemote = f as FileWithRemote
		const isRemote = !!fileWithRemote.remoteUrl

		const handleItemClick = () => {
			if (onFileClick) {
				onFileClick(f)
				return
			}
			openFileInNewTab(fileWithRemote)
		}

		const canRemove = !isRemote || allowRemoteDelete

		return {
			file: f,
			onRemove: canRemove ? () => handleRemove(i) : undefined,
			onClick: handleItemClick,
			disabled,
			disableRemove: !canRemove,
		}
	}

	return (
		<div className={cn('relative grid w-full gap-2', containerClassName)}>
			{label ? <Label>{label}</Label> : null}

			<input
				ref={inputRef}
				type='file'
				className='absolute left-0 top-0 h-px w-px opacity-0'
				onChange={onInputChange}
				accept={accept}
				multiple={multiple}
				disabled={disabled}
				aria-hidden
			/>

			<div
				onClick={handlePick}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				role='button'
				tabIndex={disabled ? -1 : 0}
				aria-disabled={disabled}
				className={cn(
					'group/file-input flex h-24 w-full flex-col items-center justify-center gap-2 rounded-md border bg-muted/40 px-4 text-center text-sm transition',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
					disabled
						? 'cursor-not-allowed opacity-70'
						: 'cursor-pointer hover:bg-muted/70',
					isDragging && !disabled && 'border-primary bg-primary/5 border-2',
					'border-input',
					className,
				)}
			>
				<UploadCloud className='h-6 w-6 text-muted-foreground group-hover/file-input:text-foreground' />
				<p className='text-sm text-muted-foreground'>{texts.dropHere}</p>
				{acceptText ? (
					<p className='text-xs text-muted-foreground'>{acceptText}</p>
				) : null}
				{dropDescription ? (
					<p className='text-xs text-muted-foreground text-balance'>{dropDescription}</p>
				) : null}
			</div>

			{files.length > 0 && (
				<div className='flex max-h-60 flex-col gap-2 overflow-y-auto pr-1'>
					{files.map((f, i) => (
						<FileItem key={fileKey(f)} {...buildItemProps(f, i)} />
					))}
				</div>
			)}

			{helperText ? (
				<p className='text-xs text-muted-foreground'>{helperText}</p>
			) : null}
			{error ? <p className='text-xs text-destructive'>{error}</p> : null}
		</div>
	)
}
