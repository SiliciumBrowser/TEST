# 🎨 Custom Chromium Builder

Build trình duyệt Chromium tùy chỉnh hoàn toàn miễn phí với GitHub Actions!

## 🖥️ Hỗ trợ nền tảng

- ✅ **Windows** (x64) - Workflow riêng
- ✅ **Linux** (x64) - Workflow riêng
- 🔜 **macOS** (Coming soon)

## ✨ Tính năng

- 🎨 **Custom UI Theme** - Thay đổi màu scrollbar, selection
- 🚫 **AdBlock tích hợp** - Chặn quảng cáo cơ bản
- 🔒 **Privacy Enhanced** - Tăng cường bảo mật
- 📚 **Custom Bookmarks** - Bookmarks tùy chỉnh
- 🔍 **Custom Search Engine** - Đổi công cụ tìm kiếm mặc định
- ⚡ **Performance Optimized** - Tối ưu hiệu suất
- 🔒 **ISOLATED** - Không xung đột với Chrome gốc

## 🔒 Isolation - Quan trọng!

Browser này hoàn toàn **ISOLATED** khỏi Chrome gốc:

- ✅ User Data riêng (trong folder `UserData/`)
- ✅ KHÔNG ghi đè settings của Chrome
- ✅ KHÔNG xung đột bookmarks/extensions
- ✅ Chạy đồng thời với Chrome được
- ✅ Xóa browser này KHÔNG ảnh hưởng Chrome gốc

Xem chi tiết: `ISOLATION_EXPLAINED.md`

## 🚀 Quick Start

### Windows Users

1. Push code lên GitHub
2. Vào **Actions** → **"🎨 Custom Chromium Builder (Windows)"**
3. Click **"Run workflow"**
4. Điền thông tin và chạy
5. Tải file `custom-chromium-windows.zip`
6. Giải nén và chạy `launch.bat`

### Linux Users

1. Push code lên GitHub
2. Vào **Actions** → **"🎨 Custom Chromium Builder"**
3. Click **"Run workflow"**
4. Điền thông tin và chạy
5. Tải file `custom-chromium.tar.gz`
6. Giải nén và chạy `./launch.sh`

## 📖 Chi tiết

Xem file `QUICK_START.md` để biết hướng dẫn chi tiết.

## 🎨 Tùy chỉnh

### Thay đổi màu theme
Khi chạy workflow, nhập màu hex code:
- `#1a73e8` - Xanh Google
- `#ff0000` - Đỏ
- `#9c27b0` - Tím

### Thêm logo riêng
1. Tạo logo 256x256 PNG
2. Lưu vào `custom-resources/icons/logo.png`
3. Push và chạy lại workflow

## 🧪 Test trên Windows

Sau khi tải về và giải nén:

```cmd
# Test bằng batch
test-windows.bat

# Hoặc test bằng PowerShell
powershell -ExecutionPolicy Bypass -File test-windows.ps1
```

## 📊 So sánh

| Tính năng | Chromium gốc | Custom Build |
|-----------|--------------|--------------|
| Thời gian build | 12-15 giờ | 5-10 phút |
| Chi phí Actions | ~900 phút | ~10 phút |
| UI tùy chỉnh | ❌ | ✅ (scrollbar, selection) |
| AdBlock | ❌ | ✅ (cơ bản) |
| Privacy | Cơ bản | Nâng cao |
| Isolation | ❌ | ✅ |
| Windows support | ✅ | ✅ |
| Linux support | ✅ | ✅ |
| Professional | ✅ | ✅ |
| No warnings | ✅ | ✅ |

## 💡 Tips

- Workflow chỉ mất 5-10 phút
- Có thể chạy ~200 lần/tháng (miễn phí)
- Kết quả lưu 30 ngày
- Không cần máy mạnh, GitHub Actions lo hết
- Windows: Portable, không cần cài đặt
- Linux: Chạy trực tiếp
- Không xung đột với Chrome gốc

## 🐛 Troubleshooting

Xem file `PERMISSIONS_SETUP.md` nếu gặp lỗi 403.

## 📚 Tài liệu

- `QUICK_START.md` - Hướng dẫn nhanh
- `PERMISSIONS_SETUP.md` - Cấu hình permissions
- `HOW_IT_WORKS.md` - Giải thích cách hoạt động
- `ISOLATION_EXPLAINED.md` - Tại sao cần isolation
- `custom-resources/README.md` - Tùy chỉnh resources
- `test-windows.bat` / `test-windows.ps1` - Test trên Windows

## 🚀 Cách sử dụng

### ⚡ Phương pháp 1: Patch Existing (NHANH NHẤT)

1. Vào **Actions** → **"Patch Existing Chromium"**
2. Click **"Run workflow"**
3. Chọn loại patch:
   - `remove-google-services`: Xóa Google services
   - `custom-branding`: Đổi logo, tên
   - `privacy-enhancements`: Tăng cường privacy
   - `custom-features`: Thêm extensions, bookmarks
   - `all`: Tất cả patches

**Kết quả**: File `custom-chromium-patched.tar.gz` sau 5-10 phút

### 🔨 Phương pháp 2: Rebuild Components

1. Vào **Actions** → **"Build Chromium Minimal"**
2. Nhập components cần rebuild: `chrome/browser/ui,chrome/browser/extensions`
3. Click **"Run workflow"**

**Kết quả**: File `chromium-modified.tar.gz` sau 30-60 phút

### 🏗️ Phương pháp 3: Full Build

1. Vào **Actions** → **"🚀 Build Custom Chromium"**
2. Chọn base source:
   - `ungoogled-chromium`: Base sạch nhất
   - `google-chrome`: Đầy đủ tính năng
   - `chromium-official`: Official build
3. Click **"Run workflow"**

**Kết quả**: File `custom-chromium-linux-x64.tar.gz` sau 2 giờ

## 📦 Kết quả

Sau khi tất cả workflows hoàn thành, bạn sẽ có:
- **Artifact**: `chromium-final-build` chứa file `chromium-linux-x64.tar.gz`
- **Release** (nếu push lên main): Tự động tạo release với tag `build-{số}`

## ⚙️ Tối ưu hóa

### Giảm thời gian build:
- `is_component_build=true`: Build dạng shared libraries (nhanh hơn)
- `symbol_level=0`: Không tạo debug symbols
- `--no-history`: Chỉ clone shallow, không lấy toàn bộ lịch sử
- Xóa các package không cần thiết để tăng disk space

### Giảm dung lượng:
- Chỉ package các file cần thiết để chạy Chrome
- Artifacts tự động xóa sau 1-7 ngày

## 🔧 Tùy chỉnh

Chỉnh sửa file `.github/workflows/build-chromium-part*.yml` để:
- Thay đổi target build (ví dụ: `chrome`, `content_shell`, `headless_shell`)
- Điều chỉnh build args trong phần `gn gen`
- Thêm/bớt components trong mỗi part

### Ví dụ build args khác:

```gn
# Build nhỏ gọn hơn
is_debug=false
is_component_build=true
symbol_level=0
enable_nacl=false
use_thin_lto=false
is_official_build=false

# Build tối ưu (chậm hơn nhưng nhỏ hơn)
is_debug=false
is_component_build=false
is_official_build=true
symbol_level=0
```

## ⚠️ Lưu ý

1. **Thời gian**: Mỗi part mất 3-5 giờ, tổng ~12-15 giờ
2. **Giới hạn GitHub Actions miễn phí**: 2,000 phút/tháng
   - 1 lần build đầy đủ ≈ 900-1000 phút
   - Bạn có thể build ~2 lần/tháng
3. **Disk space**: Cần ~100GB, GitHub Actions cung cấp ~14GB free
   - Đã tối ưu bằng cách xóa packages không cần thiết
   - Sử dụng shallow clone
4. **Artifacts**: Tự động xóa sau 1-7 ngày để tiết kiệm storage

## 🐛 Xử lý lỗi

### Lỗi "Out of disk space":
- Workflow đã tự động xóa các package lớn
- Nếu vẫn thiếu, giảm số lượng targets trong mỗi part

### Lỗi "Timeout":
- Giảm số lượng targets build trong mỗi part
- Chia thành nhiều parts hơn

### Lỗi "Artifact not found":
- Kiểm tra workflow trước đó có chạy thành công không
- Artifacts chỉ lưu 1 ngày, chạy lại nếu hết hạn

## 📊 Monitoring

Theo dõi tiến độ:
1. Vào tab **Actions**
2. Xem workflow đang chạy
3. Click vào workflow để xem logs chi tiết

## 🎁 Kết quả cuối cùng

File `chromium-linux-x64.tar.gz` chứa:
- `chrome`: Binary chính
- `*.pak`, `*.so`: Các thư viện và resources
- `locales/`: Ngôn ngữ
- `resources/`: Icons và assets

### Cách chạy:
```bash
tar -xzf chromium-linux-x64.tar.gz
cd Release
./chrome
```

## 💡 Tips

- Chạy vào ban đêm để tận dụng thời gian chờ
- Sử dụng branch riêng để test, tránh spam main branch
- Có thể tắt auto-trigger bằng cách xóa phần `push:` trong workflows
