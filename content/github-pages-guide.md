# เว็บ static สำหรับงบ hosting 0 บาท

เว็บผู้อ่านส่งออกเป็น HTML/CSS ใช้ GitHub Pages ได้โดยไม่ต้องมี Node.js, CMS, ฐานข้อมูล หรือบัญชีผู้อ่านบน hosting ส่วน Payload CMS เก็บไว้ใช้ในเครื่องพัฒนา

GitHub Pages บน GitHub Free ใช้กับ repository สาธารณะ การใช้ repository ส่วนตัวขึ้นกับแพ็กเกจบัญชี ก่อนเปิดจริงต้องตรวจเงื่อนไขและโควตาบัญชี ไม่ต้องซื้อโดเมนเพื่อเริ่มใช้ URL ของ GitHub Pages

## ดูตัวอย่าง 4 หน้าในเครื่อง

```sh
STATIC_BASE_PATH=/womens-health-library npm run static:preview
npm run serve:static
```

คำสั่งนี้อ่านร่างจาก CMS แล้วสร้างหน้าแรก บทความทั้งสอง และหน้าเกี่ยวกับไว้ใน `.local/static-preview/` ทุกหน้ามีป้ายร่างและ noindex ใช้สำหรับดูในเครื่องเท่านั้น คำสั่ง build ปฏิเสธการนำชุด preview ไปเขียนลง `out/`

## ส่งออกเฉพาะเนื้อหาที่เผยแพร่แล้ว

หลังเลือกบทความที่ผ่านขั้นตอนเผยแพร่ใน CMS:

```sh
npm run static:snapshot
STATIC_BASE_PATH=/womens-health-library npm run build:static
```

- `content/static-site.json` เป็น snapshot ของข้อความเว็บไซต์และบทความที่เผยแพร่แล้ว ไม่มีบัญชีทีมงาน ความสัมพันธ์ภายใน CMS หรือ credentials
- `out/` มีเฉพาะ HTML, CSS, robots, หน้า 404 และ manifest ไม่มี `/admin` หรือ `/api`
- ถ้ากำหนด `STATIC_SITE_URL` เป็น HTTPS จะเพิ่ม canonical URLs และ sitemap ให้ด้วย
- ตอนนี้ทั้งสองบทความยังเป็นร่าง จึงมีเฉพาะหน้าแรก หน้าเกี่ยวกับ และหน้า 404 ในชุดสาธารณะ
- Builder ตรวจสถานะและรหัสตรวจสอบเนื้อหาที่อนุมัติ และลบหน้าเก่าที่ไม่ได้อยู่ใน snapshot ใหม่ออกจาก output

การ build จาก snapshot ไม่ใช้ฐานข้อมูลหรือ PAYLOAD_SECRET:

```sh
npm run build:static
```

หากใช้ชื่อ repository อื่น เปลี่ยน `STATIC_BASE_PATH` ให้ตรงกับชื่อ หากใช้ user/organization Pages ที่เสิร์ฟจากรากโดเมน ให้เว้น `STATIC_BASE_PATH` เป็นค่าว่าง

## เปิด GitHub Pages ภายหลัง

ทางเลือกสำหรับเก็บ CMS และร่างไว้ในเครื่อง: ใช้ repository สาธารณะแยกสำหรับไฟล์เว็บ แล้วนำเฉพาะไฟล์ภายใน `out/` ไปไว้ที่ราก repository นั้น จาก Settings → Pages เลือก Deploy from a branch และเลือก branch/root ที่เก็บไฟล์ ห้ามอัปโหลด `.env`, `.local`, database dump หรือ source ของ CMS ไปกับชุดไฟล์เว็บ

Repository สาธารณะทำให้คนอื่นอ่านไฟล์ source ได้ด้วย แม้หน้า Pages จะไม่แสดงร่าง ดังนั้นหากต้องการเก็บร่างไว้เฉพาะทีมงาน ให้ใช้ repository สำหรับไฟล์ส่งออกแยกจาก source ของ CMS

แนวทางที่เลือกสำหรับโปรเจกต์นี้: ใช้ repository เดิม `wearonds/womens-health-library` อันเดียว โดยยอมให้ source และร่างที่ commit เป็นสาธารณะ มี workflow `.github/workflows/static-pages.yml` สำหรับเปิดเว็บ:

1. Commit/push การเปลี่ยนแปลงเมื่อได้รับอนุญาต
2. ตั้ง Settings → Pages → Source เป็น GitHub Actions
3. รัน workflow `Static website` แบบ manual ค่า `publish` เริ่มต้นเป็น false เพื่อ build artifact อย่างเดียว
4. การเลือก `publish=true` จึงเรียก job deploy ไม่ deploy อัตโนมัติจาก push

Workflow อ่านเฉพาะ snapshot สาธารณะที่บันทึกใน repository ไม่เชื่อมฐานข้อมูล ไม่ต้องเพิ่ม secrets ของ CMS ใน GitHub และไม่ส่งออก preview ยังไม่ได้รัน workflow นี้บน GitHub

## แก้ไขหรือถอนบทความ

แก้และตรวจทานใน CMS → เผยแพร่/ถอนใน CMS → ส่งออก snapshot ใหม่ → build → นำชุดใหม่ขึ้น Pages

การเปลี่ยนสถานะใน CMS ไม่เปลี่ยนเว็บ static ที่เปิดอยู่ทันที ต้องส่งออกและนำชุดใหม่ขึ้นเว็บเสมอ

## การตรวจสอบ

```sh
npm run test:static
STATIC_BASE_PATH=/womens-health-library npm run static:preview
STATIC_BASE_PATH=/womens-health-library STATIC_SITE_URL=https://example.com npm run build:static
PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium npm run test:static:browser
```

ทดสอบการป้องกันร่าง/เนื้อหาที่เปลี่ยนหลังอนุมัติ การลบหน้าที่ถูกถอน เส้นทาง project Pages และเว็บมือถือครบ 4 หน้าโดยปิด JavaScript หากใช้ Chromium ของ Playwright ให้ละ `PLAYWRIGHT_CHROMIUM_PATH`
