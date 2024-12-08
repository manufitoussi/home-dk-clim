import Service from '$lib/bases/service';
import { register } from '$lib/container';
import SettingsModel from '$lib/models/settings.svelte';

export default class SettingsService extends Service {

  settings = new SettingsModel();

  async load() {
    const title = window.api.settings.getTitle();
    this.settings.title = title;
  }

  async save() {
    window.api.settings.setTitle(this.settings.title);
  }

}

register('service:settings', SettingsService);