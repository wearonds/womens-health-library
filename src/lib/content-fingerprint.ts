import { createHash } from 'node:crypto'
const contentFields = ['title', 'slug', 'description', 'summary', 'urgentSymptoms', 'sections', 'questions', 'references']
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'id').sort(([a], [b]) => a.localeCompare(b)).map(([key, val]) => [key, canonical(val)]))
  return value
}
export function fingerprint(doc: Record<string, unknown>) {
  return createHash('sha256').update(JSON.stringify(contentFields.map(key => canonical(doc[key] ?? null)))).digest('hex')
}
