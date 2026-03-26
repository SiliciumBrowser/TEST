# Silicium Browser - Custom Branding

This folder contains all branding files for Silicium Browser.

## Structure

```
branding/
├── configure.sh              # Build configuration
├── branding.nsi              # Windows installer branding
├── locales/
│   ├── en-US/               # English branding
│   │   ├── brand.dtd
│   │   └── brand.properties
│   └── vi/                  # Vietnamese branding
│       ├── brand.dtd
│       └── brand.properties
└── README.md
```

## Icons

Icons are stored in `custom-resources/icons/`:
- `default16.png` - 16x16 icon
- `default32.png` - 32x32 icon
- `default48.png` - 48x48 icon
- `default64.png` - 64x64 icon
- `default128.png` - 128x128 icon
- `default256.png` - 256x256 icon
- `firefox.ico` - Windows multi-size icon
- `about.png` - About dialog logo

## Usage

During build, these files are automatically copied to:
```
firefox/browser/branding/silicium/
```

The build system will use these files to brand the browser as "Silicium" instead of "Firefox".

## Customization

To change branding:
1. Edit `configure.sh` for app name and IDs
2. Edit `locales/*/brand.*` for display names
3. Replace icons in `../icons/` folder
4. Edit `branding.nsi` for installer text

## Build

The workflow automatically:
1. Copies branding files to Firefox source
2. Copies icons to branding folder
3. Configures build with `--with-branding=browser/branding/silicium`
4. Builds with custom branding
