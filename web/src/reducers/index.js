import { combineReducers } from 'redux';
import hotKeys from "./hotKeys";
import projectEdit from "./projectEdit";
import projectManage from "./projectManage";
import router from "./router";
import socket from "./socket";

export default combineReducers({
    hotKeys,
    projectEdit,
    projectManage,
    router,
    socket
});