import DeviceModel from "./device.svelte";

export default class SettingsModel {

  title = $state('');

  devices = $state<Array<DeviceModel>>([]);


  memorized: { title: string; } | null = $state(null);

  memorize() {
    this.memorizeTitle();
    this.devices.forEach(device => device.memorize());
  }

  get isDirty() {
    return this.memorized !== null && (
      this.title !== this.memorized.title
      || this.devices.some(device => device.isDirty)
    );
  }

  get isTitleDirty() {
    return this.memorized !== null && this.title !== this.memorized.title;
  }

  memorizeTitle() {
    this.memorized = { title: this.title };
  }

}