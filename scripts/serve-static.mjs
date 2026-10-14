import { createServer } from 'node:http'
import { readFile, stat, realpath } from 'node:fs/promises'
import path from 'node:path'
import { parseArgs } from 'node:util'
const { values } = parseArgs({ options: { directory: { type: 'string', default: '.local/static-preview' }, port: { type: 'string', default: '4173' } } })
const directory = await realpath(values.directory)
const manifest = JSON.parse(await readFile(path.join(directory, 'static-manifest.json'), 'utf8'))
if (manifest.generator !== 'womens-health-library-static-v1') throw new Error('Only generated static site directories can be served')
const basePath = manifest.basePath
const port = Number(values.port)
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid port')
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' }
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname)
    if (pathname === basePath && basePath) { res.writeHead(301, { Location: basePath + '/' }); res.end(); return }
    if (basePath && !pathname.startsWith(basePath + '/')) throw new Error('Not found')
    const relative = pathname.slice(basePath.length) || '/'
    let file = path.resolve(directory, '.' + relative)
    if (!file.startsWith(directory + path.sep) && file !== directory) throw new Error('Not found')
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(301, { Location: pathname + '/' }); res.end(); return }
      file = path.join(file, 'index.html')
    }
    const resolved = await realpath(file)
    if (!resolved.startsWith(directory + path.sep)) throw new Error('Not found')
    const content = await readFile(resolved)
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' })
    res.end(req.method === 'HEAD' ? undefined : content)
  } catch {
    const content = await readFile(path.join(directory, '404.html'))
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end(req.method === 'HEAD' ? undefined : content)
  }
})
server.listen(port, '127.0.0.1', () => console.log(`Static ${manifest.mode} server ready on port ${port}, project path ${basePath || '/'}`))
