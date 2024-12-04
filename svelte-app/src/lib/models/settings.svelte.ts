import DeviceModel from "./device.svelte";

export default class SettingsModel {
  
  title = $state('');

  devices = $state<Array<DeviceModel>>([]);

}