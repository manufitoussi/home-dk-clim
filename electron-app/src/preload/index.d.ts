import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      settings: {
        setTitle: (title: string) => Promise<void>;
        getTitle: () => string;
      };
    };
  }
}

export { };
