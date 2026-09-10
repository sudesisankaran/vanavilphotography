const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetSizes = [480, 768, 1200, 1600];
const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

// Helper to recursively find files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function processImages(directory) {
  let files = [];
  try {
    files = getAllFiles(directory);
  } catch(e) {
    console.error("Error reading directory", e);
    return;
  }

  const imageFiles = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    // Exclude already generated sizes to avoid infinite loop
    const isGenerated = targetSizes.some(size => f.includes(`-${size}.webp`)) || f.endsWith('-optimized.webp');
    return supportedExtensions.includes(ext) && !isGenerated;
  });

  console.log(`Found ${imageFiles.length} original images. Starting optimization...`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const ext = path.extname(file);
    const dir = path.dirname(file);
    const baseName = path.basename(file, ext);
    
    // Original size for reporting
    const origStat = fs.statSync(file);
    totalOriginalSize += origStat.size;

    console.log(`[${i+1}/${imageFiles.length}] Processing ${baseName}${ext}`);
    
    try {
      const image = sharp(file);
      const metadata = await image.metadata();
      const originalWidth = metadata.width;

      // 1. Generate compressed original as WebP (if it's not already a highly optimized webp)
      const optimizedOriginalPath = path.join(dir, `${baseName}-optimized.webp`);
      await image
        .webp({ quality: 80, effort: 4 })
        .toFile(optimizedOriginalPath);
      
      const optStat = fs.statSync(optimizedOriginalPath);
      totalOptimizedSize += optStat.size;

      // 2. Generate responsive sizes
      for (const size of targetSizes) {
        if (originalWidth && originalWidth > size) {
          const resizedPath = path.join(dir, `${baseName}-${size}.webp`);
          // Check if already exists
          if (!fs.existsSync(resizedPath)) {
             await sharp(file)
              .resize({ width: size, withoutEnlargement: true })
              .webp({ quality: 80, effort: 4 })
              .toFile(resizedPath);
          }
        }
      }
    } catch (err) {
      console.error(`Failed to process ${file}:`, err.message);
    }
  }

  console.log("-----------------------------------------");
  console.log("Optimization Complete!");
  console.log(`Original total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized base size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log("Note: This does not count the additional space used by responsive variants, but the user will download much less data.");
}

const imagesDir = path.join(__dirname, 'images');
processImages(imagesDir);
