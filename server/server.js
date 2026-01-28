//express_demo.js 文件
const express = require('express')
const path = require('path');
const fs = require('fs');
const app = express()
app.use(express.static(path.join(__dirname, '../public')));
const PORT = 3000;
var files_dict = {}
const data = fs.readFileSync('localstore/files_dict.json', 'utf8')
const BASE_DIR = path.join(__dirname, '../localstore', 'markdown');

files_dict = JSON.parse(data)
console.log(files_dict)

function Add_File_Path_To_FilesDict(path){
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
app.get('/api/get_file',(req , res ) => {
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
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
