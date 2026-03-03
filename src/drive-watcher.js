/**
 * FissionBypass Pro - Google Drive Auto Watcher
 * 
 * FULLY AUTOMATIC - Just run it and drop files!
 * - Auto-detects Google Drive location (ANY location!)
 * - Smart file renaming based on G-code content
 * - Works out of the box, zero config needed
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const GCodeOptimizer = require('./optimizer');

// ============== COMPREHENSIVE AUTO-DETECTION ==============
// Finds Google Drive, OneDrive, Dropbox, iCloud - ANYWHERE!

function findGoogleDrive() {
  console.log('🔍 Searching for cloud drive folders...');
  
  // ===== METHOD 1: Check ALL drive letters for Google Drive Stream =====
  // Google Drive for Desktop mounts as a virtual drive (commonly G:, but can be ANY letter)
  for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
    const drivePaths = [
      `${letter}:\\My Drive`,
      `${letter}:\\Google Drive`,
      `${letter}:\\My Drive\\CNC`,
      `${letter}:\\My Drive\\CNC Files`,
    ];
    for (const drivePath of drivePaths) {
      if (fs.existsSync(drivePath)) {
        console.log(`   ✓ Found Google Drive at: ${drivePath}`);
        return drivePath;
      }
    }
    
    // Check for Google Drive root indicator
    try {
      const testPath = `${letter}:\\`;
      if (fs.existsSync(testPath)) {
        const contents = fs.readdirSync(testPath);
        if (contents.includes('My Drive') || contents.includes('.shortcut-targets-by-id')) {
          const myDrivePath = path.join(testPath, 'My Drive');
          if (fs.existsSync(myDrivePath)) {
            console.log(`   ✓ Found Google Drive at: ${myDrivePath}`);
            return myDrivePath;
          }
        }
      }
    } catch (e) {}
  }
  
  // ===== METHOD 2: Windows Registry lookup for Google Drive =====
  try {
    const regQuery = execSync(
      'reg query "HKEY_CURRENT_USER\\Software\\Google\\DriveFS" /v DefaultMountPoint 2>nul',
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    const match = regQuery.match(/DefaultMountPoint\s+REG_SZ\s+(.+)/);
    if (match && match[1]) {
      const mountPoint = match[1].trim();
      const myDrive = path.join(mountPoint, 'My Drive');
      if (fs.existsSync(myDrive)) {
        console.log(`   ✓ Found Google Drive via registry: ${myDrive}`);
        return myDrive;
      }
    }
  } catch (e) {}
  
  // ===== METHOD 3: Check AppData for Google Drive sync info =====
  const driveStreamRoot = path.join(os.homedir(), 'AppData', 'Local', 'Google', 'DriveFS');
  if (fs.existsSync(driveStreamRoot)) {
    console.log('   Found DriveFS folder, scanning for mount point...');
    // Check all drives again since we know Google Drive is installed
    for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
      try {
        const testPath = `${letter}:\\`;
        if (fs.existsSync(path.join(testPath, 'My Drive'))) {
          console.log(`   ✓ Found Google Drive mount: ${testPath}My Drive`);
          return path.join(testPath, 'My Drive');
        }
      } catch (e) {}
    }
  }
  
  // ===== METHOD 4: User home folder locations =====
  const homePaths = [
    // Google Drive for Desktop / Backup and Sync
    path.join(os.homedir(), 'Google Drive'),
    path.join(os.homedir(), 'GoogleDrive'),
    path.join(os.homedir(), 'My Drive'),
    path.join(os.homedir(), 'Google Drive', 'My Drive'),
    // With CNC subfolders
    path.join(os.homedir(), 'Google Drive', 'CNC'),
    path.join(os.homedir(), 'Google Drive', 'CNC Files'),
    path.join(os.homedir(), 'GoogleDrive', 'CNC'),
    path.join(os.homedir(), 'GoogleDrive', 'CNC Files'),
  ];
  
  for (const p of homePaths) {
    if (fs.existsSync(p)) {
      console.log(`   ✓ Found Google Drive in home: ${p}`);
      return p;
    }
  }
  
  // ===== METHOD 5: Documents folder =====
  const docPaths = [
    path.join(os.homedir(), 'Documents', 'GoogleDrive'),
    path.join(os.homedir(), 'Documents', 'Google Drive'),
    path.join(os.homedir(), 'Documents', 'My Drive'),
    path.join(os.homedir(), 'Documents', 'CNC'),
    path.join(os.homedir(), 'Documents', 'CNC Files'),
  ];
  
  for (const p of docPaths) {
    if (fs.existsSync(p)) {
      console.log(`   ✓ Found cloud/CNC folder in Documents: ${p}`);
      return p;
    }
  }
  
  // ===== METHOD 6: OneDrive =====
  const oneDriveEnv = process.env.OneDrive || process.env.OneDriveConsumer || process.env.OneDriveCommercial;
  if (oneDriveEnv && fs.existsSync(oneDriveEnv)) {
    // Check for CNC folder inside OneDrive
    const oneDriveCNC = [
      path.join(oneDriveEnv, 'CNC'),
      path.join(oneDriveEnv, 'CNC Files'),
    ];
    for (const p of oneDriveCNC) {
      if (fs.existsSync(p)) {
        console.log(`   ✓ Found OneDrive CNC folder: ${p}`);
        return p;
      }
    }
    console.log(`   ✓ Found OneDrive: ${oneDriveEnv}`);
    return oneDriveEnv;
  }
  
  const oneDrivePaths = [
    path.join(os.homedir(), 'OneDrive'),
    path.join(os.homedir(), 'OneDrive', 'CNC'),
    path.join(os.homedir(), 'OneDrive', 'CNC Files'),
    path.join(os.homedir(), 'OneDrive - Personal'),
  ];
  
  for (const p of oneDrivePaths) {
    if (fs.existsSync(p)) {
      console.log(`   ✓ Found OneDrive: ${p}`);
      return p;
    }
  }
  
  // ===== METHOD 7: Dropbox =====
  // Check Dropbox info file for actual location
  const dropboxInfoPaths = [
    path.join(os.homedir(), 'AppData', 'Local', 'Dropbox', 'info.json'),
    path.join(os.homedir(), '.dropbox', 'info.json'),
  ];
  
  for (const infoPath of dropboxInfoPaths) {
    try {
      if (fs.existsSync(infoPath)) {
        const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
        const dropboxPath = info.personal?.path || info.business?.path;
        if (dropboxPath && fs.existsSync(dropboxPath)) {
          console.log(`   ✓ Found Dropbox: ${dropboxPath}`);
          return dropboxPath;
        }
      }
    } catch (e) {}
  }
  
  const dropboxPaths = [
    path.join(os.homedir(), 'Dropbox'),
    path.join(os.homedir(), 'Dropbox', 'CNC'),
    path.join(os.homedir(), 'Dropbox', 'CNC Files'),
  ];
  
  for (const p of dropboxPaths) {
    if (fs.existsSync(p)) {
      console.log(`   ✓ Found Dropbox: ${p}`);
      return p;
    }
  }
  
  // ===== METHOD 8: iCloud Drive =====
  const icloudPaths = [
    path.join(os.homedir(), 'iCloudDrive'),
    path.join(os.homedir(), 'iCloud Drive'),
    path.join(os.homedir(), 'AppData', 'Local', 'Apple Inc', 'CloudKit', 'iCloud~com~apple~CloudDocs'),
  ];
  
  for (const p of icloudPaths) {
    if (fs.existsSync(p)) {
      console.log(`   ✓ Found iCloud: ${p}`);
      return p;
    }
  }
  
  // ===== METHOD 9: Common alternative drive locations =====
  const altPaths = [];
  for (const letter of 'CDEFGHIJ'.split('')) {
    altPaths.push(
      `${letter}:\\Google Drive`,
      `${letter}:\\GoogleDrive`,
      `${letter}:\\My Drive`,
      `${letter}:\\CNC`,
      `${letter}:\\CNC Files`
    );
  }
  
  for (const p of altPaths) {
    if (fs.existsSync(p)) {
      console.log(`   ✓ Found folder: ${p}`);
      return p;
    }
  }
  
  console.log('   ⚠ No cloud drive found, will use Documents folder');
  return null;
}

function findOrCreateCNCFolder() {
  const driveRoot = findGoogleDrive();
  
  if (!driveRoot) {
    // Fallback to Documents if no cloud drive found
    const fallback = path.join(os.homedir(), 'Documents', 'CNC Files');
    console.log(`⚠️  No cloud drive found, using: ${fallback}`);
    if (!fs.existsSync(fallback)) {
      fs.mkdirSync(fallback, { recursive: true });
    }
    return fallback;
  }
  
  // Look for existing CNC-related folders
  const cncFolderNames = ['CNC', 'CNC Files', 'GCode', 'G-Code', 'NC Files', 'Toolpaths', 'CAM', 'Machining'];
  
  try {
    const items = fs.readdirSync(driveRoot);
    for (const name of cncFolderNames) {
      if (items.includes(name)) {
        return path.join(driveRoot, name);
      }
    }
  } catch (e) {}
  
  // If at root of drive (like Documents/GoogleDrive), use it directly
  // Don't create subfolder if user is already pointing to their CNC folder
  if (driveRoot.toLowerCase().includes('cnc') || 
      driveRoot.toLowerCase().includes('gcode') ||
      driveRoot.toLowerCase().includes('nc')) {
    return driveRoot;
  }
  
  // Create default CNC folder
  const cncFolder = path.join(driveRoot, 'CNC Files');
  if (!fs.existsSync(cncFolder)) {
    fs.mkdirSync(cncFolder, { recursive: true });
  }
  return cncFolder;
}

// Auto-detect on startup
const AUTO_WATCH_FOLDER = findOrCreateCNCFolder();

const CONFIG = {
  // Auto-detected folder (or override with --folder flag)
  watchFolder: AUTO_WATCH_FOLDER,
  
  // Where to save optimized files (null = same folder)
  outputFolder: null,
  
  // File extensions to process
  extensions: ['.nc', '.gcode', '.ngc', '.tap'],
  
  // Controller profile - auto or specify
  controller: 'GRBL',
  
  // Material profile - auto-detected from file or default
  material: 'Aluminum',
  
  // ====== YOUR MACHINE LIMITS ======
  // Set your spindle's maximum RPM!
  maxRPM: 8000,  // <-- CHANGE THIS TO YOUR SPINDLE MAX!
  
  // ====== SAFETY ANALYSIS ======
  // Smart detection of dangerous machining conditions
  safetyCheck: true,  // Analyze for dangerous conditions
  
  // Smart rename based on G-code content
  smartRename: true,
  
  // Add suffix to optimized files
  outputSuffix: '_READY',
  
  // Skip files that already have the suffix
  skipAlreadyOptimized: true,
  
  // Process existing files on startup
  processExistingOnStart: true,
  
  // ====== CLEANUP OPTIONS ======
  // Delete useless Fusion parent files (files with no actual G-code)
  deleteParentFiles: true,
  
  // Delete original file after creating optimized version
  deleteOriginalAfterOptimize: true,
  
  // Clean up file names (remove spaces, special chars)
  cleanFileNames: true,
  
  // Polling interval in ms
  pollInterval: 2000,
  
  // Use polling (more reliable for cloud drives)
  usePolling: true,
};

// ============== SMART FILE NAMING ==============

class SmartRenamer {
  /**
   * Extract useful info from G-code content for smart naming
   */
  static extractInfo(content) {
    const info = {
      partName: null,
      partNumber: null,
      material: null,
      tool: null,
      operation: null,
      machine: null,
      date: null,
    };

    const lines = content.split('\n').slice(0, 100); // Check first 100 lines

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip non-comments
      if (!trimmed.startsWith('(') && !trimmed.startsWith(';')) continue;
      
      const comment = trimmed.replace(/^[;(]+\s*/, '').replace(/\s*\)+$/, '').trim();
      const lowerComment = comment.toLowerCase();

      // Part number (look for patterns like "1001", "PART-123", "JOB 456")
      if (!info.partNumber) {
        const partNumMatch = comment.match(/^(\d{3,6})$/);
        if (partNumMatch) {
          info.partNumber = partNumMatch[1];
          continue;
        }
        const jobMatch = comment.match(/(?:part|job|order|po|#)\s*[-:#]?\s*(\w+[-]?\d+)/i);
        if (jobMatch) {
          info.partNumber = jobMatch[1];
        }
      }

      // Part name / description
      if (!info.partName) {
        // Look for descriptive names (all caps with spaces, or "Part Name: xxx")
        const nameMatch = comment.match(/^([A-Z][A-Z\s]+[A-Z])$/);
        if (nameMatch && nameMatch[1].length > 5 && nameMatch[1].length < 50) {
          info.partName = nameMatch[1];
          continue;
        }
        // Named comments
        const labelMatch = comment.match(/(?:name|part|description|desc)\s*[-:=]\s*(.+)/i);
        if (labelMatch) {
          info.partName = labelMatch[1].trim();
        }
      }

      // Material detection
      if (!info.material) {
        const materialKeywords = ['aluminum', 'aluminium', 'steel', 'stainless', 'wood', 'plastic', 
          'acrylic', 'delrin', 'brass', 'bronze', 'copper', 'titanium', 'mdf', 'plywood', 
          'hdpe', 'abs', 'pom', 'nylon', 'foam', 'carbon'];
        for (const mat of materialKeywords) {
          if (lowerComment.includes(mat)) {
            info.material = mat.charAt(0).toUpperCase() + mat.slice(1);
            break;
          }
        }
        // Also check for specific alloys
        if (lowerComment.includes('6061')) info.material = 'Aluminum';
        if (lowerComment.includes('7075')) info.material = 'Aluminum';
        if (lowerComment.includes('4140')) info.material = 'Steel';
        if (lowerComment.includes('304')) info.material = 'Stainless';
        if (lowerComment.includes('316')) info.material = 'Stainless';
      }

      // Tool info
      if (!info.tool) {
        const toolMatch = comment.match(/T(\d+)\s+.*?D\s*=?\s*([\d.]+)\s*(mm|in)?/i);
        if (toolMatch) {
          info.tool = `T${toolMatch[1]}_${toolMatch[2]}${toolMatch[3] || 'mm'}`;
        }
      }

      // Operation type
      if (!info.operation) {
        const opKeywords = ['pocket', 'contour', 'profile', 'drill', 'bore', 'face', 'slot', 
          'engrave', 'adaptive', 'parallel', 'scallop', '2d', '3d', 'thread', 'chamfer'];
        for (const op of opKeywords) {
          if (lowerComment.includes(op)) {
            info.operation = op.charAt(0).toUpperCase() + op.slice(1);
            break;
          }
        }
      }

      // Machine
      if (!info.machine) {
        if (lowerComment.includes('machine:') || lowerComment.includes('cnc')) {
          const machineMatch = comment.match(/machine\s*[-:=]\s*(.+)/i);
          if (machineMatch) {
            info.machine = machineMatch[1].trim();
          }
        }
      }
    }

    return info;
  }

  /**
   * Generate a smart filename from extracted info
   */
  static generateName(content, originalName, suffix = '_READY') {
    const info = this.extractInfo(content);
    const ext = path.extname(originalName);
    const parts = [];

    // Build filename from available info
    if (info.partNumber) {
      parts.push(info.partNumber);
    }

    if (info.partName) {
      // Clean up part name for filename
      let cleanName = info.partName
        .replace(/[<>:"/\\|?*]/g, '') // Remove invalid chars
        .replace(/\s+/g, '_')          // Spaces to underscores
        .substring(0, 30);             // Limit length
      parts.push(cleanName);
    }

    if (info.material && parts.length > 0) {
      parts.push(info.material);
    }

    if (info.operation && parts.length > 0 && parts.length < 3) {
      parts.push(info.operation);
    }

    // If we found useful info, use it
    if (parts.length > 0) {
      return parts.join('_') + suffix + ext;
    }

    // Fallback: clean up original name
    const baseName = path.basename(originalName, ext);
    
    // Remove common junk from Fusion exports
    let cleanBase = baseName
      .replace(/\(\d+\)$/, '')           // Remove (1), (2) suffixes
      .replace(/_\d{8,}$/, '')           // Remove timestamps
      .replace(/[-_]+(setup|op)\d*/gi, '') // Remove setup1, op2 etc
      .replace(/[-_]+copy$/i, '')        // Remove "copy"
      .replace(/[-_]+v?\d+$/i, '')       // Remove version numbers
      .trim();

    if (cleanBase.length < 3) cleanBase = baseName;

    return cleanBase + suffix + ext;
  }
}

// ============== WATCHER CODE ==============

class DriveWatcher {
  constructor(config) {
    this.config = config;
    this.optimizer = new GCodeOptimizer({
      controller: config.controller,
      material: config.material,
      maxRPM: config.maxRPM || 8000,
      safetyCheck: config.safetyCheck !== false,
      verbose: true,
    });
    this.processedFiles = new Set();
    this.fileTimestamps = new Map();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const icons = {
      info: '📁',
      success: '✅',
      error: '❌',
      watch: '👁️',
      process: '⚙️',
      skip: '⏭️',
      rename: '✏️',
      rpm: '🔄',
    };
    console.log(`[${timestamp}] ${icons[type] || '•'} ${message}`);
  }

  getOutputPath(inputPath, content) {
    const dir = this.config.outputFolder || path.dirname(inputPath);
    const originalName = path.basename(inputPath);
    
    if (this.config.smartRename) {
      const smartName = SmartRenamer.generateName(content, originalName, this.config.outputSuffix);
      return path.join(dir, smartName);
    }
    
    const ext = path.extname(inputPath);
    const base = path.basename(inputPath, ext);
    return path.join(dir, `${base}${this.config.outputSuffix}${ext}`);
  }

  /**
   * Check if file is a Fusion 360 "parent" file (no actual G-code, just info)
   */
  isFusionParentFile(content) {
    // Parent files contain this marker and have NO actual G-code
    const hasNoCodeMarker = content.includes('***THIS FILE DOES NOT CONTAIN NC CODE***') ||
                            content.includes('THIS FILE DOES NOT CONTAIN NC CODE');
    
    // Also check if file has any actual G-code commands
    const hasGCode = /^[GMT]\d+/m.test(content) || /^G[0-3]\s/m.test(content);
    
    // If it says no code AND has no G-code, it's a parent file
    return hasNoCodeMarker || (!hasGCode && content.includes('Load tool number'));
  }

  /**
   * Clean up a filename - remove spaces, special chars, make it CNC-friendly
   */
  cleanFileName(fileName) {
    const ext = path.extname(fileName);
    let base = path.basename(fileName, ext);
    
    // Replace spaces with underscores
    base = base.replace(/\s+/g, '_');
    
    // Remove special characters except underscore and dash
    base = base.replace(/[^a-zA-Z0-9_-]/g, '');
    
    // Remove multiple underscores
    base = base.replace(/_+/g, '_');
    
    // Remove leading/trailing underscores
    base = base.replace(/^_+|_+$/g, '');
    
    // Ensure it's not empty
    if (!base) base = 'PART';
    
    return base + ext;
  }

  shouldProcess(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    // Check extension
    if (!this.config.extensions.includes(ext)) {
      return false;
    }
    
    // Skip already optimized files
    if (this.config.skipAlreadyOptimized) {
      const base = path.basename(filePath, ext).toUpperCase();
      if (base.endsWith(this.config.outputSuffix.toUpperCase()) || base.endsWith('_READY') || base.endsWith('_OPTIMIZED')) {
        return false;
      }
    }
    
    return true;
  }

  detectMaterial(content) {
    const info = SmartRenamer.extractInfo(content);
    return info.material || this.config.material;
  }

  async processFile(filePath) {
    try {
      this.log(`Processing: ${path.basename(filePath)}`, 'process');
      
      // Read the file
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if this is a useless Fusion parent file (no actual G-code)
      if (this.isFusionParentFile(content)) {
        this.log(`  → Fusion parent file (no G-code) - SKIPPING`, 'skip');
        if (this.config.deleteParentFiles) {
          fs.unlinkSync(filePath);
          this.log(`  → 🗑️ Deleted useless parent file`, 'info');
        }
        return true;
      }
      
      // Auto-detect material from file
      const detectedMaterial = this.detectMaterial(content);
      if (detectedMaterial !== this.config.material) {
        this.log(`  → Auto-detected material: ${detectedMaterial}`, 'info');
        this.optimizer = new GCodeOptimizer({
          controller: this.config.controller,
          material: detectedMaterial,
          maxRPM: this.config.maxRPM || 8000,
          safetyCheck: this.config.safetyCheck !== false,
          verbose: true,
        });
      }
      
      // Optimize
      const result = this.optimizer.optimize(content);
      
      if (!result.wasHobbyFile) {
        this.log(`  → Not Fusion hobby-limited, optimizing anyway...`, 'info');
      }
      
      // ===== SAFETY ANALYSIS RESULTS =====
      if (result.safetyReport && result.safetyReport.hasIssues) {
        const report = result.safetyReport;
        
        // Critical errors - big warning!
        if (report.errors.length > 0) {
          console.log('');
          console.log('\x1b[41m\x1b[37m ═══════════════════════════════════════════════════════ \x1b[0m');
          console.log('\x1b[41m\x1b[37m    🚨 CRITICAL SAFETY ISSUES DETECTED! 🚨              \x1b[0m');
          console.log('\x1b[41m\x1b[37m ═══════════════════════════════════════════════════════ \x1b[0m');
          for (const err of report.errors) {
            console.log(`\x1b[31m   ${err.message}\x1b[0m`);
            if (err.suggestion) {
              console.log(`\x1b[33m   → FIX: ${err.suggestion}\x1b[0m`);
            }
            console.log(`\x1b[90m   Line ${err.line}: ${err.code}\x1b[0m`);
          }
          console.log('');
        }
        
        // Warnings
        if (report.warnings.length > 0) {
          console.log('\x1b[33m ⚠️  WARNINGS:\x1b[0m');
          for (const warn of report.warnings) {
            console.log(`\x1b[33m   • ${warn.message}\x1b[0m`);
          }
          console.log('');
        }
        
        // Suggestions
        if (report.suggestions.length > 0) {
          console.log('\x1b[36m 💡 SUGGESTIONS:\x1b[0m');
          for (const sug of report.suggestions) {
            console.log(`\x1b[36m   • ${sug.message}\x1b[0m`);
          }
          console.log('');
        }
        
        this.log(`  → Safety check: ${report.errors.length} critical, ${report.warnings.length} warnings`, 'info');
      } else {
        this.log(`  → ✓ Safety check passed - no issues detected`, 'success');
      }
      
      // Log RPM capping if it happened
      if (result.stats.rpmCapped > 0) {
        this.log(`  → ⚠️ RPM CAPPED: ${result.stats.originalRPM} → ${result.stats.cappedToRPM} (${result.stats.rpmCapped} commands)`, 'rpm');
      }
      
      // Generate smart output path with clean name
      let outputPath = this.getOutputPath(filePath, content);
      
      // Clean up the output filename if enabled
      if (this.config.cleanFileNames) {
        const dir = path.dirname(outputPath);
        const cleanName = this.cleanFileName(path.basename(outputPath));
        outputPath = path.join(dir, cleanName);
      }
      
      // Write optimized file
      fs.writeFileSync(outputPath, result.content, 'utf8');
      
      // Log results
      const inputName = path.basename(filePath);
      const outputName = path.basename(outputPath);
      
      if (inputName !== outputName.replace(this.config.outputSuffix, '').replace('_READY', '')) {
        this.log(`  → Renamed: ${inputName} → ${outputName}`, 'rename');
      }
      
      this.log(`✅ Optimized: ${outputName}`, 'success');
      if (result.stats.rapidsRestored > 0) {
        this.log(`  → Rapids restored: ${result.stats.rapidsRestored}`, 'info');
      }
      
      // Delete original file if configured
      if (this.config.deleteOriginalAfterOptimize && filePath !== outputPath) {
        fs.unlinkSync(filePath);
        this.log(`  → 🗑️ Deleted original: ${inputName}`, 'info');
      }
      
      // Mark as processed
      this.processedFiles.add(filePath);
      
      return true;
    } catch (error) {
      this.log(`Error processing ${filePath}: ${error.message}`, 'error');
      return false;
    }
  }

  async scanFolder() {
    try {
      const files = fs.readdirSync(this.config.watchFolder);
      
      for (const file of files) {
        const filePath = path.join(this.config.watchFolder, file);
        
        // Skip directories
        if (fs.statSync(filePath).isDirectory()) continue;
        
        // Check if we should process
        if (!this.shouldProcess(filePath)) continue;
        
        // Get file stats
        // Check if file still exists (may have been deleted/processed)
        if (!fs.existsSync(filePath)) continue;
        
        const stats = fs.statSync(filePath);
        const mtime = stats.mtimeMs;
        
        // Check if file is new or modified
        const prevMtime = this.fileTimestamps.get(filePath);
        
        if (!prevMtime || mtime > prevMtime) {
          // Wait a moment to ensure file is fully written
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Re-check if file still exists
          if (!fs.existsSync(filePath)) {
            this.fileTimestamps.delete(filePath);
            continue;
          }
          
          // Re-check mtime to ensure write is complete
          const newStats = fs.statSync(filePath);
          if (newStats.mtimeMs === mtime) {
            await this.processFile(filePath);
          }
          
          // Update timestamp only if file still exists
          if (fs.existsSync(filePath)) {
            this.fileTimestamps.set(filePath, newStats.mtimeMs);
          } else {
            this.fileTimestamps.delete(filePath);
          }
        }
      }
    } catch (error) {
      // Ignore ENOENT errors (file deleted during scan)
      if (!error.message.includes('ENOENT')) {
        this.log(`Error scanning folder: ${error.message}`, 'error');
      }
    }
  }

  startPolling() {
    this.log(`Starting polling watcher (${this.config.pollInterval}ms interval)...`, 'watch');
    
    // Initial scan
    this.scanFolder();
    
    // Poll for changes
    setInterval(() => this.scanFolder(), this.config.pollInterval);
  }

  startFsWatch() {
    this.log(`Starting filesystem watcher...`, 'watch');
    
    const watcher = fs.watch(this.config.watchFolder, (eventType, filename) => {
      if (!filename) return;
      
      const filePath = path.join(this.config.watchFolder, filename);
      
      if (!this.shouldProcess(filePath)) return;
      
      // Debounce - wait for file to be fully written
      setTimeout(async () => {
        if (fs.existsSync(filePath)) {
          await this.processFile(filePath);
        }
      }, 1000);
    });

    watcher.on('error', (error) => {
      this.log(`Watcher error: ${error.message}`, 'error');
    });

    // Process existing files if configured
    if (this.config.processExistingOnStart) {
      this.scanFolder();
    }
  }

  start() {
    // Check if folder exists
    if (!fs.existsSync(this.config.watchFolder)) {
      this.log(`Watch folder doesn't exist: ${this.config.watchFolder}`, 'error');
      this.log(`Creating folder...`, 'info');
      try {
        fs.mkdirSync(this.config.watchFolder, { recursive: true });
        this.log(`Created: ${this.config.watchFolder}`, 'success');
      } catch (error) {
        this.log(`Failed to create folder: ${error.message}`, 'error');
        process.exit(1);
      }
    }

    // Create output folder if specified
    if (this.config.outputFolder && !fs.existsSync(this.config.outputFolder)) {
      fs.mkdirSync(this.config.outputFolder, { recursive: true });
    }

    console.log('\n' + '='.repeat(60));
    console.log('🚀 FissionBypass Pro - Google Drive Auto Watcher');
    console.log('='.repeat(60));
    console.log(`📂 Watching: ${this.config.watchFolder}`);
    console.log(`🎯 Controller: ${this.config.controller}`);
    console.log(`🪵 Material: ${this.config.material}`);
    console.log(`� Max RPM: ${this.config.maxRPM || 8000}`);
    console.log(`�📄 Extensions: ${this.config.extensions.join(', ')}`);
    console.log('='.repeat(60));
    console.log('Drop .nc files into the folder and they will be auto-optimized!');
    console.log('Press Ctrl+C to stop.\n');

    if (this.config.usePolling) {
      this.startPolling();
    } else {
      this.startFsWatch();
    }
  }
}

// ============== CLI HANDLING ==============

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...CONFIG };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--folder' || arg === '-f') {
      config.watchFolder = args[++i];
    } else if (arg === '--controller' || arg === '-c') {
      config.controller = args[++i];
    } else if (arg === '--material' || arg === '-m') {
      config.material = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      config.outputFolder = args[++i];
    } else if (arg === '--rpm' || arg === '-r') {
      config.maxRPM = parseInt(args[++i]);
    } else if (arg === '--process-existing') {
      config.processExistingOnStart = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
FissionBypass Pro - Google Drive Auto Watcher

USAGE:
  node drive-watcher.js [options]

OPTIONS:
  -f, --folder <path>      Watch folder path (default: auto-detected Google Drive)
  -c, --controller <name>  Controller profile (default: GRBL)
  -m, --material <name>    Material profile (default: Aluminum)
  -r, --rpm <number>       MAX spindle RPM for your machine (default: 8000)
  -o, --output <path>      Output folder (default: same as input)
  --process-existing       Process existing files on startup
  -h, --help               Show this help

CONTROLLERS:
  GRBL, Mach3, Mach4, LinuxCNC, FANUC, HAAS, SIEMENS, MAZAK, OKUMA,
  TORMACH, SHOPBOT, CENTROID

MATERIALS:
  Aluminum, Steel, Stainless, Titanium, Brass, Bronze, Copper,
  Delrin, Acrylic, HDPE, G10/FR4, Carbon Fiber, Cast Iron, Wood, MDF

EXAMPLES:
  node drive-watcher.js --rpm 8000
  node drive-watcher.js -f "G:\\My Drive\\CNC" -r 10000 -c GRBL
  node drive-watcher.js --folder "D:\\GDrive\\CNC Files" --rpm 24000
`);
      process.exit(0);
    } else if (arg === '--update' || arg === '-u') {
      // Check for updates
      checkForUpdates(true);
      process.exit(0);
    }
  }
  
  return config;
}

// Auto-update check
async function checkForUpdates(interactive = false) {
  try {
    const Updater = require('./updater');
    const updater = new Updater({ silent: !interactive });
    
    const result = await updater.checkForUpdate();
    
    if (result.available) {
      console.log('\n🎉 UPDATE AVAILABLE!');
      console.log(`   Current: v${result.currentVersion}`);
      console.log(`   Latest:  v${result.latestVersion}`);
      
      if (interactive && result.downloadUrl) {
        console.log('\nDownloading and installing update...');
        await updater.performUpdate(result.downloadUrl);
      } else {
        console.log(`   Download: ${result.releasePage || 'https://github.com/DeadlySIn777/Fissionbypass/releases'}`);
      }
    }
  } catch (error) {
    // Silently ignore update check failures
    if (interactive) {
      console.log('Could not check for updates:', error.message);
    }
  }
}

// Main entry point
if (require.main === module) {
  const config = parseArgs();
  const watcher = new DriveWatcher(config);
  
  // Check for updates in background (non-blocking)
  checkForUpdates(false);
  
  watcher.start();
}

module.exports = { DriveWatcher, CONFIG, SmartRenamer };
