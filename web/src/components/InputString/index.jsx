import React from 'react';
import { Input } from 'antd';

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
                const value = e.target.value;
                this.setState({ displayedValue: value });
                this.props.onAfterChange(value);
            },
            onChange: (e) => {
                const value = e.target.value;
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
        const actions = this.actions;
        const { value, onAfterChange, ...options } = this.props;
        return (
            <Input
                value={state.displayedValue}
                onChange={actions.onChange}
                onBlur={actions.onBlur}
                onPressEnter={actions.onPressEnter}
                {...options}
            />
        );
    }
}

export default Index;
