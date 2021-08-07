import React from 'react';
import { InputNumber } from 'antd';

// props(required): value, onAfterChange(value)
class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            displayedValue: 0
        };
        this.actions = {
            onPressEnter: (e) => {
                e.target.blur();
            },
            onBlur: (e) => {
                const min = parseFloat(e.target.min);
                const max = parseFloat(e.target.max);
                let value = parseFloat(this.state.displayedValue);
                if (isNaN(value)) {
                    value = this.props.value;
                }
                if (value > max) {
                    value = max;
                } else if (value < min) {
                    value = min;
                }
                this.setState({ displayedValue: value });
                this.props.onAfterChange(value);
            },
            onChange: (value) => {
                this.setState({ displayedValue: value });
            }
        };
    }

    componentDidMount() {
        this.setState({ displayedValue: this.props.value });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({ displayedValue: nextProps.value });
        }
    }

    render() {
        const state = this.state;
        // https://ant.design/components/input-number-cn/
        const { min = -99999, max = 99999, precision = 0 } = this.props;
        const actions = this.actions;
        const step = 1 / Math.pow(10, precision);
        return (
            <InputNumber
                style={{ width: "100%", fontSize: "12px" }}
                step={step}
                min={min}
                max={max}
                value={state.displayedValue}
                precision={precision}
                onChange={actions.onChange}
                onBlur={actions.onBlur}
                onPressEnter={actions.onPressEnter}
            />
        );
    }
}

export default Index;
