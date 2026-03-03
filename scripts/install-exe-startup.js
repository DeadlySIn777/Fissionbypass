/**
 * FissionBypass Pro - EXE Startup Installer
 * Installs FissionBypass.exe to run on Windows startup
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const CONFIG = {
  appName: 'FissionBypass',
  exeName: 'FissionBypass.exe',
  watchFolder: null, // Auto-detect
  maxRPM: 8000
};

// Paths
const projectRoot = path.resolve(__dirname, '..');
const distFolder = path.join(projectRoot, 'dist');
const sourceExe = path.join(distFolder, CONFIG.exeName);

// Install locations
const programFolder = path.join(os.homedir(), 'AppData', 'Local', 'FissionBypass');
const installedExe = path.join(programFolder, CONFIG.exeName);
const startupFolder = path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
const startupVbs = path.join(startupFolder, 'FissionBypass.vbs');
const configFile = path.join(programFolder, 'config.json');

// Auto-detect Google Drive
function detectGoogleDrive() {
  const possiblePaths = [
    'G:\\My Drive\\CNC Files',
    'G:\\My Drive',
    path.join(os.homedir(), 'Google Drive', 'CNC Files'),
    path.join(os.homedir(), 'Google Drive'),
    path.join(os.homedir(), 'Documents', 'GoogleDrive'),
    path.join(os.homedir(), 'Documents', 'CNC Files'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return path.join(os.homedir(), 'Documents', 'CNC Files');
}

function install() {
  console.log('========================================');
  console.log('🚀 FissionBypass Pro - Installer');
  console.log('========================================\n');

  // Check if exe exists
  if (!fs.existsSync(sourceExe)) {
    console.error(`❌ ERROR: ${CONFIG.exeName} not found in dist folder!`);
    console.log('Run: npm run build');
    process.exit(1);
  }

  // Create program folder
  if (!fs.existsSync(programFolder)) {
    fs.mkdirSync(programFolder, { recursive: true });
    console.log(`📁 Created: ${programFolder}`);
  }

  // Copy exe
  console.log(`📦 Installing ${CONFIG.exeName}...`);
  fs.copyFileSync(sourceExe, installedExe);
  console.log(`   → ${installedExe}`);

  // Detect watch folder
  const watchFolder = CONFIG.watchFolder || detectGoogleDrive();
  
  // Create config file
  const config = {
    watchFolder: watchFolder,
    maxRPM: CONFIG.maxRPM,
    controller: 'GRBL',
    material: 'Aluminum',
    deleteParentFiles: true,
    deleteOriginalAfterOptimize: true,
    checkForUpdates: true
  };
  
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
  console.log(`⚙️  Config saved: ${configFile}`);
  console.log(`   → Watch folder: ${watchFolder}`);
  console.log(`   → Max RPM: ${CONFIG.maxRPM}`);

  // Create startup VBS script (runs hidden)
  const vbsContent = `' FissionBypass Pro - Auto Startup
' Runs minimized on Windows startup

Set WshShell = CreateObject("WScript.Shell")
WshShell.Run """${installedExe}"" -f ""${watchFolder.replace(/\\/g, '\\\\')}"" --process-existing", 0, False
`;

  fs.writeFileSync(startupVbs, vbsContent);
  console.log(`🚀 Startup enabled: ${startupVbs}`);

  // Create uninstaller
  const uninstallerPath = path.join(programFolder, 'uninstall.bat');
  const uninstallerContent = `@echo off
echo Uninstalling FissionBypass Pro...
taskkill /F /IM FissionBypass.exe 2>nul
del "${startupVbs}" 2>nul
rmdir /S /Q "${programFolder}"
echo FissionBypass Pro has been uninstalled.
pause
`;
  fs.writeFileSync(uninstallerPath, uninstallerContent);
  console.log(`🗑️  Uninstaller: ${uninstallerPath}`);

  // Create desktop shortcut
  const desktopFolder = path.join(os.homedir(), 'Desktop');
  const desktopShortcutVbs = `
Set WshShell = CreateObject("WScript.Shell")
Set shortcut = WshShell.CreateShortcut("${path.join(desktopFolder, 'FissionBypass.lnk')}")
shortcut.TargetPath = "${installedExe}"
shortcut.Arguments = "-f ""${watchFolder}"""
shortcut.WorkingDirectory = "${programFolder}"
shortcut.Description = "FissionBypass Pro - CNC G-Code Optimizer"
shortcut.Save
`;
  const tempVbs = path.join(os.tmpdir(), 'create_shortcut.vbs');
  fs.writeFileSync(tempVbs, desktopShortcutVbs);
  
  try {
    require('child_process').execSync(`cscript //nologo "${tempVbs}"`, { stdio: 'pipe' });
    fs.unlinkSync(tempVbs);
    console.log(`🖥️  Desktop shortcut created`);
  } catch (e) {
    console.log(`⚠️  Could not create desktop shortcut`);
  }

  // Copy welcome page
  const welcomeSource = path.join(projectRoot, 'assets', 'welcome.html');
  const welcomeDest = path.join(programFolder, 'welcome.html');
  if (fs.existsSync(welcomeSource)) {
    fs.copyFileSync(welcomeSource, welcomeDest);
    console.log(`📄 Welcome page: ${welcomeDest}`);
    
    // Open welcome page in browser
    try {
      require('child_process').exec(`start "" "${welcomeDest}"`);
      console.log(`🌐 Opening welcome page in browser...`);
    } catch (e) {
      // Ignore
    }
  }

  console.log('\n========================================');
  console.log('✅ INSTALLATION COMPLETE!');
  console.log('========================================');
  console.log(`\nFissionBypass will now:`);
  console.log(`  • Start automatically when Windows boots`);
  console.log(`  • Run hidden in the background`);
  console.log(`  • Watch: ${watchFolder}`);
  console.log(`  • Auto-optimize any .nc files dropped there`);
  console.log(`\nTo start now, run:`);
  console.log(`  "${installedExe}"`);
  console.log(`\nTo uninstall:`);
  console.log(`  "${uninstallerPath}"`);
  
  // Auto-start the watcher now
  try {
    require('child_process').spawn(installedExe, ['-f', watchFolder, '--process-existing'], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    }).unref();
    console.log(`\n🚀 FissionBypass is now running!`);
  } catch (e) {
    console.log(`\n⚠️  Please start FissionBypass manually or restart your PC`);
  }
}

function uninstall() {
  console.log('========================================');
  console.log('🗑️  FissionBypass Pro - Uninstaller');
  console.log('========================================\n');

  // Kill running instances
  try {
    require('child_process').execSync('taskkill /F /IM FissionBypass.exe', { stdio: 'pipe' });
    console.log('✅ Stopped running instance');
  } catch (e) {
    // Not running
  }

  // Remove startup
  if (fs.existsSync(startupVbs)) {
    fs.unlinkSync(startupVbs);
    console.log('✅ Removed from startup');
  }

  // Remove program folder
  if (fs.existsSync(programFolder)) {
    fs.rmSync(programFolder, { recursive: true, force: true });
    console.log('✅ Removed program files');
  }

  // Remove desktop shortcut
  const shortcutPath = path.join(os.homedir(), 'Desktop', 'FissionBypass.lnk');
  if (fs.existsSync(shortcutPath)) {
    fs.unlinkSync(shortcutPath);
    console.log('✅ Removed desktop shortcut');
  }

  console.log('\n✅ FissionBypass Pro has been uninstalled');
}

// Main
const args = process.argv.slice(2);
if (args.includes('uninstall') || args.includes('--uninstall') || args.includes('-u')) {
  uninstall();
} else {
  install();
}
