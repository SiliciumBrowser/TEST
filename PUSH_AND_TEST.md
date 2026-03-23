# Push and Test Guide

## ⚠️ QUAN TRỌNG

Bạn đang thấy lỗi vì **chưa push code mới lên GitHub**!

Workflow đang chạy vẫn là code CŨ, chưa có fix mới.

## Bước 1: Push Code Mới

```bash
# Kiểm tra files đã thay đổi
git status

# Add tất cả
git add .

# Commit
git commit -m "Fix Resume Build - use dawidd6/action-download-artifact and add debug logging"

# Push lên GitHub
git push
```

## Bước 2: Đợi Push Hoàn Thành

- Đợi `git push` hoàn thành
- Refresh GitHub repository
- Verify code mới đã lên

## Bước 3: Chạy Resume Build

### 3.1. Vào GitHub Actions
```
https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

### 3.2. Chọn Workflow
- Click "Resume Build (Windows)" (bên trái)
- Click "Run workflow" (bên phải)

### 3.3. Điền Thông Tin
```
previous_run_number: 9
build_type: release
```

### 3.4. Run Workflow
- Click "Run workflow"
- Đợi workflow bắt đầu

## Bước 4: Theo Dõi Log

### Các Bước Quan Trọng

**1. Download previous build cache**
```
✅ Phải thấy: "Download artifact 'build-cache-windows-9'"
✅ Phải thấy: "Artifact downloaded successfully"
```

**2. List downloaded files**
```
✅ Phải thấy: "build-cache-windows.zip - XX MB"
```

**3. Check cache download**
```
✅ Phải thấy: "Cache downloaded successfully: 21.6 MB"
```

**4. Extract build cache**
```
✅ Phải thấy: "Extracted XXXX files from cache"
```

## Nếu Vẫn Lỗi

### Lỗi: "Cache not found"

**Kiểm tra:**
1. Run number có đúng không? (phải là 9)
2. Artifact có tồn tại không?
   - Vào: https://github.com/YOUR_USERNAME/YOUR_REPO/actions/runs/XXXXX
   - Scroll xuống "Artifacts"
   - Tìm: `build-cache-windows-9`

**Nếu không có artifact:**
- Chạy "Build SiliciumBrowser (Windows)" trước
- Đợi ít nhất 2-3 giờ để tạo cache
- Sau đó mới dùng Resume Build

### Lỗi: "Artifact download failed"

**Nguyên nhân:**
- Artifact đã bị xóa (sau 30 ngày)
- Run number sai
- Không có quyền truy cập

**Giải pháp:**
- Kiểm tra lại run number
- Chạy Full Build để tạo cache mới

## Debug Checklist

- [ ] Đã push code mới lên GitHub
- [ ] Code mới đã xuất hiện trên GitHub
- [ ] Đã refresh trang Actions
- [ ] Đã chọn đúng workflow "Resume Build (Windows)"
- [ ] Đã nhập đúng run number (9)
- [ ] Artifact `build-cache-windows-9` tồn tại

## Expected Timeline

```
Push code: 1-2 phút
↓
Chạy Resume Build: Click button
↓
Download cache: 1-2 phút
↓
Extract cache: 1-2 phút
↓
Resume build: 1-2 giờ
↓
Package browser: 5-10 phút
↓
Upload artifacts: 5-10 phút
↓
HOÀN THÀNH! 🎉
```

## Verification

Sau khi push, verify bằng cách:

1. **Check file trên GitHub:**
   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO/blob/main/.github/workflows/resume-build-windows.yml
   ```
   
   Phải thấy:
   ```yaml
   - uses: dawidd6/action-download-artifact@v3
   ```

2. **Check commit history:**
   - Phải có commit mới với message về fix artifact download

3. **Run workflow:**
   - Workflow mới sẽ dùng code mới
   - Log sẽ khác với lần chạy trước

## Quick Commands

```bash
# Push everything
git add . && git commit -m "Fix Resume Build" && git push

# Open GitHub Actions
start https://github.com/YOUR_USERNAME/YOUR_REPO/actions

# Wait for push to complete, then run Resume Build!
```

---

**TL;DR:** Push code → Đợi 1 phút → Chạy Resume Build → Success! 🚀
