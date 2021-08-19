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
        onClickBack: async () => {
            await this.props.saveProjectWithConfirm();
            this.props.dispose();
            this.props.setRoute(ROUTE_ROUTER);
        },
        onClickSave: async () => {
            await this.props.saveProject();
        },
        getMenu4file: () => {
            return (
                <Menu onClick={this.actions.onMenu4fileClick}>
                    <Menu.Item key="New">{"新建项目"}</Menu.Item>
                    {/* <Menu.Item key="Save As">{"项目另存为..."}</Menu.Item> */}
                    <Menu.Item key="My Projects">{"打开我的项目"}</Menu.Item>
                </Menu>
            )
        },
        onMenu4fileClick: async ({ key }) => {
            switch (key) {
                case "New":
                    await this.props.saveProjectWithConfirm();
                    showStringInputModal({
                        title: "新建项目名称",
                        name: `新建项目 ${new Date().toLocaleDateString()}`,
                        okText: "新建",
                        cancelText: "取消",
                        onOk: async (inputName) => {
                            if (inputName.length === 0) {
                                message.warning('项目名不能为空');
                                return;
                            }
                            await this.props.newThenLoadProjectAsEditing(inputName)
                        },
                        onCancel: () => {
                        }
                    })
                    break;
                case "My Projects":
                    await this.props.saveProjectWithConfirm();
                    this.props.showProjectManageModal();
                    break;
            }
        },
    }

    render() {
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
                {
                    props.name &&
                    <InputString
                        style={{ width: "200px" }}
                        value={`项目名: ${props.name}`}
                        disabled={true}
                        onAfterChange={actions.onChangeName}
                    />
                }
            </Space>
        )
    }
}

const mapStateToProps = (state) => {
    const { projectEditing, projectTemp, saved, name } = state.projectEdit;
    // console.log("==================================")
    // console.log("name: ", name)
    // console.log("saved: ", saved)
    // // console.log("projectEditing: ", JSON.stringify(projectEditing, null, 2))
    // // console.log("projectTemp: ", JSON.stringify(projectTemp, null, 2))
    // console.log("projectEditing: ", projectEditing)
    // console.log("projectTemp: ", projectTemp)
    return {
        projectEditing,
        projectTemp,
        name,
        saved,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setRoute: (route) => dispatch(routerActions.setRoute(route)),
        showProjectManageModal: () => dispatch(projectManageActions.showProjectManageModal()),
        saveProject: () => dispatch(projectEditActions.saveProject()),
        saveProjectWithConfirm: () => dispatch(projectEditActions.saveProjectWithConfirm()),
        newThenLoadProjectAsEditing: (name) => dispatch(projectEditActions.newThenLoadProjectAsEditing(name)),
        dispose: () => dispatch(projectEditActions.dispose()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);