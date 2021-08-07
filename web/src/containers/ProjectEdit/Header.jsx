import React from 'react';
import { connect } from 'react-redux';
import { Space, Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { actions as projectEditActions } from "../../reducers/projectEdit";
import { actions as routerActions } from "../../reducers/router";
import { ROUTE_PROJECT_MANAGE } from "../../constants.js";
import { timestamp2date } from '../../utils/index.js';

class Index extends React.Component {
    actions = {
        onClickBack: () => {
            if (this.props.saved) {
                this.props.clearWorkspace();
                this.props.setRoute(ROUTE_PROJECT_MANAGE);
            } else {
                Modal.confirm({
                    title: '项目有修改',
                    icon: <ExclamationCircleOutlined />,
                    okText: "放弃修改",
                    okType: "danger",
                    onOk: () => {
                        this.props.clearWorkspace();
                        this.props.setRoute(ROUTE_PROJECT_MANAGE);
                    },
                    cancelText: "保存修改",
                    onCancel: async () => {
                        await this.props.saveProject();
                        this.props.clearWorkspace();
                        this.props.setRoute(ROUTE_PROJECT_MANAGE);
                    }
                });
            }
        },
        onClickSave: () => {
            this.props.saveProject();
        }
    }

    render() {
        if (!this.props.project) {
            return null;
        }

        const actions = this.actions;
        const props = this.props;
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <Space style={{ width: "100%" }} size={20}>
                    <Button ghost
                        type="primary"
                        size="small"
                        onClick={actions.onClickBack} >
                        返回
                    </Button>
                    <Button
                        ghost
                        type="primary"
                        size="small"
                        disabled={props.saved}
                        onClick={actions.onClickSave}>
                        保存项目
                    </Button>
                    <p>{props.saved ? "已保存" : "未保存"}</p>
                    <p>{`名称: ${props.project.data.name}`}</p>
                    <p>{`上一次保存时间: ${timestamp2date(props.project.mtimeMs)}`}</p>
                </Space>
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    const { project, saved } = state.projectEdit;
    return {
        project,
        saved,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setRoute: (route) => dispatch(routerActions.setRoute(route)),
        saveProject: () => dispatch(projectEditActions.saveProject()),
        clearWorkspace: () => dispatch(projectEditActions.clearWorkspace()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);