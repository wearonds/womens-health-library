import Link from 'next/link'
import type { PublicSiteSettings } from '@/static/types'
export function AboutView({ settings }: { settings: PublicSiteSettings }) {
  return (
    <>
      <nav className="breadcrumb" aria-label="ตำแหน่งหน้า">
        <Link href="/">หน้าแรก</Link> › เกี่ยวกับเว็บไซต์
      </nav>
      <h1>เกี่ยวกับเว็บไซต์</h1>
      <p className="lead">
        {settings.name} สำหรับผู้ป่วยที่ต้องการอ่านทบทวนหลังพบแพทย์
      </p>
      <section className="panel">
        <h2>วัตถุประสงค์</h2>
        <p className="body-text">{settings.purpose}</p>
      </section>
      <section className="article-section">
        <h2>อ่านเว็บไซต์นี้อย่างไร</h2>
        <ol>
          <li>เลือกเรื่องที่แพทย์แนะนำ แล้วเริ่มจากสรุปสิ่งที่ควรรู้</li>
          <li>อ่านอาการที่ควรรีบพบแพทย์ หากมีอาการดังกล่าว ให้ติดต่อสถานพยาบาลตามคำแนะนำ</li>
          <li>ใช้สารบัญเลือกหัวข้อที่อยากทบทวน เช่น การตรวจ การรักษา หรือการดูแลตัวเอง</li>
          <li>จดคำถามที่ยังสงสัยไว้พูดคุยกับแพทย์ในการนัดครั้งต่อไป</li>
        </ol>
      </section>
      <section className="article-section">
        <h2>การตรวจทานเนื้อหา</h2>
        <p className="body-text">{settings.reviewProcess}</p>
      </section>
      <section className="article-section">
        <h2>ผู้จัดทำ</h2>
        <p className="body-text">{settings.team}</p>
      </section>
      <aside className="note" aria-labelledby="scope-title">
        <h2 id="scope-title">ขอบเขตข้อมูล</h2>
        <p className="body-text">{settings.scope}</p>
      </aside>
      <Link className="button" href="/">กลับไปเลือกบทความ</Link>
    </>
  )
}
