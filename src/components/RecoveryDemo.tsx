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
  { title: 'ดูแลแผล', subtitle: 'ทำความสะอาด · อาบน้ำ · สังเกตแผล', icon: 'care' as const, body: 'ส่วนนี้จะเป็นคำแนะนำการดูแลแผล พร้อมภาพประกอบและข้อควรระวังที่ตรงกับชนิดการผ่าตัดของคุณ' },
  { title: 'ยาและการบรรเทาปวด', subtitle: 'ทบทวนวิธีใช้ยาจากทีมรักษา', icon: 'heart' as const, body: 'ส่วนนี้จะอธิบายวิธีอ่านฉลากยา สิ่งที่ควรสอบถาม และช่องทางติดต่อเมื่อมีปัญหาเรื่องยา โดยไม่แสดงข้อมูลยาส่วนบุคคลบนหน้าสาธารณะ' },
  { title: 'อาหารและการเคลื่อนไหว', subtitle: 'ค่อย ๆ กลับสู่กิจวัตรประจำวัน', icon: 'check' as const, body: 'ส่วนนี้จะระบุกิจกรรม อาหาร และข้อจำกัดที่ทีมรักษาตรวจทานแล้วสำหรับการผ่าตัดนี้' },
]
const stages = [
  { id: 'home', title: 'กลับถึงบ้าน', heading: 'เริ่มต้นอย่างอุ่นใจ', description: 'พื้นที่สำหรับสรุปสิ่งที่ควรทบทวนเมื่อกลับบ้าน เช่น เอกสารกลับบ้าน รายการยา และช่องทางติดต่อทีมรักษา' },
  { id: 'rest', title: 'พักฟื้นที่บ้าน', heading: 'ดูแลตัวเองทีละวัน', description: 'พื้นที่สำหรับคำแนะนำระหว่างพักฟื้น โดยปรับกิจกรรมและข้อจำกัดให้ตรงกับชนิดการผ่าตัด' },
  { id: 'visit', title: 'เตรียมวันนัด', heading: 'พร้อมสำหรับการติดตาม', description: 'พื้นที่สำหรับเตือนเรื่องใบนัด สิ่งที่ควรเตรียม และคำถามที่อยากปรึกษาทีมรักษา' },
]

export function RecoveryDemo() {
  return <div className="recovery-demo">
    <aside className="recovery-draft"><span className="recovery-dot" />ต้นแบบสำหรับดูรูปแบบ<span>ยังไม่ใช่คำแนะนำสำหรับผู้ป่วย</span></aside>
    <section className="recovery-hero" aria-labelledby="recovery-title">
      <div className="recovery-eyebrow">YOUR RECOVERY COMPANION</div>
      <div className="recovery-hero-art" aria-hidden="true"><Icon name="heart" /><span className="recovery-art-plus">+</span><span className="recovery-art-dot" /></div>
      <span className="recovery-kicker">คู่มือดูแลตัวเองหลังผ่าตัด</span>
      <h1 id="recovery-title">กลับบ้านแล้ว<br />เรายังดูแลคุณอยู่</h1>
      <p>ค่อย ๆ ฟื้นตัวในจังหวะของคุณ<br />เปิดอ่าน ทบทวน และดูแลตัวเองทีละวัน</p>
      <a className="recovery-primary" href="#recovery-today">เริ่มดูแลตัวเองวันนี้ <Icon name="arrow" /></a>
      <div className="recovery-hero-foot"><span>อ่านง่ายบนมือถือ</span><span>กลับมาเปิดดูได้เสมอ</span></div>
    </section>

    <a className="recovery-alert" href="#recovery-help"><span className="recovery-alert-icon"><Icon name="alert" /></span><span><strong>เมื่อไรควรติดต่อโรงพยาบาล?</strong><small>ดูตำแหน่งอาการเตือนและช่องทางติดต่อ</small></span><Icon name="arrow" /></a>

    <section className="recovery-section" id="recovery-today" aria-labelledby="stage-title">
      <div className="recovery-section-label">01 / ช่วงพักฟื้นของคุณ</div>
      <h2 id="stage-title">วันนี้อยู่ในช่วงไหน?</h2>
      <p className="recovery-subtitle">ลองเลือกช่วง เพื่อดูรูปแบบคำแนะนำ</p>
      <div className="recovery-stages">
        {stages.map((stage, i) => <input className="recovery-stage-input" type="radio" name="recovery-stage" id={`stage-${stage.id}`} key={stage.id} defaultChecked={i === 0} aria-controls={`stage-panel-${stage.id}`} />)}
        <div className="recovery-stage-options">{stages.map((stage, i) => <label key={stage.id} htmlFor={`stage-${stage.id}`}><span>0{i + 1}</span>{stage.title}</label>)}</div>
        {stages.map(stage => <div className={`recovery-stage-panel stage-panel-${stage.id}`} id={`stage-panel-${stage.id}`} key={stage.id}><span className="recovery-mini-icon"><Icon name="heart" /></span><div><h3>{stage.heading}</h3><p>{stage.description}</p></div></div>)}
      </div>
    </section>

    <section className="recovery-section" aria-labelledby="care-title" id="recovery-care">
      <div className="recovery-section-label">02 / เปิดอ่านทีละเรื่อง</div>
      <h2 id="care-title">เรื่องเล็ก ๆ ที่ช่วยให้ดูแลง่ายขึ้น</h2>
      <div className="recovery-topic-list">{topics.map(topic => <details className="recovery-topic" key={topic.title}><summary><span className="recovery-topic-icon"><Icon name={topic.icon} /></span><span><strong>{topic.title}</strong><small>{topic.subtitle}</small></span><span className="recovery-expand" aria-hidden="true">+</span></summary><div className="recovery-topic-body"><span className="recovery-placeholder-label">พื้นที่ตัวอย่างเนื้อหา</span><p>{topic.body}</p></div></details>)}</div>
    </section>

    <section className="recovery-checklist recovery-section" id="recovery-checklist" aria-labelledby="checklist-title">
      <div className="recovery-checklist-heading"><div><div className="recovery-section-label">03 / ทบทวนวันนี้</div><h2 id="checklist-title">ทีละข้อ ก็เพียงพอ</h2></div><Icon name="check" /></div>
      <p>ลองติ๊กสิ่งที่ทบทวนแล้ว</p>
      <form><fieldset><legend className="recovery-sr-only">รายการทบทวนตัวอย่าง</legend>{['ทบทวนคำแนะนำตอนกลับบ้าน', 'ดูรายการยาที่ได้รับ', 'เตรียมคำถามสำหรับทีมรักษา', 'ตรวจวันนัดครั้งถัดไป'].map((item, i) => <label className="recovery-check-row" key={item}><input type="checkbox" name={`task-${i}`} /><span>{item}</span></label>)}</fieldset><div className="recovery-checklist-foot"><span>ใช้ช่วยจำ ไม่ใช้ประเมินอาการ</span><button type="reset">เริ่มใหม่</button></div></form>
      <p className="recovery-local-note">รายการไม่ส่งให้ทีมรักษาและไม่บันทึกข้ามการใช้งาน</p>
    </section>

    <section className="recovery-section recovery-appointment" aria-labelledby="visit-title"><span className="recovery-topic-icon"><Icon name="calendar" /></span><div><h2 id="visit-title">อย่าลืมนัดครั้งถัดไป</h2><p>พื้นที่สำหรับคำแนะนำเตรียมตัวมาตามนัด<br />วันและเวลาจริงให้ดูจากใบนัดของคุณ</p><span className="recovery-placeholder-label">ยังไม่มีข้อมูลวันนัดส่วนบุคคล</span></div></section>

    <section className="recovery-section" id="recovery-help" aria-labelledby="help-title"><div className="recovery-section-label">04 / เมื่อคุณต้องการความช่วยเหลือ</div><h2 id="help-title">มีข้อสงสัย ไม่ต้องเก็บไว้คนเดียว</h2><div className="recovery-help-card"><Icon name="alert" /><div><h3>อาการเตือนและช่องทางติดต่อ</h3><p>พื้นที่สำหรับอาการที่ต้องรีบพบแพทย์ หมายเลขโรงพยาบาล และเวลาให้บริการ จะเติมหลังทีมรักษาตรวจทานแล้ว</p><span className="recovery-placeholder-label">ต้นแบบนี้ยังไม่มีปุ่มโทรใช้งานจริง</span></div></div></section>
    <div className="recovery-end"><Icon name="heart" /><p>ดูแลตัวเองทีละนิด ในทุก ๆ วัน</p><small>ตัวอย่างการออกแบบ · ยังไม่ใช้แทนคำแนะนำจากทีมรักษา</small></div>
    <nav className="recovery-bottom-nav" aria-label="เมนูคู่มือหลังผ่าตัด"><a href="#recovery-today"><Icon name="heart" /><span>ช่วงพักฟื้น</span></a><a href="#recovery-care"><Icon name="care" /><span>วิธีดูแล</span></a><a href="#recovery-checklist"><Icon name="check" /><span>เช็กลิสต์</span></a><a href="#recovery-help"><Icon name="alert" /><span>ติดต่อ</span></a></nav>
  </div>
}
