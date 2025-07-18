export const csr = true;
export const prerender = false;
export const ssr = false;

import { browser } from '$app/environment';
import '$lib/i18n';
import { locale, waitLocale } from 'svelte-i18n';

import { useSettingsService, useDaikinService } from '$lib';
import '$lib/services/settings';

export const load = async () => {
  if (browser) {
    locale.set(window.navigator.language);
  }

  await waitLocale();

  const settingsService = useSettingsService();
  const daikinService = useDaikinService();
  await settingsService.load();
  return {
    settingsService,
    settings: settingsService.settings,
    daikinService,
  };
};
