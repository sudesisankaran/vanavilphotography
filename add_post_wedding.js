const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = 'images/post wedding';
const files = fs.readdirSync(dir);
const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

async function processImages() {
    console.log(`Found ${jpgFiles.length} JPG files in ${dir}`);
    
    const webpFiles = [];
    
    // 1. Convert to webp
    for (const file of jpgFiles) {
        const fullPath = path.join(dir, file);
        const baseName = file.replace(/\.(jpg|jpeg|JPG|JPEG)$/, '');
        const webpName = `${baseName}.webp`;
        const webpPath = path.join(dir, webpName);
        
        console.log(`Converting ${file} to ${webpName}...`);
        await sharp(fullPath)
            .resize(2000, null, { withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(webpPath);
            
        // Delete original JPG
        fs.unlinkSync(fullPath);
        webpFiles.push(webpName);
    }
    
    console.log('Conversion complete. Updating HTML files...');
    
    // 2. Update post-wedding.html
    if (fs.existsSync('post-wedding.html')) {
        let content = fs.readFileSync('post-wedding.html', 'utf8');
        
        // Fix Hero image
        content = content.replace(/<img src="images\/POST wedding-2026[^"]+\/0M5A0002\.webp" alt="THE CELEBRATION CONTINUES" class="page-hero-bg" fetchpriority="high">/g, 
                                 '<img src="images/post wedding/0M5A0002.webp" alt="THE CELEBRATION CONTINUES" class="page-hero-bg" fetchpriority="high">');
                                 
        const startIdx = content.indexOf('<div class="gallery-grid">');
        const endIdx = content.indexOf('</div>', startIdx);
        
        if (startIdx !== -1 && endIdx !== -1) {
            let galleryHtml = content.substring(startIdx, endIdx);
            
            // Clean out broken 2026 links
            const imgRegex = /<img[^>]+src="images\/POST wedding-2026[^"]+"[^>]*>/g;
            let match;
            let toRemove = [];
            while ((match = imgRegex.exec(galleryHtml)) !== null) {
                toRemove.push(match[0]);
            }
            for (const tag of toRemove) {
                galleryHtml = galleryHtml.replace(tag, '');
            }
            // Cleanup extra newlines
            galleryHtml = galleryHtml.replace(/\n\s*\n/g, '\n');
            
            // Inject new images
            let added = 0;
            for (const webpFile of webpFiles) {
                const encodedPath = `images/post%20wedding/${encodeURIComponent(webpFile)}`;
                const rawPath = `images/post wedding/${webpFile}`;
                
                if (!galleryHtml.includes(encodedPath) && !galleryHtml.includes(rawPath)) {
                    const imgTag = `\n                <img src="${encodedPath}" alt="Post Wedding" class="fade-up" loading="lazy" decoding="async">`;
                    galleryHtml += imgTag;
                    added++;
                }
            }
            
            content = content.substring(0, startIdx) + galleryHtml + content.substring(endIdx);
            fs.writeFileSync('post-wedding.html', content);
            console.log(`Cleaned old images and added ${added} new images to post-wedding.html`);
        }
    }
    
    // 3. Update portfolio.html
    if (fs.existsSync('portfolio.html')) {
        let content = fs.readFileSync('portfolio.html', 'utf8');
        let added = 0;
        
        for (const webpFile of webpFiles) {
            const encodedPath = `images/post%20wedding/${encodeURIComponent(webpFile)}`;
            const rawPath = `images/post wedding/${webpFile}`;
            
            if (!content.includes(encodedPath) && !content.includes(rawPath)) {
                const entry = `\n                { img: '${encodedPath}', cat: 'wedding', title: 'Post Wedding', class: 'wide' },`;
                // Insert before the end of the array
                content = content.replace('];\n\n            const portfolioGrid', entry + '\n            ];\n\n            const portfolioGrid');
                added++;
            }
        }
        
        if (added > 0) {
            fs.writeFileSync('portfolio.html', content);
            console.log(`Added ${added} images to portfolio.html`);
        } else {
            console.log('No new images to add to portfolio.html');
        }
    }
}

processImages().catch(console.error);
