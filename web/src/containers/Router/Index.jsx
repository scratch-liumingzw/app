import React from 'react';
import { connect } from 'react-redux';
import { Button, Space } from 'antd';
import { actions as routerActions } from "../../reducers/router"
import { ROUTE_PROJECT_MANAGE, ROUTE_GESTURE, ROUTE_VOICE } from "../../constants.js";

class Index extends React.Component {
    render() {
        const props = this.props;
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <Space direction={"horizontal"} style={{ width: "60%", height: "100%" }}>
                    <Button
                        onClick={() => {
                            props.setRoute(ROUTE_GESTURE);
                        }}
                    >
                        {"手势模仿"}
                    </Button>
                    <Button
                        onClick={() => {
                            props.setRoute(ROUTE_VOICE);
                        }}
                    >
                        {"语音交互"}
                    </Button>
                    <Button
                        onClick={() => {
                            props.setRoute(ROUTE_PROJECT_MANAGE);
                        }}
                    >
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