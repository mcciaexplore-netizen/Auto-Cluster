import type { EquipmentCategory, ImageRef } from '@/lib/types'
import type { ExpoType } from '@/content/venues'

/**
 * The image manifest.
 *
 * Every asset lives in `public/images/` and is referenced from here rather
 * than from a component, so a swap to Payload media later changes one module.
 *
 * Three rules were applied when the library was installed, and they are worth
 * keeping when new assets arrive:
 *
 * 1. **Nothing generic ships.** The source library contained licensed stock —
 *    a western startup team standing at a whiteboard captioned as our
 *    Incubation Centre, a conference audience captioned as Life at Auto
 *    Cluster, a laptop-and-coffee flatlay for the Knowledge Centre. None of it
 *    depicts ACDRI and all of it was dropped. See DESIGN_DIRECTION.md §5.
 * 2. **Nothing depicts a machine we do not own.** The library carried vendor
 *    renders of a Mazak VARIAXIS i-700 and a UnionTech Lite 600. Our five-axis
 *    VMC is a Rambaudi and neither machine is in the catalogue, so both were
 *    dropped rather than shown as ours.
 * 3. **Low-resolution 2020-era assets carry `needsPhotography`.** They render
 *    with a visible flag instead of being upscaled — see `Figure`.
 *
 * Filenames in the source library are unreliable and were checked against the
 * pixels: two files named `*-Infographic.*` are machine photographs, and one
 * named `Committee-Photo.jpg` is a single unidentified portrait (withheld
 * under CQ-08, which records that the live site pairs at least one photograph
 * with the wrong name).
 */

/* ------------------------------------------------------------------------ */
/* Venues                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * One establishing photograph per venue, keyed by venue slug.
 *
 * 590×440 originals — large enough for a card or a page figure, not for a
 * full-bleed hero, which is why no venue hero uses one.
 */
export const venuePhotos: Record<string, ImageRef> = {
  'exhibition-centre': {
    src: '/images/venues/exhibition-centre.png',
    alt: 'Exhibition hall from the balcony during a trade show, with two rows of stands and visitors in the central aisle',
    width: 590,
    height: 440,
    needsPhotography: true,
  },
  auditorium: {
    src: '/images/venues/auditorium.png',
    alt: 'The auditorium seen from the stage, with banked rows of green upholstered seats and acoustic wall panels',
    width: 590,
    height: 440,
    needsPhotography: true,
  },
  'training-seminar-hall': {
    src: '/images/venues/training-seminar-hall.png',
    alt: 'The training centre, with rows of desks in facing pairs, each carrying a monitor and keyboard',
    width: 590,
    height: 440,
    needsPhotography: true,
  },
}

/**
 * Category art for the twelve expo types on the Exhibition Centre page.
 *
 * These are stock illustrations of each *category*, not photographs of this
 * venue — a dental surgery stands for the Dental Expo. They are decorative:
 * the category name sits beside every one of them as text, so each carries an
 * empty alt and adds nothing for a screen reader to repeat.
 *
 * The pairing is the live site's own, read back out of the DOM of
 * autoclusterpune.org/exhibition-centre/ rather than inferred from the
 * filenames, which are sequence numbers in scrape order and do not follow the
 * order of `expoTypes`.
 */
export const expoTiles: Record<ExpoType, ImageRef> = {
  'Engineering Expo': { src: '/images/venues/expo/engineering.png', alt: '', width: 410, height: 275 },
  'Auto Ancillary Expo': { src: '/images/venues/expo/auto-ancillary.png', alt: '', width: 410, height: 275 },
  'Automotive Engineering Expo': { src: '/images/venues/expo/automotive-engineering.png', alt: '', width: 410, height: 275 },
  'Water Expo': { src: '/images/venues/expo/water.png', alt: '', width: 410, height: 275 },
  'Plasto Expo': { src: '/images/venues/expo/plasto.png', alt: '', width: 410, height: 275 },
  'Renewable Energy Expo': { src: '/images/venues/expo/renewable-energy.png', alt: '', width: 410, height: 275 },
  'Rubber, Die and Mould Expo': { src: '/images/venues/expo/rubber-die-and-mould.png', alt: '', width: 410, height: 275 },
  'Consumer Expo': { src: '/images/venues/expo/consumer.png', alt: '', width: 410, height: 275 },
  'Dental Expo': { src: '/images/venues/expo/dental.png', alt: '', width: 410, height: 275 },
  'Education Expo': { src: '/images/venues/expo/education.png', alt: '', width: 410, height: 275 },
  'Property Expo': { src: '/images/venues/expo/property.png', alt: '', width: 410, height: 275 },
  'Jewellery Expo': { src: '/images/venues/expo/jewellery.png', alt: '', width: 410, height: 275 },
}

/**
 * `Venue.expoTypes` is a plain `string[]` — `Venue` lives in lib/types, which
 * cannot import `ExpoType` from this side without a cycle. So the lookup is a
 * function that widens the key and hands back `undefined` for a category with
 * no tile, rather than an index that would not compile at the call site.
 */
export function expoTile(name: string): ImageRef | undefined {
  return expoTiles[name as ExpoType]
}

/* ------------------------------------------------------------------------ */
/* Facilities                                                                */
/* ------------------------------------------------------------------------ */

/**
 * Facility figures, keyed by facility slug.
 *
 * The team photographs are the only recent, full-resolution assets in the
 * library — shot on the same morning against the entrance canopy, which is
 * why they sit together well. They carry no `needsPhotography`.
 *
 * Nobody is named. Designations do not exist for any team member on the
 * current site (CQ-11) and naming a face without one would invent a caption.
 */
export const facilityPhotos: Record<string, ImageRef[]> = {
  'prototype-production-facility': [
    {
      src: '/images/facilities/prototype-production-team.jpeg',
      alt: 'The Prototype Production team, eleven people, outside the Auto Cluster entrance',
      width: 936,
      height: 1280,
    },
  ],
  'rapid-prototyping': [
    {
      src: '/images/facilities/rapid-prototyping-team.jpeg',
      alt: 'The Rapid Prototyping team, ten people, outside the Auto Cluster entrance',
      width: 1600,
      height: 1505,
    },
  ],
  'environmental-testing': [
    {
      src: '/images/facilities/environmental-testing-team.jpeg',
      alt: 'The Environmental Testing team, five people, outside the Auto Cluster entrance',
      width: 1181,
      height: 1126,
    },
  ],
  'rubber-polymer-testing': [
    {
      src: '/images/facilities/rubber-polymer-team.jpeg',
      alt: 'The Rubber and Polymer Testing team, ten people, outside the Auto Cluster entrance',
      width: 1600,
      height: 1455,
    },
    {
      // Filed in the source library as an infographic; it is a photograph of
      // an FIE UNITER 9450 test frame on the laboratory floor. The frame is
      // not in the equipment catalogue, so it is shown here as a facility
      // photograph rather than given a machine record.
      src: '/images/facilities/rubber-polymer-utm.jpg',
      alt: 'An FIE UNITER 9450 universal testing frame and its control cabinet in the rubber and polymer laboratory',
      width: 522,
      height: 569,
      needsPhotography: true,
    },
  ],
  'large-bed-cmm-services': [
    {
      src: '/images/facilities/large-bed-cmm.jpg',
      alt: 'Two co-ordinate measuring machines on granite tables in the temperature-controlled metrology room',
      width: 1900,
      height: 700,
    },
  ],
  'design-centre': [
    {
      src: '/images/facilities/design-centre.jpg',
      alt: 'The design centre, with CAD workstations in facing pairs along the window wall',
      width: 1900,
      height: 700,
    },
  ],
  'incubation-centre': [
    {
      src: '/images/facilities/incubation-centre-team.jpeg',
      alt: 'The Incubation Centre team, three people, outside the Auto Cluster entrance',
      width: 720,
      height: 1280,
    },
  ],
}

/**
 * Service tiles for the facility cards, keyed by equipment category.
 *
 * Shop-floor and laboratory photographs rather than icons, cropped 13:8 by the
 * source. All 520×320 and all 2020-era, so all flagged.
 */
export const serviceTiles: Record<EquipmentCategory, ImageRef> = {
  prototype: {
    src: '/images/home/service-prototype.png',
    alt: 'Two Hartford vertical machining centres on the shop floor with a tooling trolley between them',
    width: 520,
    height: 320,
    needsPhotography: true,
  },
  'rapid-prototyping': {
    src: '/images/home/service-rapid-prototyping.png',
    alt: 'The SLS machine and its control station, with sintered parts on the rack behind',
    width: 520,
    height: 320,
    needsPhotography: true,
  },
  environmental: {
    src: '/images/home/service-environmental-testing.png',
    alt: 'A row of environmental test chambers along the length of the testing hall',
    width: 520,
    height: 320,
    needsPhotography: true,
  },
  'rubber-polymer': {
    src: '/images/home/service-rubber-polymer.png',
    alt: 'The rubber and polymer laboratory, with test frames and benches down both sides of the room',
    width: 520,
    height: 320,
    needsPhotography: true,
  },
  metrology: {
    src: '/images/home/service-metrology.png',
    alt: 'A benchtop measuring instrument and rotary table in the metrology room',
    width: 520,
    height: 320,
    needsPhotography: true,
  },
}

/* ------------------------------------------------------------------------ */
/* Home                                                                      */
/* ------------------------------------------------------------------------ */

/**
 * The hero's collage: Shaniwar Wada's gate, a sugarcane field on the
 * Chinchwad–Talegaon–Chakan belt, a machining close-up and the shop floor —
 * Pune's civic identity and the region's agricultural base faceted together
 * with the manufacturing the institute actually does.
 *
 * The source came in as a flat rectangle — a near-white background close to
 * but not exactly `--color-paper-2`, so it sat on the hero band as a
 * faintly visible box rather than blending into it. Background removed here
 * (a border-connected-component cut, not a naive colour threshold, so the
 * pale sky inside the fort and field photos was not mistaken for the pale
 * background around them) and re-saved with real alpha.
 */
export const heroCollage: ImageRef = {
  src: '/images/home/hero-collage.png',
  alt: 'A faceted collage: Shaniwar Wada’s fortified gate, a tractor hauling sugarcane through a field, a CNC machine cutting metal, and a shop floor of machining centres',
  width: 1483,
  height: 1061,
}

/**
 * The closing CTA's badge collage — NABL accreditation, ISO 9001:2015 and
 * ISO/IEC 17025 shown together rather than as the small individual marks
 * used on /about, since this is the section asking a visitor to act on
 * that trust rather than explaining it.
 */
export const ctaBadges: ImageRef = {
  src: '/images/home/certification-badges.png',
  alt: 'NABL accredited testing laboratory, ISO 9001:2015 quality management and ISO/IEC 17025 testing and calibration marks',
  width: 1536,
  height: 1024,
}

/* ------------------------------------------------------------------------ */
/* About                                                                     */
/* ------------------------------------------------------------------------ */

export const aboutPhotos = {
  team: {
    src: '/images/about/team.jpeg',
    alt: 'The Auto Cluster staff, around fifty people in teal uniform shirts, outside the main entrance',
    width: 1000,
    height: 500,
  },
  isoCertificate: {
    src: '/images/about/iso-9001-certificate.png',
    alt: 'The TÜV SÜD South Asia ISO 9001 certificate issued to Auto Cluster Development and Research Institute',
    width: 300,
    height: 199,
    needsPhotography: true,
  },
} satisfies Record<string, ImageRef>

/**
 * Accreditation marks. Both 148×148 and both used at well under half that.
 *
 * Decorative: the accreditation is stated as text everywhere these appear, so
 * the mark repeats nothing.
 */
export const badges = {
  nabl: { src: '/images/badges/nabl.png', alt: '', width: 148, height: 148 },
  iso9001: { src: '/images/badges/iso-9001.png', alt: '', width: 148, height: 148 },
} satisfies Record<string, ImageRef>

/**
 * Exhibitions hosted at the centre. A genuine photograph of an ACMA show in
 * our own hall, and the only wide asset in the library that is neither stock
 * nor a machine.
 */
export const exhibitionBanner: ImageRef = {
  src: '/images/banners/facilities.jpg',
  alt: 'An ACMA exhibition in progress at the Auto Cluster Exhibition Centre, seen from above, with stands running the length of both halls',
  width: 1900,
  height: 600,
}

/**
 * Board portraits, keyed by the board member's name as it appears in
 * `about/page.tsx`.
 *
 * **Deliberately not wired into the page.** CQ-08 records that the live site
 * pairs at least one photograph with the wrong name, and these filenames come
 * from that same source — so the mapping below is exactly the thing under
 * doubt. The files are installed and ready; publish them once ACDRI has
 * confirmed each pairing, and delete this note when they do.
 */
export const boardPortraits: Record<string, ImageRef> = {
  'Mr. Prashant Girbane': { src: '/images/about/board/prashant-girbane.jpg', alt: 'Mr. Prashant Girbane', width: 335, height: 380 },
  'Mr. Sanjay Kirloskar': { src: '/images/about/board/sanjay-kirloskar.jpg', alt: 'Mr. Sanjay Kirloskar', width: 312, height: 312 },
  'Mr. Shrikrishna Gadgil': { src: '/images/about/board/shrikrishna-gadgil.jpg', alt: 'Mr. Shrikrishna Gadgil', width: 207, height: 264 },
  'Mr. A. K. Jindal': { src: '/images/about/board/ak-jindal.jpg', alt: 'Mr. A. K. Jindal', width: 335, height: 380 },
  'Mr. S. G. Rajput': { src: '/images/about/board/sg-rajput.jpeg', alt: 'Mr. S. G. Rajput', width: 200, height: 200 },
  'Dr. Regi Mathai': { src: '/images/about/board/regi-mathai.jpg', alt: 'Dr. Regi Mathai', width: 1024, height: 682 },
  'Prof. Sunil Bhirud': { src: '/images/about/board/sunil-bhirud.jpg', alt: 'Prof. Sunil Bhirud', width: 209, height: 300 },
}
