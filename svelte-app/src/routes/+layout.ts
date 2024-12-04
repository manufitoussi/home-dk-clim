export const csr = true;
export const prerender = false;
export const ssr = false;

import '$lib/services/settings';
import { lookup } from '$lib/container';
import type SettingsService from '$lib/services/settings';


export const load = async () => {

  const settingsService = lookup<SettingsService>('service:settings');
  await settingsService.load();
  return {
    settings: settingsService,
    model: settingsService.settings,
  };
}
