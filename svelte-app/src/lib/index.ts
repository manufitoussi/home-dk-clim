// place files you want to import through the `$lib` alias in this folder.

import { lookup } from "$lib/container";
import SettingsService from "$lib/services/settings";

export const useSettingsService = () => lookup<SettingsService>("service:settings");