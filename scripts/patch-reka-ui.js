#!/usr/bin/env node

/**
 * Patch reka-ui to import toValue from vue instead of @vueuse/core
 * This fixes the error: "does not provide an export named 'toValue'"
 */

const fs = require('fs');
const path = require('path');

// Find reka-ui in node_modules
const rekaUiPath = './woonuxt_base/node_modules/.pnpm/reka-ui@2.6.0_vue@3.5.22/node_modules/reka-ui';

if (!fs.existsSync(rekaUiPath)) {
  console.log('reka-ui not found, skipping patch');
  process.exit(0);
}

const filesToPatch = [
  'dist/shared/useFormControl.js',
  'dist/shared/useFormControl.cjs',
];

let patched = 0;

filesToPatch.forEach(file => {
  const filePath = path.join(rekaUiPath, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Patch the import statement - handle various formats
  const original = content;

  // Pattern 1: import { toValue as toValue$1, unrefElement } from "@vueuse/core";
  content = content.replace(
    /import\s*{\s*toValue\s+as\s+\w+,\s*unrefElement\s*}\s*from\s*["']@vueuse\/core["']/g,
    "import { toValue } from 'vue';\nimport { unrefElement } from '@vueuse/core'"
  );

  // Pattern 2: import { unrefElement, toValue as alias } from "@vueuse/core";
  content = content.replace(
    /import\s*{\s*unrefElement,\s*toValue\s+as\s+\w+\s*}\s*from\s*["']@vueuse\/core["']/g,
    "import { toValue } from 'vue';\nimport { unrefElement } from '@vueuse/core'"
  );

  // Pattern 3: import { toValue, unrefElement } from "@vueuse/core";
  content = content.replace(
    /import\s*{\s*toValue,\s*unrefElement\s*}\s*from\s*["']@vueuse\/core["']/g,
    "import { toValue } from 'vue';\nimport { unrefElement } from '@vueuse/core'"
  );

  // Pattern 4: import { unrefElement, toValue } from "@vueuse/core";
  content = content.replace(
    /import\s*{\s*unrefElement,\s*toValue\s*}\s*from\s*["']@vueuse\/core["']/g,
    "import { toValue } from 'vue';\nimport { unrefElement } from '@vueuse/core'"
  );

  // Also fix the CJS version that uses __vueuse_core
  content = content.replace(
    /__vueuse_core\.toValue/g,
    'vue.toValue'
  );

  // Fix aliased usage: toValue$1 should stay as is (now it will be toValue)
  // But if the import was changed, we need to update the usage too
  content = content.replace(
    /toValue\$1\(/g,
    'toValue('
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Patched: ${file}`);
    patched++;
  }
});

console.log(`Patched ${patched} file(s) in reka-ui`);
