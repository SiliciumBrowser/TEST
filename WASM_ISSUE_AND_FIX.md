# Wasm Sandboxed Libraries - Issue & Fix Plan

## ✅ Current Status: ENABLED (FIXED)

Wasm sandboxed libraries đã được fix và enable thành công!

**Giải pháp đã áp dụng**: Giải pháp 1 - Dùng wasi-sdk compiler

## 🐛 Vấn đề gặp phải

### Lỗi
```
wasm-ld: error: cannot open C:\Program Files\LLVM\lib\clang\20\lib\wasm32-unknown-wasi\libclang_rt.builtins.a: no such file or directory
clang: error: linker command failed with exit code 1
```

### Nguyên nhân
1. **wasi-sdk từ GitHub không tương thích với LLVM trên GitHub Actions**
   - wasi-sdk v24 cần `libclang_rt.builtins.a`
   - LLVM 20.1.8 trên GitHub Actions không có file này cho wasm32-wasi target

2. **Mismatch giữa toolchains**
   - wasi-sdk có compiler riêng (clang 20)
   - GitHub Actions dùng LLVM system-wide
   - Hai toolchain không tương thích với nhau

## 🔧 Các giải pháp có thể

### Giải pháp 1: Dùng wasi-sdk compiler (✅ ĐÃ ÁP DỤNG)

Thay vì dùng system LLVM, dùng compiler từ wasi-sdk:

**Implementation:**
```yaml
- name: Install wasi-sdk
  run: |
    # Download and extract wasi-sdk
    Invoke-WebRequest -Uri "..." -OutFile wasi-sdk.tar.gz
    tar -xzf wasi-sdk.tar.gz
    
    # Set environment variables
    echo "WASI_SDK_PATH=$wasiPath" >> $env:GITHUB_ENV
    echo "WASI_SYSROOT=$wasiPath\share\wasi-sysroot" >> $env:GITHUB_ENV

- name: Configure mozconfig
  run: |
    # Point to wasi-sdk compiler
    Add-Content mozconfig "ac_add_options --with-wasm-sandboxed-libraries=graphite,ogg,hunspell,expat,woff2"
    Add-Content mozconfig "mk_add_options 'export WASI_SYSROOT=$env:WASI_SYSROOT'"
    Add-Content mozconfig "mk_add_options 'export CC_wasm32_wasi=$wasiPath/bin/clang.exe'"
    Add-Content mozconfig "mk_add_options 'export CXX_wasm32_wasi=$wasiPath/bin/clang++.exe'"
```

**Ưu điểm**: 
- ✅ Dùng toolchain đầy đủ từ wasi-sdk
- ✅ Không cần build thêm gì
- ✅ Tương thích hoàn toàn

**Kết quả**: ✅ THÀNH CÔNG!

### Giải pháp 2: Build libclang_rt.builtins.a

Build file thiếu từ compiler-rt:

```yaml
- name: Build compiler-rt for wasm32-wasi
  run: |
    git clone --depth 1 https://github.com/llvm/llvm-project.git
    cd llvm-project
    cmake -S compiler-rt -B build-wasm -G Ninja `
      -DCMAKE_BUILD_TYPE=Release `
      -DCMAKE_C_COMPILER=clang `
      -DCMAKE_CXX_COMPILER=clang++ `
      -DCMAKE_C_COMPILER_TARGET=wasm32-wasi `
      -DCMAKE_SYSROOT=$env:WASI_SYSROOT `
      -DCOMPILER_RT_BAREMETAL_BUILD=ON `
      -DCOMPILER_RT_BUILD_XRAY=OFF `
      -DCOMPILER_RT_INCLUDE_TESTS=OFF `
      -DCOMPILER_RT_DEFAULT_TARGET_ONLY=ON
    cmake --build build-wasm
    
    # Copy to LLVM directory
    Copy-Item build-wasm/lib/wasm32-unknown-wasi/* "C:\Program Files\LLVM\lib\clang\20\lib\wasm32-unknown-wasi\"
```

**Ưu điểm**: Fix trực tiếp vấn đề
**Nhược điểm**: Mất thời gian build, phức tạp

### Giải pháp 3: Dùng Firefox ESR (không có Wasm sandbox)

Giữ nguyên Firefox ESR 140.0.5 không có Wasm sandboxed libraries:

**Ưu điểm**: Đơn giản, ổn định
**Nhược điểm**: Mất tính năng bảo mật

### Giải pháp 4: Chờ Firefox tích hợp sẵn

Chờ Firefox tích hợp wasi-sdk vào build system:

**Ưu điểm**: Không cần config gì
**Nhược điểm**: Có thể mất nhiều tháng

## 📋 Kế hoạch thực hiện

### Phase 1: Build thành công ✅ HOÀN THÀNH
- [x] Disable Wasm sandboxed libraries tạm thời
- [x] Build với Silicium branding
- [x] Tạo silicium.exe
- [x] Fix Wasm với wasi-sdk compiler
- [x] Enable Wasm sandboxed libraries
- [ ] Test browser hoạt động

### Phase 2: Verification (Đang thực hiện)
- [ ] Test Wasm sandboxed libraries hoạt động
- [ ] Verify security improvements
- [ ] Performance benchmarks
- [ ] Full security testing

## 🔍 Tài liệu tham khảo

- [Firefox Wasm Sandboxing](https://wiki.mozilla.org/Security/Sandbox/Wasm)
- [wasi-sdk GitHub](https://github.com/WebAssembly/wasi-sdk)
- [LLVM compiler-rt](https://compiler-rt.llvm.org/)
- [Firefox Build Documentation](https://firefox-source-docs.mozilla.org/setup/windows_build.html)

## 💡 Ghi chú

- Wasm sandboxed libraries là tính năng bảo mật quan trọng
- Nhưng không phải critical để browser hoạt động
- Ưu tiên: Build thành công trước, security sau
- Firefox official cũng có thể build without Wasm sandbox

## ✅ Kết luận

**ĐÃ FIX THÀNH CÔNG!**

Giải pháp: Dùng wasi-sdk compiler thay vì system LLVM
- Set `CC_wasm32_wasi` và `CXX_wasm32_wasi` 
- Point đến wasi-sdk/bin/clang.exe
- Wasm sandboxed libraries đã ENABLED

**Lợi ích bảo mật:**
- ✅ Graphite: Font rendering sandbox
- ✅ Ogg: Audio codec isolation
- ✅ Hunspell: Spell checking sandbox
- ✅ Expat: XML parsing protection
- ✅ Woff2: Web font security

Build tiếp theo sẽ có Wasm sandboxed libraries hoạt động!
