/**
 * FissionBypass Pro - G-Code Optimizer Core v2.2
 * MINIMAL SAFE APPROACH
 * 
 * WHAT FUSION HOBBY DOES:
 * - Converts G0 (rapid) to G1 F2-F5 (crawling slow)
 * - The CUTTING feeds are still correct!
 * 
 * WHAT WE DO:
 * - Convert ONLY positioning moves (XY at safe height with F<=5) back to G0
 * - Cap RPM if needed
 * - NEVER touch drilling/plunge feeds
 * - NEVER touch cutting feeds
 */

class GCodeOptimizer {
  constructor(options = {}) {
    this.controller = options.controller || 'GRBL';
    this.material = options.material || 'Aluminum';
    this.maxRPM = options.maxRPM || 8000;
    this.safeZ = 0.1;  // Only rapid when Z >= this
  }

  /**
   * Validate output - no G0 into material
   */
  validateOutput(content) {
    const lines = content.split(/\r?\n/);
    let currentZ = 100;
    const errors = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('(') || line.startsWith(';')) continue;
      
      const zMatch = line.match(/Z([-\d.]+)/i);
      if (zMatch) currentZ = parseFloat(zMatch[1]);
      
      // G0 with Z negative = BAD
      if (line.match(/^G0.*Z-/i)) {
        errors.push(`Line ${i+1}: G0 to negative Z`);
      }
      // G0 XY while Z negative = BAD
      if (line.match(/^G0\s+.*[XY]/i) && currentZ < 0) {
        errors.push(`Line ${i+1}: G0 XY while Z=${currentZ}`);
      }
    }
    return { safe: errors.length === 0, errors };
  }

  optimize(content) {
    const lines = content.split(/\r?\n/);
    const optimizedLines = [];
    const stats = { rapidsRestored: 0, rpmCapped: 0 };

    let currentZ = 100;
    let headerAdded = false;

    for (const line of lines) {
      let optimizedLine = line;
      const trimmed = line.trim();

      // Track Z
      const zMatch = trimmed.match(/Z([-\d.]+)/i);
      if (zMatch) currentZ = parseFloat(zMatch[1]);

      // Skip comments/empty
      if (trimmed.startsWith('(') || trimmed.startsWith(';') || trimmed === '') {
        optimizedLines.push(line);
        continue;
      }

      // Header
      if (!headerAdded) {
        optimizedLines.push(`(Optimized by FissionBypass Pro v2.2)`);
        optimizedLines.push(`(Only rapids restored - feeds unchanged)`);
        optimizedLines.push('');
        headerAdded = true;
      }

      // ===== RPM CAP =====
      const spindleMatch = trimmed.match(/S(\d+)/i);
      if (spindleMatch) {
        const rpm = parseInt(spindleMatch[1]);
        if (rpm > this.maxRPM) {
          optimizedLine = line.replace(/S\d+/i, `S${this.maxRPM}`);
          stats.rpmCapped++;
        }
      }

      // ===== RESTORE RAPIDS - ONLY XY MOVES AT SAFE HEIGHT WITH F<=5 =====
      const g1Match = optimizedLine.match(/^G1\s+(.*?)F(\d+(?:\.\d+)?)\s*$/i);
      if (g1Match) {
        const coords = g1Match[1].trim();
        const feedrate = parseFloat(g1Match[2]);
        
        const hasX = /X[-\d.]+/i.test(coords);
        const hasY = /Y[-\d.]+/i.test(coords);
        const hasZ = /Z/i.test(coords);
        
        // ONLY convert if:
        // 1. XY move (no Z)
        // 2. Currently at safe height (Z >= 0.1)
        // 3. Feed is hobbled (F <= 5)
        if ((hasX || hasY) && !hasZ && currentZ >= this.safeZ && feedrate <= 5) {
          optimizedLine = `G0 ${coords}`.trim();
          stats.rapidsRestored++;
        }
        
        // EVERYTHING ELSE: LEAVE ALONE!
        // - Plunges: LEAVE ALONE (Fusion calculated correct drill feed)
        // - Cutting: LEAVE ALONE (Fusion calculated correct cutting feed)
        // - Retracts: LEAVE ALONE (they work fine even if slow)
      }

      optimizedLines.push(optimizedLine);
    }

    const output = optimizedLines.join('\n');
    
    // Validate
    const validation = this.validateOutput(output);
    if (!validation.safe) {
      console.error('SAFETY BLOCKED - returning original');
      return { content, stats: { error: 'BLOCKED' }, BLOCKED: true };
    }

    return { content: output, stats, validated: true };
  }

  isFusionHobbyFile(content) {
    return content.includes('Fusion') || content.includes('feedrate');
  }
}

module.exports = GCodeOptimizer;
