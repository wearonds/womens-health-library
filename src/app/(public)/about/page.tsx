import { siteSettings } from '@/lib/site'
import { AboutView } from '@/components/AboutView'
export const metadata = { title: 'เกี่ยวกับเว็บไซต์' }
export default async function About() {
  return <AboutView settings={await siteSettings()} />
}
