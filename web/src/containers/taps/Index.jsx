import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.css';
import Code from '../code/Index.jsx';
import { actions as hotKeysActions } from "../../reducers/hotKeys";
import { actions as serialPortActions } from "../../reducers/serialPort";
import { actions as codeActions } from "../../reducers/code";
import { actions as codeProjectActions } from "../../reducers/codeProject";
import { actions as socketActions } from "../../reducers/socket";
import { actions as tapsActions } from "../../reducers/taps"


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.props.init();
    }

    actions = {
        changeTap: (tap) => {
            this.props.changeTap(tap);
        }
    };

    componentDidMount() {
        // disabled select text on document
        document.onselectstart = () => {
            return false;
        };
    }

    render() {
        const { changeTap } = this.actions;
        const { tap } = this.props;
        return (
            <div>
                <div className={styles.div_workspace}>
                    <Code />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { tap } = state.taps;
    const { status } = state.socket;
    return {
        tap,
        status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeTap: (value) => dispatch(tapsActions.changeTap(value)),
        init: () => {
            dispatch(socketActions.init()); // must execute first
            dispatch(hotKeysActions.init());
            dispatch(serialPortActions.init());
            dispatch(codeActions.init());
            dispatch(codeProjectActions.init());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
