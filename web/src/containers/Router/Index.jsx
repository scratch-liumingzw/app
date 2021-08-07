import React from 'react';
import { connect } from 'react-redux';
import { Button, Space } from 'antd';
import { actions as routerActions } from "../../reducers/router"
import { ROUTE_PROJECT_MANAGE, ROUTE_GESTURE, ROUTE_VOICE } from "../../constants.js";
import commonStyles from '../commonStyles.css';

class Index extends React.Component {
    actions = {
        onClickGesture: () => {
            this.props.setRoute(ROUTE_GESTURE);
        },
        onClickVoice: () => {
            this.props.setRoute(ROUTE_VOICE);
        },
        onClickScratch: () => {
            this.props.setRoute(ROUTE_PROJECT_MANAGE);
        }
    }

    render() {
        const actions = this.actions;
        return (
            <div className={commonStyles.div_fill_parent}>
                <Space direction={"horizontal"} style={{ width: "60%", height: "100%" }}>
                    <Button onClick={actions.onClickGesture}>
                        {"手势模仿"}
                    </Button>
                    <Button onClick={actions.onClickVoice}>
                        {"语音交互"}
                    </Button>
                    <Button onClick={actions.onClickScratch}>
                        {"创新编辑"}
                    </Button>
                </Space>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setRoute: (route) => dispatch(routerActions.setRoute(route)),
    };
};

export default connect(null, mapDispatchToProps)(Index);