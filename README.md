# electron + bash + typescript demo

A less simple electron app that execs a bash function when you click a button using typescript

(not using angular just yet)

https://electronjs.org/blog/typescript

### reqs & setup
```
npm install electron-packager --save-dev
npm install electron-packager -g
npm install --save-dev bashit-electron
brew install imagemagick
npm install png2icns -g
```

imagemagick and png2icns are not actually required. Both are used by package.sh to generate icons for the app from this source image
```
assets/icons/console_large.png
```

### build
```
npm install
```

### test the app before packaging
```
npm start
```

### package the app for distribution
```
    npm run package
```

#### notes -
npm run package from package.json, first builds the app then executes package.sh, to add additional targets change package.sh.

package.sh can, if exists, use imagemagic (convert) and png2icns to create the icons from console_large.png. 

If neither image app is installed the script still work - however the app will have the default electrons icon set.

HOWEVER If you have installed imagemagick and png2icns the icons exist, package.sh runs:

```
electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/icon.icns --prune=true --out=release-builds && \
electron-packager . electron-tutorial-app --overwrite --asar=true --platform=linux --arch=x64 --icon=assets/icons/png/icon_256.png --prune=true --out=release-builds
```

and the app will be .... uh ... with the icons.

### run the packaged app (macos)
```
    open -a "$(pwd)/release-builds/bashit-electron-ts-darwin-x64/bashit-electron-ts.app"
```

### How to make a dmg from the the .app folder

https://gist.github.com/jadeatucker/5382343

yup....that

### extending the app by adding more bash functions

1) add your super new fn into bash_src/lib.sh like so

```
super-newfn() {
    echo "this is my super new function"
}
```

2) using hello_fn as a template in main.js, add a js function to call your bash function ala

```
function super-newfn(sender) {
    bashit_fn(sender, 'super-newfn');
}
```

3) call you brand new function from index.html. 

  add an ipc call in index.html that sends a message with the function name as part of the event.
```
ipcMain.on('bash-function-hello_fn', (event, arg) => {
    hello_fn(event.sender);
})
```

4) Then, with the renderer emmiting a message, modify main.js to listen for the event, and run the function. I recommend an event named something like -

```
bash-function-super-newfn
```

5) finally(!) emit a reponse ipc event from main.js with the string returned by the bash subshell.

6) go back to index.html and listen for the new response event and...

BAM!  stdout from your lovely bash fn is ready for the renderer

