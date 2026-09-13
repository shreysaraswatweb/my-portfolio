import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const srcDir = path.resolve('src/assets');
const outDir = path.resolve('src/assets/webp');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetSizes = {
  'avatar': [{ width: 256, height: 256 }],
  'workstation': [
    { suffix: '', width: 800 },
    { suffix: '-400', width: 400 },
  ],
  'hero-workstation': [{ width: 800 }],
  'project-analytics': [
    { suffix: '', width: 640 },
    { suffix: '-320', width: 320 },
  ],
  'project-finance': [
    { suffix: '', width: 640 },
    { suffix: '-320', width: 320 },
  ],
  'project-kanban': [
    { suffix: '', width: 640 },
    { suffix: '-320', width: 320 },
  ],
  'gallery-geo': [
    { suffix: '', width: 400, height: 400 },
    { suffix: '-200', width: 200, height: 200 },
    { suffix: '-80', width: 80, height: 80 },
  ],
  'gallery-heart': [
    { suffix: '', width: 400, height: 400 },
    { suffix: '-200', width: 200, height: 200 },
  ],
  'gallery-house': [
    { suffix: '', width: 400, height: 400 },
    { suffix: '-200', width: 200, height: 200 },
  ],
  'gallery-portrait': [
    { suffix: '', width: 400, height: 400 },
    { suffix: '-200', width: 200, height: 200 },
  ],
  'gallery-sign': [
    { suffix: '', width: 400, height: 400 },
    { suffix: '-200', width: 200, height: 200 },
  ],
  'gallery-sunset': [
    { suffix: '', width: 400, height: 400 },
    { suffix: '-200', width: 200, height: 200 },
    { suffix: '-80', width: 80, height: 80 },
  ],
  'album-lofi': [
    { suffix: '', width: 400, height: 400 },
    { suffix: '-200', width: 200, height: 200 },
    { suffix: '-80', width: 80, height: 80 },
  ],
};

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'));

console.log(`Converting and scaling ${files.length} images to responsive WebP...`);

for (const file of files) {
  const inputPath = path.join(srcDir, file);
  const baseName = path.basename(file, '.png');
  const inputStats = fs.statSync(inputPath);
  const configs = targetSizes[baseName] || [{ width: 600 }];

  for (const cfg of configs) {
    const suffix = cfg.suffix !== undefined ? cfg.suffix : '';
    const outputPath = path.join(outDir, `${baseName}${suffix}.webp`);

    let pipeline = sharp(inputPath);
    if (cfg.height) {
      pipeline = pipeline.resize(cfg.width, cfg.height, { fit: 'cover' });
    } else {
      pipeline = pipeline.resize(cfg.width, null, { fit: 'inside' });
    }

    await pipeline
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const savings = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(1);
    console.log(`✓ ${baseName}${suffix}.webp: ${(inputStats.size / 1024 / 1024).toFixed(2)}MB -> ${(outputStats.size / 1024).toFixed(1)}KB (${savings}% saved)`);
  }
}

console.log('Conversion and optimization complete!');
