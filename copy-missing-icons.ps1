# Copy Missing Icons from Firefox Official Branding
# This script downloads Firefox branding and copies missing icons

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Silicium - Copy Missing Icons" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win"
    exit 1
}

# Step 1: Download Firefox branding if not exists
$firefoxBrandingDir = "firefox-branding-temp"

if (-not (Test-Path "$firefoxBrandingDir\browser\branding\official")) {
    Write-Host "Step 1: Downloading Firefox branding..." -ForegroundColor Green
    Write-Host "This will take a few minutes..." -ForegroundColor Yellow
    Write-Host ""
    
    if (Test-Path $firefoxBrandingDir) {
        Remove-Item -Path $firefoxBrandingDir -Recurse -Force
    }
    
    New-Item -ItemType Directory -Path $firefoxBrandingDir | Out-Null
    cd $firefoxBrandingDir
    
    git init
    git remote add origin https://github.com/mozilla/gecko-dev.git
    git config core.sparseCheckout true
    
    @"
browser/branding/
"@ | Out-File -FilePath .git/info/sparse-checkout -Encoding ASCII
    
    git fetch --depth 1 origin release
    git checkout release
    
    cd ..
    Write-Host "Download complete!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Step 1: Firefox branding already downloaded [OK]" -ForegroundColor Green
    Write-Host ""
}

# Step 2: Check what icons we have
Write-Host "Step 2: Checking current icons..." -ForegroundColor Green
Write-Host ""

$iconsDir = "custom-resources\icons"
$currentIcons = @()

if (Test-Path $iconsDir) {
    $currentIcons = Get-ChildItem $iconsDir -File | Select-Object -ExpandProperty Name
    Write-Host "Current icons:" -ForegroundColor Yellow
    $currentIcons | ForEach-Object {
        Write-Host "  [OK] $_" -ForegroundColor White
    }
} else {
    Write-Host "Icons directory not found, creating..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

Write-Host ""

# Step 3: Identify missing icons
Write-Host "Step 3: Identifying missing icons..." -ForegroundColor Green
Write-Host ""

$requiredIcons = @(
    "firefox.ico",
    "document.ico",
    "pbmode.ico",
    "default16.png",
    "default32.png",
    "default48.png",
    "default64.png",
    "default128.png",
    "default256.png",
    "about.png"
)

$missingIcons = @()
foreach ($icon in $requiredIcons) {
    if ($icon -notin $currentIcons) {
        $missingIcons += $icon
    }
}

if ($missingIcons.Count -eq 0) {
    Write-Host "All required icons are present! [OK]" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 0
}

Write-Host "Missing icons:" -ForegroundColor Yellow
$missingIcons | ForEach-Object {
    Write-Host "  [MISSING] $_" -ForegroundColor Red
}

Write-Host ""

# Step 4: Copy missing icons
Write-Host "Step 4: Copying missing icons from Firefox..." -ForegroundColor Green
Write-Host ""

$firefoxIconsDir = "$firefoxBrandingDir\browser\branding\official"
$copiedCount = 0
$notFoundCount = 0

foreach ($icon in $missingIcons) {
    $sourcePath = "$firefoxIconsDir\$icon"
    $destPath = "$iconsDir\$icon"
    
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        $size = [math]::Round((Get-Item $destPath).Length / 1KB, 2)
        Write-Host "  [OK] Copied $icon ($size KB)" -ForegroundColor Green
        $copiedCount++
    } else {
        Write-Host "  [FAIL] $icon not found in Firefox branding" -ForegroundColor Red
        $notFoundCount++
    }
}

Write-Host ""

# Step 5: Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Copied: $copiedCount icons" -ForegroundColor Green
if ($notFoundCount -gt 0) {
    Write-Host "Not found: $notFoundCount icons" -ForegroundColor Red
}
Write-Host ""

# Step 6: Verify all required icons
Write-Host "Step 6: Verifying all required icons..." -ForegroundColor Green
Write-Host ""

$allPresent = $true
foreach ($icon in $requiredIcons) {
    $iconPath = "$iconsDir\$icon"
    if (Test-Path $iconPath) {
        $size = [math]::Round((Get-Item $iconPath).Length / 1KB, 2)
        Write-Host "  [OK] $icon ($size KB)" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $icon" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host ""

# Step 7: Check moz.build
Write-Host "Step 7: Checking moz.build..." -ForegroundColor Green
Write-Host ""

$mozBuildPath = "custom-resources\branding\moz.build"
if (Test-Path $mozBuildPath) {
    $mozBuildContent = Get-Content $mozBuildPath -Raw
    
    $needsUpdate = $false
    
    # Check if document.ico and pbmode.ico are in moz.build
    if ($mozBuildContent -notmatch "document\.ico") {
        Write-Host "  [WARN] document.ico not in moz.build" -ForegroundColor Yellow
        $needsUpdate = $true
    }
    
    if ($mozBuildContent -notmatch "pbmode\.ico") {
        Write-Host "  [WARN] pbmode.ico not in moz.build" -ForegroundColor Yellow
        $needsUpdate = $true
    }
    
    if ($needsUpdate) {
        Write-Host ""
        Write-Host "  You need to update moz.build to include:" -ForegroundColor Yellow
        Write-Host "    - document.ico" -ForegroundColor White
        Write-Host "    - pbmode.ico" -ForegroundColor White
        Write-Host ""
        Write-Host "  Add them to FINAL_TARGET_FILES.branding section" -ForegroundColor Yellow
    } else {
        Write-Host "  [OK] moz.build looks good" -ForegroundColor Green
    }
} else {
    Write-Host "  [ERROR] moz.build not found!" -ForegroundColor Red
}

Write-Host ""

# Final message
Write-Host "========================================" -ForegroundColor Cyan
if ($allPresent) {
    Write-Host "SUCCESS! All icons are ready!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update moz.build if needed" -ForegroundColor White
    Write-Host "2. Commit changes: git add custom-resources/icons" -ForegroundColor White
    Write-Host "3. Push and run build workflow" -ForegroundColor White
    Write-Host "4. Build should succeed!" -ForegroundColor White
} else {
    Write-Host "INCOMPLETE - Some icons still missing" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please create missing icons manually or:" -ForegroundColor Yellow
    Write-Host "1. Check Firefox branding for alternatives" -ForegroundColor White
    Write-Host "2. Create custom icons for Silicium" -ForegroundColor White
    Write-Host "3. See MISSING_ICONS_ANALYSIS.md for details" -ForegroundColor White
}

Write-Host ""
Write-Host "Icons location: $iconsDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
