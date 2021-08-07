import React from 'react';
import { connect } from 'react-redux';
import ProjectEdit from "./ProjectEdit/index.jsx";
import ProjectManage from "./ProjectManage/index.jsx";
import Router from "./Router/index.jsx";
import { actions as hotKeysActions } from "../reducers/hotKeys";
import { actions as projectManageActions } from "../reducers/projectManage";
import { actions as projectEditActions } from "../reducers/projectEdit";
import { actions as socketActions } from "../reducers/socket";
import { ROUTE_PROJECT_MANAGE, ROUTE_PROJECT_EDIT, ROUTE_ROUTER } from "../constants.js";
import styles from './styles.css';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.props.init();
    }

    render() {
        const { route } = this.props;
        return (
            <>
                <div className={route === ROUTE_ROUTER ? styles.div_visible : styles.div_hidden}>
                    <Router />
                </div>
                <div className={route === ROUTE_PROJECT_MANAGE ? styles.div_visible : styles.div_hidden}>
                    <ProjectManage />
                </div>
                <div className={route === ROUTE_PROJECT_EDIT ? styles.div_visible : styles.div_hidden}>
                    <ProjectEdit />
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const { route } = state.router;
    return {
        route
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        init: () => {
            dispatch(projectManageActions.readMyProjects());
            dispatch(projectManageActions.readTemplateProjects());
            dispatch(socketActions.init());
            dispatch(hotKeysActions.init());
            dispatch(projectEditActions.init());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);