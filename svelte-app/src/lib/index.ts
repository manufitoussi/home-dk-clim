// place files you want to import through the `$lib` alias in this folder.

import { lookup } from "$lib/container";
import SettingsService from "$lib/services/settings";

export const lookupSettingsService = () => lookup<SettingsService>("service:settings");