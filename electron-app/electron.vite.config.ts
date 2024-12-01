import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
// const is = { dev: process.env.NODE_ENV === 'development' };

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  // ...(is.dev ? {} : { renderer: {} }),
})
