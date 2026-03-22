# Hướng Dẫn Build SiliciumBrowser

## Các Lỗi Đã Sửa ✓

1. **Lỗi YAML syntax** - Đã sửa dòng 272 trong workflow Linux
2. **Lỗi "Cannot find path"** - Đã thêm kiểm tra thư mục trước khi đóng gói cache
3. **Build bị kẹt** - Đã thêm giám sát timeout tự động

## Cách Sử Dụng

### Bước 1: Push Code Lên GitHub
```bash
git add .
git commit -m "Fix workflow YAML syntax and error handling"
git push
```

### Bước 2: Chọn Cách Build

#### Cách A: Tiếp Tục Build Cũ (KHUYẾN NGHỊ)
Nếu bạn có build trước đó bị timeout (ví dụ run #5):

1. Vào GitHub → Actions
2. Chọn "Resume Build (Windows)"
3. Click "Run workflow"
4. Nhập số run trước: `5`
5. Chọn build type: `release`
6. Click "Run workflow"

**Thời gian:** 1-2 giờ (chỉ build phần còn lại)

#### Cách B: Build Mới Hoàn Toàn
1. Vào GitHub → Actions
2. Chọn "Build SiliciumBrowser (Windows)"
3. Click "Run workflow"
4. Chọn build type: `release`
5. Click "Run workflow"

**Thời gian:** 5-6 giờ (có thể timeout)

#### Cách C: Build Trên Laptop (NHANH NHẤT)
Sau khi có build cache từ GitHub:

1. Tải file `build-cache-windows-{số_run}.zip` từ Artifacts
2. Giải nén vào `chromium/src/out/Release/`
3. Áp dụng patches của bạn
4. Chạy: `ninja -C out\Release chrome`

**Thời gian:** 10-30 phút (chỉ build file thay đổi)

## Hệ Thống Cache

### Cache Tự Động (GitHub Actions)
- Source code Chromium
- Build artifacts (.lib, .obj)
- Tự động lưu giữa các lần build

### Cache Tải Về (Artifacts)
- File ZIP chứa .lib và .obj files
- Dùng để build nhanh trên laptop
- Lưu 30 ngày

## Xem Kết Quả Build

### Kiểm Tra Tiến Độ
1. Vào GitHub → Actions
2. Click vào workflow đang chạy
3. Xem log real-time

### Tải Browser Đã Build
Nếu build thành công:
1. Vào Actions → Workflow đã hoàn thành
2. Scroll xuống "Artifacts"
3. Tải `silicium-browser-windows-release`
4. Giải nén và chạy `silicium-browser.exe`

### Tải Build Cache
Để build nhanh trên laptop:
1. Vào Actions → Workflow (thành công hoặc timeout)
2. Scroll xuống "Artifacts"
3. Tải `build-cache-windows-{số_run}`
4. Xem hướng dẫn trong `LOCAL_BUILD_GUIDE.md`

## Xử Lý Sự Cố

### Build Bị Kẹt
- Workflow tự động phát hiện sau 5 phút không có tiến triển
- Tự động kill và retry với ít jobs hơn
- Nếu vẫn kẹt, dùng "Resume Build" để tiếp tục

### Build Hết Thời Gian (Timeout)
- GitHub Actions giới hạn 6 giờ
- Dùng "Resume Build" để tiếp tục từ cache
- Hoặc tải cache về build trên laptop

### Build Hết Dung Lượng Đĩa
- Workflow tự động dọn dẹp Android SDK, .NET, temp files
- Nếu vẫn không đủ, liên hệ để tối ưu thêm

## Các File Quan Trọng

- `BUILD_STATUS.md` - Chi tiết kỹ thuật (tiếng Anh)
- `HUONG_DAN_BUILD.md` - Hướng dẫn này (tiếng Việt)
- `LOCAL_BUILD_GUIDE.md` - Hướng dẫn build trên laptop
- `.github/workflows/build-silicium-browser-windows.yml` - Workflow Windows
- `.github/workflows/resume-build-windows.yml` - Workflow tiếp tục build

## Khuyến Nghị

**Nếu bạn có build trước bị timeout:**
→ Dùng "Resume Build (Windows)" với số run trước đó

**Nếu bạn muốn test nhanh:**
→ Tải build cache về và build trên laptop

**Nếu bạn muốn build hoàn chỉnh:**
→ Chạy "Build SiliciumBrowser (Windows)" và đợi 5-6 giờ
