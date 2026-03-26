# SiliciumBrowser - Features Roadmap 🦊

## Vision

Tạo một trình duyệt Firefox-based với:
- 🔒 Privacy-first (như LibreWolf, Mullvad)
- ⚡ Performance-focused (download manager như IDM)
- 🎨 Feature-rich (sidebar, video downloader như Cốc Cốc)
- 🌐 Vietnamese-optimized
- 📖 100% Open Source

---

## Phase 1: Privacy & Security (Foundation) 🔒

### 1.1 Remove Mozilla Tracking (LibreWolf-style)
**Priority:** HIGH | **Complexity:** MEDIUM

**Features:**
- ❌ Remove telemetry completely
- ❌ Remove Pocket integration
- ❌ Remove sponsored content
- ❌ Remove Firefox Sync (or make optional)
- ❌ Remove crash reporter
- ✅ Disable automatic updates (manual only)

**Implementation:**
- Modify `mozconfig` to disable features
- Patch `browser/app/profile/firefox.js` preferences
- Remove UI components for Pocket, Sync

**References:**
- LibreWolf: https://librewolf.net/
- Config: https://codeberg.org/librewolf/settings

---

### 1.2 Anti-Fingerprinting (Mullvad-style)
**Priority:** HIGH | **Complexity:** HIGH

**Features:**
- 🎭 Resist fingerprinting (RFP) enabled by default
- 🌐 Spoof timezone to UTC
- 📱 Standardize user agent
- 🖥️ Letterboxing (resize window to common sizes)
- 🎨 Canvas fingerprinting protection
- ⚠️ Not as strict as Tor Browser (balance usability)

**Implementation:**
- Enable `privacy.resistFingerprinting = true`
- Configure RFP preferences
- Patch canvas/WebGL APIs
- Add UI toggle for strictness levels

**References:**
- Mullvad Browser: https://mullvad.net/browser
- Firefox RFP: https://wiki.mozilla.org/Security/Fingerprinting

---

### 1.3 Built-in Ad Blocker (Brave-style)
**Priority:** HIGH | **Complexity:** HIGH

**Features:**
- 🚫 Block ads at network level
- 🛡️ Block trackers and analytics
- 📊 Show blocked count in toolbar
- ⚙️ Customizable filter lists
- 🌍 Support Vietnamese ad lists

**Implementation:**
- Integrate uBlock Origin engine (C++)
- Or use Firefox's built-in content blocking
- Add custom filter lists
- Create UI for statistics

**References:**
- Brave Shields: https://github.com/brave/brave-core
- uBlock Origin: https://github.com/gorhill/uBlock

---

## Phase 2: UI/UX Enhancements 🎨

### 2.1 Sidebar & Split Screen (Floorp-style)
**Priority:** MEDIUM | **Complexity:** MEDIUM

**Features:**
- 📱 Vertical tab sidebar
- ↔️ Split screen view (2 tabs side-by-side)
- 🔖 Bookmarks sidebar
- 📝 Notes sidebar
- 🎯 Quick access panel

**Implementation:**
- Create XUL/HTML sidebar component
- Add split-view container
- Modify browser.xhtml layout
- Add keyboard shortcuts

**References:**
- Floorp: https://floorp.app/
- Firefox Sidebar API

---

### 2.2 Custom UI/UX
**Priority:** MEDIUM | **Complexity:** MEDIUM

**Features:**
- 🎨 Custom theme system
- 🌈 Color schemes (light/dark/auto)
- 📐 Compact/normal/touch UI modes
- 🖱️ Customizable toolbar
- ⌨️ Vietnamese keyboard shortcuts

**Implementation:**
- Create custom CSS themes
- Modify browser chrome
- Add theme switcher UI
- Localize to Vietnamese

---

## Phase 3: Download Features (Cốc Cốc-style) ⬇️

### 3.1 Video/Audio Downloader
**Priority:** HIGH | **Complexity:** HIGH

**Features:**
- 🎥 Auto-detect video/audio links
- 📺 Support: YouTube, Facebook, TikTok, Instagram
- 🎬 Multiple quality options (360p, 720p, 1080p, 4K)
- 🎵 Extract audio only (MP3)
- 📋 Batch download
- 🔗 Copy download link

**Implementation:**
- Inject content script to detect media
- Use yt-dlp/youtube-dl backend
- Create download UI panel
- Add format selector

**References:**
- yt-dlp: https://github.com/yt-dlp/yt-dlp
- Video DownloadHelper (Firefox extension)

---

### 3.2 Multi-threaded Download Manager (IDM-style)
**Priority:** HIGH | **Complexity:** HIGH

**Features:**
- ⚡ Split files into chunks (multi-threading)
- 📊 Speed up downloads 3-5x
- ⏸️ Pause/resume support
- 📈 Real-time speed graph
- 🔄 Auto-retry on failure
- 📁 Custom download location

**Implementation:**
- Replace Firefox download manager
- Implement chunked downloading (Range requests)
- Create download queue system
- Add progress UI with statistics

**References:**
- aria2: https://github.com/aria2/aria2
- IDM algorithm: HTTP Range requests

---

## Phase 4: Media Features 📺

### 4.1 Picture-in-Picture (PiP)
**Priority:** LOW | **Complexity:** LOW

**Features:**
- 🖼️ Floating video window
- 📌 Always on top
- 🎛️ Playback controls
- 📐 Resizable window
- ⌨️ Keyboard shortcuts

**Implementation:**
- Firefox already has PiP built-in!
- Enhance UI and controls
- Add more customization options

**Status:** ✅ Already in Firefox, just need to enhance

---

## Phase 5: Network Features 🌐

### 5.1 Built-in DNS Changer
**Priority:** MEDIUM | **Complexity:** LOW

**Features:**
- 🌍 Change DNS without system-wide config
- ⚡ Quick DNS presets (Google, Cloudflare, Quad9)
- 🇻🇳 Vietnamese DNS options
- 🔒 DNS-over-HTTPS (DoH)
- 🛡️ DNS-over-TLS (DoT)
- 📊 DNS speed test

**Implementation:**
- Use Firefox's built-in DoH
- Add UI for DNS selection
- Create preset list
- Add speed test tool

**References:**
- Firefox DoH: `network.trr.mode`
- DNS providers list

---

## Implementation Priority

### Phase 1 (Foundation) - 2-3 months
1. ✅ Build system setup (DONE)
2. 🔒 Remove tracking & telemetry
3. 🛡️ Basic ad blocking
4. 🎭 Anti-fingerprinting

### Phase 2 (UI/UX) - 1-2 months
1. 🎨 Custom themes
2. 📱 Sidebar implementation
3. ↔️ Split screen view

### Phase 3 (Downloads) - 2-3 months
1. 🎥 Video downloader
2. ⚡ Multi-threaded download manager

### Phase 4 (Media) - 1 month
1. 🖼️ Enhanced PiP

### Phase 5 (Network) - 1 month
1. 🌐 DNS changer UI

**Total estimated time:** 7-10 months

---

## Technical Approach

### For Each Feature:

1. **Research** - Study existing implementations
2. **Design** - Create technical design doc
3. **Prototype** - Build minimal version
4. **Test** - Verify functionality
5. **Polish** - Improve UI/UX
6. **Document** - Write user guide

### Development Workflow:

```
Feature Branch → Implement → Test → PR → Merge → Build → Release
```

---

## Resources Needed

### Code References:
- **LibreWolf:** https://codeberg.org/librewolf
- **Floorp:** https://github.com/Floorp-Projects/Floorp
- **Mullvad Browser:** https://github.com/mullvad/mullvad-browser
- **Brave:** https://github.com/brave/brave-browser
- **uBlock Origin:** https://github.com/gorhill/uBlock

### Tools:
- **yt-dlp:** Video downloading
- **aria2:** Multi-threaded downloads
- **Firefox source:** Base browser

---

## Success Metrics

- ✅ All tracking removed (verified with Wireshark)
- ✅ Ad blocking >95% effective
- ✅ Download speed 3-5x faster
- ✅ Video downloader supports top 10 sites
- ✅ Fingerprinting score: "Unique" → "Common"
- ✅ 100% open source
- ✅ Active community

---

## Next Steps

1. **Immediate:** Fix Firefox build packaging (in progress)
2. **Week 1:** Start Phase 1.1 (Remove tracking)
3. **Week 2:** Implement basic ad blocking
4. **Month 1:** Complete Phase 1
5. **Month 2-3:** Phase 2 (UI/UX)
6. **Month 4-6:** Phase 3 (Downloads)

---

**Let's build the best privacy-focused, feature-rich browser for Vietnam! 🇻🇳🦊**
