const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Disable GPU acceleration issues on some systems
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('no-sandbox');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'DOOM — GLOBAL THREAT INTELLIGENCE',
    backgroundColor: '#020a04',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allow CORS proxy requests
    },
    frame: true,
    titleBarStyle: 'default',
  });

  mainWindow.loadFile('index.html');

  // Custom menu
  const menuTemplate = [
    {
      label: 'DOOM',
      submenu: [
        { label: 'Refresh Intel', accelerator: 'F5', click: () => mainWindow.reload() },
        { type: 'separator' },
        { label: 'Toggle DevTools', accelerator: 'F12', click: () => mainWindow.webContents.toggleDevTools() },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Ctrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'VIEW',
      submenu: [
        { label: 'Toggle Fullscreen', accelerator: 'F11', click: () => mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
        { label: 'Zoom In', accelerator: 'Ctrl+=', click: () => mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 0.5) },
        { label: 'Zoom Out', accelerator: 'Ctrl+-', click: () => mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 0.5) },
        { label: 'Reset Zoom', accelerator: 'Ctrl+0', click: () => mainWindow.webContents.setZoomLevel(0) },
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
