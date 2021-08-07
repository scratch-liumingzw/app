//fetch doc: https://developer.mozilla.org/zh-CN/docs/Web/API/Response
if (!window.httpAddress) {
    window.httpAddress = `http://localhost:9000`;
}
console.log('http server address: ' + window.httpAddress);

/**
 * C：新建项目（保存在我的项目中）
 * @param {*} data 项目的数据
 * @returns { status: "ok", result: project }
 */
export const createProject = async (data) => {
    return await fetch(`${window.httpAddress}/project/create/my`, {
        method: 'POST',
        body: JSON.stringify({ data })
    }).then(response => response.json());
};

/**
 * U：更新我的项目
 * @param {*} project 
 * @returns { status: "ok", result: project }
 */
export const updateMyProject = async (project) => {
    return await fetch(`${window.httpAddress}/project/update/my`, {
        method: 'POST',
        body: JSON.stringify({ project })
    }).then(response => response.json());
};

/**
 * R：读取所有模版项目
 * @returns { status: "ok", result: projects }
 */
export const readTemplateProjects = async () => {
    return await fetch(`${window.httpAddress}/projects/read/template`, {
        method: 'POST',
    }).then(response => response.json());
};

/**
 * R：读取所有我的项目
 * @returns { status: "ok", result: projects }
 */
export const readMyProjects = async () => {
    return await fetch(`${window.httpAddress}/projects/read/my`, {
        method: 'POST',
    }).then(response => response.json());
};

/**
 * D：删除我的项目
 * @param {} project 
 * @returns { status: "ok" }
 */
export const deleteMyProject = async (project) => {
    return await fetch(`${window.httpAddress}/project/delelte/my`, {
        method: 'POST',
        body: JSON.stringify({ project })
    }).then(response => response.json());
};

/**
 * R：读取 react 组件编译后的输出
 * @returns { status: "ok", result: builds }
 */
export const readComponentBuildsReact = async () => {
    return await fetch(`${window.httpAddress}/component/read/builds/react`, {
        method: 'POST'
    }).then(response => response.json());
};

/**
 * R：读取 vue 组件编译后的输出
 * @returns { status: "ok", result: builds }
 */
export const readComponentBuildsVue = async () => {
    return await fetch(`${window.httpAddress}/component/read/builds/vue`, {
        method: 'POST'
    }).then(response => response.json());
};

/**
 * 导出项目源码（react 版本）
 * @param {} project 
 * @returns { status: "ok", result: url }
 */
export const exportProjectSourceCodeReact = async (project) => {
    return await fetch(`${window.httpAddress}/projectSourceCode/export/react`, {
        method: 'POST',
        body: JSON.stringify({ project })
    }).then(response => response.json());
};

/**
 * 导出项目源码（vue 版本）
 * @param {} project 
 * @returns { status: "ok", result: url }
 */
export const exportProjectSourceCodeVue = async (project) => {
    return await fetch(`${window.httpAddress}/projectSourceCode/export/vue`, {
        method: 'POST',
        body: JSON.stringify({ project })
    }).then(response => response.json());
};