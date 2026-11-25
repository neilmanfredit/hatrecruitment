/**
 * Proxycurl API client — LinkedIn profile enrichment.
 * Pricing: ~$0.10/profile lookup (500 credits = ~$49/mo).
 * Sign up: https://nubela.co/proxycurl
 *
 * LIMITATION: This is the RECOMMENDED approach for LinkedIn data.
 * Direct LinkedIn scraping violates LinkedIn ToS (hiQ v. LinkedIn, 2022).
 * Proxycurl is a licensed data aggregator with LinkedIn data.
 *
 * TOOL NEEDED: Requires a paid Proxycurl account.
 * Set PROXYCURL_API_KEY in .env to enable enrichment.
 */
const PROXYCURL_BASE = 'https://nubela.co/proxycurl/api/v2'

function getKey(): string {
  const key = process.env.PROXYCURL_API_KEY
  if (!key) throw new Error('PROXYCURL_API_KEY not set — sign up at nubela.co/proxycurl')
  return key
}

export interface LinkedInProfile {
  full_name: string
  occupation: string
  headline: string
  summary: string
  country: string
  city: string
  experiences: Array<{
    company: string
    title: string
    description: string
    starts_at: { year: number; month: number } | null
    ends_at: { year: number; month: number } | null
  }>
  education: Array<{
    school: string
    degree_name: string
    field_of_study: string
    starts_at: { year: number } | null
    ends_at: { year: number } | null
  }>
  skills: string[]
  profile_pic_url: string | null
}

export async function enrichLinkedInProfile(linkedinUrl: string): Promise<LinkedInProfile> {
  const res = await fetch(
    `${PROXYCURL_BASE}/linkedin?url=${encodeURIComponent(linkedinUrl)}&use_cache=if-recent&fallback_to_cache=on-error`,
    { headers: { Authorization: `Bearer ${getKey()}` } }
  )
  if (res.status === 404) throw new Error('LinkedIn profile not found')
  if (!res.ok) throw new Error(`Proxycurl error ${res.status}: ${await res.text()}`)
  return res.json()
}

export async function searchLinkedInPeople(params: {
  keywords: string
  country?: string
  city?: string
  currentRole?: string
  page?: number
}): Promise<{ results: Array<{ profile_url: string; full_name: string; headline: string }> }> {
  const qs = new URLSearchParams({ keyword_regex: params.keywords })
  if (params.country) qs.set('country', params.country)
  if (params.city) qs.set('city', params.city)
  if (params.currentRole) qs.set('current_role_title', params.currentRole)
  if (params.page) qs.set('page_size', '10')

  const res = await fetch(`${PROXYCURL_BASE}/search/person?${qs}`, {
    headers: { Authorization: `Bearer ${getKey()}` },
  })
  if (!res.ok) throw new Error(`Proxycurl search error ${res.status}`)
  return res.json()
}
