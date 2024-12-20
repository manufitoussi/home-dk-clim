import { ipcMain } from 'electron';

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

export const parseBasicInfo = (txt: string) => {
  var obj = parseKeyValueString(txt);
  if (!obj) return null;
  if (!obj.name) return null;
  if (!obj.mac) return null;
  obj.name = decodeURI(obj.name);
  obj.mac = decodeURI(obj.mac);
  return obj;
};

export const parseSensorInfo = (txt: string) => {
  return parseKeyValueString(txt);
};

export const parseControlInfo = (txt: string) => {
  return parseKeyValueString(txt);
};

export const getBasicInfo = async (ip: string) => {
  const result = await fetch(`http://${ip}/common/basic_info`);
  const text = await result.text();
  return parseBasicInfo(text);
};

export const getSensorInfo = async (ip: string) => {
  const result = await fetch(`http://${ip}/aircon/get_sensor_info`);
  const text = await result.text();
  return parseSensorInfo(text);
};

export const getControlInfo = async (ip: string) => {
  const result = await fetch(`http://${ip}/aircon/get_control_info`);
  const text = await result.text();
  return parseControlInfo(text);
};

export const setControlInfo = async (ip: string, request: string) => {
  const result = await fetch(`http://${ip}/aircon/set_control_info?${request}`);
  const text = await result.text();
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
