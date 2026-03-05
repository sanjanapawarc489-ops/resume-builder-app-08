import { useNavigate } from 'react-router-dom'
import { Card, Button } from '../design-system/ui'
import type { AppState } from '../store'

function CircularScore({ score, size = 96 }: { score: number; size?: number }) {
    const radius = (size - 16) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference
    const color = score >= 71 ? '#27ae60' : score >= 41 ? '#f39c12' : '#e74c3c'
    const label = score >= 71 ? 'Strong' : score >= 41 ? 'Good' : 'Weak'
    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e0e0e0" strokeWidth="8" />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: size > 80 ? '22px' : '16px', color, lineHeight: 1 }}>{score}</span>
                <span style={{ fontSize: '10px', color, opacity: 0.85 }}>{label}</span>
            </div>
        </div>
    )
}

function WeightBar({ label, weight, value, color }: { label: string; weight: number; value: number; color: string }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px' }}>{label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{Math.round(value * weight / 100)}/{weight}pts</span>
                </div>
                <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                </div>
            </div>
        </div>
    )
}

export default function Dashboard({ state }: { state: AppState }) {
    const navigate = useNavigate()
    const rs = state.readinessScore
    const overall = Math.round(
        (rs.jobMatchQuality * 0.30) +
        (rs.jdSkillAlignment * 0.25) +
        (rs.resumeATS * 0.25) +
        (rs.applicationProgress * 0.10) +
        (rs.practiceCompletion * 0.10)
    )

    const modules = [
        { icon: '📄', label: 'Resume', route: '/resume', desc: 'Build & optimize your resume', status: rs.resumeATS >= 70 ? 'success' : rs.resumeATS >= 40 ? 'warning' : 'error', score: rs.resumeATS },
        { icon: '💼', label: 'Jobs', route: '/jobs', desc: 'Browse matched job listings', status: state.jobMatches.length > 0 ? 'success' : 'neutral', score: rs.jobMatchQuality },
        { icon: '🔍', label: 'JD Analyzer', route: '/analyze', desc: 'Analyze job descriptions', status: state.jdAnalyses.length > 0 ? 'success' : 'neutral', score: rs.jdSkillAlignment },
        { icon: '📬', label: 'Applications', route: '/applications', desc: 'Track your job applications', status: state.applications.length > 0 ? 'success' : 'neutral', score: rs.applicationProgress },
        { icon: '⚙️', label: 'Settings', route: '/settings', desc: 'Configure preferences', status: 'neutral', score: null },
    ]

    const notifications = state.notifications.slice(0, 4)

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Hero readiness banner */}
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', borderRadius: '16px', padding: '32px', marginBottom: '24px', color: 'white', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 auto' }}>
                    <CircularScore score={overall} size={120} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 'bold' }}>Placement Readiness</h1>
                    <p style={{ margin: '0 0 16px', opacity: 0.8, fontSize: '15px' }}>
                        {overall >= 71 ? '🎉 You\'re in great shape! Keep applying.' : overall >= 41 ? '📈 Good progress! Strengthen your weak areas.' : '🚀 Let\'s build your profile from the ground up.'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Button onClick={() => navigate('/resume')} style={{ background: 'white', color: '#1a1a2e', border: 'none', fontWeight: 'bold' }}>Build Resume</Button>
                        <Button onClick={() => navigate('/jobs')} variant="secondary" style={{ border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}>Browse Jobs</Button>
                    </div>
                </div>
                <div style={{ flex: '0 0 240px', minWidth: '200px' }}>
                    <WeightBar label="Job Match Quality" weight={30} value={rs.jobMatchQuality} color="#3498db" />
                    <WeightBar label="JD Skill Alignment" weight={25} value={rs.jdSkillAlignment} color="#9b59b6" />
                    <WeightBar label="Resume ATS Score" weight={25} value={rs.resumeATS} color="#27ae60" />
                    <WeightBar label="Application Progress" weight={10} value={rs.applicationProgress} color="#f39c12" />
                    <WeightBar label="Practice Completion" weight={10} value={rs.practiceCompletion} color="#e74c3c" />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {/* Quick stats */}
                {[
                    { label: 'Jobs Saved', value: state.jobMatches.filter(j => j.saved).length, icon: '⭐', color: '#f39c12' },
                    { label: 'Applications', value: state.applications.length, icon: '📬', color: '#3498db' },
                    { label: 'JDs Analyzed', value: state.jdAnalyses.length, icon: '🔍', color: '#9b59b6' },
                ].map(stat => (
                    <div key={stat.label} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '32px' }}>{stat.icon}</span>
                        <div>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                            <div style={{ fontSize: '13px', opacity: 0.6, marginTop: '2px' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Module Grid */}
                <Card title="Modules">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {modules.map(mod => (
                            <div key={mod.route} onClick={() => navigate(mod.route)}
                                style={{ padding: '16px', border: '1px solid #eee', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', background: 'white' }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = '', e.currentTarget.style.boxShadow = '')}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '24px' }}>{mod.icon}</span>
                                    {mod.score !== null && (
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', background: mod.score >= 70 ? '#eafaf1' : mod.score >= 40 ? '#fef9e7' : '#fdf2f8', color: mod.score >= 70 ? '#27ae60' : mod.score >= 40 ? '#f39c12' : '#e74c3c', padding: '2px 8px', borderRadius: '12px' }}>
                                            {mod.score}%
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '8px' }}>{mod.label}</div>
                                <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '2px' }}>{mod.desc}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Notifications */}
                <Card title="Notifications">
                    {notifications.length === 0 ? (
                        <p style={{ opacity: 0.5, fontSize: '13px' }}>No notifications yet. Complete your profile to get smart suggestions.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {notifications.map((n, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px', background: n.type === 'success' ? '#eafaf1' : n.type === 'warning' ? '#fef9e7' : '#eaf4fb', borderRadius: '8px' }}>
                                    <span>{n.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{n.title}</div>
                                        <div style={{ fontSize: '12px', opacity: 0.7 }}>{n.message}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ marginTop: '12px' }}>
                        <Button variant="secondary" onClick={() => navigate('/settings')} style={{ width: '100%', fontSize: '13px' }}>Manage Settings</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
