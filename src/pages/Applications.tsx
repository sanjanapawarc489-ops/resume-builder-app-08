import { useState } from 'react'
import { Button, Field, TextInput, TextArea } from '../design-system/ui'
import type { AppState, Application } from '../store'

const STAGES = ['Wishlist', 'Applied', 'Phone Screen', 'Interview', 'Offer', 'Rejected'] as const
type Stage = typeof STAGES[number]

const STAGE_COLORS: Record<Stage, string> = {
    'Wishlist': '#95a5a6',
    'Applied': '#3498db',
    'Phone Screen': '#9b59b6',
    'Interview': '#f39c12',
    'Offer': '#27ae60',
    'Rejected': '#e74c3c',
}

export default function Applications({ state, updateApplications }: { state: AppState; updateApplications: (apps: Application[]) => void }) {
    const apps = state.applications
    const [showForm, setShowForm] = useState(false)
    const [editId, setEditId] = useState<string | null>(null)
    const [form, setForm] = useState<Omit<Application, 'id' | 'updatedAt'>>({ company: '', role: '', stage: 'Wishlist', appliedAt: '', notes: '', link: '' })

    const save = () => {
        let updated: Application[]
        if (editId) {
            updated = apps.map(a => a.id === editId ? { ...a, ...form, updatedAt: new Date().toLocaleDateString() } : a)
        } else {
            updated = [...apps, { ...form, id: Date.now().toString(), updatedAt: new Date().toLocaleDateString() }]
        }
        updateApplications(updated)
        setShowForm(false)
        setEditId(null)
        setForm({ company: '', role: '', stage: 'Wishlist', appliedAt: '', notes: '', link: '' })
    }

    const remove = (id: string) => updateApplications(apps.filter(a => a.id !== id))

    const moveStage = (id: string, dir: 1 | -1) => {
        updateApplications(apps.map(a => {
            if (a.id !== id) return a
            const idx = STAGES.indexOf(a.stage as Stage)
            const next = STAGES[Math.max(0, Math.min(STAGES.length - 1, idx + dir))]
            return { ...a, stage: next, updatedAt: new Date().toLocaleDateString() }
        }))
    }

    const startEdit = (app: Application) => {
        setForm({ company: app.company, role: app.role, stage: app.stage, appliedAt: app.appliedAt, notes: app.notes, link: app.link })
        setEditId(app.id)
        setShowForm(true)
    }

    const grouped = STAGES.reduce((acc, stage) => {
        acc[stage] = apps.filter(a => a.stage === stage)
        return acc
    }, {} as Record<Stage, Application[]>)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 'bold' }}>Application Pipeline</h1>
                    <p style={{ margin: 0, opacity: 0.6, fontSize: '14px' }}>{apps.length} total applications · {apps.filter(a => a.stage === 'Interview').length} at interview stage</p>
                </div>
                <Button onClick={() => { setShowForm(true); setEditId(null); setForm({ company: '', role: '', stage: 'Applied', appliedAt: new Date().toLocaleDateString(), notes: '', link: '' }) }}>
                    + Add Application
                </Button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                        <h3 style={{ margin: '0 0 20px', fontSize: '20px' }}>{editId ? 'Edit Application' : 'Add Application'}</h3>
                        <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <Field label="Company"><TextInput value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Stripe" /></Field>
                                <Field label="Role"><TextInput value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="Frontend Engineer" /></Field>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <Field label="Stage">
                                    <select className="ds-input" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value as Stage }))}>
                                        {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </Field>
                                <Field label="Applied Date"><TextInput value={form.appliedAt} onChange={e => setForm(f => ({ ...f, appliedAt: e.target.value }))} placeholder="Mar 5, 2026" /></Field>
                            </div>
                            <Field label="Job Link (Optional)"><TextInput value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." /></Field>
                            <Field label="Notes"><TextArea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ minHeight: '80px' }} placeholder="Interview notes, contacts, etc..." /></Field>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</Button>
                            <Button onClick={save} disabled={!form.company || !form.role}>Save</Button>
                        </div>
                    </div>
                </div>
            )}

            {apps.length === 0 ? (
                <div style={{ padding: '64px', textAlign: 'center', border: '1px dashed #ddd', borderRadius: '16px', opacity: 0.5 }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📬</div>
                    <div style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 'bold' }}>No applications yet</div>
                    <div style={{ fontSize: '14px' }}>Start tracking your job applications by clicking "+ Add Application"</div>
                </div>
            ) : (
                <div>
                    {/* Stats Row */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                        {STAGES.map(stage => (
                            <div key={stage} style={{ padding: '8px 16px', borderRadius: '20px', background: STAGE_COLORS[stage] + '18', border: `1px solid ${STAGE_COLORS[stage]}44`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: STAGE_COLORS[stage], display: 'inline-block' }} />
                                <span style={{ fontSize: '13px', fontWeight: '500' }}>{stage}</span>
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: STAGE_COLORS[stage] }}>{grouped[stage].length}</span>
                            </div>
                        ))}
                    </div>

                    {/* Kanban board */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                        {STAGES.filter(s => grouped[s].length > 0 || s === 'Applied').map(stage => (
                            <div key={stage}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: STAGE_COLORS[stage], display: 'inline-block' }} />
                                    <span style={{ fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage}</span>
                                    <span style={{ fontSize: '12px', background: '#f0f0f0', padding: '1px 7px', borderRadius: '12px' }}>{grouped[stage].length}</span>
                                </div>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {grouped[stage].length === 0 ? (
                                        <div style={{ padding: '16px', border: '1px dashed #ddd', borderRadius: '8px', textAlign: 'center', opacity: 0.4, fontSize: '12px' }}>Empty</div>
                                    ) : grouped[stage].map(app => (
                                        <div key={app.id} style={{ background: 'white', borderRadius: '10px', padding: '14px', border: `1px solid ${STAGE_COLORS[stage]}33`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' }}>{app.company}</div>
                                            <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>{app.role}</div>
                                            {app.appliedAt && <div style={{ fontSize: '11px', opacity: 0.5, marginBottom: '8px' }}>Applied: {app.appliedAt}</div>}
                                            {app.notes && <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '8px', lineHeight: '1.4', borderLeft: `2px solid ${STAGE_COLORS[stage]}`, paddingLeft: '8px' }}>{app.notes}</div>}
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                <button onClick={() => moveStage(app.id, -1)} disabled={STAGES.indexOf(stage) === 0} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: 'white' }}>◀</button>
                                                <button onClick={() => moveStage(app.id, 1)} disabled={STAGES.indexOf(stage) === STAGES.length - 1} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: 'white' }}>▶</button>
                                                <button onClick={() => startEdit(app)} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: 'white' }}>✏️</button>
                                                <button onClick={() => remove(app.id)} style={{ fontSize: '11px', padding: '2px 8px', border: '1px solid #fcc', borderRadius: '4px', cursor: 'pointer', background: '#fff5f5', color: '#e74c3c' }}>✕</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
