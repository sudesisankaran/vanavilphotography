const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function updateLogo() {
    const srcPng = 'images/005 copy (1).png';
    const newPng = 'images/logo.png';
    const newWebp = 'images/logo.webp';
    
    // Check if new file exists
    if (!fs.existsSync(srcPng)) {
        console.error(`File not found: ${srcPng}`);
        return;
    }
    
    // Copy the original to logo.png
    fs.copyFileSync(srcPng, newPng);
    console.log(`Created ${newPng}`);
    
    // Convert to logo.webp
    await sharp(srcPng)
        .webp({ quality: 90 })
        .toFile(newWebp);
    console.log(`Created ${newWebp}`);
    
    // Delete the awkwardly named original to keep the folder clean
    fs.unlinkSync(srcPng);
    console.log(`Deleted ${srcPng}`);
    
    // Update all HTML files
    const files = fs.readdirSync('.');
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    
    let updated = 0;
    for (const file of htmlFiles) {
        let content = fs.readFileSync(file, 'utf8');
        let changed = false;
        
        // Update Favicon
        if (content.includes('images/005%20copy.png')) {
            content = content.replace(/images\/005%20copy\.png/g, 'images/logo.png');
            changed = true;
        }
        
        // Update Logo WebP
        if (content.includes('images/005 copy.webp')) {
            content = content.replace(/images\/005 copy\.webp/g, 'images/logo.webp');
            changed = true;
        }
        // Just in case it's url encoded
        if (content.includes('images/005%20copy.webp')) {
            content = content.replace(/images\/005%20copy\.webp/g, 'images/logo.webp');
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(file, content);
            updated++;
        }
    }
    
    console.log(`Updated ${updated} HTML files with new logo and favicon paths.`);
}

updateLogo().catch(console.error);
