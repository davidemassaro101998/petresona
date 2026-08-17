import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, join, normalize } from "node:path"

const root = join(process.cwd(), "dist")
const port = Number(process.env.PORT || 3000)

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
}

createServer((request, response) => {
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

  response.writeHead(200, {
    "Content-Type": mime[extname(filePath)] || "application/octet-stream",
    "Cache-Control": extname(filePath) === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
  })
  createReadStream(filePath).pipe(response)
}).listen(port, "0.0.0.0")
