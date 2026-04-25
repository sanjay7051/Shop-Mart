const run = async () => {
  const res = await fetch('https://picsum.photos/v2/list?page=1&limit=100');
  const data = await res.json();
  const res2 = await fetch('https://picsum.photos/v2/list?page=2&limit=100');
  const data2 = await res2.json();
  const all = [...data, ...data2];
  all.forEach(img => {
      // url format: https://unsplash.com/photos/gKXKBY-C-Dk -> ID is gKXKBY-C-Dk
      const url = img.url;
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      console.log(`picsum_id: ${img.id}, unsplash_id: ${id}, author: ${img.author}`);
  });
};
run();
