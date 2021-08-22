import fs from 'fs';
import path from 'path';
import electron from 'electron';
import isElectron from 'is-electron';

const clearDirAsync = (dir) => {
    if (fs.existsSync(dir)) {
        fs.rmdir(
            dir,
            { recursive: true },
            (err) => {
                if (err) throw err;
                fs.mkdirSync(dir, { recursive: true });
            }
        );
    } else {
        fs.mkdirSync(dir, { recursive: true });
    }
};

class StoreManager {
    constructor() {
        this.dir_user_data = null;
        this.dir_assets = null;

        // assets：资源文件，会打包到 electron 中
        this.dir_builds_components_react = null;
        this.dir_builds_components_vue = null;
        this.dir_source_code_react = null;
        this.dir_source_code_vue = null;
        this.dir_template_projects = null;

        // userData：用户数据，对应到用户电脑的 userData 目录
        this.dir_cache = null;
        this.dir_my_projects = null;

        if (isElectron()) {
            // electron 环境下，打包后，执行路径是 app.asar/build-server/bundle.js，即 __dirname = app.asar/build-server
            this.dir_user_data = (electron.app || electron.remote.app).getPath('userData');
            this.dir_assets = path.join(__dirname, '..', 'assets');

            // assets
            this.dir_builds_components_react = path.join(this.dir_assets, 'builds_components_react');
            this.dir_builds_components_vue = path.join(this.dir_assets, 'builds_components_vue');
            this.dir_source_code_react = path.join(this.dir_assets, 'source_code_react');
            this.dir_source_code_vue = path.join(this.dir_assets, 'source_code_vue');
            this.dir_template_projects = path.join(this.dir_assets, 'template_projects');

            // if (!fs.existsSync(this.dir_builds_components_react)
            //     || !fs.existsSync(this.dir_builds_components_vue)
            //     || !fs.existsSync(this.dir_source_code_react)
            //     || !fs.existsSync(this.dir_source_code_vue)
            //     // || !fs.existsSync(this.dir_template_projects)
            // ) {
            //     console.error("Error: asserts sub dir not exist");
            // }

            // userData
            // app 每次启动清空, 异步清空
            this.dir_cache = path.join(this.dir_user_data, 'Cache', '_cache')
            this.dir_my_projects = path.join(this.dir_user_data, 'my_projects');
            !fs.existsSync(this.dir_my_projects) && fs.mkdirSync(this.dir_my_projects, { recursive: true });
            clearDirAsync(this.dir_cache);
        } else {
            // dev 环境下，__dirname = ./server/src
            this.dir_user_data = path.join(__dirname, '..', 'userData');
            this.dir_assets = path.join(__dirname, '..', 'assets');

            // assets
            this.dir_builds_components_react = path.join(this.dir_assets, 'builds_components_react');
            this.dir_builds_components_vue = path.join(this.dir_assets, 'builds_components_vue');
            this.dir_source_code_react = path.join(this.dir_assets, 'source_code_react');
            this.dir_source_code_vue = path.join(this.dir_assets, 'source_code_vue');
            this.dir_template_projects = path.join(this.dir_assets, 'template_projects');

            // if (!fs.existsSync(this.dir_builds_components_react)
            //     || !fs.existsSync(this.dir_builds_components_vue)
            //     || !fs.existsSync(this.dir_source_code_react)
            //     || !fs.existsSync(this.dir_source_code_vue)
            //     // || !fs.existsSync(this.dir_template_projects)
            // ) {
            //     console.error("Error: asserts sub dir not exist");
            // }

            // userData
            this.dir_cache = path.join(this.dir_user_data, 'Cache', '_cache')
            this.dir_my_projects = path.join(this.dir_user_data, 'my_projects');
            !fs.existsSync(this.dir_my_projects) && fs.mkdirSync(this.dir_my_projects, { recursive: true });
            clearDirAsync(this.dir_cache);
        }

        console.log('----------------- StoreManager --------------------');
        console.log("isElectron: " + isElectron());
        console.log("__dirname: " + __dirname);

        console.log("dir_user_data: " + this.dir_user_data);
        console.log("dir_assets: " + this.dir_assets);

        console.log("dir_builds_components_react: " + this.dir_builds_components_react);
        console.log("dir_builds_components_vue: " + this.dir_builds_components_vue);
        console.log("dir_source_code_react: " + this.dir_source_code_react);
        console.log("dir_source_code_vue: " + this.dir_source_code_vue);
        console.log("dir_template_projects: " + this.dir_template_projects);

        console.log("dir_cache: " + this.dir_cache);
        console.log("dir_my_projects: " + this.dir_my_projects);
        console.log('---------------------------------------------------');
    }
}

const storeManager = new StoreManager();

export default storeManager;