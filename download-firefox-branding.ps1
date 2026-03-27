# Download Firefox Branding for Analysis
# This script downloads only the branding folder from Firefox source

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Firefox Branding Downloader" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win"
    exit 1
}

# Create temp directory
$tempDir = "firefox-branding-temp"
if (Test-Path $tempDir) {
    Write-Host "Removing existing temp directory..." -ForegroundColor Yellow
    Remove-Item -Path $tempDir -Recurse -Force
}

Write-Host "Creating temp directory..." -ForegroundColor Green
New-Item -ItemType Directory -Path $tempDir | Out-Null
cd $tempDir

Write-Host ""
Write-Host "Step 1: Initializing git repository..." -ForegroundColor Green
git init

Write-Host ""
Write-Host "Step 2: Adding Firefox remote..." -ForegroundColor Green
git remote add origin https://github.com/mozilla/gecko-dev.git

Write-Host ""
Write-Host "Step 3: Enabling sparse checkout..." -ForegroundColor Green
git config core.sparseCheckout true

# Create sparse-checkout file
$sparseCheckout = @"
browser/branding/
browser/app/firefox.exe.manifest
browser/app/pbproxy/
"@

Set-Content -Path ".git/info/sparse-checkout" -Value $sparseCheckout

Write-Host ""
Write-Host "Step 4: Fetching Firefox release branch (this may take a few minutes)..." -ForegroundColor Green
git fetch --depth 1 origin release

Write-Host ""
Write-Host "Step 5: Checking out files..." -ForegroundColor Green
git checkout release

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Download Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Analyze structure
Write-Host "Analyzing branding structure..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Available branding folders:" -ForegroundColor Yellow
Get-ChildItem browser/branding -Directory | ForEach-Object {
    Write-Host "  - $($_.Name)" -ForegroundColor White
}

Write-Host ""
Write-Host "Official branding files:" -ForegroundColor Yellow
Get-ChildItem browser/branding/official -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\browser\branding\official\", "")
    $size = [math]::Round($_.Length / 1KB, 2)
    Write-Host "  $relativePath ($size KB)" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Files are in: $tempDir" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now explore:" -ForegroundColor Yellow
Write-Host "  cd $tempDir" -ForegroundColor White
Write-Host "  cd browser/branding/official" -ForegroundColor White
Write-Host ""
Write-Host "Key files to check:" -ForegroundColor Yellow
Write-Host "  - moz.build (build configuration)" -ForegroundColor White
Write-Host "  - configure.sh (branding variables)" -ForegroundColor White
Write-Host "  - *.ico files (Windows icons)" -ForegroundColor White
Write-Host "  - *.png files (various sizes)" -ForegroundColor White
Write-Host ""

# Copy to main project for easy access
Write-Host "Copying branding files to project..." -ForegroundColor Green
$destDir = "..\firefox-branding-reference"
if (Test-Path $destDir) {
    Remove-Item -Path $destDir -Recurse -Force
}
Copy-Item -Path "browser\branding" -Destination $destDir -Recurse

cd ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Branding files copied to: firefox-branding-reference" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Explore firefox-branding-reference/official/" -ForegroundColor White
Write-Host "2. Compare with custom-resources/branding/" -ForegroundColor White
Write-Host "3. Create missing icon files" -ForegroundColor White
Write-Host "4. Update moz.build based on official version" -ForegroundColor White
Write-Host ""
Write-Host "Done! Press any key to exit..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
