/**
 * FissionBypass Pro - Auto-Startup Installer
 * 
 * Installs the Drive Watcher to run automatically on Windows startup
 * Run with: npm run install-startup
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Get paths
const projectDir = path.join(__dirname, '..');
const startupFolder = path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup');
const vbsPath = path.join(startupFolder, 'FissionBypass_Watcher.vbs');
const batPath = path.join(projectDir, 'scripts', 'start-drive-watcher-hidden.bat');

// Create hidden batch file (runs without console window flash)
const batContent = `@echo off
cd /d "${projectDir}"
node src\\drive-watcher.js
`;

// VBS script to run batch hidden (no window)
const vbsContent = `Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "${batPath.replace(/\\/g, '\\\\')}" & Chr(34), 0
Set WshShell = Nothing
`;

function install() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 FissionBypass Pro - Auto-Startup Installer');
  console.log('='.repeat(60) + '\n');

  try {
    // Create hidden batch file
    fs.writeFileSync(batPath, batContent);
    console.log(`✅ Created: ${batPath}`);

    // Create VBS in startup folder
    fs.writeFileSync(vbsPath, vbsContent);
    console.log(`✅ Created: ${vbsPath}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ AUTO-STARTUP INSTALLED!');
    console.log('='.repeat(60));
    console.log('\nFissionBypass will now start automatically when Windows boots.');
    console.log('It runs silently in the background - no window!');
    console.log('\nTo uninstall: npm run uninstall-startup');
    console.log('To test now: npm run watch\n');

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

function uninstall() {
  console.log('\n' + '='.repeat(60));
  console.log('🗑️  FissionBypass Pro - Auto-Startup Uninstaller');
  console.log('='.repeat(60) + '\n');

  let removed = 0;

  if (fs.existsSync(vbsPath)) {
    fs.unlinkSync(vbsPath);
    console.log(`✅ Removed: ${vbsPath}`);
    removed++;
  }

  if (fs.existsSync(batPath)) {
    fs.unlinkSync(batPath);
    console.log(`✅ Removed: ${batPath}`);
    removed++;
  }

  if (removed > 0) {
    console.log('\n✅ Auto-startup has been disabled.');
  } else {
    console.log('ℹ️  No startup files found - already uninstalled.');
  }
}

// Check command
const command = process.argv[2];

if (command === 'uninstall' || command === '--uninstall' || command === '-u') {
  uninstall();
} else {
  install();
}
