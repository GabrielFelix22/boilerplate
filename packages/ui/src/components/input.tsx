import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@repo/ui'

type InputProps = React.ComponentProps<'input'>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		const [show, setShow] = React.useState(false)
		const isPassword = type === 'password'
		const inputType = isPassword ? (show ? 'text' : 'password') : type
		const disabled = props.disabled

		if (!isPassword) {
			return (
				<input
					ref={ref}
					type={inputType}
					data-slot='input'
					className={cn(
						'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
						'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
						'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
						className
					)}
					{...props}
				/>
			)
		}

		return (
			<div className='relative'>
				<input
					ref={ref}
					type={inputType}
					data-slot='input'
					className={cn(
						'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
						'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
						'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
						className
					)}
					{...props}
				/>

				<button
					type='button'
					onMouseDown={e => e.preventDefault()}
					onClick={() => setShow(v => !v)}
					disabled={disabled}
					aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
					title={show ? 'Ocultar senha' : 'Mostrar senha'}
					className={cn(
						'absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-md',
						'disabled:opacity-50 disabled:cursor-not-allowed'
					)}
				>
					{show ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
				</button>
			</div>
		)
	}
)

Input.displayName = 'Input'
