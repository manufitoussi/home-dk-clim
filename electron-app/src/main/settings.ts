import { ipcMain } from 'electron';
import Store from './store';

export type AddDeviceArgs = { ip: string; name: string; picture: string; icon: string };
export type Device = { id: string } & AddDeviceArgs;

interface SettingsSchema {
  title: string;
  devices: Device[];
}

const defaults: SettingsSchema = {
  title: 'Daikin Control',
  devices: [],
};

const settings = new Store<SettingsSchema>({ defaults, fileName: 'settings.json' });

export const getDevices = () => settings.get('devices') as Device[];

// IPC handlers
ipcMain.on('settings:get', async (event, path: string) => {
  event.returnValue = settings.get(path);
});

ipcMain.on('settings:set', async (_, path: string, value: any) => {
  settings.set(path, value);
});

ipcMain.on('settings:device:get', async (event, id: string) => {
  event.returnValue = getDevices().find((device: Device) => device.id === id);
});

ipcMain.on('settings:device:all', async (event) => {
  event.returnValue = getDevices();
});

ipcMain.on('settings:device:add', async (event, device: AddDeviceArgs) => {
  const newDevice = { ...device, id: Math.random().toString(36).substr(2, 9) };
  settings.set('devices', [newDevice, ...settings.get('devices')]);
  event.returnValue = newDevice;
});

ipcMain.on('settings:device:remove', async (_, id: string) => {
  settings.set(
    'devices',
    settings.get('devices').filter((device: Device) => device.id !== id),
  );
});

ipcMain.on('settings:device:update', async (_, device: Device) => {
  const devices = getDevices();
  const index = devices.findIndex((d: Device) => d.id === device.id);
  devices[index] = device;
  settings.set('devices', devices);
});

ipcMain.on('settings:title:set', async (_, title: string) => {
  settings.set('title', title);
});

ipcMain.on('settings:title:get', async (event) => {
  event.returnValue = settings.get('title');
});

ipcMain.on('settings:device:sort', async (_, oldIndex: number, newIndex: number) => {
  const devices = getDevices();
  const device = devices[oldIndex];
  devices.splice(oldIndex, 1);
  devices.splice(newIndex, 0, device);
  settings.set('devices', devices);
});

export default settings;
