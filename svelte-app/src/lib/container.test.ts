import { afterEach, expect, test, describe } from 'vitest';
import {
  _container_,
  _instances_,
  clear,
  lookup,
  register,
  reset,
  resolve,
  unregister,
} from './container';

interface IObject {
  toString(): string;
}

class Double {
  value = 0;

  set(value: number) {
    this.value = value * 2;
  }
}

class Triple {
  value = 0;

  set(value: number) {
    this.value = value * 3;
  }
}

class ObjectA implements IObject {
  toString() {
    return 'ObjectA';
  }
}

class ObjectB implements IObject {
  toString() {
    return 'ObjectB';
  }
}

describe('Container', () => {
  afterEach(() => {
    clear();
  });

  test('Register, Resolve, Unregister', () => {
    register('Double', Double);

    expect(_container_.has('Double')).toBeTruthy();
    expect(_container_.size).toBe(1);

    register('Triple', Triple);

    expect(_container_.has('Triple')).toBeTruthy();
    expect(_container_.size).toBe(2);

    unregister('Double');

    expect(_container_.has('Double')).toBeFalsy();
    expect(_container_.size).toBe(1);
  });

  test('Lookup, Reset', () => {
    register('Double', Double);

    register('Triple', Triple);

    const double = lookup<Double>('Double');

    expect(double).toBeInstanceOf(Double);
    expect(_instances_.get('Double')).toBe(double);

    const triple = lookup<Triple>('Triple');

    expect(triple).toBeInstanceOf(Triple);
    expect(_instances_.get('Triple')).toBe(triple);

    reset('Double');

    expect(_instances_.get('Double')).toBeUndefined();

    const double2 = lookup<Double>('Double');

    expect(double2).toBeInstanceOf(Double);
    expect(_instances_.get('Double')).toBe(double2);

    expect(double === double2).toBeFalsy();
  });

  test('Interfaces : Register, Resolve, Lookup', () => {
    register('Object', ObjectA);

    expect(_container_.has('Object')).toBeTruthy();
    expect(_container_.size).toBe(1);

    const ObjectClass = resolve<IObject>('Object');

    expect(ObjectClass).toBe(ObjectA);

    const object = lookup<IObject>('Object');

    expect(object).toBeInstanceOf(ObjectA);
    expect(object.toString()).toBe('ObjectA');

    unregister('Object');

    expect(_container_.has('Object')).toBeFalsy();
    expect(_container_.size).toBe(0);

    register('Object', ObjectB);

    expect(_container_.has('Object')).toBeTruthy();
    expect(_container_.size).toBe(1);

    const ObjectClass2 = resolve<IObject>('Object');
    expect(ObjectClass2).toBe(ObjectB);

    const object2 = lookup<IObject>('Object');
    expect(object2).toBeInstanceOf(ObjectB);
    expect(object2.toString()).toBe('ObjectB');
  });
});
