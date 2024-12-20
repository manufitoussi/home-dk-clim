type Constructor<I> = new (...args: unknown[]) => I;

export const _container_ = new Map<string, Constructor<unknown>>();

export const _instances_ = new Map<string, unknown>();

/**
 * Register a class with a key.
 * @param key A key to register the class with
 * @param Class A class constructor
 */
export function register<I, C extends Constructor<I>>(key: string, Class: C) {
  _container_.set(key, Class);
}

/**
 * Resolve a class by key in the container.
 * @param key A key to resolve the class by
 * @returns The class constructor
 */
export function resolve<I>(key: string): Constructor<I> {
  if (!_container_.has(key)) {
    throw new Error(`Class not resolved: ${key}`);
  }

  return _container_.get(key) as Constructor<I>;
}

/**
 * Lookup an instance by key. If the instance does not exist, it will be created.
 * @param key A key to lookup the instance by
 * @returns The instance
 */
export function lookup<I>(key: string): I {
  let instance = _instances_.get(key) as I;
  if (instance) {
    return instance;
  }

  const Class = resolve<I>(key);

  instance = new Class();
  _instances_.set(key, instance);
  return instance;
}

/**
 * Unregister a class by key.
 * @param key A key to unregister the class by
 */
export function unregister(key: string) {
  _instances_.delete(key);
  _container_.delete(key);
}

/**
 * Reset an instance by key. The instance will be recreated on the next lookup.
 * @param key A key to reset the instance by
 */
export function reset(key: string) {
  _instances_.delete(key);
}

type InjectedMetadata = Map<string, string>;
type ObjectWithInjectedMetadata = object & { __injected__: InjectedMetadata };

/**
 * Inject a class instance into a property. The instance will be lazily looked up by key.
 * @param target The target object
 * @param propertyName The property name
 * @param key The key to lookup the instance by. If not provided, the property name will be used or the key declared with `injected`.
 */
export function inject<T extends ObjectWithInjectedMetadata>(
  target: T,
  propertyName: string,
  key: string | null = null,
) {
  let lookupKey = key || propertyName;
  if (target.__injected__ && target.__injected__.has(propertyName)) {
    lookupKey = target.__injected__.get(propertyName) as string;
  }

  Object.defineProperty(target, propertyName, {
    get() {
      return lookup(lookupKey);
    },
    enumerable: true,
    configurable: false,
  });
}

/**
 * Decorator to declare a property to be injected in the constructor.
 * If no key is provided, the property name will be used.
 * Call `inject` for individual properties.
 * @param key The key to lookup the instance by. If not provided, the property name will be used.
 * @returns The property decorator
 */
export function injected(key: string | null = null): PropertyDecorator {
  return (target: unknown, propertyKey: string | symbol) => {
    const withInjectedMetadata = target as ObjectWithInjectedMetadata;
    if (!('__injected__' in withInjectedMetadata)) {
      Object.defineProperty(target, '__injected__', {
        value: new Map<string, string>(),
        enumerable: false,
        configurable: false,
      });
    }

    const propertyKeyString = propertyKey as string;
    withInjectedMetadata.__injected__.set(propertyKeyString, key || propertyKeyString);
  };
}
