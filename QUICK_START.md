# 🚀 Quick Start - Build Chromium Nhanh Nhất

## Phương pháp đề xuất: Patch Existing Build

### Bước 1: Push code lên GitHub
```bash
git init
git add .
git commit -m "Setup Chromium build"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Bước 2: Chạy workflow
1. Vào repository trên GitHub
2. Click tab **Actions**
3. Chọn workflow **"Patch Existing Chromium"**
4. Click **"Run workflow"**
5. Chọn patches muốn áp dụng
6. Click **"Run workflow"** (nút xanh)

### Bước 3: Tải kết quả
Sau 5-10 phút:
1. Vào tab **Actions**
2. Click vào workflow run vừa chạy
3. Scroll xuống phần **Artifacts**
4. Download file `chromium-patched-*.zip`

### Bước 4: Sử dụng
```bash
# Giải nén
unzip chromium-patched-*.zip
tar -xzf custom-chromium-patched.tar.gz

# Chạy
cd chromium
./launch.sh
```

## Tùy chỉnh nâng cao

### Thêm custom logo
1. Tạo file `custom-resources/icons/product_logo_256.png`
2. Push lên GitHub
3. Chạy lại workflow

### Thêm extensions mặc định
1. Tạo thư mục `custom-resources/extensions/my-extension/`
2. Thêm `manifest.json` và code extension
3. Push lên GitHub
4. Chạy lại workflow

### Thay đổi homepage mặc định
1. Tạo file `custom-resources/preferences/master_preferences`
2. Thêm:
```json
{
  "homepage": "https://your-homepage.com",
  "homepage_is_newtabpage": false
}
```
3. Push và chạy lại workflow

## So sánh các phương pháp

| Phương pháp | Thời gian | Chi phí Actions | Độ tùy chỉnh |
|-------------|-----------|-----------------|--------------|
| Patch Existing | 5-10 phút | ~10 phút | Thấp |
| Rebuild Minimal | 30-60 phút | ~60 phút | Trung bình |
| Full Build | 12-15 giờ | ~900 phút | Cao |

## Lưu ý

- GitHub Actions miễn phí: 2,000 phút/tháng
- Patch Existing: Có thể chạy ~200 lần/tháng
- Full Build: Chỉ chạy được ~2 lần/tháng

## Troubleshooting

### Lỗi "Artifact not found"
- Kiểm tra workflow có chạy thành công không
- Artifacts chỉ lưu 1-30 ngày

### Lỗi "Permission denied"
- Đảm bảo đã enable Actions trong Settings → Actions → General

### Build bị timeout
- Dùng Patch Existing thay vì Full Build
- Hoặc chia nhỏ components cần rebuild
