const express = require('express');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage tạm thời: { key: { filename, content } }
const FILES = {};

app.use(bodyParser.urlencoded({ extended: true }));

// ===== Trang chính =====
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Mini GitHub Repo</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Inter',sans-serif;}
body{background:#f6f8fa;}
/* HEADER GitHub-style */
header{
  background:#24292f;color:white;display:flex;align-items:center;padding:10px 20px;justify-content:space-between;
}
header h1{font-weight:600;font-size:20px;}
nav a{color:white;text-decoration:none;margin-left:20px;font-size:14px;position:relative;}
nav a:hover::after{content:'';position:absolute;left:0;bottom:-2px;height:2px;width:100%;background:white;}
.container{max-width:900px;margin:30px auto;background:white;padding:20px;border-radius:6px;box-shadow:0 0 10px #ccc;}
label{display:block;margin-top:10px;font-weight:600;}
input, textarea{
  width:100%;
  padding:10px;
  margin-top:5px;
  font-size:16px;
  border:1px solid #d1d5da;
  border-radius:5px;
  font-family:monospace;
}
textarea{
  height:400px;
  resize:both;
  overflow:auto;
  white-space:pre;
}
input:focus, textarea:focus{outline:none;border-color:#0366d6;}
button{
  margin-top:15px;
  padding:10px 20px;
  font-size:16px;
  font-weight:600;
  background:#2ea44f;
  color:white;
  border:none;
  border-radius:6px;
  cursor:pointer;
}
button:hover{background:#2c974b;}
</style>
</head>
<body>
<header>
<h1>Mini GitHub</h1>
<nav><a href="/">Home</a><a href="#">Explore</a><a href="#">About</a></nav>
</header>
<div class="container">
<h2>Tạo file raw</h2>
<form action="/create" method="POST">
  <label>Tên file (vd: test.txt)</label>
  <input type="text" name="filename" required placeholder="hello.txt">
  <label>Nội dung file</label>
  <textarea name="content" placeholder="Nhập code ở đây..."></textarea>
  <button type="submit">Tạo file</button>
</form>
</div>
</body>
</html>
  `);
});

// ===== POST tạo file =====
app.post('/create', (req, res) => {
  const { filename, content } = req.body;
  if (!filename || !content) return res.send('Vui lòng nhập tên file và nội dung');

  const key = nanoid(10); // key ngắn gọn
  FILES[key] = { filename, content };

  const rawLink = `${req.protocol}://${req.get('host')}/raw/${key}`;

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>File Created</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
body{font-family:'Inter',sans-serif;background:#f6f8fa;padding:50px;text-align:center;}
a{display:inline-block;margin:10px;padding:10px 20px;background:#0366d6;color:white;text-decoration:none;border-radius:5px;}
a:hover{background:#0356b6;}
input{width:80%;padding:10px;font-family:monospace;}
</style>
</head>
<body>
<h2>File tạo thành công!</h2>
<p>Link raw chính xác (không thêm chữ nào):</p>
<input type="text" value="${rawLink}" readonly onclick="this.select()">
<br>
<a href="${rawLink}" target="_blank">Xem raw</a>
<br><br>
<a href="/">Tạo file khác</a>
</body>
</html>
  `);
});

// ===== RAW thật sự =====
app.get('/raw/:key', (req,res)=>{
  const { key } = req.params;
  if (!FILES[key]) return res.status(404).send('File không tồn tại');

  const { filename, content } = FILES[key];

  res.setHeader('Content-Type','text/plain; charset=utf-8');
  res.setHeader('Content-Disposition',`inline; filename="${filename}"`);

  // Trả **chính xác nội dung** đã nhập, **không thêm chữ nào**
  res.send(content);
});

app.listen(PORT,()=>console.log(`Server chạy tại http://localhost:${PORT}`));
