/**
 * FissionBypass Pro - Auto Updater
 * Checks GitHub for new releases and auto-updates
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GITHUB_REPO = 'DeadlySIn777/Fissionbypass';
const CURRENT_VERSION = require('../package.json').version;

class Updater {
  constructor(options = {}) {
    this.currentVersion = options.version || CURRENT_VERSION;
    this.exePath = options.exePath || process.execPath;
    this.silent = options.silent || false;
  }

  log(msg) {
    if (!this.silent) {
      console.log(`[Updater] ${msg}`);
    }
  }

  /**
   * Compare semantic versions
   * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
   */
  compareVersions(v1, v2) {
    const parts1 = v1.replace(/^v/, '').split('.').map(Number);
    const parts2 = v2.replace(/^v/, '').split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    return 0;
  }

  /**
   * Fetch latest release info from GitHub
   */
  async getLatestRelease() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: `/repos/${GITHUB_REPO}/releases/latest`,
        headers: {
          'User-Agent': 'FissionBypass-Updater',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      https.get(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 404) {
              resolve(null); // No releases yet
              return;
            }
            if (res.statusCode !== 200) {
              reject(new Error(`GitHub API error: ${res.statusCode}`));
              return;
            }
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  /**
   * Check if update is available
   */
  async checkForUpdate() {
    try {
      this.log(`Current version: v${this.currentVersion}`);
      this.log('Checking for updates...');
      
      const release = await this.getLatestRelease();
      
      if (!release) {
        this.log('No releases found on GitHub');
        return { available: false };
      }

      const latestVersion = release.tag_name.replace(/^v/, '');
      this.log(`Latest version: v${latestVersion}`);

      if (this.compareVersions(latestVersion, this.currentVersion) > 0) {
        // Find the .exe asset
        const exeAsset = release.assets.find(a => a.name.endsWith('.exe'));
        
        return {
          available: true,
          currentVersion: this.currentVersion,
          latestVersion,
          releaseNotes: release.body,
          downloadUrl: exeAsset ? exeAsset.browser_download_url : null,
          releasePage: release.html_url
        };
      }

      this.log('You are running the latest version!');
      return { available: false, currentVersion: this.currentVersion };
      
    } catch (error) {
      this.log(`Update check failed: ${error.message}`);
      return { available: false, error: error.message };
    }
  }

  /**
   * Download file from URL
   */
  async downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destPath);
      
      const request = (url) => {
        https.get(url, (res) => {
          // Handle redirects
          if (res.statusCode === 302 || res.statusCode === 301) {
            request(res.headers.location);
            return;
          }
          
          if (res.statusCode !== 200) {
            reject(new Error(`Download failed: ${res.statusCode}`));
            return;
          }

          const totalSize = parseInt(res.headers['content-length'], 10);
          let downloaded = 0;

          res.on('data', (chunk) => {
            downloaded += chunk.length;
            if (totalSize && !this.silent) {
              const percent = Math.round((downloaded / totalSize) * 100);
              process.stdout.write(`\r[Updater] Downloading... ${percent}%`);
            }
          });

          res.pipe(file);
          
          file.on('finish', () => {
            file.close();
            console.log(''); // New line after progress
            resolve(destPath);
          });
        }).on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      };

      request(url);
    });
  }

  /**
   * Perform the update
   */
  async performUpdate(downloadUrl) {
    try {
      const exeDir = path.dirname(this.exePath);
      const exeName = path.basename(this.exePath);
      const tempPath = path.join(exeDir, 'FissionBypass_new.exe');
      const backupPath = path.join(exeDir, 'FissionBypass_old.exe');

      this.log('Downloading update...');
      await this.downloadFile(downloadUrl, tempPath);

      this.log('Installing update...');
      
      // Create update batch script that runs after we exit
      const updateScript = path.join(exeDir, 'update.bat');
      const scriptContent = `
@echo off
echo Waiting for FissionBypass to close...
timeout /t 2 /nobreak >nul
echo Backing up old version...
if exist "${backupPath}" del "${backupPath}"
move "${this.exePath}" "${backupPath}"
echo Installing new version...
move "${tempPath}" "${this.exePath}"
echo Update complete! Starting FissionBypass...
start "" "${this.exePath}"
del "%~f0"
`;
      
      fs.writeFileSync(updateScript, scriptContent);
      
      this.log('Update downloaded. Restarting to apply...');
      
      // Run the update script and exit
      execSync(`start "" "${updateScript}"`, { shell: true, windowsHide: true });
      
      return true;
    } catch (error) {
      this.log(`Update failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = Updater;

// CLI usage
if (require.main === module) {
  const updater = new Updater();
  
  (async () => {
    const result = await updater.checkForUpdate();
    
    if (result.available) {
      console.log('\n========================================');
      console.log('🎉 NEW VERSION AVAILABLE!');
      console.log('========================================');
      console.log(`Current: v${result.currentVersion}`);
      console.log(`Latest:  v${result.latestVersion}`);
      console.log(`\nRelease Notes:\n${result.releaseNotes || 'No release notes'}`);
      console.log(`\nDownload: ${result.releasePage}`);
      
      if (result.downloadUrl) {
        console.log('\nRun with --install to auto-update');
        
        if (process.argv.includes('--install')) {
          await updater.performUpdate(result.downloadUrl);
        }
      }
    } else {
      console.log('✅ You are running the latest version!');
    }
  })();
}
