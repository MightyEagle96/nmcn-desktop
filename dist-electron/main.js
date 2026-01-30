import { app as o, Menu as w, BrowserWindow as p, globalShortcut as m } from "electron";
import r from "path";
import { fileURLToPath as E } from "node:url";
import { execSync as R } from "node:child_process";
import { exec as S } from "child_process";
const c = r.dirname(E(import.meta.url));
process.env.APP_ROOT = r.join(c, "..");
const v = process.env.VITE_DEV_SERVER_URL, b = r.join(process.env.APP_ROOT, "dist-electron"), y = r.join(process.env.APP_ROOT, "dist");
let e = null;
const _ = o.requestSingleInstanceLock();
_ ? o.on("second-instance", () => {
  e && (e.isMinimized() && e.restore(), e.focus());
}) : o.quit();
function P() {
  try {
    const t = R("wmic computersystem get model,manufacturer", {
      encoding: "utf8"
    }).toLowerCase();
    return t.includes("vmware") || t.includes("virtualbox") || t.includes("qemu") || t.includes("hyper-v") || t.includes("kvm");
  } catch {
    return !1;
  }
}
const i = /* @__PURE__ */ new Set();
function f() {
  S(
    'powershell -Command "Get-Disk | Where-Object BusType -eq USB | Select-Object -ExpandProperty Number"',
    (s, t) => {
      if (s) {
        console.error("PowerShell error:", s);
        return;
      }
      const a = t.trim();
      if (!a) return;
      const u = new Set(
        a.split(`
`).map((n) => n.trim()).filter(Boolean)
      );
      for (const n of u)
        i.has(n) || (console.log("New USB drive detected:", n), i.add(n), o.quit());
      for (const n of i)
        u.has(n) || i.delete(n);
    }
  );
}
setInterval(f, 4e3);
f();
w.setApplicationMenu(null);
const l = process.env.VITE_DEV_SERVER_URL !== void 0, T = l ? r.join(c, "preload.mjs") : r.join(
  process.resourcesPath,
  "app.asar",
  "dist-electron",
  "preload.mjs"
), d = l ? v : r.join(process.resourcesPath, "app.asar", "dist", "index.html");
function h() {
  e = new p({
    fullscreen: !0,
    kiosk: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: r.join(c, "../../build/icon.ico"),
    webPreferences: {
      preload: T,
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), l ? e.loadURL(d) : e.loadFile(d), e.on("closed", () => {
    e = null;
  });
}
o.on("window-all-closed", () => {
  process.platform !== "darwin" && (o.quit(), e = null);
});
o.on("activate", () => {
  p.getAllWindows().length === 0 && h();
});
o.whenReady().then(async () => {
  h();
  const s = [
    "Alt+Tab",
    "Alt+F4",
    "Command+Q",
    "Control+Shift+Esc",
    "Command+Option+Esc",
    "F11"
  ];
  P() && o.quit(), s.forEach((t) => {
    m.register(t, () => !1);
  });
});
o.on("will-quit", () => {
  m.unregisterAll();
});
export {
  b as MAIN_DIST,
  y as RENDERER_DIST,
  v as VITE_DEV_SERVER_URL
};
