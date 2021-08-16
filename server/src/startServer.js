import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import http from "http";
import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import serve from 'koa-static';
import isElectron from 'is-electron';
import _ from 'lodash';
import storeManager from './storeManager.js';
import SocketIoServer from 'socket.io';
import { getTimeStr } from './utils.js';
import { ROUTE_GESTURE, ROUTE_VOICE, RUN_PYTHON_STRING, RUN_PYTHON_RESULTS, RUN_PYTHON_ERR, RUN_PYTHON_FINISHED } from "./constants.js";
import { PythonShell } from 'python-shell';

let httpAddress = null;
const app = new Koa();
const router = new Router();
const httpServer = http.createServer(app.callback());
const socketIoServer = new SocketIoServer(httpServer);

const _readProjects = (dir) => {
    const projects = [];
    const filenames = fs.readdirSync(dir);
    filenames.forEach(filename => {
        if (path.extname(filename) === ".json") {
            const filepath = path.join(dir, filename);
            const { birthtimeMs, mtimeMs } = fs.statSync(filepath);
            const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            const project = {
                filepath,
                birthtimeMs,
                mtimeMs,
                data
            };
            projects.push(project)
        }
    });
    return projects
};

const setupHttpServer = () => {
    router
        /**
         * C：新建项目（保存在我的项目中）
         * 参数：data 项目的数据
         */
        .post('/project/create/my', (ctx) => {
            const filename = `${getTimeStr()}.json`;
            const filepath = path.join(storeManager.dir_my_projects, filename);
            const { data } = JSON.parse(ctx.request.body);
            fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
            const { birthtimeMs, mtimeMs } = fs.statSync(filepath);
            const project = {
                filepath,
                birthtimeMs,
                mtimeMs,
                data
            };
            return ctx.body = { status: "ok", result: project };
        })
        /**
         * U：更新我的项目
         * 比如：rename，项目 data，cover 等
         * 参数：project
         */
        .post('/project/update/my', (ctx) => {
            let { project } = JSON.parse(ctx.request.body);
            let { filepath, data } = project;
            fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
            const { birthtimeMs, mtimeMs } = fs.statSync(filepath);
            project = {
                data,
                filepath,
                birthtimeMs,
                mtimeMs
            };
            return ctx.body = { status: "ok", result: project };
        })
        /**
         * R：读取所有模版项目
         */
        // .post('/projects/read/template', (ctx) => {
        //     const projects = _readProjects(storeManager.dir_template_projects);
        //     return ctx.body = { status: "ok", result: projects };
        // })
        .post('/projects/read/template', (ctx) => {
            return ctx.body = { status: "ok", result: [] };
        })
        /**
         * R：读取所有我的项目
         */
        .post('/projects/read/my', (ctx) => {
            const projects = _readProjects(storeManager.dir_my_projects);
            return ctx.body = { status: "ok", result: projects };
        })
        /**
        * D：删除我的项目
        */
        .post('/project/delelte/my', (ctx) => {
            const { project } = JSON.parse(ctx.request.body);
            const { filepath } = project;
            fs.unlinkSync(filepath);
            return ctx.body = { status: "ok" };
        });

    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        await next();
    });

    app.use(async (ctx, next) => {
        console.log(`${ctx.request.method} ${ctx.request.url}`);
        await next();
    });

    app.use(koaBody({ multipart: true }));
    app.use(serve(storeManager.dir_cache));
    app.use(router.routes());
    app.use(router.allowedMethods());
};

const setupSocketServer = () => {
    socketIoServer.on(
        'connection',
        socket => {
            console.log('socket io server -> connect');

            socket.on('disconnect', () => {
                console.log('socket io server -> disconnect');
                //必须 remove all，否则多次触发event，且内存泄漏
                socket.removeAllListeners();
            });

            socket.on(ROUTE_GESTURE, () => {
                console.log("------------------------------------------------------")
                console.log("socket receive: ")
                console.log("type: ", ROUTE_GESTURE)
                console.log("//////////////////////////////////////////////////////")
            });

            socket.on(ROUTE_VOICE, () => {
                console.log("------------------------------------------------------")
                console.log("socket receive: ")
                console.log("type: ", ROUTE_VOICE)
                console.log("//////////////////////////////////////////////////////")
            });

            socket.on(RUN_PYTHON_STRING, ({ string }) => {
                console.log("------------------------------------------------------")
                console.log("socket receive: ")
                console.log("type: ", RUN_PYTHON_STRING);
                console.log("string: ");
                console.log(string);
                console.log("//////////////////////////////////////////////////////")

                const options = {
                    mode: 'text',
                    // pythonPath: 'path/to/python',
                    pythonOptions: ['-u'], // get print results in real-time
                    // scriptPath: 'path/to/my/scripts',
                    args: ['value1', 'value2', 'value3']
                };

                PythonShell.runString(
                    string,
                    options,
                    (err, results) => {
                        if (err) {
                            console.error("PythonShell.runString err: " + err)
                            socket.emit(RUN_PYTHON_ERR, { err });
                        } else {
                            socket.emit(RUN_PYTHON_RESULTS, { results });
                        }
                        socket.emit(RUN_PYTHON_FINISHED);
                    }
                );
            });
        }
    );
};

const setupListen = () => {
    //electron环境下: 动态获取可用端口
    //dev环境下：http://localhost:9000
    if (isElectron()) {
        httpServer.on('listening', () => {
            // http://nodejs.cn/api/net.html#net_class_net_server
            const { port } = httpServer.address();
            httpAddress = `http://localhost:${port}`;
            window.httpAddress = httpAddress;
            console.log('http address: ' + httpAddress);
        });
        httpServer.listen(0);
    } else {
        const port = 9000;
        httpServer.listen(port);
        httpAddress = `http://localhost:${port}`;
        console.log('http address: ' + httpAddress);
    }
};

const startServer = () => {
    setupHttpServer();
    setupSocketServer();
    setupListen();
};

export default startServer;