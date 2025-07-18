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

export const load: PageLoad = async ({ parent }) => {
  return {
    onValidateIp,
    onGetImage,
    onGetTemperatures,
    ...(await parent()),
  };
};
