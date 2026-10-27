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
    h1: 'Design Centre in Pune',
    h2: 'CAD design, reverse engineering and CAE/FEA simulation',
    isAccredited: false,
    summary:
      'CAD design, reverse engineering and CAE/FEA simulation on SOLIDWORKS, Creo Parametric and ANSYS Workbench.',
    intro: [
      "Auto Cluster's Design Centre brings together advanced CAD design, reverse engineering and CAE/FEA simulation to accelerate product development and engineering innovation. With capabilities in SOLIDWORKS, Creo Parametric and ANSYS Workbench, we support the complete engineering journey — from digital modelling and design development to simulation, validation and optimisation.",
      'Our integrated approach enables faster design decisions, reduced development risk, improved product performance and simulation-driven innovation for automotive and engineering applications.',
    ],
    industries: [
      'Automotive',
      'Electric Vehicles (EV)',
      'Industrial Machinery',
      'Manufacturing & Fabrication',
      'Consumer Products',
      'Startups',
      'Other Engineering Industries',
    ],
    capabilities: [
      'SOLIDWORKS — CAD design & 3D modelling',
      'Creo Parametric — CAD design & 3D modelling',
      'ANSYS Workbench — FEA & engineering simulation',
    ],
    capabilitiesNote: 'Our Design Centre is built on the following software platforms.',
    testsHeading: 'Design Centre services',
    tests: [
      {
        name: '3D CAD Modeling',
        body: [
          'Solid modelling: creating three-dimensional solid representations of components or assemblies.',
          'Assembly design: building full product assemblies, ensuring that all components fit together seamlessly.',
        ],
      },
      {
        name: '2D CAD Drafting',
        body: [
          'Detailed drawings: precise 2D technical drawings for manufacturing and assembly.',
          'Design layouts: planning and organising parts and components in 2D layouts for better visualisation and alignment.',
          'Dimensioning & tolerancing: ensuring every component meets the required measurements and specifications.',
        ],
      },
      {
        name: 'Reverse Engineering',
        body: [
          'Scanned data to CAD: converting physical parts or objects into 3D models using 3D scanning or measurement techniques.',
          'Recreating legacy parts: restoring discontinued or damaged parts by reverse engineering them into modern, manufacturable CAD files.',
        ],
      },
      {
        name: 'Parametric and Feature-Based Modeling',
        body: [
          'Parametric design: creating flexible models where part dimensions can be modified parametrically to adjust the design without starting from scratch.',
          'Feature-based design: designing parts from reusable features such as holes, ribs, fillets and extrusions, which speeds up the design process.',
        ],
      },
      {
        name: 'Sheet Metal Design',
        body: [
          'Flat pattern generation: optimised 3D models for sheet metal parts, with accurate 2D flat patterns for fabrication.',
          'Bend and forming simulation: simulating the bending and forming of sheet metal parts to ensure manufacturability and avoid errors.',
        ],
      },
      {
        name: 'Static Structural Analysis (Linear & Non-Linear) & Transient Analysis',
        body: [
          'Determines how a structure or component responds to steady loads, and whether it can safely withstand them without excessive deformation or failure.',
          'Key objectives: assess stress and strain within safe limits, check deformations are acceptable for function, verify the design can carry expected loads without cracking, yielding or breaking, and predict failure points.',
        ],
      },
      {
        name: 'Modal Analysis',
        body: [
          'Determines the natural frequencies and vibration modes of a structure, predicting how it responds to dynamic loads and whether it might resonate.',
          'Key objectives: identify natural frequencies and mode shapes, avoid resonance with operational loads, and improve structural design by shifting natural frequencies away from excitation frequencies.',
        ],
      },
      {
        name: 'Noise & Harmonic Analysis',
        body: [
          'Determines the steady-state response of a structure under sinusoidal, single-frequency excitation.',
          'Key objectives: find amplitude and phase of vibrations across excitation frequencies, identify resonance conditions, and evaluate stresses and displacements from continuous oscillatory forces such as motor vibrations.',
        ],
      },
      {
        name: 'Random Vibration Analysis',
        body: [
          'Assesses structural response under random or broadband excitation, such as turbulence, road-induced vibration during transport, or ground vibration.',
          'Key objectives: predict statistical measures of response (e.g. RMS displacement, acceleration), evaluate fatigue damage from random cyclic loading, and understand behaviour under real-world variable vibration environments.',
        ],
      },
      {
        name: 'Fatigue Analysis',
        body: [
          'Evaluates how a material or structure behaves under repeated or cyclic loading over time, where even loads well below material strength can cause eventual failure.',
          'Key objectives: predict component lifespan, identify high-risk stress concentration zones (holes, notches, welds), prevent unexpected failures, support maintenance planning, and improve design durability.',
        ],
      },
      {
        name: 'Buckling Analysis',
        body: [
          'Determines the critical load at which a structural component will suddenly deform or collapse due to instability, even where material strength is not exceeded.',
          'Key objectives: determine critical buckling load, prevent structural collapse in slender or thin-walled parts, design for stability, and optimise lightweight structures while maintaining stability.',
        ],
      },
      {
        name: 'Computational Fluid Dynamics (CFD) Analysis',
        body: [
          'Simulates and analyses the behaviour of fluids — air, gas, liquid — and their interaction with solid surfaces.',
          'Key objectives: analyse aerodynamics (lift, drag, pressure distribution, lift-to-drag ratio) and predict airflow behaviour, including flow separation, vortices and turbulence around rotors, wings or propeller blades.',
        ],
      },
      {
        name: 'Optimization / Topology Analysis',
        body: [
          'Improves the design of structures by making them lighter, stronger and more efficient while still meeting performance requirements.',
          'Key objectives: reduce weight without compromising strength, distribute material only where it is needed, and maximise performance metrics such as strength-to-weight ratio, stiffness and natural frequency.',
        ],
      },
      {
        name: 'Impact and Crashworthiness Analysis',
        body: [
          'Evaluates how a structure or system behaves under sudden, high-intensity loading — collisions, drops or crashes — to protect critical components and minimise damage.',
          'Key objectives: assess structural integrity under impact (simulate high-speed contact, predict deformation or fracture) and evaluate energy absorption, including crumple zones and impact buffers for safety.',
        ],
      },
    ],
  },

  {
    slug: 'skill-development',
    name: 'Skill Development',
    navLabel: 'Skill Development',
    h1: 'Skill Development at Auto Cluster',
    h2: 'Soft skills, 3D printing, rubber testing and welding training',
    isAccredited: false,
    summary:
      'Soft-skills training, 3D printing modules, rubber testing modules and basic-to-advanced welding training for industry and students.',
    intro: [
      'Auto Cluster is focused on upskilling MSMEs as well as student empowerment and development, bridging the gap between industry and academia so participants gain practical knowledge and industrial exposure under one roof. As part of this, Auto Cluster has signed MoUs with many educational institutes for knowledge sharing and industry awareness.',
      'One innovative and unique programme initiated as part of this is the "Expert Guidance Series".',
      'As part of our association with engineering colleges, more than a thousand students from various engineering colleges have visited the Auto Cluster facility to learn about the latest technologies — such as 3D printing, laser cutting, Xenon weathering equipment and environmental test chambers — and to get acquainted with industrial processes such as lean manufacturing and 5S.',
    ],
    industries: [],
    capabilities: [
      'Soft Skills Trainings',
      '3D Printing Modules',
      'Rubber Testing Modules',
      'Basic Welding Training Centre',
      'Advance Welding Training Centre',
    ],
    capabilitiesNote: 'Auto Cluster offers the following training programmes.',
    testsHeading: 'Courses conducted at Auto Cluster',
    tests: [
      {
        name: 'Confidence Building, Presentation & Communication Skills',
        body: ['Soft-skills training covering confidence building techniques, presentation skills and communication skills.'],
      },
      {
        name: '3D Printing Training',
        body: [
          'Offered as 2-day, 3-day and 5-day training modules on 3D printing technology.',
        ],
      },
      {
        name: 'Rubber Testing Training',
        body: [
          'Covers raw material testing, rubber process, rubber product manufacturing and rubber testing, plus a dedicated 1-day rubber testing training.',
        ],
      },
      {
        name: 'ARC Welding (SMAW)',
        body: [
          'Conducted at our Basic Welding Training Centre, started to meet industry demand for skilled welders. Basic welding provides a strong, permanent and economical way to join metal parts, and is a fundamental manufacturing and maintenance process across many sectors.',
        ],
      },
      { name: 'MIG Welding (GMAW)', body: ['Conducted at our Basic Welding Training Centre.'] },
      { name: 'TIG Welding (GTAW)', body: ['Conducted at our Basic Welding Training Centre.'] },
      {
        name: 'Advanced MIG Welding (GMAW) with Simulator',
        body: [
          'Conducted at our Advance Welding Training Centre, equipped with state-of-the-art welding machines, simulators and robotic systems for hands-on, industry-oriented training across manual, semi-automatic, automated and robotic welding.',
        ],
      },
      {
        name: 'Advanced TIG Welding (GTAW) with Simulator',
        body: ['Conducted at our Advance Welding Training Centre.'],
      },
      {
        name: 'Advanced MIG Robot (Fanuc) Welding',
        body: ['Conducted at our Advance Welding Training Centre on industry-standard Fronius and Fanuc equipment.'],
      },
    ],
    projects: [
      'Student visits: more than 1,000 engineering college students hosted to date, covering 3D printing, laser cutting, Xenon weathering, environmental test chambers and industrial processes such as lean manufacturing and 5S',
      'Expert Guidance Series — an industry-academia knowledge-sharing initiative',
    ],
  },

  {
    slug: 'incubation-centre',
    name: 'Incubation Centre',
    navLabel: 'Incubation Centre',
    h1: 'Incubation Centre at Auto Cluster',
    h2: 'Infrastructure, mentorship and industry connect for start-ups',
    isAccredited: false,
    summary:
      'The first incubation centre in the PCMC area, supporting manufacturing, automobile and product start-ups from concept through to market fit.',
    intro: [
      'The first incubation centre in the PCMC area has been supported by PCMC and the Mahratta Chamber of Commerce, Industries and Agriculture (MCCIA). It was inaugurated by Shravan Hardikar, Commissioner of PCMC, on Wednesday 14 November 2019. Established to strengthen the entrepreneurial ecosystem, the centre supports start-ups with infrastructure, mentorship, industry connect and growth opportunities to help innovative ideas become successful, sustainable ventures.',
      'The incubation programme is designed for innovators, start-ups, community entrepreneurs and enterprises that need intensive hand-holding and access to physical infrastructure in Pune, and is sector-agnostic with a main focus on manufacturing, automobile and product-based start-ups. Eligibility requires a validated, innovative idea; applicants submit an inquiry, go through internal screening and a jury round, and selected ventures are incubated for an 18-month programme.',
    ],
    industries: ['Manufacturing', 'Automobile', 'Product-based start-ups'],
    capabilities: [
      'Modern Co-Working Space',
      'Business Mentoring & Guidance',
      'Business Networking',
      'Easy Access to In-house Designing, Prototyping and Testing Facilities',
    ],
    capabilitiesNote: 'The incubation programme offers four pillars of support.',
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

  {
    slug: 'battery-cell-testing-lab',
    name: 'Battery and Cell Testing Lab',
    navLabel: 'Battery & Cell Testing',
    h1: 'Battery and Cell Testing Lab in Pune',
    h2: 'NABL-accredited testing for EV cells, modules and battery packs',
    isAccredited: true,
    summary:
      'NABL-accredited testing and validation for electric vehicle cells, modules and battery packs.',
    intro: [
      'As a NABL-accredited laboratory, Auto Cluster provides testing and validation services for electric vehicle (EV) cells, modules and battery packs. Equipped with testing technology for energy storage systems, we help ensure your products meet safety, performance and regulatory compliance standards.',
      'Whether you are in the R&D phase, validating a new design, or performing routine quality checks, our testing data helps you accelerate time to market with confidence.',
    ],
    industries: ['Automotive', 'Electric Vehicles (EV)'],
    capabilities: [
      'NABL Accredited Facility — international standards of quality, traceability and technical competence in cells and batteries',
      'End-to-End Testing Ecosystem — from individual cells to high-voltage automotive battery packs',
      'Precision Equipment — battery cyclers and environmental chambers for accurate data',
      'Actionable Analytics — comprehensive, compliant test reports that simplify certification pathways',
    ],
    capabilitiesNote: 'Why partner with our Battery and Cell Testing Lab?',
    testsHeading: 'Our testing capabilities',
    tests: [
      {
        name: 'Cell-Level Testing',
        body: [
          'Capacity & efficiency: precise verification of charge/discharge rates, Coulombic efficiency and energy density.',
          'Cycle life analysis: automated, long-term testing to simulate years of real-world battery degradation.',
          'Internal resistance (DCIR): evaluation of internal resistance to optimise thermal management and performance.',
        ],
      },
      {
        name: 'Battery Pack & Module Validation',
        body: [
          'Dynamic performance: simulation of real-world drive cycles to test battery responses under stress.',
          'Thermal & environmental stress: evaluating pack performance inside environmental chambers across extreme temperatures (-70°C to +200°C).',
          'BMS integration & calibration: validating Battery Management System accuracy, overcharge protection and cell balancing protocols.',
        ],
      },
      {
        name: 'Safety & Abuse Testing',
        body: [
          'Electrical abuse: testing for overcharge, over-discharge and over-temperature protection.',
          'Mechanical integrity: evaluating resistance to vibration, shock and structural impact.',
        ],
      },
    ],
  },
]

export function getFacility(slug: string): Facility | undefined {
  return facilities.find((f) => f.slug === slug)
}

/** Facilities shown in the main grid — excludes the NABL scope document page. */
export const primaryFacilities = facilities.filter((f) => f.slug !== 'nabl-scope')
