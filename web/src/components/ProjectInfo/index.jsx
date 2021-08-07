import React from 'react';
import { timestamp2date } from '../../utils/index.js';
import styles from './styles.css';

// props(required): project, isSelected, onSelect
class Index extends React.PureComponent {
    render() {
        const { project, isSelected, onSelect } = this.props;
        const { data, filepath, birthtimeMs, mtimeMs } = project;
        const { name, width, height } = data;
        return (
            <div
                style={{ height: "250px", width: "250px", margin: "5px", display: "inline-block" }}
                className={isSelected ? styles.div_project_selected : styles.div_project}
                onClick={() => {
                    onSelect(project);
                }}
            >
                <p className={styles.p_project_info}>{`项目名称: ${name}`}</p>
                <p className={styles.p_project_info}>{`宽度: ${width}`}</p>
                <p className={styles.p_project_info}>{`高度: ${height}`}</p>
                <p className={styles.p_project_info}>{`创建时间: ${timestamp2date(birthtimeMs)}`}</p>
                <p className={styles.p_project_info}>{`最近修改: ${timestamp2date(mtimeMs)}`}</p>
            </div>
        );
    }
}

export default Index;
