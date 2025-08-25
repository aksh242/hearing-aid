import { readFile, writeFile } from 'node:fs/promises';
import { globby } from 'globby';
import strip from 'strip-comments';

async function main() {
  const files = await globby(['.next/**/*.{js,mjs,cjs}'], {
    dot: true,
    absolute: true,
    gitignore: false,
  });

  let changed = 0;
  for (const file of files) {
    try {
      const src = await readFile(file, 'utf8');
      const out = strip(src);
      if (out !== src) {
        await writeFile(file, out, 'utf8');
        changed += 1;
      }
    } catch (err) {
      console.error(`Failed processing ${file}: ${err?.message || err}`);
    }
  }

  console.log(`Processed ${files.length} JS-like files under .next/. Modified ${changed}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
