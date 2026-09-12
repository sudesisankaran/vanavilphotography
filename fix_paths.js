const fs = require('fs');
const files = ['services.html', 'portfolio.html', 'index.html', 'baby-shower.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const target = 'images/BABY%20SHOWER-20260904T101903Z-1-001/BABY%20SHOWER/';
  const replacement = 'images/BABY%20SHOWER-20260904T101903Z-1-001/';
  
  if (content.includes(target)) {
    content = content.split(target).join(replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
