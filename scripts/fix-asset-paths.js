const fs = require('fs');
const path = require('path');

/**
 * Recursively find all files in a directory
 * @param {string} dir - Directory to search
 * @param {string[]} extensions - File extensions to process
 * @returns {string[]} Array of file paths
 */
function findFiles(dir, extensions = ['.html', '.css', '.js']) {
  const files = [];

  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} does not exist`);
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, extensions));
    } else if (extensions.some((ext) => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Fix asset paths in a file
 * @param {string} filePath - Path to the file to fix
 */
function fixAssetPaths(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Replace "/assets/ with "./assets/ (with quotes)
    content = content.replace(/\"\/assets\//g, '"./assets/');

    // Replace '/assets/ with './assets/ (with single quotes)
    content = content.replace(/\'\/assets\//g, "'./assets/");

    // Replace url(/assets/ with url(./assets/ (for CSS)
    content = content.replace(/url\(\/assets\//g, 'url(./assets/');

    // Replace src="/assets/ with src="./assets/ (for HTML)
    content = content.replace(/src=\"\/assets\//g, 'src="./assets/');

    // Replace href="/assets/ with href="./assets/ (for HTML)
    content = content.replace(/href=\"\/assets\//g, 'href="./assets/');

    // Replace "assets/assets/" with "assets/" (with double quotes)
    content = content.replace(/\"assets\/assets\//g, '"assets/');

    // Replace 'assets/assets/' with 'assets/' (with single quotes)
    content = content.replace(/\'assets\/assets\//g, "'assets/");

    // Replace url(assets/assets/ with url(assets/ (for CSS)
    content = content.replace(/url\(assets\/assets\//g, 'url(assets/');
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed asset paths in: ${path.relative(process.cwd(), filePath)}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main function to fix all asset paths in the build directory
 */
function main(target) {
  const buildDir = path.join(process.cwd(), target);
  if (!fs.existsSync(buildDir)) {
    throw new Error(`Build directory not found: ${buildDir}`);
  }
  console.log('🔍 Searching for files to fix asset paths...');
  console.log(`📁 Build directory: ${buildDir}\n`);

  // Find all HTML, CSS, and JS files
  const files = findFiles(buildDir, ['.html', '.css', '.js']);

  if (files.length === 0) {
    console.log('📭 No files found to process');
    return;
  }

  console.log(`📋 Found ${files.length} files to process:\n`);

  let fixedCount = 0;

  // Process each file
  for (const file of files) {
    const wasFixed = fixAssetPaths(file);
    if (wasFixed) {
      fixedCount++;
    }
  }

  console.log(`\n🎉 Complete! Fixed asset paths in ${fixedCount} out of ${files.length} files`);

  if (fixedCount === 0) {
    console.log('ℹ️  All asset paths were already correct');
  }
}

// Run the script
if (require.main === module) {
  const targetSet = process.argv[2];
  const target = process.argv[3];
  if (!targetSet || !target) {
    console.error('Please provide a target directory ("dist" or "game-dist")');
    process.exit(1);
  }

  if (!['dist', 'game-dist'].includes(target)) {
    console.error('Target directory invalid ("dist" or "game-dist")');
  }

  console.log(target);
  main(target);
}

module.exports = { fixAssetPaths, findFiles };
