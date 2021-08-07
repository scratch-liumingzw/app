import React from 'react';
import { connect } from 'react-redux';
import { Button, message, Modal, Row } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { actions as projectManageActions } from "../../reducers/projectManage";
import { actions as projectEditActions } from "../../reducers/projectEdit";
import { actions as routerActions } from "../../reducers/router";
import { ROUTE_PROJECT_EDIT } from "../../constants.js";
import showStringInputModal from "../../components/Modals/showStringInputModal.jsx";
import ProjectInfo from "../../components/ProjectInfo/index.jsx";

/**
 * 项目展示列表
 * 并提供针对项目的操作：preview/edit/rename/delete/duplicate/export source code
 * props from parent: projectListType: my/template/null
 */
class Index extends React.Component {
    state = {
        project: null // selected project
    };

    actions = {
        onSelectProject: (project) => {
            this.setState({ project })
        },
        onClickEdit: () => {
            this.props.setRoute(ROUTE_PROJECT_EDIT);
            this.props.loadProjectToWorkspace(this.state.project);
            this.setState({ project: null })
        },
        onClickRename: async () => {
            const { name } = this.state.project.data;
            showStringInputModal({
                title: "项目重命名",
                name,
                okText: "重命名",
                cancelText: "取消",
                onOk: async (newName) => {
                    if (newName === name) {
                        message.warning('项目名没有变化');
                        return;
                    }
                    if (newName.length === 0) {
                        message.warning('项目名不能为空');
                        return;
                    }
                    this.setState({ project: null })
                    await this.props.renameMyProject(this.state.project, newName);
                }
            });
        },
        onClickDel: async () => {
            Modal.confirm({
                title: '确认删除此项目吗?',
                icon: <ExclamationCircleOutlined />,
                content: '删除后该项目将无法恢复',
                okText: "删除",
                cancelText: "取消",
                okType: "danger",
                onOk: async () => {
                    this.setState({ project: null })
                    await this.props.deleteMyProject(this.state.project);
                }
            });
        },
        onClickDuplicate: async () => {
            const name = `${this.state.project.data.name}-copy`
            showStringInputModal({
                title: "复制项目",
                name,
                okText: "复制",
                cancelText: "取消",
                onOk: async (newName) => {
                    if (newName.length === 0) {
                        message.warning('项目名不能为空');
                        return;
                    }
                    this.setState({ project: null })
                    await this.props.duplicateProjectToMy(this.state.project, newName);
                }
            });
        },
        onClickCancel: () => {

        },

    };

    componentWillReceiveProps(nextProps) {
        if (this.props.projectListType !== nextProps.projectListType) {
            this.setState({ project: null });
        }
    }

    render() {
        const state = this.state;
        const actions = this.actions;
        const props = this.props;

        const projects = props.myProjects;

        return (
            <Modal
                title={"我的项目"}
                closable={true}
                centered={true}
                visible={props.projectManageModalVisible}
                onCancel={props.hideProjectManageModal}
                width={"80%"}
                footer={[
                    <Button
                        ghost
                        disabled={!state.project}
                        type="primary"
                        size="small"
                        onClick={actions.onClickEdit}>
                        编辑
                    </Button>,
                    <Button
                        ghost
                        disabled={!state.project}
                        type="primary"
                        size="small"
                        onClick={actions.onClickRename}>
                        重命名
                    </Button>,
                    <Button
                        ghost
                        disabled={!state.project}
                        type="primary"
                        size="small"
                        onClick={actions.onClickDel}>
                        删除
                    </Button>,
                    <Button
                        ghost
                        disabled={!state.project}
                        type="primary"
                        size="small"
                        onClick={actions.onClickDuplicate}>
                        复制
                    </Button>
                ]}
            >
                <Row gutter={[20, 20]} >
                    {
                        projects.map((item, index) => {
                            return (
                                <ProjectInfo
                                    key={index}
                                    project={item}
                                    isSelected={state.project === item}
                                    onSelect={(project) => {
                                        actions.onSelectProject(project);
                                    }}
                                />
                            );
                        })
                    }
                </Row>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    const { templateProjects, myProjects, projectManageModalVisible } = state.projectManage;
    return {
        templateProjects,
        myProjects,
        projectManageModalVisible
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setRoute: (route) => dispatch(routerActions.setRoute(route)),
        loadProjectToWorkspace: (project) => dispatch(projectEditActions.loadProjectToWorkspace(project)),
        duplicateProjectToMy: (project, name) => dispatch(projectManageActions.duplicateProjectToMy(project, name)),
        renameMyProject: (project, name) => dispatch(projectManageActions.renameMyProject(project, name)),
        deleteMyProject: (project) => dispatch(projectManageActions.deleteMyProject(project)),
        hideProjectManageModal: () => dispatch(projectManageActions.hideProjectManageModal()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);