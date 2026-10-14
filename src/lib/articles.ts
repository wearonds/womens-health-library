import config from '@payload-config'
import { getPayload } from 'payload'
export async function publishedArticles(slug?: string) {
  const payload = await getPayload({ config })
  // Local API bypasses access by default: explicitly apply public access.
  return payload.find({ collection: 'articles', overrideAccess: false, draft: false, depth: 0, limit: 100, where: slug ? { slug: { equals: slug } } : undefined })
}
