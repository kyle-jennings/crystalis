import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import path from 'path';
// import copyGameCanvas from './build-lib/build-game.js';

const root = path.resolve(__dirname);
const src = path.resolve(root, 'src');
const gameRoot = path.resolve(root, 'src', 'game');

export default defineConfig(({ mode }) => {
  const isGameBuild = mode === 'game';

  return {
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
      // copyGameCanvas(),
    ],
    root: '.',
    build: {
      outDir: isGameBuild ? 'game-dist' : 'dist',
      rollupOptions: isGameBuild ? {
        input: path.resolve(__dirname, 'game.html'),
      } : undefined,
      // rollupOptions: isGameBuild ? {
      //   main: path.resolve(__dirname, 'game.ts')
      // } : undefined,
    },
    server: {
      port: 8000,
      open: true,
    },
    resolve: {
      alias: {
        '@': src,
        '@game': gameRoot,
        '@types': path.resolve(root, 'types'),
      },
    },
  };
});
