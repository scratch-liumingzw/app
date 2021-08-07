import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const copyDirSync = (src, dest) => {
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

export const clearDirAsync = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return;
    }
    const filenames = fs.readdirSync(dir);
    filenames.forEach(name => {
        const filepath = path.join(dir, name);
        const stat = fs.statSync(filepath);
        if (stat.isFile()) {
            fs.unlink(
                filepath,
                (err) => {
                    if (err) throw err;
                }
            );
        } else if (stat.isDirectory()) {
            fs.rmdir(
                filepath,
                { recursive: true },
                (err) => {
                    if (err) throw err;
                }
            );
        }
    });
};

export const getTimeStr = () => {
    const d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        seconds = d.getSeconds();
    return year + "-" +
        (month < 10 ? "0" + month : month) + "-" +
        (day < 10 ? "0" + day : day) + "-" +
        (hour < 10 ? "0" + hour : hour) + "-" +
        (minute < 10 ? "0" + minute : minute) + "-" +
        (seconds < 10 ? "0" + seconds : seconds);
}

export const getUuid = () => {
    return uuidv4();
};