# 🔐 Cấu hình Permissions cho GitHub Actions

## Vấn đề: Lỗi 403 khi tạo Release

Nếu bạn gặp lỗi:
```
⚠️ GitHub release failed with status: 403
```

## Giải pháp: Cấp quyền cho GitHub Actions

### Bước 1: Vào Settings
1. Mở repository trên GitHub
2. Click tab **Settings**
3. Scroll xuống phần **Actions** (bên trái)
4. Click **General**

### Bước 2: Cấp quyền Write
Tìm phần **Workflow permissions**:

1. Chọn: **Read and write permissions** ✅
2. Bỏ chọn: ~~Read repository contents and packages permissions~~
3. Check: **Allow GitHub Actions to create and approve pull requests** (optional)
4. Click **Save**

### Bước 3: Chạy lại workflow
1. Vào tab **Actions**
2. Chọn workflow bị lỗi
3. Click **Re-run all jobs**

## Nếu vẫn lỗi

### Kiểm tra Branch Protection
1. Settings → Branches
2. Nếu có branch protection rules cho `main`:
   - Click **Edit**
   - Scroll xuống **Restrict who can push to matching branches**
   - Thêm `github-actions[bot]` vào danh sách

### Hoặc tắt tạo Release
Nếu không cần release, có thể xóa step này trong workflows:

```yaml
# Xóa hoặc comment out phần này:
# - name: Create Release
#   uses: softprops/action-gh-release@v1
#   ...
```

## Kết quả vẫn có trong Artifacts

Dù có tạo Release hay không, file build vẫn có trong:
- Tab **Actions** → Click vào workflow run
- Scroll xuống phần **Artifacts**
- Download file `.tar.gz`

## Lưu ý

- Artifacts lưu 7-30 ngày (tùy cấu hình)
- Releases lưu vĩnh viễn
- Artifacts không tốn storage quota nếu dưới 500MB
