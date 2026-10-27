import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Local-disk file bytes — used whenever `DATABASE_URI` is not set (see
 * files.ts). One shared directory for uploads and venue documents alike:
 * `storedName` is always a fresh `randomUUID()` + extension, so the two
 * kinds never collide.
 */

const DIR = path.join(process.cwd(), '.data', 'files')

export async function saveFileBytes(storedName: string, bytes: Buffer): Promise<void> {
  await mkdir(DIR, { recursive: true })
  await writeFile(path.join(DIR, storedName), bytes)
}

export async function readFileBytes(storedName: string): Promise<Buffer> {
  return readFile(path.join(DIR, storedName))
}

export async function fileBytesExist(storedName: string): Promise<boolean> {
  try {
    await stat(path.join(DIR, storedName))
    return true
  } catch {
    return false
  }
}
