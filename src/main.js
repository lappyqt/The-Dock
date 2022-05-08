const electron = require('electron');
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const exec = require('child_process').execFile;

app.on('ready', createMainWindow);

function createMainWindow() {
    const display = electron.screen.getPrimaryDisplay();
    const width = display.bounds.width;
    const height = display.bounds.height;
    const windowSize = {
        width: 650,
        height: 60
    }

    const mainWindow = new BrowserWindow({
        width: windowSize.width,
        height: windowSize.height,
        frame: false,
        autoHideMenuBar: true,
        transparent: true,
        resizable: false,
        movable: false,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, "preload.js")
        }
    });
    
    globalShortcut.register("Alt+X", () => {
        mainWindow.focus();
    });

    mainWindow.loadFile('./src/web-part/index.html');
    mainWindow.setPosition(width / 2 - windowSize.width / 2, height - windowSize.height - 20);
}

ipcMain.handle('openApp', async (event, path) => {
    exec(path);
});