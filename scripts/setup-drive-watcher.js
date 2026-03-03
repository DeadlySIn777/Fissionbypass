/**
 * FissionBypass Pro - Setup Script for Google Drive Watcher
 * 
 * Run this to configure your Google Drive watch folder
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function findGoogleDrive() {
  // Common Google Drive locations on Windows
  const possiblePaths = [
    'G:\\My Drive',
    'G:\\Shared drives',
    `${process.env.USERPROFILE}\\Google Drive`,
    `${process.env.USERPROFILE}\\My Drive`,
    'C:\\Users\\*\\Google Drive',
    'D:\\Google Drive',
  ];

  // Check for Google Drive stream (newer)
  for (const letter of 'GHIJKLMNOPQRSTUVWXYZ'.split('')) {
    const drivePath = `${letter}:\\My Drive`;
    if (fs.existsSync(drivePath)) {
      return drivePath;
    }
  }

  // Check user profile paths
  const userDrive = path.join(process.env.USERPROFILE, 'Google Drive');
  if (fs.existsSync(userDrive)) {
    return userDrive;
  }

  return null;
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 FissionBypass Pro - Google Drive Setup Wizard');
  console.log('='.repeat(60) + '\n');

  // Try to find Google Drive
  console.log('🔍 Searching for Google Drive...');
  const foundDrive = await findGoogleDrive();

  let watchFolder;
  
  if (foundDrive) {
    console.log(`✅ Found Google Drive at: ${foundDrive}\n`);
    
    const useFound = await question(`Use this location? (Y/n): `);
    
    if (useFound.toLowerCase() !== 'n') {
      const subfolder = await question(`Subfolder name for CNC files (default: CNC Files): `);
      watchFolder = path.join(foundDrive, subfolder || 'CNC Files');
    }
  } else {
    console.log('⚠️  Could not auto-detect Google Drive location.\n');
  }

  if (!watchFolder) {
    watchFolder = await question('Enter the full path to your CNC files folder: ');
  }

  // Controller selection
  console.log('\n📋 Available Controllers:');
  const controllers = ['GRBL', 'Mach3', 'Mach4', 'LinuxCNC', 'FANUC', 'HAAS', 'TORMACH', 'SHOPBOT'];
  controllers.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  
  const controllerChoice = await question('\nSelect controller (1-8, default: 1 for GRBL): ');
  const controller = controllers[parseInt(controllerChoice) - 1] || 'GRBL';

  // Material selection
  console.log('\n🪵 Available Materials:');
  const materials = ['Aluminum', 'Steel', 'Wood', 'Acrylic', 'Brass', 'Delrin', 'HDPE', 'MDF'];
  materials.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));
  
  const materialChoice = await question('\nSelect default material (1-8, default: 1 for Aluminum): ');
  const material = materials[parseInt(materialChoice) - 1] || 'Aluminum';

  // Create folder if needed
  if (!fs.existsSync(watchFolder)) {
    console.log(`\n📁 Creating folder: ${watchFolder}`);
    fs.mkdirSync(watchFolder, { recursive: true });
  }

  // Update config in drive-watcher.js
  const watcherPath = path.join(__dirname, '..', 'src', 'drive-watcher.js');
  let watcherContent = fs.readFileSync(watcherPath, 'utf8');
  
  // Replace config values
  watcherContent = watcherContent.replace(
    /watchFolder: '.*?'/,
    `watchFolder: '${watchFolder.replace(/\\/g, '\\\\')}'`
  );
  watcherContent = watcherContent.replace(
    /controller: '.*?'/,
    `controller: '${controller}'`
  );
  watcherContent = watcherContent.replace(
    /material: '.*?'/,
    `material: '${material}'`
  );

  fs.writeFileSync(watcherPath, watcherContent);

  // Create a convenient shortcut batch file
  const shortcutContent = `@echo off
cd /d "${path.join(__dirname, '..')}"
node src\\drive-watcher.js
pause
`;
  
  const desktopPath = path.join(process.env.USERPROFILE, 'Desktop', 'FissionBypass Watcher.bat');
  
  const createShortcut = await question('\nCreate desktop shortcut? (Y/n): ');
  if (createShortcut.toLowerCase() !== 'n') {
    fs.writeFileSync(desktopPath, shortcutContent);
    console.log(`✅ Created: ${desktopPath}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ SETUP COMPLETE!');
  console.log('='.repeat(60));
  console.log(`\n📂 Watch folder: ${watchFolder}`);
  console.log(`🎯 Controller: ${controller}`);
  console.log(`🪵 Material: ${material}`);
  console.log('\n📋 How to use:');
  console.log('  1. Run: npm run watch');
  console.log('  2. Or double-click: scripts\\start-drive-watcher.bat');
  console.log('  3. Drop .nc files into your Google Drive folder');
  console.log('  4. Optimized files appear automatically!\n');

  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});
