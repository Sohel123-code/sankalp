/**
 * SANKALP Andhra 2026 — Master Data Store
 * Contains all official summit information, tracks, schedule, workshops,
 * fee structures, FAQs, and policy details.
 */

export const SUMMIT_INFO = {
  name: 'SANKALP Andhra 2026',
  shortName: 'SANKALP 2026',
  officialDescription: 'Andhra Pradesh Technology Summit',
  tagline: 'From Research to Real-World Impact',
  supportingDescription:
    'Connecting research, industry and higher education to build the next generation of technology.',
  format: 'Proposed Two-Day Technology Summit',
  dates: 'Dates and venue to be announced',
  venue: 'Andhra Pradesh, India (Venue details to be confirmed)',
  statusNotice:
    'Proposed summit details. Dates, venue, fees, and session allocations are preliminary and subject to formal institutional approval.',
  purpose:
    'Connect students, researchers, universities, technology companies, startups, government, investors, and industry partners to transform research and emerging technologies into practical solutions.',
  mainFocus: [
    'Research and development',
    'Industry–academia collaboration',
    'Emerging technologies',
    'Hands-on technical workshops',
    'Innovation and prototype development',
    'Startup and investor networking',
    'Technology commercialisation',
  ],
}

export const HIGHLIGHTS = [
  { num: '2', label: 'Summit Days', icon: '', desc: 'Dense days of deep-tech keynotes, panels & networking' },
  { num: '4', label: 'Technology Tracks', icon: '', desc: 'AI, Quantum, Industry 4.0 & Precision Health' },
  { num: '4', label: 'Specialist Workshops', icon: '', desc: 'Intensive hands-on labs with real outputs' },
  { num: '3', label: 'Open Summit Labs', icon: '', desc: 'Rapid sprint, deep-tech design & venture build' },
  { num: '2', label: 'Panel Discussions', icon: '', desc: 'Academia-industry bridge & path to market' },
  { num: '1', label: 'CEO Dialogue', icon: '', desc: 'Investor expectations & routes to commercialisation' },
  { num: '1', label: 'Innovation Challenge', icon: '', desc: 'Elevator pitches with multi-tier evaluation' },
  { num: '1', label: 'Tech Showcase', icon: '', desc: 'R&D demos from universities & tech ventures' },
  { num: '1', label: 'Investor Connect', icon: '', desc: 'Dedicated commercialisation & pilot meeting hub' },
  { num: '2', label: 'Cultural Evenings', icon: '', desc: 'Celebrating the heritage of Andhra Pradesh' },
]

export const TARGET_AUDIENCE = [
  {
    role: 'Students & Scholars',
    desc: 'Undergraduate, post-graduate and PhD researchers looking for mentorship, workshops, and startup pathways.',
    icon: '',
  },
  {
    role: 'Faculty & Universities',
    desc: 'Academic leaders and researchers seeking industry partnerships, translational grants, and curriculum innovation.',
    icon: '',
  },
  {
    role: 'Startups & Entrepreneurs',
    desc: 'Early and growth-stage deep-tech founders aiming to validate prototypes, access investors, and deploy pilots.',
    icon: '',
  },
  {
    role: 'Corporate R&D & Industry',
    desc: 'Technology firms, manufacturers, and enterprises scouting collaborative research and next-gen tech talent.',
    icon: '',
  },
  {
    role: 'Investors & Angels',
    desc: 'Venture capitalists, family offices, and angel syndicates looking for high-impact science and engineering ventures.',
    icon: '',
  },
  {
    role: 'Government & Agencies',
    desc: 'Public policy makers, state departments, and technology missions driving regional innovation policy.',
    icon: '',
  },
]

export const WHY_SANKALP = [
  {
    title: 'Research-to-Impact Pipeline',
    desc: 'Move beyond theoretical papers. SANKALP provides the structured pathway from laboratory discovery to validated deployment.',
    icon: '',
  },
  {
    title: 'Multidisciplinary Convergence',
    desc: 'Bringing together artificial intelligence, quantum systems, industrial automation, and biotechnology under one roof.',
    icon: '',
  },
  {
    title: 'Actionable Hands-On Learning',
    desc: 'No passive lectures. Participate in 4 specialist technical workshops and 3 sprint labs producing tangible prototypes.',
    icon: '',
  },
  {
    title: 'Commercialisation & Capital',
    desc: 'Direct interaction with venture capitalists, industry challenge owners, and public sector pilot programs.',
    icon: '',
  },
  {
    title: 'Talent Acceleration',
    desc: 'Connect top student engineers and researchers from across Andhra Pradesh with national and global technology pioneers.',
    icon: '',
  },
  {
    title: 'Ethical & Responsible Tech',
    desc: 'A dedicated focus on scientific rigor, privacy, safety, data ethics, and regional societal relevance.',
    icon: '',
  },
]

export const ABOUT_DETAILS = {
  vision:
    'Strengthen a collaborative innovation ecosystem in Andhra Pradesh that connects scientific research, higher education, industry and public priorities to accelerate responsible technology development and real-world impact.',
  mission:
    'Create a platform where researchers, students, institutions, startups, industry and public agencies can identify meaningful problems, exchange expertise, develop solution concepts and explore validation, deployment and commercialisation.',
  objectives: [
    'Strengthen collaboration between universities, research organisations, government, industry and startups.',
    'Facilitate industry-led problem identification.',
    'Translate research into practical applications and prototypes.',
    'Support future-ready talent through technical sessions and hands-on learning.',
    'Promote research-led entrepreneurship.',
    'Identify potential collaborative projects and pilot deployments.',
    'Encourage responsible innovation, privacy, safety and scientific rigour.',
  ],
  workflow: [
    { step: 1, name: 'Discover', desc: 'Identify foundational scientific breakthroughs and emerging capabilities.' },
    { step: 2, name: 'Define', desc: 'Map scientific insights to critical industry and public sector problems.' },
    { step: 3, name: 'Build', desc: 'Develop technical prototypes, algorithms, and engineering models.' },
    { step: 4, name: 'Validate', desc: 'Stress-test solutions with industry benchmarks, field datasets, and pilot cohorts.' },
    { step: 5, name: 'Deploy', desc: 'Roll out working systems in controlled testbeds and live operational environments.' },
    { step: 6, name: 'Scale', desc: 'Commercialise, secure growth capital, and scale statewide and globally.' },
  ],
}

export const TRACKS = [
  {
    id: 'ai',
    number: '01',
    title: 'Artificial Intelligence & Applied Intelligence',
    shortTitle: 'AI & Applied Intelligence',
    theme: 'AI for Impact: From Generative AI and Foundation Models to Real-World Innovation',
    icon: '',
    color: '#8b5cf6',
    description:
      'Exploring the frontier of foundational intelligence models, multi-agent frameworks, computer vision, and applied machine learning solving real-world challenges across agriculture, healthcare, education, logistics, and governance.',
    topics: [
      'Generative AI & LLM Systems',
      'Foundation Models & Fine-Tuning',
      'Machine Learning & Deep Neural Nets',
      'Retrieval-Augmented Generation (RAG)',
      'Autonomous AI Agents & Orchestration',
      'Computer Vision & Visual Intelligence',
      'Speech Technologies & Indian Indic NLP',
      'Multimodal AI Systems',
      'Predictive Analytics & Decision Support',
      'AI for Agriculture, Healthcare & Governance',
    ],
  },
  {
    id: 'quantum',
    number: '02',
    title: 'Quantum Technologies',
    shortTitle: 'Quantum Tech',
    theme: 'Quantum Leap: From Scientific Discovery to Industrial Applications',
    icon: '',
    color: '#06b6d4',
    description:
      'Examining quantum computing algorithms, cryogenic hardware, quantum sensing, photonic interconnections, and post-quantum cryptographic standards protecting digital infrastructure.',
    topics: [
      'Quantum Computing Architectures',
      'Quantum Algorithms & Simulation',
      'Quantum Sensing & Metrology',
      'Secure Quantum Communications',
      'Quantum Key Distribution (QKD)',
      'Photonic Quantum Systems',
      'Quantum Materials & Superconductors',
      'Quantum Hardware & Cryogenics',
      'Precision Measurement Systems',
      'Post-Quantum Cryptography (PQC)',
    ],
  },
  {
    id: 'manufacturing',
    number: '03',
    title: 'Intelligent Manufacturing & Industry 4.0',
    shortTitle: 'Intelligent Manufacturing',
    theme: 'Design to Deployment: Advancing Andhra Pradesh’s Next Industrial Revolution',
    icon: '',
    color: '#f59e0b',
    description:
      'Pioneering smart factories, cyber-physical systems, autonomous robotics, digital twins, and additive manufacturing to empower industrial corridors and manufacturing clusters across Andhra Pradesh.',
    topics: [
      'Industrial AI & Edge Inference',
      'Autonomous Robotics & Cobots',
      'Digital Twins & Simulation Ensembles',
      'Industrial Internet of Things (IIoT)',
      'Predictive Maintenance & Health Monitoring',
      'Smart Factory Cyber-Physical Systems',
      'Advanced Automation & PLC Modernisation',
      'Machine Vision & Optical Quality Control',
      'Additive Manufacturing & 3D Printing',
      'Process Optimisation & Energy Efficiency',
    ],
  },
  {
    id: 'biotech',
    number: '04',
    title: 'Biotechnology, Healthcare & Precision Health',
    shortTitle: 'Biotech & Precision Health',
    theme: 'Precision Health and Bioengineering: Advancing Next-Generation Healthcare in Andhra Pradesh',
    icon: '',
    color: '#10b981',
    description:
      'Harnessing genomic discovery, AI-augmented biological design, point-of-care diagnostic biosensors, and advanced biomanufacturing to transform clinical outcomes and public health equity.',
    topics: [
      'Bioinformatics & Multi-Omics Pipelines',
      'Genomics & Gene Engineering Concepts',
      'AI-Enabled Biological Discovery',
      'Point-of-Care Diagnostic Devices',
      'Microfluidics & Biosensors',
      'Medical Imaging & AI Pathology',
      'Remote Patient Monitoring & Telehealth',
      'Biomanufacturing & Bioprocess Scaling',
      'Biomaterials & Tissue Engineering',
      'Vaccine Technologies & Biologics',
      'Agricultural Biotechnology & Bio-fertilizers',
    ],
  },
]

export const SCHEDULE = {
  disclaimer:
    'Proposed schedule subject to institutional confirmation. Note: Day 1 includes concurrent and overlapping sessions that will be streamlined in the final approved programme.',
  day1: {
    day: 'Day 1',
    title: 'Research, Industry & Strategic Dialogue',
    date: 'Date to be announced',
    sessions: [
      {
        time: '8:30 – 9:30 AM',
        title: 'Registration & Delegate Check-In',
        type: 'Registration',
        location: 'Main Foyer & Reception',
        desc: 'Delegate registration, kit collection, badge distribution, and morning welcome coffee.',
      },
      {
        time: '9:30 – 10:30 AM',
        title: 'Inaugural Ceremony & Welcome Addresses',
        type: 'Inaugural',
        location: 'Main Auditorium',
        desc: 'Opening protocol, lamp lighting, address by university dignitaries, state technology representatives, and industry leaders.',
        overlapNotice: 'Note: May overlap with keynote in draft schedule; final alignment in progress.',
      },
      {
        time: '10:20 – 11:10 AM',
        title: "Inaugural Keynote: Research-to-Impact & Andhra Pradesh's Technology Opportunity",
        type: 'Keynote',
        location: 'Main Auditorium',
        desc: 'Visionary keynote addressing regional deep-tech infrastructure, higher education transformation, and industry translation pathways.',
      },
      {
        time: '11:10 – 11:30 AM',
        title: 'High Tea & Networking Break',
        type: 'Break',
        location: 'Atrium & Exhibition Hall',
        desc: 'Networking opportunity with delegates, university faculty, speakers, and exhibitors.',
      },
      {
        time: '11:30 AM – 12:10 PM',
        title: 'Plenary Talk I: AI for Impact — Generative AI, Foundation Models & Intelligent Agents',
        type: 'Plenary',
        location: 'Main Auditorium',
        track: 'Track 1: AI',
        desc: 'Deep exploration of large foundational systems, enterprise agent orchestration, and domain-grounded intelligence.',
      },
      {
        time: '12:10 – 12:50 PM',
        title: 'Plenary Talk II: Quantum Leap — From Research to Industrial Applications',
        type: 'Plenary',
        location: 'Main Auditorium',
        track: 'Track 2: Quantum',
        desc: 'Bridging fundamental quantum physics with commercial algorithms, quantum security, and national quantum mission priorities.',
      },
      {
        time: '12:50 – 1:35 PM',
        title: 'Networking Lunch',
        type: 'Lunch',
        location: 'Dining Concourse',
        desc: 'Buffet lunch included for all registered delegates.',
      },
      {
        time: '1:35 – 2:15 PM',
        title: 'Featured Talk I: Intelligent Manufacturing, Digital Twins & Industrial AI',
        type: 'Featured',
        location: 'Main Auditorium',
        track: 'Track 3: Manufacturing',
        desc: 'Modernising industrial production with real-time sensor streams, edge machine vision, and closed-loop process automation.',
      },
      {
        time: '2:15 – 2:55 PM',
        title: 'Featured Talk II: Biotechnology, AI-Enabled Discovery & Precision Health',
        type: 'Featured',
        location: 'Main Auditorium',
        track: 'Track 4: Biotech',
        desc: 'Translating computational biology and molecular informatics into accessible clinical devices and diagnostic tools.',
      },
      {
        time: '2:55 – 3:45 PM',
        title: 'Panel Discussion I: Bridging Research, Industry and Higher Education',
        type: 'Panel',
        location: 'Main Auditorium',
        desc: 'Eminent vice-chancellors, chief technology officers, and startup founders discuss removing systemic friction in academic patent commercialisation.',
      },
      {
        time: '3:45 – 4:00 PM',
        title: 'Afternoon Tea Break',
        type: 'Break',
        location: 'Atrium',
        desc: 'Brief tea break before the executive dialogue.',
      },
      {
        time: '4:00 – 4:40 PM',
        title: 'CEO Dialogue: Innovation Pitching, Investor Expectations & Routes to Commercialisation',
        type: 'Dialogue',
        location: 'Main Auditorium',
        desc: 'Fireside conversation with industry CEOs and investment leaders on unit economics, IP protection, and pilot market entry.',
      },
      {
        time: '4:40 PM onwards',
        title: 'Research & Technology Showcase, Exhibition & Strategic Networking',
        type: 'Showcase',
        location: 'Showcase Pavilions',
        desc: 'Interactive walkthrough of university research exhibits, corporate R&D demonstrations, and startup prototypes.',
        overlapNotice: 'Exhibition runs concurrently with early evening cultural assemblies.',
      },
      {
        time: '5:00 – 6:30 PM',
        title: 'SANKALP Cultural Programme Day 1',
        type: 'Cultural',
        location: 'Open-Air Amphitheatre',
        desc: 'Celebrating classical music, dance, and cultural traditions of Andhra Pradesh.',
      },
    ],
  },
  day2: {
    day: 'Day 2',
    title: 'Hands-on Innovation & Industry Connect',
    date: 'Date to be announced',
    sessions: [
      {
        time: '8:30 – 9:00 AM',
        title: 'Registration & Workshop Check-In',
        type: 'Registration',
        location: 'Seminar Block Foyer',
        desc: 'Morning verification and credential check for specialist workshop attendees.',
      },
      {
        time: '9:00 – 9:15 AM',
        title: 'Workshop & Open Summit Programme Orientation',
        type: 'Briefing',
        location: 'Seminar Complex Central Hall',
        desc: 'Safety guidelines, computing environment setup, and deliverable submission protocols.',
      },
      {
        time: '9:15 AM – 1:00 PM',
        title: 'Four Specialist Workshops & Open Summit Labs (Parallel Tracks)',
        type: 'Workshops',
        location: 'Seminar Halls I–IV & Main Auditorium',
        desc: 'Deep-dive intensive sessions running concurrently across 4 technical domains alongside Open Summit Labs.',
      },
      {
        time: '1:00 – 1:45 PM',
        title: 'Networking Lunch',
        type: 'Lunch',
        location: 'Dining Concourse',
        desc: 'Buffet lunch and informal interactions between workshop teams and mentors.',
      },
      {
        time: '1:45 – 1:50 PM',
        title: 'Main-Stage Welcome & Afternoon Briefing',
        type: 'Briefing',
        location: 'Main Auditorium',
        desc: 'Reconvene delegates for track-specific invited presentations and pitch competitions.',
      },
      {
        time: '1:50 – 2:20 PM',
        title: 'Invited Talk I: Deploying Generative AI & Intelligent Agents in Real-World Settings',
        type: 'Invited Talk',
        location: 'Main Auditorium',
        track: 'Track 1: AI',
        desc: 'Practical operational challenges, governance, guardrails, and latency optimisation in production.',
      },
      {
        time: '2:20 – 2:50 PM',
        title: 'Invited Talk II: Quantum Technologies — Industry Pathways for Computing & Sensing',
        type: 'Invited Talk',
        location: 'Main Auditorium',
        track: 'Track 2: Quantum',
        desc: 'Near-term hybrid classical-quantum workflows and commercial sensing applications.',
      },
      {
        time: '2:50 – 3:20 PM',
        title: 'Invited Talk III: Industrial AI, Digital Twins and Predictive Maintenance',
        type: 'Invited Talk',
        location: 'Main Auditorium',
        track: 'Track 3: Manufacturing',
        desc: 'Case studies from heavy engineering, automotive manufacturing, and aerospace plants.',
      },
      {
        time: '3:20 – 3:30 PM',
        title: 'Brief Tea Break',
        type: 'Break',
        location: 'Foyer',
        desc: 'Refreshment break before concluding sessions.',
      },
      {
        time: '3:30 – 4:00 PM',
        title: 'Invited Talk IV: AI-Enabled Biomedical Analytics & Precision Health',
        type: 'Invited Talk',
        location: 'Main Auditorium',
        track: 'Track 4: Biotech',
        desc: 'Clinical validation, regulatory approvals for medical AI, and ethical patient-data stewardship.',
      },
      {
        time: '4:00 – 4:35 PM',
        title: 'Panel Discussion II: From Prototype to Market — Validation, Partnerships & Scale',
        type: 'Panel',
        location: 'Main Auditorium',
        desc: 'Incubator heads, angel syndicates, and corporate venture capital partners on scaling deep-tech.',
      },
      {
        time: '4:35 – 5:05 PM',
        title: 'SANKALP Innovation Challenge Pitches',
        type: 'Competition',
        location: 'Main Auditorium',
        desc: 'Shortlisted innovators present high-impact solutions across the four summit tracks before a jury.',
      },
      {
        time: '5:05 – 5:25 PM',
        title: 'Investor & Industry Connect Session',
        type: 'Networking',
        location: 'Investor Lounge',
        desc: 'Structured 1-on-1 bilateral meetings between founders, researchers, and venture capitalists.',
      },
      {
        time: '5:25 – 5:40 PM',
        title: 'Workshop Outcomes, Summit Outcome Declaration & Closing Remarks',
        type: 'Valedictory',
        location: 'Main Auditorium',
        desc: 'Workshop and Open Lab outcomes, summit outcome declaration and closing remarks.',
      },
      {
        time: '5:45 PM onwards',
        title: 'SANKALP Cultural Gala Night',
        type: 'Gala',
        location: 'Main Grounds',
        desc: 'Evening cultural programming, subject to final confirmation.',
      },
    ],
  },
}

export const WORKSHOPS = [
  {
    id: 'ws-1',
    number: 'Workshop 01',
    title: 'Build with AI: From Prompt Engineering to Intelligent AI Agents',
    location: 'Seminar Hall I',
    track: 'AI & Applied Intelligence',
    time: '9:15 AM – 1:00 PM (Day 2)',
    icon: '',
    activities: [
      'Structured prompt engineering methodologies',
      'Knowledge-grounded retrieval workflows (RAG)',
      'Autonomous multi-agent orchestration frameworks',
      'Evaluating hallucination and safety metrics',
    ],
    expectedOutput:
      'Working AI-assisted application or agent workflow, comprehensive prompt documentation, and a short test report.',
    eligibility: 'Final eligibility and the relationship to summit registration will be confirmed.',
  },
  {
    id: 'ws-2',
    number: 'Workshop 02',
    title: 'Beyond Classical Intelligence: Quantum Machine Learning for Complex Problems',
    location: 'Seminar Hall II',
    track: 'Quantum Technologies',
    time: '9:15 AM – 1:00 PM (Day 2)',
    icon: '',
    activities: [
      'Fundamentals of parameterized quantum circuits',
      'Quantum state preparation and measurement',
      'Hybrid classical-quantum optimization routines',
      'Simulation of quantum kernels vs classical SVM baselines',
    ],
    expectedOutput:
      'Simulated Quantum Machine Learning (QML) experiment and comparative performance report against classical baselines.',
    eligibility: 'Basic knowledge of Python and linear algebra recommended.',
  },
  {
    id: 'ws-3',
    number: 'Workshop 03',
    title: 'Industrial Digital Twins and AI-Driven Predictive Maintenance',
    location: 'Seminar Hall III',
    track: 'Intelligent Manufacturing',
    time: '9:15 AM – 1:00 PM (Day 2)',
    icon: '',
    activities: [
      'Processing high-frequency industrial IoT sensor streams',
      'Time-series anomaly detection algorithms',
      'Equipment Remaining Useful Life (RUL) estimation',
      'Constructing real-time digital-twin telemetry dashboards',
    ],
    expectedOutput:
      'Working predictive-maintenance anomaly detection prototype or dynamic digital-twin simulation.',
    eligibility: 'Targeted at engineers, mechatronics scholars, and IoT developers.',
  },
  {
    id: 'ws-4',
    number: 'Workshop 04',
    title: 'AI-Driven Biomedical Data Analytics and Precision Medicine',
    location: 'Seminar Hall IV',
    track: 'Biotech & Precision Health',
    time: '9:15 AM – 1:00 PM (Day 2)',
    icon: '',
    activities: [
      'Biomedical data hygiene and missing-value imputation',
      'Clinical prognostic prediction modelling',
      'Multi-omics gene expression differential analysis',
      'Model interpretability and clinical workflow safety',
    ],
    expectedOutput:
      'Reproducible biomedical analysis notebook and predictive-modelling workflow on validated anonymised datasets.',
    eligibility: 'Ideal for bioinformatics scholars, biomedical engineers, and health data scientists.',
  },
]

export const OPEN_SUMMIT_LABS = [
  {
    id: 'lab-1',
    number: 'Open Lab 01',
    title: 'AI Innovation Sprint: From Problem to Prototype',
    time: '9:15 – 10:30 AM (Day 2)',
    icon: '',
    focus: 'Rapid problem definition, UX mockups, and prompt-driven micro-prototype building.',
    output: 'Structured problem statement, clickable prototype/mock-up, and a concise 3-minute pitch deck.',
  },
  {
    id: 'lab-2',
    number: 'Open Lab 02',
    title: 'Deep-Tech Design Challenge: Solve an Industry Problem',
    time: '10:45 AM – 12:00 PM (Day 2)',
    icon: '',
    focus: 'Deconstructing real challenges supplied by manufacturing and public enterprise partners.',
    output: 'Solution canvas, detailed process diagram or low-fidelity prototype, and implementation roadmap.',
  },
  {
    id: 'lab-3',
    number: 'Open Lab 03',
    title: 'Research-to-Startup Lab: Build a Venture Concept',
    time: '12:00 – 1:00 PM (Day 2)',
    icon: '',
    focus: 'Translating laboratory IP into a defensible venture thesis, revenue model, and market entry.',
    output: 'One-page venture canvas and a three-minute investor-style pitch deck.',
  },
]

export const WORKSHOP_REQUIREMENTS = [
  'Participants must bring a fully-charged laptop with WiFi capability.',
  'Laptop power charger / adapter.',
  'Registration confirmation and institutional ID, where applicable.',
  'Institutional / Corporate identity card.',
  'Pre-installation of software environments (instructions will be shared via registered email).',
  'Compliance with approved datasets, research ethics, and data protection protocols.',
]

export const INNOVATION_CHALLENGE = {
  title: 'SANKALP Innovation Challenge 2026',
  tagline: 'Statewide Stage-Based Elevator Pitch Competition',
  purpose:
    'A competitive platform across the four technology tracks giving early-stage innovators and researchers visibility, mentor feedback, and networking with potential seed partners.',
  eligibleParticipants: [
    'Undergraduate & Postgraduate Students',
    'Full-time Research Scholars & PhDs',
    'University Faculty Members',
    'Startups and entrepreneurs',
    'Independent Inventors & Tech Entrepreneurs',
    'Industry Innovation Teams',
  ],
  fees: {
    student: '₹200 per idea',
    industry: '₹500 per idea',
    notice: 'Proposed fee; summit registration is mandatory for all pitching team members.',
  },
  steps: [
    { step: 1, title: 'Register for Summit', desc: 'Secure an active SANKALP summit delegate pass for all team members.' },
    { step: 2, title: 'Submit Idea Dossier', desc: 'Detail problem statement, technical approach, and proposed prototype.' },
    { step: 3, title: 'Select Track', desc: 'Classify your proposal under one of the 4 official technology tracks.' },
    { step: 4, title: 'Affiliation & Evidence', desc: 'Upload institutional credentials, architecture diagrams, or repo links.' },
    { step: 5, title: 'Expert Shortlisting', desc: 'Academic and industry screening panel evaluates submissions against criteria.' },
    { step: 6, title: 'Live Elevator Pitch', desc: 'Shortlisted candidates pitch before a live jury on Day 2 of the Summit.' },
    { step: 7, title: 'Outcome Assessment', desc: 'Evaluation based on technical novelty, feasibility, impact, and clarity.' },
  ],
  requiredFields: [
    'Idea / Project Title',
    'Primary Technology Track',
    'Problem Statement (Max 250 words)',
    'Intended User or Public Beneficiary',
    'Proposed Technical Solution & Architecture',
    'Current Stage (Idea / Concept / PoC / Prototype / Pilot)',
    'Expected Application & Regional Societal Impact',
    'Team Composition & Institutional Affiliation',
    'Supporting Evidence / GitHub Repo / Demo Link',
  ],
  disclaimer:
    'Summit registration is mandatory. Participation in the SANKALP Innovation Challenge does not guarantee grant funding, venture investment, university incubation, or commercial deployment.',
}

export const INVESTOR_CONNECT = {
  title: 'Investor & Industry Connect',
  tagline: 'Catalysing Research Commercialisation & Capital Partnerships',
  purpose:
    'A dedicated bilateral meeting initiative connecting researchers, deep-tech founders, and startup innovators directly with venture capital partners, family offices, and enterprise innovation scouts.',
  activities: [
    'One-on-one research collaboration discussions with industry R&D teams',
    'Industry problem-solving and open challenge opportunities',
    'Prototype validation and engineering review',
    'Pilot-project scoping and enterprise testbed deployments',
    'Technology licensing and university IP adoption pathways',
    'Incubation, acceleration, and lab-space discussions',
    'Early-stage venture capital and angel investment conversations',
  ],
  participationRules: [
    'Summit registration is compulsory for all participants.',
    'Participants may bring research concepts, IP dossiers, working prototypes, or enterprise problem statements.',
    'All parties must adhere to strict confidentiality, IP ownership boundaries, and mutual NDAs where appropriate.',
  ],
  fees: 'Listed as registration-free in the proposal; summit registration is strictly mandatory.',
  disclaimer:
    'Participation in the Investor & Industry Connect initiative does not guarantee funding, equity investment, commercial procurement, or corporate sponsorship.',
}

export const SPEAKERS_INFO = {
  status: 'Speaker announcements coming soon',
  statusMessage:
    'Keynote speakers, plenary experts, panel moderators, and workshop facilitators are currently undergoing formal institutional confirmation. Profiles will be published once officially approved.',
  categories: [
    { title: 'Inaugural & Keynote Speakers', desc: 'Global technology luminaries and national policymakers.' },
    { title: 'Plenary Lecturers', desc: 'Leading researchers in AI, Quantum, Industry 4.0, and Precision Medicine.' },
    { title: 'Featured Industry Pioneers', desc: 'Chief Technology Officers and engineering leaders from top tech firms.' },
    { title: 'Invited Track Specialists', desc: 'Domain specialists delivering deep technical insights.' },
    { title: 'Panel Members & Moderators', desc: 'Academic vice-chancellors, founders, and policy experts.' },
    { title: 'CEO Expert Dialogue', desc: 'Enterprise chief executives sharing commercialisation roadmaps.' },
    { title: 'Workshop Facilitators', desc: 'Hands-on practitioners leading intensive laboratory sessions.' },
  ],
  nominationCall:
    'Are you a recognized researcher or enterprise leader interested in speaking at SANKALP Andhra 2026? Contact the organising team when official speaker proposal arrangements are announced.',
}

export const PARTNERS_INFO = {
  notice:
    'Potential partnership framework. Sponsorship tiers, formal benefits, partner logos, and organizational names will be displayed upon formal agreement and institutional sign-off.',
  types: [
    { id: 'knowledge', name: 'Knowledge Partner', desc: 'Curate academic sessions, technical standards, and whitepapers.' },
    { id: 'technology', name: 'Technology Partner', desc: 'Provide computing platforms, cloud credits, and developer tools.' },
    { id: 'challenge', name: 'Industry Challenge Partner', desc: 'Present real enterprise problem statements for the Innovation Challenge.' },
    { id: 'showcase', name: 'Showcase / Exhibition Partner', desc: 'Sponsor dedicated demo pavilions and university pavilions.' },
    { id: 'workshop', name: 'Workshop Partner', desc: 'Collaborate on hands-on curriculum, hardware kits, and dataset sandboxes.' },
    { id: 'ecosystem', name: 'Innovation Ecosystem Partner', desc: 'Incubators, research parks, and accelerators connecting startups.' },
    { id: 'sponsorship', name: 'Sponsorship Partner', desc: 'Explore approved visibility and engagement opportunities; packages to be confirmed.' },
  ],
  benefits: [
    'Engage directly with high-caliber student engineers, scholars, and future tech talent.',
    'Share research breakthroughs, tech platforms, and industry thought leadership.',
    'Identify high-impact collaboration and sponsored-research projects with premier universities.',
    'Support hands-on prototype validation and pilot deployments in Andhra Pradesh.',
    'Showcase state-of-the-art enterprise products in the Technology Exhibition.',
    'Contribute to shaping regional technology policies and responsible innovation roadmaps.',
  ],
}

export const SHOWCASE_INFO = {
  title: 'Research & Technology Showcase',
  purpose:
    'Provide high-profile visibility for state-of-the-art research outputs, emerging technology prototypes, university patents, and deep-tech startup innovations.',
  potentialParticipants: [
    'Universities, Engineering Colleges & Research Institutions',
    'Deep-Tech Early & Growth Stage Startups',
    'Corporate R&D Centres & Innovation Labs',
    'Enterprise Technology Solution Providers',
    'Incubators, Accelerators & Technology Parks',
    'Specialist Teams in AI, Quantum, Manufacturing & Precision Health',
    'Aerospace, Satellite Systems, Semiconductors & Advanced Materials Teams',
  ],
  requiredFields: [
    'Project / Exhibit Title',
    'Primary Technology Domain',
    'Lead Institution or Organization Name',
    'Principal Investigator / Team Lead Contact',
    'Project Abstract & Technical Overview',
    'Intended Industry / Societal Application',
    'Current Development Stage (TRL 1-9)',
    'Equipment, Power & High-Speed Network Requirements',
    'Physical Space Requirements (Single booth / Double booth / Open display)',
    'IP, Safety & Non-Disclosure Considerations',
  ],
  pendingDetails:
    'Exhibition booth dimensions, setup fees, submission deadlines, power quotas, and selection limits will be published upon final institutional approval.',
}

export const REGISTRATION_FEES = {
  disclaimer:
    'All stated fees are proposed estimates transcribed from the planning document and do not represent final confirmed prices. Final GST treatment, invoice issuance, and payment gateway activation will be announced upon formal launch.',
  summit: [
    {
      category: 'Students / Research Scholars',
      fee: 800,
      feeDisplay: '₹800',
      note: 'Proposal includes 18% GST. Valid student ID or institutional verification required.',
      popular: false,
    },
    {
      category: 'Faculty & Academicians',
      fee: 1300,
      feeDisplay: '₹1,300',
      note: 'Tax treatment and institutional verification requirements to be confirmed.',
      popular: true,
    },
    {
      category: 'Startup Founders',
      fee: 2000,
      feeDisplay: '₹2,000',
      note: 'Proposed fee exclusive of 18% GST; final terms to be confirmed.',
      popular: false,
    },
    {
      category: 'Government Officials / Industry Professionals',
      fee: 3500,
      feeDisplay: '₹3,500',
      note: 'Proposed fee exclusive of 18% GST; final terms to be confirmed.',
      popular: false,
    },
    {
      category: 'International Delegates',
      fee: 20000,
      feeDisplay: '₹20,000',
      note: 'Proposed fee exclusive of 18% GST; final eligibility to be confirmed.',
      popular: false,
    },
  ],
  groupDiscount: {
    rule: '10% discount on regular student registration fee for accredited institutional groups of 10 or more participants.',
    percent: 10,
    minCount: 10,
  },
  workshops: [
    { category: 'Students / Research Scholars', fee: 350, feeDisplay: '₹350' },
    { category: 'Faculty / Academicians', fee: 500, feeDisplay: '₹500' },
    { category: 'Industry / Startup Professionals', fee: 700, feeDisplay: '₹700' },
  ],
  challenge: [
    { category: 'Student Participants', fee: 200, feeDisplay: '₹200 per idea' },
    { category: 'Industry Participants', fee: 500, feeDisplay: '₹500 per idea' },
  ],
  summitInclusions: [
    'Access to all Plenary Keynotes, Featured Talks & Panel Discussions',
    'Complimentary Buffet Lunch on both Summit days',
    'Official SANKALP Delegate Kit & Summit-branded Badge & Lanyard',
    'Reusable eco-friendly fabric bag with stationery set (Notebook, Pen, Sticky notes)',
    'Branded stainless-steel water bottle & summit commemorative cap',
    'Printed summit programme guidebook and technical summary card',
    'Access to Open Summit Labs and Research Showcase Exhibition',
    'Invitations to Day 1 Cultural Evening & Day 2 Gala Night',
  ],
  workshopInclusions: [
    'Hands-on access to specialized seminar computer lab environments',
    'Official Certificate of Workshop Completion',
    'Comprehensive curated datasets, starter repositories & code templates',
    'Practical exercise sheets and deliverable validation rubrics',
    'One month of on-demand recording access (subject to speaker consent)',
  ],
}

export const VENUE_INFO = {
  status: 'Venue and dates to be formally confirmed',
  location: 'Andhra Pradesh, India',
  description: 'SANKALP Andhra 2026 is proposed to take place in Andhra Pradesh. The final institution, city, dates and travel details will be published once confirmed.',
  sections: [
    { title: 'Main Auditorium & Workshop Rooms', desc: 'Room locations, capacities and entry arrangements will be announced with the approved venue.', icon: '↗' },
    { title: 'Research & Technology Showcase', desc: 'Exhibition space, equipment and network arrangements are to be confirmed.', icon: '↗' },
    { title: 'Networking & Industry Connect', desc: 'Meeting areas and arrangements will be published with the final programme.', icon: '↗' },
    { title: 'Accessibility & Delegate Support', desc: 'Accessibility, dining, parking and support information will be provided once verified.', icon: '↗' },
  ],
  travelGuidance: [
    { title: 'Air & Rail Connections', detail: 'Nearest airport, railway station and verified travel options will follow the venue announcement.' },
    { title: 'Local Transport & Parking', detail: 'Verified local transport and parking information will be published here.' },
    { title: 'Accommodation', detail: 'Accommodation arrangements are not yet specified. Any future recommendations will clearly identify whether they are official partnerships.' },
    { title: 'Arrival & Accessibility', detail: 'Venue access, ID requirements, accessibility arrangements and a support contact will be confirmed.' },
  ],
}

export const FAQS = [
  {
    id: 1,
    q: 'What is SANKALP Andhra 2026?',
    a: 'SANKALP Andhra 2026 is the proposed flagship Andhra Pradesh Technology Summit designed to connect academia, scientific researchers, industry leaders, startups, and government to transform research into real-world applications.',
    category: 'General',
  },
  {
    id: 2,
    q: 'What is the summit theme?',
    a: 'The official theme is "From Research to Real-World Impact", focusing on accelerating translational science, prototyping, and statewide technological deployment.',
    category: 'General',
  },
  {
    id: 3,
    q: 'When and where will the summit take place?',
    a: 'The summit is proposed as a two-day event in Andhra Pradesh, India. Specific calendar dates and the final university/convention venue are currently pending formal institutional approval.',
    category: 'General',
  },
  {
    id: 4,
    q: 'Who can attend SANKALP Andhra 2026?',
    a: 'The summit is open to students, research scholars, faculty, university leaders, startup founders, corporate R&D engineers, industry executives, investors, and public officials.',
    category: 'Attendance',
  },
  {
    id: 5,
    q: 'What are the four technology tracks?',
    a: 'The four summit tracks are: (1) Artificial Intelligence & Applied Intelligence, (2) Quantum Technologies, (3) Intelligent Manufacturing & Industry 4.0, and (4) Biotechnology, Healthcare & Precision Health.',
    category: 'Tracks',
  },
  {
    id: 6,
    q: 'Are hands-on workshops available?',
    a: 'Yes, Day 2 features 4 specialist workshops (Build with AI, Quantum Machine Learning, Digital Twins & Predictive Maintenance, and Biomedical Data Analytics) plus 3 Open Summit Labs.',
    category: 'Workshops',
  },
  {
    id: 7,
    q: 'Is summit registration required for workshops?',
    a: 'The proposal lists separate workshop fees. Whether summit registration is additionally required remains to be confirmed; check the approved registration details before paying.',
    category: 'Workshops',
  },
  {
    id: 8,
    q: 'What are the workshop fees?',
    a: 'The proposed workshop add-on fees are: ₹350 for Students / Scholars, ₹500 for Faculty / Academicians, and ₹700 for Industry / Startup delegates (subject to final confirmation).',
    category: 'Workshops',
  },
  {
    id: 9,
    q: 'What is the SANKALP Innovation Challenge?',
    a: 'It is a multi-tier elevator-pitch competition where shortlisted students, researchers, and startups present high-impact solutions across the four tracks before an expert jury of investors and technologists.',
    category: 'Challenge',
  },
  {
    id: 10,
    q: 'What is the Innovation Challenge entry fee?',
    a: 'The proposed submission fee is ₹200 per idea for student teams and ₹500 per idea for industry/startup teams. Summit registration is mandatory for all pitching members.',
    category: 'Challenge',
  },
  {
    id: 11,
    q: 'Does participation in the Innovation Challenge guarantee funding?',
    a: 'No. Participation provides visibility, mentor assessment, and direct feedback from investors, but does not guarantee venture funding, grants, or commercial contracts.',
    category: 'Challenge',
  },
  {
    id: 12,
    q: 'What is Investor & Industry Connect?',
    a: 'A dedicated initiative facilitating pre-scheduled bilateral meetings between researchers/startups and venture capitalists, angel networks, and enterprise pilot partners.',
    category: 'Industry',
  },
  {
    id: 13,
    q: 'Will participants receive certificates?',
    a: 'The workshop proposal includes a certificate of completion, subject to attendance and any deliverable requirements. Other certificate arrangements are to be confirmed.',
    category: 'General',
  },
  {
    id: 14,
    q: 'Will workshop recordings be available after the summit?',
    a: 'One month of on-demand recorded session access is planned for registered workshop delegates, subject to speaker consent and technical availability.',
    category: 'Workshops',
  },
  {
    id: 15,
    q: 'What should workshop participants bring with them?',
    a: 'Participants must bring a fully charged laptop, charger/adapter, verified registration confirmation badge, and institutional/corporate ID card.',
    category: 'Workshops',
  },
  {
    id: 16,
    q: 'Can participants present unpublished research at the showcase?',
    a: 'Yes, provided the team owns the necessary intellectual property rights and presenting the project does not compromise any pending patent filings or non-disclosure commitments.',
    category: 'Showcase',
  },
  {
    id: 17,
    q: 'Will accommodation be provided to delegates?',
    a: 'Accommodation arrangements are not specified. Verified travel and accommodation guidance will be published once the venue is confirmed.',
    category: 'Attendance',
  },
  {
    id: 18,
    q: 'How can an organisation become a partner or exhibitor?',
    a: 'Organisations can express interest via the online Partnership Enquiry Form or Research Showcase Form on this portal. The organizing committee will reach out with the formal partnership prospectus.',
    category: 'Industry',
  },
  {
    id: 19,
    q: 'Are the programme schedule and speaker line-up final?',
    a: 'The current programme is a proposed schedule. The final schedule—including speaker line-up, resolved concurrent timings, and confirmed venues—will be announced on this website upon approval.',
    category: 'General',
  },
]

export const CONTACT_INFO = {
  generalEmail: 'Official email to be announced',
  registrationEmail: 'Registration contact to be announced',
  partnershipsEmail: 'Partnership contact to be announced',
  challengeEmail: 'Challenge contact to be announced',
  phone: 'Official telephone to be announced',
  officeAddress:
    'Organising office address to be confirmed.',
  socials: [],
  enquiryCategories: [
    'General Enquiries',
    'Registration & Delegate Support',
    'Specialist Workshop Enquiries',
    'SANKALP Innovation Challenge',
    'Partnerships & Sponsorship Opportunities',
    'Research & Technology Showcase',
    'Press & Media Relations',
  ],
}
