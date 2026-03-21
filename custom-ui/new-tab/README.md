# SiliciumBrowser New Tab Page

Trang New Tab tùy chỉnh cho SiliciumBrowser với nhiều tính năng mạnh mẽ.

## ✨ Tính năng

### 🎨 Hình nền
- Video background (MP4, WebM)
- GIF động
- Ảnh tĩnh
- Màu đơn sắc
- Upload từ máy hoặc URL

### ⏰ Widgets
- **Đồng hồ**: Tùy chỉnh font, màu, kích thước, định dạng 12h/24h
- **Ngày tháng**: Nhiều định dạng hiển thị
- **Thời tiết**: Tự động lấy vị trí hoặc nhập tọa độ thủ công
- **Quick Links**: Gmail, YouTube (có thể tắt)
- **Lịch sử tìm kiếm**: Gợi ý từ lịch sử browser
- **Gợi ý Google**: Real-time suggestions

### 🔍 Tìm kiếm
- Multi search engines (Google, Bing, DuckDuckGo)
- Thêm custom search engines
- Gợi ý từ Google
- Gợi ý từ lịch sử browser
- Omnibox integration

### ⚡ Shortcuts
- Thêm/xóa/sửa shortcuts
- Drag & drop để sắp xếp
- Tùy chỉnh số hàng và số shortcuts/hàng
- Tùy chỉnh độ trong suốt

### 💾 Backup & Restore
- Sao lưu toàn bộ settings
- Phục hồi từ file backup
- Bao gồm cả hình ảnh đã upload

## ✅ Trạng thái tích hợp

- ✅ Chrome API polyfill đã được thêm
- ✅ Tất cả Chrome Extension APIs đã được thay thế bằng localStorage
- ✅ Lỗi syntax trong background.js đã được sửa
- ✅ Sẵn sàng tích hợp vào Chromium build

## 🔧 Tích hợp vào SiliciumBrowser

### Cách 1: Override New Tab URL (Đơn giản nhất)

Trong `patches/chrome/custom-newtab.patch`:

\`\`\`patch
diff --git a/chrome/browser/ui/startup/startup_browser_creator.cc
--- a/chrome/browser/ui/startup/startup_browser_creator.cc
+++ b/chrome/browser/ui/startup/startup_browser_creator.cc
@@ -200,7 +200,7 @@
-  GURL url("chrome://newtab");
+  GURL url("file:///custom-ui/new-tab/index.html");
\`\`\`

### Cách 2: Build vào Resources

Copy files vào Chromium source:

\`\`\`bash
cp -r custom-ui/new-tab/* chromium/src/chrome/browser/resources/new_tab_page/
\`\`\`

### Cách 3: Dùng như Extension (Development)

Manifest đã có sẵn, chỉ cần:
1. Mở `chrome://extensions`
2. Enable Developer mode
3. Load unpacked → chọn folder `custom-ui/new-tab`

## 🔄 Chrome API Polyfill

Extension này hoạt động ở 2 chế độ:

### Extension Mode
Khi load như Chrome extension, sử dụng native Chrome APIs:
- `chrome.storage.local`
- `chrome.history`
- `chrome.tabs`
- `chrome.runtime`

### Standalone Mode
Khi tích hợp vào SiliciumBrowser, polyfill tự động thay thế:
- `chrome.storage.local` → `localStorage`
- `chrome.history` → Mock implementation
- `chrome.tabs` → `window.open()`
- `chrome.runtime` → Mock implementation

Polyfill tự động phát hiện môi trường và chọn implementation phù hợp.

## 📝 Files quan trọng

- `index.html` - Main HTML (đã thêm polyfill)
- `chrome-polyfill.js` - Chrome API polyfill cho standalone mode
- `script.js` - Main logic
- `widget.js` - Widget management
- `setting.js` - Settings panel
- `background.js` - Background service (đã sửa syntax errors)
- `style.css` - Styling

## 🚀 Development

### Local testing (Standalone mode)

\`\`\`bash
cd custom-ui/new-tab
python -m http.server 8000
# Mở http://localhost:8000/index.html
# Polyfill sẽ tự động kích hoạt
\`\`\`

### Testing as Extension

1. Mở `chrome://extensions`
2. Enable Developer mode
3. Load unpacked → chọn folder `custom-ui/new-tab`
4. Native Chrome APIs sẽ được sử dụng

### Build for production

1. Minify CSS/JS
2. Optimize images
3. Package into Chromium resources
4. Polyfill sẽ tự động handle compatibility

## 📱 Responsive

- Desktop: Full layout
- Tablet: Adjusted grid
- Mobile: Simplified layout

## 🔒 Privacy

- Không gửi data ra ngoài (trừ weather API)
- Tất cả settings lưu local (localStorage hoặc chrome.storage)
- Không tracking

## 💡 Tips

### Performance
- Video background có thể ảnh hưởng performance
- Nên dùng video nhẹ (<5MB cho localStorage)
- GIF nên dưới 5MB

### Customization
- Tất cả widgets có thể tắt
- Shortcuts có thể ẩn hoàn toàn
- Background có thể để trống (màu đen)

### Browser Integration
- Weather cần geolocation permission
- History cần history permission (hoặc dùng mock)
- Suggestions cần network access

## 🐛 Troubleshooting

### Lỗi "Cannot read properties of undefined (reading 'local')"
✅ Đã được sửa bằng cách thêm `chrome-polyfill.js` vào `index.html`

### Video background không chạy
- Kiểm tra file size (<5MB)
- Kiểm tra format (MP4, WebM)
- Kiểm tra console log

### Settings không lưu
- Kiểm tra localStorage có bị block không
- Kiểm tra console log
- Thử clear cache và reload
