const fs = require('fs');
const path = require('path');

const dir = 'images/BABY THEME';
let files = fs.readdirSync(dir);
// Filter for -optimized.webp files to use as base
const webpFiles = files.filter(f => f.endsWith('-optimized.webp'));

console.log(`Found ${webpFiles.length} optimized webp files in ${dir}`);

// 1. UPDATE PORTFOLIO.HTML
let portfolioContent = fs.readFileSync('portfolio.html', 'utf8');

let addedToPortfolio = 0;
for (const file of webpFiles) {
    const imgPath = `${dir}/${file}`;
    // URI encode spaces
    const encodedImgPath = imgPath.split('/').map(part => encodeURIComponent(part)).join('/');
    
    // Check if already in portfolio
    if (!portfolioContent.includes(encodedImgPath) && !portfolioContent.includes(imgPath)) {
        const entry = `\n                { img: '${encodedImgPath}', cat: 'wedding', title: 'Baby theme', class: 'wide' },`;
        portfolioContent = portfolioContent.replace('];\n\n            const portfolioGrid', entry + '\n            ];\n\n            const portfolioGrid');
        addedToPortfolio++;
    }
}
fs.writeFileSync('portfolio.html', portfolioContent);
console.log(`Added ${addedToPortfolio} images to portfolio.html`);

// 2. UPDATE BABY-THEME.HTML (SERVICES)
let babyContent = fs.readFileSync('baby-theme.html', 'utf8');

let addedToBaby = 0;
for (const file of webpFiles) {
    const baseName = file.replace('-optimized.webp', '');
    const imgPathBase = `${dir}/${baseName}`;
    const encodedBase = imgPathBase.split('/').map(part => encodeURIComponent(part)).join('/');
    
    // Check if already in baby-theme
    if (!babyContent.includes(`${encodedBase}-768.webp`) && !babyContent.includes(`${imgPathBase}-768.webp`)) {
        const imgTag = `\n                <img src="${encodedBase}-768.webp" alt="Baby Theme" class="fade-up" loading="lazy" decoding="async" srcset="${encodedBase}-480.webp 480w, ${encodedBase}-768.webp 768w, ${encodedBase}-optimized.webp 2000w" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">`;
        
        // Find the last image tag in baby-theme.html or the closing section to append to
        babyContent = babyContent.replace(/<\/div>\s*<div class="text-center" style="margin-top: 4rem;">/, imgTag + '\n            </div>\n            \n            <div class="text-center" style="margin-top: 4rem;">');
        addedToBaby++;
    }
}
fs.writeFileSync('baby-theme.html', babyContent);
console.log(`Added ${addedToBaby} images to baby-theme.html`);
