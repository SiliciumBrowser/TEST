# Build Chromium với GitHub Actions (Miễn phí)

## 🚀 3 Phương pháp Build (Từ nhanh đến chậm)

### ⚡ Phương pháp 1: Patch Existing Build (KHUYẾN NGHỊ - 5-10 phút)
Tải Ungoogled Chromium/Chrome đã build sẵn, chỉ patch/modify theo nhu cầu.
- ⏱️ Thời gian: 5-10 phút
- 💰 Chi phí: ~10 phút GitHub Actions
- ✅ Phù hợp: Thay đổi nhỏ, custom branding, remove features

### 🔨 Phương pháp 2: Rebuild Minimal Components (30-60 phút)
Tải base đã build, chỉ rebuild những phần bạn sửa.
- ⏱️ Thời gian: 30-60 phút
- 💰 Chi phí: ~60 phút GitHub Actions
- ✅ Phù hợp: Sửa UI, thêm features nhỏ

### 🏗️ Phương pháp 3: Full Build từ Source (12-15 giờ)
Build toàn bộ từ đầu, chia thành 3 parts.
- ⏱️ Thời gian: 12-15 giờ
- 💰 Chi phí: ~900 phút GitHub Actions
- ✅ Phù hợp: Thay đổi lớn, custom engine

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
