import fs from 'node:fs';

const lines = fs.readFileSync('C:\\Users\\Shrey\\.gemini\\antigravity-ide\\brain\\f0717f61-1ae6-48d4-b0ff-8e6f54a3a88b\\.system_generated\\logs\\transcript.jsonl', 'utf8').split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  if (!lines[i]) continue;
  try {
    const d = JSON.parse(lines[i]);
    if (d.type === 'USER_INPUT' && d.content && d.content.includes('lighthouseVersion')) {
      console.log('Found message of length:', d.content.length);
      const re = /"id":\s*"([^"]+)"[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"score":\s*([0-9.]+|null)/g;
      let match;
      while ((match = re.exec(d.content)) !== null) {
        if (match[3] !== 'null' && Number(match[3]) < 0.9) {
          console.log(`LOW: ${match[1]} | ${match[2]} | score: ${match[3]}`);
        }
      }
      break;
    }
  } catch (e) {}
}
