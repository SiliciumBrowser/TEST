# Firefox Build Guide - Hướng Dẫn Build Firefox

## Tại Sao Chuyển Sang Firefox?

### So Sánh Chromium vs Firefox

| Tiêu chí | Chromium | Firefox |
|----------|----------|---------|
| Build time | 5-6 giờ | 2-3 giờ ✅ |
| Disk space | ~100GB | ~60GB ✅ |
| RAM needed | 16GB+ | 8GB+ ✅ |
| Customize | Khó | Dễ hơn ✅ |
| Build system | Ninja (phức tạp) | Mach (đơn giản) ✅ |

### Ưu Điểm Firefox

1. ✅ **Nhanh hơn** - Build trong 2-3 giờ
2. ✅ **Nhỏ hơn** - Tiết kiệm disk space
3. ✅ **Đơn giản hơn** - `./mach build` thay vì ninja
4. ✅ **Dễ customize** - Firefox có system rõ ràng
5. ✅ **Ổn định hơn** - Ít timeout trên GitHub Actions

## Workflow Firefox

### Các Bước Build

```
1. Install Mozilla Build Tools (5 phút)
   ↓
2. Clone Firefox source (10 phút)
   ↓
3. Bootstrap dependencies (15 phút)
   ↓
4. Configure build (mozconfig) (1 phút)
   ↓
5. Build Firefox (2-3 giờ)
   ↓
6. Package browser (5 phút)
   ↓
7. Upload artifacts (5 phút)
   ↓
✅ DONE!
```

**Tổng thời gian: ~2.5-3.5 giờ**

## Cách Sử Dụng

### Bước 1: Push Code

```bash
git add .
git commit -m "Add Firefox build workflow"
git push
```

### Bước 2: Chạy Workflow

1. Vào GitHub → Actions
2. Chọn "Build Firefox (Windows)"
3. Click "Run workflow"
4. Chọn build type:
   - `release` - Optimized, production build
   - `debug` - Debug symbols, slower
5. Click "Run workflow"

### Bước 3: Đợi Build

- **Thời gian:** 2-3 giờ
- **Timeout:** 4 giờ (đủ để hoàn thành)
- **Monitor:** Xem log real-time

### Bước 4: Download Browser

Khi build xong:
1. Scroll xuống "Artifacts"
2. Download `silicium-browser-firefox-release`
3. Extract ZIP
4. Run `firefox.exe`

## Build Configuration

### mozconfig File

Firefox dùng `mozconfig` để configure build:

```bash
# Release build
ac_add_options --enable-optimize
ac_add_options --disable-debug

# Debug build
ac_add_options --enable-debug
ac_add_options --disable-optimize

# Common options
ac_add_options --enable-application=browser
ac_add_options --disable-tests
ac_add_options --disable-crashreporter
```

### Customization

Để customize Firefox:

1. **Branding** - `browser/branding/unofficial/`
2. **New Tab** - `browser/components/newtab/`
3. **Icons** - `browser/branding/unofficial/content/`
4. **Preferences** - `browser/app/profile/firefox.js`

## Troubleshooting

### Build Failed

**Lỗi:** "mach build failed"
- Check log để xem lỗi cụ thể
- Thường do thiếu dependencies
- Bootstrap lại: `./mach bootstrap`

### Build Timeout

**Lỗi:** Workflow timeout sau 4 giờ
- Firefox build thường < 3 giờ
- Nếu timeout → có vấn đề với build
- Check log để debug

### Package Not Found

**Lỗi:** "Package not found in obj-firefox/dist"
- Build chưa hoàn thành
- Check bước "Build Firefox" có lỗi không
- Verify `./mach package` chạy thành công

## Customize Firefox

### Thay Đổi Branding

```bash
# Edit branding files
firefox/browser/branding/unofficial/
├── content/
│   ├── about-logo.png
│   ├── icon48.png
│   └── icon64.png
├── locales/en-US/
│   └── brand.properties
└── configure.sh
```

### Thay Đổi New Tab

```bash
# Edit new tab page
firefox/browser/components/newtab/
├── content-src/
│   └── components/
└── data/
```

### Thay Đổi Preferences

```bash
# Edit default preferences
firefox/browser/app/profile/firefox.js

# Add custom prefs
pref("browser.startup.homepage", "about:home");
pref("browser.newtabpage.enabled", true);
```

## So Sánh Với Chromium

### Chromium (Đã Thử)

- ❌ Build time: 5-6 giờ
- ❌ Timeout nhiều lần
- ❌ Khó customize
- ❌ Cần 100GB disk space
- ❌ 12 giờ mà chưa có browser

### Firefox (Mới)

- ✅ Build time: 2-3 giờ
- ✅ Ít timeout hơn
- ✅ Dễ customize
- ✅ Chỉ cần 60GB disk space
- ✅ Có browser sau 3 giờ

## Next Steps

### Sau Khi Build Thành Công

1. **Download browser** - Extract và test
2. **Customize** - Thay icon, new tab, branding
3. **Rebuild** - Push changes, build lại (nhanh hơn)
4. **Distribute** - Share browser với người khác

### Customize Workflow

Để customize nhanh hơn:
1. Thay đổi files trong `custom-ui/`
2. Workflow sẽ copy vào Firefox source
3. Build lại (chỉ 2-3 giờ)

## Tips

1. **Release build** - Nhanh hơn debug build
2. **Disable tests** - Tiết kiệm thời gian
3. **Monitor log** - Check progress thường xuyên
4. **Be patient** - 2-3 giờ là bình thường

---

**Firefox build nhanh hơn và đơn giản hơn Chromium!** 🦊

**Push code và chạy workflow ngay!** 🚀
