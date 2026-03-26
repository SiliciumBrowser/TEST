# SiliciumBrowser 🦊

A customized Firefox-based browser with enhanced privacy and custom UI.

## Why Firefox?

After extensive testing with Chromium (12+ hours of build attempts), we switched to Firefox for:

- ✅ **Faster builds:** 2-3 hours (vs Chromium 5-6 hours)
- ✅ **Smaller footprint:** ~60GB (vs Chromium ~100GB)
- ✅ **Easier customization:** Clear structure and tools
- ✅ **Better reliability:** Fewer timeouts on CI/CD

## Features

- 🎨 Custom new tab page with video backgrounds
- 🔒 Enhanced privacy settings
- 🎯 Custom branding and icons
- ⚡ Optimized build configuration
- 🛠️ Easy to customize and extend

## Quick Start

### Build on GitHub Actions

1. Fork this repository
2. Go to Actions → "Build Firefox (Windows)"
3. Click "Run workflow" → Select "release"
4. Wait 2-3 hours
5. Download `silicium-browser-firefox` artifact

### Build Locally

See [LOCAL_BUILD_GUIDE.md](LOCAL_BUILD_GUIDE.md) for detailed instructions.

## Project Structure

```
SiliciumBrowser/
├── .github/workflows/
│   └── build-firefox-windows.yml    # CI/CD workflow
├── custom-ui/
│   └── new-tab/                     # Custom new tab page
├── custom-resources/
│   ├── icons/                       # Custom icons
│   └── README.md
├── custom-patches/                  # Firefox patches
├── README.md                        # This file
├── QUICK_START.md                   # Quick start guide
├── FIREFOX_BUILD_GUIDE.md           # Detailed build guide
└── LOCAL_BUILD_GUIDE.md             # Local build instructions
```

## Customization

### New Tab Page

Edit files in `custom-ui/new-tab/`:
- `index.html` - Page structure
- `style.css` - Styling
- `script.js` - Functionality

### Branding

Replace files in `custom-resources/`:
- `icons/logo.png` - Browser icon
- Update branding in Firefox source

### Build Configuration

Edit `mozconfig` settings in the workflow:
- Optimization level
- Features to enable/disable
- Debug vs release build

## Documentation

- [Firefox Build Guide](FIREFOX_BUILD_GUIDE.md) - Complete build instructions
- [Quick Start](QUICK_START.md) - Get started quickly
- [Local Build Guide](LOCAL_BUILD_GUIDE.md) - Build on your machine
- [How It Works](HOW_IT_WORKS.md) - Technical details
- [Isolation Explained](ISOLATION_EXPLAINED.md) - Privacy features

## Build Timeline

```
Setup: 30 minutes
↓
Bootstrap: 30 minutes
↓
Build: 2-3 hours
↓
Package: 5 minutes
↓
Total: ~3-4 hours
```

## Requirements

### GitHub Actions
- No local requirements
- Builds in the cloud
- Free for public repositories

### Local Build
- Windows 10/11
- 8GB+ RAM
- 60GB+ free disk space
- Visual Studio 2022 Build Tools
- Mozilla Build Tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the build
5. Submit a pull request

## License

This project is based on Mozilla Firefox, which is licensed under the Mozilla Public License 2.0.

Custom modifications are available under the same license.

## Acknowledgments

- Mozilla Firefox team for the excellent browser engine
- GitHub Actions for free CI/CD
- Community contributors

## Support

- Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/SiliciumBrowser/issues)
- Discussions: [GitHub Discussions](https://github.com/YOUR_USERNAME/SiliciumBrowser/discussions)

---

**Built with 🦊 Firefox**
