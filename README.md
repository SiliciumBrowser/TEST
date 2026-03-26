# 🔥 Silicium Browser

**Privacy-focused, feature-rich browser based on Firefox**

[![Build Firefox (Windows)](https://github.com/SiliciumBrowser/TEST/actions/workflows/build-firefox-windows.yml/badge.svg)](https://github.com/SiliciumBrowser/TEST/actions/workflows/build-firefox-windows.yml)

---

## 🌟 Vision

Silicium Browser là trình duyệt mã nguồn mở dựa trên Firefox, tập trung vào:

- 🔒 **Privacy-first** - Loại bỏ tracking như LibreWolf
- 🛡️ **Anti-fingerprinting** - Bảo vệ như Mullvad Browser  
- 🚫 **Built-in Ad Blocker** - Chặn quảng cáo như Brave
- ⚡ **Fast Downloads** - Download manager đa luồng như IDM
- 🎥 **Video Downloader** - Tải video từ YouTube, Facebook, TikTok...
- 🎨 **Customizable UI** - Sidebar, split screen như Floorp
- 🇻🇳 **Vietnamese-optimized** - Tối ưu cho người Việt
- 📖 **100% Open Source** - Hoàn toàn mã nguồn mở

---

## 🚀 Quick Start

### Download Pre-built Browser

1. Go to [Releases](https://github.com/SiliciumBrowser/TEST/releases)
2. Download `silicium-browser-release.zip`
3. Extract and run `firefox.exe` (will be `silicium.exe` in future)
4. Enjoy your privacy-focused browser!

### Build from Source

See [Firefox Build Guide](FIREFOX_BUILD_GUIDE.md) for detailed instructions.

---

## ✨ Features

### ✅ Current (v1.0.0)
- 🔥 Custom purple flame branding
- 🎨 Silicium name and icons
- 🌐 Custom new tab page with widgets
- 🦊 Based on stable Firefox Release

### 🚧 In Progress (Phase 1)
- 🔒 Remove Mozilla tracking & telemetry
- 🚫 Built-in ad blocker
- 🛡️ Anti-fingerprinting protection

### 📋 Planned
- **Phase 2:** Sidebar, split screen, custom themes
- **Phase 3:** Video downloader, multi-threaded downloads
- **Phase 4:** Enhanced Picture-in-Picture
- **Phase 5:** Built-in DNS changer

See [Features Roadmap](FEATURES_ROADMAP.md) for complete plan.

---

## 🏗️ Project Structure

```
SiliciumBrowser/
├── .github/workflows/
│   └── build-firefox-windows.yml    # Automated build
├── custom-ui/
│   └── new-tab/                     # Custom new tab page
├── custom-resources/
│   ├── icons/                       # Purple flame icons
│   └── branding/                    # Silicium branding files
├── custom-patches/                  # Firefox patches (future)
├── FEATURES_ROADMAP.md              # Feature implementation plan
├── FIREFOX_BUILD_GUIDE.md           # Build instructions
└── BRANDING_GUIDE.md                # Branding customization
```

---

## 🎨 Branding

Silicium Browser features:
- **Name:** Silicium (instead of Firefox)
- **Icon:** Purple flame (instead of orange)
- **Colors:** Purple gradient (#8B5CF6 → #EC4899)
- **About dialog:** Custom Silicium branding

All branding files are in `custom-resources/`:
- `icons/` - All icon sizes (16px to 256px)
- `branding/` - Name, locales, configuration

---

## 🔧 Customization

### Change Branding
Edit files in `custom-resources/branding/`:
- `configure.sh` - App name and IDs
- `locales/*/brand.*` - Display names
- Replace icons in `icons/` folder

### Modify New Tab Page
Edit `custom-ui/new-tab/`:
- `index.html` - Page structure
- `style.css` - Styling
- `script.js` - Functionality

### Build Configuration
Edit workflow or create `mozconfig`:
- Privacy settings
- Feature flags
- Optimization level

---

## 📦 Build Process

### GitHub Actions (Recommended)
```
1. Fork repository
2. Go to Actions → "Build Firefox (Windows)"
3. Click "Run workflow" → Select "release"
4. Wait 2-3 hours
5. Download artifact from Releases
```

### Local Build
```bash
# See LOCAL_BUILD_GUIDE.md for details
1. Install Mozilla Build Tools
2. Clone Firefox source
3. Copy Silicium branding
4. Build with mach
5. Package portable browser
```

**Build Timeline:**
- Setup: 30 minutes
- Bootstrap: 30 minutes  
- Build: 2-3 hours
- Package: 5 minutes
- **Total: ~3-4 hours**

---

## 💻 Requirements

### GitHub Actions
- ✅ No local requirements
- ✅ Free for public repos
- ✅ Automatic builds

### Local Build
- Windows 10/11
- 8GB+ RAM (16GB recommended)
- 60GB+ free disk space
- Visual Studio 2022 Build Tools
- Mozilla Build Tools

---

## 🗺️ Roadmap

### Phase 1: Privacy & Security (2-3 months)
- Remove Mozilla tracking
- Built-in ad blocker
- Anti-fingerprinting

### Phase 2: UI/UX (1-2 months)
- Sidebar implementation
- Split screen view
- Custom themes

### Phase 3: Downloads (2-3 months)
- Video/audio downloader
- Multi-threaded download manager

### Phase 4: Media (1 month)
- Enhanced Picture-in-Picture

### Phase 5: Network (1 month)
- Built-in DNS changer

**Total: 7-10 months**

---

## 📚 Documentation

- [Features Roadmap](FEATURES_ROADMAP.md) - Complete feature list
- [Firefox Build Guide](FIREFOX_BUILD_GUIDE.md) - Build instructions
- [Branding Guide](BRANDING_GUIDE.md) - Customize name & icons
- [Quick Start](QUICK_START.md) - Get started quickly
- [Local Build Guide](LOCAL_BUILD_GUIDE.md) - Build locally

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

Based on Mozilla Firefox (MPL 2.0)

Custom modifications available under the same license.

---

## 🙏 Acknowledgments

- **Mozilla Firefox** - Excellent browser engine
- **LibreWolf** - Privacy-focused inspiration
- **Floorp** - UI/UX inspiration
- **Mullvad Browser** - Anti-fingerprinting techniques
- **Brave** - Ad blocking approach

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/SiliciumBrowser/TEST/issues)
- **Discussions:** [GitHub Discussions](https://github.com/SiliciumBrowser/TEST/discussions)
- **Releases:** [GitHub Releases](https://github.com/SiliciumBrowser/TEST/releases)

---

**Built with 🔥 by the Silicium team**
