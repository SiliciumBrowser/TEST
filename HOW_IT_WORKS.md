# 🔧 Cách hoạt động của Custom Chromium Builder

## 🎨 Custom Theme (Không dùng Extension)

### Phương pháp: User Stylesheet
Chrome hỗ trợ User Stylesheet mặc định mà không cần Developer Mode.

**File**: `Default/User StyleSheets/Custom.css`

```css
/* Thay đổi scrollbar */
::-webkit-scrollbar-thumb {
  background: #1a73e8;
}

/* Thay đổi selection color */
::selection {
  background: #1a73e866;
}
```

### Kết quả
- ✅ Không cần extension
- ✅ Không cần Developer Mode
- ✅ Professional, sẵn sàng phát hành
- ⚠️ Chỉ thay đổi được: scrollbar, selection, một số CSS

## 📝 Custom Browser Name

### Phương pháp: Window Title + Shortcut
1. **Batch/PowerShell**: Dùng `title` command và `start "Name"`
2. **Desktop Shortcut**: Tạo shortcut với tên custom
3. **Branding file**: Lưu thông tin trong `branding.json`

### Kết quả
- ✅ Window title hiển thị tên custom
- ✅ Desktop shortcut có tên custom
- ✅ Không cần extension
- ⚠️ About page vẫn hiển thị "Chrome"

## 🚫 AdBlock (Không dùng Extension)

### Phương pháp: Hosts File + Policies
1. **Hosts file**: Danh sách domain cần block
2. **Block rules**: JSON config để block
3. **Flags**: `--host-rules` để redirect

### Kết quả
- ✅ Không cần extension
- ✅ Không cần Developer Mode
- ✅ Block được ads cơ bản
- ⚠️ Không mạnh bằng uBlock Origin

## 🔒 Privacy

### Phương pháp: Preferences + Flags
1. **master_preferences**: Config cho first run
2. **Default/Preferences**: User preferences
3. **Flags**: Privacy flags trong launcher

### Kết quả
- ✅ Privacy settings cao
- ✅ Không cần extension
- ✅ Professional

## 🧩 Extensions

### Phương pháp: Hướng dẫn cài đặt
Không pre-install extensions vì:
- ❌ Cần Developer Mode
- ❌ Không professional
- ❌ Có warning khi mở browser

Thay vào đó:
- ✅ Hướng dẫn cài từ Chrome Web Store
- ✅ Hướng dẫn cài manual (.crx)
- ✅ Cung cấp danh sách extensions khuyên dùng

## 🚀 Launcher Flags

### Các flags quan trọng

```bash
--user-data-dir=path           # Custom profile directory
--disable-background-networking # Tắt kết nối nền
--disable-sync                  # Tắt đồng bộ Google
--no-first-run                  # Bỏ qua màn hình đầu tiên
--force-color-profile=srgb      # Force color profile
```

### Kết quả
Browser khởi động nhanh, privacy tốt, không có warning.

## 📦 So sánh phương pháp

| Tính năng | Extension | User Stylesheet | Policies | Flags |
|-----------|-----------|-----------------|----------|-------|
| Developer Mode | ❌ Cần | ✅ Không | ✅ Không | ✅ Không |
| Professional | ❌ Không | ✅ Có | ✅ Có | ✅ Có |
| Warning | ❌ Có | ✅ Không | ✅ Không | ✅ Không |
| Phát hành | ❌ Không | ✅ Được | ✅ Được | ✅ Được |

## 🎯 Giới hạn (Realistic)

### Không thể làm được
- ❌ Thay đổi logo trong About page
- ❌ Thay đổi splash screen
- ❌ Thay đổi internal pages (chrome://)
- ❌ Thay đổi toolbar UI hoàn toàn
- ❌ Pre-install extensions (professional way)

### Có thể làm được
- ✅ Thay đổi scrollbar color
- ✅ Thay đổi selection color
- ✅ Thay đổi window title
- ✅ Custom bookmarks
- ✅ Custom search engine
- ✅ Privacy settings
- ✅ Block ads (cơ bản)
- ✅ Custom flags

## 💡 Khuyến nghị

### Cho phát hành sản phẩm
1. ✅ Dùng User Stylesheet cho theme
2. ✅ Dùng Policies cho settings
3. ✅ Dùng Flags cho behavior
4. ✅ Hướng dẫn user cài extensions từ Web Store
5. ❌ KHÔNG dùng unpacked extensions

### Cho development/testing
1. ✅ Có thể dùng unpacked extensions
2. ✅ Có thể enable Developer Mode
3. ✅ Test mọi tính năng

## 🔍 Kiểm tra

### User Stylesheet có hoạt động?
1. Mở browser
2. Vào bất kỳ trang web
3. Xem scrollbar có đổi màu không

### Preferences có apply?
1. Vào `chrome://settings`
2. Kiểm tra privacy settings

### Window title có đúng?
1. Xem title bar của window
2. Xem taskbar

## 📝 Kết luận

Phương pháp này:
- ✅ Professional
- ✅ Không có warning
- ✅ Sẵn sàng phát hành
- ✅ Không cần Developer Mode
- ⚠️ Giới hạn customization hơn dùng extension
- ⚠️ Nhưng đủ cho 90% use cases
