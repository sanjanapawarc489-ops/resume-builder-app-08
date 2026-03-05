import { useState } from 'react'
import { Card, Button, Field, TextInput } from '../design-system/ui'
import type { AppState, JobMatch } from '../store'

const SAMPLE_JOBS: JobMatch[] = [
    { id: '1', title: 'Frontend Engineer', company: 'Stripe', location: 'Remote', type: 'Full-time', salary: '$120k–$160k', matchScore: 92, skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'], description: 'Build and maintain Stripe\'s dashboard products. Work with React, TypeScript, and modern web standards.', postedAt: '2 days ago', saved: false, applied: false },
    { id: '2', title: 'Software Engineer II', company: 'Notion', location: 'San Francisco, CA', type: 'Full-time', salary: '$130k–$175k', matchScore: 85, skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'], description: 'Join Notion\'s product engineering team. Build collaborative tools used by millions.', postedAt: '3 days ago', saved: false, applied: false },
    { id: '3', title: 'React Developer', company: 'Vercel', location: 'Remote', type: 'Full-time', salary: '$110k–$150k', matchScore: 79, skills: ['React', 'Next.js', 'TypeScript', 'Docker'], description: 'Work on the Vercel platform and dashboard. Deep understanding of React and build tools required.', postedAt: '1 week ago', saved: false, applied: false },
    { id: '4', title: 'Full Stack Engineer', company: 'Linear', location: 'Remote', type: 'Full-time', salary: '$115k–$155k', matchScore: 74, skills: ['React', 'TypeScript', 'PostgreSQL', 'AWS'], description: 'Build the next generation of project management tools. Join a small, high-impact team.', postedAt: '5 days ago', saved: false, applied: false },
    { id: '5', title: 'Senior JavaScript Developer', company: 'Figma', location: 'New York, NY', type: 'Full-time', salary: '$140k–$190k', matchScore: 68, skills: ['JavaScript', 'WebGL', 'React', 'C++'], description: 'Work on Figma\'s rendering engine and core editor features.', postedAt: '1 week ago', saved: false, applied: false },
    { id: '6', title: 'Backend Engineer - Node.js', company: 'PlanetScale', location: 'Remote', type: 'Full-time', salary: '$100k–$140k', matchScore: 61, skills: ['Node.js', 'MySQL', 'Docker', 'Kubernetes'], description: 'Build scalable database infrastructure and developer tooling.', postedAt: '2 weeks ago', saved: false, applied: false },
]

function MatchRing({ score }: { score: number }) {
    const color = score >= 80 ? '#27ae60' : score >= 60 ? '#f39c12' : '#e74c3c'
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', border: `3px solid ${color}`, borderRadius: '50%', flexShrink: 0 }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px', color }}>{score}%</span>
            <span style={{ fontSize: '9px', color, opacity: 0.8 }}>match</span>
        </div>
    )
}

export default function Jobs({ state, updateJobs }: { state: AppState; updateJobs: (jobs: JobMatch[]) => void }) {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'saved' | 'high'>('all')
    const [jobs, setJobs] = useState<JobMatch[]>(() => {
        // Merge saved state into sample jobs
        return SAMPLE_JOBS.map(sj => {
            const existing = state.jobMatches.find(j => j.id === sj.id)
            return existing ? { ...sj, ...existing } : sj
        })
    })

    const sync = (updated: JobMatch[]) => {
        setJobs(updated)
        updateJobs(updated)
    }

    const toggleSave = (id: string) => sync(jobs.map(j => j.id === id ? { ...j, saved: !j.saved } : j))
    const markApplied = (id: string) => sync(jobs.map(j => j.id === id ? { ...j, applied: true } : j))

    const filtered = jobs.filter(j => {
        const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || (filter === 'saved' && j.saved) || (filter === 'high' && j.matchScore >= 80)
        return matchesSearch && matchesFilter
    })

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: '0 0 4px', fontSize: '28px', fontWeight: 'bold' }}>Job Matches</h1>
                <p style={{ margin: 0, opacity: 0.6, fontSize: '14px' }}>Based on your resume skills and preferences</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Field label="">
                    <TextInput value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search jobs or companies..." style={{ minWidth: '260px' }} />
                </Field>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {(['all', 'saved', 'high'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer', fontWeight: filter === f ? 'bold' : 'normal', background: filter === f ? '#1a1a2e' : 'white', color: filter === f ? 'white' : '#333', fontSize: '13px', transition: 'all 0.2s' }}>
                            {f === 'all' ? 'All Jobs' : f === 'saved' ? '⭐ Saved' : '🔥 High Match'}
                        </button>
                    ))}
                </div>
                <span style={{ fontSize: '13px', opacity: 0.5, marginLeft: 'auto' }}>{filtered.length} listings</span>
            </div>

            {/* Job Cards */}
            <div style={{ display: 'grid', gap: '16px' }}>
                {filtered.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', border: '1px dashed #ddd', borderRadius: '12px', opacity: 0.5 }}>
                        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔍</div>
                        <div>No jobs match your filter. Try adjusting your search.</div>
                    </div>
                ) : filtered.map(job => (
                    <div key={job.id} style={{ background: 'white', borderRadius: '12px', border: job.applied ? '1px solid #27ae60' : '1px solid #eee', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', transition: 'box-shadow 0.2s', position: 'relative', overflow: 'hidden' }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}>
                        {job.applied && <div style={{ position: 'absolute', top: 0, right: 0, background: '#27ae60', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '0 0 0 8px' }}>APPLIED</div>}
                        <MatchRing score={job.matchScore} />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 2px', fontSize: '17px' }}>{job.title}</h3>
                                    <div style={{ fontSize: '14px', opacity: 0.7 }}>{job.company} · {job.location} · {job.type}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '14px' }}>{job.salary}</div>
                                    <div style={{ fontSize: '12px', opacity: 0.5 }}>{job.postedAt}</div>
                                </div>
                            </div>
                            <p style={{ margin: '8px 0', fontSize: '13px', opacity: 0.7, lineHeight: '1.5' }}>{job.description}</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                {job.skills.map(s => (
                                    <span key={s} style={{ fontSize: '12px', background: '#f0f4ff', color: '#3498db', padding: '2px 10px', borderRadius: '12px', fontWeight: '500' }}>{s}</span>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Button variant="secondary" onClick={() => toggleSave(job.id)} style={{ fontSize: '13px', padding: '6px 14px' }}>
                                    {job.saved ? '⭐ Saved' : '☆ Save'}
                                </Button>
                                <Button onClick={() => markApplied(job.id)} style={{ fontSize: '13px', padding: '6px 14px' }} disabled={job.applied}>
                                    {job.applied ? '✓ Applied' : '→ Apply Now'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
