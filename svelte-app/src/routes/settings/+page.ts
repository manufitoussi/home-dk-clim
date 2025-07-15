import type { PageLoad } from './$types';
import { useSettingsService } from '$lib';
import type DeviceModel from '$lib/models/device.svelte';

const settingsService = useSettingsService();

const onSaveTitle = async () => {
  await settingsService.saveTitle();
};

const onAddDevice = async () => {
  await settingsService.addDevice();
};

const onSaveDevice = async (device: DeviceModel) => {
  await settingsService.saveDevice(device);
};

const onRemoveDevice = async (device: DeviceModel) => {
  await settingsService.removeDevice(device);
};

const onSortDevices = async (oldIndex: number, newIndex: number) => {
  await settingsService.sortDevices(oldIndex, newIndex);
};

const onValidateIp =  async (ip: string) => {
  return await settingsService.validateIp(ip);
}

const onSaveImage = async (base64: string, oldFilePath: string | null) => {
  return await settingsService.saveImage(base64, oldFilePath);
};

const onRemoveImage = async (filePath: string) => {
  return await settingsService.removeImage(filePath);
};

const onGetImage = async (filePath: string) => {
  return await settingsService.getImage(filePath);
};

export const load: PageLoad = async ({ parent }) => {
  return {
    onSaveTitle,
    onSaveDevice,
    onRemoveDevice,
    onAddDevice,
    onSortDevices,
    onValidateIp,
    onSaveImage,
    onRemoveImage,
    onGetImage,
    ...(await parent()),
  };
};
