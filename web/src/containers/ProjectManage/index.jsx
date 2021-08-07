import React from 'react';
import { connect } from 'react-redux';
import { Button, Space } from 'antd';
import CreateProjectModal from "./CreateProjectModal/index.jsx";
import ProjectList from "./ProjectList.jsx";
import { actions as projectManageActions } from "../../reducers/projectManage";
import { actions as projectEditActions } from "../../reducers/projectEdit";
import { actions as routerActions } from "../../reducers/router";
import electronPackageJson from "../../../../electron/package.json";
import { ROUTE_ROUTER } from "../../constants.js";

class Index extends React.Component {
    state = {
        createProjectModalVisible: false,
        projects: [],
        projectListType: 'my', // my/template/null
    };

    actions = {
        onClickBack: () => {
            this.props.setRoute(ROUTE_ROUTER);
        },
        onClickCreateProject: () => {
            this.setState({
                createProjectModalVisible: true,
                projects: this.props.templateProjects.concat(this.props.myProjects),
                projectListType: null,
            });
        },
        onClickMyProject: () => {
            this.setState({
                createProjectModalVisible: false,
                projects: this.props.myProjects,
                projectListType: "my",
            });
        },
        onClickTemplateProject: () => {
            this.setState({
                createProjectModalVisible: false,
                projects: this.props.templateProjects,
                projectListType: "template",
            });
        },
        // CreateProjectModal callback
        onCancelCreateProjectModal: () => {
            this.setState({
                createProjectModalVisible: false,
                projects: [],
                projectListType: null,
            });
        },
        onConfirmCreateProjectModal: async (projectData) => {
            this.setState({
                createProjectModalVisible: false,
                projects: [],
                projectListType: null,
            });
            await this.props.createProject(projectData);
            // TODO: 新建完毕直接打开
            // this.props.setRoute(ROUTE_PROJECT_EDIT);
            // this.props.loadProjectToWorkspace(this.state.project)
        },
    }

    render() {
        const state = this.state;
        const actions = this.actions;
        return (
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "#eeeeee" }}>
                <CreateProjectModal
                    visible={state.createProjectModalVisible}
                    projects={state.projects}
                    onCancel={actions.onCancelCreateProjectModal}
                    onConfirm={actions.onConfirmCreateProjectModal}
                />
                <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "50px", backgroundColor: "#b0b0b0" }}>
                    <h2>{`机器人机械手V${electronPackageJson.version}`}</h2>
                </div>
                <div style={{ position: "absolute", left: 0, bottom: 0, top: "50px", width: "200px", backgroundColor: "#c0c0c0" }}>
                    <Space direction="vertical" style={{ width: "100%", padding: "10px" }}>
                        <Button style={{ width: "100%" }} ghost onClick={actions.onClickBack}>返回</Button>
                        <Button style={{ width: "100%" }} ghost onClick={actions.onClickCreateProject}>新建项目</Button>
                        <Button style={{ width: "100%" }} ghost onClick={actions.onClickMyProject}>我的项目</Button>
                        <Button style={{ width: "100%" }} ghost onClick={actions.onClickTemplateProject}>模版项目</Button>
                    </Space>
                </div>
                <div style={{ position: "absolute", left: "200px", bottom: 0, top: "50px", right: 0, backgroundColor: "#a0a0a0" }}>
                    <ProjectList projectListType={state.projectListType} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { templateProjects, myProjects } = state.projectManage;
    return {
        templateProjects,
        myProjects
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setRoute: (route) => dispatch(routerActions.setRoute(route)),
        loadProjectToWorkspace: (project) => dispatch(projectEditActions.loadProjectToWorkspace(project)),
        createProject: (data) => dispatch(projectManageActions.createProject(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);