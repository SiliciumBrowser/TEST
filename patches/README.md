# Custom Patches

Thư mục này chứa các patches để customize Chromium ở code level.

## Cấu trúc

```
patches/
├── v8/          # Patches cho V8 JavaScript engine
├── blink/       # Patches cho Blink rendering engine
├── content/     # Patches cho Content layer
└── chrome/      # Patches cho Chrome UI
```

## Cách tạo patch

### 1. Clone source code
```bash
mkdir chromium
cd chromium
fetch chromium
cd src
```

### 2. Tạo branch mới
```bash
git checkout -b my-custom-feature
```

### 3. Sửa code
Sửa file theo ý muốn, ví dụ:
- `v8/src/` - V8 engine code
- `third_party/blink/` - Blink engine code
- `content/` - Content layer code
- `chrome/browser/ui/` - Chrome UI code

### 4. Tạo patch file
```bash
git add .
git diff HEAD > ../../../patches/chrome/my-feature.patch
```

## Ví dụ patches

### V8 - Custom JavaScript API
File: `patches/v8/custom-api.patch`
```patch
diff --git a/src/api/api.cc b/src/api/api.cc
index 1234567..abcdefg 100644
--- a/src/api/api.cc
+++ b/src/api/api.cc
@@ -100,6 +100,10 @@
+// Custom API
+void CustomFunction() {
+  // Your code here
+}
```

### Blink - Custom CSS Property
File: `patches/blink/custom-css.patch`
```patch
diff --git a/renderer/core/css/css_properties.json5 b/renderer/core/css/css_properties.json5
index 1234567..abcdefg 100644
--- a/renderer/core/css/css_properties.json5
+++ b/renderer/core/css/css_properties.json5
@@ -100,6 +100,12 @@
+{
+  name: "custom-property",
+  inherited: false,
+  initial: "auto"
+},
```

### Chrome - Custom UI
File: `patches/chrome/custom-ui.patch`
```patch
diff --git a/browser/ui/views/toolbar/toolbar_view.cc b/browser/ui/views/toolbar/toolbar_view.cc
index 1234567..abcdefg 100644
--- a/browser/ui/views/toolbar/toolbar_view.cc
+++ b/browser/ui/views/toolbar/toolbar_view.cc
@@ -100,6 +100,8 @@
+// Custom toolbar button
+AddCustomButton();
```

## Apply patches

Patches sẽ tự động được apply trong workflows:
- `build-v8.yml` - Apply patches/v8/*.patch
- `build-blink.yml` - Apply patches/blink/*.patch
- `build-content.yml` - Apply patches/content/*.patch
- `build-chrome-final.yml` - Apply patches/chrome/*.patch

## Testing patches

### Local test
```bash
cd chromium/src
git apply ../../patches/chrome/my-feature.patch
ninja -C out/Release chrome
```

### GitHub Actions test
1. Commit patch vào `patches/` folder
2. Push lên GitHub
3. Workflow sẽ tự động apply và build

## Tips

### Patch nhỏ gọn
- Chỉ include những thay đổi cần thiết
- Tránh whitespace changes
- Comment rõ ràng

### Test kỹ
- Test local trước khi commit
- Đảm bảo patch apply được
- Đảm bảo build thành công

### Organize patches
- 1 patch = 1 feature
- Đặt tên rõ ràng: `feature-name.patch`
- Document trong patch header

## Common patches

### 1. Thay đổi User Agent
```patch
diff --git a/content/common/user_agent.cc b/content/common/user_agent.cc
--- a/content/common/user_agent.cc
+++ b/content/common/user_agent.cc
@@ -50,7 +50,7 @@
-  return "Chrome/" + version;
+  return "MyBrowser/" + version;
```

### 2. Disable telemetry
```patch
diff --git a/chrome/browser/metrics/metrics_service.cc b/chrome/browser/metrics/metrics_service.cc
--- a/chrome/browser/metrics/metrics_service.cc
+++ b/chrome/browser/metrics/metrics_service.cc
@@ -100,7 +100,7 @@
-  return true;
+  return false;
```

### 3. Custom homepage
```patch
diff --git a/chrome/browser/ui/startup/startup_browser_creator.cc b/chrome/browser/ui/startup/startup_browser_creator.cc
--- a/chrome/browser/ui/startup/startup_browser_creator.cc
+++ b/chrome/browser/ui/startup/startup_browser_creator.cc
@@ -200,7 +200,7 @@
-  GURL url("chrome://newtab");
+  GURL url("https://your-homepage.com");
```

## Resources

- [Chromium Code Search](https://source.chromium.org/)
- [Chromium Development](https://www.chromium.org/developers/)
- [Git Patch Tutorial](https://git-scm.com/docs/git-apply)
