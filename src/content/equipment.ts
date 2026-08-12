import type { Equipment, EquipmentCategory, ImageRef } from '@/lib/types'

/**
 * THE EQUIPMENT CATALOGUE — 30 machines.
 *
 * Source: docs/audit/12-equipment-catalogue.md, itself extracted from the
 * global modal library that renders in the DOM of every page on the current
 * site. None of it is crawlable today and none of it has a URL. This is the
 * single largest untapped content asset ACDRI has.
 *
 * COUNT RECONCILIATION (CONTENT_QUESTIONS.md CQ-06)
 *   Prototype production      8
 *   Rapid prototyping         4
 *   Environmental             6   (Xenon published here, cross-listed to RPL)
 *   Rubber & polymer         11   (excludes the duplicate second UTM, CQ-03)
 *   Metrology                 1
 *                            ──
 *                            30
 *
 * CORRECTIONS. Every technical error in the source is corrected here and the
 * published value is retained on the record so the page can show its working.
 * See DESIGN_DIRECTION.md §4.
 */

export const categories: {
  id: EquipmentCategory
  label: string
  facility: string
  /** The isometric illustration on the category's map card. */
  image: ImageRef
}[] = [
  {
    id: 'prototype',
    label: 'Prototype production',
    facility: 'prototype-production-facility',
    image: {
      src: '/images/equipment/categories/prototype-production.png',
      alt: 'Isometric illustration of a five-axis vertical machining centre',
    },
  },
  {
    id: 'rapid-prototyping',
    label: 'Rapid prototyping',
    facility: 'rapid-prototyping',
    image: {
      src: '/images/equipment/categories/rapid-prototyping.png',
      alt: 'Isometric illustration of an FDM 3D printer',
    },
  },
  {
    id: 'environmental',
    label: 'Environmental testing',
    facility: 'environmental-testing',
    image: {
      src: '/images/equipment/categories/environmental-testing.png',
      alt: 'Isometric illustration of an environmental test chamber',
    },
  },
  {
    id: 'rubber-polymer',
    label: 'Rubber & polymer',
    facility: 'rubber-polymer-testing',
    image: {
      src: '/images/equipment/categories/rubber-polymer.png',
      alt: 'Isometric illustration of a two-roll rubber mill',
    },
  },
  {
    id: 'metrology',
    label: 'Metrology & CMM',
    facility: 'large-bed-cmm-services',
    image: {
      src: '/images/equipment/categories/metrology-cmm.png',
      alt: 'Isometric illustration of a coordinate measuring machine',
    },
  },
]


/** Placeholder for the six chambers that have no specifications at all. */
const NO_SPECS = (what: string) => [
  {
    label: 'Make and model',
    flag: {
      kind: 'missing' as const,
      note: `Requested from ACDRI — no make, model or ${what} appears in any source material.`,
    },
  },
]

export const equipment: Equipment[] = [
  // =========================================================================
  // A. PROTOTYPE PRODUCTION FACILITY — 8
  // =========================================================================
  {
    slug: 'five-axis-vmc-rambaudi',
    name: '5-Axis VMC (Non-Continuous)',
    category: 'prototype',
    make: 'Rambaudi',
    machineType: 'Vertical machining centre',
    summary:
      'Large-envelope five-axis vertical machining for 2D and 3D profile work, boring, drilling, reaming and side-face operations.',
    specs: [
      { label: 'Make', value: 'Rambaudi' },
      {
        label: 'Max. job size',
        value: '3000 × 2000 × 800 mm',
        flag: {
          kind: 'corrected',
          published: '3 M * 2 M * 0.8 M',
          note: 'Unit convention normalised to millimetres across the catalogue.',
        },
      },
    ],
    applications: [
      '2D and 3D profile machining',
      'Boring',
      'Drilling',
      'Reaming',
      'Side-face operations',
    ],
    standards: [],
    image: { src: '/images/equipment/five-axis-vmc-rambaudi.png', alt: 'Rambaudi five-axis vertical machining centre', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
    rate: { department: 'prototype', process: '5 Axis Machining', uom: 'Per hour', min: 1800, max: 2000 },
  },
  {
    slug: 'three-axis-vmc-hartford',
    name: '3-Axis VMC',
    category: 'prototype',
    make: 'Hartford',
    machineType: 'Vertical machining centre',
    summary:
      'Three-axis vertical machining with a 16-tool automatic tool changer, for profile work, boring, drilling and reaming.',
    specs: [
      { label: 'Make', value: 'Hartford' },
      {
        label: 'Max. job size',
        value: '3000 × 1400 × 750 mm',
        flag: { kind: 'corrected', published: '3 M * 1.4 M * 0.75 M' },
      },
      {
        label: 'Tool changer',
        value: '16-tool ATC',
        flag: { kind: 'corrected', published: '16 Number tool ATC' },
      },
    ],
    applications: ['2D and 3D profile machining', 'Boring', 'Drilling', 'Reaming'],
    standards: [],
    image: { src: '/images/equipment/three-axis-vmc-hartford.png', alt: 'Hartford three-axis vertical machining centre', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
  },
  {
    slug: 'five-plus-one-axis-laser-trumpf',
    name: '5+1 Axis Laser (Rotary Attachment)',
    category: 'prototype',
    make: 'TRUMPF',
    machineType: 'Laser cutting and welding centre',
    summary:
      'Five-axis laser cutting with a rotary attachment and welding head. Oxygen cutting to 12 mm, nitrogen cutting to 8 mm.',
    specs: [
      { label: 'Make', value: 'TRUMPF' },
      {
        label: 'Max. job size',
        value: '3000 × 1500 × 750 mm',
        flag: { kind: 'corrected', published: '3 M * 1.5 M * 0.75 M (4.5 KW)' },
      },
      { label: 'Laser power', value: '4.5 kW', flag: { kind: 'corrected', published: '4.5 KW' } },
      { label: 'Oxygen cutting', value: 'up to 12 mm' },
      { label: 'Nitrogen cutting', value: 'up to 8 mm' },
    ],
    applications: ['2D and 3D profile cutting', 'Sheet metal form part cutting', 'Laser welding'],
    standards: [],
    image: { src: '/images/equipment/five-plus-one-axis-laser-trumpf.png', alt: 'TRUMPF five-axis laser cutting centre with rotary attachment', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
  },
  {
    slug: 'three-plus-one-axis-vmc-tai',
    name: '3+1 Axis VMC (Rotary Attachment)',
    category: 'prototype',
    make: 'TAI',
    machineType: 'Vertical machining centre',
    summary:
      'Three-plus-one axis vertical machining with a rotary attachment and a 20-tool automatic tool changer.',
    specs: [
      { label: 'Make', value: 'TAI' },
      {
        label: 'Max. job size',
        value: '1000 × 500 × 650 mm',
        flag: { kind: 'corrected', published: '1 M * 0.5 M * 0.65 M' },
      },
      {
        label: 'Tool changer',
        value: '20-tool ATC',
        flag: {
          kind: 'corrected',
          published: 'Max. Job Size : Machine Application : … 20 Number Tool ATC Capacity',
          note: 'The source record repeats the "Max. Job Size" label on a row containing the machine application — a data-entry fault.',
        },
      },
    ],
    applications: ['2D and 3D profile machining', 'Boring', 'Drilling', 'Reaming'],
    standards: [],
    image: { src: '/images/equipment/three-plus-one-axis-vmc-tai.jpg', alt: 'TAI three-plus-one axis vertical machining centre', width: 560, height: 373, needsPhotography: true },
    isAccredited: false,
    rate: { department: 'prototype', process: '3 + 1 Axis', uom: 'Per hour', min: 300, max: 400 },
  },
  {
    slug: 'turn-mill-centre-ace',
    name: 'Turn Mill Centre',
    category: 'prototype',
    make: 'ACE',
    machineType: 'Turn-mill centre',
    summary: 'Turning and milling in one setup, with a 12-station tool turret.',
    specs: [
      { label: 'Make', value: 'ACE' },
      {
        label: 'Max. job size',
        value: '⌀250 × 600 mm',
        flag: {
          kind: 'corrected',
          published: '@ 250 * 600 mm',
          note: 'The diameter symbol was lost to character encoding and rendered as "@".',
        },
      },
      { label: 'Turret', value: '12-station tool turret' },
    ],
    applications: [
      'Turning',
      'Milling',
      'Boring',
      'Drilling',
      'Reaming',
    ],
    standards: [],
    image: { src: '/images/equipment/turn-mill-centre-ace.png', alt: 'ACE turn mill centre', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
  },
  {
    slug: 'deep-hole-drilling-ixion',
    name: 'Deep Hole Drilling',
    category: 'prototype',
    make: 'Ixion',
    machineType: 'Deep hole drilling machine',
    summary: 'Single-stroke deep hole drilling to 650 mm depth at 20 mm diameter.',
    specs: [
      { label: 'Make', value: 'Ixion' },
      {
        label: 'Max. job size',
        value: '1700 × 400 mm',
        flag: { kind: 'corrected', published: '1.7 M * 0.4 M' },
      },
      {
        label: 'Drilling capacity',
        value: '650 mm depth in one stroke, ⌀20',
        flag: {
          kind: 'corrected',
          published: 'One Stroke 650 mm Deep Hole * ¢20',
          note: 'A cent sign was published in place of the diameter symbol.',
        },
      },
    ],
    applications: ['Deep hole drilling'],
    standards: [],
    image: { src: '/images/equipment/deep-hole-drilling-ixion.png', alt: 'Ixion deep hole drilling machine', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
  },
  {
    slug: 'die-sinking-edm',
    name: 'Die Sinking EDM',
    category: 'prototype',
    machineType: 'Z NC',
    summary: 'Electrical discharge machining for die sinking work.',
    specs: [
      {
        label: 'Machine name',
        value: 'Die Sinking EDM',
        flag: {
          kind: 'verify',
          published: 'Deep Hole Drilling',
          note: 'Published under the same title as the Ixion drill above, but its stated application is die sinking. Almost certainly a die-sinking EDM. Correct name, make and model requested from ACDRI (CQ-05).',
        },
      },
      { label: 'Machine type', value: 'Z NC' },
      {
        label: 'Max. job size',
        value: '2500 × 1200 mm',
        flag: {
          kind: 'corrected',
          published: '2.5 M * 1.2 M/li>',
          note: 'Leaked HTML — "/li>" was printing as visible text on the live site.',
        },
      },
      { label: 'Make', flag: { kind: 'missing', note: 'Not published anywhere.' } },
    ],
    applications: ['Die sinking'],
    standards: [],
    image: { src: '/images/equipment/die-sinking-edm.png', alt: 'Die sinking electrical discharge machine', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
  },
  {
    slug: 'wire-edm',
    name: 'W-EDM',
    category: 'prototype',
    machineType: 'CNC',
    summary: 'Submerged-type CNC wire electrical discharge machining.',
    specs: [
      { label: 'Machine type', value: 'CNC' },
      { label: 'Max. job size', value: '620 × 420 × 300 mm' },
      { label: 'Cutting', value: 'Wire cutting, submerged type' },
      { label: 'Make', flag: { kind: 'missing', note: 'Not published anywhere.' } },
    ],
    applications: ['Wire cutting'],
    standards: [],
    image: { src: '/images/equipment/wire-edm.png', alt: 'CNC wire electrical discharge machine', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
  },

  // =========================================================================
  // B. RAPID PROTOTYPING — 4
  // =========================================================================
  {
    slug: 'sla-3d-systems-7000-hd',
    name: 'SLA — 3D Systems 7000 HD',
    category: 'rapid-prototyping',
    make: '3D Systems',
    model: '7000 HD',
    machineType: 'Stereolithography',
    summary:
      'Stereolithography for high-detail production parts and investment casting patterns.',
    specs: [
      { label: 'Make', value: '3D Systems' },
      { label: 'Model', value: '7000 HD' },
      { label: 'Platform size', value: '380 × 380 × 250 mm' },
      { label: 'Materials', value: 'Accura Phoenix (SLA), Visijet SL Flex' },
    ],
    applications: [
      'Automotive',
      'Aerospace',
      'Research',
      'Medical',
      'Investment casting patterns',
    ],
    standards: [],
    image: { src: '/images/equipment/sla-3d-systems-7000-hd.jpg', alt: '3D Systems 7000 HD stereolithography machine', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
    rate: { department: 'rapid-prototyping', process: 'SLA (imported resin)', uom: 'Per cc', min: 40, max: 80 },
  },
  {
    slug: 'sls-eos-p385',
    name: 'SLS — EOS P385',
    category: 'rapid-prototyping',
    make: 'EOS',
    model: 'P385',
    machineType: 'Selective laser sintering',
    summary:
      'Selective laser sintering in polyamide, for functional engineering parts and medical and architectural models.',
    specs: [
      { label: 'Make', value: 'EOS' },
      { label: 'Model', value: 'P385' },
      {
        label: 'Platform size',
        value: '320 × 320 × 520 mm',
        flag: { kind: 'corrected', published: 'Platform : 320 mm * 320 mm * 520 mm' },
      },
      { label: 'Material', value: 'PA (polyamide)' },
    ],
    applications: [
      'Engineering functional parts',
      'Automotive parts',
      'Medical — skull and knee-cap models',
      'Architectural models',
      'Styling models',
    ],
    standards: [],
    image: { src: '/images/equipment/sls-eos-p385.jpg', alt: 'EOS P385 selective laser sintering machine', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
    rate: { department: 'rapid-prototyping', process: 'SLS', uom: 'Per cc', min: 30, max: 40 },
  },
  {
    slug: 'fdm-stratasys-450mc',
    name: 'FDM — Stratasys 450 MC',
    category: 'rapid-prototyping',
    make: 'Stratasys',
    model: 'Fortus 450mc',
    machineType: 'Fused deposition modelling',
    summary: 'Fused deposition modelling in production-grade ABS and ASA thermoplastics.',
    specs: [
      { label: 'Make', value: 'Stratasys' },
      { label: 'Model', value: '450 MC' },
      {
        label: 'Platform size',
        value: '406 × 355 × 406 mm',
        flag: { kind: 'corrected', published: '(406 x 355 x 406 mm)' },
      },
      { label: 'Materials', value: 'ABS-ESD, ABS-M30, ABS-M30i, ASA' },
    ],
    applications: ['Automotive', 'Aerospace', 'Research', 'Medical'],
    standards: [],
    image: { src: '/images/equipment/fdm-stratasys-450mc.jpg', alt: 'Stratasys 450 MC fused deposition modelling machine', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
  },
  {
    slug: 'vacuum-casting-klm',
    name: 'Vacuum Casting — KLM',
    category: 'rapid-prototyping',
    make: 'KLM',
    machineType: 'Vacuum casting',
    summary: 'Silicone-tool vacuum casting for short-run flexible and rigid parts.',
    specs: [
      { label: 'Make', value: 'KLM' },
      { label: 'Chamber dimensions', value: '360 × 400 × 460 mm' },
      {
        label: 'Materials',
        flag: {
          kind: 'verify',
          published: 'Renishaw (Flexible Rubber)50 ~ 90 Shore hardness',
          note: 'Renishaw is a metrology company, not a casting-resin supplier. Probably Renshape or a similar urethane. Not published until ACDRI confirms — a wrong supplier name is a credibility problem (CQ-44).',
        },
      },
      {
        label: 'Shore hardness range',
        value: '50 – 90 Shore',
      },
    ],
    applications: ['Aerospace', 'Research', 'Medical'],
    standards: [],
    image: { src: '/images/equipment/vacuum-casting-klm.jpg', alt: 'KLM vacuum casting machine', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
  },

  // =========================================================================
  // C. ENVIRONMENTAL TESTING — 6
  // Every one of these has a title and a photograph and nothing else. This is
  // the most damaging gap in the catalogue: ACDRI markets this service to
  // aeronautical, space and automotive customers, and these are precisely the
  // numbers an engineer needs to know whether their part fits. CQ-50.
  // =========================================================================
  {
    slug: 'xenon-test-chamber',
    name: 'Xenon Test Chamber',
    category: 'environmental',
    alsoIn: ['rubber-polymer'],
    summary:
      'Xenon-arc weathering, reproducing the effect of sunlight, moisture, heat and water spray on a sample.',
    specs: NO_SPECS('chamber size, irradiance range or temperature range'),
    applications: [
      'Rubber and polymer',
      'Paint and coatings',
      'Cosmetics',
      'Adhesives and sealants',
      'Printing ink, artist material and paper',
      'Packaging',
      'Textile',
      'Pharmaceuticals',
    ],
    standards: [],
    image: { src: '/images/equipment/xenon-test-chamber.jpg', alt: 'Xenon arc weathering test chamber', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'rubber-polymer', process: 'Xenon Test Chamber', uom: 'Per hour / per 3 samples', min: 80, max: 120 },
  },
  {
    slug: 'salt-spray-test-chamber',
    name: 'Salt Spray Test Chamber',
    category: 'environmental',
    summary:
      'Accelerated corrosion testing of metals and coated metals in a controlled salt fog atmosphere.',
    specs: [
      ...NO_SPECS('chamber size, salt concentration or temperature range'),
      {
        label: 'Units',
        flag: {
          kind: 'verify',
          note: 'Page copy refers to both a "Mini Salt Spray" and a "Big Salt Spray"; the rate card prices only a Mini Salt Spray Chamber. Confirm how many units exist and whether they need separate records (CQ-51).',
        },
      },
    ],
    applications: ['Automotive components', 'Coated metals', 'Fasteners'],
    standards: [],
    image: { src: '/images/equipment/salt-spray-test-chamber.jpg', alt: 'Salt spray corrosion test chamber', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'environmental', process: 'Mini Salt Spray Chamber', uom: 'Per hour', min: 40, max: 50 },
  },
  {
    slug: 'dust-spray-test-chamber',
    name: 'Dust Spray Test Chamber',
    category: 'environmental',
    summary:
      'Dust ingress testing, determining the stability of automotive, electronic and electrical items under dust-laden conditions.',
    specs: NO_SPECS('chamber size, dust concentration or air velocity'),
    applications: ['Automotive components', 'Electronic assemblies', 'Electrical items'],
    standards: [],
    image: {
      src: '/images/equipment/dust-spray-test-chamber.jpg',
      alt: 'Dust ingress test chamber', width: 500, height: 333,
      needsPhotography: true,
    },
    isAccredited: true,
    rate: { department: 'environmental', process: 'Dust Spray Chamber', uom: 'Per hour', min: 450, max: 550 },
  },
  {
    slug: 'water-spray-test-chamber',
    name: 'Water Spray Test Chamber',
    category: 'environmental',
    summary:
      'Water ingress and rain testing, determining stability under rain and shower spray conditions.',
    specs: NO_SPECS('chamber size, spray pressure or nozzle configuration'),
    applications: ['Automotive components', 'Electronic assemblies', 'Electrical items'],
    standards: [],
    image: { src: '/images/equipment/water-spray-test-chamber.jpg', alt: 'Water spray ingress test chamber', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'environmental', process: 'Water Spray Chamber', uom: 'Per hour', min: 400, max: 500 },
  },
  {
    slug: 'thermal-shock-test-chamber',
    name: 'Thermal Shock Test Chamber',
    category: 'environmental',
    summary:
      'Rapid transition between two temperature extremes, to reveal failures caused by sudden temperature change.',
    specs: NO_SPECS('chamber size, temperature range or transfer time'),
    applications: ['Automotive components', 'Electrical components', 'Electronic assemblies'],
    standards: [],
    image: { src: '/images/equipment/thermal-shock-test-chamber.jpg', alt: 'Thermal shock test chamber', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'environmental', process: 'Thermal shock chamber', uom: 'Per hour', min: 190, max: 220 },
  },
  {
    slug: 'high-low-temperature-chamber',
    name: 'High-Low Temperature Chamber',
    category: 'environmental',
    summary:
      'Cyclic high and low temperature with controlled relative humidity, for climatic and ageing tests.',
    specs: NO_SPECS('chamber size, temperature range, humidity range or ramp rate'),
    applications: ['Automotive components', 'Electrical components', 'Electronic assemblies'],
    standards: [],
    image: { src: '/images/equipment/high-low-temperature-chamber.jpg', alt: 'High-low cyclic temperature and humidity chamber', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'environmental', process: 'High-Low Chamber', uom: 'Per hour', min: 275, max: 320 },
  },

  // =========================================================================
  // D. RUBBER & POLYMER TESTING — 11
  // =========================================================================
  {
    slug: 'universal-testing-machine-tinius-olsen',
    name: 'Universal Testing Machine (UTM)',
    category: 'rubber-polymer',
    make: 'Tinius Olsen',
    machineType: 'Universal testing machine',
    summary:
      'Tensile, flexural and mechanical property testing of rubber, polymer and metal specimens.',
    specs: [
      { label: 'Make', value: 'Tinius Olsen', unit: 'United Kingdom' },
      { label: 'Model', flag: { kind: 'missing', note: 'Requested from ACDRI — absent from all source material.' } },
      {
        label: 'Capacity',
        value: '0.1 – 225 kN',
        flag: {
          kind: 'verify',
          published: '100 N to 23 Tons',
          note: 'Converted assuming metric tonnes, and normalised to kN. ACDRI to confirm (CQ-43).',
        },
      },
      {
        label: 'Crosshead travel, excl. grips',
        value: '1100 mm',
        flag: {
          kind: 'corrected',
          published: '1100 M',
          note: '1.1 km of crosshead travel is not physically possible.',
        },
      },
      { label: 'Horizontal clearance', value: '405 mm' },
      { label: 'Speed range', value: '0.001 – 1000 mm/min' },
      { label: 'Speed at max capacity', value: '1000 mm/min' },
    ],
    applications: ['Tensile testing', 'Flexural testing', 'Mechanical testing'],
    standards: ['ASTM D638', 'ASTM D412', 'ISO 178'],
    image: { src: '/images/equipment/universal-testing-machine-tinius-olsen.jpg', alt: 'Tinius Olsen universal testing machine', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'rubber-polymer', process: 'UTM', uom: 'Per sample', min: 1800, max: 2100 },
  },
  {
    slug: 'thermogravimetric-analyser-shimadzu',
    name: 'Thermogravimetric Analyser (TGA)',
    category: 'rubber-polymer',
    make: 'Shimadzu',
    machineType: 'Thermal analyser',
    summary:
      'Composition analysis by mass change with temperature — polymer content, filler content and ash content.',
    specs: [
      {
        label: 'Make',
        value: 'Shimadzu',
        unit: 'Japan',
        flag: { kind: 'corrected', published: 'Shimatzu' },
      },
      {
        label: 'Resolution',
        value: '1 µg',
        flag: {
          kind: 'verify',
          published: '1 µ',
          note: 'Unit incomplete in source. TGA measures mass, so µg is assumed (CQ-47).',
        },
      },
      {
        label: 'Measuring range',
        value: '± 200 µg',
        flag: { kind: 'verify', published: '± 200 µ', note: 'As above.' },
      },
      { label: 'Atmosphere', value: 'Air, oxygen and nitrogen' },
      {
        label: 'Temperature range',
        flag: { kind: 'missing', note: 'The primary TGA specification, and it is not published anywhere.' },
      },
    ],
    applications: ['Polymer content', 'Filler content', 'Ash content', 'Material identification'],
    standards: [],
    image: { src: '/images/equipment/thermogravimetric-analyser-shimadzu.jpg', alt: 'Shimadzu thermogravimetric analyser', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
  },
  {
    slug: 'instron-actuator',
    name: 'Instron Actuator',
    category: 'rubber-polymer',
    make: 'Instron',
    machineType: 'Servo-hydraulic actuator',
    summary: 'Fatigue and endurance testing of rubber, polymer and metal components.',
    specs: NO_SPECS('load capacity, stroke or frequency range'),
    applications: ['Fatigue testing', 'Endurance testing'],
    standards: [],
    image: { src: '/images/equipment/instron-actuator.jpg', alt: 'Instron servo-hydraulic actuator', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
  },
  {
    slug: 'ozone-test-chamber',
    name: 'Ozone Test Chamber',
    category: 'rubber-polymer',
    model: 'In 2000 – L2 (low concentration)',
    machineType: 'Ozone chamber',
    summary:
      'Ozone resistance testing, determining cracking criteria for rubber in an ozone atmosphere.',
    specs: [
      {
        label: 'Make',
        value: 'In USA Inc.',
        flag: {
          kind: 'verify',
          published: 'In USA Inc, India',
          note: 'Country of origin contradicts the manufacturer name (CQ-48).',
        },
      },
      { label: 'Model', value: 'In 2000 – L2 (low concentration)' },
      {
        label: 'Temperature range',
        value: 'Room temperature to 100 °C',
        flag: {
          kind: 'corrected',
          published: 'Room Temp to 1000C',
          note: 'Degree symbol stripped by the source encoding.',
        },
      },
      { label: 'Chamber size', value: '500 × 500 × 600 mm' },
      {
        label: 'Measuring range',
        value: '0 – 200 pphm, multiple ranges',
        flag: {
          kind: 'corrected',
          published: 'Listed twice with near-identical values',
          note: 'Duplicate field in the source record; consolidated.',
        },
      },
      {
        label: 'Gas phase',
        value: '0 – 9999',
        flag: { kind: 'verify', note: 'Published with no unit (CQ-49).' },
      },
    ],
    applications: ['Ozone cracking resistance', 'Rubber ageing'],
    standards: ['ASTM D1171', 'ASTM D1149'],
    image: { src: '/images/equipment/ozone-test-chamber.jpg', alt: 'Ozone resistance test chamber', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'rubber-polymer', process: 'Ozone Chamber', uom: 'Per hour', min: 200, max: 250 },
  },
  {
    slug: 'impact-tester-ceast',
    name: 'Impact Tester',
    category: 'rubber-polymer',
    make: 'CEAST S.p.A.',
    model: 'Resil Impactor',
    machineType: 'Pendulum impact tester',
    summary:
      'Izod, Charpy and tensile impact testing, notched and un-notched, with microprocessor control.',
    specs: [
      {
        label: 'Make',
        value: 'CEAST S.p.A.',
        unit: 'Italy',
        flag: { kind: 'corrected', published: 'Ceast, Spa, Itly' },
      },
      { label: 'Model', value: 'Resil Impactor' },
      {
        label: 'Test types',
        value: 'Izod, Charpy and tensile impact; resilience (notched and un-notched)',
        flag: { kind: 'corrected', published: 'Tensile Impact text' },
      },
      {
        label: 'Hammer range',
        value: '1 – 25 J for Izod; 4 – 25 J',
        flag: { kind: 'corrected', published: '1to 25 Joules' },
      },
      { label: 'Control', value: 'Microprocessor controlled' },
    ],
    applications: ['Impact strength', 'Resilience'],
    standards: ['ISO 180', 'ISO 179'],
    image: {
      src: '/images/equipment/impact-tester-ceast.jpg',
      alt: 'CEAST Resil Impactor pendulum impact tester', width: 500, height: 333,
      needsPhotography: true,
    },
    isAccredited: true,
  },
  {
    slug: 'accelerated-weathering-tester-quv',
    name: 'Accelerated Weathering Tester',
    category: 'rubber-polymer',
    make: 'Q-Lab',
    model: 'QUV/Spray',
    machineType: 'UV weathering tester',
    summary:
      'Accelerated weathering under UV light, condensation, heat and water spray, with irradiance control.',
    specs: [
      { label: 'Make', value: 'Q-Lab', unit: 'USA', flag: { kind: 'corrected', published: 'Q Lab' } },
      { label: 'Model', value: 'QUV/Spray' },
      { label: 'Lamp', value: 'UVB 313 EL' },
      { label: 'Irradiance control', value: 'Solar Eye' },
      { label: 'Max. sample capacity', value: '24 specimens' },
      {
        label: 'Specimen size',
        value: '75 × 150 × 6 mm',
        flag: {
          kind: 'corrected',
          published: 'Chamber Size : 75 mm * 150 mm * 6 mm',
          note: 'Published as the chamber size. A chamber holding 24 specimens cannot be 6 mm deep — this is the specimen size, and the field was mislabelled. Actual chamber size requested (CQ-46).',
        },
      },
      { label: 'Fault recognition', value: 'Alarms' },
      {
        label: 'Test standards',
        flag: {
          kind: 'verify',
          published: 'ASTM & SAE Std.',
          note: 'No standard numbers were published. ASTM G154 and SAE J2020 assumed pending confirmation.',
        },
      },
    ],
    applications: ['UV weathering', 'Colour and gloss retention'],
    standards: [],
    image: { src: '/images/equipment/accelerated-weathering-tester-quv.jpg', alt: 'Q-Lab QUV accelerated weathering tester', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'rubber-polymer', process: 'QUV Weather-Ometer', uom: 'Per hour / per 3 samples', min: 80, max: 100 },
  },
  {
    slug: 'melt-flow-indexer-tinius-olsen',
    name: 'Melt Flow Indexer',
    category: 'rubber-polymer',
    make: 'Tinius Olsen',
    model: 'MP 600',
    machineType: 'Melt flow indexer',
    summary: 'Melt flow rate of thermoplastics, for grade identification and process control.',
    specs: [
      { label: 'Make', value: 'Tinius Olsen', unit: 'United Kingdom' },
      { label: 'Model', value: 'MP 600' },
      {
        label: 'Temperature range',
        value: 'Room temperature to 450 °C',
        flag: { kind: 'corrected', published: 'Room Temp to 4500C' },
      },
    ],
    applications: ['Melt flow rate', 'Thermoplastic grade identification'],
    standards: ['ASTM D1238', 'ISO 1133'],
    image: { src: '/images/equipment/melt-flow-indexer-tinius-olsen.jpg', alt: 'Tinius Olsen MP 600 melt flow indexer', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'rubber-polymer', process: 'Melt Flow Index', uom: 'Per sample', min: 1500, max: 1800 },
  },
  {
    slug: 'differential-scanning-calorimeter-shimadzu',
    name: 'Differential Scanning Calorimeter (DSC)',
    category: 'rubber-polymer',
    make: 'Shimadzu',
    model: 'DSC 60',
    machineType: 'Thermal analyser',
    summary:
      'Melting point, crystallisation and degradation behaviour as a function of temperature and time.',
    specs: [
      {
        label: 'Make',
        value: 'Shimadzu',
        unit: 'Japan',
        flag: { kind: 'corrected', published: 'Shimatzu' },
      },
      { label: 'Model', value: 'DSC 60' },
      {
        label: 'Temperature range',
        value: 'Room temperature to 600 °C',
        flag: { kind: 'corrected', published: 'Room Temp to 6000C' },
      },
      { label: 'Measuring range', value: '± 40 mW' },
      { label: 'Resolution', value: '1 mW' },
      {
        label: 'Atmosphere',
        value: 'Air, inert gas (N₂)',
        flag: { kind: 'corrected', published: 'Air, Insert Gas (N2)' },
      },
    ],
    applications: ['Melting point', 'Crystallisation', 'Degradation'],
    standards: ['ASTM E928', 'ASTM D1525', 'ASTM D648'],
    image: { src: '/images/equipment/differential-scanning-calorimeter-shimadzu.jpg', alt: 'Shimadzu DSC 60 differential scanning calorimeter', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'rubber-polymer', process: 'DSC', uom: 'Per sample', min: 2700, max: 3200 },
  },
  {
    slug: 'hdt-vicat-tester-ceast',
    name: 'HDT & VICAT Softening Temperature Tester',
    category: 'rubber-polymer',
    make: 'CEAST S.p.A.',
    model: 'HDT 3 Vicat',
    machineType: 'Thermomechanical tester',
    summary:
      'Heat deflection temperature and Vicat softening point, with three independent stations for simultaneous tests.',
    specs: [
      {
        label: 'Make',
        value: 'CEAST S.p.A.',
        unit: 'Italy',
        flag: { kind: 'corrected', published: 'Ceast, Spa, Itly' },
      },
      { label: 'Model', value: 'HDT 3 Vicat' },
      {
        label: 'Temperature range',
        value: 'Room temperature to 300 °C',
        flag: {
          kind: 'corrected',
          published: 'Room Temp. to 3000C, Weight Range 1 to 5140 gm',
          note: 'Two separate specifications were merged onto one line; split here.',
        },
      },
      { label: 'Weight range', value: '1 – 5140 g' },
      { label: 'Stations', value: '3 independent work stations' },
      { label: 'Control', value: 'Microprocessor controlled' },
    ],
    applications: ['Heat deflection temperature', 'Vicat softening point'],
    standards: ['ASTM D648', 'ASTM D1525'],
    image: { src: '/images/equipment/hdt-vicat-tester-ceast.jpg', alt: 'CEAST HDT and Vicat softening temperature tester', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
  },
  {
    slug: 'multi-head-micro-hardness-tester-gibitre',
    name: 'Multi Head Micro Hardness Tester',
    category: 'rubber-polymer',
    make: 'Gibitre',
    model: 'Multi Unit Hardness Tester',
    machineType: 'Hardness tester',
    summary: 'IRHD normal and micro, plus Shore A and Shore D hardness on one instrument.',
    specs: [
      {
        label: 'Make',
        value: 'Gibitre',
        unit: 'Italy',
        flag: { kind: 'corrected', published: 'Gibitre. Itly' },
      },
      { label: 'Model', value: 'Multi Unit Hardness Tester' },
      { label: 'Scales', value: 'IRHD normal and micro; Shore A and Shore D' },
      {
        label: 'Compliance',
        value: 'ISO 48, ISO 868, BS 903, ASTM D1415, ASTM D2240',
        flag: {
          kind: 'verify',
          published: 'ISO 43-1987, ISO 868, BS 903, ASTM D 1415, ASTM D 2240',
          note: 'ISO 43-1987 is withdrawn; the current rubber hardness standard is ISO 48. Confirm before publication (CQ-42).',
        },
      },
    ],
    applications: ['Rubber hardness', 'Polymer hardness'],
    standards: ['ISO 48', 'ISO 868', 'BS 903', 'ASTM D1415', 'ASTM D2240'],
    image: { src: '/images/equipment/multi-head-micro-hardness-tester-gibitre.jpg', alt: 'Gibitre multi-head micro hardness tester', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
  },
  {
    slug: 'ftir-spectrometer-nicolet-380',
    name: 'FTIR Spectrometer',
    category: 'rubber-polymer',
    make: 'Thermo Electron',
    model: 'Nicolet 380',
    machineType: 'FTIR spectrometer',
    summary:
      'Polymer and material identification by infrared spectroscopy, against four reference libraries.',
    specs: [
      {
        label: 'Make',
        value: 'Thermo Electron',
        unit: 'USA — now Thermo Fisher Scientific',
        flag: { kind: 'corrected', published: 'ThermoElectron' },
      },
      { label: 'Model', value: 'Nicolet 380' },
      { label: 'Polymer & plasticiser library', value: '1' },
      { label: 'Hummel polymer library', value: '1' },
      { label: 'Lubrication oil library', value: '1' },
      {
        label: 'Rubber compounding library',
        value: '1',
        flag: {
          kind: 'verify',
          published: 'Rubber Compounding Library',
          note: 'Published without the "– 01 No" count carried by the other three libraries.',
        },
      },
    ],
    applications: ['Polymer identification', 'Unknown material identification'],
    standards: ['ASTM E1252'],
    image: { src: '/images/equipment/ftir-spectrometer-nicolet-380.jpg', alt: 'Thermo Electron Nicolet 380 FTIR spectrometer', width: 500, height: 333, needsPhotography: true },
    isAccredited: true,
    rate: { department: 'rubber-polymer', process: 'FTIR', uom: 'Per sample', min: 2500, max: 3000 },
  },

  // =========================================================================
  // E. METROLOGY / CMM — 1
  // The homepage claims "02 big Co-ordinate Measuring Machines". Only one is
  // catalogued. CQ-04.
  // =========================================================================
  {
    slug: 'coordinate-measuring-machine-accurate',
    name: 'Co-ordinate Measuring Machine (CMM)',
    category: 'metrology',
    make: 'Accurate',
    model: 'Cordimesur',
    machineType: 'Large bed CMM',
    summary:
      'Large-bed co-ordinate measurement of dies, automobile parts, mechanical parts and prototypes.',
    specs: [
      { label: 'Make', value: 'Accurate' },
      { label: 'Model', value: 'Cordimesur' },
      { label: 'Accuracy', value: '±2.9 + (L/300) µm' },
      {
        label: 'Max. job size',
        value: 'X 1000 × Y 1800 × Z 800 mm',
        flag: { kind: 'corrected', published: 'X 1000mm * Y 1800mm * Z 800mm' },
      },
      {
        label: 'Second CMM',
        flag: {
          kind: 'missing',
          note: 'The homepage states ACDRI has two CMMs. Only this one is documented — the second machine\'s record is requested (CQ-04).',
        },
      },
    ],
    applications: ['Die measurement', 'Automobile parts', 'Mechanical parts', 'Prototypes'],
    standards: [],
    image: { src: '/images/equipment/coordinate-measuring-machine-accurate.jpg', alt: 'Accurate Cordimesur co-ordinate measuring machine', width: 500, height: 333, needsPhotography: true },
    isAccredited: false,
  },
]

// ---------------------------------------------------------------------------
// Queries. These are the seams that become Payload calls.
// ---------------------------------------------------------------------------

export function getEquipment(slug: string): Equipment | undefined {
  return equipment.find((e) => e.slug === slug)
}

export function getEquipmentByCategory(category: EquipmentCategory): Equipment[] {
  return equipment.filter((e) => e.category === category || e.alsoIn?.includes(category))
}

/** Every distinct ASTM/ISO number in the catalogue, for the standards index. */
export function allStandards(): string[] {
  return [...new Set(equipment.flatMap((e) => e.standards))].sort()
}

export function allMakes(): string[] {
  return [...new Set(equipment.map((e) => e.make).filter((m): m is string => Boolean(m)))].sort()
}

/** Records still awaiting data from ACDRI — drives the CONTENT_QUESTIONS list. */
export function incompleteRecords(): Equipment[] {
  return equipment.filter((e) => e.specs.some((s) => s.flag?.kind === 'missing'))
}
