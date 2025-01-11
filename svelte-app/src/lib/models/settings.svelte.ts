import type IModel from '$lib/bases/imodel';
import DeviceModel from './device.svelte';

type MemorizedModel = { title: string };

export default class SettingsModel implements IModel<MemorizedModel> {
  title = $state('');

  devices = $state<Array<DeviceModel>>([]);

  memorized: MemorizedModel | null = $state(null);

  memorize() {
    this.memorizeTitle();
    this.devices.forEach((device) => device.memorize());
  }

  get isMemorized() {
    return (
      this.memorized !== null &&
      this.devices.every((device) => device.isMemorized)
    );
  }

  get isDirty() {
    return (
      this.memorized !== null &&
      (this.title !== this.memorized.title ||
        this.devices.some((device) => device.isDirty))
    );
  }

  get isTitleDirty() {
    return this.memorized !== null && this.title !== this.memorized.title;
  }

  memorizeTitle() {
    this.memorized = { title: this.title };
  }
}
