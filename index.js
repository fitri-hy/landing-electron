const { app, BrowserWindow } = require('electron');
const childProcess = require('child_process');
const path = require('path');

let serverProcess;

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL('http://localhost:3000');

  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  serverProcess = childProcess.fork(path.join(__dirname, 'server.js'));

  serverProcess.on('message', (message) => {
    if (message === 'server-listening') {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
