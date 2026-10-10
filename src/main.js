const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const dataFile = () => path.join(app.getPath('userData'), 'tasks.json');

function loadTasks() {
  try {
    return JSON.parse(fs.readFileSync(dataFile(), 'utf8'));
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(dataFile(), JSON.stringify(tasks, null, 2));
}

ipcMain.handle('tasks:load', () => loadTasks());
ipcMain.handle('tasks:save', (_e, tasks) => saveTasks(tasks));

function createWindow() {
  const win = new BrowserWindow({
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    width: 560,
    height: 640,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, '..', 'build', 'icon.png'));
  }
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
