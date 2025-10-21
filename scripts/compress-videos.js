#!/usr/bin/env node

/**
 * Video Compression Script
 * Compresses project demo videos while maintaining high visual quality
 * Reduces file sizes by 60-70% using modern H.264 encoding
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VIDEO_DIR = path.join(__dirname, '../public/images/projects');
const BACKUP_DIR = path.join(VIDEO_DIR, 'originals');

// Compression settings for high quality at smaller file size
const FFMPEG_OPTIONS = [
  '-c:v libx264',           // H.264 codec
  '-crf 32',                // More compression (23 = high quality, 32 = good quality but smaller)
  '-preset slower',         // Slower = better compression
  '-profile:v baseline',    // Baseline for maximum compatibility
  '-pix_fmt yuv420p',       // Pixel format for compatibility
  '-movflags +faststart',   // Optimize for web streaming
  '-vf "scale=\'min(iw,1280)\':\'min(ih,720)\':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2"', // Max 720p
  '-b:v 500k',              // Target bitrate 500kbps
  '-maxrate 750k',          // Max bitrate
  '-bufsize 1500k',         // Buffer size
  '-an'                     // Remove audio (demos don't need it)
].join(' ');

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(1); // KB
}

function compressVideo(inputPath, outputPath) {
  const originalSize = getFileSize(inputPath);

  console.log(`\n🎬 Compressing: ${path.basename(inputPath)}`);
  console.log(`   Original size: ${originalSize} KB`);

  try {
    const command = `ffmpeg -i "${inputPath}" ${FFMPEG_OPTIONS} -y "${outputPath}"`;
    execSync(command, { stdio: 'pipe' });

    const newSize = getFileSize(outputPath);
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    console.log(`   ✅ Compressed: ${newSize} KB`);
    console.log(`   💾 Saved: ${savings}%`);

    return { originalSize: parseFloat(originalSize), newSize: parseFloat(newSize), savings: parseFloat(savings) };
  } catch (error) {
    console.error(`   ❌ Error compressing ${path.basename(inputPath)}:`, error.message);
    return null;
  }
}

function main() {
  console.log('🎨 Video Compression Tool\n');
  console.log('=====================================\n');

  // Check if ffmpeg is installed
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Error: ffmpeg is not installed!');
    console.error('Install it with: brew install ffmpeg');
    process.exit(1);
  }

  // Create backup directory if it doesn't exist
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Find all MP4 files
  const videoFiles = fs.readdirSync(VIDEO_DIR)
    .filter(file => file.endsWith('.mp4'))
    .map(file => path.join(VIDEO_DIR, file));

  if (videoFiles.length === 0) {
    console.log('No MP4 files found in', VIDEO_DIR);
    return;
  }

  console.log(`Found ${videoFiles.length} videos to compress\n`);

  let totalOriginal = 0;
  let totalNew = 0;
  let successCount = 0;

  // Process each video
  videoFiles.forEach(videoPath => {
    const fileName = path.basename(videoPath);
    const backupPath = path.join(BACKUP_DIR, fileName);
    const tempPath = path.join(VIDEO_DIR, `temp_${fileName}`);

    // Backup original
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(videoPath, backupPath);
      console.log(`📦 Backed up: ${fileName}`);
    }

    // Compress to temp file
    const result = compressVideo(videoPath, tempPath);

    if (result) {
      // Replace original with compressed version
      fs.renameSync(tempPath, videoPath);
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      successCount++;
    }
  });

  // Summary
  console.log('\n=====================================');
  console.log('📊 COMPRESSION SUMMARY');
  console.log('=====================================');
  console.log(`✅ Videos compressed: ${successCount}/${videoFiles.length}`);
  console.log(`📦 Original total: ${totalOriginal.toFixed(1)} KB`);
  console.log(`📦 Compressed total: ${totalNew.toFixed(1)} KB`);
  console.log(`💾 Total savings: ${((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1)}%`);
  console.log('\n✨ Compression complete!');
  console.log(`\n📝 Original videos backed up in: ${BACKUP_DIR}`);
}

main();
