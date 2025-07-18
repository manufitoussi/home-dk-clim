import { ElectronAPI } from '@electron-toolkit/preload';
import { AddDeviceArgs, Device } from '../main/settings';

declare global {
  interface Window {
    AddDeviceArgs: AddDeviceArgs;
    Device: Device;
    electron: ElectronAPI;
    api: {
      settings: {
        setTitle: (title: string) => Promise<void>;
        getTitle: () => string;
        getDevice: (id: string) => Device;
        getDevices: () => Device[];
        addDevice: (device: AddDeviceArgs) => Device;
        removeDevice: (id: string) => Promise<void>;
        updateDevice: (device: Device) => Promise<void>;
        sortDevices: (oldIndex: number, newIndex: number) => Promise<void>;
        validateIp: (ip: string) => Promise<boolean>;
        saveImage: (base64: string, oldFilePath: string | null) => Promise<string | null>;
        deleteImage: (filePath: string) => Promise<boolean>;
        getImage: (filePath: string) => Promise<string | null>;
      };
      daikin: {
        getBasicInfo: (ip: string) => Promise<{ name: string; mac: string } | null>;
        getSensorInfo: (ip: string) => Promise<{ [key: string]: string } | null>;
        getControlInfo: (ip: string) => Promise<{ [key: string]: string } | null>;
        setControlInfo: (ip: string, request: string) => Promise<{ [key: string]: string } | null>;
      };
    };
  }
}

export {};
