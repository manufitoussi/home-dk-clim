import { ipcMain } from 'electron';
import Store from './store';

export type Device = { ip: string, name: string, picture: string };

interface SettingsSchema {
  devices: Device[];
}

const defaults: SettingsSchema = {
  devices: [],
};

const settings = new Store<SettingsSchema>({ defaults, fileName: 'settings.json' });

export const getDevices = () => settings.get('devices') as Device[];

// IPC listener
ipcMain.on('settings:get', async (event, path: string) => {
  event.returnValue = settings.get(path);
});

ipcMain.on('settings:set', async (_, path: string, value: any) => {
  settings.set(path, value);
});

ipcMain.handle('settings:device:get', async (_, ip: string) => {
  return getDevices().find((device: Device) => device.ip === ip);
});

ipcMain.handle('settings:device:all', async () => {
  return getDevices();
});

ipcMain.on('settings:device:add', async (_, device: Device) => {
  settings.set('devices', [...settings.get('devices'), device]);
});

ipcMain.on('settings:device:remove', async (_, ip: string) => {
  settings.set('devices', settings.get('devices').filter((device: Device) => device.ip !== ip));
});

ipcMain.on('settings:device:update', async (_, device: Device) => {
  const devices = getDevices();
  const index = devices.findIndex((d: Device) => d.ip === device.ip);
  devices[index] = device;
  settings.set('devices', devices);
});

export default settings;