# 🚀 Quick Start - Custom Chromium Builder

## Bước 1: Push code lên GitHub
```bash
git init
git add .
git commit -m "Setup custom Chromium builder"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Bước 2: Cấu hình permissions
1. Vào repository trên GitHub
2. Click **Settings** → **Actions** → **General**
3. Chọn **Read and write permissions**
4. Click **Save**

## Bước 3: Chạy workflow
1. Vào tab **Actions**
2. Chọn **"🎨 Custom Chromium Builder"**
3. Click **"Run workflow"**
4. Điền thông tin:
   - **Customizations**: `ui-theme,adblock,privacy,extensions`
   - **Theme Color**: `#1a73e8` (hoặc màu bạn thích)
   - **Browser Name**: `My Custom Browser`
5. Click **"Run workflow"** (nút xanh)

## Bước 4: Tải kết quả
Sau 5-10 phút:
1. Vào tab **Actions**
2. Click vào workflow run vừa chạy
3. Scroll xuống phần **Artifacts**
4. Download file `custom-chromium-*.zip`

## Bước 5: Sử dụng
```bash
# Giải nén
unzip custom-chromium-*.zip
tar -xzf custom-chromium.tar.gz

# Chạy
cd chromium
./launch.sh
```

## 🎨 Tùy chỉnh

### Thay đổi màu theme
Khi chạy workflow, nhập màu hex code:
- `#1a73e8` - Xanh Google
- `#ff0000` - Đỏ
- `#00ff00` - Xanh lá
- `#9c27b0` - Tím

### Thêm logo riêng
1. Tạo logo 256x256 PNG
2. Thay thế file `custom-resources/icons/logo.png`
3. Push và chạy lại workflow

### Thêm extensions riêng
1. Copy thư mục `custom-resources/extensions/example-extension/`
2. Đổi tên thành `my-extension`
3. Sửa `manifest.json` và code
4. Push và chạy lại

### Chọn customizations
Khi chạy workflow, nhập (cách nhau bởi dấu phẩy):
- `ui-theme` - Thay đổi màu giao diện
- `adblock` - Chặn quảng cáo
- `privacy` - Tăng cường privacy
- `extensions` - Cài extensions

Hoặc tất cả: `ui-theme,adblock,privacy,extensions`

## 💡 Tips

- Workflow chỉ mất 5-10 phút
- Có thể chạy ~200 lần/tháng (miễn phí)
- Kết quả lưu 30 ngày
- Không cần máy mạnh, GitHub Actions lo hết

## 🐛 Troubleshooting

### Lỗi "Permission denied"
- Kiểm tra đã cấp quyền Write chưa (Bước 2)

### Lỗi "Artifact not found"
- Đợi workflow chạy xong (5-10 phút)
- Kiểm tra workflow có lỗi không

### Build bị lỗi
- Kiểm tra logs trong Actions
- Thử chạy lại workflow

