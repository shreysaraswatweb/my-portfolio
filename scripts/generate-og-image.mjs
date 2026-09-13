import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

async function createOgImage() {
  const width = 1200;
  const height = 630;

  const svgBg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#11131a"/>
          <stop offset="50%" stop-color="#161922"/>
          <stop offset="100%" stop-color="#0e1017"/>
        </linearGradient>
        <radialGradient id="accent" cx="75%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(139, 92, 246, 0.18)"/>
          <stop offset="100%" stop-color="transparent"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#accent)"/>
      <text x="100" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="600" fill="#F5A623" letter-spacing="1.5">HELLO, I'M</text>
      <text x="100" y="300" font-family="system-ui, -apple-system, sans-serif" font-size="64" font-weight="800" fill="#ffffff">Shrey Saraswat</text>
      <text x="100" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="600" fill="#c7d0e7">Frontend Developer — React &amp; Angular</text>
      <text x="100" y="425" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#8e9bb5">Product-UI engineer with ~4.5 years of experience across fintech &amp; enterprise domains.</text>
      <rect x="100" y="480" width="150" height="42" rx="21" fill="#F5A623"/>
      <text x="175" y="507" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#12141C" text-anchor="middle">View Portfolio</text>
      <rect x="270" y="480" width="130" height="42" rx="21" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <text x="335" y="507" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#ffffff" text-anchor="middle">Projects</text>
    </svg>
  `);

  const avatarBuf = await sharp('src/assets/webp/avatar.webp')
    .resize(320, 320)
    .composite([{
      input: Buffer.from(`
        <svg width="320" height="320">
          <rect width="320" height="320" rx="36" fill="#fff"/>
        </svg>
      `),
      blend: 'dest-in'
    }])
    .toBuffer();

  await sharp(svgBg)
    .composite([
      { input: avatarBuf, top: 155, left: 780 }
    ])
    .png()
    .toFile('public/og-image.png');

  console.log('✓ public/og-image.png generated successfully!');
}

createOgImage().catch(console.error);
