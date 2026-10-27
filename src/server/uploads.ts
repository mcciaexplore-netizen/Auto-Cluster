import { randomBytes, randomUUID } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { findOne, insert, type Stamped } from './store'

/**
 * Enquiry attachments — CAD files and drawings, or a résumé on the careers
 * form. "Stored securely, not publicly accessible by guessing a link" rules
 * out `public/`, which Next
 * serves to anyone who has the path. Files instead live outside the web
 * root, in `.data/uploads/`, and the only way to one is `/api/files/[token]`
 * (see that route) presenting the random token issued at upload time — not
 * the record's own id, so a leaked enquiry id in a log or URL doesn't also
 * leak the file.
 */

const UPLOAD_DIR = path.join(process.cwd(), '.data', 'uploads')
const MAX_SIZE = 25 * 1024 * 1024 // 25MB — a STEP assembly or a scanned drawing set

const ALLOWED_EXTENSIONS = new Set([
  '.pdf',
  '.dwg',
  '.dxf',
  '.step',
  '.stp',
  '.iges',
  '.igs',
  '.zip',
  '.png',
  '.jpg',
  '.jpeg',
  // .doc/.docx: résumés, not CAD — added for the careers application form.
  '.doc',
  '.docx',
])

export interface UploadRecord extends Stamped {
  token: string
  storedName: string
  originalName: string
  mimeType: string
  size: number
}

export class UploadRejected extends Error {}

function safeExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new UploadRejected(
      `${ext || 'files with no extension'} are not accepted. Allowed: ${[...ALLOWED_EXTENSIONS].join(', ')}.`,
    )
  }
  return ext
}

export async function saveUpload(file: File): Promise<UploadRecord> {
  if (file.size === 0) throw new UploadRejected('The file is empty.')
  if (file.size > MAX_SIZE) throw new UploadRejected(`File exceeds the ${MAX_SIZE / 1024 / 1024}MB limit.`)

  const ext = safeExtension(file.name)
  const token = randomBytes(24).toString('base64url')
  const storedName = `${randomUUID()}${ext}`

  await mkdir(UPLOAD_DIR, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOAD_DIR, storedName), buffer)

  return insert<UploadRecord>('uploads', {
    token,
    storedName,
    originalName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
  })
}

export async function getUploadByToken(token: string): Promise<UploadRecord | undefined> {
  return findOne<UploadRecord>('uploads', (r) => r.token === token)
}

export async function readUploadFile(record: UploadRecord): Promise<Buffer> {
  return readFile(path.join(UPLOAD_DIR, record.storedName))
}

export async function uploadFileExists(record: UploadRecord): Promise<boolean> {
  try {
    await stat(path.join(UPLOAD_DIR, record.storedName))
    return true
  } catch {
    return false
  }
}
