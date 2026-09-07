const fs = require('fs');
const path = require('path');

function updateContactInfo(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(directory, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            let originalContent = content;
            
            // Update email
            content = content.replace(/hello@vanavilphotography\.com/g, 'vanavilsiva@gmail.com');
            
            // Update phone numbers
            content = content.replace(/\+919876543210/g, '+919994499388');
            content = content.replace(/\+91\s*98765\s*43210/g, '+91 99944 99388');
            content = content.replace(/9876543210/g, '9994499388');
            
            if (originalContent !== content) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated contact info in ${file}`);
            }
        }
    });
}

// Run the script
if (require.main === module) {
    updateContactInfo(".");
}
