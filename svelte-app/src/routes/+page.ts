import { useSettingsService } from '$lib';
import type { PageLoad } from './$types';

const settingsService = useSettingsService();

const onValidateIp = async (ip: string) => {
  return await settingsService.validateIp(ip);
};

const onGetImage = async (filePath: string) => {
  return await settingsService.getImage(filePath);
};

export const load: PageLoad = async ({ parent }) => {
  return {
    onValidateIp,
    onGetImage,
    ...(await parent()),
  };
};
