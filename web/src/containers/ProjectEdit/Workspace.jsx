import React from 'react';
import { connect } from 'react-redux';
import { actions as projectEditActions } from "../../reducers/projectEdit";

class Index extends React.Component {
    ref = React.createRef();

    componentDidMount() {
        this.props.setWorkspaceDom(this.ref.current)
    }

    render() {
        const props = this.props;

        let width = "100%";
        let height = "100%";

        if (props.project) {
            width = `${props.project.data.width}px`;
            height = `${props.project.data.height}px`;
        }

        return (
            <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "#000000", overflow: "auto" }}>
                <div
                    ref={this.ref}
                    style={{
                        position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                        width, height,
                        margin: "auto",
                        zoom: props.zoom,
                        backgroundColor: "#e0e0e0"
                    }}
                    onDragOver={e => {
                        e.preventDefault();
                    }}
                    onDrop={e => {
                        const info = JSON.parse(e.dataTransfer.getData("componentInfoStr"));
                        const offsetX = e.dataTransfer.getData("offsetX");
                        const offsetY = e.dataTransfer.getData("offsetY");
                        const rect = this.ref.current.getBoundingClientRect(); //相对于 window 左上角的位置
                        const left = e.clientX - rect.left - offsetX;
                        const top = e.clientY - rect.top - offsetY;
                        props.dropComponentInfoToWorkspace(info, left, top);
                    }}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { project, zoom } = state.projectEdit;
    return {
        project,
        zoom
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setWorkspaceDom: (dom) => dispatch(projectEditActions.setWorkspaceDom(dom)),
        dropComponentInfoToWorkspace: (info, left, top) => dispatch(projectEditActions.dropComponentInfoToWorkspace(info, left, top)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);