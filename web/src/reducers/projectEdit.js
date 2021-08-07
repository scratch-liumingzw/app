import VM from 'scratch-vm';
import blankProject from "../blankProject.json";
import blankScProject from "./blankScProject.json";
import { cloneDeep } from '../utils';
import { actions as projectManageActions } from "./projectManage";
import { message } from 'antd';
import * as api from "../api";

const ACTION_UPDATE_STATE = 'scratch/ACTION_UPDATE_STATE';

const INITIAL_STATE = {
    project: null,
    name: "",
    saved: false,
    vm: null,
    running: false,
    variables: [] //item={visible, id, value, name}
};

export const actions = {
    _updateState: (state) => {
        return {
            type: ACTION_UPDATE_STATE,
            state
        };
    },
    init: () => (dispatch, getState) => {
        console.log("## init vm")
        const vm = new VM();
        vm.start();

        // 为了正常使用blocks，至少load一个project，保证至少有一个target
        // 为了方便，直接生成一个默认的项目，json格式，加载即可
        // default_sc_project.json的生成：使用官方的scratch-gui，const json = vm.toJSON();
        //参考：scratch-gui/lib/vm-listener-hoc.jsx
        const data = cloneDeep(blankScProject);
        const project = cloneDeep(blankProject);
        project.data = data;
        vm.loadProject(data);
        dispatch(actions._updateState({ vm, project, saved: false }));

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
        //not be called back if the visible of variables are all false
        //TODO: bug-fix, visible is true when a new variable first added, but checkbox is false in tool-box
        vm.on(
            'MONITORS_UPDATE',
            (monitorList) => {
                //variable count: monitorList._list._tail.array.length
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
    saveProject: () => async (dispatch, getState) => {
        const { project, name, vm } = getState().projectEdit;

        // vm.toJSON() 返回 string
        const data = JSON.parse(vm.toJSON());
        data.meta.name = name;

        if (project.filepath.length === 0) {
            // 是 blank project
            const { status, result } = await api.createProject(data);
            if (status === "ok") {
                message.success("新建成功");
                dispatch(actions._updateState({ project: result, saved: true }));
                dispatch(projectManageActions.readMyProjects());
            } else {
                message.error("新建失败");
            }
        } else {
            project.data = data;
            const { status, result } = await api.updateMyProject(project);
            if (status === "ok") {
                message.success('保存成功');
                dispatch(actions._updateState({ project: result, saved: true }));
                dispatch(projectManageActions.readMyProjects());
            } else {
                message.error('保存失败');
            }
        }
    },
    renameProject: (name) => async (dispatch, getState) => {
        dispatch(actions._updateState({ name, saved: false }));
    },
    loadProject: (project) => async (dispatch, getState) => {
        const { name } = project.data.meta;
        // vm doto
        dispatch(actions._updateState({ project, name, saved: true, }));
    }
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
