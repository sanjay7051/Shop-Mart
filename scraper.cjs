const https = require('https');

const search = (query) => {
  https.get(`https://unsplash.com/s/photos/${query}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+/g;
      const matches = data.match(regex);
      if (matches) {
        console.log(`\n--- ${query} ---`);
        console.log([...new Set(matches)].slice(0, 3).join('\n'));
      }
    });
  });
};

['wireless-charger', 'smartwatch', 'action-camera', 'yoga-mat', 'dumbbell', 'leather-crossbody-bag', 'formal-oxford-shoes'].forEach(search);
