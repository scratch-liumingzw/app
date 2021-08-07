import startServer from "./startServer.js";

// error occur only in electron: setImmediate is not defined
// https://github.com/electron/electron/issues/2984
const _setImmediate = setImmediate;
process.once('loaded', () => {
    global.setImmediate = _setImmediate;
});

startServer();