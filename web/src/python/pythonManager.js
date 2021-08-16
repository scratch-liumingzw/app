import socketClientManager from "../socket/socketClientManager.js"
import { RUN_PYTHON_STRING, RUN_PYTHON_RESULTS, RUN_PYTHON_ERR, RUN_PYTHON_FINISHED } from "../constants.js";

// example code:
// pythonManager.runString(
//     `x=1+1;print(x);print(x+1);print(x+3);`,
//     (results) => {
//         console.log("#python results", results)
//     },
//     () => {
//         console.log("#python finish")
//     },
//     (err) => {
//         console.log("#python err", err)
//     }
// )

class PythonManager {
    constructor() {
    }

    runString(string, onResults, onFinished, onErr) {
        socketClientManager.emitToServer(RUN_PYTHON_STRING, { string });

        socketClientManager.addServerListener(RUN_PYTHON_RESULTS, ({ results }) => {
            onResults(results);
        });

        socketClientManager.addServerListener(RUN_PYTHON_FINISHED, () => {
            socketClientManager.removeAllServerListener(RUN_PYTHON_RESULTS);
            socketClientManager.removeAllServerListener(RUN_PYTHON_FINISHED);
            socketClientManager.removeAllServerListener(RUN_PYTHON_ERR);
            onFinished();
        });

        socketClientManager.addServerListener(RUN_PYTHON_ERR, ({ err }) => {
            socketClientManager.removeAllServerListener(RUN_PYTHON_RESULTS);
            socketClientManager.removeAllServerListener(RUN_PYTHON_FINISHED);
            socketClientManager.removeAllServerListener(RUN_PYTHON_ERR);
            onErr(err);
        });
    }
}

const pythonManager = new PythonManager();

export default pythonManager;
