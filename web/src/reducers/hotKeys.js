import hotKeys from 'hotkeys-js';
import { TAP_LASER, TAP_P3D, TAB_WRITE_DRAW } from "../constants.js";

const actions = {
    init: () => (dispatch, getState) => {
        hotKeys('backspace,del', (event) => {
            event.preventDefault();
            switch (getState().taps.tap) {
                case TAP_P3D:
                    break;
                case TAP_LASER:
                    break;
                case TAB_WRITE_DRAW:
            }
        });
    }
};

const reducer = () => {
    return {};
};

export { actions };
export default reducer;
