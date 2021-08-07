import React from 'react';
import { Button, Row, Modal, message } from 'antd';
import styles from './styles.css';
import showStringInputModal from "../../../components/Modals/showStringInputModal.jsx";
import { cloneDeep } from '../../../utils';
import blankProject from "../../../blankProject.json";
import ProjectInfo from "../../../components/ProjectInfo/index.jsx";

/**
 * 新建项目 modal
 * 包含：基于空白项目新建；基于已有项目新建
 * props: visible, projects, onConfirm(event), onCancel
 */
class Index extends React.Component {
    state = {
        project: null //selected project
    };

    actions = {
        onSelectProject: (project) => {
            this.setState({ project })
        },
        onClickCancel: () => {
            this.props.onCancel();
        },
        onClickConfirm: () => {
            const { project } = this.state;
            const name = `新建项目 ${new Date().toLocaleDateString()}`;
            showStringInputModal({
                title: "项目名称",
                name,
                okText: "新建",
                cancelText: "取消",
                onOk: (newName) => {
                    if (newName.length === 0) {
                        message.warning('项目名称不能为空');
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
        }
    };

    render() {
        const state = this.state;
        const actions = this.actions;
        const props = this.props;
        return (
            <Modal
                title={"选择模版"}
                closable={false}
                visible={props.visible}
                centered={true}
                width={"80%"}
                footer={[
                    <Button
                        ghost
                        key="1"
                        type="primary"
                        size="small"
                        onClick={actions.onClickCancel}>
                        {"取消"}
                    </Button>,
                    <Button
                        ghost
                        key="2"
                        key="Create"
                        type="primary"
                        size="small"
                        disabled={!state.project}
                        onClick={actions.onClickConfirm}>
                        {"新建"}
                    </Button>
                ]}
            >
                <Row gutter={[20, 20]}>
                    <div
                        style={{ height: "250px", width: "250px", margin: "5px", display: "inline-block" }}
                        className={state.project === blankProject ? styles.div_project_selected : styles.div_project}
                        onClick={event => {
                            event.stopPropagation();
                            actions.onSelectProject(blankProject)
                        }}>
                        <p className={styles.p_project_info}>{"空白模版"}</p>
                    </div>
                    {
                        props.projects.map((item, index) => {
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

export default Index;
