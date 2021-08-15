import React from 'react';
import VM from 'scratch-vm';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import blankProject from "./blankProject.json";
import blankScProject from "./blankScProject.json";
import { cloneDeep } from '../utils';
import { actions as projectManageActions } from "./projectManage";
import { message, Modal } from 'antd';
import * as api from "../api";
import showStringInputModal from "../components/Modals/showStringInputModal.jsx";

const ACTION_UPDATE_STATE = 'projectEdit/ACTION_UPDATE_STATE';

const INITIAL_STATE = {
    projectEditing: null,
    projectTemp: null,
    saved: true,
    name: null,
    vm: null,
    running: false,
    variables: [] // item = { visible, id, value, name }
};

// this.props.vm.greenFlag();
// this.props.vm.stopAll();

export const actions = {
    _updateState: (state) => {
        return { type: ACTION_UPDATE_STATE, state };
    },
    init: () => (dispatch, getState) => {
        console.log("## init vm")

        const vm = new VM();
        vm.start();
        dispatch(actions._updateState({ vm }));

        // 为了正常使用 blocks，至少 load 一个 project，保证至少有一个 target
        // 为了方便，直接生成一个默认的项目，json 格式，加载即可
        // blankScProject.json 的生成：使用官方的 scratch-gui，const json = vm.toJSON();
        //参考：scratch-gui/lib/vm-listener-hoc.jsx
        dispatch(actions.loadBlankScProjectAsTemp());

        document.addEventListener('keydown', (e) => {
            // Don't capture keys intended for Blockly inputs.
            if (e.target !== document && e.target !== document.body) return;
            vm.postIOData('keyboard', {
                keyCode: e.keyCode,
                key: e.key,
                isDown: true
            });
            // Prevent space/arrow key from scrolling the page.
            if (e.keyCode === 32 || // 32=space
                (e.keyCode >= 37 && e.keyCode <= 40)) { // 37, 38, 39, 40 are arrows
                e.preventDefault();
            }
        });
        document.addEventListener('keyup', (e) => {
            // Always capture up events,
            // even those that have switched to other targets.
            vm.postIOData('keyboard', {
                keyCode: e.keyCode,
                key: e.key,
                isDown: false
            });
            // E.g., prevent scroll.
            if (e.target !== document && e.target !== document.body) {
                e.preventDefault();
            }
        });
        vm.on(
            'PROJECT_RUN_START',
            () => {
                dispatch(actions._updateState({ running: true }));
            }
        );
        vm.on(
            'PROJECT_RUN_STOP',
            () => {
                dispatch(actions._updateState({ running: false }));
            }
        );
        vm.on(
            'PROJECT_CHANGED',
            () => {
                dispatch(actions._updateState({ saved: false }));
            }
        );
        // not be called back if the visible of variables are all false
        // TODO: bug-fix, visible is true when a new variable first added, but checkbox is false in tool-box
        vm.on(
            'MONITORS_UPDATE',
            (monitorList) => {
                // variable count: monitorList._list._tail.array.length
                const variables = [];
                const array = monitorList._list._tail.array;
                for (let i = 0; i < array.length; i++) {
                    const { visible, id, value, params } = array[i][1];
                    const name = params.VARIABLE; //for example: 我的变量
                    variables.push({ visible, id, value, name })
                }
                dispatch(actions._updateState({ variables }));
            }
        );
    },
    loadBlankScProjectAsTemp: () => (dispatch, getState) => {
        const { vm } = getState().projectEdit;
        const data = cloneDeep(blankScProject);
        const project = cloneDeep(blankProject);
        project.data = data;
        vm.loadProject(data);
        dispatch(actions._updateState({
            projectEditing: null,
            projectTemp: project,
            saved: true,
            name: null,
        }));
    },
    loadProjectAsEditing: (project) => (dispatch, getState) => {
        const { vm } = getState().projectEdit;
        vm.loadProject(project.data);
        const { name = "未命名" } = project.data.meta;
        dispatch(actions._updateState({
            projectEditing: project,
            projectTemp: null,
            saved: true,
            name
        }));
    },
    newThenLoadProjectAsEditing: (name) => async (dispatch, getState) => {
        const data = cloneDeep(blankScProject);
        data.meta.name = name;
        const { status, result: project } = await api.createProject(data);
        if (status === "ok") {
            dispatch(actions.loadProjectAsEditing(project));
            dispatch(projectManageActions.readMyProjects());
            message.success("新建成功");
        } else {
            console.error('newThenLoadProjectAsEditing error');
            message.error("新建失败");
        }
    },
    dispose: () => async (dispatch, getState) => {
        console.log("#dispose")
        const { vm } = getState().projectEdit;
        vm.stopAll();
        dispatch(actions._updateState({
            projectEditing: null,
            projectTemp: null,
            saved: true,
            name: null,
        }));
    },
    saveProject: () => async (dispatch, getState) => {
        const { projectEditing, projectTemp, name, vm } = getState().projectEdit;

        const processProjectEditing = async () => {
            if (!projectEditing) {
                return;
            }
            const project = cloneDeep(projectEditing);
            project.data = JSON.parse(vm.toJSON()); // vm.toJSON() 返回 string
            project.data.meta.name = name;
            // 更新已有的项目
            const { status, result } = await api.updateMyProject(project);
            if (status === "ok") {
                dispatch(actions._updateState({
                    projectEditing: result,
                    projectTemp: null,
                    saved: true
                }));
                dispatch(projectManageActions.readMyProjects());
                message.success('保存成功');
            } else {
                message.error('保存失败');
            }
        };

        const processProjectTemp = () => {
            if (!projectTemp) {
                return;
            }
            return new Promise((resolve, reject) => {
                const name = `新项目 ${new Date().toLocaleDateString()}`;
                showStringInputModal({
                    title: "当前临时项目未保存，是否保存？",
                    name,
                    okText: "保存",
                    cancelText: "不保存",
                    onOk: async (newName) => {
                        if (newName.length === 0) {
                            message.warning('项目名不能为空');
                            return;
                        }
                        // vm.toJSON() 返回 string
                        const data = JSON.parse(vm.toJSON());
                        data.meta.name = name;
                        // 创建新的项目
                        const { status, result } = await api.createProject(data);
                        if (status === "ok") {
                            message.success("保存成功");
                            // projectTemp 保存后，就变成了 projectEditing
                            dispatch(actions._updateState({
                                projectEditing: result,
                                projectTemp: null,
                                saved: true,
                                name
                            }));
                            dispatch(projectManageActions.readMyProjects());
                            resolve();
                        } else {
                            message.error("保存失败");
                            reject();
                        }
                    },
                    onCancel: () => {
                        resolve();
                    }
                })
            });
        }

        await processProjectEditing();

        await processProjectTemp();

        return { type: null };
    },

    // 多个地方都会需要使用此 action，并且需要和 UI 配合，因此还是写在一个地方更好
    saveProjectWithConfirm: () => async (dispatch, getState) => {
        if (getState().projectEdit.saved) {
            return { type: null };
        }

        const { projectEditing, projectTemp, name, vm } = getState().projectEdit;

        const processProjectEditing = async () => {
            if (!projectEditing) {
                return;
            }
            return new Promise((resolve, reject) => {
                Modal.confirm({
                    title: '项目有修改，是否保存？',
                    // centered: true,
                    icon: <ExclamationCircleOutlined />,
                    okText: "放弃修改",
                    okType: "danger",
                    onOk: () => {
                        resolve();
                    },
                    cancelText: "保存修改",
                    onCancel: async () => {
                        const project = cloneDeep(projectEditing);
                        project.data = JSON.parse(vm.toJSON()); // vm.toJSON() 返回 string
                        project.data.meta.name = name;
                        // 更新已有的项目
                        const { status, result } = await api.updateMyProject(project);
                        if (status === "ok") {
                            dispatch(actions._updateState({
                                projectEditing: result,
                                projectTemp: null,
                                saved: true
                            }));
                            dispatch(projectManageActions.readMyProjects());
                            message.success('保存成功');
                            resolve();
                        } else {
                            message.error('保存失败');
                            reject();
                        }
                    }
                });
            });
        };

        const processProjectTemp = () => {
            if (!projectTemp) {
                return;
            }
            return new Promise((resolve, reject) => {
                const name = `新项目 ${new Date().toLocaleDateString()}`;
                showStringInputModal({
                    title: "当前的临时项目未保存，是否保存？",
                    name,
                    okText: "保存",
                    cancelText: "不保存",
                    onOk: async (newName) => {
                        if (newName.length === 0) {
                            message.warning('项目名不能为空');
                            return;
                        }
                        // vm.toJSON() 返回 string
                        const data = JSON.parse(vm.toJSON());
                        data.meta.name = name;
                        // 创建新的项目
                        const { status, result } = await api.createProject(data);
                        if (status === "ok") {
                            message.success("保存成功");
                            // projectTemp 保存后，就变成了 projectEditing
                            dispatch(actions._updateState({
                                projectEditing: result,
                                projectTemp: null,
                                saved: true,
                                name
                            }));
                            dispatch(projectManageActions.readMyProjects());
                            resolve();
                        } else {
                            message.error("保存失败");
                            reject();
                        }
                    },
                    onCancel: async () => {
                        console.log("canel")
                        resolve();
                    }
                })
            });
        }

        console.log("processProjectEditing before")
        await processProjectEditing();

        console.log("processProjectEditing after")

        console.log("processProjectTemp before")
        await processProjectTemp();
        console.log("processProjectTemp after")

        return { type: null };
    },
};

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ACTION_UPDATE_STATE: {
            return Object.assign({}, state, action.state);
        }
        default:
            return state;
    }
}
