import { useEffect } from 'react'

type VlibrasPosition = 'TR' | 'TL' | 'BR' | 'BL'

type VlibrasWidgetProps = {
	position?: VlibrasPosition
}

const VLIBRAS_SCRIPT_SRC = 'https://vlibras.gov.br/app/vlibras-plugin.js'
const VLIBRAS_ROOT_PATH = 'https://vlibras.gov.br/app'
const VLIBRAS_DEFAULT_POSITION: VlibrasPosition = 'TR'

let vlibrasInitialized = false
let vlibrasInitializing = false
let scriptPromise: Promise<void> | null = null

export const VlibrasWidget = ({ position = VLIBRAS_DEFAULT_POSITION }: VlibrasWidgetProps) => {
	useEffect(() => {
		if (vlibrasInitialized || vlibrasInitializing) {
			return
		}

		vlibrasInitializing = true

		const loadScript = () => {
			if (scriptPromise) return scriptPromise

			scriptPromise = new Promise<void>((resolve, reject) => {
				if ((window as any).VLibras) return resolve()

				const existingScript = document.querySelector(
					`script[src="${VLIBRAS_SCRIPT_SRC}"]`
				) as HTMLScriptElement | null

				if (existingScript) {
					existingScript.addEventListener('load', () => resolve(), { once: true })
					existingScript.addEventListener(
						'error',
						() => reject(new Error('Failed to load existing VLibras script')),
						{ once: true }
					)
					return
				}

				const script = document.createElement('script')
				script.src = VLIBRAS_SCRIPT_SRC
				script.async = true
				script.onload = () => resolve()
				script.onerror = () => reject(new Error('Failed to load VLibras script'))
				document.body.appendChild(script)
			}).catch(error => {
				scriptPromise = null
				throw error
			})

			return scriptPromise
		}

		const ensureWidgetStructure = () => {
			let widgetContainer = document.querySelector('[vw]') as HTMLElement | null

			if (!widgetContainer) {
				widgetContainer = document.createElement('div')
				widgetContainer.setAttribute('vw', '')
				widgetContainer.className = 'enabled'

				const accessButton = document.createElement('div')
				accessButton.setAttribute('vw-access-button', '')
				accessButton.className = 'active'

				const pluginWrapper = document.createElement('div')
				pluginWrapper.setAttribute('vw-plugin-wrapper', '')

				const topWrapper = document.createElement('div')
				topWrapper.className = 'vw-plugin-top-wrapper'

				pluginWrapper.appendChild(topWrapper)
				widgetContainer.appendChild(accessButton)
				widgetContainer.appendChild(pluginWrapper)

				document.body.appendChild(widgetContainer)
			}

			return widgetContainer
		}

		const initWidget = async () => {
			try {
				await loadScript()
				ensureWidgetStructure()

				const VLibras = (window as any).VLibras

				if (VLibras && VLibras.Widget) {
					new VLibras.Widget({
						rootPath: VLIBRAS_ROOT_PATH,
						position,
					})
					const pluginOnLoad = window.onload
					vlibrasInitialized = true

					if (document.readyState === 'complete' && typeof pluginOnLoad === 'function') {
						pluginOnLoad.call(window, new Event('load'))
					}
				}
			} catch (error) {
			} finally {
				vlibrasInitializing = false
			}
		}

		initWidget()
	}, [position])

	return null
}
