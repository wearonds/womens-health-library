import { getPayload } from 'payload'
import config from '@payload-config'
export async function siteSettings() {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-settings', overrideAccess: false })
}
