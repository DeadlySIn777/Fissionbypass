# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

---

## Security Verification

### SHA256 Hash Verification

Before running FissionBypass Pro, verify the file integrity:

**Expected SHA256:**
```
417AC667114AEC8AC834D7296F6D120C8142296ED531A62AEEC223BE8A1BD3B8
```

#### Windows (PowerShell)
```powershell
(Get-FileHash "FissionBypassPro.exe" -Algorithm SHA256).Hash
```

#### Windows (Command Prompt)
```cmd
certutil -hashfile FissionBypassPro.exe SHA256
```

#### Linux/Mac
```bash
sha256sum FissionBypassPro.exe
# or
shasum -a 256 FissionBypassPro.exe
```

**If the hash does NOT match, do not run the file!**

---

## VirusTotal Verification

Always verify new downloads:

🔗 **[VirusTotal Scan Results](https://www.virustotal.com/gui/file/417AC667114AEC8AC834D7296F6D120C8142296ED531A62AEEC223BE8A1BD3B8)**

| Vendor | Status |
|--------|--------|
| Microsoft Defender | ✅ Clean |
| Kaspersky | ✅ Clean |
| ESET | ✅ Clean |
| Bitdefender | ✅ Clean |
| Avast | ✅ Clean |
| Malwarebytes | ✅ Clean |
| Sophos | ✅ Clean |

### Why Some Scanners Flag PyInstaller Apps

FissionBypass Pro is built with PyInstaller, which packages Python applications into standalone executables. Some ML-based antivirus scanners flag PyInstaller apps as "suspicious" because:

1. **Runtime unpacking**: PyInstaller extracts Python at runtime (similar technique used by some malware)
2. **Heuristic detection**: AI-based scanners are overly cautious with packed executables
3. **Known issue**: See [PyInstaller GitHub Issue #6754](https://github.com/pyinstaller/pyinstaller/issues/6754)

**This is a false positive.** All major antivirus vendors with signature-based detection mark it as clean.

---

## Network Security

FissionBypass Pro has **minimal network activity**:

| Connection | Purpose | Required |
|------------|---------|----------|
| `localhost:11434` | Local Ollama AI server | Optional |

- ❌ No internet connections
- ❌ No telemetry or analytics
- ❌ No data collection
- ❌ No update checks (manual updates only)
- ❌ No license servers

The application works 100% offline. The only network connection is to your LOCAL Ollama server if you choose to use AI features.

---

## CNC Safety Warning

⚠️ **THIS SOFTWARE MODIFIES G-CODE THAT CONTROLS CNC MACHINERY**

Improper use can result in:
- Machine damage
- Tool breakage
- Workpiece damage
- **Personal injury**

### Safety Checklist

Before running optimized G-code on your machine:

- [ ] **Simulate first**: Use your CAM software's simulation or a G-code viewer
- [ ] **Start conservative**: Begin with lower optimization settings
- [ ] **Air cut test**: Run the program without a workpiece first
- [ ] **Hand on E-stop**: Be ready to emergency stop at any time
- [ ] **Verify parameters**: Check feed rates match your machine's capabilities
- [ ] **Know your limits**: Understand your machine's maximum speeds and accelerations
- [ ] **Proper PPE**: Safety glasses, hearing protection as needed

---

## Reporting a Vulnerability

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Contact via GitHub private vulnerability reporting
3. Or open a private issue with `[SECURITY]` in the title

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response Time

- Initial response: Within 48 hours
- Status update: Within 7 days
- Fix timeline: Depends on severity

---

## Responsible Disclosure

We follow responsible disclosure practices:

1. Vulnerabilities are investigated promptly
2. Fixes are developed and tested
3. New releases are published with security notes
4. Credit is given to reporters (unless anonymity is requested)

---

## Contact

- **GitHub Issues**: https://github.com/DeadlySIn777/Fissionbypass/issues
- **Security Reports**: Use GitHub's private vulnerability reporting feature

---

*Last updated: January 2026*
