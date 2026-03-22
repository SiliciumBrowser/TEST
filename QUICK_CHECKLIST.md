# Quick Checklist - Danh Sách Kiểm Tra Nhanh

## ✅ Trước Khi Push Code

- [x] Đã sửa lỗi YAML syntax (dòng 272)
- [x] Đã sửa lỗi "Cannot find path"
- [x] Đã thêm error handling cho Resume Build
- [x] Đã tạo tài liệu hướng dẫn

## 📤 Push Code Lên GitHub

```bash
# 1. Kiểm tra files đã thay đổi
git status

# 2. Add tất cả files
git add .

# 3. Commit với message rõ ràng
git commit -m "Fix Resume Build workflow and improve error handling"

# 4. Push lên GitHub
git push
```

## 🎯 Chọn Workflow Phù Hợp

### Tình Huống 1: Chưa Có Build Nào
→ Chạy **"Build SiliciumBrowser (Windows)"**
- Thời gian: 5-6 giờ
- Có thể timeout
- Sẽ tạo cache để dùng sau

### Tình Huống 2: Có Build Trước Bị Timeout
→ Chạy **"Resume Build (Windows)"**
- Cần: Số run trước + cache artifact
- Thời gian: 1-2 giờ
- Nhanh hơn nhiều

### Tình Huống 3: Muốn Test Nhanh
→ **Build trên laptop với cache**
- Tải cache từ Artifacts
- Thời gian: 10-30 phút
- Xem `LOCAL_BUILD_GUIDE.md`

## 🔍 Kiểm Tra Cache Trước Khi Resume

```
1. Vào: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
2. Click vào build trước đó
3. Scroll xuống "Artifacts"
4. Tìm: build-cache-windows-{số_run}
   
   ✓ CÓ → Có thể dùng Resume Build
   ✗ KHÔNG → Phải chạy Full Build
```

## 🚀 Chạy Resume Build (Nếu Có Cache)

```
1. Actions → "Resume Build (Windows)"
2. Run workflow
3. Điền:
   - previous_run_number: [số run trước]
   - build_type: release
4. Run workflow
5. Đợi 1-2 giờ
```

## 📊 Theo Dõi Build

### Các Bước Quan Trọng Cần Xem

1. **Download previous build cache**
   - Phải thấy: "✓ Cache downloaded successfully: XX MB"
   - Nếu fail → Số run sai hoặc không có cache

2. **Extract build cache**
   - Phải thấy: "Extracted XXXX files from cache"
   - Nếu không → Cache rỗng hoặc lỗi

3. **Resume Build**
   - Phải thấy: "Resuming build at [time]"
   - Ninja sẽ chỉ build files thay đổi

4. **Package SiliciumBrowser**
   - Chỉ chạy nếu build thành công
   - Tạo file ZIP để tải về

## 📥 Tải Kết Quả

### Nếu Build Thành Công ✓
```
Artifacts:
├── silicium-browser-windows-resumed-{số}  ← Browser
└── build-cache-windows-{số}               ← Cache mới
```

### Nếu Build Timeout ⏱️
```
Artifacts:
└── build-cache-windows-{số}  ← Cache để Resume tiếp
```

## 🆘 Nếu Gặp Lỗi

| Lỗi | Nguyên Nhân | Giải Pháp |
|-----|-------------|-----------|
| Cannot find path | Không có cache | Kiểm tra cache, chạy Full Build |
| No files found | Artifact không tồn tại | Kiểm tra số run |
| Build timeout | Quá nhiều files | Resume lại hoặc build local |
| YAML syntax error | Lỗi cú pháp | Đã fix, push code mới |

## 📚 Tài Liệu Tham Khảo

- `NEXT_STEPS.md` - Các bước tiếp theo chi tiết
- `RESUME_BUILD_GUIDE.md` - Hướng dẫn Resume Build đầy đủ
- `HUONG_DAN_BUILD.md` - Hướng dẫn build tổng quát
- `LOCAL_BUILD_GUIDE.md` - Build trên laptop
- `BUILD_STATUS.md` - Chi tiết kỹ thuật

## ⚡ Action Ngay Bây Giờ

**Bước 1:** Push code
```bash
git add . && git commit -m "Fix workflows" && git push
```

**Bước 2:** Kiểm tra có cache không
- Vào Actions → Build trước → Artifacts

**Bước 3:** Chọn workflow
- Có cache → Resume Build
- Không cache → Full Build

**Bước 4:** Chạy và đợi!

---

**Lưu ý:** Resume Build CHỈ hoạt động khi có cache từ build trước!
