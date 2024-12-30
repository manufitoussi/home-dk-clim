import { ipcMain } from 'electron';
import { get } from './fetch';

const parseKeyValueString = (keyValueString: string) => {
  const keyValues = keyValueString.split(',');
  if (keyValues.length === 0) return null;

  const obj: { [key: string]: string } = {};
  keyValues.forEach((keyValue) => {
    const [key, value] = keyValue.split('=');
    obj[key] = value;
  });

  return obj;
};

const parseBasicInfo = (txt: string) => {
  var obj = parseKeyValueString(txt);
  if (!obj) return null;
  if (!obj.name) return null;
  if (!obj.mac) return null;
  obj.name = decodeURI(obj.name);
  obj.mac = decodeURI(obj.mac);
  return obj;
};

const parseSensorInfo = (txt: string) => {
  return parseKeyValueString(txt);
};

const parseControlInfo = (txt: string) => {
  return parseKeyValueString(txt);
};

export const getBasicInfo = async (ip: string) => {
  const response = await get(`http://${ip}/common/basic_info`, { timeout: 3000 });
  if (!response.ok)
    throw new Error(`Failed to get basic info from ${ip}, status: ${response.status}`);
  const text = await response.text();
  return parseBasicInfo(text);
  };

export const getSensorInfo = async (ip: string) => {
  const response = await get(`http://${ip}/aircon/get_sensor_info`);
  if (!response.ok)
    throw new Error(`Failed to get sensor info from ${ip}, status: ${response.status}`);
  const text = await response.text();
  return parseSensorInfo(text);
  };

export const getControlInfo = async (ip: string) => {
  const response = await get(`http://${ip}/aircon/get_control_info`);
  if (!response.ok)
    throw new Error(`Failed to get control info from ${ip}, status: ${response.status}`);
  const text = await response.text();
  return parseControlInfo(text);
};

export const setControlInfo = async (ip: string, request: string) => {
  const response = await get(`http://${ip}/aircon/set_control_info?${request}`);
  if (!response.ok)
    throw new Error(`Failed to set control info from ${ip}, status: ${response.status}`);
  const text = await response.text();
  return parseControlInfo(text);
};

// IPC handlers
ipcMain.on('daikin:get-basic-info', async (_, ip) => {
  return getBasicInfo(ip);
});

ipcMain.on('daikin:get-sensor-info', async (_, ip) => {
  return getSensorInfo(ip);
});

ipcMain.on('daikin:get-control-info', async (_, ip) => {
  return getControlInfo(ip);
});

ipcMain.on('daikin:set-control-info', async (_, ip, request) => {
  return setControlInfo(ip, request);
});
