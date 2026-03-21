# 🔒 Isolation - Tại sao quan trọng?

## ❌ Vấn đề khi KHÔNG isolation

### Khi custom Chromium dùng chung User Data với Chrome gốc:

```
Chrome gốc: %LOCALAPPDATA%\Google\Chrome\User Data
Custom Chromium: %LOCALAPPDATA%\Google\Chrome\User Data  ← SAME!
```

### Hậu quả:

1. **Xung đột settings**
   - Custom browser ghi đè settings của Chrome gốc
   - Chrome gốc ghi đè settings của custom browser
   - Không biết settings nào đang active

2. **Xung đột extensions**
   - Extensions của custom browser xuất hiện trong Chrome gốc
   - Extensions của Chrome gốc xuất hiện trong custom browser
   - Có thể gây crash hoặc lỗi

3. **Xung đột bookmarks/history**
   - Bookmarks bị merge lộn xộn
   - History bị trộn lẫn
   - Không phân biệt được browser nào

4. **Không thể chạy đồng thời**
   - Chrome lock User Data directory
   - Chỉ 1 browser có thể chạy tại 1 thời điểm

5. **Mất data khi uninstall**
   - Xóa custom browser có thể xóa data của Chrome gốc
   - Rất nguy hiểm!

## ✅ Giải pháp: Isolation

### Dùng User Data riêng:

```
Chrome gốc: %LOCALAPPDATA%\Google\Chrome\User Data
Custom Chromium: [Browser Folder]\UserData  ← ISOLATED!
```

### Lợi ích:

1. **Không xung đột**
   - Mỗi browser có settings riêng
   - Không ghi đè lẫn nhau
   - Hoạt động độc lập

2. **Chạy đồng thời**
   - Có thể mở cả 2 browsers cùng lúc
   - Không lock lẫn nhau
   - Tiện cho testing

3. **Portable**
   - Tất cả data trong 1 folder
   - Copy folder = backup toàn bộ
   - Chạy được trên USB

4. **An toàn khi uninstall**
   - Xóa folder custom browser
   - Chrome gốc KHÔNG bị ảnh hưởng
   - Data của Chrome gốc an toàn

5. **Professional**
   - Đúng cách phát hành sản phẩm
   - Không làm ảnh hưởng hệ thống user
   - Dễ support

## 🚀 Cách implement

### Flag quan trọng nhất:

```bash
--user-data-dir="[Browser Folder]\UserData"
```

### Trong launcher:

```batch
@echo off
set DIR=%~dp0
set USER_DATA_DIR=%DIR%UserData

start "My Browser" "%DIR%chrome.exe" ^
  --user-data-dir="%USER_DATA_DIR%" ^
  --no-default-browser-check ^
  %*
```

### Flag bổ sung:

```bash
--no-default-browser-check  # Không hỏi set làm default
--no-first-run              # Bỏ qua first run wizard
--disable-sync              # Tắt sync với Google account
```

## 📁 Cấu trúc thư mục

```
CustomBrowser/
├── chrome.exe
├── launch.bat
├── launch.ps1
├── UserData/              ← ISOLATED DATA
│   ├── Default/
│   │   ├── Bookmarks
│   │   ├── History
│   │   ├── Preferences
│   │   ├── Extensions/
│   │   └── ...
│   └── ...
└── README.txt
```

## 🔍 Kiểm tra isolation

### Cách 1: Xem User Data path
1. Mở custom browser
2. Vào `chrome://version`
3. Xem "Profile Path"
4. Phải là `[Browser Folder]\UserData\Default`

### Cách 2: Test bookmarks
1. Thêm bookmark trong custom browser
2. Mở Chrome gốc
3. Bookmark KHÔNG xuất hiện trong Chrome gốc
4. ✅ Isolated thành công!

### Cách 3: Chạy đồng thời
1. Mở Chrome gốc
2. Mở custom browser
3. Cả 2 chạy được cùng lúc
4. ✅ Isolated thành công!

## 💡 Best Practices

### 1. Luôn dùng --user-data-dir
```bash
# GOOD
chrome.exe --user-data-dir=".\UserData"

# BAD (dùng default location)
chrome.exe
```

### 2. Đặt UserData trong browser folder
```
# GOOD (portable)
CustomBrowser\UserData\

# BAD (system location)
%LOCALAPPDATA%\CustomBrowser\
```

### 3. Thêm flag --no-default-browser-check
```bash
# Tránh hỏi set làm default browser
--no-default-browser-check
```

### 4. Document rõ ràng
Tạo file `ISOLATION_INFO.txt` giải thích cho user.

### 5. Backup dễ dàng
```bash
# Backup = copy folder
xcopy CustomBrowser CustomBrowser_Backup /E /I
```

## 🎯 Kết luận

Isolation là:
- ✅ BẮT BUỘC cho sản phẩm professional
- ✅ Tránh xung đột với Chrome gốc
- ✅ Cho phép chạy đồng thời
- ✅ Portable và dễ backup
- ✅ An toàn khi uninstall

KHÔNG isolation là:
- ❌ Nguy hiểm
- ❌ Không professional
- ❌ Gây xung đột
- ❌ Mất data
- ❌ Không thể phát hành
