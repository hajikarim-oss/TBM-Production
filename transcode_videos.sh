#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# TBM Production — Video Transcoding Script for Web Delivery
# 
# This script converts raw production MP4s (50-200MB) into
# web-optimized MP4s (5-20MB) with ZERO visible quality loss.
#
# Requirements: ffmpeg (install via https://ffmpeg.org/download.html)
# Usage:        bash transcode_videos.sh
#               OR on Windows: run each ffmpeg command manually
# ═══════════════════════════════════════════════════════════════════

# Settings (visually lossless for web)
# CRF 20 = excellent quality, 80-85% smaller files
# CRF 18 = near-perfect quality, 70-75% smaller files  
# preset "slow" = better compression (takes longer but smaller files)
# faststart = moves moov atom to file start for instant playback
# scale=-2:720 = resize to 720p for card previews (saves huge bandwidth)
# scale=-2:1080 = keep 1080p for hero/modal playback

INPUT_DIR="./artifacts/videofolio/public/videos"
OUTPUT_DIR="./artifacts/videofolio/public/videos/optimized"
BTS_INPUT_DIR="./artifacts/videofolio/public/videos/bts"
BTS_OUTPUT_DIR="./artifacts/videofolio/public/videos/optimized/bts"

mkdir -p "$OUTPUT_DIR"
mkdir -p "$BTS_OUTPUT_DIR"

echo "═══════════════════════════════════════════════════════════"
echo "  TBM Video Transcoder — Web Optimized (CRF 20, faststart)"
echo "═══════════════════════════════════════════════════════════"
echo ""

# ─── HERO VIDEOS (keep at 1080p for fullscreen playback) ─── 
echo "[1/2] Transcoding main videos (1080p, CRF 20)..."
for f in "$INPUT_DIR"/*.mp4; do
  filename=$(basename "$f")
  if [ -f "$OUTPUT_DIR/$filename" ]; then
    echo "  SKIP: $filename (already exists)"
    continue
  fi
  
  original_size=$(du -h "$f" | cut -f1)
  echo "  Processing: $filename ($original_size)"
  
  ffmpeg -i "$f" \
    -c:v libx264 \
    -crf 20 \
    -preset slow \
    -profile:v high \
    -level 4.1 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -vf "scale=-2:1080" \
    -c:a aac \
    -b:a 128k \
    -ac 2 \
    -y \
    "$OUTPUT_DIR/$filename"
  
  new_size=$(du -h "$OUTPUT_DIR/$filename" | cut -f1)
  echo "  ✓ Done: $filename ($original_size → $new_size)"
  echo ""
done

# ─── BTS VIDEOS (1080p for modal playback) ───
echo "[2/2] Transcoding BTS videos (1080p, CRF 20)..."
for f in "$BTS_INPUT_DIR"/*.mp4; do
  filename=$(basename "$f")
  if [ -f "$BTS_OUTPUT_DIR/$filename" ]; then
    echo "  SKIP: $filename (already exists)"
    continue
  fi
  
  original_size=$(du -h "$f" | cut -f1)
  echo "  Processing: $filename ($original_size)"
  
  ffmpeg -i "$f" \
    -c:v libx264 \
    -crf 20 \
    -preset slow \
    -profile:v high \
    -level 4.1 \
    -pix_fmt yuv420p \
    -movflags +faststart \
    -vf "scale=-2:1080" \
    -c:a aac \
    -b:a 128k \
    -ac 2 \
    -y \
    "$BTS_OUTPUT_DIR/$filename"
  
  new_size=$(du -h "$BTS_OUTPUT_DIR/$filename" | cut -f1)
  echo "  ✓ Done: $filename ($original_size → $new_size)"
  echo ""
done

echo "═══════════════════════════════════════════════════════════"
echo "  DONE! All videos optimized."
echo ""
echo "  Next steps:"
echo "  1. Compare quality: open original vs optimized side by side"  
echo "  2. If happy, replace originals with optimized versions"
echo "  3. Upload to R2: npx wrangler r2 object put <bucket>/<name> --file <path>"
echo "═══════════════════════════════════════════════════════════"
