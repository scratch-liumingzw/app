const fs = require('fs');
const path = require('path');

const copyDirSync = (src, dest) => {
    if (!fs.existsSync(src)) {
        console.error("Dir not exist: " + src);
        return false;
    }
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const dirs = fs.readdirSync(src);
    dirs.forEach(item => {
        const item_path = path.join(src, item);
        const temp = fs.statSync(item_path);
        if (temp.isFile()) {
            fs.copyFileSync(item_path, path.join(dest, item));
        } else if (temp.isDirectory()) {
            copyDirSync(item_path, path.join(dest, item));
        }
    });
};

// delete dir
fs.rmdirSync("./build-web", { recursive: true });
fs.rmdirSync("./build-server", { recursive: true });
fs.rmdirSync("./assets", { recursive: true });

// copy dir
copyDirSync("../web/build-web", "./build-web");
copyDirSync("../server/build-server", "./build-server");
copyDirSync("../server/assets", "./assets");