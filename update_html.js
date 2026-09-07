const fs = require('fs');
const path = require('path');

function updateHtmlFiles(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(directory, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // 1. Replace .JPG and .jpg with .webp (case insensitive)
            content = content.replace(/\.(JPG|jpg|jpeg)/g, '.webp');
            
            // 2. Add fetchpriority="high" to page-hero-bg images
            content = content.replace(/(class="page-hero-bg"[^>]*?)>/g, '$1 fetchpriority="high">');
            // Prevent duplicates if run multiple times
            content = content.replace(/fetchpriority="high"\s+fetchpriority="high"/g, 'fetchpriority="high"');
            
            // 3. Add decoding="async" to images that have loading="lazy"
            content = content.replace(/(loading="lazy"[^>]*?)>/g, '$1 decoding="async">');
            // Prevent duplicates
            content = content.replace(/decoding="async"\s+decoding="async"/g, 'decoding="async"');
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        }
    });
}

// Run the script
if (require.main === module) {
    updateHtmlFiles(".");
}
