/**
 * Reed.co.uk API client — UK job board, free tier (150 req/day).
 * Docs: https://www.reed.co.uk/developers/jobseeker
 *
 * LIMITATION: Reed provides job search + candidate applications only.
 * For candidate CVs (CV search): requires a Reed Recruiter account (paid).
 * For LinkedIn candidate data: use Proxycurl (see lib/proxycurl.ts).
 */
const REED_API_BASE = 'https://www.reed.co.uk/api/1.0'

function authHeader(): string {
  const key = process.env.REED_API_KEY
  if (!key) throw new Error('REED_API_KEY not set — register at reed.co.uk/developers')
  return `Basic ${Buffer.from(`${key}:`).toString('base64')}`
}

export interface ReedJob {
  jobId: number
  employerName: string
  employerId: number
  employerProfileId: number | null
  employerProfileName: string | null
  jobTitle: string
  locationName: string
  minimumSalary: number | null
  maximumSalary: number | null
  currency: string | null
  expirationDate: string
  date: string
  jobDescription: string
  applications: number
  jobUrl: string
}

export async function searchJobs(params: {
  keywords?: string
  locationName?: string
  distancefromLocation?: number
  minimumSalary?: number
  maximumSalary?: number
  fullTime?: boolean
  partTime?: boolean
  contract?: boolean
  permanent?: boolean
  resultsToTake?: number
  resultsToSkip?: number
}): Promise<ReedJob[]> {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) qs.set(k, String(v))
  }

  const res = await fetch(`${REED_API_BASE}/search?${qs}`, {
    headers: { Authorization: authHeader(), Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Reed API error ${res.status}`)
  const data = await res.json()
  return data.results ?? []
}

export async function getJobDetail(jobId: number): Promise<ReedJob> {
  const res = await fetch(`${REED_API_BASE}/jobs/${jobId}`, {
    headers: { Authorization: authHeader(), Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Reed API error ${res.status}`)
  return res.json()
}
