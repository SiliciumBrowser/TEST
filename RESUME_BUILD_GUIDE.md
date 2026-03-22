# Resume Build Guide - Hướng Dẫn Tiếp Tục Build

## Resume Build Là Gì?

Resume Build cho phép bạn tiếp tục build từ lần build trước bị timeout hoặc fail, thay vì phải build lại từ đầu.

## Khi Nào Dùng Resume Build?

✅ **NÊN dùng khi:**
- Build trước bị timeout sau 5-6 giờ
- Build trước chạy được ít nhất 2-3 giờ và có cache
- Bạn muốn tiết kiệm thời gian (1-2 giờ thay vì 5-6 giờ)

❌ **KHÔNG nên dùng khi:**
- Chưa có build nào trước đó
- Build trước fail ngay (< 1 giờ)
- Không có cache artifact từ build trước

## Cách Kiểm Tra Có Cache Không

### Bước 1: Tìm Run Number Trước
1. Vào GitHub → Actions
2. Tìm workflow "Build SiliciumBrowser (Windows)" đã chạy
3. Click vào workflow đó
4. Xem số run ở URL: `...actions/runs/XXXXXXX` hoặc tiêu đề

### Bước 2: Kiểm Tra Artifacts
1. Scroll xuống phần **Artifacts** của run đó
2. Tìm file: `build-cache-windows-{số_run}`
3. Nếu CÓ file này → Có thể dùng Resume Build ✓
4. Nếu KHÔNG có → Phải chạy build mới ✗

## Cách Dùng Resume Build

### Bước 1: Chuẩn Bị
- Đảm bảo đã có cache từ build trước (xem phần trên)
- Biết số run trước (ví dụ: 5)

### Bước 2: Chạy Workflow
1. Vào GitHub → Actions
2. Click **"Resume Build (Windows)"** (bên trái)
3. Click **"Run workflow"** (bên phải)
4. Điền thông tin:
   ```
   previous_run_number: 5        (số run trước của bạn)
   build_type: release           (hoặc debug)
   ```
5. Click **"Run workflow"**

### Bước 3: Theo Dõi
1. Refresh trang để thấy workflow mới
2. Click vào workflow để xem log
3. Kiểm tra các bước:
   - ✓ Download cache → Phải thành công
   - ✓ Extract cache → Phải thấy số files
   - ✓ Resume build → Chỉ build files thay đổi

## Workflow Resume Build Làm Gì?

```
1. Checkout code
2. Setup depot_tools
3. Restore Chromium source (từ cache tự động)
4. Download build cache (từ run trước)
   ↓
   Nếu KHÔNG có cache → FAIL ngay
   Nếu CÓ cache → Tiếp tục
   ↓
5. Extract cache vào out/Release/
6. Sync Chromium
7. Run gclient hooks
8. Copy custom resources
9. Apply patches
10. Configure build (tạo args.gn)
11. Resume build (ninja chỉ build files thay đổi)
12. Package browser (nếu thành công)
13. Save updated cache
```

## Lỗi Thường Gặp

### Lỗi: "Cannot find path chromium\src\out\Release"

**Nguyên nhân:**
- Cache không được tải xuống
- Hoặc cache rỗng/không đúng format

**Giải pháp:**
1. Kiểm tra log bước "Download previous build cache"
2. Xem có thông báo "✓ Cache downloaded successfully" không
3. Nếu không → Số run sai hoặc không có cache
4. Chạy "Build SiliciumBrowser (Windows)" trước

### Lỗi: "No files were found with the provided path"

**Nguyên nhân:**
- Artifact không tồn tại với số run đó

**Giải pháp:**
1. Kiểm tra lại số run
2. Vào Actions → Run đó → Xem Artifacts
3. Đảm bảo có file `build-cache-windows-{số}`

### Lỗi: Build vẫn timeout

**Nguyên nhân:**
- Cache không đủ lớn
- Quá nhiều files thay đổi

**Giải pháp:**
1. Chạy Resume Build lần nữa với run number mới
2. Hoặc tải cache về build trên laptop

## So Sánh: Full Build vs Resume Build

| Tiêu chí | Full Build | Resume Build |
|----------|-----------|--------------|
| Thời gian | 5-6 giờ | 1-2 giờ |
| Yêu cầu | Không cần gì | Cần cache từ build trước |
| Rủi ro timeout | Cao | Thấp |
| Khi nào dùng | Lần đầu, hoặc thay đổi lớn | Tiếp tục build cũ |

## Tips

1. **Luôn kiểm tra cache trước** khi chạy Resume Build
2. **Lưu số run** của build trước để dễ tìm
3. **Tải cache về laptop** nếu cần build nhanh nhiều lần
4. **Chạy Full Build trước** nếu chưa có cache nào

## Workflow Khuyến Nghị

```
Lần 1: Full Build (5-6h)
  ↓
  Timeout? → Có cache
  ↓
Lần 2: Resume Build với run #1 (1-2h)
  ↓
  Timeout? → Có cache mới
  ↓
Lần 3: Resume Build với run #2 (30m-1h)
  ↓
  Thành công! → Tải browser + cache
  ↓
Lần 4+: Build trên laptop với cache (10-30m)
```

## Câu Hỏi Thường Gặp

**Q: Resume Build có build lại toàn bộ không?**
A: Không. Ninja chỉ build files thay đổi hoặc chưa build.

**Q: Tôi có thể Resume từ build của người khác không?**
A: Có, nếu bạn có quyền download artifacts của họ.

**Q: Cache có hết hạn không?**
A: Có, sau 30 ngày. Artifacts cũng bị xóa sau 30 ngày.

**Q: Tôi nên dùng Full Build hay Resume Build?**
A: 
- Lần đầu: Full Build
- Lần sau: Resume Build (nếu có cache)
- Thay đổi nhỏ: Build trên laptop với cache

**Q: Resume Build có tạo cache mới không?**
A: Có, nó sẽ tạo cache updated để bạn có thể Resume tiếp.

---

**Tóm lại:** Resume Build giúp tiết kiệm thời gian khi build bị timeout, nhưng cần có cache từ build trước!
