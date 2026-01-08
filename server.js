const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Trang chính
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Mini GitHub Repo</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
      /* RESET */
      * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; }
      body { background:#f6f8fa; }

      /* HEADER kiểu GitHub */
      header {
        background:#24292f;
        color:white;
        display:flex;
        align-items:center;
        padding:10px 20px;
        justify-content: space-between;
      }
      header h1 { font-weight:600; font-size:20px; }
      nav a {
        color:white;
        text-decoration:none;
        margin-left:15px;
        font-size:14px;
      }
      nav a:hover { text-decoration:underline; }

      /* CONTAINER */
      .container { max-width:700px; margin:30px auto; background:white; padding:20px; border-radius:6px; box-shadow:0 0 10px #ccc; }

      /* FORM */
      label { display:block; margin-top:10px; font-weight:600; }
      input, textarea { width:100%; padding:10px; margin-top:5px; font-size:16px; border:1px solid #d1d5da; border-radius:5px; }
      input:focus, textarea:focus { outline:none; border-color:#0366d6; }
      button {
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
      button:hover { background:#2c974b; }

      /* LINK RAW */
      .raw-link { margin-top:15px; word-break:break-all; background:#f6f8fa; padding:10px; border-radius:5px; border:1px solid #d1d5da; }
    </style>
  </head>
  <body>
    <header>
      <h1>Mini GitHub</h1>
      <nav>
        <a href="/">Home</a>
      </nav>
    </header>

    <div class="container">
      <h2>Tạo file raw</h2>
      <form action="/create" method="POST">
        <label>Tên file (vd: test.txt)</label>
        <input type="text" name="filename" required placeholder="Ví dụ: hello.txt">
        <label>Nội dung file</label>
        <textarea name="content" rows="10" required placeholder="Nhập nội dung file..."></textarea>
        <button type="submit">Tạo file</button>
      </form>
    </div>
  </body>
  </html>
  `);
});

// Tạo link raw
app.post('/create', (req, res) => {
  const { filename, content } = req.body;
  if(!filename) return res.send('Vui lòng nhập tên file');

  const encoded = Buffer.from(content).toString('base64');

  const rawLink = `${req.protocol}://${req.get('host')}/raw/${encodeURIComponent(filename)}/${encoded}`;

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
        .raw-link{margin-top:15px;word-break:break-all;background:#f6f8fa;padding:10px;border-radius:5px;border:1px solid #d1d5da;}
      </style>
    </head>
    <body>
      <h2>File tạo thành công!</h2>
      <a href="${rawLink}" target="_blank">Xem raw</a>
      <div class="raw-link">${rawLink}</div>
      <a href="/">Tạo file khác</a>
    </body>
    </html>
  `);
});

// Raw endpoint
app.get('/raw/:filename/:encoded', (req, res) => {
  const { filename, encoded } = req.params;
  try{
    const content = Buffer.from(encoded, 'base64').toString('utf-8');
    const linkX = `${req.protocol}://${req.get('host')}/raw/${encodeURIComponent(filename)}/${encoded}`;
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.send(`${content}\n${linkX}`);
  }catch(err){
    res.status(400).send('Link không hợp lệ');
  }
});

app.listen(PORT, ()=>console.log(`Server chạy tại http://localhost:${PORT}`));
