import { ArticleView } from '@/components/ArticleView'
import { notFound } from 'next/navigation'
import { publishedArticles } from '@/lib/articles'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props) {
  const { docs } = await publishedArticles((await params).slug)
  return { title: docs[0]?.title ?? 'ไม่พบบทความ', description: docs[0]?.description }
}
export default async function ArticlePage({ params }: Props) {
  const { docs } = await publishedArticles((await params).slug)
  const article = docs[0]
  if (!article) notFound()
  return <ArticleView article={article} />
}
