// place files you want to import through the `$lib` alias in this folder.

import { lookup } from '$lib/container';
import SettingsService from '$lib/services/settings';

export const useSettingsService = () =>
  lookup<SettingsService>('service:settings');

// debounce a function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  timeout = 300,
) {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
