import { execFile } from "child_process";
import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

declare var global: any;
declare var __dirname: any;

let win: Electron.BrowserWindow;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600});

    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, "/index.html"));

    // Open the DevTools.
    // win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

function bashit_fn(sender: any, fnName: string) {
    const executablePath = "/usr/bin/env";
    const sourcePath = "source " + __dirname + "/bash_src/lib.sh; " + fnName;
    const parameters = [ "bash", "-c", sourcePath ];

    execFile(executablePath, parameters, (err: any, data: any) => {
        let msg = data.toString();
        if (err) {
            global.console.error(err);
            msg += err;
        }
        const eventName = "bash-function-" + fnName;
        sender.send(eventName, msg);
        global.console.log(msg);
    });
}

function hello_fn(sender: any) {
    bashit_fn(sender, "hello_fn");
}

ipcMain.on("call-bash-function-hello_fn", (event: any, arg: any) => {
    hello_fn(event.sender);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    app.quit();
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
