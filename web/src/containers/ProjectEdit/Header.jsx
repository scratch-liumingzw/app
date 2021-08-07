import React from 'react';
import { connect } from 'react-redux';
import { Button, Space, Menu, Dropdown, Modal } from 'antd';
import { FolderOutlined, SaveOutlined, HomeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { actions as projectEditActions } from "../../reducers/projectEdit";
import { actions as projectManageActions } from "../../reducers/projectManage";
import { actions as routerActions } from "../../reducers/router";
import { ROUTE_ROUTER } from "../../constants.js";
import InputString from "../../components/InputString/index.jsx";
import showStringInputModal from "../../components/Modals/showStringInputModal.jsx";

class Index extends React.Component {
    actions = {
        onClickBack: () => {
            if (this.props.saved) {
                this.props.clearWorkspace();
                this.props.setRoute(ROUTE_ROUTER);
            } else {
                Modal.confirm({
                    title: '项目有修改',
                    icon: <ExclamationCircleOutlined />,
                    okText: "放弃修改",
                    okType: "danger",
                    onOk: () => {
                        this.props.setRoute(ROUTE_PROJECT_MANAGE);
                    },
                    cancelText: "保存修改",
                    onCancel: async () => {
                        await this.props.saveProject();
                        this.props.setRoute(ROUTE_PROJECT_MANAGE);
                    }
                });
            }
        },
        onClickSave: () => {
            this.props.saveProject();
        },
        onChangeName: (name) => {
            name = name.trim();
            if (name.length === 0) {
                message.warning('项目名不能为空');
                return;
            }
            this.props.renameProject(name);
        },
        createNewProject: () => {
            const name = `新建项目 ${new Date().toLocaleDateString()}`;
            showStringInputModal({
                title: "项目名称",
                name,
                okText: "新建",
                cancelText: "取消",
                onOk: (newName) => {
                    if (newName.length === 0) {
                        message.warning('项目名不能为空');
                        return;
                    }
                    const data = cloneDeep(project.data);
                    data.name = newName;
                    this.setState({ project: null });
                    this.props.onConfirm(data);
                },
                onCancel: () => {
                    this.setState({ project: null });
                }
            })
        },
        getMenu4file: () => {
            const { t } = this.props;
            return (
                <Menu onClick={this.actions.onMenu4fileClick}>
                    <Menu.Item key="New">{"新建项目"}</Menu.Item>
                    {/* <Menu.Item key="Save As">{"项目另存为..."}</Menu.Item> */}
                    <Menu.Item key="My Projects">{"打开我的项目"}</Menu.Item>
                </Menu>
            )
        },
        onMenu4fileClick: ({ key }) => {
            const props = this.props;
            switch (key) {
                case "New": {
                    if (props.saved) {
                        this.actions.createNewProject();
                        return;
                    }

                    Modal.confirm({
                        title: '项目有修改',
                        icon: <ExclamationCircleOutlined />,
                        okText: "放弃修改",
                        okType: "danger",
                        onOk: () => {
                            this.actions.createNewProject();
                        },
                        cancelText: "保存修改",
                        onCancel: async () => {
                            await this.props.saveProject();
                        }
                    });
                    break;
                }
                case "Save As":

                    break;
                case "My Projects":
                    this.props.showProjectManageModal();
                    break;
            }
        },
    }

    render() {
        if (!this.props.project) {
            return null;
        }

        const state = this.state;
        const actions = this.actions;
        const props = this.props;
        return (
            <Space style={{ height: "100%", width: "100%", paddingLeft: "15px", backgroundColor: "#4DA9F6" }}>
                <Button
                    type="primary"
                    style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}
                    onClick={actions.onClickBack}
                    icon={<HomeOutlined />}>
                </Button>
                <Dropdown overlay={actions.getMenu4file} placement="bottomCenter">
                    <Button
                        type="primary"
                        style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}
                        icon={<FolderOutlined />}>
                        {"文件"}
                    </Button>
                </Dropdown>
                <Button
                    type="primary"
                    style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}
                    onClick={actions.onClickSave}
                    disabled={props.saved}
                    icon={<SaveOutlined />}>
                    {"保存"}
                </Button>
                <InputString
                    value={props.name}
                    onAfterChange={actions.onChangeName}
                />
            </Space>
        )
    }
}

const mapStateToProps = (state) => {
    const { project, name, saved } = state.projectEdit;
    // console.log("===========================")
    // console.log("name: ", name)
    // console.log("saved: ", saved)
    // console.log(JSON.stringify(project, null, 2))
    return {
        project,
        name,
        saved,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setRoute: (route) => dispatch(routerActions.setRoute(route)),
        saveProject: () => dispatch(projectEditActions.saveProject()),
        renameProject: (name) => dispatch(projectEditActions.renameProject(name)),
        clearWorkspace: () => dispatch(projectEditActions.clearWorkspace()),
        showProjectManageModal: () => dispatch(projectManageActions.showProjectManageModal()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);