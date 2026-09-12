const fs = require('fs');

const files = fs.readdirSync('.');
const htmlFiles = files.filter(f => f.endsWith('.html'));

const whatsappOldRegex = /<!-- WhatsApp Floating Button -->\s*<a href="[^"]+" target="_blank" class="whatsapp-float">\s*WA\s*<\/a>/g;

const whatsappIconHtml = `
        <a href="https://wa.me/919994499388?text=Hi Vanavil Studio, I would like to enquire about your photography services." target="_blank" class="social-icon whatsapp" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.8 5.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
        </a>
    </div>`;

let updatedCount = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Remove the standalone "WA" floating button
    if (whatsappOldRegex.test(content)) {
        content = content.replace(whatsappOldRegex, '');
        changed = true;
    }

    // 2. Check if the floating-socials container exists, and doesn't already have WhatsApp
    if (content.includes('class="floating-socials"') && !content.includes('class="social-icon whatsapp"')) {
        // Find where the floating-socials div ends
        // We look for the closing div tag of floating-socials.
        // It's a bit tricky with regex, but since we know the structure:
        // class="social-icon youtube"... </a> \n </div>
        const replaceTarget = /<\/a>\s*<\/div>\s*<script/g;
        // Wait, not all pages might have <script immediately after. 
        // Let's replace the specific youtube closing tag and div
        const insertRegex = /(<a href="https:\/\/youtube\.com\/" target="_blank" class="social-icon youtube" aria-label="YouTube">[\s\S]*?<\/svg>\s*<\/a>)\s*<\/div>/g;
        
        if (insertRegex.test(content)) {
            content = content.replace(insertRegex, `$1${whatsappIconHtml}`);
            changed = true;
        }
    }

    if (changed) {
        // Clean up any double blank lines created by removal
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
        updatedCount++;
    }
}

console.log(`Total files updated: ${updatedCount}`);
