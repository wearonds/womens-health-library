import type { ReactNode } from 'react'

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

const topics = [
  { title: 'อาหารและการดื่มน้ำ', subtitle: 'กินอะไรได้บ้าง · ข้อจำกัดที่ต้องรู้', icon: 'heart' as const, body: 'รับประทานอาหารและดื่มน้ำตามคำแนะนำตอนกลับบ้าน หากมีข้อจำกัดเรื่องอาหารหรือน้ำ ให้ยึดคำแนะนำเฉพาะของคุณ', detail: 'ส่วนที่จะเติม: อาหารที่เหมาะกับการผ่าตัดนี้ และข้อจำกัดจากโรคประจำตัว' },
  { title: 'การอาบน้ำ', subtitle: 'อาบอย่างไร · ระวังแผลเปียก', icon: 'care' as const, body: 'ทำตามคำแนะนำของทีมรักษาเรื่องการอาบน้ำและการรักษาแผลให้แห้ง วิธีอาบน้ำขึ้นกับลักษณะแผล ผ้าปิดแผล และอุปกรณ์ที่ติดอยู่', detail: 'ส่วนที่จะเติม: เริ่มอาบน้ำได้เมื่อไร วิธีป้องกันแผล และข้อจำกัดเรื่องการแช่น้ำ' },
  { title: 'การดูแลแผล', subtitle: 'ผ้าปิดแผล · ทำแผล · สังเกตความเปลี่ยนแปลง', icon: 'care' as const, body: 'ดูแลแผลตามวิธีที่ทีมรักษาสอน และสังเกตว่ามีอาการบวม ปวด หรือสีผิวบริเวณแผลเปลี่ยนไปมากขึ้นหรือไม่', detail: 'ส่วนที่จะเติม: วิธีและความถี่ในการทำแผล การตัดไหม และการดูแลสายระบายถ้ามี' },
  { title: 'การกินยาและบรรเทาปวด', subtitle: 'ใช้ยาตามฉลาก · ทบทวนคำสั่งกลับบ้าน', icon: 'heart' as const, body: 'ใช้ยาตามฉลากและคำสั่งตอนกลับบ้าน หากไม่แน่ใจวิธีใช้หรือมีปัญหาหลังใช้ยา ให้สอบถามทีมรักษาหรือเภสัชกรก่อนปรับยา', detail: 'ส่วนที่จะเติม: ข้อควรระวังเรื่องยา และสิ่งที่ต้องทำเมื่อบรรเทาปวดได้ไม่เพียงพอ โดยไม่ใส่รายการยาส่วนบุคคลในหน้าสาธารณะ' },
  { title: 'การเคลื่อนไหวและพักผ่อน', subtitle: 'ลุกเดิน · ออกแรง · กลับสู่กิจวัตร', icon: 'check' as const, body: 'เริ่มเคลื่อนไหวตามที่ทีมรักษาอนุญาต ค่อย ๆ เพิ่มกิจกรรมตามคำแนะนำและการฟื้นตัว หากไม่แน่ใจว่าทำอะไรได้บ้าง ให้สอบถามก่อน', detail: 'ส่วนที่จะเติม: การยกของ ออกกำลังกาย ขับรถ กลับไปทำงาน และมีเพศสัมพันธ์ ตามชนิดการผ่าตัด' },
  { title: 'การขับถ่าย', subtitle: 'ปัสสาวะ · อุจจาระ · สิ่งที่ควรสังเกต', icon: 'care' as const, body: 'หัวข้อนี้จะอธิบายการสังเกตปัสสาวะและอุจจาระระหว่างพักฟื้น รวมถึงปัญหาที่ควรแจ้งทีมรักษา โดยปรับให้ตรงกับการผ่าตัด', detail: 'ส่วนที่จะเติม: คำแนะนำเรื่องท้องผูก ปัสสาวะลำบาก และสายสวนปัสสาวะถ้ามี' },
  { title: 'การมาตามนัด', subtitle: 'เตรียมอะไร · ดูวันนัดจากที่ไหน', icon: 'calendar' as const, body: 'ดูวัน เวลา และสถานที่จากใบนัดของคุณ เตรียมรายการยาที่ใช้อยู่และจดคำถามที่ต้องการปรึกษา หากมาตามนัดไม่ได้ ให้ติดต่อโรงพยาบาล', detail: 'ส่วนที่จะเติม: สิ่งที่ต้องนำมา และการเตรียมตัวเฉพาะสำหรับการติดตามครั้งนี้' },
]

export function RecoveryDemo() {
  return <div className="recovery-demo">
    <aside className="recovery-draft"><span className="recovery-dot" />ต้นแบบสำหรับดูรูปแบบ<span>ยังไม่ใช่คำแนะนำสำหรับผู้ป่วย</span></aside>
    <section className="recovery-hero" aria-labelledby="recovery-title">

      <div className="recovery-hero-art" aria-hidden="true"><Icon name="heart" /><span className="recovery-art-plus">+</span><span className="recovery-art-dot" /></div>
      <span className="recovery-kicker">อ่านทบทวนเมื่อกลับบ้าน</span>
      <h1 id="recovery-title">คู่มือดูแลตัวเอง<br />หลังผ่าตัด</h1>
      <p>ค่อย ๆ ฟื้นตัวในจังหวะของคุณ<br />เปิดอ่าน ทบทวน และดูแลตัวเองทีละวัน</p>
      <a className="recovery-primary" href="#recovery-care">เลือกเรื่องที่อยากอ่าน <Icon name="arrow" /></a>
      <div className="recovery-hero-foot"><span>อ่านง่ายบนมือถือ</span><span>กลับมาเปิดดูได้เสมอ</span></div>
    </section>

    <section className="recovery-section" aria-labelledby="care-title" id="recovery-care">
      <div className="recovery-section-label">01 / การดูแลตัวเอง</div>
      <h2 id="care-title">เลือกอ่านทีละเรื่อง</h2><p className="recovery-subtitle">กดหัวข้อเพื่อดูคำแนะนำที่ต้องการทบทวน</p>
      <div className="recovery-topic-list">{topics.map(topic => <details className="recovery-topic" key={topic.title}><summary><span className="recovery-topic-icon"><Icon name={topic.icon} /></span><span><strong>{topic.title}</strong><small>{topic.subtitle}</small></span><span className="recovery-expand" aria-hidden="true">+</span></summary><div className="recovery-topic-body"><span className="recovery-placeholder-label">ร่างเนื้อหา · รอปรับตามการผ่าตัด</span><p>{topic.body}</p><p className="recovery-topic-detail">{topic.detail}</p></div></details>)}</div>
    </section>

    <section className="recovery-checklist recovery-section" id="recovery-checklist" aria-labelledby="checklist-title">
      <div className="recovery-checklist-heading"><div><div className="recovery-section-label">02 / ทบทวนวันนี้</div><h2 id="checklist-title">ทีละข้อ ก็เพียงพอ</h2></div><Icon name="check" /></div>
      <p>ลองติ๊กสิ่งที่ทบทวนแล้ว</p>
      <form><fieldset><legend className="recovery-sr-only">รายการทบทวนตัวอย่าง</legend>{['ทบทวนคำแนะนำตอนกลับบ้าน', 'ดูรายการยาที่ได้รับ', 'เตรียมคำถามสำหรับทีมรักษา', 'ตรวจวันนัดครั้งถัดไป'].map((item, i) => <label className="recovery-check-row" key={item}><input type="checkbox" name={`task-${i}`} /><span>{item}</span></label>)}</fieldset><div className="recovery-checklist-foot"><span>ใช้ช่วยจำ ไม่ใช้ประเมินอาการ</span><button type="reset">เริ่มใหม่</button></div></form>
      <p className="recovery-local-note">รายการไม่ส่งให้ทีมรักษาและไม่บันทึกข้ามการใช้งาน</p>
    </section>

    <section className="recovery-section" id="recovery-warning" aria-labelledby="warning-title">
      <div className="recovery-section-label">03 / สังเกตอาการระหว่างพักฟื้น</div>
      <h2 id="warning-title">สัญญาณเตือนที่ควรมาก่อนนัด</h2>
      <div className="recovery-help-card"><Icon name="alert" /><div><h3>มีอาการผิดปกติ ไม่ต้องรอวันนัด</h3><ul className="recovery-warning-list"><li>แผลบวม แดง หรือปวดมากขึ้น มีหนอง หรือมีไข้ร่วมกับรู้สึกไม่สบาย</li><li>ขาข้างใดข้างหนึ่งบวม ปวด ร้อน หรือสีผิวเปลี่ยนไป ซึ่งอาจเป็นอาการของลิ่มเลือด</li></ul><div className="recovery-emergency"><strong>ขอความช่วยเหลือฉุกเฉินทันที</strong><p>หากหายใจลำบาก เจ็บหน้าอก หมดสติ หรือเลือดออกมากไม่หยุด</p></div><span className="recovery-placeholder-label">รายการยังไม่ครบ · ต้องเพิ่มอาการเตือนเฉพาะการผ่าตัด</span></div></div>
    </section>

    <section className="recovery-section recovery-contact" id="recovery-help" aria-labelledby="help-title">
      <div className="recovery-section-label">04 / ช่องทางติดต่อ</div>
      <h2 id="help-title">ติดต่อทีมรักษา</h2>
      <p className="recovery-subtitle">เก็บช่องทางเหล่านี้ไว้ เผื่อต้องการสอบถาม</p>
      <div className="recovery-contact-card"><div><strong>คลินิก / หอผู้ป่วย</strong><span>รอระบุชื่อหน่วยงานและหมายเลขโทรศัพท์</span></div><div><strong>เวลาที่ติดต่อได้</strong><span>รอระบุวันและเวลาให้บริการ</span></div><div><strong>นอกเวลาหรือกรณีฉุกเฉิน</strong><span>รอระบุช่องทางตามระบบของโรงพยาบาล</span></div><span className="recovery-placeholder-label">ต้นแบบนี้ยังไม่มีปุ่มโทรใช้งานจริง</span></div>
    </section>
    <div className="recovery-end"><Icon name="heart" /><p>ดูแลตัวเองทีละนิด ในทุก ๆ วัน</p><small>ตัวอย่างการออกแบบ · ยังไม่ใช้แทนคำแนะนำจากทีมรักษา</small></div>
    <nav className="recovery-bottom-nav" aria-label="เมนูคู่มือหลังผ่าตัด"><a href="#recovery-care"><Icon name="care" /><span>วิธีดูแล</span></a><a href="#recovery-checklist"><Icon name="check" /><span>เช็กลิสต์</span></a><a href="#recovery-warning"><Icon name="alert" /><span>สัญญาณเตือน</span></a><a href="#recovery-help"><Icon name="calendar" /><span>ติดต่อ</span></a></nav>
  </div>
}
