import type { ReactNode } from 'react'
import { abdominalHysterectomyTopics as topics } from '@/content/abdominal-hysterectomy'

function Icon({ name, className = '' }: { name: 'heart' | 'check' | 'care' | 'calendar' | 'alert' | 'arrow'; className?: string }) {
  const paths: Record<typeof name, ReactNode> = {
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    check: <path d="m5 12 4 4L19 6" />,
    care: <><rect x="4" y="4" width="16" height="16" rx="5" /><path d="M12 8v8M8 12h8" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-14 5h3m4 0h3" /></>,
    alert: <><path d="M10.3 4 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></>,
    arrow: <path d="m9 5 7 7-7 7" />,
  }
  return <svg className={`recovery-icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export function RecoveryDemo() {
  return <div className="recovery-demo">
    <aside className="recovery-draft"><span className="recovery-dot" />ต้นแบบสำหรับดูรูปแบบ<span>ยังไม่ใช่คำแนะนำสำหรับผู้ป่วย</span></aside>
    <section className="recovery-heading" aria-labelledby="recovery-title">
      <span className="recovery-kicker">คู่มือสำหรับอ่านเมื่อกลับบ้าน</span>
      <h1 id="recovery-title">คู่มือหลังผ่าตัดมดลูก<br />ผ่านหน้าท้อง</h1>
      <p>ฉบับร่าง · การตัดมดลูกออกทางแผลหน้าท้อง</p>
    </section>

    <nav className="recovery-outline" aria-labelledby="outline-title">
      <h2 id="outline-title">ในหน้านี้ อ่านอะไรบ้าง?</h2>
      <p>อ่านตามลำดับ หรือกดข้ามไปเรื่องที่ต้องการ</p>
      <ol>
        <li><a href="#recovery-care"><span className="recovery-outline-number">01</span><span><strong>การดูแลตัวเอง 8 เรื่อง</strong><small>อาหาร · อาบน้ำ · แผล · ยา · กิจกรรม · ขับถ่าย · เลือดออกและเพศสัมพันธ์ · นัดติดตาม</small></span><Icon name="arrow" /></a></li>
        <li><a href="#recovery-warning"><span className="recovery-outline-number">02</span><strong>สัญญาณเตือนที่ควรมาก่อนนัด</strong><Icon name="arrow" /></a></li>
        <li><a href="#recovery-help"><span className="recovery-outline-number">03</span><strong>ช่องทางติดต่อทีมรักษา</strong><Icon name="arrow" /></a></li>
      </ol>
    </nav>
    <p className="recovery-scope">สำหรับการตัดมดลูกออกผ่านหน้าท้อง (abdominal hysterectomy) ไม่ใช่การเลาะก้อนเนื้องอกโดยเก็บมดลูกไว้ หากมีการผ่าตัดอื่นร่วมด้วย หรือคำแนะนำเฉพาะต่างจากหน้านี้ ให้ยึดคำสั่งกลับบ้านของทีมรักษา</p>

    <section className="recovery-section" aria-labelledby="care-title" id="recovery-care">
      <div className="recovery-section-label">01 / การดูแลตัวเอง</div>
      <h2 id="care-title">เลือกอ่านทีละเรื่อง</h2><p className="recovery-subtitle">กดแต่ละเรื่อง แล้วอ่านตาม 3 หัวข้อ: ทำได้ · ควรเลี่ยง · ต้องพบแพทย์</p>
      <div className="recovery-topic-list">{topics.map(topic => <details className="recovery-topic" key={topic.title}><summary><span className="recovery-topic-icon"><Icon name={topic.icon} /></span><span><strong>{topic.title}</strong><small>{topic.subtitle}</small></span><span className="recovery-expand" aria-hidden="true">+</span></summary><div className="recovery-topic-body">{([
        { key: 'do', label: 'ทำได้', items: topic.do },
        { key: 'avoid', label: 'ควรเลี่ยง', items: topic.avoid },
        { key: 'seek', label: 'ต้องพบแพทย์', items: topic.seek },
      ]).map(group => <section className={`recovery-action recovery-action-${group.key}`} key={group.key}><h3>{group.label}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></section>)}</div></details>)}</div>
    <aside className="recovery-source-note"><strong>ที่มาของร่างเนื้อหา</strong><p>เรียบเรียงจาก NHS: <a href="https://www.nhs.uk/conditions/hysterectomy/recovery/">การฟื้นตัวหลังตัดมดลูก</a>, <a href="https://www.nhs.uk/tests-and-treatments/having-surgery/recovery/">การดูแลหลังผ่าตัด</a>, <a href="https://www.nhs.uk/tests-and-treatments/hysterectomy/risks/">ภาวะแทรกซ้อน</a> และ <a href="https://www.nhs.uk/conditions/anaphylaxis/">อาการแพ้รุนแรง</a> ยังไม่ได้รับการตรวจทานโดยทีมรักษา และยังตรวจต้นฉบับ ACOG, RTCOG และ RCOG ไม่ได้</p></aside>
    </section>

    <section className="recovery-section" id="recovery-warning" aria-labelledby="warning-title">
      <div className="recovery-section-label">02 / สังเกตอาการระหว่างพักฟื้น</div>
      <h2 id="warning-title">สัญญาณเตือนที่ควรมาก่อนนัด</h2>
      <div className="recovery-help-card"><Icon name="alert" /><div><h3>มีอาการผิดปกติ ไม่ต้องรอวันนัด</h3><ul className="recovery-warning-list"><li>แผลบวม แดง หรือปวดมากขึ้น มีหนอง หรือมีไข้ร่วมกับรู้สึกไม่สบาย</li><li>เลือดออกทางช่องคลอดมาก มีลิ่มเลือด หรือตกขาวมีกลิ่นเหม็น</li><li>ปวดท้องมากขึ้นร่วมกับอาเจียน ปัสสาวะไม่ออก หรือมีไข้ร่วมกับปัสสาวะแสบขัด</li><li>ขาข้างใดข้างหนึ่งบวม ปวด ร้อน หรือสีผิวเปลี่ยนไป ซึ่งอาจเป็นอาการของลิ่มเลือด</li></ul><div className="recovery-emergency"><strong>ขอความช่วยเหลือฉุกเฉินทันที</strong><p>หากหายใจลำบาก เจ็บหน้าอก หมดสติ หรือเลือดออกมากไม่หยุด</p></div><span className="recovery-placeholder-label">ร่างรายการอาการเตือน · รอทีมรักษาตรวจทาน</span></div></div>
    </section>

    <section className="recovery-section recovery-contact" id="recovery-help" aria-labelledby="help-title">
      <div className="recovery-section-label">03 / ช่องทางติดต่อ</div>
      <h2 id="help-title">ติดต่อทีมรักษา</h2>
      <p className="recovery-subtitle">เก็บช่องทางเหล่านี้ไว้ เผื่อต้องการสอบถาม</p>
      <div className="recovery-contact-card"><div><strong>คลินิก / หอผู้ป่วย</strong><span>รอระบุชื่อหน่วยงานและหมายเลขโทรศัพท์</span></div><div><strong>เวลาที่ติดต่อได้</strong><span>รอระบุวันและเวลาให้บริการ</span></div><div><strong>นอกเวลาหรือกรณีฉุกเฉิน</strong><span>รอระบุช่องทางตามระบบของโรงพยาบาล</span></div><span className="recovery-placeholder-label">ต้นแบบนี้ยังไม่มีปุ่มโทรใช้งานจริง</span></div>
    </section>

    <div className="recovery-end"><Icon name="heart" /><p>ดูแลตัวเองทีละนิด ในทุก ๆ วัน</p><small>ตัวอย่างการออกแบบ · ยังไม่ใช้แทนคำแนะนำจากทีมรักษา</small></div>
    <nav className="recovery-bottom-nav" aria-label="เมนูคู่มือหลังผ่าตัด"><a href="#recovery-care"><Icon name="care" /><span>วิธีดูแล</span></a><a href="#recovery-warning"><Icon name="alert" /><span>สัญญาณเตือน</span></a><a href="#recovery-help"><Icon name="calendar" /><span>ติดต่อ</span></a></nav>
  </div>
}
