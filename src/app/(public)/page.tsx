import { siteSettings } from '@/lib/site'
import { publishedArticles } from '@/lib/articles'
import { HomeView } from '@/components/HomeView'
export const dynamic = 'force-dynamic'
export default async function Home() {
  const settings = await siteSettings()
  const { docs } = await publishedArticles()
  return <HomeView settings={settings} articles={docs} />
}
