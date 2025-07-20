// place files you want to import through the `$lib` alias in this folder.

import { lookup } from '$lib/container';
import SettingsService from '$lib/services/settings';

export const useSettingsService = () =>
  lookup<SettingsService>('service:settings');

import DaikinService from '$lib/services/daikin.svelte';
export const useDaikinService = () => lookup<DaikinService>('service:daikin');

// debounce a function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  timeout = 300,
) {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(func.apply(this, args));
      }, timeout);
    });
  };
}

export type Dir = '0' | '1' | '2' | '3';
export type Rate = 'A' | 'B' | '3' | '4' | '5' | '6';
export type Pow = '0' | '1';

export type Mode = '3' | '4';

export interface ControlInfo {
  f_dir: Dir;
  f_rate: Rate;
  pow: Pow;
  stemp: string;
  mode: Mode;
}

export enum ModeEnum {
  cool = '3',
  heat = '4',
}

export type ModeName = 'cool' | 'heat';
