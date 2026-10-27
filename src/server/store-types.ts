/** Shared by both store backends (store-file.ts, store-postgres.ts) and their dispatcher (store.ts). */
export interface Stamped {
  id: string
  createdAt: string
  updatedAt: string
}
