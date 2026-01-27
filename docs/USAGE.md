# FissionBypass Pro Documentation

## Table of Contents

1. [Quick Start Guide](#quick-start-guide)
2. [How It Works](#how-it-works)
3. [Controller Profiles](#controller-profiles)
4. [Material Database](#material-database)
5. [AI Features](#ai-features)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start Guide

### Step 1: Download
Download [FissionBypassPro.exe](../dist/FissionBypassPro.exe) - no installation required.

### Step 2: Launch
Double-click the EXE. Windows may show a SmartScreen warning (click "More info" → "Run anyway").

### Step 3: Load G-Code
- Click "Open File" or drag-and-drop
- Supported formats: `.nc`, `.gcode`, `.ngc`, `.tap`

### Step 4: Configure
1. **Select Controller**: Choose your CNC controller type
2. **Select Material**: Choose what you're cutting
3. **Review Settings**: Adjust if needed

### Step 5: Optimize
Click the "Optimize" button. Review the preview showing changes.

### Step 6: Export
Save the optimized G-code to your preferred location.

---

## How It Works

### The Problem

Fusion 360's Personal/Hobby license artificially limits feedrates:

```gcode
(When using Fusion for Personal Use, the feedrate of rapid
moves is reduced to match the feedrate of cutting moves,
which can increase machining time.)
```

This converts all rapids to slow linear moves, making a 5-minute job take an hour.

### The Solution

FissionBypass Pro:

1. **Detects** the Fusion 360 hobby limitation pattern
2. **Analyzes** each movement type (rapid, cut, plunge, retract)
3. **Restores** appropriate speeds based on your controller and material
4. **Validates** all changes are within safe machine limits

### What Gets Changed

| Movement Type | Before | After |
|--------------|--------|-------|
| Rapids | `G1 X10 F2` | `G0 X10` |
| Positioning | `G1 Z5 F2` | `G0 Z5` |
| Cutting | `F5` | `F500-2000` (material dependent) |
| Plunge | `F2` | `F200-800` (conservative) |

### What Stays The Same

- Toolpath geometry (X, Y, Z coordinates)
- Tool numbers and changes
- Spindle speeds
- Coolant commands
- Comments and metadata

---

## Controller Profiles

### Desktop/Hobby Controllers

| Controller | Max Feed | Max Rapid | Notes |
|------------|----------|-----------|-------|
| **GRBL** | 5000 mm/min | Machine max | Shapeoko, X-Carve, etc. |
| **Mach3** | 10000 mm/min | Machine max | Configurable |
| **Mach4** | 15000 mm/min | Machine max | Improved accel |
| **LinuxCNC** | Configurable | Machine max | Full G-code support |

### Industrial Controllers

| Controller | Notes |
|------------|-------|
| **FANUC** | Standard industrial dialect |
| **HAAS** | NGC compatibility |
| **SIEMENS** | Sinumerik support |
| **MAZAK** | Mazatrol aware |
| **OKUMA** | OSP dialect |
| **DMG MORI** | CELOS compatible |

---

## Material Database

### Metals

| Material | Cutting Feed | Plunge Feed | DOC % | Notes |
|----------|-------------|-------------|-------|-------|
| Aluminum 6061 | 800-2000 | 400-800 | 50% | Most common |
| Mild Steel | 300-800 | 150-400 | 30% | Use flood coolant |
| Stainless 304 | 200-500 | 100-250 | 20% | Slow and steady |
| Brass | 600-1500 | 300-600 | 40% | Watch for grabbing |
| Copper | 500-1200 | 250-500 | 35% | Gummy, use sharp tools |

### Plastics

| Material | Cutting Feed | Plunge Feed | Notes |
|----------|-------------|-------------|-------|
| Delrin/Acetal | 1000-3000 | 500-1000 | Excellent machinability |
| Acrylic | 800-2000 | 400-800 | Watch for melting |
| HDPE | 1500-4000 | 600-1500 | Very forgiving |

### Composites

| Material | Notes |
|----------|-------|
| G10/FR4 | Use carbide, dust extraction required |
| Carbon Fiber | Diamond coating recommended, HEPA filtration |

---

## AI Features

### Requirements
- [Ollama](https://ollama.ai/) installed locally
- Running on `localhost:11434`
- Recommended models: `llama2`, `codellama`, `mistral`

### Capabilities

1. **G-Code Analysis**: Understand complex toolpaths
2. **Optimization Suggestions**: Material-specific recommendations
3. **Error Detection**: Identify potential issues
4. **Documentation**: Explain what each section does

### Privacy
- All AI processing is LOCAL
- No data sent to external servers
- Works 100% offline (AI features disabled)

---

## Troubleshooting

### Windows SmartScreen Warning
This is normal for unsigned executables. Click "More info" → "Run anyway".

### Antivirus False Positive
See [SECURITY.md](../SECURITY.md) for verification steps and VirusTotal results.

### File Won't Load
- Ensure file extension is `.nc`, `.gcode`, `.ngc`, or `.tap`
- Check file isn't corrupted
- Try opening in a text editor first

### Output Looks Wrong
- Start with conservative settings
- Verify controller selection is correct
- Check material matches your workpiece
- Always simulate before cutting!

### AI Features Not Working
- Verify Ollama is running: `ollama serve`
- Check port 11434 is accessible
- Try `curl http://localhost:11434/api/tags`

---

## Safety Reminder

⚠️ **ALWAYS:**
- Simulate G-code before running
- Start with conservative settings
- Air-cut test new programs
- Keep hand on E-stop
- Wear appropriate PPE

**This software modifies machine control code. Use at your own risk.**

---

## Getting Help

- [GitHub Issues](https://github.com/DeadlySIn777/Fissionbypass/issues)
- [Example Files](../examples/)
- [Security Policy](../SECURITY.md)
