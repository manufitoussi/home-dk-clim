import Service from '$lib/bases/service';
import { register } from '$lib/container';

export default class DaikinService extends Service {
  outdoorTemperature = $state(0);

  async getBasicInfo(ip: string) {
    try {
      return await window.api.daikin.getBasicInfo(ip);
    } catch (error) {
      console.error(error);
      const e = error as { message: string };
      e.message = e.message.replace("Error invoking remote method 'daikin:get-basic-info':", '');
      throw e;
    }
  }

  async getSensorInfo(ip: string) {
    try {
      return await window.api.daikin.getSensorInfo(ip);
    } catch (error) {
      console.error(error);
      const e = error as { message: string };
      e.message = e.message.replace("Error invoking remote method 'daikin:get-sensor-info':", '');
      throw e;
    }
  }

  async getControlInfo(ip: string) {
    try {
      return await window.api.daikin.getControlInfo(ip);
    } catch (error) {
      console.error(error);
      const e = error as { message: string };
      e.message = e.message.replace("Error invoking remote method 'daikin:get-control-info':", '');
      throw e;
    }
  }

  async setControlInfo(ip: string, request: string) {
    try {
      return await window.api.daikin.setControlInfo(ip, request);
    } catch (error) {
      console.error(error);
      const e = error as { message: string };
      e.message = e.message.replace("Error invoking remote method 'daikin:set-control-info':", '');
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
}

register('service:daikin', DaikinService);
