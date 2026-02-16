const fs = require('fs-extra');
const path = require('path');
const exifParser = require('exif-parser');
const heicConvert = require('heic-convert');

const imagesDir = path.join(__dirname, '../public/images');
const convertedDir = path.join(__dirname, '../public/images/converted'); // separate folder for converted
const outputFile = path.join(__dirname, '../src/data.json');

// Regex patterns for filename dates
const datePatterns = [
    /(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/, // YYYYMMDD_HHMMSS (e.g. 20230621_171721)
    /(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/, // IMG_YYYYMMDD_HHMMSS
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
];

async function parseDateFromFilename(filename) {
    for (const pattern of datePatterns) {
        const match = filename.match(pattern);
        if (match) {
            // Note: months are 0-indexed in JS Date
            return new Date(match[1], match[2] - 1, match[3], match[4] || 12, match[5] || 0, match[6] || 0);
        }
    }
    return null;
}

async function processImage(file) {
    const filePath = path.join(imagesDir, file);
    const ext = path.extname(file).toLowerCase();
    let finalSrc = `public/images/${file}`;
    let date = null;

    try {
        // 1. Try Filename First (often more reliable for organized backups)
        date = await parseDateFromFilename(file);

        // 2. Format Handling (Convert HEIC)
        if (ext === '.heic') {
            const inputBuffer = await fs.readFile(filePath);
            const outputBuffer = await heicConvert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 0.8
            });
            const newFilename = file.replace(/\.heic$/i, '.jpg');
            const newPath = path.join(convertedDir, newFilename);
            await fs.ensureDir(convertedDir);
            await fs.writeFile(newPath, outputBuffer);
            finalSrc = `public/images/converted/${newFilename}`;

            // Should valid metadata be in HEIC? generic exif-parser might not read HEIC blob well without conversion
            // But we already parsed filename. 
        } else {
            // For JPEGs, try EXIF if filename didn't work
            if (!date) {
                const buffer = await fs.readFile(filePath);
                const parser = exifParser.create(buffer);
                const result = parser.parse();
                if (result.tags.DateTimeOriginal) {
                    date = new Date(result.tags.DateTimeOriginal * 1000);
                }
            }
        }

        // 3. Fallback
        if (!date) {
            const stats = await fs.stat(filePath);
            date = stats.mtime;
        }

        return {
            src: finalSrc,
            date: date,
            caption: '' // Will be filled by caption script later or preserved if we merged. 
            // For now, let's just generate clean. The user will re-run caption script.
        };

    } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
        return null; // Skip bad files
    }
}

async function generate() {
    try {
        await fs.ensureDir(path.dirname(outputFile));
        await fs.ensureDir(convertedDir);

        const files = await fs.readdir(imagesDir);
        // exclude already converted ones if running multiple times, checking root imagesDir
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|heic)$/i.test(file));

        const timelineData = [];

        console.log(`Processing ${imageFiles.length} images... this may take a moment for HEIC conversion.`);

        for (const file of imageFiles) {
            const data = await processImage(file);
            if (data) {
                timelineData.push(data);
            }
        }

        // Sort by date (Oldest to Newest)
        timelineData.sort((a, b) => new Date(a.date) - new Date(b.date));

        await fs.writeJson(outputFile, timelineData, { spaces: 2 });
        console.log(`Generated timeline with ${timelineData.length} images.`);

    } catch (err) {
        console.error(err);
    }
}

generate();
