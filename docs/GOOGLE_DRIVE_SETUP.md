# Google Drive Auto-Watch Setup Guide

## 🚀 Quick Start (ONE CLICK!)

FissionBypass Pro automatically watches your cloud drive folder and optimizes `.nc` files the moment you upload them!

### ⚡ Installation

**Just double-click `INSTALL.bat` - that's it!**

The installer will automatically:
- ✅ Install Node.js (if not installed)
- ✅ Auto-detect your cloud drive (Google Drive, OneDrive, Dropbox, iCloud)
- ✅ Create a CNC Files folder if needed
- ✅ Install auto-startup (runs on Windows boot)
- ✅ Start watching immediately

**No prerequisites needed!** Everything is installed automatically.

---

## 📋 Advanced Options (Not Required)

If you're a developer or want manual control:

### Interactive Setup Wizard

```bash
npm run setup
```

This lets you:
- Choose a specific folder to watch
- Select controller and material profiles
- Create the watch folder

### Manual Configuration

Edit `src/drive-watcher.js` and modify the `CONFIG` section:

```javascript
const CONFIG = {
  // Override auto-detection with your folder path
  watchFolder: 'D:\\MyCustomFolder\\CNC',
  
  // Controller: GRBL, Mach3, Mach4, LinuxCNC, FANUC, HAAS, etc.
  controller: 'GRBL',
  
  // Material: Aluminum, Steel, Wood, Acrylic, etc.
  material: 'Aluminum',
};
```

---

## 🎯 Running the Watcher Manually

### Method 1: NPM Script
```bash
npm run watch
```

### Method 2: Batch File
Double-click: `scripts\start-drive-watcher.bat`

### Method 3: Direct Node
```bash
node src/drive-watcher.js
```

### Method 4: With Custom Options
```bash
node src/drive-watcher.js --folder "D:\GDrive\CNC" --controller Mach3 --material Steel
```

---

## 📂 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR WORKFLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Design in Fusion 360                                     │
│           ↓                                                  │
│  2. Generate toolpath (with hobby limitation)                │
│           ↓                                                  │
│  3. Export .nc file to Google Drive folder                   │
│           ↓                                                  │
│  ┌──────────────────────────────────────┐                   │
│  │  🤖 FissionBypass Watcher Running    │                   │
│  │  • Detects new file instantly        │                   │
│  │  • Optimizes G-code automatically    │                   │
│  │  • Creates mypart_optimized.nc       │                   │
│  └──────────────────────────────────────┘                   │
│           ↓                                                  │
│  4. Open optimized file on CNC PC from same Drive folder    │
│           ↓                                                  │
│  5. Run on CNC - 40-60% faster! 🏎️                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `watchFolder` | `G:\My Drive\CNC Files` | Folder to watch for new files |
| `outputFolder` | `null` (same folder) | Where to save optimized files |
| `extensions` | `.nc, .gcode, .ngc, .tap` | File types to process |
| `controller` | `GRBL` | CNC controller profile |
| `material` | `Aluminum` | Material for feed rate calculation |
| `outputSuffix` | `_optimized` | Added to output filename |
| `pollInterval` | `2000` | Check interval in milliseconds |

---

## 🎛️ Command Line Options

```bash
node src/drive-watcher.js [options]

Options:
  -f, --folder <path>      Watch folder path
  -c, --controller <name>  Controller profile
  -m, --material <name>    Material profile  
  -o, --output <path>      Output folder (optional)
  --process-existing       Process files already in folder
  -h, --help               Show help
```

### Examples

```bash
# Watch default folder with GRBL + Aluminum
npm run watch

# Watch custom folder with Mach3 + Steel
node src/drive-watcher.js -f "D:\MyDrive\CNC" -c Mach3 -m Steel

# Process existing files on startup
node src/drive-watcher.js --process-existing
```

---

## 🔧 Troubleshooting

### "Watch folder doesn't exist"
- Make sure Google Drive for Desktop is installed and syncing
- Check the path in config matches your actual Drive location
- The watcher will create the folder if it doesn't exist

### Files aren't being detected
- Make sure the file has a supported extension (`.nc`, `.gcode`, etc.)
- Wait a few seconds - Google Drive sync can take time
- Check if the file already has `_optimized` suffix (skipped by default)

### Optimized file not appearing
- Check the terminal for error messages
- Verify you have write permissions to the folder
- Try running as Administrator

### Google Drive not syncing
- Open Google Drive for Desktop and check sync status
- Make sure you have internet connection
- Try pausing and resuming sync

---

## 📱 Tips for CNC PC

On your CNC computer:

1. Install Google Drive for Desktop
2. Sign in with the same Google account
3. Navigate to the same folder
4. Open the `*_optimized.nc` files directly!

Your workflow becomes:
- **Design PC**: Export → Auto-optimized
- **CNC PC**: Open optimized file → Run → Profit! 🎉

---

## 🎯 Supported Controllers

| Desktop | Industrial |
|---------|------------|
| GRBL | FANUC |
| Mach3 | HAAS |
| Mach4 | SIEMENS |
| LinuxCNC | MAZAK |
| TORMACH | OKUMA |
| SHOPBOT | DMG MORI |
| CENTROID | HURCO |

---

## 🪵 Supported Materials

| Metals | Plastics | Other |
|--------|----------|-------|
| Aluminum | Delrin | Wood |
| Steel | Acrylic | MDF |
| Stainless | HDPE | G10/FR4 |
| Titanium | | Carbon Fiber |
| Brass | | Cast Iron |
| Bronze | | |
| Copper | | |
