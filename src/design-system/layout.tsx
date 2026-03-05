import { NavLink } from 'react-router-dom'
import { Badge } from './ui'

export function TopNav({ readinessScore = 0 }: { readinessScore?: number }) {
    const navItems = [
        { to: '/', label: '🏠 Dashboard', exact: true },
        { to: '/resume', label: '📄 Resume' },
        { to: '/jobs', label: '💼 Jobs' },
        { to: '/analyze', label: '🔍 Analyze' },
        { to: '/applications', label: '📬 Applications' },
        { to: '/settings', label: '⚙️ Settings' },
    ]

    const color = readinessScore >= 71 ? '#27ae60' : readinessScore >= 41 ? '#f39c12' : '#e74c3c'

    return (
        <nav className="ds-topBar" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
            <div className="ds-container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.01em', flexShrink: 0 }}>
                        🚀 PlacementOS
                    </NavLink>
                    <div style={{ display: 'flex', gap: '2px', overflowX: 'auto' }}>
                        {navItems.map(item => (
                            <NavLink key={item.to} to={item.to} end={item.exact}
                                className={({ isActive }) => `ds-navLink ${isActive ? 'active' : ''}`}
                                style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        {readinessScore > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: color + '18', border: `1px solid ${color}44`, borderRadius: '20px', padding: '4px 12px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color }}>{readinessScore}% Ready</span>
                            </div>
                        )}
                        <Badge variant="neutral">Beta 2.0</Badge>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export function ContextHeader({ headline, subtext }: { headline: string; subtext: string }) {
    return (
        <div className="ds-contextHeader">
            <div className="ds-container">
                <h1 className="ds-headline">{headline}</h1>
                <p className="ds-subtext">{subtext}</p>
            </div>
        </div>
    )
}

export type ProofKey = 'ui' | 'logic' | 'test' | 'deployed'

export type ProofState = {
    [key in ProofKey]: {
        checked: boolean
        proof: string
    }
}

export function ProofFooter({
    proof,
    onChange,
}: {
    proof: ProofState
    onChange: (key: ProofKey, next: { checked?: boolean; proof?: string }) => void
}) {
    return (
        <footer className="ds-proofFooter">
            <div className="ds-container">
                <h4 className="ds-proofTitle">Project Accountability</h4>
                <div className="ds-checklist">
                    {(['ui', 'logic', 'test', 'deployed'] as ProofKey[]).map((key) => (
                        <div key={key} className="ds-checkItem">
                            <input
                                type="checkbox"
                                checked={proof[key].checked}
                                onChange={(e) => onChange(key, { checked: e.target.checked })}
                                style={{ marginTop: '4px' }}
                            />
                            <div className="ds-checkLabel">
                                <span className="ds-checkName">
                                    {key === 'ui' && 'UI Architecture'}
                                    {key === 'logic' && 'Core Logic'}
                                    {key === 'test' && 'Automated Tests'}
                                    {key === 'deployed' && 'Live Build'}
                                </span>
                                <input
                                    type="text"
                                    className="ds-proofInput"
                                    placeholder="Paste proof link/note…"
                                    value={proof[key].proof}
                                    onChange={(e) => onChange(key, { proof: e.target.value })}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    )
}
