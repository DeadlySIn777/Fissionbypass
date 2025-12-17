# FissionBypass Pro - CNC G-Code Optimizer

**Desktop application for optimizing CAM-generated G-code with controller-specific conversions and cutting parameter calculations.**

Copyright © 2025 Luis Angel Garcia. All Rights Reserved.  
GitHub: https://github.com/DeadlySIn777/Fissionbypass

---

## 🎯 What This Software Does

FissionBypass Pro takes G-code from CAM software (Fusion 360, SolidWorks CAM, etc.) and:

1. **Optimizes Feedrates** - Converts slow positioning moves to true rapid speeds
2. **Converts Controllers** - Translates G-code between 14 different CNC controller formats
3. **Calculates Cutting Parameters** - Provides RPM, feed, DOC, WOC for 15 materials
4. **Analyzes Toolpaths** - Detects CAM limitations and suboptimal patterns

---

## ⚙️ Features

### G-Code Optimizer Tab
- Load `.nc`, `.gcode`, `.tap` files
- Aggressive pattern-based feedrate optimization (F2→F20, F5→F50, F40→F800)
- Detects and accelerates slow positioning moves
- Metric and Imperial unit support
- Estimated time savings: 40-60%

### Controller Converter Tab
**14 Supported Controllers:**
| Controller | Description |
|------------|-------------|
| GRBL | Open-source CNC controller (1.0f, 1.1) |
| LinuxCNC | Open-source PC-based CNC |
| Mach3 | Windows CNC controller |
| Mach4 | Advanced Windows CNC |
| FANUC | Industrial standard |
| HAAS | Mill/lathe controller |
| SIEMENS | Sinumerik format |
| MAZAK | Mazatrol conversational |
| OKUMA | OSP controller |
| HURCO | Ultimax format |
| DMG MORI | CELOS/MAPPS |
| CENTROID | Acorn/M-series |
| TORMACH | PathPilot |
| SHOPBOT | Desktop CNC |

### Cutting Parameters Tab
**15 Materials with Industrial-Grade Safety:**
- Aluminum (6061, 7075, Cast)
- Steel (Mild, 4140, Tool Steel)
- Stainless Steel (304, 316)
- Titanium (Grade 5)
- Brass, Bronze, Copper
- Plastics (Delrin, Acrylic, HDPE)

**Safety Margins:**
- Depth of Cut: 4-10% of tool diameter (industrial-grade conservative)
- Width of Cut: 2-5% of tool diameter
- Feed per tooth: 0.01-0.03 mm (extremely conservative)
- Max RPM: 8000 (Langmuir MR-1 limit)

### Analysis Tab
- Detects slow feedrates from CAM limitations
- Identifies positioning moves that should be rapids
- Flags suboptimal toolpath patterns
- Provides optimization suggestions

### Ollama AI Setup Tab
- Configure local AI models for advanced analysis
- System spec detection (RAM, GPU, VRAM)
- Model recommendations based on your hardware
- One-click model installation

---

## 🚀 Installation

### Download & Run
1. Download `FissionBypassPro.exe` from the `dist/` folder
2. Run the application - no installation needed
3. Windows may show a SmartScreen warning - click "More info" → "Run anyway"

---

## 📁 Download

```
dist/
└── FissionBypassPro.exe   # Standalone executable (23 MB)
```

---

## 🔧 Technical Details

### Cutting Parameter Calculation
The cutting parameters are calculated using standard machining formulas:

```
RPM = (SFM × 12) / (π × diameter)      # Imperial
RPM = (SFM × 1000) / (π × diameter)    # Metric

Feed = RPM × teeth × feed_per_tooth
DOC = tool_diameter × axial_ratio
WOC = tool_diameter × radial_ratio
```

**Safety Philosophy:** Parameters are set to 5-10% of manufacturer recommendations to prioritize tool life and machine safety over cycle time. Users can scale up after validating on their specific setup.

### Optimization Patterns
The optimizer detects patterns like:
- `F2` → `F20` (10x speed boost for positioning)
- `F5` → `F50` (10x speed boost)
- `F40` → `F800` (20x speed boost for rapids)
- Slow X/Y moves without Z engagement → converted to rapid speed

---

## 💻 System Requirements

- **OS:** Windows 10/11 (64-bit)
- **RAM:** 4 GB minimum, 8 GB recommended
- **Storage:** 50 MB for application, 2-10 GB for AI models (optional)

---

## ⚠️ Disclaimer

This software provides cutting parameter suggestions based on standard machining calculations. **YOU are responsible for:**

1. Verifying all parameters are safe for YOUR specific machine
2. Starting with reduced parameters and increasing gradually
3. Understanding that different machines have different capabilities
4. Backing up original G-code files before optimization
5. Running optimized code in simulation before actual cutting

The default parameters are intentionally conservative. Tool breakage, machine damage, or injury resulting from use of this software is the user's responsibility.

---

## 📄 License

**Proprietary Software**  
Copyright © 2025 Luis Angel Garcia. All Rights Reserved.

This software is provided for personal and commercial use. Source code is not distributed.

---

## 🤝 Support

- **Issues:** https://github.com/DeadlySIn777/Fissionbypass/issues
- **Email:** [Contact via GitHub]

---

*Built for CNC machinists who want better G-code without the complexity.*