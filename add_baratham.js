const fs = require('fs');
const path = require('path');

const dir = 'images/baratham';
let files = fs.readdirSync(dir);
// Filter for -optimized.webp files to use as base
const webpFiles = files.filter(f => f.endsWith('-optimized.webp'));

console.log(`Found ${webpFiles.length} optimized webp files in ${dir}`);

// 1. UPDATE PORTFOLIO.HTML
let portfolioContent = fs.readFileSync('portfolio.html', 'utf8');

let addedToPortfolio = 0;
for (const file of webpFiles) {
    const imgPath = `${dir}/${file}`;
    const encodedImgPath = imgPath.split('/').map(part => encodeURIComponent(part)).join('/');
    
    if (!portfolioContent.includes(encodedImgPath) && !portfolioContent.includes(imgPath)) {
        const entry = `\n                { img: '${encodedImgPath}', cat: 'wedding', title: 'Bharatanatyam', class: 'wide' },`;
        portfolioContent = portfolioContent.replace('];\n\n            const portfolioGrid', entry + '\n            ];\n\n            const portfolioGrid');
        addedToPortfolio++;
    }
}
fs.writeFileSync('portfolio.html', portfolioContent);
console.log(`Added ${addedToPortfolio} images to portfolio.html`);

// 2. UPDATE BARATHAM.HTML (SERVICES)
let barathamContent = fs.readFileSync('baratham.html', 'utf8');

let addedToBaratham = 0;
for (const file of webpFiles) {
    const baseName = file.replace('-optimized.webp', '');
    const imgPathBase = `${dir}/${baseName}`;
    const encodedBase = imgPathBase.split('/').map(part => encodeURIComponent(part)).join('/');
    
    if (!barathamContent.includes(`${encodedBase}-768.webp`) && !barathamContent.includes(`${imgPathBase}-768.webp`)) {
        const imgTag = `\n                <img src="${encodedBase}-768.webp" alt="Bharatanatyam" class="fade-up" loading="lazy" decoding="async" srcset="${encodedBase}-480.webp 480w, ${encodedBase}-768.webp 768w, ${encodedBase}-optimized.webp 2000w" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">`;
        
        barathamContent = barathamContent.replace(/<\/div>\s*<div class="text-center" style="margin-top: 4rem;">/, imgTag + '\n            </div>\n            \n            <div class="text-center" style="margin-top: 4rem;">');
        addedToBaratham++;
    }
}
fs.writeFileSync('baratham.html', barathamContent);
console.log(`Added ${addedToBaratham} images to baratham.html`);
