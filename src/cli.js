/**
 * FissionBypass Pro - Command Line Interface
 * 
 * Optimize individual .nc files from command line
 */

const fs = require('fs');
const path = require('path');
const GCodeOptimizer = require('./optimizer');

function showHelp() {
  console.log(`
FissionBypass Pro - G-Code Optimizer CLI

USAGE:
  node cli.js <input.nc> [options]

OPTIONS:
  -o, --output <path>      Output file path (default: input_optimized.nc)
  -c, --controller <name>  Controller profile (default: GRBL)
  -m, --material <name>    Material profile (default: Aluminum)
  -h, --help               Show this help

EXAMPLES:
  node cli.js mypart.nc
  node cli.js mypart.nc -o optimized.nc -c Mach3 -m Steel
  node cli.js "G:\\My Drive\\CNC\\part.nc" --controller GRBL --material Aluminum
`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  let inputFile = null;
  let outputFile = null;
  let controller = 'GRBL';
  let material = 'Aluminum';
  let maxRPM = 8000;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '-o' || arg === '--output') {
      outputFile = args[++i];
    } else if (arg === '-c' || arg === '--controller') {
      controller = args[++i];
    } else if (arg === '-m' || arg === '--material') {
      material = args[++i];
    } else if (arg === '-r' || arg === '--rpm') {
      maxRPM = parseInt(args[++i]);
    } else if (!arg.startsWith('-')) {
      inputFile = arg;
    }
  }

  if (!inputFile) {
    console.error('Error: No input file specified');
    process.exit(1);
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  // Generate output filename if not specified
  if (!outputFile) {
    const ext = path.extname(inputFile);
    const base = path.basename(inputFile, ext);
    const dir = path.dirname(inputFile);
    outputFile = path.join(dir, `${base}_optimized${ext}`);
  }

  console.log('\n🚀 FissionBypass Pro - G-Code Optimizer\n');
  console.log(`📂 Input:      ${inputFile}`);
  console.log(`📄 Output:     ${outputFile}`);
  console.log(`🎯 Controller: ${controller}`);
  console.log(`🪵 Material:   ${material}`);
  console.log(`🔄 Max RPM:    ${maxRPM}`);
  console.log('');

  // Read and optimize
  const content = fs.readFileSync(inputFile, 'utf8');
  
  const optimizer = new GCodeOptimizer({ controller, material, maxRPM });
  const result = optimizer.optimize(content);

  // Write output
  fs.writeFileSync(outputFile, result.content, 'utf8');

  console.log('✅ Optimization complete!\n');
  console.log('📊 Statistics:');
  console.log(`   Lines processed:    ${result.stats.linesProcessed}`);
  console.log(`   Rapids restored:    ${result.stats.rapidsRestored}`);
  console.log(`   Feeds optimized:    ${result.stats.feedsOptimized}`);
  console.log(`   Plunges optimized:  ${result.stats.plungesOptimized}`);
  console.log(`   Retracts optimized: ${result.stats.retractsOptimized}`);
  
  if (result.stats.rpmCapped > 0) {
    console.log(`\n⚠️  RPM CAPPED: ${result.stats.originalRPM} → ${result.stats.cappedToRPM} RPM (${result.stats.rpmCapped} spindle commands fixed)`);
  }
  
  if (result.wasHobbyFile) {
    console.log('\n✅ Fusion 360 hobby limitation detected and fixed!');
  }
  
  console.log('');
}

main();
