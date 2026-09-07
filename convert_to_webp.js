const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // Requires running: npm install sharp

async function optimizeToWebP(directory) {
    try {
        const items = fs.readdirSync(directory, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(directory, item.name);

            if (item.isDirectory()) {
                await optimizeToWebP(fullPath);
            } else if (/\.(jpg|jpeg|png)$/i.test(item.name)) {
                try {
                    const webpPath = fullPath.replace(/\.[^/.]+$/, '.webp');
                    
                    // aggressive thumbnailing for 5ms load time
                    await sharp(fullPath)
                        .resize(800, 800, {
                            fit: sharp.fit.inside,
                            withoutEnlargement: true
                        })
                        .webp({ quality: 60, effort: 6 })
                        .toFile(webpPath);
                        
                    fs.unlinkSync(fullPath);
                    console.log(`Converted ${fullPath} to WebP.`);
                } catch (err) {
                    console.error(`Failed ${fullPath}:`, err.message);
                }
            }
        }
    } catch (err) {
        console.error(`Error reading directory ${directory}:`, err.message);
    }
}

// Run the script
if (require.main === module) {
    optimizeToWebP("images");
}
