import { ROUTE_GESTURE, ROUTE_VOICE, ROUTE_PROJECT_MANAGE, ROUTE_ROUTER, ROUTE_PROJECT_EDIT } from "../constants.js";

const ACTION_UPDATE_STATE = 'router/ACTION_UPDATE_STATE';

const INITIAL_STATE = {
    route: ROUTE_PROJECT_EDIT
};

const actions = {
    _updateState: (state) => {
        return { type: ACTION_UPDATE_STATE, state };
    },
    setRoute: (route) => (dispatch) => {
        switch (route) {
            case ROUTE_GESTURE:
                break;
            case ROUTE_VOICE:
                break;
            default:
                dispatch(actions._updateState({ route }));
        }
    },
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ACTION_UPDATE_STATE:
            return Object.assign({}, state, action.state);
        default:
            return state;
    }
};

export { actions };
export default reducer;