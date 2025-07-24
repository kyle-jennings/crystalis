import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import eslint from 'vite-plugin-eslint';

const root = path.resolve(__dirname, '..');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      ...eslint(
        {
          failOnWarning: false,
          failOnError: true,
        },
      ),
      apply: 'build',
    },
    {
      ...eslint({
        failOnWarning: false,
        failOnError: true,
      }),
      apply: 'serve',
      enforce: 'post',
    },
  ],
  root: '.',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 8000,
    open: true,
  },
  // resolve: {
  //   alias: {
  //     '@': path.resolve(root, 'src'),
  //   },
  // },
});
