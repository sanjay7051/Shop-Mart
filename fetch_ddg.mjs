import fs from 'fs';

const search = async (query) => {
  try {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=site:unsplash.com/photos+${query}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const text = await res.text();
    const regex = /unsplash\.com\%2Fphotos\%2F(?:[a-zA-Z0-9\-]+-)?([a-zA-Z0-9]{11})/g;
    const matches = [...text.matchAll(regex)];
    const ids = [...new Set(matches.map(m => m[1]))];
    console.log(`${query} -> https://images.unsplash.com/photo-${ids[0] || 'not found'}?w=800&q=80`);
  } catch (e) {}
};

const run = async () => {
  await search('wireless+charger');
  await search('gopro+camera');
  await search('yoga+mat');
  await search('dumbbells');
  await search('leather+bag');
  await search('oxford+shoes');
};
run();
