import { ReactNode, CSSProperties } from 'react'

export type BadgeVariant = 'neutral' | 'warning' | 'success'

export function Badge({ children, variant = 'neutral' }: { children: ReactNode; variant?: BadgeVariant }) {
    return (
        <span className={`ds-badge ds-badge--${variant}`}>
            <span className="ds-badgeDot" />
            {children}
        </span>
    )
}

export function Button({
    children,
    variant = 'primary',
    disabled,
    onClick,
    type = 'button',
    style,
}: {
    children: ReactNode
    variant?: 'primary' | 'secondary'
    disabled?: boolean
    onClick?: () => void
    type?: 'button' | 'submit'
    style?: CSSProperties
}) {
    return (
        <button
            type={type}
            className={`ds-button ds-button--${variant}`}
            disabled={disabled}
            onClick={onClick}
            style={style}
        >
            {children}
        </button>
    )
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="ds-card">
            <h3 className="ds-cardTitle">{title}</h3>
            {children}
        </section>
    )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="ds-field">
            <label className="ds-label">{label}</label>
            {children}
        </div>
    )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input className="ds-input" {...props} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea className="ds-textarea" {...props} />
}

export function PromptBox({ label, text }: { label: string; text: string }) {
    return (
        <div className="ds-promptBox">
            <label className="ds-label">{label}</label>
            <pre className="ds-code">{text}</pre>
        </div>
    )
}

export function EmptyState({
    title,
    body,
    nextAction,
}: {
    title: string
    body: string
    nextAction?: string
}) {
    return (
        <div className="ds-empty">
            <h4 className="ds-stateTitle">{title}</h4>
            <p className="ds-stateBody">{body}</p>
            {nextAction && (
                <p className="ds-stateBody">
                    <strong>Next:</strong> {nextAction}
                </p>
            )}
        </div>
    )
}

export function ErrorState({
    title,
    whatHappened,
    howToFix,
}: {
    title: string
    whatHappened: string
    howToFix: string
}) {
    return (
        <div className="ds-error">
            <h4 className="ds-stateTitle">{title}</h4>
            <p className="ds-stateBody">
                <strong>Error:</strong> {whatHappened}
            </p>
            <p className="ds-stateBody">
                <strong>Fix:</strong> {howToFix}
            </p>
        </div>
    )
}
