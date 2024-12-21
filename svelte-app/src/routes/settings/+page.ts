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
  console.log('onSaveDevice', device);
  await settingsService.saveDevice(device);
};

const onRemoveDevice = async (device: DeviceModel) => {
  await settingsService.removeDevice(device);
};

const onSortDevices = async (oldIndex: number, newIndex: number) => {
  await settingsService.sortDevices(oldIndex, newIndex);
};

export const load: PageLoad = async ({ parent }) => {
  return {
    onSaveTitle,
    onSaveDevice,
    onRemoveDevice,
    onAddDevice,
    onSortDevices,
    ...(await parent()),
  };
};
