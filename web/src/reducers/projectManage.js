import { message } from 'antd';
import produce from "immer";
import * as api from "../api";

const ACTION_UPDATE_STATE = 'projectManage/ACTION_UPDATE_STATE';

const INITIAL_STATE = {
    // project: { filepath, birthtimeMs, mtimeMs, data: { name, width, height, componentInfos } }
    // componentInfo: { sourceId, props }
    myProjects: [],
    templateProjects: [],
    projectManageModalVisible: true
};

// 项目管理
const actions = {
    _updateState: (state) => {
        return { type: ACTION_UPDATE_STATE, state };
    },
    showProjectManageModal: () => async (dispatch, getState) => {
        const { myProjects } = getState().projectManage;
        if (myProjects.length === 0) {
            message.warn("我的项目为空");
        } else {
            dispatch(actions._updateState({ projectManageModalVisible: true }));
        }
    },
    hideProjectManageModal: () => async (dispatch) => {
        dispatch(actions._updateState({ projectManageModalVisible: false }));
    },
    // C
    createProject: (data) => async (dispatch) => {
        const { status } = await api.createProject(data);
        if (status === "ok") {
            message.success("新建成功");
            dispatch(actions.readMyProjects());
        } else {
            message.error("新建失败");
            console.error('createProject error');
        }
    },
    duplicateProjectToMy: (project, name) => async (dispatch) => {
        const data = produce(project.data, draft => {
            draft.name = name;
        });
        const { status } = await api.createProject(data);
        if (status === "ok") {
            message.success("复制成功");
            dispatch(actions.readMyProjects());
        } else {
            message.error("复制失败");
            console.error('duplicateProjectToMy error');
        }
    },
    // U
    renameMyProject: (project, name) => async (dispatch) => {
        const newProject = produce(project, draft => {
            draft.data.name = name;
        });
        const { status } = await api.updateMyProject(newProject);
        if (status === "ok") {
            message.success("重命名成功");
            dispatch(actions.readMyProjects());
        } else {
            message.error("重命名失败");
            console.error('renameMyProject error');
        }
    },
    // R
    readMyProjects: () => async (dispatch) => {
        const { status, result } = await api.readMyProjects();
        if (status === "ok") {
            dispatch(actions._updateState({ myProjects: result }));
        } else {
            message.error("读取我的项目失败");
            console.error('readMyProjects error');
        }
    },
    readTemplateProjects: () => async (dispatch) => {
        const { status, result } = await api.readTemplateProjects();
        if (status === "ok") {
            dispatch(actions._updateState({ templateProjects: result }));
        } else {
            message.error("读取模版项目失败");
            console.error('readTemplateProjects error');
        }
    },
    // D
    deleteMyProject: (project) => async (dispatch) => {
        const { status } = await api.deleteMyProject(project);
        if (status === "ok") {
            message.success("删除成功");
            dispatch(actions.readMyProjects());
        } else {
            message.error("删除失败");
            console.error('deleteMyProject error');
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