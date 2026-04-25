const https = require('https');
const queries = ['headphones', 'smartwatch', 'denim jacket', 't-shirt', 'book cover', 'atomic habits book', 'running shoes', 'sneakers', 'gopro', 'yoga mat', 'dumbbells', 'leather purse', 'wireless charger', 'oxford shoes'];
const results = {};

let completed = 0;
queries.forEach(q => {
  https.get('https://unsplash.com/napi/search/photos?query=' + encodeURIComponent(q) + '&per_page=1', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        if (res.statusCode === 200) {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            results[q] = json.results[0].urls.raw + '&w=800&q=80';
          }
        } else {
          console.error(`Failed ${q}: ${res.statusCode}`);
        }
      } catch (e) { console.error(e.message) }
      completed++;
      if (completed === queries.length) console.log(JSON.stringify(results, null, 2));
    });
  });
});
