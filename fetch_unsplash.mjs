const search = async (query) => {
  try {
    const res = await fetch(`https://unsplash.com/napi/search/photos?query=${query}&per_page=1`, {
      headers: {
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
         'Accept': 'application/json'
      }
    });
    const data = await res.json();
    if(data.results && data.results.length > 0) {
       console.log(`${query} -> ${data.results[0].urls.raw}&w=800&q=80`);
    } else {
       console.log(`${query} -> no results`);
    }
  } catch (e) {
    console.error(`Failed ${query}: ${e.message}`);
  }
};

const run = async () => {
  await search('wireless-charger');
  await search('action-camera');
  await search('yoga-mat');
  await search('dumbbells');
  await search('leather-bag');
  await search('oxford-shoes');
  await search('denim-jacket');
  await search('smartwatch');
}
run();
