# Silicium Browser - Branding Guide 🔥

## Tổng quan

Hướng dẫn chi tiết để đổi tên và icon Firefox thành **Silicium** với logo lửa màu tím.

---

## 1. Cấu trúc Branding trong Firefox

Firefox có 3 loại branding:

```
browser/branding/
├── official/          # Firefox chính thức (logo Firefox)
├── unofficial/        # Firefox không chính thức (logo Nightly)
└── silicium/         # ← Chúng ta sẽ tạo folder này
```

---

## 2. Tạo Custom Branding

### Bước 1: Tạo folder branding mới

Trong Firefox source code, tạo folder:
```
firefox/browser/branding/silicium/
```

### Bước 2: Các file cần tạo

```
silicium/
├── branding.nsi           # Windows installer branding
├── configure.sh           # Build configuration
├── locales/
│   └── en-US/
│       └── brand.dtd      # Tên browser
│       └── brand.properties
├── content/
│   └── about.png          # Logo trong About dialog
├── default16.png          # Icon 16x16
├── default32.png          # Icon 32x32
├── default48.png          # Icon 48x48
├── default64.png          # Icon 64x64
├── default128.png         # Icon 128x128
├── default256.png         # Icon 256x256
├── firefox.ico            # Windows icon (chứa tất cả sizes)
├── document.ico           # Document icon
└── VisualElements/        # Windows 10/11 tiles
    ├── VisualElements_150.png
    ├── VisualElements_70.png
    └── appname.manifest
```

---

## 3. Thông số kỹ thuật Logo

### 3.1 Kích thước cần thiết

| File | Kích thước | Định dạng | Mục đích |
|------|-----------|-----------|----------|
| `default16.png` | 16x16 | PNG | Favicon, taskbar nhỏ |
| `default32.png` | 32x32 | PNG | Taskbar, window title |
| `default48.png` | 48x48 | PNG | Desktop shortcut |
| `default64.png` | 64x64 | PNG | Large icons |
| `default128.png` | 128x128 | PNG | High DPI displays |
| `default256.png` | 256x256 | PNG | Extra high DPI |
| `firefox.ico` | Multi-size | ICO | Windows executable icon |
| `about.png` | 256x256 | PNG | About dialog |

### 3.2 Yêu cầu thiết kế

**Màu sắc:**
- Lửa màu tím: Gradient từ `#8B5CF6` (tím) → `#EC4899` (hồng tím)
- Background: Trong suốt (transparent) hoặc tối
- Viền: Có thể có viền tròn màu tím nhạt

**Hình dạng:**
- Logo lửa stylized (giống Firefox nhưng màu tím)
- Nền tròn hoặc vuông bo góc
- Phong cách: Modern, minimalist

**Độ phân giải:**
- Tất cả PNG phải có alpha channel (transparent background)
- ICO file phải chứa nhiều sizes: 16, 32, 48, 64, 128, 256

---

## 4. Nội dung các file cấu hình

### 4.1 `configure.sh`

```bash
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

MOZ_APP_BASENAME=Silicium
MOZ_APP_VENDOR=SiliciumBrowser
MOZ_APP_DISPLAYNAME=Silicium
MOZ_APP_NAME=silicium

# Branding
MOZ_BRANDING_DIRECTORY=browser/branding/silicium
MOZ_OFFICIAL_BRANDING_DIRECTORY=browser/branding/silicium

# Update
MOZ_UPDATER=0
MOZ_UPDATE_CHANNEL=release

# Distribution
MOZ_DISTRIBUTION_ID=org.siliciumbrowser
```

### 4.2 `locales/en-US/brand.dtd`

```xml
<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<!ENTITY  brandShortName        "Silicium">
<!ENTITY  brandShorterName      "Silicium">
<!ENTITY  brandFullName         "Silicium Browser">
<!ENTITY  vendorShortName       "SiliciumBrowser">
<!ENTITY  trademarkInfo.part1   " ">
```

### 4.3 `locales/en-US/brand.properties`

```properties
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

brandShortName=Silicium
brandShorterName=Silicium
brandFullName=Silicium Browser
vendorShortName=SiliciumBrowser

homePageSingleStartMain=Silicium Home
homePageImport=Import your homepage from %S

homePageMigrationPageTitle=Home Page Selection
homePageMigrationDescription=Please select the home page you wish to use:

```

### 4.4 `branding.nsi` (Windows Installer)

```nsi
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# NSIS branding defines for Silicium

# BrandFullNameInternal is used for some registry and file system values
# instead of BrandFullName and typically should not be modified.
!define BrandFullNameInternal "Silicium Browser"
!define CompanyName           "SiliciumBrowser"
!define URLInfoAbout          "https://github.com/SiliciumBrowser"
!define URLUpdateInfo         "https://github.com/SiliciumBrowser/releases"
!define HelpLink              "https://github.com/SiliciumBrowser/wiki"

!define URLStubDownloadX86 "https://github.com/SiliciumBrowser/releases"
!define URLStubDownloadAMD64 "https://github.com/SiliciumBrowser/releases"
!define URLStubDownloadAArch64 "https://github.com/SiliciumBrowser/releases"
!define URLManualDownload "https://github.com/SiliciumBrowser/releases"
!define URLSystemRequirements "https://github.com/SiliciumBrowser/wiki/requirements"
!define Channel "release"

# The installer's certificate name and issuer expected by the stub installer
!define CertNameDownload   "SiliciumBrowser"
!define CertIssuerDownload "SiliciumBrowser"

# Dialog units are used so the UI displays correctly with the system's DPI
# settings. These are tweaked for the Silicium branding.
!define PROFILE_CLEANUP_LABEL_TOP "35u"
!define PROFILE_CLEANUP_LABEL_LEFT "0"
!define PROFILE_CLEANUP_LABEL_WIDTH "100%"
!define PROFILE_CLEANUP_LABEL_HEIGHT "80u"

!define PROFILE_CLEANUP_CHECKBOX_LEFT "0"
!define PROFILE_CLEANUP_CHECKBOX_WIDTH "100%"
!define PROFILE_CLEANUP_BUTTON_LEFT "0"
```

---

## 5. Cập nhật mozconfig

Thêm vào `mozconfig`:

```bash
# Custom Silicium branding
ac_add_options --with-branding=browser/branding/silicium
ac_add_options --enable-official-branding

# App name
ac_add_options --with-app-name=silicium
```

---

## 6. Hướng dẫn tạo logo

### Option 1: Tự thiết kế

**Tools cần:**
- Adobe Illustrator / Inkscape (vector)
- Photoshop / GIMP (raster)
- IcoFX / GIMP (tạo .ico)

**Quy trình:**
1. Thiết kế logo vector ở size lớn (1024x1024)
2. Export ra PNG với các sizes: 16, 32, 48, 64, 128, 256
3. Tạo file .ico từ các PNG sizes
4. Đảm bảo background transparent

### Option 2: Sử dụng AI

Prompt cho AI (DALL-E, Midjourney):
```
A modern minimalist browser logo featuring a stylized purple flame, 
gradient from violet (#8B5CF6) to pink-purple (#EC4899), 
on transparent background, circular design, clean lines, 
tech startup aesthetic, flat design
```

### Option 3: Modify Firefox logo

1. Lấy Firefox logo gốc
2. Đổi màu cam → tím gradient
3. Giữ nguyên hình dạng lửa
4. Export các sizes cần thiết

---

## 7. Tạo .ico file từ PNG

### Sử dụng ImageMagick:

```bash
# Cài ImageMagick
# Windows: choco install imagemagick
# Linux: sudo apt install imagemagick

# Tạo .ico từ nhiều PNG
convert default16.png default32.png default48.png default64.png \
        default128.png default256.png firefox.ico
```

### Sử dụng GIMP:

1. Mở GIMP
2. File → Open as Layers → Chọn tất cả PNG files
3. File → Export As → Chọn `.ico`
4. Chọn "Compressed (PNG)" trong options

---

## 8. Cấu trúc thư mục hoàn chỉnh

```
firefox/browser/branding/silicium/
│
├── configure.sh                    # Build config
├── branding.nsi                    # Windows installer
├── license.txt                     # License
│
├── locales/
│   ├── en-US/
│   │   ├── brand.dtd
│   │   └── brand.properties
│   └── vi/                         # Vietnamese (optional)
│       ├── brand.dtd
│       └── brand.properties
│
├── content/
│   ├── about.png                   # 256x256
│   ├── about-logo.png              # 256x256
│   ├── about-logo@2x.png           # 512x512
│   └── identity-icons-brand.svg    # SVG logo
│
├── default16.png
├── default32.png
├── default48.png
├── default64.png
├── default128.png
├── default256.png
│
├── firefox.ico                     # Multi-size Windows icon
├── document.ico                    # Document icon
├── pbmode.ico                      # Private browsing icon
│
└── VisualElements/
    ├── VisualElements_150.png      # 150x150 (Windows tile)
    ├── VisualElements_70.png       # 70x70 (Windows tile)
    └── appname.manifest
```

---

## 9. Build với custom branding

### Cập nhật workflow:

```yaml
- name: Create mozconfig
  shell: powershell
  run: |
    $config = @"
    # Silicium custom branding
    ac_add_options --with-branding=browser/branding/silicium
    ac_add_options --enable-official-branding
    ac_add_options --with-app-name=silicium
    
    # Build options
    ac_add_options --enable-application=browser
    ac_add_options --enable-optimize
    ac_add_options --disable-debug
    ac_add_options --disable-tests
    
    mk_add_options MOZ_OBJDIR=@TOPSRCDIR@/obj-silicium
    "@
    
    Set-Content -Path "firefox\mozconfig" -Value $config
```

---

## 10. Checklist

Trước khi build, đảm bảo:

- [ ] Tạo folder `firefox/browser/branding/silicium/`
- [ ] Tạo file `configure.sh`
- [ ] Tạo file `branding.nsi`
- [ ] Tạo folder `locales/en-US/`
- [ ] Tạo file `brand.dtd` và `brand.properties`
- [ ] Tạo folder `content/`
- [ ] Tạo tất cả PNG icons (16, 32, 48, 64, 128, 256)
- [ ] Tạo file `firefox.ico`
- [ ] Tạo file `about.png`
- [ ] Cập nhật `mozconfig` với branding path
- [ ] Test build locally (nếu có thể)

---

## 11. Kết quả mong đợi

Sau khi build thành công:

- Tên browser: **Silicium** (thay vì Firefox)
- Icon: Lửa màu tím (thay vì cam)
- About dialog: Logo Silicium
- Taskbar: Icon tím
- Desktop shortcut: Icon tím
- Window title: "Silicium Browser"

---

## 12. Tham khảo

- Firefox branding: `firefox/browser/branding/official/`
- LibreWolf branding: https://codeberg.org/librewolf/browser
- Floorp branding: https://github.com/Floorp-Projects/Floorp
- Icon specs: https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Build_Instructions/Branding

---

## Next Steps

1. **Thiết kế logo** - Tạo logo lửa tím với các sizes cần thiết
2. **Tạo branding folder** - Copy structure vào Firefox source
3. **Cập nhật workflow** - Thêm step copy branding files
4. **Build & test** - Chạy build và kiểm tra kết quả

---

**Bạn muốn tôi giúp gì tiếp theo?**

- Tạo template logo với specs chi tiết?
- Tạo script tự động copy branding files?
- Cập nhật workflow để include branding?
