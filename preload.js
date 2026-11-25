const { contextBridge, ipcRenderer } = require('electron');

// Puente mínimo y seguro entre la app de escritorio y la página del juego
contextBridge.exposeInMainWorld('desktop', {
  platform: process.platform,
  onCommand: callback => {
    ipcRenderer.on('command', (_event, cmd) => callback(cmd));
  },
});
