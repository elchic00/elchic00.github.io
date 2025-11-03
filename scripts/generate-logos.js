const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const logoInputPath = path.join(__dirname, "../public/images/logo-source.png");
const publicDir = path.join(__dirname, "../public");

console.log("🎨 Generating logo and favicon images from SVG...\n");

const logoTasks = [
  // PWA Logo 192x192 - keep existing size
  {
    input: logoInputPath,
    output: path.join(publicDir, "logo192.png"),
    width: 192,
    height: 192,
    quality: 90,
    format: "png",
    description: "PWA Logo 192x192",
  },
  // PWA Logo 512x512
  {
    input: logoInputPath,
    output: path.join(publicDir, "logo512.png"),
    width: 512,
    height: 512,
    quality: 90,
    format: "png",
    description: "PWA Logo 512x512",
  },
  // Apple Touch Icon
  {
    input: logoInputPath,
    output: path.join(publicDir, "apple-touch-icon.png"),
    width: 180,
    height: 180,
    quality: 90,
    format: "png",
    description: "Apple Touch Icon",
  },
  // Favicon 32x32
  {
    input: logoInputPath,
    output: path.join(publicDir, "favicon-32.png"),
    width: 32,
    height: 32,
    quality: 90,
    format: "png",
    description: "Favicon 32x32",
  },
];

const tasks = logoTasks;

async function generateImage(task) {
  try {
    const { input, output, width, height, quality, format, description } = task;

    let pipeline = sharp(input).resize(width, height, {
      fit: "contain",
      position: "center",
    });

    // Apply format-specific options
    if (format === "jpeg") {
      pipeline = pipeline.jpeg({ quality, progressive: true });
    } else if (format === "webp") {
      pipeline = pipeline.webp({ quality });
    } else if (format === "png") {
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
  // Check if logo source exists
  if (!fs.existsSync(logoInputPath)) {
    console.error("❌ Error: logo-source.svg not found at:", logoInputPath);
    console.log("   Make sure you have public/images/logo-source.svg");
    process.exit(1);
  }

  const logoStats = fs.statSync(logoInputPath);
  const logoSize = (logoStats.size / 1024).toFixed(2);

  console.log(`🎨 Original logo-source.svg: ${logoSize} KB\n`);
  console.log("Generating logo images...\n");

  // Generate all images
  const results = [];
  for (const task of tasks) {
    const result = await generateImage(task);
    results.push(result);
  }

  // Summary
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 SUMMARY");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successfully generated: ${successful} images`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed} images`);
  }

  const totalSize = results
    .filter((r) => r.success && r.size)
    .reduce((sum, r) => sum + parseFloat(r.size), 0);

  console.log(
    `📦 Total size of generated images: ${totalSize.toFixed(2)} KB\n`
  );

  console.log("✨ Done!\n");
  console.log("📝 Next steps:");
  console.log("   1. Check public/ folder for generated icons");
  console.log(
    "   2. Verify favicon-32.png and apple-touch-icon.png look correct"
  );
  console.log("   3. Update manifest.json icons if needed");
  console.log("   4. Deploy with: npm run deploy\n");
}

main().catch(console.error);
