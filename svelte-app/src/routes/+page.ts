import { useSettingsService, useDaikinService } from '$lib';
import type DeviceModel from '$lib/models/device.svelte';
import type { PageLoad } from './$types';

const settingsService = useSettingsService();
const daikinService = useDaikinService();

const onValidateIp = async (ip: string) => {
  return await settingsService.validateIp(ip);
};

const onGetImage = async (filePath: string) => {
  return await settingsService.getImage(filePath);
};

const onStartAutoRefresh = async (device: DeviceModel) => {
  return await daikinService.startAutoRefresh(device);
};

const onStopAutoRefresh = async (device: DeviceModel) => {
  return await daikinService.stopAutoRefresh(device);
};

const onToggleSwitch = async (device: DeviceModel) => {
  return await daikinService.toggleSwitch(device);
};

export const load: PageLoad = async ({ parent }) => {
  return {
    onValidateIp,
    onGetImage,
    onToggleSwitch,
    onStartAutoRefresh,
    onStopAutoRefresh,
    ...(await parent()),
  };
};
