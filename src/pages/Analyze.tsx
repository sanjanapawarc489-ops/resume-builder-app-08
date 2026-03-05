import { useState } from 'react'
import { Card, Button, Field, TextArea } from '../design-system/ui'
import type { AppState, JDAnalysis } from '../store'

const ACTION_VERBS = ['built', 'led', 'designed', 'improved', 'created', 'developed', 'managed', 'optimized', 'automated', 'implemented', 'deployed', 'architected', 'scaled', 'delivered', 'maintained']
const TECH_KEYWORDS = ['react', 'typescript', 'javascript', 'node.js', 'python', 'sql', 'postgresql', 'mysql', 'mongodb', 'graphql', 'rest', 'api', 'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'git', 'ci/cd', 'agile', 'scrum', 'redis', 'elasticsearch']

function extractKeywords(text: string): string[] {
    const words = text.toLowerCase().replace(/[^\w\s.#+-]/g, ' ').split(/\s+/)
    const found = new Set<string>()
    TECH_KEYWORDS.forEach(kw => { if (words.some(w => w.includes(kw.toLowerCase()))) found.add(kw) })
    // Also extract capitalized words that look like skills
    const caps = text.match(/\b[A-Z][a-zA-Z+#.]{1,}/g) || []
    caps.forEach(c => { if (c.length > 1 && c.length < 20) found.add(c) })
    return Array.from(found).slice(0, 20)
}

function extractVerbs(text: string): string[] {
    return ACTION_VERBS.filter(v => new RegExp(`\\b${v}`, 'i').test(text))
}

function matchSkillsToResume(jdSkills: string[], resumeSkills: string[]): { matched: string[]; missing: string[] } {
    const resumeLower = resumeSkills.map(s => s.toLowerCase())
    const matched: string[] = []
    const missing: string[] = []
    jdSkills.forEach(s => {
        if (resumeLower.some(r => r.includes(s.toLowerCase()) || s.toLowerCase().includes(r))) {
            matched.push(s)
        } else {
            missing.push(s)
        }
    })
    return { matched, missing }
}

export default function Analyze({ state, addAnalysis }: { state: AppState; addAnalysis: (a: JDAnalysis) => void }) {
    const [jdText, setJdText] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [company, setCompany] = useState('')
    const [analyzing, setAnalyzing] = useState(false)
    const [result, setResult] = useState<JDAnalysis | null>(null)

    const resumeSkills = [
        ...(state.resumeData.skills?.technical || []),
        ...(state.resumeData.skills?.soft || []),
        ...(state.resumeData.skills?.tools || []),
    ]

    const handleAnalyze = () => {
        if (!jdText.trim()) return
        setAnalyzing(true)
        setTimeout(() => {
            const skills = extractKeywords(jdText)
            const verbs = extractVerbs(jdText)
            const { matched, missing } = matchSkillsToResume(skills, resumeSkills)
            const alignmentScore = skills.length > 0 ? Math.round((matched.length / skills.length) * 100) : 0
            const experienceReq = jdText.match(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/i)?.[1] || 'Not specified'
            const seniority = /senior|lead|principal|staff/i.test(jdText) ? 'Senior' : /junior|entry|associate/i.test(jdText) ? 'Junior' : 'Mid-level'
            const remote = /remote|distributed|work from anywhere/i.test(jdText)

            const analysis: JDAnalysis = {
                id: Date.now().toString(),
                jobTitle: jobTitle || 'Unknown Role',
                company: company || 'Unknown Company',
                analyzedAt: new Date().toLocaleDateString(),
                jdText,
                extractedSkills: skills,
                requiredVerbs: verbs,
                matchedSkills: matched,
                missingSkills: missing,
                alignmentScore,
                experienceRequired: experienceReq,
                seniority,
                remote,
                suggestions: [
                    ...missing.slice(0, 3).map(s => `Add "${s}" to your skills or resume`),
                    matched.length < skills.length / 2 ? 'Tailor your summary to mention key JD terms' : '',
                    verbs.length > 0 ? `Use action verbs in your bullets: ${verbs.slice(0, 3).join(', ')}` : '',
                ].filter(Boolean)
            }
            setResult(analysis)
            addAnalysis(analysis)
            setAnalyzing(false)
        }, 1200)
    }

    const allAnalyses = state.jdAnalyses

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 'bold' }}>JD Analyzer</h1>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '14px' }}>Paste a job description to extract key skills and see how well your resume aligns</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', alignItems: 'start' }}>
                <div>
                    <Card title="Paste Job Description">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <Field label="Job Title">
                                <input className="ds-input" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Frontend Engineer" />
                            </Field>
                            <Field label="Company">
                                <input className="ds-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Stripe" />
                            </Field>
                        </div>
                        <Field label="Job Description">
                            <TextArea value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste the full job description here..." style={{ minHeight: '280px' }} />
                        </Field>
                        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleAnalyze} disabled={!jdText.trim() || analyzing}>
                                {analyzing ? '⏳ Analyzing...' : '🔍 Analyze JD'}
                            </Button>
                        </div>
                    </Card>

                    {/* History */}
                    {allAnalyses.length > 0 && (
                        <div style={{ marginTop: '16px' }}>
                            <Card title="Analysis History">
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {allAnalyses.slice().reverse().map(a => (
                                        <div key={a.id} onClick={() => setResult(a)} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: result?.id === a.id ? '#f0f4ff' : 'white' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{a.jobTitle}</div>
                                                <div style={{ fontSize: '12px', opacity: 0.6 }}>{a.company} · {a.analyzedAt}</div>
                                            </div>
                                            <span style={{ fontWeight: 'bold', fontSize: '14px', color: a.alignmentScore >= 60 ? '#27ae60' : '#f39c12' }}>{a.alignmentScore}%</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Results */}
                <div>
                    {!result ? (
                        <div style={{ padding: '48px', border: '1px dashed #ddd', borderRadius: '12px', textAlign: 'center', opacity: 0.5 }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                            <div>Paste a job description and click Analyze to see skill alignment and suggestions.</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {/* Alignment Score */}
                            <Card title="Alignment Score">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
                                        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                                            <circle cx="40" cy="40" r="32" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                                            <circle cx="40" cy="40" r="32" fill="none"
                                                stroke={result.alignmentScore >= 60 ? '#27ae60' : result.alignmentScore >= 40 ? '#f39c12' : '#e74c3c'}
                                                strokeWidth="8"
                                                strokeDasharray={2 * Math.PI * 32}
                                                strokeDashoffset={2 * Math.PI * 32 * (1 - result.alignmentScore / 100)}
                                                strokeLinecap="round"
                                                style={{ transition: 'stroke-dashoffset 0.6s' }} />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: result.alignmentScore >= 60 ? '#27ae60' : '#f39c12' }}>
                                            {result.alignmentScore}%
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{result.jobTitle} @ {result.company}</div>
                                        <div style={{ fontSize: '13px', opacity: 0.6 }}>{result.seniority} · {result.remote ? '🌐 Remote' : '🏢 On-site'} · {result.experienceRequired === 'Not specified' ? result.experienceRequired : `${result.experienceRequired}+ yrs exp.`}</div>
                                    </div>
                                </div>
                            </Card>

                            <Card title="Skills Breakdown">
                                {result.matchedSkills.length > 0 && (
                                    <>
                                        <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6, margin: '0 0 6px' }}>✅ You Have ({result.matchedSkills.length})</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                                            {result.matchedSkills.map(s => <span key={s} style={{ fontSize: '12px', background: '#eafaf1', color: '#27ae60', padding: '3px 10px', borderRadius: '12px', fontWeight: '500' }}>{s}</span>)}
                                        </div>
                                    </>
                                )}
                                {result.missingSkills.length > 0 && (
                                    <>
                                        <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6, margin: '0 0 6px' }}>❌ Missing ({result.missingSkills.length})</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {result.missingSkills.map(s => <span key={s} style={{ fontSize: '12px', background: '#fdf2f8', color: '#e74c3c', padding: '3px 10px', borderRadius: '12px', fontWeight: '500' }}>{s}</span>)}
                                        </div>
                                    </>
                                )}
                            </Card>

                            {result.suggestions.length > 0 && (
                                <Card title="Suggestions">
                                    <ul style={{ margin: 0, paddingLeft: '16px', display: 'grid', gap: '8px' }}>
                                        {result.suggestions.map((s, i) => <li key={i} style={{ fontSize: '13px', lineHeight: '1.5' }}>{s}</li>)}
                                    </ul>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
