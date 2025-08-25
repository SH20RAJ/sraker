import sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';

// Create icons directory if it doesn't exist
async function createIconsDirectory() {
  const iconsDir = join(process.cwd(), 'public', 'icons');
  try {
    await fs.access(iconsDir);
  } catch (error) {
    await fs.mkdir(iconsDir, { recursive: true });
 }
}

// Generate icons of different sizes
async function generateIcons() {
  await createIconsDirectory();
  
  const inputPath = join(process.cwd(), 'public', 'next.svg');
  const outputPath = join(process.cwd(), 'public', 'icons');
  const publicPath = join(process.cwd(), 'public');
  
  // Define icon sizes for the manifest
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  // Generate each icon for the manifest
  for (const size of sizes) {
    try {
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(join(outputPath, `icon-${size}x${size}.png`));
      console.log(`Generated icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`Error generating icon-${size}x${size}.png:`, error);
    }
  }
  
  // Generate favicon PNG files of different sizes
  try {
    const faviconSizes = [16, 32, 48];
    
    for (const size of faviconSizes) {
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(join(publicPath, `favicon-${size}x${size}.png`));
    }
    
    // Also create a 32x32 favicon.ico file (most browsers will accept a PNG with .ico extension)
    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toFile(join(publicPath, 'favicon.ico'));
      
    console.log('Generated favicon files');
  } catch (error) {
    console.error('Error generating favicon files:', error);
  }
  
  console.log('All icons generated successfully!');
}

// Run the script
generateIcons().catch(console.error);