const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Cria a janela principal
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'script.js') // Carrega o teu script JS aqui (se necessário)
    },
    icon: path.join(__dirname, './img/logo_ciber.webp') // Altera para o caminho do ícone da tua app
  });

  // Carrega o ficheiro HTML principal
  win.loadFile('index.html');
}

// Quando Electron estiver pronto, cria a janela
app.whenReady().then(createWindow);

// Fecha a aplicação quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Reabre a janela se ela for fechada no macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
