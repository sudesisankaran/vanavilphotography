const fs = require('fs');
const path = require('path');

const replacements = [
    { old: 'images/BABY SHOWER-20260904T101903Z-1-001/', new: 'images/BABY SHOWER/' },
    { old: 'images/BABY%20SHOWER-20260904T101903Z-1-001/', new: 'images/BABY%20SHOWER/' },
    { old: 'images/BABY THEME-20260904T101916Z-1-001/BABY THEME/', new: 'images/BABY THEME/' },
    { old: 'images/BABY%20THEME-20260904T101916Z-1-001/BABY%20THEME/', new: 'images/BABY%20THEME/' },
    { old: 'images/baratham-20260904T101922Z-1-001/baratham/', new: 'images/baratham/' },
];

const htmlFiles = ['baby-shower.html', 'baby-theme.html', 'baratham.html', 'portfolio.html', 'index.html', 'services.html'];

for (const file of htmlFiles) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    for (const {old: o, new: n} of replacements) {
        if (content.includes(o)) {
            // Replace all occurrences using split-join
            content = content.split(o).join(n);
            modified = true;
        }
    }
    
    if (modified) {
        fs.writeFileSync(file, content);
        console.log(`Updated paths in ${file}`);
    }
}
