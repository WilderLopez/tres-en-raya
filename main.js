const { app, BrowserWindow, Menu, nativeTheme, screen, shell } = require('electron');
const path = require('node:path');

const APP_NAME = 'Tres en Raya';
const isMac = process.platform === 'darwin';

app.setName(APP_NAME);

let win = null;

function send(cmd) {
  const target = BrowserWindow.getFocusedWindow() || win;
  target?.webContents.send('command', cmd);
}

function buildMenu() {
  const template = [
    ...(isMac ? [{ role: 'appMenu', label: APP_NAME }] : []),
    {
      label: 'Juego',
      submenu: [
        { label: 'Nueva partida', accelerator: 'CmdOrCtrl+N', click: () => send('new-round') },
        { label: 'Reiniciar marcador', accelerator: 'CmdOrCtrl+Shift+N', click: () => send('reset-score') },
        { type: 'separator' },
        { label: 'Modo: 2 jugadores', accelerator: 'CmdOrCtrl+1', click: () => send('mode:pvp') },
        { label: 'Modo: contra la CPU', accelerator: 'CmdOrCtrl+2', click: () => send('mode:cpu') },
        ...(isMac ? [] : [{ type: 'separator' }, { role: 'quit', label: 'Salir' }]),
      ],
    },
    {
      label: 'Ventana',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'togglefullscreen', label: 'Pantalla completa' },
        ...(isMac ? [{ type: 'separator' }, { role: 'front', label: 'Traer todo al frente' }] : [{ role: 'close', label: 'Cerrar' }]),
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  // Altura ideal 880 px, pero nunca más alta que la pantalla (portátiles pequeños)
  const workHeight = screen.getPrimaryDisplay().workAreaSize.height;
  const height = Math.max(680, Math.min(880, workHeight - 60));

  win = new BrowserWindow({
    width: 480,
    height,
    minWidth: 400,
    minHeight: 680,
    useContentSize: true,
    title: APP_NAME,
    show: false,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#16151b' : '#f4f1ec',
    autoHideMenuBar: true, // Windows: el menú aparece al pulsar Alt
    ...(isMac ? { titleBarStyle: 'hiddenInset' } : {}),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.once('ready-to-show', () => win.show());

  // Seguridad: el juego nunca navega ni abre ventanas nuevas
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', e => e.preventDefault());

  win.on('closed', () => { win = null; });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    if (isMac) {
      app.setAboutPanelOptions({ applicationName: APP_NAME, applicationVersion: app.getVersion() });
    }
    buildMenu();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (!isMac) app.quit();
  });
}
