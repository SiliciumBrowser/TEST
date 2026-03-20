# Build Chromium với GitHub Actions (Miễn phí)

Hệ thống này chia nhỏ quá trình build Chromium thành 3 phần để vượt qua giới hạn 6 giờ của GitHub Actions miễn phí.

## 🎯 Chiến lược

1. **Part 1**: Build các thành phần cơ bản (base, crypto, net, url, sql)
2. **Part 2**: Build content layer và Blink engine
3. **Part 3**: Build Chrome browser hoàn chỉnh
4. **Assemble**: Tổng hợp tất cả thành phẩm cuối cùng

## 🚀 Cách sử dụng

### Tự động (Khuyến nghị)
Push code lên branch `main` - workflow sẽ tự động chạy tuần tự:
```bash
git add .
git commit -m "Start Chromium build"
git push origin main
```

### Thủ công
1. Vào tab **Actions** trên GitHub
2. Chọn workflow **"Build Chromium - Part 1"**
3. Click **"Run workflow"**
4. Các workflow tiếp theo sẽ tự động chạy khi workflow trước hoàn thành

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
