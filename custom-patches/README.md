# Custom Patches

Thư mục này chứa các patches tùy chỉnh cho Chromium.

## Cấu trúc

```
custom-patches/
├── branding/          # Logo, icons, tên sản phẩm
├── privacy/           # Privacy patches
├── features/          # Custom features
└── ui/               # UI modifications
```

## Cách thêm patches

### 1. Branding Patches

Tạo file `branding/product_name.txt`:
```
My Custom Browser
```

Thêm logo `branding/logo.png` (256x256)

### 2. Privacy Patches

Tạo file `privacy/disable-telemetry.patch`:
```patch
--- a/chrome/browser/metrics/metrics_service.cc
+++ b/chrome/browser/metrics/metrics_service.cc
@@ -100,7 +100,7 @@
 bool MetricsService::IsMetricsReportingEnabled() {
-  return true;
+  return false;
 }
```

### 3. Custom Features

Thêm extensions vào `features/extensions/`:
```
features/
└── extensions/
    └── my-extension/
        ├── manifest.json
        └── background.js
```

### 4. UI Modifications

Tạo file `ui/custom-theme.css`:
```css
/* Custom theme colors */
:root {
  --primary-color: #1a73e8;
  --background-color: #ffffff;
}
```

## Áp dụng patches

Patches sẽ tự động được áp dụng khi chạy workflow:
- `patch-existing-chromium.yml`
- `build-custom-chromium.yml`

## Ví dụ patches phổ biến

### Disable Google API Keys
```bash
# Trong workflow sẽ tự động set:
export GOOGLE_API_KEY=""
export GOOGLE_DEFAULT_CLIENT_ID=""
export GOOGLE_DEFAULT_CLIENT_SECRET=""
```

### Custom User Agent
```patch
--- a/content/common/user_agent.cc
+++ b/content/common/user_agent.cc
@@ -50,7 +50,7 @@
-  return "Chrome/" + version;
+  return "MyBrowser/" + version;
```

### Disable Auto-Update
```patch
--- a/chrome/browser/update_client/chrome_update_query_params_delegate.cc
+++ b/chrome/browser/update_client/chrome_update_query_params_delegate.cc
@@ -20,7 +20,7 @@
-  return true;
+  return false;
```
