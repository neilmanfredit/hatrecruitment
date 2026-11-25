const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://192.168.0.14:11434'
// qwen2.5:32b — text-focused; better for CV/outreach prose than qwen2.5-coder:32b
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5:32b'
// 8192 required for tender analysis (up to ~6k input tokens)
const NUM_CTX = parseInt(process.env.OLLAMA_NUM_CTX ?? '8192', 10)

export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function chat(messages: OllamaMessage[], model = OLLAMA_MODEL): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false, options: { num_ctx: NUM_CTX } }),
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

export async function analyseTender(rawText: string, clientName: string): Promise<{
  score: number
  summary: string
  requirements: string[]
  risks: string[]
}> {
  const result = await chat([
    { role: 'system', content: 'You are a recruitment business development expert. Analyse tender documents. Always respond with valid JSON only.' },
    {
      role: 'user',
      content: `Client: ${clientName}\n\nTENDER:\n${rawText}\n\nRespond with JSON: {"score":<0-100>,"summary":"<≤100 words>","requirements":["..."],"risks":["..."]}`,
    },
  ])
  const json = result.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(json)
}
