import Link from 'next/link'
import type { ReactNode } from 'react'
import type { PublicSiteSettings } from '@/static/types'
export function SiteFrame({ settings, children, preview = false }: { settings: PublicSiteSettings; children: ReactNode; preview?: boolean }) {
  return <><a className="skip" href="#main">ข้ามไปเนื้อหา</a><header><nav className="wrap"><Link className="brand" href="/">♡ {settings.name}</Link><Link href="/about">เกี่ยวกับเว็บไซต์</Link></nav></header><main id="main" className="wrap">{preview && <aside className="note"><strong>ตัวอย่างเว็บไซต์ · บทความยังเป็นร่าง</strong><p>สำหรับตรวจรูปแบบและเนื้อหาก่อนเผยแพร่</p></aside>}{children}</main><footer className="wrap"><p>ข้อมูลเพื่ออ่านทบทวน ใช้ประกอบคำแนะนำจากแพทย์ผู้รักษา</p><Link href="/">หน้าแรก</Link> · <Link href="/about">เกี่ยวกับเว็บไซต์</Link></footer></>
}
