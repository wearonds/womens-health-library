import type { Article, SiteSetting } from '../payload-types'
export type ArticleContent = Pick<Article, 'title' | 'slug' | 'description' | 'summary' | 'urgentSymptoms' | 'sections' | 'questions' | 'references' | 'reviewerName' | 'reviewedAt' | 'reviewCategory'>
export type PublicSiteSettings = Pick<SiteSetting, 'name' | 'introduction' | 'purpose' | 'scope' | 'reviewProcess' | 'team'>
export interface StaticArticle extends ArticleContent {
  publication: { status: 'draft' | 'published'; workflow: string; approvedFingerprint: string | null }
}
export interface StaticSnapshot {
  formatVersion: 1
  mode: 'public' | 'preview'
  site: PublicSiteSettings
  articles: StaticArticle[]
}
