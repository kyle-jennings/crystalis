import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import path from 'path';

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
    ],
    root: '.',
    build: {
      outDir: isGameBuild ? 'game-dist' : 'dist',
      rollupOptions: isGameBuild ? {
        input: {
          index: path.resolve(__dirname, 'game.html'),
        },
        output: {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      } : undefined,
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
