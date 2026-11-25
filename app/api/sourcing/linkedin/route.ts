import { NextResponse } from 'next/server'
import { withAuth, RECRUITER_ROLES } from '@/lib/rbac'
import { enrichLinkedInProfile, searchLinkedInPeople } from '@/lib/proxycurl'
import { db } from '@/lib/db'

/**
 * LinkedIn sourcing via Proxycurl (licensed data aggregator).
 *
 * TOOL LIMITATION: Requires PROXYCURL_API_KEY (~$49/mo for 500 credits).
 * Without it, this endpoint returns a 503 with setup instructions.
 *
 * Direct LinkedIn scraping is intentionally NOT implemented — it violates
 * LinkedIn ToS and risks account bans. Proxycurl is the compliant path.
 */

export const GET = withAuth(async (req) => {
  if (!process.env.PROXYCURL_API_KEY) {
    return NextResponse.json({
      error: 'LinkedIn enrichment not configured',
      hint: 'Set PROXYCURL_API_KEY — sign up at nubela.co/proxycurl (~$49/mo for 500 profile lookups)',
      alternative: 'Install the HAT Recruit browser extension (see /wiki/recruit/sourcing) to passively capture LinkedIn profiles you view',
    }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const profileUrl = searchParams.get('profileUrl')
  const keywords = searchParams.get('keywords')

  if (profileUrl) {
    const profile = await enrichLinkedInProfile(profileUrl)
    return NextResponse.json(profile)
  }

  if (keywords) {
    const results = await searchLinkedInPeople({
      keywords,
      country: searchParams.get('country') ?? 'GB',
    })

    // Store as sourcing leads
    for (const r of results.results.slice(0, 10)) {
      await db.sourcingLead.create({
        data: {
          source: 'linkedin_proxycurl',
          type: 'candidate',
          name: r.full_name,
          linkedinUrl: r.profile_url,
          rawData: r as never,
        },
      }).catch(() => null) // Ignore duplicates
    }

    return NextResponse.json(results)
  }

  return NextResponse.json({ error: 'Provide profileUrl or keywords' }, { status: 400 })
}, RECRUITER_ROLES)
