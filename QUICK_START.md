# Quick Start - SiliciumBrowser 🦊

Get your custom Firefox browser running in 3 simple steps!

## Option 1: GitHub Actions (Recommended)

### Step 1: Fork & Setup
```bash
# Fork this repository on GitHub
# Clone to your machine
git clone https://github.com/YOUR_USERNAME/SiliciumBrowser.git
cd SiliciumBrowser
```

### Step 2: Run Build
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **"Build Firefox (Windows)"**
4. Click **"Run workflow"**
5. Choose **"release"** build type
6. Click **"Run workflow"** button

### Step 3: Download & Run
- Wait 2-3 hours for build to complete
- Download `silicium-browser-firefox-release` artifact
- Extract ZIP file
- Run `firefox.exe`

**Done!** 🎉

## Option 2: Local Build

### Prerequisites
- Windows 10/11
- 8GB+ RAM
- 60GB+ free disk space

### Step 1: Install Tools
```powershell
# Download and install Mozilla Build Tools
# https://ftp.mozilla.org/pub/mozilla/libraries/win32/MozillaBuildSetup-Latest.exe
```

### Step 2: Clone & Build
```bash
# Clone Firefox source
git clone --depth 1 https://github.com/mozilla/gecko-dev.git firefox
cd firefox

# Bootstrap
python3 ./mach bootstrap --application-choice=browser

# Build
./mach build

# Package
./mach package
```

### Step 3: Run
```bash
# Find the package in obj-firefox/dist/
# Extract and run firefox.exe
```

## Customization Quick Guide

### Change New Tab Page
```bash
# Edit custom-ui/new-tab/index.html
# Rebuild to apply changes
```

### Change Icons
```bash
# Replace files in custom-resources/icons/
# Rebuild to apply changes
```

### Change Branding
```bash
# Edit Firefox branding files
# See FIREFOX_BUILD_GUIDE.md for details
```

## Troubleshooting

### Build Failed?
- Check GitHub Actions logs
- Look for error messages
- See [FIREFOX_BUILD_GUIDE.md](FIREFOX_BUILD_GUIDE.md)

### Build Timeout?
- Firefox builds usually complete in 2-3 hours
- If timeout, check for errors in logs
- May need to optimize build settings

### Can't Run Browser?
- Make sure all DLLs are present
- Check Windows Defender/Antivirus
- Run as Administrator if needed

## Next Steps

- Read [FIREFOX_BUILD_GUIDE.md](FIREFOX_BUILD_GUIDE.md) for detailed instructions
- Customize your browser
- Share with others!

---

**Need help?** Open an issue on GitHub!
