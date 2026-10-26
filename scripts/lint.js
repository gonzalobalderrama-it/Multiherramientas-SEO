// scripts/lint.js
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

function findJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(findJsFiles(fullPath));
    } else if (item.name.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = findJsFiles('src');
let errors = 0;

for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    console.log(`✓ ${file}`);
  } catch (err) {
    console.error(`✗ Error in ${file}:`, err.message);
    errors++;
  }
}

if (errors > 0) {
  process.exit(1);
} else {
  console.log(`\nSyntax verification passed for all ${files.length} JavaScript files.`);
}
