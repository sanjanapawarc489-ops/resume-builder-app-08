import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { TopNav, ProofFooter, type ProofState, type ProofKey } from './design-system/layout'
import { Button, Card, Field, TextArea, TextInput } from './design-system/ui'

// --- Types ---

interface Education {
    id: string
    school: string
    degree: string
    year: string
}

interface Experience {
    id: string
    company: string
    role: string
    duration: string
    desc: string
}

interface Project {
    id: string
    name: string
    desc: string
    techStack: string[]
    link: string
    github: string
}

interface ResumeData {
    personal: {
        name: string
        email: string
        phone: string
        location: string
    }
    summary: string
    education: Education[]
    experience: Experience[]
    projects: Project[]
    skills: {
        technical: string[]
        soft: string[]
        tools: string[]
    }
    links: {
        github: string
        linkedin: string
    }
}

type TemplateType = 'Classic' | 'Modern' | 'Minimal'

const DEFAULT_DATA: ResumeData = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] },
    links: { github: '', linkedin: '' }
}

const SAMPLE_DATA: ResumeData = {
    personal: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1 234 567 890',
        location: 'San Francisco, CA'
    },
    summary: 'Experienced Software Engineer with a passion for building scalable web applications and AI integrations.',
    education: [
        { id: '1', school: 'Tech University', degree: 'B.S. Computer Science', year: '2016 - 2020' }
    ],
    experience: [
        { id: '1', company: 'Global Tech', role: 'Senior Developer', duration: '2021 - Present', desc: 'Leading the frontend team in developing AI-driven features.' }
    ],
    projects: [
        { id: '1', name: 'AI Resume Builder', desc: 'A premium tool for creating resumes using AI.', techStack: ['React', 'TypeScript', 'Node.js', 'OpenAI'], link: 'https://builder.example.com', github: 'github.com/janedoe/builder' }
    ],
    skills: {
        technical: ['React', 'TypeScript', 'Node.js', 'Python'],
        soft: ['Communication', 'Team Leadership'],
        tools: ['AWS', 'Git']
    },
    links: {
        github: 'github.com/janedoe',
        linkedin: 'linkedin.com/in/janedoe'
    }
}

// --- Utils ---

function getBulletWarnings(desc: string): string[] {
    if (!desc.trim()) return []
    const lines = desc.split('\n').filter(l => l.trim().length > 0)
    const warnings = new Set<string>()
    const verbRegex = /^(?:[-•*]\s*)?(Built|Developed|Designed|Implemented|Led|Improved|Created|Optimized|Automated)\b/i
    const numRegex = /\d+%?|%|k\b/i

    lines.forEach(line => {
        if (!verbRegex.test(line.trim())) {
            warnings.add("Start with a strong action verb (e.g., Built, Developed, Designed, Implemented, Led, Improved, Created, Optimized, Automated).")
        }
        if (!numRegex.test(line.trim())) {
            warnings.add("Add measurable impact (numbers).")
        }
    })
    return Array.from(warnings)
}

// --- Components ---

function ResumeDocument({ data, template, scale = 1 }: { data: ResumeData; template: TemplateType; scale?: number }) {
    let containerStyle: React.CSSProperties = {
        background: 'white', color: 'black', padding: `${40 * scale}px`, minHeight: `${600 * scale}px`,
        boxShadow: scale === 1 ? '0 0 20px rgba(0,0,0,0.05)' : 'none',
        border: scale === 1 ? 'none' : '1px solid #ddd',
        wordWrap: 'break-word'
    }

    let headerStyle: React.CSSProperties = {}
    let sectionTitleStyle: React.CSSProperties = {}
    let bodyStyle: React.CSSProperties = {}

    if (template === 'Classic') {
        containerStyle = { ...containerStyle, fontFamily: 'var(--font-serif)', fontSize: `${12 * scale}px` }
        headerStyle = { textAlign: 'center', marginBottom: `${24 * scale}px` }
        sectionTitleStyle = { borderBottom: '1px solid black', textTransform: 'uppercase', fontSize: `${14 * scale}px`, letterSpacing: '1px', marginBottom: `${12 * scale}px` }
        bodyStyle = { lineHeight: '1.6' }
    } else if (template === 'Modern') {
        containerStyle = { ...containerStyle, fontFamily: 'var(--font-sans)', fontSize: `${13 * scale}px`, color: '#333' }
        headerStyle = { textAlign: 'left', marginBottom: `${32 * scale}px`, borderBottom: '2px solid #222', paddingBottom: `${16 * scale}px` }
        sectionTitleStyle = { color: 'var(--color-accent)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: `${12 * scale}px`, letterSpacing: '2px', marginBottom: `${12 * scale}px` }
        bodyStyle = { lineHeight: '1.5' }
    } else if (template === 'Minimal') {
        containerStyle = { ...containerStyle, fontFamily: 'ui-monospace, monospace', fontSize: `${11 * scale}px`, color: '#111' }
        headerStyle = { textAlign: 'left', marginBottom: `${24 * scale}px` }
        sectionTitleStyle = { borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: `${4 * scale}px 0`, textTransform: 'uppercase', fontSize: `${11 * scale}px`, marginBottom: `${12 * scale}px`, letterSpacing: '1px' }
        bodyStyle = { lineHeight: '1.4' }
    }

    return (
        <div className="resume-print-document" style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={{ margin: `0 0 ${8 * scale}px`, fontSize: `${(template === 'Modern' ? 36 : 30) * scale}px`, letterSpacing: template === 'Modern' ? '-1px' : '1px', fontWeight: template === 'Modern' ? 'bold' : 'normal', textTransform: template === 'Classic' ? 'uppercase' : 'none' }}>
                    {data.personal.name || 'Your Name'}
                </h1>
                <div style={{ fontSize: `${(template === 'Minimal' ? 10 : 13) * scale}px`, opacity: 0.8 }}>
                    {data.personal.email} {data.personal.email && data.personal.phone ? '•' : ''} {data.personal.phone} {data.personal.phone && data.personal.location ? '•' : ''} {data.personal.location}
                </div>
                <div style={{ fontSize: `${(template === 'Minimal' ? 10 : 13) * scale}px`, marginTop: `${4 * scale}px`, opacity: 0.8 }}>
                    {data.links.github} {data.links.github && data.links.linkedin ? '|' : ''} {data.links.linkedin}
                </div>
            </div>

            {data.summary && (
                <section style={{ marginBottom: `${24 * scale}px` }}>
                    <h2 style={sectionTitleStyle}>Summary</h2>
                    <p style={{ ...bodyStyle, whiteSpace: 'pre-wrap', margin: 0 }}>{data.summary}</p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section style={{ marginBottom: `${24 * scale}px` }}>
                    <h2 style={sectionTitleStyle}>Experience</h2>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="resume-item" style={{ marginBottom: `${16 * scale}px` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>{exp.company}</span>
                                <span>{exp.duration}</span>
                            </div>
                            <div style={{ fontStyle: template === 'Modern' ? 'normal' : 'italic', color: template === 'Modern' ? '#666' : 'inherit' }}>{exp.role}</div>
                            <p style={{ ...bodyStyle, margin: `${4 * scale}px 0 0`, whiteSpace: 'pre-wrap' }}>{exp.desc}</p>
                        </div>
                    ))}
                </section>
            )}

            {data.projects.length > 0 && (
                <section style={{ marginBottom: `${24 * scale}px` }}>
                    <h2 style={sectionTitleStyle}>Projects</h2>
                    {data.projects.map(proj => (
                        <div key={proj.id} className="resume-item" style={{ marginBottom: `${16 * scale}px` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>{proj.name}</span>
                                <span style={{ fontSize: `${11 * scale}px`, fontWeight: 'normal' }}>
                                    {proj.link && <span>🔗 {proj.link} </span>}
                                    {proj.github && <span>🐙 {proj.github}</span>}
                                </span>
                            </div>
                            {proj.techStack && proj.techStack.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${4 * scale}px`, margin: `${4 * scale}px 0` }}>
                                    {proj.techStack.map(ts => (
                                        <span key={ts} style={{ fontSize: `${10 * scale}px`, background: '#eee', padding: `${2 * scale}px ${6 * scale}px`, borderRadius: '4px', color: '#333' }}>{ts}</span>
                                    ))}
                                </div>
                            )}
                            <p style={{ ...bodyStyle, margin: `${4 * scale}px 0 0`, whiteSpace: 'pre-wrap' }}>{proj.desc}</p>
                        </div>
                    ))}
                </section>
            )}

            {data.education.length > 0 && (
                <section style={{ marginBottom: `${24 * scale}px` }}>
                    <h2 style={sectionTitleStyle}>Education</h2>
                    {data.education.map(edu => (
                        <div key={edu.id} className="resume-item" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${6 * scale}px` }}>
                            <span><strong style={{ fontWeight: 'bold' }}>{edu.school}</strong>{edu.degree ? ` — ${edu.degree}` : ''}</span>
                            <span>{edu.year}</span>
                        </div>
                    ))}
                </section>
            )}

            {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.tools.length > 0) && (
                <section>
                    <h2 style={sectionTitleStyle}>Skills</h2>
                    {data.skills.technical.length > 0 && (
                        <div style={{ marginBottom: `${8 * scale}px` }}>
                            <strong style={{ fontSize: `${11 * scale}px` }}>Technical: </strong>
                            {data.skills.technical.map(s => <span key={s} style={{ display: 'inline-block', fontSize: `${11 * scale}px`, background: 'var(--color-bg)', padding: `${2 * scale}px ${6 * scale}px`, borderRadius: '12px', margin: `0 ${4 * scale}px ${4 * scale}px 0`, border: '1px solid #ddd' }}>{s}</span>)}
                        </div>
                    )}
                    {data.skills.soft.length > 0 && (
                        <div style={{ marginBottom: `${8 * scale}px` }}>
                            <strong style={{ fontSize: `${11 * scale}px` }}>Soft Skills: </strong>
                            {data.skills.soft.map(s => <span key={s} style={{ display: 'inline-block', fontSize: `${11 * scale}px`, background: 'var(--color-bg)', padding: `${2 * scale}px ${6 * scale}px`, borderRadius: '12px', margin: `0 ${4 * scale}px ${4 * scale}px 0`, border: '1px solid #ddd' }}>{s}</span>)}
                        </div>
                    )}
                    {data.skills.tools.length > 0 && (
                        <div>
                            <strong style={{ fontSize: `${11 * scale}px` }}>Tools & Tech: </strong>
                            {data.skills.tools.map(s => <span key={s} style={{ display: 'inline-block', fontSize: `${11 * scale}px`, background: 'var(--color-bg)', padding: `${2 * scale}px ${6 * scale}px`, borderRadius: '12px', margin: `0 ${4 * scale}px ${4 * scale}px 0`, border: '1px solid #ddd' }}>{s}</span>)}
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}

function TemplateSelector({ template, setTemplate }: { template: TemplateType; setTemplate: (t: TemplateType) => void }) {
    const templates: TemplateType[] = ['Classic', 'Modern', 'Minimal']
    return (
        <Card title="Template Selection">
            <div className="ds-buttonRow">
                {templates.map(t => (
                    <Button key={t} variant={template === t ? 'primary' : 'secondary'} onClick={() => setTemplate(t)} style={{ flex: 1 }}>
                        {t}
                    </Button>
                ))}
            </div>
            <p className="ds-panelHint" style={{ marginTop: 'var(--space-1)', fontSize: '12px' }}>Changes layout styling only.</p>
        </Card>
    )
}

// --- Pages ---

function TagInput({ label, tags, onChange }: { label: string; tags: string[]; onChange: (tags: string[]) => void }) {
    const [input, setInput] = useState('')
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const val = input.trim()
            if (val && !tags.includes(val)) {
                onChange([...tags, val])
                setInput('')
            }
        }
    }
    const removeTag = (tag: string) => onChange(tags.filter(t => t !== tag))

    return (
        <Field label={label}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                {tags.map(t => (
                    <span key={t} style={{ background: '#333', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {t}
                        <button type="button" onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: 0, fontSize: '12px', lineHeight: 1 }}>×</button>
                    </span>
                ))}
            </div>
            <TextInput value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type skill and press Enter" />
        </Field>
    )
}

function ProjectEntry({ proj, updateProj, removeProj, idx }: { proj: Project; updateProj: (p: Project) => void; removeProj: () => void; idx: number }) {
    const [open, setOpen] = useState(false)
    const warnings = getBulletWarnings(proj.desc)
    return (
        <div style={{ marginBottom: 'var(--space-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <div onClick={() => setOpen(!open)} style={{ background: 'var(--color-bg)', padding: 'var(--space-2)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px' }}>{proj.name || `New Project ${idx + 1}`}</strong>
                <span>{open ? '▼' : '▶'}</span>
            </div>
            {open && (
                <div style={{ padding: 'var(--space-2)', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                        <Field label="Project Title">
                            <TextInput value={proj.name} onChange={e => updateProj({ ...proj, name: e.target.value })} />
                        </Field>
                        <TagInput label="Tech Stack" tags={proj.techStack || []} onChange={ts => updateProj({ ...proj, techStack: ts })} />
                        <Field label="Live URL (Optional)">
                            <TextInput value={proj.link} onChange={e => updateProj({ ...proj, link: e.target.value })} />
                        </Field>
                        <Field label="GitHub URL (Optional)">
                            <TextInput value={proj.github} onChange={e => updateProj({ ...proj, github: e.target.value })} />
                        </Field>
                    </div>
                    <div style={{ marginTop: 'var(--space-1)' }}>
                        <Field label={`Description (${proj.desc.length}/200)`}>
                            <TextArea maxLength={200} value={proj.desc} onChange={e => updateProj({ ...proj, desc: e.target.value })} />
                        </Field>
                        {warnings.length > 0 && (
                            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-accent)' }}>
                                {warnings.map((w, i) => <div key={i}>• {w}</div>)}
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                        <Button variant="secondary" onClick={removeProj} style={{ background: '#ffeded', color: '#c00', border: 'none' }}>Delete</Button>
                    </div>
                </div>
            )}
        </div>
    )
}


function Home() {
    const navigate = useNavigate()
    return (
        <div style={{ textAlign: 'center', padding: 'var(--space-5) 0' }}>
            <h1 className="ds-headline" style={{ fontSize: '64px', marginBottom: 'var(--space-2)' }}>
                Build a Resume That Gets Read.
            </h1>
            <p className="ds-subtext" style={{ margin: '0 auto var(--space-4)' }}>
                A premium, minimal approach to professional storytelling. No noise, just your career in its best light.
            </p>
            <Button onClick={() => navigate('/builder')}>Start Building</Button>
        </div>
    )
}

function Builder({ data, update, template, setTemplate }: { data: ResumeData; update: (d: ResumeData) => void; template: TemplateType; setTemplate: (t: TemplateType) => void }) {
    const addEdu = () => update({ ...data, education: [...data.education, { id: Date.now().toString(), school: '', degree: '', year: '' }] })
    const addExp = () => update({ ...data, experience: [...data.experience, { id: Date.now().toString(), company: '', role: '', duration: '', desc: '' }] })
    const addProj = () => update({ ...data, projects: [...data.projects, { id: Date.now().toString(), name: '', desc: '', link: '', github: '', techStack: [] }] })

    const loadSample = () => update(SAMPLE_DATA)

    // Compute ATS Score
    let score = 20 // Base score
    const suggestions: string[] = []

    const summaryWords = data.summary.trim().split(/\s+/).filter(Boolean).length
    if (summaryWords >= 40 && summaryWords <= 120) {
        score += 15
    } else {
        suggestions.push("Write a stronger summary (40–120 words).")
    }

    if (data.projects.length >= 2) {
        score += 10
    } else {
        suggestions.push("Add at least 2 projects.")
    }

    if (data.experience.length >= 1) {
        score += 10
    } else {
        suggestions.push("Add internship or project work as experience.")
    }

    const toolsCount = data.skills?.tools?.length || 0;
    const techCount = data.skills?.technical?.length || 0;
    const softCount = data.skills?.soft?.length || 0;
    const totalSkills = techCount + softCount + toolsCount;

    if (totalSkills >= 8) {
        score += 10
    } else {
        suggestions.push("Add more skills (target 8+).")
    }

    if (data.links.github.trim() || data.links.linkedin.trim()) {
        score += 10
    } else {
        suggestions.push("Add a GitHub or LinkedIn link.")
    }

    const numberRegex = /\d+%?|%|k\b/i
    let hasNumber = false
    data.experience.forEach(exp => {
        if (numberRegex.test(exp.desc)) hasNumber = true
    })
    data.projects.forEach(proj => {
        if (numberRegex.test(proj.desc)) hasNumber = true
    })
    if (hasNumber) {
        score += 15
    } else {
        suggestions.push("Add measurable impact (numbers/%) in bullets.")
    }

    let eduComplete = false
    if (data.education.length > 0) {
        const firstEdu = data.education[0]
        if (firstEdu.school.trim() && firstEdu.degree.trim() && firstEdu.year.trim()) {
            eduComplete = true
        }
    }
    if (eduComplete) {
        score += 10
    } else {
        suggestions.push("Complete your education details.")
    }

    if (score > 100) score = 100
    const topImprovements = suggestions.slice(0, 3)

    return (
        <div className="ds-twoPanel">
            <div className="ds-panelStack" style={{ gap: 'var(--space-3)' }}>
                <Card title="Personal Information">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                        <Field label="Full Name">
                            <TextInput value={data.personal.name} onChange={e => update({ ...data, personal: { ...data.personal, name: e.target.value } })} />
                        </Field>
                        <Field label="Email">
                            <TextInput value={data.personal.email} onChange={e => update({ ...data, personal: { ...data.personal, email: e.target.value } })} />
                        </Field>
                        <Field label="Phone">
                            <TextInput value={data.personal.phone} onChange={e => update({ ...data, personal: { ...data.personal, phone: e.target.value } })} />
                        </Field>
                        <Field label="Location">
                            <TextInput value={data.personal.location} onChange={e => update({ ...data, personal: { ...data.personal, location: e.target.value } })} />
                        </Field>
                    </div>
                </Card>

                <Card title="Professional Summary">
                    <Field label="Summary">
                        <TextArea value={data.summary} onChange={e => update({ ...data, summary: e.target.value })} placeholder="Briefly describe your career goals and achievements..." />
                    </Field>
                </Card>

                <Card title="Experience">
                    {data.experience.map((exp, idx) => {
                        const warnings = getBulletWarnings(exp.desc)
                        return (
                            <div key={exp.id} style={{ marginBottom: 'var(--space-2)', borderBottom: idx < data.experience.length - 1 ? 'var(--border)' : 'none', paddingBottom: 'var(--space-2)' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                                    <Field label="Company">
                                        <TextInput value={exp.company} onChange={e => {
                                            const newExp = [...data.experience]; newExp[idx].company = e.target.value; update({ ...data, experience: newExp })
                                        }} />
                                    </Field>
                                    <Field label="Role">
                                        <TextInput value={exp.role} onChange={e => {
                                            const newExp = [...data.experience]; newExp[idx].role = e.target.value; update({ ...data, experience: newExp })
                                        }} />
                                    </Field>
                                    <Field label="Duration">
                                        <TextInput value={exp.duration} onChange={e => {
                                            const newExp = [...data.experience]; newExp[idx].duration = e.target.value; update({ ...data, experience: newExp })
                                        }} />
                                    </Field>
                                </div>
                                <div style={{ marginTop: 'var(--space-1)' }}>
                                    <Field label="Description">
                                        <TextArea value={exp.desc} onChange={e => {
                                            const newExp = [...data.experience]; newExp[idx].desc = e.target.value; update({ ...data, experience: newExp })
                                        }} />
                                    </Field>
                                    {warnings.length > 0 && (
                                        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-accent)' }}>
                                            {warnings.map((w, i) => <div key={i}>• {w}</div>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    <Button variant="secondary" onClick={addExp}>+ Add Experience</Button>
                </Card>

                <Card title="Projects">
                    {data.projects.map((proj, idx) => (
                        <ProjectEntry
                            key={proj.id}
                            proj={proj}
                            idx={idx}
                            updateProj={(p) => {
                                const newP = [...data.projects]; newP[idx] = p; update({ ...data, projects: newP })
                            }}
                            removeProj={() => {
                                const newP = [...data.projects]; newP.splice(idx, 1); update({ ...data, projects: newP })
                            }}
                        />
                    ))}
                    <Button variant="secondary" onClick={addProj}>+ Add Project</Button>
                </Card>

                <Card title="Education">
                    {data.education.map((edu, idx) => (
                        <div key={edu.id} style={{ marginBottom: 'var(--space-2)', borderBottom: idx < data.education.length - 1 ? 'var(--border)' : 'none', paddingBottom: 'var(--space-2)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                                <Field label="School">
                                    <TextInput value={edu.school} onChange={e => {
                                        const newEdu = [...data.education]; newEdu[idx].school = e.target.value; update({ ...data, education: newEdu })
                                    }} />
                                </Field>
                                <Field label="Degree">
                                    <TextInput value={edu.degree} onChange={e => {
                                        const newEdu = [...data.education]; newEdu[idx].degree = e.target.value; update({ ...data, education: newEdu })
                                    }} />
                                </Field>
                                <Field label="Year(s)">
                                    <TextInput value={edu.year} onChange={e => {
                                        const newEdu = [...data.education]; newEdu[idx].year = e.target.value; update({ ...data, education: newEdu })
                                    }} />
                                </Field>
                            </div>
                        </div>
                    ))}
                    <Button variant="secondary" onClick={addEdu}>+ Add Education</Button>
                </Card>

                <Card title="Skills">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0 }}>Skill Categories</h4>
                        <Button variant="secondary" onClick={() => {
                            const btn = document.activeElement as HTMLButtonElement;
                            if (btn) {
                                const orig = btn.innerText;
                                btn.innerText = "⏳ Loading...";
                                setTimeout(() => {
                                    update({
                                        ...data,
                                        skills: {
                                            technical: Array.from(new Set([...(data.skills?.technical || []), "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])),
                                            soft: Array.from(new Set([...(data.skills?.soft || []), "Team Leadership", "Problem Solving"])),
                                            tools: Array.from(new Set([...(data.skills?.tools || []), "Git", "Docker", "AWS"]))
                                        }
                                    });
                                    btn.innerText = orig;
                                }, 1000);
                            }
                        }}>✨ Suggest Skills</Button>
                    </div>
                    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                        <TagInput label={`Technical Skills (${data.skills?.technical?.length || 0})`} tags={data.skills?.technical || []} onChange={(t) => update({ ...data, skills: { ...data.skills, technical: t } })} />
                        <TagInput label={`Soft Skills (${data.skills?.soft?.length || 0})`} tags={data.skills?.soft || []} onChange={(t) => update({ ...data, skills: { ...data.skills, soft: t } })} />
                        <TagInput label={`Tools & Technologies (${data.skills?.tools?.length || 0})`} tags={data.skills?.tools || []} onChange={(t) => update({ ...data, skills: { ...data.skills, tools: t } })} />
                    </div>
                </Card>

                <Card title="Links">
                    <Field label="GitHub URL">
                        <TextInput value={data.links.github} onChange={e => update({ ...data, links: { ...data.links, github: e.target.value } })} />
                    </Field>
                    <Field label="LinkedIn URL">
                        <TextInput value={data.links.linkedin} onChange={e => update({ ...data, links: { ...data.links, linkedin: e.target.value } })} />
                    </Field>
                </Card>
            </div>

            <aside className="ds-panelStack">
                <Card title="ATS Readiness">
                    <div style={{ padding: 'var(--space-2)', background: 'var(--color-bg)', borderRadius: 'var(--radius)', border: 'var(--border)', marginBottom: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Readiness Score</strong>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', color: score >= 80 ? 'var(--color-state)' : 'var(--color-text)' }}>{score}</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${score}%`, height: '100%', background: score >= 80 ? 'var(--color-state)' : 'var(--color-accent)', transition: 'width 0.3s ease' }} />
                        </div>
                    </div>

                    {topImprovements.length > 0 && (
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', opacity: 0.8, textTransform: 'uppercase' }}>Top 3 Improvements</p>
                            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: 'var(--color-accent)' }}>
                                {topImprovements.map((sug, i) => <li key={i} style={{ marginBottom: '4px' }}>{sug}</li>)}
                            </ul>
                        </div>
                    )}
                </Card>

                <TemplateSelector template={template} setTemplate={setTemplate} />

                <Card title="Live Preview">
                    <div className="resume-preview-shell">
                        <ResumeDocument data={data} template={template} scale={0.65} />
                    </div>
                </Card>

                <Card title="Controls">
                    <Button variant="secondary" onClick={loadSample} style={{ width: '100%' }}>Load Sample Data</Button>
                    <div style={{ height: 'var(--space-1)' }} />
                    <Button variant="primary" onClick={() => window.print()} style={{ width: '100%' }}>Download PDF</Button>
                </Card>
            </aside>
        </div>
    )
}

function Preview({ data, template, setTemplate }: { data: ResumeData; template: TemplateType; setTemplate: (t: TemplateType) => void }) {
    const handleCopyText = () => {
        let text = `${data.personal.name}\n`
        const contactParts = []
        if (data.personal.email) contactParts.push(data.personal.email)
        if (data.personal.phone) contactParts.push(data.personal.phone)
        if (data.personal.location) contactParts.push(data.personal.location)
        if (contactParts.length) text += `${contactParts.join(' | ')}\n`
        text += `\n`

        if (data.summary) {
            text += `SUMMARY\n${data.summary}\n\n`
        }

        if (data.education.length > 0) {
            text += `EDUCATION\n`
            data.education.forEach(edu => {
                text += `${edu.school}`
                if (edu.degree) text += ` - ${edu.degree}`
                if (edu.year) text += ` (${edu.year})`
                text += `\n`
            })
            text += `\n`
        }

        if (data.experience.length > 0) {
            text += `EXPERIENCE\n`
            data.experience.forEach(exp => {
                const expParts = []
                if (exp.company) expParts.push(exp.company)
                if (exp.role) expParts.push(exp.role)
                if (exp.duration) expParts.push(exp.duration)
                if (expParts.length) text += `${expParts.join(' | ')}\n`
                if (exp.desc) text += `${exp.desc}\n`
                text += `\n`
            })
        }

        if (data.projects.length > 0) {
            text += `PROJECTS\n`
            data.projects.forEach(proj => {
                const projParts = []
                if (proj.name) projParts.push(proj.name)
                if (proj.link) projParts.push(proj.link)
                if (projParts.length) text += `${projParts.join(' | ')}\n`
                if (proj.techStack && proj.techStack.length > 0) text += `Tech Stack: ${proj.techStack.join(', ')}\n`
                if (proj.desc) text += `${proj.desc}\n`
                text += `\n`
            })
        }

        if (data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.tools.length > 0) {
            text += `SKILLS\n`
            if (data.skills.technical.length > 0) text += `Technical: ${data.skills.technical.join(', ')}\n`
            if (data.skills.soft.length > 0) text += `Soft Skills: ${data.skills.soft.join(', ')}\n`
            if (data.skills.tools.length > 0) text += `Tools & Technologies: ${data.skills.tools.join(', ')}\n`
            text += `\n`
        }

        const linkParts = []
        if (data.links.github) linkParts.push(data.links.github)
        if (data.links.linkedin) linkParts.push(data.links.linkedin)
        if (linkParts.length) {
            text += `LINKS\n${linkParts.join(' | ')}\n`
        }

        navigator.clipboard.writeText(text.trim()).then(() => {
            alert('Resume copied to clipboard!')
        })
    }

    const missingFields = []
    if (!data.personal.name.trim()) missingFields.push('Name')
    if (data.experience.length === 0 && data.projects.length === 0) missingFields.push('Experience & Projects')

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="no-print" style={{ marginBottom: 'var(--space-4)' }}>
                {missingFields.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-2)', padding: 'var(--space-2)', background: 'color-mix(in srgb, var(--color-bg) 92%, var(--color-warning))', border: '1px solid color-mix(in srgb, var(--color-warning) 50%, transparent)', borderRadius: 'var(--radius)', color: 'var(--color-text)', fontSize: 'var(--text-small)' }}>
                        <strong>Note:</strong> Your resume may look incomplete. Missing: <em>{missingFields.join(', ')}</em>.
                    </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <Button variant="primary" onClick={() => window.print()}>Print / Save as PDF</Button>
                    <Button variant="secondary" onClick={handleCopyText}>Copy Resume as Text</Button>
                </div>
                <TemplateSelector template={template} setTemplate={setTemplate} />
            </div>
            <div className="resume-print-container">
                <ResumeDocument data={data} template={template} />
            </div>
        </div>
    )
}

function Proof() {
    return (
        <div className="ds-panelStack">
            <Card title="Project Proof Artifacts">
                <p className="ds-cardBody">
                    This page serves as the placeholder for the development artifacts of the AI Resume Builder project.
                </p>
                <div style={{ height: 'var(--space-4)' }} />
                <div className="ds-empty">
                    <h4 className="ds-stateTitle">Architecture Artifacts</h4>
                    <p className="ds-stateBody">Visual documentation of the system's data flow and component hierarchy will be linked here.</p>
                </div>
                <div className="ds-empty">
                    <h4 className="ds-stateTitle">Technical Debt Log</h4>
                    <p className="ds-stateBody">Ongoing notes on optimization and future-proofing the resume engine.</p>
                </div>
            </Card>
        </div>
    )
}

// --- Main App ---

export default function App() {
    const [data, setData] = useState<ResumeData>(() => {
        const saved = localStorage.getItem('resumeBuilderData')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                // migrate skills
                if (typeof parsed.skills === 'string') {
                    const str = parsed.skills as string;
                    parsed.skills = { technical: str.split(',').map(s => s.trim()).filter(Boolean), soft: [], tools: [] }
                }
                // migrate projects
                if (parsed.projects) {
                    parsed.projects = parsed.projects.map((p: any) => ({
                        ...p,
                        techStack: p.techStack || [],
                        github: p.github || ''
                    }))
                }
                return parsed
            } catch {
                return DEFAULT_DATA
            }
        }
        return DEFAULT_DATA
    })

    const [template, setTemplate] = useState<TemplateType>(() => {
        const saved = localStorage.getItem('rb_resume_template') as TemplateType
        return saved ? saved : 'Classic'
    })

    const [proof, setProof] = useState<ProofState>({
        ui: { checked: false, proof: '' },
        logic: { checked: false, proof: '' },
        test: { checked: false, proof: '' },
        deployed: { checked: false, proof: '' },
    })

    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(data))
    }, [data])

    useEffect(() => {
        localStorage.setItem('rb_resume_template', template)
    }, [template])

    const updateProof = (key: ProofKey, next: { checked?: boolean; proof?: string }) => {
        setProof((prev) => ({ ...prev, [key]: { ...prev[key], ...next } }))
    }

    return (
        <div className="ds-shell">
            <TopNav />

            <main className="ds-main" style={{ marginTop: 'var(--space-3)' }}>
                <div className="ds-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/builder" element={<Builder data={data} update={setData} template={template} setTemplate={setTemplate} />} />
                        <Route path="/preview" element={<Preview data={data} template={template} setTemplate={setTemplate} />} />
                        <Route path="/proof" element={<Proof />} />
                    </Routes>
                </div>
            </main>

            <ProofFooter proof={proof} onChange={updateProof} />
        </div>
    )
}
