const fs = require('fs');

const fixFile = (p, from, to) => {
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(from, to);
  fs.writeFileSync(p, content);
}

fixFile('src/pages/admin/AdminProducts.jsx', 'export { AdminProducts };', 'export default AdminProducts;');
console.log('Fixed AdminProducts');
