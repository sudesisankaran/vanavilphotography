const fs = require('fs');

const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const replacements = {
    'images/wedding-20260904T101936Z-1-001/wedding/0M5A9624.webp': 'images/wedding/0M5A9624.webp',
    'images/wedding-20260904T101936Z-1-001/wedding/0M5A5039.webp': 'images/wedding/0M5A5039.webp',
    'images/Wedding rec-20260904T102201Z-1-001/Wedding rec/0M5A2271.webp': 'images/wedding rec/0M5A2560.webp',
    'images/POST wedding-20260904T101932Z-1-001/POST wedding/0M5A0002.webp': 'images/post wedding/0M5A0076.webp',
    'images/pre-wedding-photos/photos/0L7A0844.webp': 'images/pre wedding/0L7A0930.webp',
    'images/Enagment-20260904T101926Z-1-001/Enagment/0M5A5003.webp': 'images/Enagment/0M5A5003.webp',
    'images/BABY SHOWER/0L7A9306.webp': 'images/BABY SHOWER/0L7A9309.webp'
};

let count = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    for (const [oldPath, newPath] of Object.entries(replacements)) {
        // Use a global regex to replace all instances in the file
        const regex = new RegExp(oldPath.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        if (regex.test(content)) {
            content = content.replace(regex, newPath);
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Updated paths in ${file}`);
        count++;
    }
}

console.log(`Total files updated: ${count}`);
