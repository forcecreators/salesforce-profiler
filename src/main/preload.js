const { contextBridge, ipcRenderer } = require('electron');
const constants = require('../constants.js').default;

contextBridge.exposeInMainWorld('api', {
  open: (callback) => ipcRenderer.send(constants.ipc.OPEN_NEW_LOG, null),
  onOpenEvent: (callback) => {
    ipcRenderer.on(constants.ipc.OPEN_NEW_LOG, callback);
  },
  readLog: (logPath) => {
    return ipcRenderer.sendSync(constants.ipc.READ_LOG_FILE, logPath);
  },
});
