# ═══════════════════════════════════════════════════════════════════
# TBM Production — Video Transcoding Script (Windows PowerShell)
#
# Converts raw production MP4s (50-200MB) into web-optimized
# MP4s (5-20MB) with ZERO visible quality loss.
#
# Requirements: ffmpeg (download from https://ffmpeg.org/download.html)
# Usage:        .\transcode_videos.ps1
# ═══════════════════════════════════════════════════════════════════

$InputDir = "artifacts\videofolio\public\videos"
$OutputDir = "artifacts\videofolio\public\videos\optimized"
$BtsInputDir = "artifacts\videofolio\public\videos\bts"
$BtsOutputDir = "artifacts\videofolio\public\videos\optimized\bts"

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
New-Item -ItemType Directory -Force -Path $BtsOutputDir | Out-Null

Write-Host ""
Write-Host "=== TBM Video Transcoder — Web Optimized (CRF 20, faststart) ===" -ForegroundColor Cyan
Write-Host ""

# ─── MAIN VIDEOS (1080p for hero/card playback) ───
Write-Host "[1/2] Transcoding main videos..." -ForegroundColor Yellow
$mainFiles = Get-ChildItem -Path $InputDir -Filter "*.mp4" -File
foreach ($f in $mainFiles) {
    $outPath = Join-Path $OutputDir $f.Name
    if (Test-Path $outPath) {
        Write-Host "  SKIP: $($f.Name) (already exists)" -ForegroundColor DarkGray
        continue
    }

    $sizeMB = [math]::Round($f.Length / 1MB, 1)
    Write-Host "  Processing: $($f.Name) ($sizeMB MB)" -ForegroundColor White

    & ffmpeg -i $f.FullName `
        -c:v libx264 `
        -crf 20 `
        -preset slow `
        -profile:v high `
        -level 4.1 `
        -pix_fmt yuv420p `
        -movflags +faststart `
        -vf "scale=-2:1080" `
        -c:a aac `
        -b:a 128k `
        -ac 2 `
        -y `
        $outPath

    if (Test-Path $outPath) {
        $newSize = [math]::Round((Get-Item $outPath).Length / 1MB, 1)
        $reduction = [math]::Round((1 - $newSize / $sizeMB) * 100, 0)
        Write-Host "  Done: $($f.Name) ($sizeMB MB -> $newSize MB, ${reduction}% smaller)" -ForegroundColor Green
    }
    Write-Host ""
}

# ─── BTS VIDEOS ───
Write-Host "[2/2] Transcoding BTS videos..." -ForegroundColor Yellow
$btsFiles = Get-ChildItem -Path $BtsInputDir -Filter "*.mp4" -File
foreach ($f in $btsFiles) {
    $outPath = Join-Path $BtsOutputDir $f.Name
    if (Test-Path $outPath) {
        Write-Host "  SKIP: $($f.Name) (already exists)" -ForegroundColor DarkGray
        continue
    }

    $sizeMB = [math]::Round($f.Length / 1MB, 1)
    Write-Host "  Processing: $($f.Name) ($sizeMB MB)" -ForegroundColor White

    & ffmpeg -i $f.FullName `
        -c:v libx264 `
        -crf 20 `
        -preset slow `
        -profile:v high `
        -level 4.1 `
        -pix_fmt yuv420p `
        -movflags +faststart `
        -vf "scale=-2:1080" `
        -c:a aac `
        -b:a 128k `
        -ac 2 `
        -y `
        $outPath

    if (Test-Path $outPath) {
        $newSize = [math]::Round((Get-Item $outPath).Length / 1MB, 1)
        $reduction = [math]::Round((1 - $newSize / $sizeMB) * 100, 0)
        Write-Host "  Done: $($f.Name) ($sizeMB MB -> $newSize MB, ${reduction}% smaller)" -ForegroundColor Green
    }
    Write-Host ""
}

Write-Host "=== ALL DONE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Compare quality: open original vs optimized side by side"
Write-Host "  2. If happy, replace originals with optimized versions"
Write-Host "  3. Re-upload to R2 CDN"
Write-Host ""
