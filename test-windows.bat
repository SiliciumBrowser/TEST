@echo off
echo ========================================
echo Testing Custom Chromium on Windows
echo ========================================
echo.

REM Check if chromium folder exists
if not exist "chromium" (
    echo Error: chromium folder not found!
    echo Please extract custom-chromium-windows.zip first.
    pause
    exit /b 1
)

echo Checking files...
if exist "chromium\chrome.exe" (
    echo [OK] chrome.exe found
) else (
    echo [ERROR] chrome.exe not found!
)

if exist "chromium\launch.bat" (
    echo [OK] launch.bat found
) else (
    echo [ERROR] launch.bat not found!
)

if exist "chromium\Default\Preferences" (
    echo [OK] Privacy preferences found
) else (
    echo [WARN] Privacy preferences not found
)

if exist "chromium\Default\Extensions" (
    echo [OK] Extensions folder found
) else (
    echo [WARN] Extensions folder not found
)

echo.
echo ========================================
echo Test completed!
echo ========================================
echo.
echo To run the browser:
echo   1. Double-click: chromium\launch.bat
echo   2. Or run: chromium\launch.ps1
echo.
pause
