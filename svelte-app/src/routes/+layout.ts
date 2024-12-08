export const csr = true;
export const prerender = false;
export const ssr = false;

import { lookupSettingsService } from '$lib';
import '$lib/services/settings';

export const load = async () => {
  const settingsService = lookupSettingsService();
  await settingsService.load();
  return {
    settingsService,
    settings: settingsService.settings,
  };
}
