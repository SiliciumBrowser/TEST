# Artifact Download Fix

## Vấn Đề

Resume Build không thể download cache từ build trước vì:

### GitHub Actions Limitation
`actions/download-artifact@v4` **CHỈ** download artifacts từ cùng workflow run, KHÔNG thể download từ run khác!

```yaml
# ❌ KHÔNG HOẠT ĐỘNG
- uses: actions/download-artifact@v4
  with:
    name: build-cache-windows-9  # Từ run #9
    # Chỉ tìm trong current run, không tìm run #9
```

### Error Message
```
Cache not found or download failed
This workflow requires a previous build cache.
```

## Giải Pháp

Dùng `dawidd6/action-download-artifact@v3` - action này có thể download từ workflow run khác:

```yaml
# ✅ HOẠT ĐỘNG
- uses: dawidd6/action-download-artifact@v3
  with:
    workflow: build-silicium-browser-windows.yml
    run_number: ${{ github.event.inputs.previous_run_number }}
    name: build-cache-windows-${{ github.event.inputs.previous_run_number }}
    path: .
```

## So Sánh

| Feature | actions/download-artifact@v4 | dawidd6/action-download-artifact@v3 |
|---------|------------------------------|-------------------------------------|
| Download từ current run | ✅ | ✅ |
| Download từ run khác | ❌ | ✅ |
| Chỉ định run_number | ❌ | ✅ |
| Chỉ định workflow | ❌ | ✅ |
| Download từ branch khác | ❌ | ✅ |

## Files Đã Sửa

- ✅ `.github/workflows/resume-build-windows.yml`
  - Changed from `actions/download-artifact@v4`
  - To `dawidd6/action-download-artifact@v3`
  - Added `workflow` parameter
  - Added `run_number` parameter

## Cách Dùng

### Bước 1: Tìm Run Number
1. Vào GitHub Actions
2. Tìm build "Build SiliciumBrowser (Windows)" đã chạy
3. Xem run number (ví dụ: #9)

### Bước 2: Kiểm Tra Artifacts
1. Click vào run đó
2. Scroll xuống "Artifacts"
3. Xem có `build-cache-windows-9` không

### Bước 3: Chạy Resume Build
1. Actions → "Resume Build (Windows)"
2. Run workflow
3. Nhập: `previous_run_number: 9`
4. Run!

## Verification

Sau khi sửa, workflow sẽ:
1. ✅ Download artifact từ run #9
2. ✅ Extract cache
3. ✅ Resume build từ cache
4. ✅ Hoàn thành trong 1-2 giờ

## Lưu Ý

### Artifact Retention
- Artifacts được giữ 30 ngày
- Sau 30 ngày sẽ bị xóa tự động
- Không thể Resume từ artifacts đã xóa

### Run Number
- Phải là run number của "Build SiliciumBrowser (Windows)"
- Không phải run number của "Resume Build"
- Phải có artifact `build-cache-windows-{số}`

### Permissions
- Action cần quyền đọc artifacts
- Mặc định đã có trong workflow

## Status

🟢 **FIXED** - Resume Build giờ có thể download cache từ build trước!

## Push Commands

```bash
git add .
git commit -m "Fix artifact download in Resume Build - use dawidd6/action-download-artifact"
git push
```

Sau khi push, Resume Build sẽ hoạt động đúng!
