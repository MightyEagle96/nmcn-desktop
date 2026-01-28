import { app, BrowserWindow, ipcMain, Menu, globalShortcut } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

let mainWindow: BrowserWindow | null = null;
const isDev = process.env.VITE_DEV_SERVER_URL !== undefined;

Menu.setApplicationMenu(null);
function createWindow() {
  mainWindow = new BrowserWindow({
    // width: 1200,
    // height: 800,
    fullscreen: true,
    kiosk: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL!);
    //mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist-electron/index.html"));
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

// Ping server IPC
ipcMain.handle("ping-server", async (_, ip: string) => {
  console.log(`Pinging server at ${ip}`);
  return true; // TODO: implement real REST call
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//app.whenReady().then(createWindow);
app.whenReady().then(async () => {
  createWindow();

  if (!app.isPackaged) {
    (async () => {
      // ← Wrap in async IIFE
      try {
        const installExtension = (await import("electron-devtools-installer"))
          .default;

        await installExtension(REACT_DEVELOPER_TOOLS, {
          loadExtensionOptions: { allowFileAccess: true },
        });
        await installExtension(REDUX_DEVTOOLS, {
          loadExtensionOptions: { allowFileAccess: true },
        });

        console.log("DevTools installed");
      } catch (err) {
        console.error("Failed to install devtools:", err);
      }
    })();
  }

  globalShortcut.register("Control+Shift+D", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.webContents.toggleDevTools();
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
