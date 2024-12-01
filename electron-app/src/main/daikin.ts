import { ipcMain } from "electron";

const parseKeyValueString = (keyValueString: string) => {
  const keyValues = keyValueString.split(',');
  if (keyValues.length === 0) return null;

  const obj: { [key: string]: string } = {};
  keyValues.forEach(keyValue => {
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

const getBasicInfo = async (ip: string) => {
  const result = await fetch(`http://${ip}/common/basic_info`)
  const text = await result.text();
  return parseBasicInfo(text);
};

const getSensorInfo = async (ip: string) => {
  const result = await fetch(`http://${ip}/aircon/get_sensor_info`);
  const text = await result.text();
  return parseSensorInfo(text);
};

const getControlInfo = async (ip: string) => {
  const result = await fetch(`http://${ip}/aircon/get_control_info`);
  const text = await result.text();
  return parseControlInfo(text);
};

const setControlInfo = async (ip: string, request: string) => {
  const result = await fetch(`http://${ip}/aircon/set_control_info?${request}`);
  const text = await result.text();
  return parseControlInfo(text);
};

ipcMain.handle('daikin:get-basic-info', async (_, ip) => {
  return getBasicInfo(ip);
});

ipcMain.handle('daikin:get-sensor-info', async (_, ip) => {
  return getSensorInfo(ip);
});

ipcMain.handle('daikin:get-control-info', async (_, ip) => {
  return getControlInfo(ip);
});

ipcMain.handle('daikin:set-control-info', async (_, ip, request) => {
  return setControlInfo(ip, request);
});