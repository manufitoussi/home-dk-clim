import Service from '$lib/bases/service';
import { register } from '$lib/container';
import DeviceModel from '$lib/models/device.svelte';
import SettingsModel from '$lib/models/settings.svelte';

export default class SettingsService extends Service {

  settings = new SettingsModel();

  async load() {
    await this.loadTitle();
    await this.loadDevices();
  }

  async loadTitle() {
    const title = window.api.settings.getTitle();
    this.settings.title = title;
  }

  async saveTitle() {
    window.api.settings.setTitle(this.settings.title);
  }

  async loadDevices() {
    const devices = window.api.settings.getDevices();
    this.settings.devices = devices.map(deviceData => {
      const device = new DeviceModel();
      device.id = deviceData.id;
      device.ip = deviceData.ip;
      device.name = deviceData.name;
      device.picture = deviceData.picture;
      return device;
    });
  }

  addDevice() {
    const newDevice = {
      ip: '0.0.0.0',
      name: 'New Device',
      picture: '',
    };
    const { id, ip, name, picture } = window.api.settings.addDevice(newDevice);
    const device = new DeviceModel();
    device.id = id;
    device.ip = ip;
    device.name = name;
    device.picture = picture;
    this.settings.devices.push(device);
  }

  removeDevice(device: DeviceModel) {
    const index = this.settings.devices.indexOf(device);
    this.settings.devices.splice(index, 1);
    window.api.settings.removeDevice(device.id);
  }

  saveDevice(device: DeviceModel) {
    const deviceData = {
      id: device.id,
      ip: device.ip,
      name: device.name,
      picture: device.picture,
    };
    window.api.settings.updateDevice(deviceData);
  }

}

register('service:settings', SettingsService);