import React from 'react';
import { Modal, Row, Col } from 'antd';
import InputString from "../InputString/index.jsx";

// 项目参数输入框：name
export default ({
    title,
    name,
    okText,
    cancelText,
    onOk,
    onCancel
}) => {
    let _name = name;
    Modal.confirm({
        title,
        width: 500,
        centered: true,
        content: (
            <Row>
                <Col span={12}>
                    <InputString
                        value={name}
                        onAfterChange={value => {
                            _name = value;
                        }}
                    />
                </Col>
            </Row>
        ),
        okText,
        cancelText,
        onOk() {
            return onOk(_name.trim())
        },
        onCancel() {
            return onCancel()
        }
    })
};




