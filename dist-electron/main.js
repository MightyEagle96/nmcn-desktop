import { Menu as a, app as n, BrowserWindow as i, globalShortcut as c } from "electron";
import e from "node:path";
import { fileURLToPath as p } from "node:url";
const t = e.dirname(p(import.meta.url));
process.env.APP_ROOT = e.join(t, "..");
const d = process.env.VITE_DEV_SERVER_URL, E = e.join(process.env.APP_ROOT, "dist-electron"), f = e.join(process.env.APP_ROOT, "dist");
let o = null;
a.setApplicationMenu(null);
const r = process.env.VITE_DEV_SERVER_URL !== void 0, u = r ? e.join(t, "preload.mjs") : e.join(
  process.resourcesPath,
  "app.asar",
  "dist-electron",
  "preload.mjs"
), s = r ? d : e.join(process.resourcesPath, "app.asar", "dist", "index.html");
function l() {
  o = new i({
    fullscreen: !0,
    kiosk: !0,
    icon: e.join(t, "../../build/icon.ico"),
    webPreferences: {
      preload: u,
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), r ? o.loadURL(s) : o.loadFile(s), o.on("closed", () => {
    o = null;
  });
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), o = null);
});
n.on("activate", () => {
  i.getAllWindows().length === 0 && l();
});
n.whenReady().then(async () => {
  l();
});
n.on("will-quit", () => {
  c.unregisterAll();
});
export {
  E as MAIN_DIST,
  f as RENDERER_DIST,
  d as VITE_DEV_SERVER_URL
};
