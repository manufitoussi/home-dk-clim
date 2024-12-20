export default class DeviceModel {
  id = $state('');
  ip = $state('');
  name = $state('');
  picture = $state('');
  icon = $state('air-vent');

  memorized: { id: string; ip: string; name: string; picture: string; icon: string } | null =
    $state(null);

  memorize() {
    this.memorized = {
      id: this.id,
      ip: this.ip,
      name: this.name,
      picture: this.picture,
      icon: this.icon,
    };
  }

  get isDirty() {
    return (
      this.memorized !== null &&
      (this.id !== this.memorized.id ||
        this.ip !== this.memorized.ip ||
        this.name !== this.memorized.name ||
        this.picture !== this.memorized.picture ||
        this.icon !== this.memorized.icon)
    );
  }
}
