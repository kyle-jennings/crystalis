import path from 'path';
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
} from 'fs';

// Custom plugin to copy GameCanvas contents to game folder
export default function copyGameCanvas() {
  return {
    name: 'copy-game-canvas',
    writeBundle() {
      const sourceDir = path.resolve(process.cwd(), 'src/components/GameCanvas/lib');
      const targetDir = path.resolve(process.cwd(), 'game');

      // Function to recursively copy directory
      function copyDirectory(src, dest) {
        try {
          mkdirSync(dest, { recursive: true });

          const entries = readdirSync(src, { withFileTypes: true });

          entries.forEach((entry) => {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
              copyDirectory(srcPath, destPath);
            } else {
              copyFileSync(srcPath, destPath);
            }
          });

          // eslint-disable-next-line no-console
          console.log(`✅ Copied GameCanvas contents to ${targetDir}`);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('❌ Error copying GameCanvas:', error);
        }
      }

      copyDirectory(sourceDir, targetDir);
    },
  };
}
