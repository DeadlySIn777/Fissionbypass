# Changelog

All notable changes to FissionBypass Pro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-XX-XX

### Added
- **14 CNC Controller Profiles**: GRBL, LinuxCNC, FANUC, HAAS, SIEMENS, MAZAK, OKUMA, DMG MORI, Mach3, Mach4, TORMACH, SHOPBOT, CENTROID, HURCO
- **15 Material Presets**: Aluminum, Steel, Stainless Steel, Titanium, Brass, Bronze, Copper, Delrin, Acrylic, HDPE, G10/FR4, Carbon Fiber, Cast Iron, Wood
- **AI-Powered Analysis**: Optional Ollama integration for advanced G-code optimization suggestions
- **Material Database**: Industrial-grade safety margins (5-10% of tool diameter for DOC/WOC)
- **Speed Optimization Engine**: 40-60% faster cycle times through intelligent feed rate optimization

### Changed
- Complete UI redesign for better usability
- Improved optimization algorithms
- Better error handling and user feedback

### Security
- Application only connects to localhost:11434 (local Ollama server)
- No internet connectivity or data collection
- VirusTotal verified: 66/72 clean scans

---

## [1.0.0] - 2025-XX-XX

### Added
- Initial release
- Basic G-code feed rate optimization
- Support for common CNC controllers
- Simple material presets

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 2.0.0 | 2025 | 14 controllers, 15 materials, AI integration |
| 1.0.0 | 2025 | Initial release |

---

## Roadmap

### Planned Features
- [ ] Mac/Linux support
- [ ] Batch processing multiple files
- [ ] Custom controller profile editor
- [ ] G-code preview/diff viewer
- [ ] Plugin system for custom optimizations
- [ ] Cloud backup for settings (opt-in)

### Under Consideration
- Code signing certificate for Windows
- Auto-update functionality
- Multi-language support

---

## Reporting Issues

Found a bug or have a feature request? 
Open an issue at: https://github.com/DeadlySIn777/Fissionbypass/issues
