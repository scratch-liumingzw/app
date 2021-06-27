const fs = require('fs');
const path = require('path');

const copyDirectorySync = (src, dest) => {
    if (!fs.existsSync(src)) {
        return false;
    }
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    var dirs = fs.readdirSync(src);
    dirs.forEach(function (item) {
        var item_path = path.join(src, item);
        var temp = fs.statSync(item_path);
        if (temp.isFile()) {
            fs.copyFileSync(item_path, path.join(dest, item));
        } else if (temp.isDirectory()) {
            // console.log("Item Is Directory:" + item);
            copyDirectorySync(item_path, path.join(dest, item));
        }
    });
};

fs.rmdirSync("./build-web", { recursive: true });
// fs.rmdirSync("./build-server", { recursive: true });

copyDirectorySync("../web/build-web", "./build-web");
// copyDirectorySync("../server/build-server", "./build-server");