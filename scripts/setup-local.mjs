import { randomBytes } from 'node:crypto'
import { writeFileSync, existsSync } from 'node:fs'
if (existsSync('.env')) {
  console.log('Preserving existing .env')
} else {
  const password = randomBytes(24).toString('hex')
  writeFileSync('.env', `POSTGRES_PASSWORD=${password}\nDATABASE_URL=postgresql://library:${password}@127.0.0.1:5433/library\nPAYLOAD_SECRET=${randomBytes(32).toString('hex')}\n`, { mode: 0o600, flag: 'wx' })
  console.log('Created local .env with random development credentials. Values are not printed.')
}
