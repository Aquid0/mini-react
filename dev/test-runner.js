import { glob } from 'glob';
import { pathToFileURL } from 'url';

global.describe = (name, fn) => {
  console.log(`\n\x1b[36m${name}\x1b[0m`);
  fn();
};

global.test = (name, fn) => {
  try {
    fn();
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } catch (error) {
    console.log(`  \x1b[31m✗\x1b[0m ${name}`);
    console.log(`    \x1b[31m${error.message}\x1b[0m`);
  }
};

global.expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`);
  },
  toEqual: (expected) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  },
  toBeNull: () => {
    if (actual !== null) throw new Error(`Expected null, got ${actual}`);
  }
});

const testFiles = await glob('tests/*.test.ts');
for (const file of testFiles) {
  await import(pathToFileURL(file).href);
}