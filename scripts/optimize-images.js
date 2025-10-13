const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Configuration
const config = {
  travelImages: {
    inputDir: path.join(__dirname, "../public/images/travel"),
    outputDir: path.join(__dirname, "../public/images/travel"),
    maxWidth: 1920,
    quality: 85,
    formats: ["webp"],
    processSubdirectories: true,
  },
  projectImages: {
    inputDir: path.join(__dirname, "../public/images/projects"),
    outputDir: path.join(__dirname, "../public/images/projects/optimized"),
    maxWidth: 800,
    quality: 80,
    formats: ["webp"],
  },
};

// Ensure output directories exist
Object.values(config).forEach(({ outputDir }) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
});

async function optimizeImage(inputPath, outputDir, options) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  const stats = fs.statSync(inputPath);
  const originalSize = (stats.size / 1024).toFixed(2);

  console.log(`\n📸 Processing: ${filename}`);
  console.log(`   Original size: ${originalSize} KB`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Resize if needed
    let pipeline = image;
    if (metadata.width > options.maxWidth) {
      pipeline = pipeline.resize(options.maxWidth, null, {
        withoutEnlargement: true,
        fit: "inside",
      });
      console.log(
        `   ↓ Resizing from ${metadata.width}px to ${options.maxWidth}px`
      );
    }

    const results = [];

    // Generate WebP
    if (options.formats.includes("webp")) {
      const webpPath = path.join(outputDir, `${filename}.webp`);
      await pipeline
        .clone()
        .webp({ quality: options.quality })
        .toFile(webpPath);

      const webpSize = (fs.statSync(webpPath).size / 1024).toFixed(2);
      const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
      results.push({ format: "WebP", size: webpSize, savings });
      console.log(`   ✅ WebP: ${webpSize} KB (${savings}% smaller)`);
    }

    // Generate optimized JPEG
    if (options.formats.includes("jpeg")) {
      const jpegPath = path.join(outputDir, `${filename}.jpg`);
      await pipeline
        .clone()
        .jpeg({ quality: options.quality, progressive: true })
        .toFile(jpegPath);

      const jpegSize = (fs.statSync(jpegPath).size / 1024).toFixed(2);
      const savings = ((1 - jpegSize / originalSize) * 100).toFixed(1);
      results.push({ format: "JPEG", size: jpegSize, savings });
      console.log(`   ✅ JPEG: ${jpegSize} KB (${savings}% smaller)`);
    }

    return { filename, originalSize, results };
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
    return null;
  }
}

async function optimizeDirectory(inputDir, outputDir, options) {
  const items = fs.readdirSync(inputDir);
  const results = [];

  // Process files in current directory
  const files = items.filter(
    (file) =>
      /\.(jpe?g|png)$/i.test(file) &&
      !file.includes("optimized") &&
      fs.statSync(path.join(inputDir, file)).isFile()
  );

  if (files.length > 0) {
    console.log(
      `\n🚀 Optimizing ${files.length} images from ${path.basename(inputDir)}/\n`
    );

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const result = await optimizeImage(inputPath, outputDir, options);
      if (result) results.push(result);
    }
  }

  // Process subdirectories if enabled
  if (options.processSubdirectories) {
    const subdirs = items.filter((item) => {
      const fullPath = path.join(inputDir, item);
      return (
        fs.statSync(fullPath).isDirectory() &&
        item !== "optimized" &&
        !item.startsWith(".")
      );
    });

    for (const subdir of subdirs) {
      const subInputDir = path.join(inputDir, subdir);
      const subOutputDir = path.join(outputDir, subdir);

      // Ensure subdirectory output exists
      if (!fs.existsSync(subOutputDir)) {
        fs.mkdirSync(subOutputDir, { recursive: true });
      }

      const subResults = await optimizeDirectory(
        subInputDir,
        subOutputDir,
        options
      );
      results.push(...subResults);
    }
  }

  return results;
}

async function main() {
  console.log("🎨 Image Optimization Tool\n");
  console.log("=====================================");

  const allResults = [];

  // Optimize travel images
  console.log("\n📷 TRAVEL IMAGES");
  console.log("=====================================");
  const travelResults = await optimizeDirectory(
    config.travelImages.inputDir,
    config.travelImages.outputDir,
    config.travelImages
  );
  allResults.push(...travelResults);

  // Optimize project images (if they exist)
  if (fs.existsSync(config.projectImages.inputDir)) {
    console.log("\n\n💼 PROJECT IMAGES");
    console.log("=====================================");
    const projectResults = await optimizeDirectory(
      config.projectImages.inputDir,
      config.projectImages.outputDir,
      config.projectImages
    );
    allResults.push(...projectResults);
  }

  // Summary
  console.log("\n\n📊 OPTIMIZATION SUMMARY");
  console.log("=====================================");
  console.log(`✅ Total images processed: ${allResults.length}`);

  const totalOriginal = allResults.reduce(
    (sum, r) => sum + parseFloat(r.originalSize),
    0
  );
  const totalWebP = allResults.reduce((sum, r) => {
    const webp = r.results.find((res) => res.format === "WebP");
    return sum + (webp ? parseFloat(webp.size) : 0);
  }, 0);

  console.log(`📦 Original total: ${totalOriginal.toFixed(2)} KB`);
  console.log(`📦 WebP total: ${totalWebP.toFixed(2)} KB`);
  console.log(
    `💾 Total savings: ${((1 - totalWebP / totalOriginal) * 100).toFixed(1)}%`
  );

  console.log("\n✨ Optimization complete!\n");
  console.log("📝 Next steps:");
  console.log("   1. Review optimized images in /optimized folders");
  console.log("   2. Update image paths in your components");
  console.log("   3. Use <picture> tags for WebP with JPEG fallback");
}

main().catch(console.error);
