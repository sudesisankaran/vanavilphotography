const fs = require('fs');

const file = 'engagement.html';
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Remove any <img> tag inside gallery-grid that points to Enagment-2026...
    const startIdx = content.indexOf('<div class="gallery-grid">');
    const endIdx = content.indexOf('</div>', startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        let galleryHtml = content.substring(startIdx, endIdx);
        
        // Match <img> tags that contain Enagment-2026
        const imgRegex = /<img[^>]+src="images\/Enagment-2026[^"]+"[^>]*>/g;
        let match;
        let toRemove = [];
        
        while ((match = imgRegex.exec(galleryHtml)) !== null) {
            toRemove.push(match[0]);
        }
        
        for (const tag of toRemove) {
            galleryHtml = galleryHtml.replace(tag, '');
            modified = true;
        }
        
        if (modified) {
            // Clean up extra newlines
            galleryHtml = galleryHtml.replace(/\n\s*\n/g, '\n');
            content = content.substring(0, startIdx) + galleryHtml + content.substring(endIdx);
            fs.writeFileSync(file, content);
            console.log(`Removed broken images from ${file}`);
        }
    }
}
