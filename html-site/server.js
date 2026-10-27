import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { layout } from './src/templates/layout.js'
import { homePage } from './src/templates/pages/home.js'
import { aboutPage } from './src/templates/pages/about.js'
import { promoters } from './src/content/site.js'

/**
 * Plain Node/Express server — Phase 1 of the Next.js -> HTML/CSS/JS
 * migration (see README.md in this directory). Replaces Next's App Router:
 * each route below renders a page template (plain functions returning HTML
 * strings, see src/templates/) through the shared layout(), the same way
 * every Next page used to render through src/app/(site)/layout.tsx.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Images/logos stay in the original Next.js app's public/ folder — reused
// directly rather than duplicated, since they're identical static assets.
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (_req, res) => {
  res.send(
    layout({
      title: null,
      description:
        'NABL ISO/IEC 17025:2017 accredited testing, VMC machining, 3D printing and exhibition facilities for MSMEs in Chinchwad, Pune.',
      body: homePage({ promoters }),
    }).toString(),
  )
})

app.get('/about', (_req, res) => {
  res.send(
    layout({
      title: 'About',
      description: 'About Auto Cluster Development and Research Institute, Chinchwad, Pune.',
      body: aboutPage(),
    }).toString(),
  )
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Phase 1 scaffold running at http://localhost:${port}`)
})
