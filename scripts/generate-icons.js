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
  
  // Define icon sizes
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  // Generate each icon
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
  
  console.log('All icons generated successfully!');
}

// Run the script
generateIcons().catch(console.error);