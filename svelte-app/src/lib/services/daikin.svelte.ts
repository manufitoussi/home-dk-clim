import {
  useSettingsService,
  type Dir,
  type ModeName,
  type Rate,
  type SetResult,
} from '$lib';
import Service from '$lib/bases/service';
import { register } from '$lib/container';
import type DeviceModel from '$lib/models/device.svelte';

export default class DaikinService extends Service {
  private settingsService = useSettingsService();

  get devices() {
    return this.settingsService.settings.devices;
  }

  outdoorTemperature = $state(0);
  currentMode = $state<ModeName>();

  isSomeOn = $derived(this.getIsSomeOn());

  getIsSomeOn() {
    return this.devices.some((device) => device.isOn);
  }

  async getBasicInfo(ip: string) {
    try {
      return await window.api.daikin.getBasicInfo(ip);
    } catch (error) {
      console.error(error);
      const e = error as { message: string };
      e.message = e.message.replace(
        "Error invoking remote method 'daikin:get-basic-info':",
        '',
      );
      throw e;
    }
  }

  async getSensorInfo(ip: string) {
    try {
      return await window.api.daikin.getSensorInfo(ip);
    } catch (error) {
      console.error(error);
      const e = error as { message: string };
      e.message = e.message.replace(
        "Error invoking remote method 'daikin:get-sensor-info':",
        '',
      );
      throw e;
    }
  }

  async getControlInfo(ip: string) {
    try {
      const controlInfo = await window.api.daikin.getControlInfo(ip);
      const device = this.devices.find((device) => device.ip === ip);
      if (!device) {
        throw new Error(`Device with IP ${ip} not found`);
      }
      device.controlInfo = controlInfo!;
      this.currentMode = device.currentMode;
      return controlInfo;
    } catch (error) {
      console.error(error);
      const e = error as { message: string };
      e.message = e.message.replace(
        "Error invoking remote method 'daikin:get-control-info':",
        '',
      );
      throw e;
    }
  }

  async setControlInfo(
    ip: string,
    controls: { [key: string]: string },
  ): Promise<SetResult> {
    try {
      const controlParams = new URLSearchParams(controls).toString();
      console.log(
        `Setting control info for ${ip} with params: ${controlParams}`,
      );
      return await window.api.daikin.setControlInfo(ip, controlParams);
    } catch (error) {
      console.error(error);
      const e = error as { message: string };
      e.message = e.message.replace(
        "Error invoking remote method 'daikin:set-control-info':",
        '',
      );
      throw e;
    }
  }

  async getTemperatures(ip: string) {
    try {
      const sensorInfo = await this.getSensorInfo(ip);
      const outdoorTemperature = parseFloat(sensorInfo?.['otemp'] || '0');
      this.outdoorTemperature = outdoorTemperature;
      const indoorTemperature = parseFloat(sensorInfo?.['htemp'] || '0');
      return {
        indoorTemperature,
        outdoorTemperature,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async _setActivityControl(
    device: DeviceModel,
    isActive: boolean,
  ): Promise<SetResult> {
    console.log(
      `Setting activity control for ${device.ip} to ${isActive ? 'ON' : 'OFF'}`,
    );

    if (isActive) {
      device.switchOn();
    } else {
      device.switchOff();
    }

    try {
      return await this.setControlInfo(device.ip, device.controlInfo);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async _switchOff(device: DeviceModel): Promise<SetResult> {
    return this._setActivityControl(device, false);
  }

  async switchOff(device: DeviceModel) {
    try {
      this.stopAutoRefresh(device);
      const result = await this._switchOff(device);
      return result;
    } catch (error) {
      console.error('Error switching off device:', error);
      throw error;
    } finally {
      this.startAutoRefresh(device);
    }
  }

  private async _switchOn(device: DeviceModel) {
    return this._setActivityControl(device, true);
  }

  async switchOn(device: DeviceModel) {
    try {
      this.stopAutoRefresh(device);
      const result = await this._switchOn(device);
      return result;
    } catch (error) {
      console.error('Error switching on device:', error);
      throw error;
    } finally {
      this.startAutoRefresh(device);
    }
  }

  async togglePower(device: DeviceModel) {
    if (device.isOn) {
      return this.switchOff(device);
    } else {
      return this.switchOn(device);
    }
  }

  private async _switchOffAll() {
    const promises = Array.from(this.devices).map((device) =>
      this._switchOff(device),
    );
    return Promise.all(promises);
  }

  async switchOffAll() {
    try {
      this.stopAutoRefreshAll();
      const result = await this._switchOffAll();
      return result;
    } catch (error) {
      console.error('Error switching off all devices:', error);
      throw error;
    } finally {
      this.startAutoRefreshAll();
    }
  }

  private async _switchOnAll() {
    const promises = Array.from(this.devices).map((device) =>
      this._switchOn(device),
    );
    return Promise.all(promises);
  }

  async switchOnAll() {
    try {
      this.stopAutoRefreshAll();
      const result = await this._switchOnAll();
      return result;
    } catch (error) {
      console.error('Error switching on all devices:', error);
      throw error;
    } finally {
      this.startAutoRefreshAll();
    }
  }

  async changeMode(mode: ModeName) {
    try {
      this.stopAutoRefreshAll();
      this.currentMode = mode;
      await this._switchOffAll(); // Ensure all devices are off before changing mode
      const promises = this.devices.map((device) => {
        device.switchMode(mode);
        return this.setControlInfo(device.ip, device.controlInfo);
      });
      this.currentMode = mode;
      await Promise.all(promises);
      this.currentMode = mode;
    } catch (error) {
      console.error('Error changing mode:', error);
      throw error;
    } finally {
      await this.startAutoRefreshAll();
    }
  }

  async switchFlowRate(device: DeviceModel, rate: Rate) {
    try {
      this.stopAutoRefresh(device);
      device.switchFlowRate(rate);
      return await this.setControlInfo(device.ip, device.controlInfo);
    } catch (error) {
      console.error('Error switching flow rate:', error);
      throw error;
    } finally {
      this.startAutoRefresh(device);
    }
  }

  async switchFlowDirection(device: DeviceModel, flowDirection: Dir) {
    try {
      this.stopAutoRefresh(device);
      device.switchFlowDirection(flowDirection);
      return await this.setControlInfo(device.ip, device.controlInfo);
    } catch (error) {
      console.error('Error switching flow direction:', error);
      throw error;
    } finally {
      this.startAutoRefresh(device);
    }
  }

  async setTemperature(device: DeviceModel, temperature: string) {
    try {
      this.stopAutoRefresh(device);
      device.setTemperature(temperature);
      return await this.setControlInfo(device.ip, device.controlInfo);
    } catch (error) {
      console.error('Error setting temperature:', error);
      throw error;
    } finally {
      this.startAutoRefresh(device);
    }
  }

  async autoRefreshData(device: DeviceModel) {
    console.log('autoRefreshData for device:', device.ip);
    const { indoorTemperature: newIndoorTemp } = await this.getTemperatures(
      device.ip,
    );
    device.indoorTemperature = newIndoorTemp;

    await this.getControlInfo(device.ip);

    device.refreshTimeout = setTimeout(
      () => this.autoRefreshData(device),
      5000,
    );
  }

  async startAutoRefresh(device: DeviceModel) {
    console.log('Starting auto-refresh for device:', device.ip);
    if (device.refreshTimeout) {
      clearTimeout(device.refreshTimeout);
      device.refreshTimeout = null;
    }

    await this.autoRefreshData(device);
  }

  stopAutoRefresh(device: DeviceModel) {
    console.log('Stopping auto-refresh for device:', device.ip);
    if (device.refreshTimeout) {
      clearTimeout(device.refreshTimeout);
      device.refreshTimeout = null;
    }
  }

  async startAutoRefreshAll() {
    console.log('Starting auto-refresh for all devices');
    const promises = this.devices.map((device) =>
      this.startAutoRefresh(device),
    );
    return Promise.all(promises);
  }

  stopAutoRefreshAll() {
    console.log('Stopping auto-refresh for all devices');
    this.devices.forEach((device) => this.stopAutoRefresh(device));
  }
}

register('service:daikin', DaikinService);
