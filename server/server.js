//express_demo.js 文件
const express = require('express')
const path = require('path');
const fs = require('fs');
const app = express()
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
const PORT = 3000;
var files_dict = {}
const data = fs.readFileSync('localstore/files_dict.json', 'utf8')
const BASE_DIR = path.join(__dirname, '../localstore', 'markdown');

files_dict = JSON.parse(data)
console.log(files_dict)

function Add_File_Path_To_FilesDict(path) {
    var id = files_dict['Id'] + 1
    files_dict['Path'][id] = path
    files_dict["Id"] = id
    fs.writeFileSync('localstore/files_dict.json', JSON.stringify(files_dict, null, 2), 'utf8');
}

// Add_File_Path_To_FilesDict("localstore/markdown/README.md")
console.log(files_dict)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html', 'main.html'))
});
// app.get('/login',(req , res ) => {
//     res.sendFile(path.join(__dirname, '../public/html', 'main.html'))
// })
app.get('/api/get_file', (req, res) => {
    res.send(files_dict)
})
app.get('/getcontent', async (req, res) => {
    const filePath = req.query.path;
    if (!filePath) {
        return res.status(400).json({ error: '缺少 path 参数' });
    }

    const safePath = path.join(BASE_DIR, path.basename(filePath));
    try {
        const content = await fs.promises.readFile(safePath, 'utf-8');
        res.json({ content });
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: '文件不存在或读取失败' });
    }
});
app.post('/save_content', async (req, res) => {
    const { path: filePath, content } = req.body;

    if (!filePath || content === undefined) {
        return res.status(400).json({ success: false, error: '缺少参数' });
    }

    const safePath = path.join(BASE_DIR, path.basename(filePath));

    try {
        await fs.promises.writeFile(safePath, content, 'utf-8');
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: '写入文件失败' });
    }
});

app.post('/addCitem', async (req, res) => {
    const {key, name } = req.body;
    console.log(key)
    if (!key || name === undefined) {
        return res.status(400).json({ success: false, error: '缺少参数' });
    }
    files_dict['Path'][key].push([name, `/localstore/markdown/${name}.md`]);
    fs.writeFileSync(`localstore/markdown/${name}.md`, '', 'utf8');
    fs.writeFileSync('localstore/files_dict.json', JSON.stringify(files_dict, null, 2), 'utf8');
    res.json({ success: true });
});

app.post('/addFitem', async (req, res) => {
    const {key, name } = req.body;
    console.log(name)
    files_dict['Path'][name] = []
    fs.writeFileSync('localstore/files_dict.json', JSON.stringify(files_dict, null, 2), 'utf8');
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
