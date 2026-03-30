import { useEffect, type ReactNode } from 'react'

const DEFAULT_IDLE_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const DEFAULT_ACTIVITY_EVENTS: ReadonlyArray<string> = [
    'mousemove',
    'mousedown',
    'keydown',
    'touchstart',
    'scroll',
    'visibilitychange',
]

type IdleSessionProviderProps = {
    children: ReactNode
    onIdle: () => void
    isActive?: boolean
    timeoutMs?: number
    events?: ReadonlyArray<string>
}

export const IdleSessionProvider = ({
    children,
    onIdle,
    isActive = true,
    timeoutMs = DEFAULT_IDLE_TIMEOUT_MS,
    events = DEFAULT_ACTIVITY_EVENTS,
}: IdleSessionProviderProps) => {
    useEffect(() => {
        if (!isActive)
            return

        if (typeof window === 'undefined')
            return

        let timer: ReturnType<typeof setTimeout> | null = null

        const clearTimer = () => {
            if (timer)
                clearTimeout(timer)
            timer = null
        }

        const startTimer = () => {
            clearTimer()
            timer = setTimeout(onIdle, timeoutMs)
        }

        const handleActivity = () => {
            if (document.hidden)
                return

            startTimer()
        }

        startTimer()

        events.forEach(event =>
            window.addEventListener(event, handleActivity, true),
        )

        return () => {
            clearTimer()
            events.forEach(event =>
                window.removeEventListener(event, handleActivity, true),
            )
        }
    }, [isActive, onIdle, timeoutMs, events])

    return <>{children}</>
}
