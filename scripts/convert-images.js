import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesDir = path.join(__dirname, '..', 'public', 'images');
const srcImagesDir = path.join(__dirname, '..', 'src', 'images');

// Quality settings for different image types
const QUALITY_SETTINGS = {
  webp: { quality: 80 },
  avif: { quality: 75 },
  jpeg: { quality: 85 }
};

// Responsive breakpoints
const RESPONSIVE_SIZES = [
  { suffix: '', width: null }, // Original size
  { suffix: '@2x', width: null }, // 2x for retina
  { suffix: '_sm', width: 400 },
  { suffix: '_md', width: 800 },
  { suffix: '_lg', width: 1200 }
];

async function processImage(inputPath, outputDir, filename) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalWidth = metadata.width;
    const originalHeight = metadata.height;
    
    console.log(`Processing: ${filename} (${originalWidth}x${originalHeight})`);
    
    const name = path.parse(filename).name;
    const formats = ['webp', 'avif'];
    
    for (const format of formats) {
      for (const size of RESPONSIVE_SIZES) {
        let targetWidth = size.width;
        
        // Handle @2x versions
        if (size.suffix === '@2x') {
          targetWidth = originalWidth; // Keep original for @2x
        } else if (size.suffix === '' && size.width === null) {
          // Optimize original size but don't exceed reasonable limits
          targetWidth = Math.min(originalWidth, 1920);
        }
        
        const outputFilename = `${name}${size.suffix}.${format}`;
        const outputPath = path.join(outputDir, outputFilename);
        
        let processor = image.clone();
        
        if (targetWidth && targetWidth < originalWidth) {
          processor = processor.resize(targetWidth, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });
        }
        
        if (format === 'webp') {
          processor = processor.webp(QUALITY_SETTINGS.webp);
        } else if (format === 'avif') {
          processor = processor.avif(QUALITY_SETTINGS.avif);
        }
        
        await processor.toFile(outputPath);
        console.log(`  → ${outputFilename}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
}

async function processDirectory(inputDir, outputBaseDir = null) {
  try {
    const items = await fs.readdir(inputDir, { withFileTypes: true });
    
    for (const item of items) {
      const inputPath = path.join(inputDir, item.name);
      
      if (item.isDirectory()) {
        // Create corresponding output directory
        const outputDir = outputBaseDir 
          ? path.join(outputBaseDir, item.name)
          : path.join(inputDir, item.name);
          
        await fs.mkdir(outputDir, { recursive: true });
        await processDirectory(inputPath, outputDir);
      } else if (item.isFile() && /\.(jpg|jpeg|png)$/i.test(item.name)) {
        const outputDir = outputBaseDir || inputDir;
        await processImage(inputPath, outputDir, item.name);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${inputDir}:`, error);
  }
}

async function main() {
  console.log('🖼️  Converting images to modern formats...\n');
  
  // Process public images
  if (await fs.access(publicImagesDir).then(() => true).catch(() => false)) {
    console.log('Processing public/images/...');
    await processDirectory(publicImagesDir);
  }
  
  // Process src images
  if (await fs.access(srcImagesDir).then(() => true).catch(() => false)) {
    console.log('\nProcessing src/images/...');
    await processDirectory(srcImagesDir);
  }
  
  console.log('\n✅ Image conversion complete!');
  console.log('\nNext steps:');
  console.log('1. Update your components to use the new WebP/AVIF images');
  console.log('2. Consider removing old JPG/PNG files if no longer needed');
  console.log('3. Test the website to ensure all images load correctly');
}

main().catch(console.error);