# Custom Resources

Thư mục này chứa các resources tùy chỉnh sẽ được thêm vào Chromium build.

## Cấu trúc

```
custom-resources/
├── icons/              # Custom icons
├── locales/            # Custom translations
├── extensions/         # Pre-installed extensions
├── bookmarks/          # Default bookmarks
└── preferences/        # Default preferences
```

## Icons

Thêm icons tùy chỉnh:
```
icons/
├── product_logo_16.png
├── product_logo_32.png
├── product_logo_48.png
├── product_logo_64.png
├── product_logo_128.png
└── product_logo_256.png
```

## Locales

Thêm/sửa translations:
```
locales/
└── vi/
    └── messages.json
```

Ví dụ `messages.json`:
```json
{
  "appName": {
    "message": "Trình duyệt của tôi"
  },
  "appDesc": {
    "message": "Trình duyệt web nhanh và bảo mật"
  }
}
```

## Extensions

Thêm extensions mặc định:
```
extensions/
└── my-extension/
    ├── manifest.json
    ├── background.js
    ├── content.js
    └── icon.png
```

## Bookmarks

Tạo file `bookmarks/default_bookmarks.json`:
```json
{
  "roots": {
    "bookmark_bar": {
      "children": [
        {
          "name": "GitHub",
          "url": "https://github.com"
        },
        {
          "name": "Stack Overflow",
          "url": "https://stackoverflow.com"
        }
      ]
    }
  }
}
```

## Preferences

Tạo file `preferences/master_preferences`:
```json
{
  "homepage": "https://example.com",
  "homepage_is_newtabpage": false,
  "browser": {
    "show_home_button": true,
    "check_default_browser": false
  },
  "bookmark_bar": {
    "show_on_all_tabs": true
  },
  "distribution": {
    "skip_first_run_ui": true,
    "show_welcome_page": false,
    "import_bookmarks": false,
    "import_history": false,
    "import_search_engine": false,
    "suppress_first_run_bubble": true
  }
}
```

## Cách sử dụng

Resources này sẽ tự động được copy vào build khi chạy:
- `patch-existing-chromium.yml`
- `build-custom-chromium.yml`

Workflow sẽ tự động:
1. Copy icons vào thư mục resources
2. Merge locales với locales có sẵn
3. Install extensions vào Default/Extensions
4. Apply bookmarks và preferences
