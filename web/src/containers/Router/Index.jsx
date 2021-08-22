import React from 'react';
import { connect } from 'react-redux';
import { Button, Space } from 'antd';
import { CodeOutlined, VideoCameraOutlined, SoundOutlined } from '@ant-design/icons';
import { actions as routerActions } from "../../reducers/router"
import { ROUTE_SCRATCH, ROUTE_GESTURE, ROUTE_VOICE } from "../../constants.js";
import commonStyles from '../commonStyles.css';
import styles from './styles.css';

class Index extends React.Component {
    actions = {
        onClickGesture: () => {
            this.props.setRoute(ROUTE_GESTURE);
        },
        onClickVoice: () => {
            this.props.setRoute(ROUTE_VOICE);
        },
        onClickScratch: () => {
            this.props.setRoute(ROUTE_SCRATCH);
        }
    }

    render() {
        const actions = this.actions;
        const buttonStyle = {
            width: "220px",
            height: "100px",
            fontSize: "35px",
            borderRadius: "5px"
        }
        return (
            <div className={commonStyles.div_fill_parent}>
                <Space
                    size={100}
                    direction={"horizontal"}
                    className={styles.container_router}
                >
                    <Button
                        style={buttonStyle}
                        onClick={actions.onClickGesture}
                        type="primary"
                        icon={<VideoCameraOutlined />}>
                        {"手势模仿"}
                    </Button>
                    <Button
                        style={buttonStyle}
                        onClick={actions.onClickVoice}
                        type="primary"
                        icon={<SoundOutlined />}>
                        {"语音交互"}
                    </Button>
                    <Button
                        style={buttonStyle}
                        onClick={actions.onClickScratch}
                        type="primary"
                        icon={<CodeOutlined />}>
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