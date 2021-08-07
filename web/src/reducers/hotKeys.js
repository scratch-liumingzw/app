import hotKeys from 'hotkeys-js';
import { ROUTE_ROUTER } from "../constants.js";

const actions = {
    init: () => (dispatch, getState) => {
        hotKeys('backspace,del', (event) => {
            event.preventDefault();
        });
    }
};

const reducer = () => {
    return {};
};

export { actions };
export default reducer;
