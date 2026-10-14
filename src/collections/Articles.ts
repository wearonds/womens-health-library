import type { CollectionConfig } from 'payload'
import { enforceWorkflow, canPublish } from '../lib/workflow'
const staff = ({ req }: any) => Boolean(req.user)
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: 'บทความ', plural: 'บทความ' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'workflow', 'updatedAt'], preview: (doc) => `/preview/${doc.slug}` },
  access: {
    read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
    create: staff, update: staff,
    delete: ({ req }) => canPublish(req.user?.role),
    readVersions: staff,
  },
  versions: { drafts: true, maxPerDoc: 30 },
  hooks: { beforeChange: [enforceWorkflow] },
  fields: [
    { name: 'title', label: 'ชื่อบทความ', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, validate: (value: any) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value ?? '') || 'ใช้ตัวอักษรอังกฤษตัวเล็ก ตัวเลข และขีดกลาง' },
    { name: 'description', label: 'คำอธิบายสั้น', type: 'textarea', required: true },
    { name: 'summary', label: 'สรุปสิ่งที่ควรรู้', type: 'array', fields: [{ name: 'text', type: 'textarea', required: true }] },
    { name: 'urgentSymptoms', label: 'อาการที่ควรรีบพบแพทย์', type: 'textarea' },
    { name: 'sections', label: 'เนื้อหา', type: 'array', fields: [{ name: 'heading', type: 'text', required: true }, { name: 'body', type: 'textarea', required: true }] },
    { name: 'questions', label: 'คำถามสำหรับนัดครั้งหน้า', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'references', label: 'แหล่งอ้างอิง', type: 'array', fields: [{ name: 'title', type: 'text', required: true }, { name: 'url', type: 'text', required: true, validate: (value: any) => { try { return new URL(value).protocol === 'https:' || 'ใช้ลิงก์ HTTPS' } catch { return 'ลิงก์ไม่ถูกต้อง' } } }] },
    { name: 'workflow', label: 'ขั้นตอนตรวจทาน', type: 'select', defaultValue: 'draft', required: true, options: [{ label: 'ร่าง', value: 'draft' }, { label: 'รอตรวจทาน', value: 'review' }, { label: 'อนุมัติ', value: 'approved' }, { label: 'เผยแพร่', value: 'published' }] },
    { name: 'reviewedBy', type: 'relationship', relationTo: 'users', admin: { readOnly: true }, access: { read: staff, update: () => false } },
    { name: 'reviewCategory', label: 'ประเภทการอนุมัติ', type: 'select', required: true, defaultValue: 'editorial', options: [{ label: 'ผู้จัดทำอนุมัติเผยแพร่', value: 'editorial' }, { label: 'ผู้ตรวจทานทางการแพทย์', value: 'medical' }], admin: { readOnly: true }, access: { update: () => false } },
    { name: 'reviewerName', label: 'ผู้ตรวจทาน', type: 'text', admin: { readOnly: true }, access: { update: () => false } },
    { name: 'reviewedAt', type: 'date', admin: { readOnly: true }, access: { update: () => false } },
    { name: 'approvedFingerprint', type: 'text', admin: { hidden: true }, access: { read: () => false, update: () => false } },
  ],
}
