import { useSettingsService, type ControlInfo } from '$lib';
import Service from '$lib/bases/service';
import { register } from '$lib/container';

export default class DaikinService extends Service {
  settingsService = useSettingsService();

  get devices() {
    return this.settingsService.settings.devices;
  }

  outdoorTemperature = $state(0);

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

  async setControlInfo(ip: string, controls: { [key: string]: string }) {
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

  async setActivityControl(ip: string, isActive: boolean) {
    console.log(
      `Setting activity control for ${ip} to ${isActive ? 'ON' : 'OFF'}`,
    );
    const device = this.devices.find((device) => device.ip === ip);
    if (!device) {
      throw new Error(`Device with IP ${ip} not found`);
    }

    const controlInfo = device.controlInfo;
    if (!controlInfo) {
      throw new Error(`Control info for IP ${ip} not found on device.`);
    }

    const newPow: ControlInfo['pow'] = isActive ? '1' : '0';
    controlInfo.pow = newPow;
    try {
      return await this.setControlInfo(ip, controlInfo);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async switchOff(ip: string) {
    return this.setActivityControl(ip, false);
  }

  async switchOn(ip: string) {
    return this.setActivityControl(ip, true);
  }

  async switchOffAll() {
    const promises = Array.from(this.devices).map((device) =>
      this.switchOff(device.ip),
    );
    return Promise.all(promises);
  }

  async switchOnAll() {
    const promises = Array.from(this.devices).map((device) =>
      this.switchOn(device.ip),
    );
    return Promise.all(promises);
  }
}

register('service:daikin', DaikinService);
