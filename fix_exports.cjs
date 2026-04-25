const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
}

const files = walkSync('./src').filter(f => f.endsWith('.jsx') || f.endsWith('.js'));

files.forEach(file => {
  if (file.includes('src/pages/') || file.includes('src/components/')) {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /^export const ([A-Z][a-zA-Z0-9_]*) =/m;
    const match = content.match(regex);
    if (match) {
      const componentName = match[1];
      content = content.replace(regex, `const ${componentName} =`);
      if (!content.includes('export default ')) {
        content += `\nexport default ${componentName};\n`;
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated export in ${file}`);
      }
    }
  }
});

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const importRegex = /import\s+\{\s*([A-Z][a-zA-Z0-9_]*)\s*\}\s+from\s+['"]([^'"]+)['"]/g;

  content = content.replace(importRegex, (match, componentName, importPath) => {
    if (importPath.includes('pages/') || importPath.includes('components/') || importPath.startsWith('.') || importPath.startsWith('..')) {
      if (componentName !== 'AppProvider' && componentName !== 'useApp' && !importPath.includes('context')) {
        changed = true;
        return `import ${componentName} from '${importPath}'`;
      }
    }
    return match;
  });

  const multiImportRegex = /import\s+\{\s*([A-Z][a-zA-Z0-9_]*)\s*,\s*([A-Z][a-zA-Z0-9_]*)\s*\}\s+from\s+['"]([^'"]+)['"]/g;
  content = content.replace(multiImportRegex, (match, d1, d2, importPath) => {
    if (importPath.includes('pages/') || importPath.includes('components/') || importPath.startsWith('.') || importPath.startsWith('..')) {
      console.warn(`Need manual fix for multi-import in ${file}: ${match}`);
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated imports in ${file}`);
  }
});
