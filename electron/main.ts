import { app, BrowserWindow, Menu, globalShortcut } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-devtools-installer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

let mainWindow: BrowserWindow | null = null;

// Remove default menu
Menu.setApplicationMenu(null);

const isDev = process.env.VITE_DEV_SERVER_URL !== undefined;

const preloadPath = isDev
  ? path.join(__dirname, "preload.mjs") // during dev, file exists in dist-electron
  : path.join(
      process.resourcesPath,
      "app.asar",
      "dist-electron",
      "preload.mjs",
    );

const rendererPath = isDev
  ? VITE_DEV_SERVER_URL!
  : path.join(process.resourcesPath, "app.asar", "dist", "index.html");

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    icon: path.join(__dirname, "../../build/icon.ico"),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL(rendererPath);
  } else {
    mainWindow.loadFile(rendererPath);
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// IPC Example: ping server

// App Events
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(async () => {
  createWindow();

  // DevTools installation only in dev
  // if (isDev) {
  //   try {
  //     const installExtension = (await import("electron-devtools-installer"))
  //       .default;

  //     await installExtension(REACT_DEVELOPER_TOOLS, {
  //       loadExtensionOptions: { allowFileAccess: true },
  //     });
  //     await installExtension(REDUX_DEVTOOLS, {
  //       loadExtensionOptions: { allowFileAccess: true },
  //     });

  //     console.log("React & Redux DevTools installed");
  //   } catch (err) {
  //     console.error("Failed to install DevTools:", err);
  //   }
  // }

  // // Shortcut: toggle DevTools with Ctrl+Shift+D
  // globalShortcut.register("Control+Shift+D", () => {
  //   const win = BrowserWindow.getFocusedWindow();
  //   if (win) win.webContents.toggleDevTools();
  // });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
