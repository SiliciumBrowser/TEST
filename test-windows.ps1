# Test script for Windows build
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Custom Chromium on Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if chromium folder exists
if (-not (Test-Path "chromium")) {
    Write-Host "[ERROR] chromium folder not found!" -ForegroundColor Red
    Write-Host "Please extract custom-chromium-windows.zip first." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Checking files..." -ForegroundColor Yellow

# Check chrome.exe
if (Test-Path "chromium\chrome.exe") {
    Write-Host "[OK] chrome.exe found" -ForegroundColor Green
    $version = (Get-Item "chromium\chrome.exe").VersionInfo.FileVersion
    Write-Host "    Version: $version" -ForegroundColor Gray
} else {
    Write-Host "[ERROR] chrome.exe not found!" -ForegroundColor Red
}

# Check launchers
if (Test-Path "chromium\launch.bat") {
    Write-Host "[OK] launch.bat found" -ForegroundColor Green
} else {
    Write-Host "[ERROR] launch.bat not found!" -ForegroundColor Red
}

if (Test-Path "chromium\launch.ps1") {
    Write-Host "[OK] launch.ps1 found" -ForegroundColor Green
} else {
    Write-Host "[ERROR] launch.ps1 not found!" -ForegroundColor Red
}

# Check customizations
if (Test-Path "chromium\Default\Preferences") {
    Write-Host "[OK] Privacy preferences found" -ForegroundColor Green
} else {
    Write-Host "[WARN] Privacy preferences not found" -ForegroundColor Yellow
}

if (Test-Path "chromium\Default\Extensions") {
    Write-Host "[OK] Extensions folder found" -ForegroundColor Green
    $extCount = (Get-ChildItem "chromium\Default\Extensions" -Directory).Count
    Write-Host "    Extensions: $extCount" -ForegroundColor Gray
} else {
    Write-Host "[WARN] Extensions folder not found" -ForegroundColor Yellow
}

if (Test-Path "chromium\resources\custom\theme.css") {
    Write-Host "[OK] Custom theme found" -ForegroundColor Green
} else {
    Write-Host "[WARN] Custom theme not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the browser:" -ForegroundColor Yellow
Write-Host "  1. Double-click: chromium\launch.bat" -ForegroundColor White
Write-Host "  2. Or run: .\chromium\launch.ps1" -ForegroundColor White
Write-Host "  3. Create shortcut: .\chromium\create-shortcut.ps1" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
