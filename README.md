# SiliciumBrowser

Trình duyệt web tùy chỉnh được build từ Chromium source code với các tính năng độc đáo.

## ✨ Tính năng chính

- 🎨 **Custom New Tab Page**: Trang new tab với video/GIF backgrounds, widgets, shortcuts
- 🔒 **Isolated User Data**: Không xung đột với Chrome đã cài
- 🎯 **Full Customization**: Tùy chỉnh sâu từ source code
- ⚡ **Performance**: Tối ưu hóa cho hiệu suất cao

## 🏗️ Build Strategy

### Cách tiếp cận

Chúng ta đã thử 2 cách và chọn cách tốt nhất:

1. ❌ **Patch Existing Chrome** (Tải Chrome về rồi sửa)
   - Quá hạn chế, không thể tùy chỉnh sâu
   - Đã thử và không hoạt động tốt

2. ❌ **Component Build** (Build từng phần V8, Blink, Content...)
   - Quá phức tạp, nhiều lỗi target
   - Khó tích hợp và tùy chỉnh

3. ✅ **Full Chromium Build** (Build toàn bộ từ source)
   - Tùy chỉnh hoàn toàn mọi thứ
   - Áp dụng patches dễ dàng
   - Cách DUY NHẤT để có browser thực sự tùy chỉnh

### GitHub Actions Build

- **Thời gian build**: ~5-6 giờ (trong giới hạn 6h của GitHub Actions)
- **Platform**: Linux x64
- **Build type**: Release (optimized) hoặc Debug
- **Tự động**: Trigger manual hoặc theo schedule

## 🚀 Quick Start

### Build trên GitHub Actions

1. Vào tab **Actions** trong repository
2. Chọn workflow **Build SiliciumBrowser**
3. Click **Run workflow**
4. Chọn build type (release/debug)
5. Đợi ~5-6 giờ
6. Download artifact từ workflow run

### Build local (nếu có máy mạnh)

```bash
# Clone repository
git clone https://github.com/your-username/SiliciumBrowser.git
cd SiliciumBrowser

# Setup depot_tools
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
export PATH="$PWD/depot_tools:$PATH"

# Fetch Chromium source
mkdir chromium && cd chromium
fetch --nohooks chromium
cd src

# Install dependencies (Linux)
./build/install-build-deps.sh

# Sync and run hooks
gclient sync
gclient runhooks

# Copy custom resources
cp -r ../../custom-ui/new-tab chrome/browser/resources/silicium_newtab/

# Apply patches
git apply ../../patches/*.patch

# Configure build
gn gen out/Release --args='is_debug=false is_official_build=true'

# Build (8-12 giờ trên máy thường)
ninja -C out/Release chrome
```

## 📁 Cấu trúc dự án

```
SiliciumBrowser/
├── .github/workflows/
│   └── build-silicium-browser.yml    # GitHub Actions workflow
├── custom-ui/
│   └── new-tab/                       # Custom new tab page
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       ├── chrome-polyfill.js         # Chrome API polyfill
│       └── ...
├── custom-resources/
│   ├── icons/                         # Custom icons
│   └── extensions/                    # Custom extensions
├── patches/                           # Chromium patches
│   └── README.md
├── custom-patches/                    # Your custom patches
│   └── README.md
└── README.md
```

## 🎨 Tùy chỉnh

### 1. Custom New Tab Page

File: `custom-ui/new-tab/`

Tính năng:
- Video/GIF/Image backgrounds
- Customizable clock & date
- Weather widget
- Drag-drop shortcuts
- Multiple search engines
- Google suggestions
- Backup/restore settings

### 2. Branding

Thay đổi trong patches:
- Logo và icons
- Tên browser
- Màu sắc theme
- Default settings

### 3. Features

Thêm/bỏ features qua GN args:
```python
enable_nacl=false              # Tắt NaCl
proprietary_codecs=true        # Bật codecs
ffmpeg_branding="Chrome"       # Dùng FFmpeg của Chrome
```

## 🔧 Patches

### Tạo patch mới

```bash
cd chromium/src

# Sửa code của bạn
vim chrome/browser/ui/startup/startup_browser_creator.cc

# Tạo patch
git diff > ../../custom-patches/my-feature.patch
```

### Áp dụng patch

Patches tự động được áp dụng trong workflow. Hoặc manual:

```bash
cd chromium/src
git apply ../../custom-patches/my-feature.patch
```

## 📦 Installation

### Linux

```bash
# Extract
tar -xzf silicium-browser-linux.tar.gz
cd silicium-browser

# Run
./silicium-browser
```

### Windows (Coming soon)

Build cho Windows cần Windows runner (tốn phí).

## 🐛 Troubleshooting

### Build timeout trên GitHub Actions

- Giảm `symbol_level=0`
- Tắt features không cần: `enable_nacl=false`
- Dùng `is_component_build=false` (nhỏ hơn)

### Disk space issues

Workflow tự động dọn dẹp:
- Xóa .NET, PHP, MongoDB...
- Xóa Android SDK
- Giải phóng ~30GB

### Build errors

Check logs trong Actions tab. Thường do:
- Patches không apply được
- Dependencies thiếu
- GN args không hợp lệ

## 📊 Build Stats

- **Source code size**: ~30GB
- **Build output**: ~5GB
- **Final package**: ~200-300MB (compressed)
- **Build time**: 5-6 giờ (GitHub Actions)
- **Build time**: 8-12 giờ (máy thường)

## 🤝 Contributing

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Tạo Pull Request

## 📝 License

Chromium source code: BSD License
Custom code: MIT License

## 🔗 Links

- [Chromium Build Instructions](https://chromium.googlesource.com/chromium/src/+/main/docs/linux/build_instructions.md)
- [GN Build Configuration](https://gn.googlesource.com/gn/+/main/docs/reference.md)
- [Chromium Patches](https://chromium.googlesource.com/chromium/src/+/main/docs/contributing.md)
