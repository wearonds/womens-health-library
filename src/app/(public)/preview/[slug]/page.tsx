import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArticleView } from '@/components/ArticleView'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'ดูตัวอย่างร่าง', robots: { index: false, follow: false } }
export default async function Preview({ params }: { params: Promise<{ slug: string }> }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) notFound()
  const { docs } = await payload.find({ collection: 'articles', where: { slug: { equals: (await params).slug } }, user, overrideAccess: false, draft: true, limit: 1, depth: 0 })
  if (!docs[0]) notFound()
  return <><aside className="note"><strong>ตัวอย่างสำหรับทีมงาน · ยังไม่ใช่หน้าสาธารณะ</strong><p>สถานะ: {docs[0].workflow}</p></aside><ArticleView article={docs[0]} /></>
}
