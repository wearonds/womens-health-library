import type { Article, SiteSetting } from '../payload-types'
import type { StaticArticle, PublicSiteSettings, StaticSnapshot } from './types'
import { fingerprint } from '../lib/content-fingerprint'
export function publicSettings(settings: SiteSetting): PublicSiteSettings {
  const { name, introduction, purpose, scope, reviewProcess, team } = settings
  return { name, introduction, purpose, scope, reviewProcess, team }
}
export function snapshotArticle(article: Article): StaticArticle {
  return {
    title: article.title, slug: article.slug, description: article.description,
    summary: article.summary?.map(({ text }) => ({ text })) ?? null,
    urgentSymptoms: article.urgentSymptoms ?? null,
    sections: article.sections?.map(({ heading, body }) => ({ heading, body })) ?? null,
    questions: article.questions?.map(({ text }) => ({ text })) ?? null,
    references: article.references?.map(({ title, url }) => ({ title, url })) ?? null,
    reviewCategory: article.reviewCategory ?? 'editorial', reviewerName: article.reviewerName ?? null, reviewedAt: article.reviewedAt ?? null,
    publication: { status: article._status ?? 'draft', workflow: article.workflow, approvedFingerprint: article.approvedFingerprint ?? null },
  }
}
export function validateSnapshot(snapshot: StaticSnapshot, mode: 'public' | 'preview') {
  if (snapshot.formatVersion !== 1 || snapshot.mode !== mode || !Array.isArray(snapshot.articles) || !snapshot.site?.name) throw new Error('Invalid static snapshot or wrong export mode')
  const slugs = new Set<string>()
  for (const article of snapshot.articles) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || slugs.has(article.slug)) throw new Error('Invalid or duplicate article slug')
    slugs.add(article.slug)
    if (!['editorial', 'medical'].includes(article.reviewCategory)) throw new Error('Missing or invalid approval category')
    for (const reference of article.references ?? []) if (new URL(reference.url).protocol !== 'https:') throw new Error('Only HTTPS references are allowed')
    if (mode === 'public') {
      if (article.publication.status !== 'published' || article.publication.workflow !== 'published' || article.publication.approvedFingerprint !== fingerprint(article as unknown as Record<string, unknown>) || !article.reviewerName || !article.reviewedAt || !Number.isFinite(Date.parse(article.reviewedAt))) throw new Error(`Refusing to export an unapproved or changed article: ${article.slug}`)
    }
  }
}
