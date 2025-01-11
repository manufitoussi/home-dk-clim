import DeviceModel from '$lib/models/device.svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import SettingsService from './settings';

describe('SettingsService', () => {
  let service: SettingsService;
  beforeEach(() => {
    global.window = global.window || {};
    const devices = [
      new DeviceModel(),
      new DeviceModel(),
    ];

    devices[0].id = '1';
    devices[0].ip = '192.168.1.20';
    devices[0].name = 'Device 1';
    devices[0].picture = '';
    devices[0].icon = 'air-vent';

    devices[1].id = '2';
    devices[1].ip = '192.168.1.45';
    devices[1].name = 'Device 2';
    devices[1].picture = '';
    devices[1].icon = 'air-vent';
    
    global.window.api = {
      settings: {
        getTitle: () => 'Title',
        setTitle: async (title) => {},
        getDevices: () => devices,
        addDevice: (device) => {
          const newDevice  = new DeviceModel();
          newDevice.id = '3';
          newDevice.ip = device.ip;
          newDevice.name = device.name;
          newDevice.picture = device.picture;
          newDevice.icon = device.icon;
          devices.push(newDevice);
          return newDevice;
        },
        removeDevice: async (id) => {},
        getDevice: (id) => devices.find((d) => d.id === id)!,
        sortDevices: async (ids) => {},
        updateDevice: async (device) => {},
        validateIp: async (ip) => true,
      },
    };

    service = new SettingsService();
  });

  it('should initialize with default values', () => {
    expect(service.settings.title).toBe('');
    expect(service.settings.devices).toEqual([]);
    expect(service.settings.memorized).toBeNull();
    expect(service.settings.isMemorized).toBe(false);
    expect(service.settings.isDirty).toBe(false);
    expect(service.settings.isTitleDirty).toBe(false);
  });

  it('should load title and devices', async () => {
    await service.load();
    expect(service.settings.title).toBe('Title');
    expect(service.settings.devices.map(d => d.id)).toEqual(['1', '2']);
    expect(service.settings.isMemorized).toBe(true);
  });

  it('should add device', async () => {
    await service.load();
    service.addDevice();
    expect(service.settings.devices.length).toBe(3);
    const newDevice = service.settings.devices[0];
    expect(newDevice.ip).toBe('0.0.0.0');
    expect(newDevice.name).toBe('New Device');
    expect(newDevice.picture).toBe('');
    expect(newDevice.icon).toBe('air-vent');
  });
});
