import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { layout } from './src/templates/layout.js'
import { homePage } from './src/templates/pages/home.js'
import { aboutPage } from './src/templates/pages/about.js'
import { facilitiesListPage, facilityDetailPage } from './src/templates/pages/facilities.js'
import { equipmentListPage, equipmentDetailPage } from './src/templates/pages/equipment.js'
import { venuesListPage, venueDetailPage } from './src/templates/pages/venues.js'
import { promoters } from './src/content/site.js'
import { primaryFacilities, getFacility } from './src/content/facilities.js'
import { getEquipment } from './src/content/equipment.js'
import { getVenue } from './src/content/venues.js'

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

app.get('/facilities', (_req, res) => {
  res.send(
    layout({
      title: 'Facilities — Testing, Machining and Prototyping in Pune',
      description:
        'Environmental testing, NABL-accredited rubber and polymer testing, VMC machining, rapid prototyping, metrology, design, skill development and incubation at Auto Cluster, Chinchwad.',
      body: facilitiesListPage({ primaryFacilities }),
    }).toString(),
  )
})

app.get('/facilities/:slug', (req, res) => {
  const facility = getFacility(req.params.slug)
  if (!facility) return res.status(404).send('Not found')
  res.send(
    layout({
      title: `${facility.name} in Pune`,
      description: facility.summary,
      body: facilityDetailPage(facility),
    }).toString(),
  )
})

app.get('/equipment', (req, res) => {
  res.send(
    layout({
      title: 'Equipment Catalogue — 30 Machines with Full Specifications',
      description:
        'Every machine at Auto Cluster Pune: VMC machining centres, 3D printers, environmental chambers, and NABL-accredited rubber and polymer test instruments.',
      body: equipmentListPage({ activeCategory: req.query.category }),
    }).toString(),
  )
})

app.get('/equipment/:slug', (req, res) => {
  const item = getEquipment(req.params.slug)
  if (!item) return res.status(404).send('Not found')
  const makeModel = [item.make, item.model].filter(Boolean).join(' ')
  res.send(
    layout({
      title: `${item.name}${makeModel ? ` — ${makeModel}` : ''}`,
      description: item.summary,
      body: equipmentDetailPage(item),
    }).toString(),
  )
})

app.get('/venues', (_req, res) => {
  res.send(
    layout({
      title: 'Venues — Exhibition Halls, Auditorium and Training Rooms in Pune',
      description:
        '4,000 sq m of exhibition space across two air-conditioned halls and an open display area, a 172-seat auditorium, and a 30-workstation CAD/CAM training centre in Chinchwad, Pune.',
      body: venuesListPage(),
    }).toString(),
  )
})

app.get('/venues/:slug', (req, res) => {
  const venue = getVenue(req.params.slug)
  if (!venue) return res.status(404).send('Not found')
  res.send(
    layout({
      title: `${venue.name} on Rent in Pimpri Chinchwad`,
      description: venue.summary,
      body: venueDetailPage(venue),
    }).toString(),
  )
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Phase 1 scaffold running at http://localhost:${port}`)
})
