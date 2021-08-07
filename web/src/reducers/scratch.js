import VM from 'scratch-vm';
import defaultProjectJson from "./default_sc_project.json";

const ACTION_UPDATE_STATE = 'code/ACTION_UPDATE_STATE';

const INITIAL_STATE = {
    vm: null,
    running: false,
    variables: [] //item={visible, id, value, name}
};

const generateGcode = (blockName, args) => {
    switch (blockName) {
        //rs motion
        case "RS_MOTION_SAY_HELLO":
            return ['M1112', 'G91', 'G1 Z20', 'G1 Z-20', 'G1 Z0', 'G90'].join("\n");
        case "RS_MOTION_MOVE_HOME":
            return 'M1112';
        case "RS_MOTION_MOVE_ORIGIN":
            return 'G1 X0 Y0 Z0';
        case "RS_MOTION_MOVE_POSITION": {
            const { VALUE1, VALUE2, VALUE3 } = args;
            return `G1 X${VALUE1} Y${VALUE2} Z${VALUE3}`;
        }
        case "RS_MOTION_MOVE_RELATIVE": {
            const { VALUE1, VALUE2, VALUE3 } = args;
            const moveCmd = `G1 X${VALUE1} Y${VALUE2} Z${VALUE3}`;
            return ['G91', moveCmd, 'G90'].join("\n");
        }
        case "RS_MOTION_MOVE_RECTANGLE": {
            const { VALUE1: anchor, VALUE2: width, VALUE3: height } = args;
            let moveCmd = null;
            switch (anchor) {
                case 'left-top':
                    moveCmd = [
                        `G1 Y${height}`,
                        `G1 X${-width}`,
                        `G1 Y${-height}`,
                        `G1 X${width}`
                    ].join("\n");
                    break;
                case 'left-bottom':
                    moveCmd = [
                        `G1 Y${-height}`,
                        `G1 X${-width}`,
                        `G1 Y${height}`,
                        `G1 X${width}`
                    ].join("\n");
                    break;
                case 'right-top':
                    moveCmd = [
                        `G1 Y${height}`,
                        `G1 X${width}`,
                        `G1 Y${-height}`,
                        `G1 X${-width}`
                    ].join("\n");
                    break;
                case 'right-bottom':
                    moveCmd = [
                        `G1 Y${-height}`,
                        `G1 X${width}`,
                        `G1 Y${height}`,
                        `G1 X${-width}`
                    ].join("\n");
                    break;
            }
            return ['G91', moveCmd, 'G90'].join("\n");
        }
        case "RS_MOTION_MOVE_CIRCLE": {
            const { VALUE1: anchor, VALUE2: radius } = args;
            switch (anchor) {
                case 'left':
                    return `G2 I${-radius} J0`;
                case 'right':
                    return `G2 I${radius} J0`;
                case 'top':
                    return `G2 I0 J${radius}`;
                case 'bottom':
                    return `G2 I0 J${-radius}`;
                default:
                    return null;
            }
        }
        case "RS_MOTION_ROTATE_WRIST": {
            const { VALUE1: direction, VALUE2: degree } = args;
            switch (direction) {
                case 'clockwise':
                // return `G2 I${-degree} J0`;
                case 'anticlockwise':
                // return `G2 I${degree} J0`;
                default:
                    return null;
            }
        }

        //rs module
        case "RS_FRONT_END_AIR_PICKER": {
            const { VALUE1: status } = args;
            switch (status) {
                case 'pick':
                    return 'M1000';
                case 'release':
                    return 'M1002';
                case 'off':
                    return 'M1003';
                default:
                    return null;
            }
        }
        case "RS_FRONT_END_SOFT_GRIPPER": {
            const { VALUE1: status } = args;
            switch (status) {
                case 'grip':
                    return 'M1001';
                case 'release':
                    return 'M1000';
                case 'neutral':
                    return 'M1002';
                case 'off':
                    return 'M1003';
                default:
                    return null;
            }
        }

        //rs settings
        case "RS_SETTINGS_SELECT_FRONT_END": {
            const { VALUE1: module } = args;
            switch (module) {
                case 'pen holder':
                    return 'M888 P0';
                case 'air picker':
                case 'soft gripper':
                    return 'M888 P2';
                default:
                    return null;
            }
        }
        case "RS_SETTINGS_SET_SPEED": {
            const { VALUE1: speed } = args;
            return `G1 F${speed}`;
        }
        case "RS_SETTINGS_SET_ACCELERATION": {
            const { VALUE1: prt, VALUE2: acceleration } = args;
            switch (prt) {
                case 'printing':
                    return `M204 P${acceleration}`;
                case 'retract':
                    return `M204 R${acceleration}`;
                case 'travel':
                    return `M204 T${acceleration}`;
                default:
                    return null;
            }
        }
        case "RS_SETTINGS_SET_MOTION_MODE": {
            const { VALUE1: mode } = args;
            switch (mode) {
                case 'fast':
                    return 'M2001';
                case 'linear':
                    return 'M2000';
                default:
                    return null;
            }
        }
        case "RS_SETTINGS_SET_WORK_ORIGIN":
            return "G92 X0 Y0 Z0";

        //rs sensing
        case "RS_SENSING_CURRENT_POSITION":
            return "M114";
        case "RS_SENSING_CURRENT_ACCELERATION":
            return "M204";
        case "RS_SENSING_CURRENT_SPEED":
            return null;

        //rs sliding rail
        case "RS_SLIDING_RAIL_MOVE": {
            const { VALUE1: direction, VALUE2: distance, VALUE3: speed } = args;
            switch (direction) {
                case 'forward':
                    return ['G91', `G1 E${distance} F${speed}`, 'G90'].join("\n");
                case 'backward':
                    return ['G91', `G1 E${-distance} F${speed}`, 'G90'].join("\n");
                default:
                    return null;
            }
        }
        case "RS_SLIDING_RAIL_MOVE_TO_ORIGIN":
            return 'M2005';

        //rs conveyor belt
        case "RS_CONVEYOR_BELT_MOVE":
            const { VALUE1: direction, VALUE2: speed } = args;
            switch (direction) {
                case 'forward':
                    return `M2012 F${speed} D0`;
                case 'backward':
                    return `M2012 F${speed} D1`;
                default:
                    return null;
            }
        case "RS_CONVEYOR_BELT_STOP":
            return 'M2013';
    }
    return null;
};

export const actions = {
    _updateState: (state) => {
        return {
            type: ACTION_UPDATE_STATE,
            state
        };
    },
    loadEmptyProject: () => (dispatch, getState) => {
        getState().code.vm.loadProject(defaultProjectJson);
        return { type: null };
    },
    init: () => (dispatch, getState) => {
        const vm = new VM();
        dispatch(actions._updateState({ vm }));
        vm.start();
        // 为了正常使用blocks，至少load一个project，保证至少有一个target
        // 为了方便，直接生成一个默认的项目，json格式，加载即可
        // default_sc_project.json的生成：使用官方的scratch-gui，const json = vm.toJSON();
        //参考：scratch-gui/lib/vm-listener-hoc.jsx
        vm.loadProject(defaultProjectJson);
        document.addEventListener('keydown', (e) => {
            // Don't capture keys intended for Blockly inputs.
            if (e.target !== document && e.target !== document.body) return;
            vm.postIOData('keyboard', {
                keyCode: e.keyCode,
                key: e.key,
                isDown: true
            });
            // Prevent space/arrow key from scrolling the page.
            if (e.keyCode === 32 || // 32=space
                (e.keyCode >= 37 && e.keyCode <= 40)) { // 37, 38, 39, 40 are arrows
                e.preventDefault();
            }
        });
        document.addEventListener('keyup', (e) => {
            // Always capture up events,
            // even those that have switched to other targets.
            vm.postIOData('keyboard', {
                keyCode: e.keyCode,
                key: e.key,
                isDown: false
            });
            // E.g., prevent scroll.
            if (e.target !== document && e.target !== document.body) {
                e.preventDefault();
            }
        });
        vm.on(
            'PROJECT_RUN_START',
            () => {
                dispatch(actions._updateState({ running: true }));
            }
        );
        vm.on(
            'PROJECT_RUN_STOP',
            () => {
                dispatch(actions._updateState({ running: false }));
            }
        );
        vm.on(
            'PROJECT_CHANGED',
            () => {
                //TODO: move to codeProject
                // dispatch(codeProjectActions.onProjectChanged());
            }
        );
        //not be called back if the visible of variables are all false
        //TODO: bug-fix, visible is true when a new variable first added, but checkbox is false in tool-box
        vm.on(
            'MONITORS_UPDATE',
            (monitorList) => {
                //variable count: monitorList._list._tail.array.length
                const variables = [];
                const array = monitorList._list._tail.array;
                for (let i = 0; i < array.length; i++) {
                    const { visible, id, value, params } = array[i][1];
                    const name = params.VARIABLE; //for example: 我的变量
                    variables.push({ visible, id, value, name })
                }
                dispatch(actions._updateState({ variables }));
            }
        );
    }
};

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ACTION_UPDATE_STATE: {
            return Object.assign({}, state, action.state);
        }
        default:
            return state;
    }
}
