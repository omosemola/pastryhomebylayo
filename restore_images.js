
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(file => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

function restoreImages() {
    console.log('Restoring original images...');
    const files = getAllFiles(ASSETS_DIR);
    let count = 0;

    for (const file of files) {
        if (file.endsWith('.bak')) {
            const originalPath = file.slice(0, -4); // Remove .bak

            try {
                // If optimized file exists, delete it first (optional, rename overwrites on some systems but let's be safe)
                if (fs.existsSync(originalPath)) {
                    fs.unlinkSync(originalPath);
                }

                fs.renameSync(file, originalPath);
                console.log(`Restored: ${path.basename(originalPath)}`);
                count++;
            } catch (err) {
                console.error(`Error restoring ${path.basename(file)}:`, err.message);
            }
        }
    }
    console.log(`Finished! Restored ${count} files.`);
}

restoreImages();
