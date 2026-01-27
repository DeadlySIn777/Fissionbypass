/**
 * FissionBypass Pro - Automation Scripts
 * Generates social card PNG, screenshots placeholder
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function exportSocialCard() {
    console.log('🎨 Exporting social card to PNG...');
    
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set viewport to match social card dimensions (1200x630 for OG image)
    await page.setViewport({ width: 1200, height: 630 });
    
    // Load the social card HTML - use correct path (go up from scripts/)
    const htmlPath = path.resolve(__dirname, '..', 'assets', 'social_card.html');
    await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
    
    // Wait for any fonts to load
    await new Promise(r => setTimeout(r, 1000));
    
    // Screenshot the card element
    const card = await page.$('.card');
    const outputPath = path.resolve(__dirname, '..', 'assets', 'social_card.png');
    if (card) {
        await card.screenshot({
            path: outputPath,
            type: 'png'
        });
        console.log('✅ Social card exported to assets/social_card.png');
    } else {
        // Full page screenshot as fallback
        await page.screenshot({
            path: outputPath,
            type: 'png',
            clip: { x: 0, y: 0, width: 1200, height: 630 }
        });
        console.log('✅ Social card exported (full page) to assets/social_card.png');
    }
    
    await browser.close();
}

async function createPlaceholderScreenshots() {
    console.log('📸 Creating placeholder screenshots...');
    
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Create a mock UI screenshot placeholder
    await page.setViewport({ width: 1280, height: 800 });
    
    const mockHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', sans-serif;
                background: #1a1a2e;
                color: #eee;
                padding: 20px;
            }
            .window {
                background: #16213e;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }
            .titlebar {
                background: #0f3460;
                padding: 12px 20px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .dot { width: 12px; height: 12px; border-radius: 50%; }
            .dot.red { background: #ff5f57; }
            .dot.yellow { background: #febc2e; }
            .dot.green { background: #28c840; }
            .title { margin-left: 20px; font-size: 14px; color: #888; }
            .content {
                padding: 30px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }
            .panel {
                background: #1a1a2e;
                border-radius: 8px;
                padding: 20px;
            }
            .panel h3 {
                color: #ef4444;
                margin-bottom: 15px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .code {
                font-family: 'Consolas', monospace;
                font-size: 12px;
                line-height: 1.6;
                color: #8b949e;
            }
            .code .highlight { color: #7ee787; }
            .code .changed { color: #ffa657; }
            select, button {
                background: #0f3460;
                color: #fff;
                border: 1px solid #333;
                padding: 10px 20px;
                border-radius: 6px;
                margin: 5px;
                cursor: pointer;
            }
            button.primary {
                background: #ef4444;
                border-color: #ef4444;
            }
            .stats {
                display: flex;
                gap: 20px;
                margin-top: 20px;
            }
            .stat {
                text-align: center;
            }
            .stat .value {
                font-size: 32px;
                font-weight: bold;
                color: #10b981;
            }
            .stat .label {
                font-size: 12px;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="window">
            <div class="titlebar">
                <div class="dot red"></div>
                <div class="dot yellow"></div>
                <div class="dot green"></div>
                <span class="title">FissionBypass Pro v2.0 - G-Code Optimizer</span>
            </div>
            <div class="content">
                <div class="panel">
                    <h3>📂 Input G-Code (Fusion 360 Hobby)</h3>
                    <div class="code">
                        <div>(When using Fusion for Personal Use,</div>
                        <div>(the feedrate of rapid moves is reduced...)</div>
                        <div>&nbsp;</div>
                        <div>G0 X0.000 Y0.000</div>
                        <div class="changed">G1 Z5.000 F2</div>
                        <div class="changed">G1 X10.000 F5</div>
                        <div class="changed">G1 Y10.000 F5</div>
                        <div class="changed">G1 Z15.000 F2</div>
                    </div>
                    <div style="margin-top: 20px;">
                        <select><option>Controller: GRBL</option></select>
                        <select><option>Material: Aluminum</option></select>
                    </div>
                </div>
                <div class="panel">
                    <h3>✨ Optimized Output</h3>
                    <div class="code">
                        <div>(Optimized by FissionBypass Pro v2.0)</div>
                        <div>(Controller: GRBL | Material: Aluminum)</div>
                        <div>&nbsp;</div>
                        <div>G0 X0.000 Y0.000</div>
                        <div class="highlight">G0 Z5.000</div>
                        <div class="highlight">G1 X10.000 F800</div>
                        <div class="highlight">G1 Y10.000 F800</div>
                        <div class="highlight">G0 Z15.000</div>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <div class="value">58%</div>
                            <div class="label">FASTER</div>
                        </div>
                        <div class="stat">
                            <div class="value">12→5</div>
                            <div class="label">MINUTES</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="padding: 20px; text-align: center;">
                <button>📂 Open File</button>
                <button class="primary">⚡ Optimize</button>
                <button>💾 Export</button>
            </div>
        </div>
    </body>
    </html>
    `;
    
    await page.setContent(mockHtml, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    
    // Ensure assets directory exists - go up from scripts/
    const assetsDir = path.resolve(__dirname, '..', 'assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    await page.screenshot({
        path: path.join(assetsDir, 'screenshot_main.png'),
        type: 'png'
    });
    console.log('✅ Screenshot exported to assets/screenshot_main.png');
    
    await browser.close();
}

async function main() {
    console.log('🚀 FissionBypass Pro - Asset Generator\n');
    
    try {
        await exportSocialCard();
    } catch (e) {
        console.log('⚠️ Social card export failed:', e.message);
    }
    
    try {
        await createPlaceholderScreenshots();
    } catch (e) {
        console.log('⚠️ Screenshot creation failed:', e.message);
    }
    
    console.log('\n✅ Asset generation complete!');
}

main().catch(console.error);
