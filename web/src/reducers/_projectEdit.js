import { message } from 'antd';
import * as api from "../api";
import { cloneDeep } from '../utils';
import { actions as projectManageActions } from "./projectManage";

const ACTION_UPDATE_STATE = 'projectEdit/ACTION_UPDATE_STATE';

const INITIAL_STATE = {
    project: null, // the editing project
    components: [], // all components added in workspace
    saved: false, // is the editing project saved
    workspaceDom: null, // the dom container of all components
    zoom: "100%", // zoom of workspaceDom
};

const actions = {
    _updateState: (state) => {
        return { type: ACTION_UPDATE_STATE, state };
    },
    // workspace
    setWorkspaceDom: (dom) => (dispatch) => {
        dispatch(actions._updateState({ workspaceDom: dom }));
    },
    clearWorkspace: () => (dispatch, getState) => {
        const { workspaceDom } = getState().projectEdit;
        while (workspaceDom.firstChild) {
            workspaceDom.removeChild(workspaceDom.firstChild);
        }
        dispatch(actions._updateState({
            project: null,
            components: [],
            saved: false,
            zoom: "100%"
        }));
    },
    // project
    loadProjectToWorkspace: (project) => (dispatch) => {
        dispatch(actions.clearWorkspace());
        const { componentInfos } = project.data;
        componentInfos.forEach(item => {
            dispatch(actions.addComponentInfoToWorkspace(item));
        })
        dispatch(actions._updateState({ project, saved: true, zoom: "100%" }));
    },
    saveProject: () => async (dispatch, getState) => {
        const { project, components } = getState().projectEdit;

        const projectClone = cloneDeep(project);
        // 从 components 中抽离 info，复制(只复制引用即可)给 data.componentInfos
        const infos = [];
        for (let i = 0; i < components.length; i++) {
            infos.push(components[i].info);
        }
        projectClone.data.componentInfos = infos;

        const { status, result } = await api.updateMyProject(projectClone);
        if (status === "ok") {
            message.success('保存成功');
            dispatch(actions._updateState({ project: result, saved: true }));
            dispatch(projectManageActions.readMyProjects());
        } else {
            message.error('保存失败');
        }
    },
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTION_UPDATE_STATE:
            return Object.assign({}, state, action.state);
        default:
            return state;
    }
};

export { actions };
export default reducer;