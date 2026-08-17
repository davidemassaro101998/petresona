import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"

const root = join(process.cwd(), "dist")
const port = Number(process.env.PORT || 3000)

// Every other domain pointed at this service redirects to the canonical one,
// preserving path and query. Railway's own *.up.railway.app domain is left
// alone (useful for debugging a deploy independently of DNS).
const CANONICAL_HOST = "www.resonapet.com"
const REDIRECT_HOSTS = new Set(["resonapet.com", "resonapet.it", "www.resonapet.it"])

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon",
}

createServer((request, response) => {
  const host = (request.headers.host || "").split(":")[0].toLowerCase()
  if (REDIRECT_HOSTS.has(host)) {
    response.writeHead(301, { Location: `https://${CANONICAL_HOST}${request.url || "/"}` })
    response.end()
    return
  }

  const pathname = new URL(request.url || "/", "http://localhost").pathname
  const requested = pathname === "/" ? "/index.html" : pathname
  const safePath = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "")
  let filePath = join(root, safePath)

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html")
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
    response.end("Pagina non trovata")
    return
  }

  // Only /assets/* is Vite's content-hashed build output (a new hash means a
  // new URL, so caching it forever is safe). Everything else served from
  // dist root (favicons, robots.txt, sitemap.xml, the manifest, HTML) keeps
  // the same URL across deploys even when its content changes, so it must
  // be revalidated instead of cached for a full year.
  const isHtml = extname(filePath) === ".html"
  const isHashedAsset = pathname.startsWith("/assets/")
  const cacheControl = isHtml
    ? "no-cache"
    : isHashedAsset
      ? "public, max-age=31536000, immutable"
      : "public, max-age=300, must-revalidate"

  response.writeHead(200, {
    "Content-Type": mime[extname(filePath)] || "application/octet-stream",
    "Cache-Control": cacheControl,
    "X-Content-Type-Options": "nosniff",
  })
  createReadStream(filePath).pipe(response)
}).listen(port, "0.0.0.0")
