import { combineReducers } from 'redux';
import hotKeys from "./hotKeys";
import serialPort from "./serialPort";
import socket from "./socket";
import taps from "./taps";
import code from "./code";
import codeProject from "./codeProject";
import header from "./header";

export default combineReducers({
    hotKeys,
    serialPort,
    socket,
    taps,
    code,
    codeProject,
    header,
});
