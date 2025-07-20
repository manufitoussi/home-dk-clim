import { useSettingsService, useDaikinService } from '$lib';
import type { PageLoad } from './$types';

const settingsService = useSettingsService();
const daikinService = useDaikinService();

const onValidateIp = async (ip: string) => {
  return await settingsService.validateIp(ip);
};

const onGetImage = async (filePath: string) => {
  return await settingsService.getImage(filePath);
};

const onGetTemperatures = async (ip: string) => {
  return await daikinService.getTemperatures(ip);
};

const onGetControlInfo = async (ip: string) => {
  return await daikinService.getControlInfo(ip);
};

const onSetControlInfo = async (ip: string, controls: { [key: string]: string }) => {
  console.log('Setting control info:', ip, controls);
  return await daikinService.setControlInfo(ip, controls);
};

export const load: PageLoad = async ({ parent }) => {
  return {
    onValidateIp,
    onGetImage,
    onGetTemperatures,
    onGetControlInfo,
    onSetControlInfo,
    ...(await parent()),
  };
};
