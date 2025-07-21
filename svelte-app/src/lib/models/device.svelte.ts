import type IModel from '$lib/bases/imodel';
import { ModeEnum, type ModeName, type Pow } from '$lib';

type MemorizedModel = {
  id: string;
  ip: string;
  name: string;
  picture: string;
  icon: string;
};

export const powFromIsActive = (isActive: boolean): Pow => {
  return isActive ? '1' : '0';
};

export const isActiveFromPow = (pow: Pow): boolean => {
  return pow === '1';
};

export const modeFromName = (mode: ModeName): ModeEnum => {
  switch (mode) {
    case 'cool':
      return ModeEnum.cool;
    case 'heat':
      return ModeEnum.heat;
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
};

export const modeNameFromMode = (mode: ModeEnum): ModeName => {
  switch (mode) {
    case ModeEnum.cool:
      return 'cool';
    case ModeEnum.heat:
      return 'heat';
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
};

export default class DeviceModel implements IModel<MemorizedModel> {
  id = $state('');
  ip = $state('');
  name = $state('');
  picture = $state('');
  icon = $state('air-vent');

  memorized: MemorizedModel | null = $state(null);

  memorize() {
    this.memorized = {
      id: this.id,
      ip: this.ip,
      name: this.name,
      picture: this.picture,
      icon: this.icon,
    };
  }

  get isDirty() {
    return (
      this.memorized !== null &&
      (this.id !== this.memorized.id ||
        this.ip !== this.memorized.ip ||
        this.name !== this.memorized.name ||
        this.picture !== this.memorized.picture ||
        this.icon !== this.memorized.icon)
    );
  }

  get isMemorized(): boolean {
    return this.memorized !== null;
  }

  controlInfo = $state<{ [key: string]: string }>({});

  isOn = $derived(isActiveFromPow((this.controlInfo?.pow || '0') as Pow));
  isOff = $derived(!isActiveFromPow((this.controlInfo?.pow || '0') as Pow));

  currentMode = $derived(modeNameFromMode(this.controlInfo?.mode as ModeEnum));

  indoorTemperature = $state<number | null>(null);

  refreshTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

  switchOn() {
    this.controlInfo.pow = powFromIsActive(true);
  }

  switchOff() {
    this.controlInfo.pow = powFromIsActive(false);
  }

  toggleSwitch() {
    if (this.isOn) {
      this.switchOff();
    } else {
      this.switchOn();
    }
  }

  switchMode(mode: ModeName) {
    this.controlInfo.mode = modeFromName(mode);
  }
}
