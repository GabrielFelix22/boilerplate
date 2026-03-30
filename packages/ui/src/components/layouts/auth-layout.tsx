import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card'

export interface AuthLayoutProps {
	title: string
	description: string
	children: ReactNode
	smartSkyUrl?: string
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-6 p-6 md:p-10 bg-white">
				<div className="flex justify-center lg:hidden!">
					<img
						src="/prefeitura/sehab_preto.png"
						alt="Logo Prefeitura de São Paulo"
						className="w-xs object-contain"
					/>
				</div>

				<div className="flex flex-1 items-center justify-center">
					<Card className="border shadow-none w-full max-w-sm">
						<CardHeader>
							<CardTitle>{title}</CardTitle>
							<CardDescription>{description}</CardDescription>
						</CardHeader>

						<CardContent>{children}</CardContent>
					</Card>
				</div>
			</div>

			<div className="relative hidden lg:flex items-center justify-center bg-primary">
				<img
					src="/prefeitura/sehab_branco.png"
					alt="Logo Prefeitura de São Paulo"
					className="max-w-[50%] max-h-[50%] object-contain"
				/>
			</div>
		</div>
	)
}
