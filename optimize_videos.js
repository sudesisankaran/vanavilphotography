const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

const rootDir = __dirname;
const videoDirs = [path.join(rootDir, 'videos'), path.join(rootDir, 'images')];

let files = [];
videoDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        files = files.concat(getAllFiles(dir));
    }
});

const videoFiles = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return (ext === '.mp4' || ext === '.mov') && !f.includes('-optimized');
});

console.log(`Found ${videoFiles.length} videos to optimize.`);

for (let i = 0; i < videoFiles.length; i++) {
    const file = videoFiles[i];
    const ext = path.extname(file);
    const dir = path.dirname(file);
    const baseName = path.basename(file, ext);
    
    console.log(`\n[${i+1}/${videoFiles.length}] Processing ${baseName}${ext}`);
    
    const optimizedMp4 = path.join(dir, `${baseName}-optimized.mp4`);
    const optimizedWebm = path.join(dir, `${baseName}-optimized.webm`);
    const posterJpg = path.join(dir, `${baseName}-poster.jpg`);
    const posterWebp = path.join(dir, `${baseName}-poster.webp`);

    try {
        // Generate poster if doesn't exist
        if (!fs.existsSync(posterJpg)) {
            console.log('Generating poster...');
            // extract frame at 00:00:01
            execSync(`ffmpeg -y -i "${file}" -ss 00:00:01 -vframes 1 "${posterJpg}"`);
        }
        
        if (!fs.existsSync(posterWebp)) {
           // try webp
           execSync(`ffmpeg -y -i "${file}" -ss 00:00:01 -vframes 1 "${posterWebp}"`);
        }

        // Compress MP4: limit height to 1080, lower bitrate
        if (!fs.existsSync(optimizedMp4)) {
            console.log('Compressing to MP4...');
            execSync(`ffmpeg -y -i "${file}" -vf "scale=-2:'min(1080,ih)'" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart "${optimizedMp4}"`);
        }

        // Compress to WebM: limit height to 1080, better for web
        if (!fs.existsSync(optimizedWebm)) {
            console.log('Compressing to WebM...');
            execSync(`ffmpeg -y -i "${file}" -vf "scale=-2:'min(1080,ih)'" -c:v libvpx-vp9 -crf 35 -b:v 0 -c:a libopus -b:a 128k "${optimizedWebm}"`);
        }
        
        console.log(`Successfully optimized ${baseName}`);
        
    } catch (err) {
        console.error(`Error processing ${baseName}:`, err.message);
    }
}

console.log("Video optimization complete.");
