import React from 'react';
import { connect } from 'react-redux';
import Blocks from './Blocks.jsx';
import VariableList from './VariableList.jsx';
import styles from './styles.css';
import commonStyles from '../../commonStyles.css';

class Index extends React.Component {
    actions = {
        startVM: () => {
            this.props.vm.greenFlag();
        },
        stopVM: () => {
            this.props.vm.stopAll();
        }
    };

    render() {
        const actions = this.actions;
        const props = this.props;
        return (
            <div className={commonStyles.div_fill_parent}>
                <Blocks />
                <div className={styles.div_variable_list}>
                    <VariableList />
                </div>
                <button disabled={!props.running} onClick={actions.stopVM} className={styles.btn_stop} />
                <button disabled={props.running} onClick={actions.startVM} className={styles.btn_green_flag} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { vm, running } = state.projectEdit;
    return {
        vm,
        running
    };
};

export default connect(mapStateToProps)(Index);

