import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import FileSaver from 'file-saver';
import { Button, Space, Menu, Dropdown, Input, Tooltip } from 'antd';
import { FolderOutlined, SaveOutlined } from '@ant-design/icons';
import { actions as tapsActions } from "../../../../reducers/taps"
import { actions as codeProjectActions, isProjectNameExist } from "../../../../reducers/codeProject";
import { CODE_PROJECT_EXTENSION } from "../../../../constants";
import showSaveConfirmI18n from "../modal-tool/showSaveConfirmI18n.jsx";
import showSaveAsConfirmI18n from "../modal-tool/showSaveAsConfirmI18n.jsx";
import showNameInputI18n from "../modal-tool/showNameInputI18n.jsx";
import messageI18n from "../../../../utils/messageI18n";
import styles from './styles.css';
import { TAP_HOME } from "../../../../constants.js";

class Index extends React.Component {
    fileInput = React.createRef();

    state = {
        name: ""
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.projectInfo && nextProps.projectInfo.name !== this.state.name) {
            this.setState({ name: nextProps.projectInfo.name })
        }
    }

    actions = {
        onMenu4fileClick: ({ key }) => {
            const { name, location, isSaved } = this.props.projectInfo;
            switch (key) {
                case "New": {
                    if (!location) {
                        messageI18n.info("A new project already opened");
                        return;
                    }
                    if (!isSaved) {
                        if (location === "example") {
                            showSaveAsConfirmI18n({
                                title: 'The example project has been modified. Save as a new project?',
                                onCancel: () => {
                                    this.props.create()
                                },
                                onOk: () => {
                                    showNameInputI18n({
                                        title: 'Save as',
                                        defaultValue: name,
                                        onOk: (inputName) => {
                                            return new Promise(async (resolve, reject) => {
                                                inputName = inputName.trim();
                                                if (inputName.length === 0) {
                                                    messageI18n.error("Name can't be empty");
                                                    reject();
                                                } else if (isProjectNameExist(this.props.myProjectInfos, inputName)) {
                                                    messageI18n.error("Name already occupied");
                                                    reject();
                                                } else {
                                                    await this.props.saveAs(inputName);
                                                    this.props.create();
                                                    resolve();
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            showSaveConfirmI18n({
                                title: 'Your project has been modified. Save it?',
                                onCancel: () => {
                                    this.props.create()
                                },
                                onOk: async () => {
                                    await this.props.save();
                                    this.props.create();
                                }
                            });
                        }
                    } else {
                        this.props.create();
                    }
                    break;
                }
                case "Save As":
                    showNameInputI18n({
                        title: "Save As",
                        defaultValue: name,
                        onOk: (inputName) => {
                            return new Promise((resolve, reject) => {
                                inputName = inputName.trim();
                                if (inputName.length === 0) {
                                    messageI18n.error("Name can't be empty");
                                    reject();
                                } else if (isProjectNameExist(this.props.myProjectInfos, inputName)) {
                                    messageI18n.error("Name already occupied");
                                    reject();
                                } else {
                                    this.props.saveAs(inputName);
                                    resolve();
                                }
                            });
                        }
                    });
                    break;
                case "Example Projects":
                    this.props.openModal4exampleProjects();
                    break;
                case "My Projects":
                    this.props.openModal4myProjects();
                    break;
                case "Open from your computer":
                    this.fileInput.current.value = null;
                    this.fileInput.current.click();
                    break;
                case "Save to your computer":
                    const content = this.props.vm.toJSON();
                    const filename = `${name}${CODE_PROJECT_EXTENSION}`;
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    FileSaver.saveAs(blob, filename, true);
                    break;
            }
        },
        openFromYourComputer: (event) => {
            const file = event.target.files[0];
            this.props.openFromYourComputer(file);
        },
        onChangeProjectName: (e) => {
            this.setState({ name: e.target.value });
        },
        rename: (e) => {
            this.props.rename(this.props.projectInfo, e.target.value);
            e.target.blur();
        },
        save: () => {
            const { name, location } = this.props.projectInfo;
            if (location === "example") {
                showSaveAsConfirmI18n({
                    title: "The example project can't be modified. Save as a new project?",
                    onCancel: () => {
                    },
                    onOk: () => {
                        showNameInputI18n({
                            title: 'Save as',
                            defaultValue: name,
                            onOk: (inputName) => {
                                return new Promise(async (resolve, reject) => {
                                    inputName = inputName.trim();
                                    if (inputName.length === 0) {
                                        messageI18n.error("Name can't be empty");
                                        reject();
                                    } else if (isProjectNameExist(this.props.myProjectInfos, inputName)) {
                                        messageI18n.error("Name already occupied");
                                        reject();
                                    } else {
                                        await this.props.saveAs(inputName);
                                        resolve();
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                this.props.save();
            }
        },
        getMenu4file: () => {
            const { t } = this.props;
            return (
                <Menu onClick={this.actions.onMenu4fileClick}>
                    <Menu.Item key="New">{t("New")}</Menu.Item>
                    <Menu.Item key="Save As">{t("Save As")}</Menu.Item>
                    <Menu.Item key="Example Projects">{t("Example Projects")}</Menu.Item>
                    <Menu.Item key="My Projects">{t("My Projects")}</Menu.Item>
                    <Menu.Item key="Open from your computer">{t("Open from your computer")}</Menu.Item>
                    <Menu.Item key="Save to your computer">{t("Save to your computer")}</Menu.Item>
                </Menu>
            )
        }
    };

    render() {
        const { projectInfo } = this.props;
        if (!projectInfo) {
            return null;
        }
        const { t, changeTap } = this.props;
        const state = this.state;
        const actions = this.actions;
        return (
            <Space style={{ height: "100%" }}>
                <input
                    ref={this.fileInput}
                    type="file"
                    accept={CODE_PROJECT_EXTENSION}
                    style={{ display: 'none' }}
                    multiple={false}
                    onChange={actions.openFromYourComputer}
                />
                <h4 style={{ margin: "auto", color: "#eeeeee", marginRight: "10px" }}>Scratch</h4>
                <h4  onClick={() => {
                            changeTap(TAP_HOME);
                        }} 
                        style={{ margin: "auto", color: "#eeeeee", marginRight: "10px" }}>??????</h4>
                <Dropdown overlay={actions.getMenu4file} placement="bottomCenter">
                    <Button
                        size="small"
                        type="primary"
                        style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}
                        icon={<FolderOutlined />}>
                        {t("File")}
                    </Button>
                </Dropdown>
                <Button
                    size="small"
                    type="primary"
                    style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}
                    onClick={actions.save}
                    disabled={projectInfo.isSaved}
                    icon={<SaveOutlined />}>
                    {t("Save")}
                </Button>
                {(!projectInfo.location || projectInfo.location === 'my') &&
                    <Input
                        value={state.name}
                        size="small"
                        onChange={actions.onChangeProjectName}
                        onBlur={actions.rename}
                        onPressEnter={(e) => e.target.blur()}
                        allowClear={true}
                    />
                }
                {projectInfo.location === 'example' &&
                    <div className={styles.div_project_name} onClick={() => {
                        messageI18n.warn("Example project can not rename")
                    }}>{state.name}</div>
                }
                {projectInfo.location === 'pc' &&
                    <Tooltip placement="bottom" title={state.name}>
                        <div className={styles.div_project_name} onClick={() => {
                            messageI18n.warn("Project from your computer can not rename")
                        }}>{state.name}</div>
                    </Tooltip>
                }
            </Space>
        )
    }
}

// let mProjectInfo = null;
const mapStateToProps = (state) => {
    const { vm } = state.code;
    const { projectInfo, myProjectInfos } = state.codeProject;
    return {
        vm,
        projectInfo,
        myProjectInfos
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openModal4exampleProjects: () => dispatch(codeProjectActions.openModal4exampleProjects()),
        openModal4myProjects: () => dispatch(codeProjectActions.openModal4myProjects()),
        openFromYourComputer: (file) => dispatch(codeProjectActions.openFromYourComputer(file)),
        saveAs: (name) => dispatch(codeProjectActions.saveAs(name)),
        save: () => dispatch(codeProjectActions.save()),
        rename: (projectInfo, name) => dispatch(codeProjectActions.rename(projectInfo, name)),
        create: () => dispatch(codeProjectActions.create()),
        changeTap: (value) => dispatch(tapsActions.changeTap(value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Index))


