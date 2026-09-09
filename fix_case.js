const fs = require('fs');
const path = require('path');

// Build a flat list of all exact case-sensitive relative paths for images
function getImagesMap(dir) {
    let map = new Map(); // lowercase -> exact case
    function walk(currentDir) {
        const list = fs.readdirSync(currentDir);
        for (const file of list) {
            const filePath = path.join(currentDir, file);
            if (fs.statSync(filePath).isDirectory()) {
                walk(filePath);
            } else {
                // Convert backslashes to forward slashes for URLs
                const urlPath = filePath.replace(/\\/g, '/');
                map.set(urlPath.toLowerCase(), urlPath);
            }
        }
    }
    walk(dir);
    return map;
}

const exactPaths = getImagesMap('images');

// Process all HTML files
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let filesUpdated = 0;
let brokenLinksFound = 0;
let caseFixedLinks = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Regex to match src="images/..." and background-image: url('images/...')
    content = content.replace(/(?:src|href|content)="([^"]+)"/gi, (match, p1) => {
        if (!p1.startsWith('images/')) return match;
        
        // Decode the URL (remove %20, etc) to compare with file system
        let decodedPath = '';
        try {
            decodedPath = decodeURIComponent(p1);
        } catch (e) {
            decodedPath = p1; // fallback
        }
        
        const lowerPath = decodedPath.toLowerCase();
        
        if (exactPaths.has(lowerPath)) {
            const exactCasePath = exactPaths.get(lowerPath);
            
            // Re-encode spaces for the HTML
            const reEncoded = exactCasePath.split('/').map(part => encodeURIComponent(part)).join('/');
            
            if (reEncoded !== p1) {
                caseFixedLinks++;
                return match.replace(p1, reEncoded);
            }
        } else {
            console.log(`[BROKEN] Could not find file: ${decodedPath} in ${file}`);
            brokenLinksFound++;
        }
        
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        filesUpdated++;
    }
});

console.log(`Updated ${filesUpdated} files. Fixed case for ${caseFixedLinks} links. Found ${brokenLinksFound} broken links.`);
