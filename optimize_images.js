
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const ASSETS_DIR = path.join(__dirname, 'assets');
const QUALITY = 80;
const MAX_WIDTH = 1200; // For heroes
const PRODUCT_WIDTH = 800; // For products

// Walk function to get all files
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

async function optimizeImages() {
    console.log('Starting image optimization...');

    // Create backup folder
    // const backupDir = path.join(__dirname, 'assets_backup');
    // if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const files = getAllFiles(ASSETS_DIR);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        const filename = path.basename(file);

        // Skip GIFs (Sharp handles GIFs poorly for simple optimization, usually need ffmpeg)
        // But we can try to resize them or convert them if requested.
        // For hero gifs (21MB), we might need to just warn.
        if (ext === '.gif') {
            console.warn(`⚠️ skipping GIF (manual optimization needed): ${filename} (${(fs.statSync(file).size / 1024 / 1024).toFixed(2)} MB)`);
            continue;
        }

        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

        const originalSize = fs.statSync(file).size;

        // Skip small files (< 200KB)
        if (originalSize < 200 * 1024) continue;

        console.log(`Optimizing: ${filename} (${(originalSize / 1024).toFixed(0)} KB)`);

        try {
            const tempFile = file + '.tmp';
            const width = filename.includes('cake') || filename.includes('product') ? PRODUCT_WIDTH : MAX_WIDTH;

            await sharp(file)
                .resize({ width: width, withoutEnlargement: true })
                .jpeg({ quality: QUALITY, mozjpeg: true }) // Convert everything to JPEG for max compat/size ratio? Or WebP?
            // Let's keep original format if possible, but convert PNG to JPEG if photo?
            // Actually, let's just use .toBuffer and overwrite
            // For PNGs (often transparent), valid to keep PNG but compress
            // For Banner (7MB png), probably no transparency? 

            // Actually, let's just make everything WebP? No, browser support is good but let's stick to optimize in place.

            // Strategy: 
            // 1. Resize to reasonable max width
            // 2. Compress

            let pipeline = sharp(file).resize({ width: width, withoutEnlargement: true });

            if (ext === '.png') {
                pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 8 });
            } else if (ext === '.jpg' || ext === '.jpeg') {
                pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
            }

            await pipeline.toFile(tempFile);

            const newSize = fs.statSync(tempFile).size;

            if (newSize < originalSize) {
                fs.copyFileSync(file, file + '.bak'); // Backup
                fs.renameSync(tempFile, file);
                console.log(`✅ Optimized ${filename}: ${(originalSize / 1024).toFixed(0)} KB -> ${(newSize / 1024).toFixed(0)} KB (${((1 - newSize / originalSize) * 100).toFixed(0)}% savings)`);
            } else {
                console.log(`Skipping ${filename} (optimization didn't check out)`);
                fs.unlinkSync(tempFile);
            }

        } catch (err) {
            console.error(`Error optimizing ${filename}:`, err.message);
        }
    }
}

optimizeImages();
