//import { contextBridge } from "electron";
const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('versions',{
    node:()=> process.versions.node,
    chrome:()=>process.versions.chrome,
    electron:()=>process.versions.electron,
    startServer :()=>{
        ipcRenderer.send('start-server');
    }
})

ipcRenderer.on('server-status', (event, status) => {
    console.log('Server Status:', status);
});