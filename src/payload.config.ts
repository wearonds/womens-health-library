import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Users } from './collections/Users'
import { Articles } from './collections/Articles'
import { Media } from './collections/Media'
import { SiteSettings } from './globals/SiteSettings'
const dirname = path.dirname(fileURLToPath(import.meta.url))
if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URL) throw new Error('Set PAYLOAD_SECRET and DATABASE_URL in .env')
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, migrationDir: path.resolve(dirname, 'migrations') }),
  admin: { user: 'users', importMap: { baseDir: dirname } },
  collections: [Users, Articles, Media], globals: [SiteSettings], sharp,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
