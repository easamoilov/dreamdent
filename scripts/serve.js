// Минимальный статический сервер для проверки fetch (нет внешних зависимостей).
// node scripts/serve.js [port]
const http = require('http'), fs = require('fs'), path = require('path');
const root = process.cwd();
const port = process.argv[2] || 8090;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
http.createServer(function (req, res) {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const fp = path.join(root, p);
  fs.readFile(fp, function (e, data) {
    if (e) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(fp)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, function () { console.log('serving ' + root + ' on http://localhost:' + port); });
