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
  { title: 'อาหารและการดื่มน้ำ', subtitle: 'กินให้หลากหลาย · ลดโอกาสท้องผูก', icon: 'heart' as const, body: 'รับประทานอาหารให้หลากหลาย เพิ่มผัก ผลไม้ และอาหารที่มีกากใย พร้อมดื่มน้ำตามที่ทีมรักษาอนุญาต เพื่อช่วยให้ขับถ่ายสะดวก', detail: 'หากมีโรคประจำตัวที่ต้องจำกัดน้ำ หรือได้รับการผ่าตัดลำไส้ร่วมด้วย ให้ยึดคำแนะนำเฉพาะตอนกลับบ้าน' },
  { title: 'การอาบน้ำ', subtitle: 'ดูชนิดแผลและผ้าปิดแผลก่อน', icon: 'care' as const, body: 'ทำตามคำแนะนำตอนกลับบ้านเรื่องการอาบน้ำและการรักษาแผลให้แห้ง เพราะแผลหน้าท้อง แผลส่องกล้อง และการผ่าตัดทางช่องคลอดมีวิธีดูแลต่างกัน', detail: 'อย่าแช่น้ำหรือว่ายน้ำจนกว่าแผลจะหายและทีมรักษาอนุญาต หากไม่ทราบว่าผ้าปิดแผลกันน้ำได้หรือไม่ ให้สอบถามก่อน' },
  { title: 'การดูแลแผล', subtitle: 'แผลหน้าท้อง · แผลส่องกล้อง · แผลภายใน', icon: 'care' as const, body: 'หากมีแผลที่หน้าท้อง ให้ดูแลผ้าปิดแผลและทำแผลตามที่ทีมรักษาสอน สังเกตอาการบวม แดง ปวดมากขึ้น หรือมีหนอง และมาตัดไหมตามนัดหากเป็นไหมที่ต้องเอาออก', detail: 'แม้ไม่มีแผลหน้าท้อง หรือแผลภายนอกดูเล็ก ยังมีเนื้อเยื่อภายในที่ต้องใช้เวลาฟื้นตัว จึงควรทำตามข้อจำกัดกิจกรรมที่ได้รับ' },
  { title: 'การกินยาและบรรเทาปวด', subtitle: 'ใช้ยาตามฉลาก · ไม่ปรับยาเอง', icon: 'heart' as const, body: 'ใช้ยาตามรายการยากลับบ้าน หากมีอาการปวดมากขึ้นหรือใช้ยาตามคำสั่งแล้วยังไม่ดีขึ้น ให้ติดต่อทีมรักษา ไม่เพิ่มขนาดยาหรือซื้อยาซ้ำเองโดยไม่ตรวจสอบ', detail: 'หากได้รับยาป้องกันลิ่มเลือดหรือถุงน่องทางการแพทย์ ให้ใช้ตามระยะเวลาที่สั่ง ยาที่ทำให้ง่วงอาจกระทบการขับรถและการใช้เครื่องจักร' },
  { title: 'การเคลื่อนไหวและพักผ่อน', subtitle: 'เดินเบา ๆ · สลับพัก · เลี่ยงยกของหนัก', icon: 'check' as const, body: 'เดินระยะสั้นตามที่ทีมรักษาอนุญาต แล้วค่อย ๆ เพิ่มกิจกรรม สลับกับการพัก ไม่ควรนอนนิ่งตลอดวัน และอย่าฝืนเมื่อเหนื่อยหรือเจ็บ', detail: 'หลีกเลี่ยงยกของหนักและออกแรงมากระหว่างพักฟื้น การกลับไปทำงาน ออกกำลังกาย และขับรถให้ประเมินกับทีมรักษาตามวิธีผ่าตัดและลักษณะงานของคุณ' },
  { title: 'การขับถ่าย', subtitle: 'ป้องกันท้องผูก · สังเกตปัสสาวะ', icon: 'care' as const, body: 'ช่วงแรกอาจท้องผูกได้ การกินกากใย ดื่มน้ำตามที่อนุญาต และเดินเบา ๆ ช่วยได้ หากได้รับยาช่วยระบายให้ใช้ตามคำสั่งเพื่อหลีกเลี่ยงการเบ่งมาก', detail: 'หากปัสสาวะไม่ออก แสบขัด หรือมีไข้ ควรติดต่อทีมรักษา ถ้าท้องปวดมากขึ้นร่วมกับอาเจียนหรือท้องอืดมาก ไม่ควรรอถึงวันนัด' },
  { title: 'เลือดออกทางช่องคลอดและเพศสัมพันธ์', subtitle: 'แยกอาการที่พบได้จากสัญญาณเตือน', icon: 'heart' as const, body: 'อาจมีเลือดหรือตกขาวปริมาณเล็กน้อยหลังผ่าตัด แต่ถ้าเลือดออกมาก มีลิ่มเลือด หรือมีกลิ่นเหม็น ควรติดต่อทีมรักษาโดยไม่รอวันนัด', detail: 'งดการสอดใส่ทางช่องคลอดระหว่างที่แผลยังไม่หาย และรอคำแนะนำหรือการประเมินจากทีมรักษาก่อนกลับมามีเพศสัมพันธ์' },
  { title: 'การมาตามนัด', subtitle: 'ดูใบนัด · เตรียมรายการยาและคำถาม', icon: 'calendar' as const, body: 'ดูวัน เวลา และสถานที่จากใบนัดของคุณ เตรียมรายการยาที่ใช้อยู่ และจดอาการหรือคำถามที่จะปรึกษา เช่น ผลชิ้นเนื้อ การดูแลแผล และการกลับไปทำกิจกรรม', detail: 'หากตัดรังไข่ร่วมด้วย หรือมีอารมณ์เศร้าและกังวลต่อเนื่อง ให้แจ้งทีมรักษาเพื่อวางแผนดูแลเพิ่มเติม หากมาตามนัดไม่ได้ ให้ติดต่อโรงพยาบาล' },
]

export function RecoveryDemo() {
  return <div className="recovery-demo">
    <aside className="recovery-draft"><span className="recovery-dot" />ต้นแบบสำหรับดูรูปแบบ<span>ยังไม่ใช่คำแนะนำสำหรับผู้ป่วย</span></aside>
    <section className="recovery-heading" aria-labelledby="recovery-title">
      <span className="recovery-kicker">คู่มือสำหรับอ่านเมื่อกลับบ้าน</span>
      <h1 id="recovery-title">คู่มือดูแลตัวเอง<br />หลังผ่าตัดมดลูก</h1>
      <p>ฉบับร่างสำหรับการตัดมดลูกออก (hysterectomy)</p>
    </section>

    <nav className="recovery-outline" aria-labelledby="outline-title">
      <h2 id="outline-title">ในหน้านี้ อ่านอะไรบ้าง?</h2>
      <p>อ่านตามลำดับ หรือกดข้ามไปเรื่องที่ต้องการ</p>
      <ol>
        <li><a href="#recovery-care"><span className="recovery-outline-number">01</span><span><strong>การดูแลตัวเอง 8 เรื่อง</strong><small>อาหาร · อาบน้ำ · แผล · ยา · กิจกรรม · ขับถ่าย · เลือดออกและเพศสัมพันธ์ · นัดติดตาม</small></span><Icon name="arrow" /></a></li>
        <li><a href="#recovery-checklist"><span className="recovery-outline-number">02</span><strong>เช็กลิสต์ช่วยทบทวน</strong><Icon name="arrow" /></a></li>
        <li><a href="#recovery-warning"><span className="recovery-outline-number">03</span><strong>สัญญาณเตือนที่ควรมาก่อนนัด</strong><Icon name="arrow" /></a></li>
        <li><a href="#recovery-help"><span className="recovery-outline-number">04</span><strong>ช่องทางติดต่อทีมรักษา</strong><Icon name="arrow" /></a></li>
      </ol>
    </nav>
    <p className="recovery-scope">คู่มือนี้ไม่ครอบคลุมการเลาะก้อนเนื้องอกโดยเก็บมดลูกไว้ การฟื้นตัวต่างกันตามวิธีผ่าตัดและการผ่าตัดร่วมอื่น ๆ ให้ยึดคำสั่งกลับบ้านของคุณเป็นหลัก</p>

    <section className="recovery-section" aria-labelledby="care-title" id="recovery-care">
      <div className="recovery-section-label">01 / การดูแลตัวเอง</div>
      <h2 id="care-title">เลือกอ่านทีละเรื่อง</h2><p className="recovery-subtitle">กดหัวข้อเพื่อดูคำแนะนำที่ต้องการทบทวน</p>
      <div className="recovery-topic-list">{topics.map(topic => <details className="recovery-topic" key={topic.title}><summary><span className="recovery-topic-icon"><Icon name={topic.icon} /></span><span><strong>{topic.title}</strong><small>{topic.subtitle}</small></span><span className="recovery-expand" aria-hidden="true">+</span></summary><div className="recovery-topic-body"><span className="recovery-placeholder-label">ร่างคำแนะนำทั่วไป · รอทีมรักษาตรวจทาน</span><p>{topic.body}</p><p className="recovery-topic-detail">{topic.detail}</p></div></details>)}</div>
    <aside className="recovery-source-note"><strong>ที่มาของร่างเนื้อหา</strong><p>ใช้ข้อมูล <a href="https://www.nhs.uk/conditions/hysterectomy/recovery/">NHS: การฟื้นตัวหลังตัดมดลูก</a> และคำแนะนำหลังผ่าตัดทั่วไปเป็นฐาน ขณะนี้ยังตรวจต้นฉบับ ACOG, RTCOG และ RCOG ไม่ได้ จึงยังไม่อ้างว่าร่างนี้ผ่านการตรวจตามแหล่งเหล่านั้น</p></aside>
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
      <div className="recovery-help-card"><Icon name="alert" /><div><h3>มีอาการผิดปกติ ไม่ต้องรอวันนัด</h3><ul className="recovery-warning-list"><li>แผลบวม แดง หรือปวดมากขึ้น มีหนอง หรือมีไข้ร่วมกับรู้สึกไม่สบาย</li><li>เลือดออกทางช่องคลอดมาก มีลิ่มเลือด หรือตกขาวมีกลิ่นเหม็น</li><li>ปวดท้องมากขึ้นร่วมกับอาเจียน ปัสสาวะไม่ออก หรือมีไข้ร่วมกับปัสสาวะแสบขัด</li><li>ขาข้างใดข้างหนึ่งบวม ปวด ร้อน หรือสีผิวเปลี่ยนไป ซึ่งอาจเป็นอาการของลิ่มเลือด</li></ul><div className="recovery-emergency"><strong>ขอความช่วยเหลือฉุกเฉินทันที</strong><p>หากหายใจลำบาก เจ็บหน้าอก หมดสติ หรือเลือดออกมากไม่หยุด</p></div><span className="recovery-placeholder-label">ร่างรายการอาการเตือน · ต้องตรวจทานตามวิธีผ่าตัด</span></div></div>
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
