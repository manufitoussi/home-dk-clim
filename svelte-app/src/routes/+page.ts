import { useSettingsService, useDaikinService, type Rate } from '$lib';
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

const onTogglePower = async (device: DeviceModel) => {
  return await daikinService.togglePower(device);
};

const onSwitchFlowRate = async (device: DeviceModel, flowRate: Rate) => {
  return await daikinService.switchFlowRate(device, flowRate);
};

export const load: PageLoad = async ({ parent }) => {
  return {
    onValidateIp,
    onGetImage,
    onTogglePower,
    onSwitchFlowRate,
    onStartAutoRefresh,
    onStopAutoRefresh,
    ...(await parent()),
  };
};
