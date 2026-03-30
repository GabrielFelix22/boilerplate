import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

export { toast } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {

    return (
        <Sonner
            theme='light'
            className="toaster group"
            richColors
            icons={{
                success: <CircleCheckIcon className="size-4 text-[color:var(--success)]" />,
                info: <InfoIcon className="size-4 text-[color:var(--info)]" />,
                warning: <TriangleAlertIcon className="size-4 text-[color:var(--warning)]" />,
                error: <OctagonXIcon className="size-4 text-[color:var(--destructive)]" />,
                loading: <Loader2Icon className="size-4 animate-spin text-[color:var(--info)]" />,
            }}
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                    "--border-radius": "var(--radius)",
                    // Keep background/text uniform; only tint borders per status and match icon color
                    "--success-bg": "var(--normal-bg)",
                    "--success-border": "var(--success)",
                    "--success-text": "var(--normal-text)",
                    "--info-bg": "var(--normal-bg)",
                    "--info-border": "var(--info)",
                    "--info-text": "var(--normal-text)",
                    "--warning-bg": "var(--normal-bg)",
                    "--warning-border": "var(--warning)",
                    "--warning-text": "var(--normal-text)",
                    "--error-bg": "var(--normal-bg)",
                    "--error-border": "var(--destructive)",
                    "--error-text": "var(--normal-text)",
                } as React.CSSProperties
            }
            {...props}
        />
    )
}

export { Toaster }
