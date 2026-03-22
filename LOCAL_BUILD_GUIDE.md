# Hướng dẫn Build Local với Build Cache

Sử dụng build cache từ GitHub Actions để build nhanh trên laptop của bạn.

## 🎯 Lợi ích

- **Lần đầu**: GitHub Actions build 5-6 giờ → Tạo cache
- **Lần sau**: Download cache → Build local chỉ 10-30 phút (chỉ build phần sửa đổi)
- **Tiết kiệm**: Không cần chờ GitHub Actions mỗi lần sửa code
- **Linh hoạt**: Test và debug nhanh trên máy của bạn

## 📦 Bước 1: Download Build Cache

### Từ GitHub Actions

1. Vào repository → Tab **Actions**
2. Chọn workflow run đã hoàn thành (hoặc timeout)
3. Scroll xuống **Artifacts**
4. Download:
   - **Windows**: `build-cache-windows-{run_number}.zip`
   - **Linux**: `build-cache-linux-{run_number}.tar.gz`

### Kích thước

- Build cache: ~2-5 GB (compressed)
- Chứa tất cả `.lib`, `.obj` (Windows) hoặc `.a`, `.o` (Linux)

## 🔧 Bước 2: Setup Local Build Environment

### Windows

```powershell
# 1. Clone repository
git clone https://github.com/your-username/SiliciumBrowser.git
cd SiliciumBrowser

# 2. Setup depot_tools
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
$env:PATH = "$PWD\depot_tools;$env:PATH"
$env:DEPOT_TOOLS_WIN_TOOLCHAIN = "0"

# 3. Fetch Chromium source (nếu chưa có)
mkdir chromium
cd chromium
fetch --nohooks chromium
cd src

# 4. Sync dependencies
gclient sync

# 5. Run hooks
gclient runhooks
```

### Linux

```bash
# 1. Clone repository
git clone https://github.com/your-username/SiliciumBrowser.git
cd SiliciumBrowser

# 2. Setup depot_tools
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
export PATH="$PWD/depot_tools:$PATH"

# 3. Fetch Chromium source (nếu chưa có)
mkdir chromium
cd chromium
fetch --nohooks chromium
cd src

# 4. Install dependencies
./build/install-build-deps.sh

# 5. Sync dependencies
gclient sync

# 6. Run hooks
gclient runhooks
```

## 📥 Bước 3: Extract Build Cache

### Windows

```powershell
# Từ thư mục SiliciumBrowser
cd chromium\src\out\Release

# Extract cache
Expand-Archive -Path ..\..\..\..\build-cache-windows.zip -DestinationPath . -Force

# Verify
Get-ChildItem obj -Recurse | Measure-Object | Select-Object Count
```

### Linux

```bash
# Từ thư mục SiliciumBrowser
cd chromium/src/out/Release

# Extract cache
tar -xzf ../../../../build-cache-linux.tar.gz

# Verify
find obj -type f | wc -l
```

## 🎨 Bước 4: Apply Custom Changes

```bash
# Copy custom resources
cp -r ../../../../custom-ui/new-tab chrome/browser/resources/silicium_newtab/

# Apply patches
cd chromium/src
git apply ../../patches/*.patch
git apply ../../custom-patches/*.patch
```

## 🚀 Bước 5: Build (Incremental)

### Windows

```powershell
cd chromium\src

# Build chỉ phần thay đổi (10-30 phút)
ninja -C out\Release chrome
```

### Linux

```bash
cd chromium/src

# Build chỉ phần thay đổi (10-30 phút)
ninja -C out/Release chrome
```

## ⚡ Workflow Thực Tế

### Lần đầu tiên

```
1. Trigger GitHub Actions build
2. Đợi 5-6 giờ (hoặc timeout)
3. Download build cache
4. Setup local environment
5. Extract cache
```

### Lần sau (khi sửa code)

```
1. Sửa code trong custom-ui/ hoặc patches/
2. Apply changes
3. ninja -C out/Release chrome (10-30 phút)
4. Test ngay trên máy
5. Commit và push
```

## 🔄 Update Build Cache

Khi nào cần build cache mới:

- Chromium version update
- Thay đổi GN args lớn
- Thêm/bỏ nhiều features
- Sau 1-2 tuần (để có version mới)

Chỉ cần trigger GitHub Actions build lại và download cache mới.

## 💡 Tips

### 1. Chỉ build target cần thiết

```bash
# Chỉ build chrome binary
ninja -C out/Release chrome

# Build cụ thể một component
ninja -C out/Release chrome/browser

# Build test
ninja -C out/Release chrome_test
```

### 2. Parallel build

```bash
# Windows
ninja -C out\Release chrome -j8  # 8 cores

# Linux
ninja -C out/Release chrome -j$(nproc)  # All cores
```

### 3. Clean build nếu cần

```bash
# Clean chỉ chrome target
ninja -C out/Release -t clean chrome

# Clean all
rm -rf out/Release
# Rồi extract cache lại
```

### 4. Check build status

```bash
# Xem target nào cần rebuild
ninja -C out/Release -n chrome | head -20

# Xem dependencies
ninja -C out/Release -t deps chrome | less
```

## 🐛 Troubleshooting

### Build cache không khớp

```bash
# Xóa cache cũ
rm -rf out/Release/obj

# Extract cache mới
tar -xzf build-cache-linux.tar.gz
```

### Lỗi linking

```bash
# Rebuild từ đầu
ninja -C out/Release -t clean chrome
ninja -C out/Release chrome
```

### Out of memory

```bash
# Giảm parallel jobs
ninja -C out/Release chrome -j2
```

### Disk space

```bash
# Check size
du -sh out/Release

# Clean intermediate files
find out/Release -name "*.o" -delete
find out/Release -name "*.obj" -delete
```

## 📊 So sánh Thời gian

| Scenario | GitHub Actions | Local (với cache) |
|----------|---------------|-------------------|
| Full build | 5-6 giờ | N/A |
| Incremental (sửa UI) | 5-6 giờ | 10-15 phút |
| Incremental (sửa code) | 5-6 giờ | 20-30 phút |
| Incremental (thêm feature) | 5-6 giờ | 30-60 phút |

## 🎓 Best Practices

1. **Luôn dùng cache mới nhất** từ GitHub Actions
2. **Commit thường xuyên** để không mất code
3. **Test local trước** khi push lên GitHub
4. **Backup build cache** (2-5 GB) để không phải download lại
5. **Update cache** mỗi 1-2 tuần

## 🔗 Links

- [Chromium Build Instructions](https://chromium.googlesource.com/chromium/src/+/main/docs/linux/build_instructions.md)
- [Ninja Build System](https://ninja-build.org/manual.html)
- [GN Reference](https://gn.googlesource.com/gn/+/main/docs/reference.md)
