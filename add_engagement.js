const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = 'images/Enagment';
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
    
    // 2. Update engagement.html
    if (fs.existsSync('engagement.html')) {
        let content = fs.readFileSync('engagement.html', 'utf8');
        const startIdx = content.indexOf('<div class="gallery-grid">');
        const endIdx = content.indexOf('</div>', startIdx);
        
        if (startIdx !== -1 && endIdx !== -1) {
            let added = 0;
            let galleryHtml = content.substring(startIdx, endIdx);
            
            for (const webpFile of webpFiles) {
                const encodedPath = `images/Enagment/${encodeURIComponent(webpFile)}`;
                const rawPath = `images/Enagment/${webpFile}`;
                
                if (!galleryHtml.includes(encodedPath) && !galleryHtml.includes(rawPath)) {
                    const imgTag = `\n                <img src="${encodedPath}" alt="Engagement" class="fade-up" loading="lazy" decoding="async">`;
                    galleryHtml += imgTag;
                    added++;
                }
            }
            
            if (added > 0) {
                content = content.substring(0, startIdx) + galleryHtml + content.substring(endIdx);
                fs.writeFileSync('engagement.html', content);
                console.log(`Added ${added} images to engagement.html`);
            } else {
                console.log('No new images to add to engagement.html');
            }
        }
    }
    
    // 3. Update portfolio.html
    if (fs.existsSync('portfolio.html')) {
        let content = fs.readFileSync('portfolio.html', 'utf8');
        let added = 0;
        
        for (const webpFile of webpFiles) {
            const encodedPath = `images/Enagment/${encodeURIComponent(webpFile)}`;
            const rawPath = `images/Enagment/${webpFile}`;
            
            if (!content.includes(encodedPath) && !content.includes(rawPath)) {
                const entry = `\n                { img: '${encodedPath}', cat: 'wedding', title: 'Engagement', class: 'wide' },`;
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
