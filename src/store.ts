// --- Unified Platform Data Model ---

export interface Education {
    id: string
    school: string
    degree: string
    year: string
}

export interface Experience {
    id: string
    company: string
    role: string
    duration: string
    desc: string
}

export interface Project {
    id: string
    name: string
    desc: string
    techStack: string[]
    link: string
    github: string
}

export interface ResumeData {
    personal: { name: string; email: string; phone: string; location: string }
    summary: string
    education: Education[]
    experience: Experience[]
    projects: Project[]
    skills: { technical: string[]; soft: string[]; tools: string[] }
    links: { github: string; linkedin: string }
}

export interface JobMatch {
    id: string
    title: string
    company: string
    location: string
    type: string
    salary: string
    matchScore: number
    skills: string[]
    description: string
    postedAt: string
    saved: boolean
    applied: boolean
}

export interface Application {
    id: string
    company: string
    role: string
    stage: string
    appliedAt: string
    notes: string
    link: string
    updatedAt: string
}

export interface JDAnalysis {
    id: string
    jobTitle: string
    company: string
    analyzedAt: string
    jdText: string
    extractedSkills: string[]
    requiredVerbs: string[]
    matchedSkills: string[]
    missingSkills: string[]
    alignmentScore: number
    experienceRequired: string
    seniority: string
    remote: boolean
    suggestions: string[]
}

export interface Notification {
    icon: string
    title: string
    message: string
    type: 'success' | 'warning' | 'info'
    createdAt: string
}

export interface Preferences {
    targetRole: string
    locations: string[]
    salaryMin: string
    salaryMax: string
    jobTypes: string[]
    experienceLevel: string
    notifications: { newJobAlerts?: boolean; resumeTips?: boolean; applicationReminders?: boolean }
}

export interface ReadinessScore {
    jobMatchQuality: number      // 0–100, weight 30%
    jdSkillAlignment: number     // 0–100, weight 25%
    resumeATS: number            // 0–100, weight 25%
    applicationProgress: number  // 0–100, weight 10%
    practiceCompletion: number   // 0–100, weight 10%
}

export interface AppState {
    preferences: Preferences
    resumeData: ResumeData
    jobMatches: JobMatch[]
    applications: Application[]
    jdAnalyses: JDAnalysis[]
    readinessScore: ReadinessScore
    notifications: Notification[]
    lastActivity: string
}

const DEFAULT_RESUME: ResumeData = {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] },
    links: { github: '', linkedin: '' }
}

const DEFAULT_PREFERENCES: Preferences = {
    targetRole: '',
    locations: [],
    salaryMin: '',
    salaryMax: '',
    jobTypes: ['Full-time'],
    experienceLevel: 'Mid-level',
    notifications: { newJobAlerts: true, resumeTips: true, applicationReminders: true }
}

const DEFAULT_READINESS: ReadinessScore = {
    jobMatchQuality: 0,
    jdSkillAlignment: 0,
    resumeATS: 0,
    applicationProgress: 0,
    practiceCompletion: 0,
}

export const DEFAULT_STATE: AppState = {
    preferences: DEFAULT_PREFERENCES,
    resumeData: DEFAULT_RESUME,
    jobMatches: [],
    applications: [],
    jdAnalyses: [],
    readinessScore: DEFAULT_READINESS,
    notifications: [],
    lastActivity: new Date().toISOString(),
}

// --- ATS Score Calculator ---
export function calculateATSScore(data: ResumeData): { score: number; suggestions: string[] } {
    let score = 0
    const suggestions: string[] = []

    if (data.personal.name.trim()) score += 10
    else suggestions.push('Add a professional name (+10 points)')

    if (data.personal.email.trim()) score += 10
    else suggestions.push('Add an email address (+10 points)')

    if (data.summary.trim().length > 50) score += 10
    else suggestions.push('Add a professional summary > 50 characters (+10 points)')

    const actionVerbs = /(built|led|designed|improved|created|developed|managed|optimized|automated)/i
    if (data.summary && actionVerbs.test(data.summary)) score += 10
    else suggestions.push('Use strong action verbs in your summary (+10 points)')

    const expWithDesc = data.experience.some(exp => exp.desc.trim().length > 0)
    if (data.experience.length > 0 && expWithDesc) score += 15
    else suggestions.push('Add experience with bullet points (+15 points)')

    if (data.education.length > 0 && data.education[0].school.trim()) score += 10
    else suggestions.push('Add at least one education entry (+10 points)')

    const totalSkills = (data.skills?.technical?.length || 0) + (data.skills?.soft?.length || 0) + (data.skills?.tools?.length || 0)
    if (totalSkills >= 5) score += 10
    else suggestions.push('Add at least 5 skills (+10 points)')

    if (data.projects.length > 0 && data.projects[0].name.trim()) score += 10
    else suggestions.push('Add at least one project (+10 points)')

    if (data.personal.phone.trim()) score += 5
    else suggestions.push('Add a phone number (+5 points)')

    if (data.links.linkedin.trim()) score += 5
    else suggestions.push('Add a LinkedIn profile (+5 points)')

    if (data.links.github.trim()) score += 5
    else suggestions.push('Add a GitHub profile (+5 points)')

    return { score: Math.min(score, 100), suggestions }
}

// --- Readiness Score Calculator ---
export function calculateReadiness(state: AppState): ReadinessScore {
    // Resume ATS (25% weight)
    const resumeATS = calculateATSScore(state.resumeData).score

    // Job Match Quality (30%) - based on saved jobs and high match scores
    const savedHigh = state.jobMatches.filter(j => j.saved && j.matchScore >= 70).length
    const jobMatchQuality = Math.min(100, savedHigh * 20 + (state.jobMatches.length > 0 ? 20 : 0))

    // JD Skill Alignment (25%) - average of analysis scores
    const jdSkillAlignment = state.jdAnalyses.length > 0
        ? Math.round(state.jdAnalyses.reduce((s, a) => s + a.alignmentScore, 0) / state.jdAnalyses.length)
        : 0

    // Application Progress (10%) - based on pipeline stage
    const stageWeights: Record<string, number> = { 'Wishlist': 10, 'Applied': 40, 'Phone Screen': 60, 'Interview': 80, 'Offer': 100, 'Rejected': 20 }
    const applicationProgress = state.applications.length > 0
        ? Math.round(state.applications.reduce((s, a) => s + (stageWeights[a.stage] || 0), 0) / state.applications.length)
        : 0

    // Practice Completion (10%) - placeholder
    const practiceCompletion = 0

    return { resumeATS, jobMatchQuality, jdSkillAlignment, applicationProgress, practiceCompletion }
}

// --- Notification Generator ---
export function generateNotifications(state: AppState): Notification[] {
    const notes: Notification[] = []
    const { score } = calculateATSScore(state.resumeData)

    if (score < 50) notes.push({ icon: '📄', title: 'Resume Needs Work', message: `Your ATS score is ${score}/100. Improve it to get more interviews.`, type: 'warning', createdAt: new Date().toISOString() })
    else if (score >= 80) notes.push({ icon: '✅', title: 'Strong Resume!', message: `Your resume scores ${score}/100 — you\'re ready to apply!`, type: 'success', createdAt: new Date().toISOString() })

    if (state.jdAnalyses.length === 0) notes.push({ icon: '🔍', title: 'Analyze a Job Description', message: 'Paste a JD to see how well your skills align.', type: 'info', createdAt: new Date().toISOString() })

    if (state.applications.length === 0) notes.push({ icon: '📬', title: 'Start Applying!', message: 'Add your first job application to track your progress.', type: 'info', createdAt: new Date().toISOString() })

    const interviews = state.applications.filter(a => a.stage === 'Interview')
    if (interviews.length > 0) notes.push({ icon: '🎯', title: `${interviews.length} Interview(s)!`, message: `You have ${interviews.length} application(s) at interview stage. Prepare now!`, type: 'success', createdAt: new Date().toISOString() })

    return notes
}

// --- localStorage helpers ---
const STORAGE_KEY = 'rb_platform_state'

export function loadState(): AppState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return DEFAULT_STATE
        const parsed = JSON.parse(raw)
        // Migrate old resume builder data
        if (!parsed.resumeData) {
            const oldResume = localStorage.getItem('resumeBuilderData')
            if (oldResume) {
                try {
                    parsed.resumeData = JSON.parse(oldResume)
                } catch { }
            }
        }
        return { ...DEFAULT_STATE, ...parsed }
    } catch {
        return DEFAULT_STATE
    }
}

export function saveState(state: AppState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        // Keep legacy key in sync
        localStorage.setItem('resumeBuilderData', JSON.stringify(state.resumeData))
    } catch { }
}
