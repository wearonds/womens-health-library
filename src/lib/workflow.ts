import { fingerprint } from './content-fingerprint'
export { fingerprint } from './content-fingerprint'
import { APIError } from 'payload'
import type { CollectionBeforeChangeHook } from 'payload'

export type Role = 'admin' | 'author' | 'reviewer' | 'publisher'
export const canPublish = (role?: string) => role === 'admin' || role === 'publisher'
export const canReview = (role?: string) => role === 'admin' || role === 'reviewer'
export const enforceWorkflow: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  const role = (req.user as { role?: string } | null)?.role
  // Seed/import must explicitly supply a trusted user too; access overrides do not bypass review.
  if (!role) throw new APIError('ต้องเข้าสู่ระบบเพื่อแก้ไขบทความ', 403)
  const merged = { ...originalDoc, ...data }
  const hash = fingerprint(merged)
  const approvedHash = originalDoc?.approvedFingerprint
  const contentChanged = originalDoc && fingerprint(originalDoc) !== hash
  // Never accept approval metadata supplied by a client.
  data.approvedFingerprint = originalDoc?.approvedFingerprint ?? null
  data.reviewedBy = originalDoc?.reviewedBy ?? null
  data.reviewedAt = originalDoc?.reviewedAt ?? null
  data.reviewerName = originalDoc?.reviewerName ?? null
  data.reviewCategory = originalDoc?.reviewCategory ?? 'editorial'
  let requested = data.workflow ?? originalDoc?.workflow ?? 'draft'
  if (data._status === 'draft' && requested === 'published') {
    // Saving a new draft must preserve the currently published revision.
    requested = 'draft'
    data.workflow = 'draft'
  }
  if (requested === 'approved' && contentChanged && !canReview(role)) {
    requested = 'draft'
    data.workflow = 'draft'
  }
  const approving = requested === 'approved' && (originalDoc?.workflow !== 'approved' || contentChanged)
  if (approving) {
    if (!canReview(role)) throw new APIError('เฉพาะผู้ตรวจทานเท่านั้นที่อนุมัติได้', 403)
    if (!merged.sections?.length || !merged.summary?.length || !merged.urgentSymptoms) throw new APIError('ต้องมีเนื้อหา สรุป และคำแนะนำอาการเร่งด่วนก่อนอนุมัติ', 400)
    if (!merged.references?.length) throw new APIError('ต้องมีแหล่งอ้างอิงก่อนอนุมัติ', 400)
    data.approvedFingerprint = hash
    data.reviewedBy = req.user!.id
    data.reviewedAt = new Date().toISOString()
    data.reviewerName = req.user!.name
    data.reviewCategory = role === 'reviewer' ? 'medical' : 'editorial'
  }
  const publishing = data._status === 'published' || requested === 'published'
  if (publishing) {
    if (!canPublish(role)) throw new APIError('คุณไม่มีสิทธิ์เผยแพร่บทความ', 403)
    if (approvedHash !== hash) throw new APIError('เวอร์ชันนี้ต้องผ่านการตรวจทานก่อนเผยแพร่', 400)
    data.workflow = 'published'
    data._status = 'published'
  } else {
    data._status = 'draft'
    if (contentChanged && requested !== 'approved') {
      data.workflow = 'draft'
      data.approvedFingerprint = null
      data.reviewedBy = null
      data.reviewedAt = null
      data.reviewerName = null
      data.reviewCategory = 'editorial'
    } else data.workflow = requested
  }
  return data
}
