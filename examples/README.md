# Examples

This folder contains sample G-code files demonstrating FissionBypass Pro's optimization capabilities.

## Files

### `before_fusion_hobby.nc`
Raw G-code exported from Fusion 360 Personal/Hobby license. Notice:
- All movements limited to `F2` or `F5` (extremely slow)
- Rapids (`G0`) converted to linear moves (`G1`) with feed limits
- Includes the Fusion 360 "Personal Use" warning header
- Estimated cycle time: **~15 minutes** for simple pocket

### `after_optimized.nc`
The same file after processing with FissionBypass Pro:
- Rapids restored to `G0` commands (machine maximum speed)
- Cutting feeds optimized for aluminum: `F500-F800`
- Safe, machine-appropriate speeds
- Estimated cycle time: **~3 minutes** (80% faster!)

## Key Differences

| Aspect | Before (Hobby) | After (Optimized) |
|--------|---------------|-------------------|
| Rapid moves | `G1 Z5.000 F2` | `G0 Z5.000` |
| Positioning | `G1 X10 F2` | `G0 X10` |
| Cutting feed | `F5` (0.2 ipm) | `F800` (31 ipm) |
| Plunge feed | `F2` (0.08 ipm) | `F500` (20 ipm) |
| Cycle time | ~15 min | ~3 min |

## The Problem

Fusion 360 Personal/Hobby license artificially limits ALL feedrates:

```gcode
(***THIS FILE DOES NOT CONTAIN NC CODE***)
(When using Fusion for Personal Use, the feedrate of rapid)
(moves is reduced to match the feedrate of cutting moves,)
(which can increase machining time.)
```

This makes hobby CNC unusable for any serious work - a 5-minute job takes an hour!

## The Solution

FissionBypass Pro analyzes your G-code and:

1. **Restores rapids** - `G1 Fxx` → `G0` where appropriate
2. **Optimizes feeds** - Based on your controller and material
3. **Maintains safety** - Conservative defaults, never exceeds safe limits
4. **Preserves toolpath** - Only modifies speeds, never changes geometry

## Try It Yourself

1. Download [FissionBypass Pro](../dist/FissionBypassPro.exe)
2. Load `before_fusion_hobby.nc`
3. Select "GRBL" controller and "Aluminum" material
4. Click Optimize
5. Compare with `after_optimized.nc`

## Your Own Files

Have a Fusion 360 hobby file you want to test? The telltale signs:
- Feed rates of `F1` to `F10` everywhere
- Warning comment about "Personal Use"
- Extremely long estimated cycle times
- No actual `G0` rapid commands
