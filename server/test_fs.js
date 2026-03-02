const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
console.log('Testing read of:', envPath);

try {
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('Success! File length:', content.length);
  console.log('First 20 chars:', content.substring(0, 20));
} catch (err) {
  console.error('Error reading file:', err);
}
