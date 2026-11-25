const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://192.168.0.14:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:32b'

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function chat(messages: OllamaMessage[], model = OLLAMA_MODEL): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false }),
  })
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`)
  const data = await res.json()
  return data.message?.content ?? ''
}

export async function scoreCV(jd: string, cv: string): Promise<{ score: number; strengths: string[]; concerns: string[]; summary: string }> {
  const prompt = `You are an expert recruitment AI. Score this CV against the job description on a scale of 0-100 based on skills match, not job titles.

JOB DESCRIPTION:
${jd}

CV:
${cv}

Respond with valid JSON only:
{
  "score": <number 0-100>,
  "summary": "<one sentence match summary>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "concerns": ["<concern 1>", "<concern 2>", ...]
}`

  const result = await chat([
    { role: 'system', content: 'You are a recruitment AI. Always respond with valid JSON.' },
    { role: 'user', content: prompt },
  ])

  return JSON.parse(result)
}

export async function draftJD(title: string, context: string): Promise<string> {
  return chat([
    { role: 'system', content: 'You are an expert recruitment consultant. Write clear, accurate job descriptions.' },
    { role: 'user', content: `Write a professional job description for: ${title}\n\nContext: ${context}` },
  ])
}

export async function draftOutreach(candidateName: string, jobTitle: string, company: string, matchSummary: string): Promise<string> {
  return chat([
    { role: 'system', content: 'You are a professional recruiter. Write concise, personalised outreach messages.' },
    {
      role: 'user',
      content: `Draft a LinkedIn outreach message to ${candidateName} about the ${jobTitle} role at ${company}.\nMatch summary: ${matchSummary}\nKeep it under 150 words, professional but warm.`,
    },
  ])
}
