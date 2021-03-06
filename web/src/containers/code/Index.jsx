import React from 'react';
import Workspace from "./ui/workspace/Index.jsx";
import ProjectsModal from "./ui/projects-modal/Index.jsx";
import Menu from "./ui/menu/Menu.jsx";
import styles from './styles.css';

class Index extends React.Component {
    render() {
        return (
            <>
                <div className={styles.div_menu}>
                    <Menu />
                </div>
                <div className={styles.div_workspace}>
                    <Workspace />
                </div>
                <ProjectsModal />
            </>
        )
    }
}

export default Index;
