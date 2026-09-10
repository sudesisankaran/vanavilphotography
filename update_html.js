const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function getAllHtmlFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
        if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
            arrayOfFiles = getAllHtmlFiles(fullPath, arrayOfFiles);
        }
    } else {
        if (fullPath.endsWith('.html')) {
            arrayOfFiles.push(fullPath);
        }
    }
  });
  return arrayOfFiles;
}

const rootDir = __dirname;
const htmlFiles = getAllHtmlFiles(rootDir);

console.log(`Found ${htmlFiles.length} HTML files.`);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false });

    let modified = false;

    $('img').each((i, el) => {
        const $img = $(el);
        let src = $img.attr('src');
        if (!src) return;

        // URL decode src
        const originalSrc = decodeURIComponent(src);
        
        // Skip external images
        if (originalSrc.startsWith('http') || originalSrc.startsWith('data:')) return;

        const ext = path.extname(originalSrc);
        const dir = path.dirname(originalSrc);
        const baseName = path.basename(originalSrc, ext);

        // Check if optimized versions exist locally
        // We know the physical path relative to workspace
        const physicalDir = path.join(rootDir, dir);
        if (fs.existsSync(physicalDir)) {
            const hasOptimized = fs.existsSync(path.join(physicalDir, `${baseName}-optimized.webp`));
            
            if (hasOptimized) {
                // Determine responsive sizes
                const sizesToCheck = [480, 768, 1200, 1600];
                const srcsetParts = [];
                let fallbackSrc = `${dir}/${baseName}-optimized.webp`;
                
                sizesToCheck.forEach(size => {
                    if (fs.existsSync(path.join(physicalDir, `${baseName}-${size}.webp`))) {
                        srcsetParts.push(`${dir}/${baseName}-${size}.webp ${size}w`);
                        if (size === 768) fallbackSrc = `${dir}/${baseName}-768.webp`;
                    }
                });
                
                srcsetParts.push(`${dir}/${baseName}-optimized.webp 2000w`); // Use as max

                $img.attr('src', fallbackSrc);
                $img.attr('srcset', srcsetParts.join(', '));
                
                const classes = $img.attr('class') || '';
                const isHero = classes.includes('hero') || classes.includes('banner');

                if (isHero) {
                    $img.attr('sizes', '100vw');
                    $img.removeAttr('loading');
                    $img.attr('fetchpriority', 'high');
                } else {
                    $img.attr('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
                    $img.attr('loading', 'lazy');
                    $img.attr('decoding', 'async');
                }
                
                // Note: we can't easily guess width/height without reading the image, but we are adding lazy and async
                modified = true;
            }
        }
    });

    $('video').each((i, el) => {
        const $video = $(el);
        // Find sources or direct src
        let src = $video.attr('src');
        let $sources = $video.find('source');
        
        const processSrc = (vidSrc) => {
            if (!vidSrc) return null;
            const originalSrc = decodeURIComponent(vidSrc);
            if (originalSrc.startsWith('http') || originalSrc.startsWith('data:')) return null;
            
            const ext = path.extname(originalSrc);
            const dir = path.dirname(originalSrc);
            const baseName = path.basename(originalSrc, ext);
            
            const physicalDir = path.join(rootDir, dir);
            const hasOptimized = fs.existsSync(path.join(physicalDir, `${baseName}-optimized.mp4`)) || fs.existsSync(path.join(physicalDir, `${baseName}-optimized.webm`));
            if (hasOptimized) {
                return { dir, baseName };
            }
            return null;
        };
        
        let videoData = processSrc(src);
        if (!videoData && $sources.length > 0) {
            videoData = processSrc($sources.eq(0).attr('src'));
        }

        if (videoData) {
            $video.removeAttr('src');
            $video.empty();
            
            const { dir, baseName } = videoData;
            
            // Add WebM
            if (fs.existsSync(path.join(rootDir, dir, `${baseName}-optimized.webm`))) {
                $video.append(`<source src="${dir}/${baseName}-optimized.webm" type="video/webm">`);
            }
            // Add MP4
            if (fs.existsSync(path.join(rootDir, dir, `${baseName}-optimized.mp4`))) {
                $video.append(`<source src="${dir}/${baseName}-optimized.mp4" type="video/mp4">`);
            }
            
            // Poster
            if (fs.existsSync(path.join(rootDir, dir, `${baseName}-poster.webp`))) {
                $video.attr('poster', `${dir}/${baseName}-poster.webp`);
            } else if (fs.existsSync(path.join(rootDir, dir, `${baseName}-poster.jpg`))) {
                $video.attr('poster', `${dir}/${baseName}-poster.jpg`);
            }
            
            $video.attr('muted', '');
            $video.attr('playsinline', '');
            
            // If it autoplayed, keep it but preload metadata. Or if below fold, preload none.
            if ($video.attr('autoplay') !== undefined) {
                $video.attr('preload', 'metadata');
            } else {
                $video.attr('preload', 'none');
            }
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(file, $.html());
        console.log(`Updated ${file}`);
    }
});
console.log("HTML update complete.");
