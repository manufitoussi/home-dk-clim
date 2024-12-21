import { useSettingsService } from '$lib';
import type { PageLoad } from './$types';

const settingsService = useSettingsService();

const onValidateIp = async (ip: string) => {
  console.log('onValidateIp', ip);
  const isValid = await settingsService.validateIp(ip);
  console.log(isValid);
  return isValid;
};

export const load: PageLoad = async ({ parent }) => {
  return {
    onValidateIp,
    ...(await parent()),
  };
};
