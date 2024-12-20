import Service from '$lib/bases/service';
import { register } from '$lib/container';
import DeviceModel from '$lib/models/device.svelte';
import SettingsModel from '$lib/models/settings.svelte';

export default class SettingsService extends Service {

  settings = new SettingsModel();

  async load() {
    await this.loadTitle();
    await this.loadDevices();

    this.settings.memorize();
  }

  async loadTitle() {
    const title = window.api.settings.getTitle();
    this.settings.title = title;
  }

  async saveTitle() {
    window.api.settings.setTitle(this.settings.title);
    this.settings.memorizeTitle();
  }

  async loadDevices() {
    const devices = window.api.settings.getDevices();
    this.settings.devices = devices.map(deviceData => {
      const device = new DeviceModel();
      device.id = deviceData.id;
      device.ip = deviceData.ip;
      device.name = deviceData.name;
      device.picture = deviceData.picture;
      device.icon = deviceData.icon || 'air-vent';
      return device;
    });
  }

  addDevice() {
    const newDevice = {
      ip: '0.0.0.0',
      name: 'New Device',
      picture: '',
      icon: 'air-vent',
    };
    const { id, ip, name, picture, icon } = window.api.settings.addDevice(newDevice);
    const device = new DeviceModel();
    device.id = id;
    device.ip = ip;
    device.name = name;
    device.picture = picture;
    device.icon = icon;
    this.settings.devices.unshift(device);
    device.memorize();
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
      icon: device.icon,
    };
    window.api.settings.updateDevice(deviceData);
    device.memorize();
  }

  sortDevices(oldIndex: number, newIndex: number) {
    window.api.settings.sortDevices(oldIndex, newIndex);
    const devices = [...this.settings.devices];
    devices.splice(newIndex, 0, devices.splice(oldIndex, 1)[0]);
    this.settings.devices = devices;
    console.log(this.settings.devices);
  }

}

register('service:settings', SettingsService);