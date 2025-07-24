import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import copyGameCanvas from './build-lib/build-game.js';

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
    copyGameCanvas(),
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
