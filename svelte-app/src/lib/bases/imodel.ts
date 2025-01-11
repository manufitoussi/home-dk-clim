export default interface IModel<M extends Record<string, unknown>> {
  memorized: M | null;

  memorize(): void;

  get isMemorized(): boolean;

  get isDirty() : boolean;

}
