import type { Facility } from '@/lib/types'

/**
 * The nine facility pages.
 *
 * Copy is carried over from the live site with the corrections listed in
 * CONTENT_QUESTIONS.md §B applied. Where the source had near-duplicate test
 * descriptions (environmental items 1/2/3/10 were ~90% identical; RPL items
 * 9/15 and 12/13 substantially overlapped), the tests are differentiated
 * rather than dropped — no test method is lost.
 *
 * Test standards are attached to each method. The source cites none on either
 * testing page, even though the machine records carry them — for a NABL lab
 * that was the most conspicuous omission on the site.
 */

export const facilities: Facility[] = [
  {
    slug: 'prototype-production-facility',
    name: 'Prototype Production Facility',
    navLabel: 'Prototype Production Facility',
    h1: 'Prototype Production Facility in Pune',
    h2: 'Precision and high quality VMC machining centre',
    category: 'prototype',
    isAccredited: false,
    summary:
      'Vertical machining, fixturing, tooling and laser cutting for automotive, heavy engineering and e-vehicle work.',
    intro: [
      'Auto Cluster is a prototype production and vertical machining centre facility based in Pune. We are experts in prototyping, fixturing, tooling and laser cutting.',
      'The automotive industry innovates constantly, and every new product needs prototypes and testing. To serve that we operate a large VMC machining centre in Pune. We are associated with various institutes and support them in skill development.',
      'We work with MSMEs and provide cost-effective machining and prototyping solutions.',
    ],
    // Deduplicated: "Heavy engineering" appeared in both source columns.
    industries: [
      'Dies and mould makers',
      'Fixture manufacturers',
      'Tooling',
      'Heavy engineering',
      'Automotive',
      'Educational start-ups',
      'E-vehicles',
    ],
    projects: [
      'Intricate machining of automotive engine heads',
      'Machining of critical, high-finish metal dies',
      'Fixturing to MSME requirements',
      'Complex laser cutting of sheet metal form parts',
    ],
    team: [
      'Amit Desai',
      'Kiran Gojare',
      'Sagar Shemane',
      'Pramod Dhade',
      'Parag Patil',
      'Shivanand Kokulwar',
      'Suresh Dalavi',
      'Sandeep Mohite',
      'Shambhaji Khetmali',
      'Gajanan Wadkar',
    ],
  },

  {
    slug: 'rapid-prototyping',
    name: 'Rapid Prototype Centre',
    navLabel: 'Rapid Prototyping',
    h1: 'Rapid Prototype Centre in Pune',
    h2: '3D printing fulfilling all types of rapid prototyping requirements',
    category: 'rapid-prototyping',
    isAccredited: false,
    summary:
      'SLA, SLS, FDM and vacuum casting for automotive, medical, architectural and defence work.',
    intro: [
      'Auto Cluster operates an established rapid prototyping centre in Pune. ACDRI holds the latest 3D printing technology, with SLA, SLS, FDM and vacuum casting all available.',
      'We serve MSMEs looking for a cost-effective route to prototype parts rather than buying costly machines outright.',
    ],
    industries: [
      'Automotive component manufacturers',
      'Medical equipment manufacturers',
      'Architectural',
      'Educational start-ups',
      'Defence',
      'E-vehicles',
      'Automotive heavy engineering',
    ],
    // Reframed from "Recently our team completed…" — this is 2020 work.
    projects: [
      'COVID-19 response, 2020: prototype development for medical instruments including oximeters and temperature guns, face shields, masks and hands-free door openers, supporting R&D operations for medical equipment manufacturers',
    ],
    team: [
      'Avinash Wadkar',
      'Raj Shenavi',
      'Kiran Gojare',
      'Yogesh Apune',
      'Milind Chandashive',
      'Pratik Sabale',
    ],
  },

  {
    slug: 'environmental-testing',
    name: 'Environmental Testing',
    navLabel: 'Environmental Testing',
    h1: 'Environmental Testing in Pune',
    h2: 'Measure the performance of your equipment under various environmental conditions',
    category: 'environmental',
    isAccredited: true,
    summary:
      'Thermal shock, cyclic temperature and humidity, salt spray, water and dust ingress, and vibration with coupled chamber.',
    intro: [
      'Environmental testing measures the performance of equipment under specified environmental conditions — extreme high and low temperatures, blown and settling sand and dust, salt spray and salt fog, very high or low humidity, and more. Such tests are most commonly performed for aeronautical, space and automotive applications.',
      'In environmental testing, most parts, components and sub-assemblies are validated against national and international test standards. An environmental chamber, also called a climatic chamber, is used for these tests, exposing products to controlled conditions. At Auto Cluster we serve more than 200 MSME, OEM and MNC customers in environmental testing. We are also equipped to undertake special projects such as water drop testing.',
    ],
    // Source ran items 2 and 3 together as one bullet, "High Low Cyclic
    // Temperature Salt Spray" — split back into the two chambers it names.
    // docs/audit/09-environmental-testing.md § Capabilities.
    capabilities: [
      'Thermal Shock',
      'High Low Cyclic Temperature',
      'Salt Spray',
      'Water Spray',
      'Dust Spray',
      'Vibration Shaker with Coupled Chamber',
    ],
    industries: [
      'Automotive component manufacturers',
      'Medical equipment manufacturers',
      'Architectural',
      'Educational start-ups',
      'Defence',
      'E-vehicles',
    ],
    tests: [
      {
        name: 'High Temperature Test',
        body: [
          'Sustained exposure at elevated temperature, with controlled relative humidity, to reveal defects in automotive, electrical and electronic components caused by heat and moisture ingress.',
          'Conducted in our high-low chamber, thermal shock chamber or temperature-coupled vibration chamber.',
        ],
      },
      {
        name: 'Low Temperature Test',
        body: [
          'Sustained exposure at low temperature to reveal embrittlement, contraction and seal failure in automotive and electrical components.',
          'Conducted in our high-low chamber or temperature-coupled vibration chamber.',
        ],
      },
      {
        name: 'Humidity Test',
        body: [
          'Controlled relative humidity at a held temperature, to reveal moisture ingress, corrosion and insulation breakdown.',
          'Conducted in our high-low chamber.',
        ],
      },
      {
        name: 'Climatic Test',
        body: [
          'Temperature cycling across a defined profile with controlled relative humidity, producing a breathing action of temperature and moisture through the specimen.',
          'Conducted in our high-low chamber, thermal shock chamber or temperature-coupled vibration chamber.',
        ],
      },
      {
        name: 'Thermal Shock Test',
        body: [
          'Rapid transition between two temperature extremes, reducing the risk of field failure by revealing defects caused by sudden temperature change.',
          'Conducted in our thermal shock chamber.',
        ],
      },
      {
        name: 'Water Spray Test',
        body: [
          'Determines the stability of automotive, electronic and electrical items under rain and shower spray. The item is examined for undue water penetration, then inspected visually and checked electrically and mechanically against the relevant specification.',
        ],
        standards: ['IEC 60529 (IP ratings)'],
      },
      {
        name: 'Rain Test',
        body: [
          'Directed spray reproducing driving rain, for items that must remain serviceable in exposed conditions. Conducted in our rain test chamber.',
        ],
        standards: ['IEC 60529 (IP ratings)'],
      },
      {
        name: 'Dust Spray Test',
        body: [
          'Determines stability under dust-laden conditions. The item is examined for undue dust penetration, then inspected visually and checked electrically and mechanically against the relevant specification.',
        ],
        standards: ['IEC 60529 (IP ratings)'],
      },
      {
        name: 'Salt Spray Test',
        body: [
          'Relative corrosion resistance of metals and coated metals in a salt fog atmosphere, identifying the onset of corrosion by visual inspection.',
          'Conducted in our mini and large salt spray chambers.',
        ],
        standards: ['ASTM B117'],
      },
      {
        name: 'Vibration Test',
        body: [
          'Simulated vibration and mechanical shock to a designated profile, identifying lifecycle limits, mechanical breakage and crack initiation.',
          'Conducted on our vibration shaker with coupled chamber, allowing vibration and temperature to be applied together.',
        ],
      },
      {
        name: 'Ageing Test',
        body: [
          'Sustained thermal exposure at designated conditions to assess thermal ageing of automotive, electrical and other components.',
        ],
      },
    ],
    team: [
      'Amit Desai',
      'Abhijit Shinde',
      'Prathamesh Phansekar',
      'Prashant Patil',
      'Jayesh Wagh',
    ],
  },

  {
    slug: 'rubber-polymer-testing',
    name: 'Rubber and Polymer Testing Lab',
    navLabel: 'Rubber & Polymer Testing',
    h1: 'Rubber and Polymer Testing Lab in Pune',
    h2: 'Various types of rubber, polymer and mechanical tests',
    category: 'rubber-polymer',
    isAccredited: true,
    summary:
      'Polymer and material identification, thermal analysis and mechanical testing — FTIR, TGA, DSC, UTM, ozone and weathering.',
    intro: [
      "Auto Cluster's Rubber Polymer Laboratory (RPL) is one of the leading laboratories in this region holding NABL ISO/IEC 17025:2017 and ISO 9001:2015 accreditation. Our customer base has passed 900, with more than 100 new customers added every year.",
      'Our testing scope and capability for rubber and polymer materials ranges from polymer identification and material identification through to full mechanical testing.',
    ],
    industries: [
      'Automotive component manufacturers',
      'Medical equipment manufacturers',
      'Architectural',
      'Educational start-ups',
      'Defence',
    ],
    tests: [
      {
        name: 'FTIR Testing',
        body: [
          'Identifies organic and inorganic materials in a substance. We use it for polymer identification and for identifying unknown materials across rubber and polymer products.',
        ],
        standards: ['ASTM E1252'],
      },
      {
        name: 'TGA Testing',
        body: [
          'Thermogravimetric analysis measures mass change with temperature, identifying the composition of a material — polymer content, filler content and ash content.',
        ],
      },
      {
        name: 'DSC Testing',
        body: [
          'Differential scanning calorimetry identifies how the properties of a material change with temperature over time, determining melting point, crystallisation and degradation.',
        ],
        standards: ['ASTM E928', 'ASTM D1525', 'ASTM D648'],
      },
      {
        name: 'Material Testing',
        body: [
          'Identification of unknown material in a sample, and polymer identification for rubber and polymer manufacturers. Conducted on our FTIR spectrometer.',
        ],
        standards: ['ASTM E1252'],
      },
      {
        name: 'Tensile Testing',
        body: [
          'Stress against strain to failure, determining tensile strength, elongation and modulus. Conducted on our Tinius Olsen universal testing machine.',
        ],
        standards: ['ASTM D412', 'ASTM D638'],
      },
      {
        name: 'Flexural Testing',
        body: [
          'Measures flexural strength and flexural modulus — the force required to bend a beam of material, and its resistance to flexing. Conducted on our universal testing machine.',
        ],
        standards: ['ISO 178'],
      },
      {
        name: 'Mechanical Testing',
        body: [
          'The full mechanical property set for rubber and polymer materials, combining tensile, flexural, hardness and impact methods on one sample set.',
        ],
        standards: ['ASTM D412', 'ISO 178', 'ASTM D2240'],
      },
      {
        name: 'Fatigue Testing',
        body: [
          'Cyclic loading to assess the life of a component and the strength of the material under application conditions. Conducted on our Instron actuator.',
        ],
      },
      {
        // Source item 11 described flexural testing verbatim — the body text
        // was pasted from item 10 and never rewritten. Rewritten here. CQ §E.
        name: 'Endurance Testing',
        body: [
          'Extended cyclic loading at service conditions to establish how long a component survives in use, and where it fails first. Distinct from fatigue testing in duration and in the acceptance criterion — endurance runs to a target life rather than to failure. Conducted on our Instron actuator.',
        ],
      },
      {
        name: 'Impact Testing',
        body: [
          'Izod, Charpy and tensile impact, notched and un-notched, on our CEAST Resil Impactor.',
        ],
        standards: ['ISO 180', 'ISO 179'],
      },
      {
        name: 'Ozone Testing',
        body: [
          'Determines the effect of an ozone atmosphere on a strained rubber sample, establishing cracking criteria. Conducted in our ozone chamber.',
        ],
        standards: ['ASTM D1171', 'ASTM D1149'],
      },
      {
        name: 'Xenon Weathering Testing',
        body: [
          'Xenon-arc exposure reproducing full-spectrum sunlight with moisture, heat and water spray. Used across rubber, polymer, paint, cosmetics, adhesives, sealants, printing ink, packaging, textile and pharmaceutical products.',
        ],
      },
      {
        name: 'Weathering Testing',
        body: [
          'Accelerated UV weathering with condensation, heat and water spray, on our Q-Lab QUV Weather-Ometer. Used across the same industries as xenon weathering, where UV-B exposure is the governing condition.',
        ],
      },
      {
        name: 'Thermal Testing',
        body: [
          'Validation of physical property change under thermal load, using ovens, hardness testers and tensile and density measurement.',
        ],
      },
      {
        name: 'Heat Ageing Testing',
        body: [
          'Determines change in physical properties after prolonged exposure to heat, using ovens followed by hardness, tensile and density measurement.',
        ],
      },
      {
        name: 'Oil Ageing Testing',
        body: [
          'Determines change in physical properties after immersion in oil or fuel at temperature — swelling, hardness change and loss of tensile strength.',
        ],
      },
    ],
    team: [
      'Amit Desai',
      'Prathamesh Phansekar',
      'Geetali Deshpande',
      'Supriya Sattigeri',
      'Rohit Raserao',
      'Vrushali Thete',
      'Swapnil Adagale',
      'Awadhoot Mahadik',
      'Digvijay Jagtap',
    ],
  },

  {
    slug: 'large-bed-cmm-services',
    name: 'Large Bed CMM and Metrology Services',
    navLabel: 'Large Bed CMM & Metrology',
    h1: 'Large Bed CMM and Metrology Services in Pune',
    h2: 'Co-ordinate measurement for dies, large parts and prototypes',
    category: 'metrology',
    isAccredited: false,
    summary:
      'Co-ordinate measuring for dies, automobile parts, mechanical parts and prototypes on a large bed.',
    intro: [
      'Our co-ordinate measuring machines provide dimensional measurement of dies, automobile parts, mechanical parts and prototypes on a large measuring bed.',
    ],
    industries: ['Dies and mould makers', 'Automotive', 'Heavy engineering', 'Tooling'],
    pendingCapture: true,
  },

  {
    slug: 'design-centre',
    name: 'Design Centre',
    navLabel: 'Design Centre',
    h1: 'Design Centre',
    h2: 'Product design and development support for MSMEs',
    isAccredited: false,
    summary: 'Design and development support for product concepts through to validation.',
    intro: [],
    industries: [],
    pendingCapture: true,
  },

  {
    slug: 'skill-development',
    name: 'Skill Development',
    navLabel: 'Skill Development',
    h1: 'Skill Development',
    h2: 'Training programmes for industry employees and students',
    isAccredited: false,
    summary:
      'Training programmes improving confidence, competence and reliability for employees and students.',
    intro: [],
    industries: [],
    pendingCapture: true,
  },

  {
    slug: 'incubation-centre',
    name: 'Incubation Centre',
    navLabel: 'Incubation Centre',
    h1: 'Incubation Centre',
    h2: 'Support for start-ups and new product development',
    isAccredited: false,
    summary: 'Infrastructure and guidance for start-ups from concept through to validation.',
    intro: [],
    industries: [],
    pendingCapture: true,
  },

  {
    slug: 'nabl-scope',
    name: 'NABL Scope of Accreditation',
    navLabel: 'NABL Scope',
    h1: 'NABL Scope of Accreditation',
    h2: 'Our accredited testing scope under ISO/IEC 17025:2017',
    isAccredited: true,
    summary:
      'The tests, materials and standards covered by our NABL ISO/IEC 17025:2017 accreditation.',
    intro: [
      'Auto Cluster holds NABL accreditation to ISO/IEC 17025:2017 for its Rubber Polymer Laboratory and environmental testing facilities.',
    ],
    industries: [],
    pendingCapture: true,
  },
]

export function getFacility(slug: string): Facility | undefined {
  return facilities.find((f) => f.slug === slug)
}

/** Facilities shown in the main grid — excludes the NABL scope document page. */
export const primaryFacilities = facilities.filter((f) => f.slug !== 'nabl-scope')
