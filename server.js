const path = require('path');
const express = require('express');

const PORT = 3000;
//const WEB_FILE_PATH = '/Users/syu/WebstormProjects/dz-web-for-unveiling/build2k';
const WEB_FILE_PATH = '/Users/syu/WebstormProjects/isp-ui-build/dist';
const app = express();


app.use(express.static(path.resolve(__dirname, WEB_FILE_PATH)));

app.listen(PORT, () => {
    console.log(`服务已启动，端口：${PORT}`);
});