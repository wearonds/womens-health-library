import './styles.css'
import { siteSettings } from '@/lib/site'
import { SiteFrame } from '@/components/SiteFrame'
export const dynamic = 'force-dynamic'
export const metadata = { title: { default: 'คลังความรู้สุขภาพสตรี', template: '%s | คลังความรู้สุขภาพสตรี' }, description: 'อ่านทบทวนหลังพบแพทย์ และเตรียมคำถามสำหรับการนัดครั้งต่อไป' }
export default async function Layout({ children }: { children: React.ReactNode }) {
  const settings = await siteSettings()
  return <html lang="th"><body><SiteFrame settings={settings}>{children}</SiteFrame></body></html>
}
