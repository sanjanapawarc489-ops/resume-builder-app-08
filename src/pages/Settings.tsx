import { Card, Button, Field, TextInput } from '../design-system/ui'
import type { AppState } from '../store'

export default function Settings({ state, updatePreferences }: { state: AppState; updatePreferences: (p: Partial<AppState['preferences']>) => void }) {
    const p = state.preferences

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 'bold' }}>Settings</h1>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '14px' }}>Customize your preferences and target role</p>
            </div>

            <div style={{ display: 'grid', gap: '24px', maxWidth: '640px' }}>
                <Card title="Target Role">
                    <div style={{ display: 'grid', gap: '12px' }}>
                        <Field label="Target Job Title">
                            <TextInput value={p.targetRole} onChange={e => updatePreferences({ targetRole: e.target.value })} placeholder="Frontend Engineer, Full Stack Developer..." />
                        </Field>
                        <Field label="Preferred Locations">
                            <TextInput value={p.locations.join(', ')} onChange={e => updatePreferences({ locations: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="Remote, San Francisco, New York" />
                        </Field>
                        <Field label="Expected Salary (USD)">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <TextInput value={p.salaryMin} onChange={e => updatePreferences({ salaryMin: e.target.value })} placeholder="Min: 80000" />
                                <TextInput value={p.salaryMax} onChange={e => updatePreferences({ salaryMax: e.target.value })} placeholder="Max: 160000" />
                            </div>
                        </Field>
                        <div>
                            <label style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.78, display: 'block', marginBottom: '8px' }}>Job Types</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(type => (
                                    <button key={type} onClick={() => {
                                        const current = p.jobTypes || []
                                        updatePreferences({ jobTypes: current.includes(type) ? current.filter(t => t !== type) : [...current, type] })
                                    }} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer', background: (p.jobTypes || []).includes(type) ? '#1a1a2e' : 'white', color: (p.jobTypes || []).includes(type) ? 'white' : '#333', fontSize: '13px', transition: 'all 0.2s' }}>
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Experience Level">
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['Entry Level', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Principal'].map(level => (
                            <button key={level} onClick={() => updatePreferences({ experienceLevel: level })} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer', background: p.experienceLevel === level ? '#1a1a2e' : 'white', color: p.experienceLevel === level ? 'white' : '#333', fontSize: '13px', fontWeight: p.experienceLevel === level ? 'bold' : 'normal', transition: 'all 0.2s' }}>
                                {level}
                            </button>
                        ))}
                    </div>
                </Card>

                <Card title="Notifications">
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {[
                            { key: 'newJobAlerts' as const, label: 'New Job Alerts', desc: 'Notify when new matching jobs are found' },
                            { key: 'resumeTips' as const, label: 'Resume Tips', desc: 'Get suggestions to improve your ATS score' },
                            { key: 'applicationReminders' as const, label: 'Application Reminders', desc: 'Remind to follow up on applications' },
                        ].map(({ key, label, desc }) => (
                            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
                                <div>
                                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{label}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.6 }}>{desc}</div>
                                </div>
                                <div onClick={() => updatePreferences({ notifications: { ...(p.notifications || {}), [key]: !(p.notifications || {})[key] } })}
                                    style={{ width: '44px', height: '24px', borderRadius: '12px', background: (p.notifications || {})[key] ? '#1a1a2e' : '#ddd', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                                    <div style={{ position: 'absolute', top: '2px', left: (p.notifications || {})[key] ? '22px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Data">
                    <p style={{ margin: '0 0 12px', fontSize: '14px', opacity: 0.6 }}>All data is stored locally in your browser's localStorage.</p>
                    <Button variant="secondary" onClick={() => {
                        if (window.confirm('Clear all data? This cannot be undone.')) {
                            localStorage.clear()
                            window.location.reload()
                        }
                    }} style={{ background: '#fff5f5', color: '#e74c3c', border: '1px solid #fcc', fontSize: '13px' }}>
                        🗑️ Clear All Data
                    </Button>
                </Card>
            </div>
        </div>
    )
}
