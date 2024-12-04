import Service from '../bases/service';
import { register } from '../container';
import SettingsModel from '../models/settings.svelte';

export default class SettingsService  extends Service {

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