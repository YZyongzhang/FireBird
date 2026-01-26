// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// 解析 JSON 请求体
app.use(express.json());

// 前端文件夹
app.use(express.static('public'));

// 保存 Markdown
app.post('/save-markdown', (req, res) => {
    const content = req.body.content;

    if (!content) return res.status(400).json({ message: '内容为空' });

    // 保存到当前目录的 markdown.md
    fs.writeFile(path.join(__dirname, 'markdown.md'), content, 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: '保存失败' });
        }
        res.json({ message: '文件保存成功！' });
    });
});

app.listen(PORT, () => {
    console.log(`服务器启动：http://localhost:${PORT}`);
});
