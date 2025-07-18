import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { AddDeviceArgs, Device } from '../main/settings';

// Custom APIs for renderer
const api = {
  settings: {
    setTitle: (title: string) => ipcRenderer.send('settings:title:set', title),

    getTitle: () => ipcRenderer.sendSync('settings:title:get'),

    getDevice: (id: string) => ipcRenderer.sendSync('settings:device:get', id),

    getDevices: () => ipcRenderer.sendSync('settings:device:all'),

    addDevice: (device: AddDeviceArgs) => ipcRenderer.sendSync('settings:device:add', device),

    removeDevice: (id: string) => ipcRenderer.send('settings:device:remove', id),

    updateDevice: (device: Device) => ipcRenderer.send('settings:device:update', device),

    sortDevices: (oldIndex: number, newIndex: number) =>
      ipcRenderer.send('settings:device:sort', oldIndex, newIndex),

    validateIp: (ip: string) => ipcRenderer.invoke('settings:device:validate', ip),

    saveImage: (base64: string, oldFilePath: string | null) =>
      ipcRenderer.invoke('settings:image:save', { base64, oldFilePath }),

    deleteImage: (filePath: string) => ipcRenderer.invoke('settings:image:delete', filePath),

    getImage: (filePath: string) => ipcRenderer.invoke('settings:image:get', filePath),
  },
  
  daikin: {
    getBasicInfo: (ip: string) => ipcRenderer.invoke('daikin:get-basic-info', ip),

    getSensorInfo: (ip: string) => ipcRenderer.invoke('daikin:get-sensor-info', ip),

    getControlInfo: (ip: string) => ipcRenderer.invoke('daikin:get-control-info', ip),

    setControlInfo: (ip: string, request: string) =>
      ipcRenderer.invoke('daikin:set-control-info', ip, request),
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
