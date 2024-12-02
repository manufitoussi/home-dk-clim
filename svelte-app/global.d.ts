
declare global {
  interface Window {
    api: {
      settings: {
        setTitle: (title: string) => Promise<void>;
        getTitle: () => string;
      };
    };
  }
}

export { };
