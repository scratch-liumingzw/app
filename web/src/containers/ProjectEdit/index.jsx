import React from 'react';
import Header from "./Header.jsx";
import Workspace from './Workspace.jsx';
import { Z_INDEX_NORMAL } from '../../constants.js';

class Index extends React.Component {
    render() {
        return (
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: 999 }}>
                <div style={{ position: "absolute", top: 0, right: 0, left: 0, height: "50px", backgroundColor: "#b0b0b0", zIndex: Z_INDEX_NORMAL }}>
                    <Header />
                </div>
                <div style={{ position: "absolute", top: "50px", right: "200px", bottom: 0, left: "200px", backgroundColor: "#ffa0a0" }}>
                    <Workspace />
                </div>
            </div>
        )
    }
}

export default Index;