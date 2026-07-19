const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 8080;
const ROOT = __dirname;

http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  if (!url.includes('.')) url = url + '.html';

  const filePath = path.join(ROOT, url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(ROOT, '404.html'), (err2, data2) => {
        res.writeHead(err2 ? 404 : 404, { 'Content-Type': 'text/html' });
        res.end(data2 || 'Sayfa bulunamadi');
      });
      return;
    }
    const ext = path.extname(filePath);
    const mime = {
      '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css', '.json': 'application/json',
      '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
    };
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`FinansMatik lokal sunucu: http://localhost:${PORT}`);
});
