const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../public/images/profile.jpg');
const publicDir = path.join(__dirname, '../public');

console.log('🎨 Generating optimized profile and logo images...\n');

const tasks = [
  // Optimized profile for About page
  {
    output: path.join(__dirname, '../public/images/profile-optimized.jpg'),
    width: 800,
    height: 800,
    quality: 85,
    format: 'jpeg',
    description: 'Optimized profile image'
  },
  // WebP version for modern browsers
  {
    output: path.join(__dirname, '../public/images/profile.webp'),
    width: 800,
    height: 800,
    quality: 85,
    format: 'webp',
    description: 'WebP profile image'
  },
  // PWA Logo 192x192
  {
    output: path.join(publicDir, 'logo192.png'),
    width: 192,
    height: 192,
    quality: 90,
    format: 'png',
    description: 'PWA Logo 192x192'
  },
  // PWA Logo 512x512
  {
    output: path.join(publicDir, 'logo512.png'),
    width: 512,
    height: 512,
    quality: 90,
    format: 'png',
    description: 'PWA Logo 512x512'
  },
  // Apple Touch Icon
  {
    output: path.join(publicDir, 'apple-touch-icon.png'),
    width: 180,
    height: 180,
    quality: 90,
    format: 'png',
    description: 'Apple Touch Icon'
  },
  // Favicon (ICO format via PNG)
  {
    output: path.join(publicDir, 'favicon-32x32.png'),
    width: 32,
    height: 32,
    quality: 90,
    format: 'png',
    description: 'Favicon 32x32'
  }
];

async function generateImage(task) {
  try {
    const { output, width, height, quality, format, description } = task;

    let pipeline = sharp(inputPath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      });

    // Apply format-specific options
    if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality, progressive: true });
    } else if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality, compressionLevel: 9 });
    }

    await pipeline.toFile(output);

    const stats = fs.statSync(output);
    const size = (stats.size / 1024).toFixed(2);

    console.log(`✅ ${description}`);
    console.log(`   File: ${path.basename(output)}`);
    console.log(`   Size: ${size} KB`);
    console.log(`   Dimensions: ${width}x${height}px\n`);

    return { success: true, description, size };
  } catch (error) {
    console.error(`❌ Failed to generate ${task.description}:`, error.message);
    return { success: false, description: task.description };
  }
}

async function main() {
  // Check if input file exists
  if (!fs.existsSync(inputPath)) {
    console.error('❌ Error: profile.jpg not found at:', inputPath);
    console.log('   Make sure you have public/images/profile.jpg');
    process.exit(1);
  }

  const originalStats = fs.statSync(inputPath);
  const originalSize = (originalStats.size / 1024).toFixed(2);

  console.log(`📸 Original profile.jpg: ${originalSize} KB\n`);
  console.log('Generating images...\n');

  // Generate all images
  const results = [];
  for (const task of tasks) {
    const result = await generateImage(task);
    results.push(result);
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successfully generated: ${successful} images`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed} images`);
  }

  const totalSize = results
    .filter(r => r.success && r.size)
    .reduce((sum, r) => sum + parseFloat(r.size), 0);

  console.log(`📦 Total size of generated images: ${totalSize.toFixed(2)} KB`);
  console.log(`💾 Savings from original: ${(originalSize - totalSize).toFixed(2)} KB\n`);

  console.log('✨ Done!\n');
  console.log('📝 Next steps:');
  console.log('   1. Update About.jsx to use profile-optimized.jpg or profile.webp');
  console.log('   2. Check public/ folder for logo192.png and logo512.png');
  console.log('   3. Update manifest.json icons if needed');
  console.log('   4. Deploy with: npm run deploy\n');
}

main().catch(console.error);
