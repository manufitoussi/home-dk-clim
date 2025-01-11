import { beforeEach, describe, expect, it } from 'vitest';
import DeviceModel from './device.svelte';
import SettingsModel from './settings.svelte';

describe('SettingsModel', () => {
  let settings: SettingsModel;

  beforeEach(() => {
    settings = new SettingsModel();
  });

  it('should initialize with default values', () => {
    expect(settings.title).toBe('');
    expect(settings.devices).toEqual([]);
    expect(settings.memorized).toBeNull();
    expect(settings.isMemorized).toBe(false);
    expect(settings.isDirty).toBe(false);
    expect(settings.isTitleDirty).toBe(false);
  });

  it('should detect if title is dirty', () => {
    settings.title = 'New Title';
    settings.devices = [new DeviceModel(), new DeviceModel()];
    settings.memorize();

    expect(settings.memorized).toEqual({ title: 'New Title' });

    expect(settings.isDirty).toBe(false);
    expect(settings.isTitleDirty).toBe(false);

    settings.title = 'Changed Title';

    expect(settings.isDirty).toBe(true);
    expect(settings.isTitleDirty).toBe(true);
  });

  it('should detect if device is dirty', () => {
    settings.title = 'New Title';
    settings.devices = [new DeviceModel(), new DeviceModel()];
    settings.memorize();

    const device = settings.devices[0];

    expect(device.memorized).not.toBeNull();
    expect(device.isMemorized).toBe(true);
    expect(device.isDirty).toBe(false);

    device.name = 'Changed Name';

    expect(settings.isDirty).toBe(true);
    expect(settings.isTitleDirty).toBe(false);
    expect(device.isDirty).toBe(true);
  });
});
