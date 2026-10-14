import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_review_category" AS ENUM('editorial', 'medical');
  CREATE TYPE "public"."enum__articles_v_version_review_category" AS ENUM('editorial', 'medical');
  ALTER TABLE "site_settings" ALTER COLUMN "review_process" SET DEFAULT 'ผู้จัดทำเตรียมเนื้อหาและแหล่งอ้างอิงก่อนอนุมัติเผยแพร่ บทความที่ยังไม่ผ่านการตรวจทานทางการแพทย์จะระบุสถานะไว้ชัดเจน เมื่อมีผู้ตรวจทานทางการแพทย์ จะบันทึกชื่อและวันที่ตรวจทานแยกจากการอนุมัติเผยแพร่ การแก้เนื้อหาต้องอนุมัติเวอร์ชันใหม่ก่อนเผยแพร่';
  ALTER TABLE "site_settings" ALTER COLUMN "team" SET DEFAULT 'คลังความรู้สุขภาพสตรีจัดทำโดยผู้จัดทำเว็บไซต์ เพื่อช่วยผู้ป่วยอ่านทบทวนหลังพบแพทย์ สถานะการตรวจทานทางการแพทย์แสดงไว้ในแต่ละบทความ';
  ALTER TABLE "articles" ADD COLUMN "review_category" "enum_articles_review_category" DEFAULT 'editorial';
  ALTER TABLE "_articles_v" ADD COLUMN "version_review_category" "enum__articles_v_version_review_category" DEFAULT 'editorial';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "review_process" SET DEFAULT 'ผู้เขียนจัดทำร่างและแหล่งอ้างอิง จากนั้นผู้ตรวจทานตรวจเนื้อหาและอนุมัติเวอร์ชันที่ตรวจแล้ว ก่อนผู้มีสิทธิ์นำขึ้นเผยแพร่ บทความที่เผยแพร่จะแสดงชื่อผู้ตรวจทานและวันที่ตรวจทาน การแก้เนื้อหาจะสร้างร่างใหม่เพื่อให้ตรวจทานอีกครั้ง';
  ALTER TABLE "site_settings" ALTER COLUMN "team" SET DEFAULT 'โครงการคลังความรู้สุขภาพสตรีอยู่ระหว่างจัดเตรียมเนื้อหาและข้อมูลทีมงาน ชื่อผู้ตรวจทานจะแสดงในบทความเมื่อผ่านการตรวจทานแล้ว';
  ALTER TABLE "articles" DROP COLUMN "review_category";
  ALTER TABLE "_articles_v" DROP COLUMN "version_review_category";
  DROP TYPE "public"."enum_articles_review_category";
  DROP TYPE "public"."enum__articles_v_version_review_category";`)
}
