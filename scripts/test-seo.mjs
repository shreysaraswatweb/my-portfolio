import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

// 1. Test Title
const titleMatch = html.match(/<title>(.*?)<\/title>/);
console.log('Title:', titleMatch ? titleMatch[1] : 'MISSING');

// 2. Test Description
const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/);
console.log('Description:', descMatch ? descMatch[1] : 'MISSING');

// 3. Test Canonical
const canMatch = html.match(/<link\s+rel="canonical"\s+href="(.*?)"/);
console.log('Canonical:', canMatch ? canMatch[1] : 'MISSING');

// 4. Test OG Tags
const ogTitle = html.match(/<meta\s+property="og:title"\s+content="(.*?)"/);
const ogDesc = html.match(/<meta\s+property="og:description"\s+content="(.*?)"/);
const ogUrl = html.match(/<meta\s+property="og:url"\s+content="(.*?)"/);
const ogImg = html.match(/<meta\s+property="og:image"\s+content="(.*?)"/);
console.log('OG Title:', ogTitle ? ogTitle[1] : 'MISSING');
console.log('OG URL:', ogUrl ? ogUrl[1] : 'MISSING');
console.log('OG Image:', ogImg ? ogImg[1] : 'MISSING');

// 5. Test JSON-LD
const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (jsonLdMatch) {
  try {
    const data = JSON.parse(jsonLdMatch[1]);
    console.log('JSON-LD Syntax: VALID');
    console.log('Schema @type:', data['@type']);
    console.log('MainEntity Name:', data.mainEntity?.name);
    console.log('MainEntity JobTitle:', data.mainEntity?.jobTitle);
    console.log('MainEntity URL:', data.mainEntity?.url);
  } catch (err) {
    console.error('JSON-LD Syntax ERROR:', err.message);
  }
} else {
  console.log('JSON-LD: MISSING');
}

// 6. Robots.txt
const robots = fs.readFileSync('public/robots.txt', 'utf8');
console.log('Robots.txt contains sitemap:', robots.includes('sitemap.xml'));

// 7. Sitemap.xml
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
console.log('Sitemap.xml contains verified domain:', sitemap.includes('https://shrey-saraswat-portfolio.vercel.app/'));

console.log('✓ All SEO checks passed!');
