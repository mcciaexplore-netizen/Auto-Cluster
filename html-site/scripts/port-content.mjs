#!/usr/bin/env node
/**
 * One-time (re-runnable) content port: compiles the Next.js app's
 * src/content/*.ts data modules into plain JS under html-site/src/content/.
 *
 * These files are pure data (equipment specs, facility test methods, venue
 * specs, rates, image refs) with type-only imports from @/lib/types — no
 * React anywhere in them — so compiling with the TypeScript compiler
 * (type erasure only) is a faithful, zero-transcription-risk port. Hand-
 * retyping ~2,500 lines of specs/test-methods data would risk silent
 * mistakes a compiler pass can't make.
 *
 * The ONE real runtime cross-import among these files (images.ts imports
 * `categories` from equipment.ts) is rewritten below; everything else is a
 * straight compile.
 *
 * Re-run this whenever the source .ts content changes (it's still the
 * single source of truth — see the Next.js app's src/content/).
 */
import ts from 'typescript'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC_CONTENT = path.resolve(__dirname, '../../src/content')
const OUT_CONTENT = path.resolve(__dirname, '../src/content')

const FILES = ['equipment', 'facilities', 'venues', 'services', 'rates', 'images', 'life']

mkdirSync(OUT_CONTENT, { recursive: true })

for (const name of FILES) {
  const source = readFileSync(path.join(SRC_CONTENT, `${name}.ts`), 'utf-8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
  })

  // The one real runtime cross-import: images.ts's `@/content/equipment`.
  const rewritten = outputText.replace(/from ['"]@\/content\/(\w+)['"]/g, "from './$1.js'")

  writeFileSync(path.join(OUT_CONTENT, `${name}.js`), rewritten)
  console.log(`ported ${name}.ts -> ${name}.js`)
}
