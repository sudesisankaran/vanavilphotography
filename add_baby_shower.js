const fs = require('fs');
const path = require('path');

const dir = 'images/BABY SHOWER';
let files = fs.readdirSync(dir);
// Only use the -optimized.webp files or standard .webp files (exclude the 480/768 variants)
// For portfolio, we want the base .webp file.
const webpFiles = files.filter(f => f.endsWith('.webp') && !f.includes('-480') && !f.includes('-768') && !f.includes('-optimized'));

console.log(`Found ${webpFiles.length} optimized webp files in ${dir}`);

if (webpFiles.length === 0) {
    console.log("No webp files found yet, maybe optimization is still running?");
    process.exit(0);
}

// 1. UPDATE PORTFOLIO.HTML
let portfolioContent = fs.readFileSync('portfolio.html', 'utf8');

// The portfolio logic has an array: const portfolioData = [ ... ]
// We will insert our new objects right before the closing bracket of that array.
let addedToPortfolio = 0;
for (const file of webpFiles) {
    const imgPath = `${dir}/${file}`;
    // Check if already in portfolio
    if (!portfolioContent.includes(imgPath)) {
        const entry = `\n                { img: '${imgPath}', cat: 'wedding', title: 'Baby shower', class: 'wide' },`;
        portfolioContent = portfolioContent.replace('];\n\n            const portfolioGrid', entry + '\n            ];\n\n            const portfolioGrid');
        addedToPortfolio++;
    }
}
fs.writeFileSync('portfolio.html', portfolioContent);
console.log(`Added ${addedToPortfolio} images to portfolio.html`);

// 2. UPDATE BABY-SHOWER.HTML (SERVICES)
let babyContent = fs.readFileSync('baby-shower.html', 'utf8');

// The masonry grid is between <div class="masonry-grid" id="masonry-grid"> and </div>
// We can just append new img tags before the closing </div> of that section.
let addedToBaby = 0;
for (const file of webpFiles) {
    const baseName = file.replace('.webp', '');
    const imgPathBase = `${dir}/${baseName}`;
    
    // Check if already in baby-shower
    if (!babyContent.includes(`${imgPathBase}.webp`)) {
        const imgTag = `\n                <img src="${imgPathBase}-768.webp" alt="Baby Shower" class="fade-up" loading="lazy" decoding="async" srcset="${imgPathBase}-480.webp 480w, ${imgPathBase}-768.webp 768w, ${imgPathBase}-optimized.webp 2000w" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw">`;
        babyContent = babyContent.replace('</div>\n        </div>\n    </section>\n\n    <!-- Call to Action -->', imgTag + '\n            </div>\n        </div>\n    </section>\n\n    <!-- Call to Action -->');
        addedToBaby++;
    }
}
fs.writeFileSync('baby-shower.html', babyContent);
console.log(`Added ${addedToBaby} images to baby-shower.html`);
