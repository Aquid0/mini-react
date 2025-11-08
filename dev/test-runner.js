import { glob } from 'glob';
import { pathToFileURL } from 'url';

global.describe = (name, fn) => {
  console.log(`\n${name}`);
  fn();
};

global.test = (name, fn) => {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    ${error.message}`);
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
  }
});

const testFiles = await glob('tests/*.test.ts');
for (const file of testFiles) {
  await import(pathToFileURL(file).href);
}