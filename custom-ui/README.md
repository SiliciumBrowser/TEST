# Custom UI Components

Thư mục này chứa các giao diện tùy chỉnh cho browser.

## 📁 Cấu trúc

```
custom-ui/
├── new-tab/          # Trang New Tab
│   ├── index.html
│   ├── style.css
│   └── script.js
├── settings/         # Trang Settings (coming soon)
├── history/          # Trang History (coming soon)
└── bookmarks/        # Trang Bookmarks (coming soon)
```

## 🎨 New Tab Page

### Tính năng

1. **Search Box**
   - Tìm kiếm hoặc nhập URL
   - Auto-suggestions
   - Voice search
   - Multi search engines (Google, DuckDuckGo, Bing)

2. **Quick Links**
   - Shortcuts đến các trang thường dùng
   - Thêm/xóa shortcuts
   - Custom icons

3. **Widgets**
   - Clock: Hiển thị giờ và ngày
   - Weather: Thời tiết (mock data)
   - Stats: Số tabs, bookmarks

4. **Customization**
   - Đổi background (gradient, solid, image)
   - Đổi theme color
   - Chọn search engine
   - Show/hide widgets

### Preview

```
┌─────────────────────────────────────────┐
│  Logo              [Settings]           │
│                                         │
│         ┌─────────────────────┐        │
│         │  🔍 Search...    🎤 │        │
│         └─────────────────────┘        │
│                                         │
│  [GitHub] [Stack] [YouTube] [Twitter]  │
│                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐            │
│  │12:00│  │ ☀️  │  │Tabs │            │
│  │Date │  │25°C │  │  1  │            │
│  └─────┘  └─────┘  └─────┘            │
└─────────────────────────────────────────┘
```

## 🔧 Tích hợp vào Chromium

### Cách 1: Override New Tab URL

Trong `patches/chrome/custom-newtab.patch`:

```patch
diff --git a/chrome/browser/ui/startup/startup_browser_creator.cc
--- a/chrome/browser/ui/startup/startup_browser_creator.cc
+++ b/chrome/browser/ui/startup/startup_browser_creator.cc
@@ -200,7 +200,7 @@
-  GURL url("chrome://newtab");
+  GURL url("file:///path/to/custom-ui/new-tab/index.html");
```

### Cách 2: Chrome Extension (Dễ hơn)

Tạo extension override new tab:

```json
{
  "manifest_version": 3,
  "name": "Custom New Tab",
  "version": "1.0",
  "chrome_url_overrides": {
    "newtab": "new-tab/index.html"
  }
}
```

### Cách 3: Build vào Chromium Resources

Copy files vào `chrome/browser/resources/new_tab_page/`:

```bash
cp custom-ui/new-tab/* chromium/src/chrome/browser/resources/new_tab_page/
```

## 🎨 Customization

### Thay đổi màu theme

Sửa trong `style.css`:

```css
:root {
  --primary-color: #1a73e8;  /* Đổi màu này */
}
```

### Thay đổi background

Sửa trong `style.css`:

```css
.background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Hoặc */
  background: url('your-image.jpg');
  background-size: cover;
}
```

### Thêm quick links

Sửa trong `index.html`:

```html
<div class="quick-link" data-url="https://your-site.com">
  <div class="quick-link-icon">
    <!-- Your icon SVG -->
  </div>
  <span class="quick-link-title">Your Site</span>
</div>
```

## 📱 Responsive

New Tab page hoàn toàn responsive:
- Desktop: Full layout với widgets
- Tablet: Adjusted grid
- Mobile: Single column, simplified

## 🚀 Development

### Local testing

```bash
# Mở file trực tiếp
open custom-ui/new-tab/index.html

# Hoặc dùng local server
cd custom-ui/new-tab
python -m http.server 8000
# Mở http://localhost:8000
```

### Build vào Chromium

Khi build Chromium, files sẽ tự động được copy vào resources.

## 🎯 Roadmap

- [ ] Settings page
- [ ] History page
- [ ] Bookmarks manager
- [ ] Extensions manager
- [ ] Downloads page
- [ ] Dark mode
- [ ] More widgets (notes, todo, RSS)
- [ ] Sync settings
- [ ] Import/export settings

## 💡 Tips

### Performance
- Minimize JavaScript
- Use CSS animations instead of JS
- Lazy load widgets
- Cache settings in localStorage

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

### Browser Integration
- Use Chrome APIs when available
- Fallback for non-Chrome browsers
- Progressive enhancement
