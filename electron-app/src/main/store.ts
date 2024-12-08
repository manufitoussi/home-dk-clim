import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

// Schema is key-value pairs
export type Schema = Record<string, any>;

export default class Store<T extends Schema> {
  private data: T;
  private filePath: string;

  constructor({ fileName = 'store.json', defaults = {} as T }: { fileName: string, defaults: T }) {
    const userDataPath = app.getPath('userData');
    console.log('userDataPath', userDataPath);
    this.filePath = path.join(userDataPath, fileName);
    try {
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify(defaults));
      }

      this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    } catch (error) {
      console.error(error);
      this.data = defaults as T;
    }
  }

  // Get a value from the store
  get(path: string): any {
    return path.split('.').reduce((prev, curr) => prev && prev[curr], this.data);
  }

  // Set a value in the store
  set(path: string, value: any): void {
    const pathArr = path.split('.');
    const lastKey = pathArr.pop() as string;
    const parent = pathArr.reduce((prev, curr) => {
      if (!prev[curr]) {
        throw new Error(`Path does not exist in store: ${this.filePath}@${path}`);
      }

      return prev[curr];
    }, this.data) as Record<string, any>;
    parent[lastKey] = value;
    this.save();
  }

  // Delete a value from the store
  delete(path: string): void {
    const pathArr = path.split('.');
    const lastKey = pathArr.pop() as string;
    const parent = pathArr.reduce((prev, curr) => {
      if (!prev[curr]) {
        throw new Error(`[Store] Path does not exist in store: ${this.filePath}@${path}`);
      }

      return prev[curr];
    }, this.data) as Record<string, any>;
    delete parent[lastKey];
    this.save();
  }

  // Save the current state to disk
  private save(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data));
    } catch (error) {
      console.error(error);
    }
  }
}

