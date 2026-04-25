const https = require('https');

const queries = [
  'wireless+charger+pad', 'smartwatch+apple', 'action+camera+gopro', 'yoga+mat+exercise',
  'dumbbells+gym', 'leather+crossbody+bag+purse', 'formal+oxford+shoes+leather',
  'denim+jacket+clothing', 't-shirt+black+cotton', 'books+stack+reading', 'running+shoes+nike'
];

queries.forEach(q => {
  https.get(`https://html.duckduckgo.com/html/?q=site:unsplash.com+${q}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const regex = /images\.unsplash\.com(?:%2F|\/)photo-[a-zA-Z0-9\-]+/g;
      const matches = data.match(regex);
      if (matches) {
        console.log(`\n--- ${q} ---`);
        console.log([...new Set(matches.map(m => m.replace('%2F', '/')))].slice(0, 3).join('\n'));
      }
    });
  });
});
