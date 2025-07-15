import { app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

// Schema is key-value pairs
export type Schema = Record<string, any>;

export default class Store<T extends Schema> {
  private data: T;
  private filePath: string;
  private picturesPath: string;

  constructor({ fileName = 'store.json', defaults = {} as T }: { fileName: string; defaults: T }) {
    const userDataPath = app.getPath('userData');
    this.picturesPath = path.join(userDataPath, 'device_pictures');
    if (!fs.existsSync(this.picturesPath)) {
      fs.mkdirSync(this.picturesPath);
    }

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

  savePicture(base64: string, oldFilePath: string | null): string | null {
    try {
      console.log(`[Store] savePicture: oldFilePath = ${oldFilePath}`);
      const matches = base64.match(/^data:(.+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 string');
      }

      const fileExtension = matches[1].split('/')[1];
      const buffer = Buffer.from(matches[2], 'base64');
      const fileName = `${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
      const filePath = path.join(this.picturesPath, fileName);
      fs.writeFileSync(filePath, buffer);

      if (oldFilePath) {
        this.deletePicture(oldFilePath);
      }

      return filePath;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  deletePicture(filePath: string): boolean {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.log(`[Store] deletePicture: File not found at ${filePath}`);
      }
      return true;
    } catch (error) {
      console.error(`[Store] deletePicture: Error deleting ${filePath}:`, error);
      return false;
    }
  }

  getPicture(filePath: string): string | null {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }
      const file = fs.readFileSync(filePath);
      const mimeType = `image/${path.extname(filePath).slice(1)}`;
      return `data:${mimeType};base64,${file.toString('base64')}`;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
