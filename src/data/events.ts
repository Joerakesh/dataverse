export interface SymposiumEvent {
  id: string;
  name: string;
  slug: string;
  category: "Flagship" | "Technical" | "Non-Technical";
  tagline: string;
  description: string;
  character: {
    name: string;
    alias: string;
    image: string;
    color: string;
  };
  teamSize: string;
  minTeam: number;
  maxTeam: number;
  venue: string;
  time?: string;
  rounds: {
    name: string;
    duration?: string;
    description: string;
  }[];
  rules: string[];
  coordinators: {
    name: string;
    phone: string;
  }[];
}

export const SYMPOSIUM_EVENTS: SymposiumEvent[] = [
  {
    id: "1",
    name: "Unknown Variable",
    slug: "unknown-variable",
    category: "Flagship",
    tagline: "The Classified AI & DS Surprise Event",
    description: "The sovereign flagship trial governed by Dr. Doom. An elite classified technical ordeal testing raw intellect across Agentic AI workflows, Prompt & Logic Engineering, and on-the-spot algorithmic challenges. The exact problem statements and criteria remain strictly classified until the moment of battle.",
    character: {
      name: "Victor Von Doom",
      alias: "Doctor Doom",
      image: "/images/characters/doom.jpg",
      color: "from-emerald-600 to-green-950",
    },
    teamSize: "1 - 2 Members",
    minTeam: 1,
    maxTeam: 2,
    venue: "Citadel Computing Lab 1",
    rounds: [
      {
        name: "Mindset & Logic Screening",
        duration: "Online / Pre-fest",
        description: "Teams answer 3 AI & Data Science mindset questions during online registration. Shortlisting is confidential and prioritizes institutions with broad fest participation.",
      },
      {
        name: "Classified Technical Ordeal",
        duration: "On-the-spot",
        description: "The problem statement, round structure, and evaluation metrics are unlocked exclusively at event kickoff. Encompasses AI, Prompt Engineering, and Agent Workflows.",
      },
    ],
    rules: [
      "Each team must consist of participants from the same department of their institution.",
      "Only 1 team per department/college may register. Priority given to colleges with highest total fest registrations.",
      "Bring your own laptops pre-configured with Python & Data Science toolkits offline.",
      "Selected teams must confirm participation within 24 hours of notification.",
      "Any unauthorized communication or external help will result in instant disqualification.",
    ],
    coordinators: [
      { name: "Silverster Jones", phone: "8838484856" },
      { name: "Selva Rejo", phone: "8838414576" },
      { name: "Amrit", phone: "9344712584" },
      { name: "Nitin Xavier", phone: "6382103380" },
    ],
  },
  {
    id: "2",
    name: "Data Nova",
    slug: "data-nova",
    category: "Technical",
    tagline: "Project Presentation & Research Defense",
    description: "Defend your engineering vision with honor and technical fortitude. Present cutting-edge implementations across Machine Learning, Deep Learning, Natural Language Processing, or Agentic AI before the council of judges.",
    character: {
      name: "Steve Rogers",
      alias: "Captain America",
      image: "/images/characters/captain-america.jpg",
      color: "from-blue-600 to-slate-900",
    },
    teamSize: "1 - 2 Members",
    minTeam: 1,
    maxTeam: 2,
    venue: "Auditorium Alpha",
    rounds: [
      {
        name: "Technical Defense (5 Mins)",
        duration: "5 Mins",
        description: "1 minute setup + 3 minutes presentation + 1 minute Q&A defense. Warning buzzer at 4th minute.",
      },
    ],
    rules: [
      "Max 2 participants per team. Both members must actively participate.",
      "Allowed domains: ML, DL, NLP, Statistics, Data Analytics, Agentic AI.",
      "Bring own laptops; presentations in PPT/PDF format.",
      "All models, datasets, and demos must run completely offline (no internet provided).",
      "Judged on Technical Depth, Practical Application, Innovation, and Q&A Performance.",
    ],
    coordinators: [
      { name: "Vinosh", phone: "8248205988" },
      { name: "Melvin", phone: "9361856070" },
      { name: "Mervin Jude", phone: "9787856625" },
    ],
  },
  {
    id: "3",
    name: "Pitch Storm",
    slug: "pitch-storm",
    category: "Technical",
    tagline: "Shark Tank Tech Venture Pitch",
    description: "Step into Tony Stark's boardroom. Pitch high-impact, disruptive technology-based startup models to an austere panel of investors. Defend market economics, revenue strategies, and live working prototypes.",
    character: {
      name: "Tony Stark",
      alias: "Iron Man",
      image: "/images/characters/iron-man.jpg",
      color: "from-amber-600 to-red-950",
    },
    teamSize: "2 - 3 Members",
    minTeam: 2,
    maxTeam: 3,
    venue: "Stark Innovation Hall",
    rounds: [
      {
        name: "Investor Pitch & Q&A",
        duration: "8 Mins",
        description: "6 minutes presentation + 2 minutes rigorous investor grilling. Prototypes add heavy leverage.",
      },
      {
        name: "Case Study Prelims (Conditional)",
        duration: "Variable",
        description: "In case of high registration volume, an on-the-spot business case study round will shortlist finalists.",
      },
    ],
    rules: [
      "Each team must consist of 2–3 participants.",
      "Present an original tech-based business solution with problem, solution, TAM, revenue, and investment model.",
      "Working prototypes, mobile apps, or software demonstrations are highly encouraged.",
      "Teams must bring their own laptops and demo equipment.",
      "In case of a tie, business feasibility and clarity will determine the victor.",
    ],
    coordinators: [
      { name: "Joe Jerome", phone: "7904523973" },
      { name: "Jawwad Ahnaf", phone: "8870073991" },
      { name: "Michael Deepak", phone: "7395905050" },
    ],
  },
  {
    id: "4",
    name: "VisQuest",
    slug: "visquest",
    category: "Technical",
    tagline: "Data Visualisation & Narrative Arc",
    description: "Peer through illusions and master the visual dimensions of data. Spot deceptive visualizations, decode charts, and synthesize raw numerical chaos into an indisputable narrative tapestry.",
    character: {
      name: "Stephen Strange",
      alias: "Doctor Strange",
      image: "/images/characters/doctor-strange.jpg",
      color: "from-orange-600 to-purple-950",
    },
    teamSize: "Exactly 2 Members",
    minTeam: 2,
    maxTeam: 2,
    venue: "Visual Analytics Sanctum",
    rounds: [
      {
        name: "Round 1: Preliminary Elimination",
        duration: "20 Mins",
        description: "Objective evaluation testing analytical and conceptual mastery of charts and visual metrics.",
      },
      {
        name: "Round 2: Spot the Deception",
        duration: "20 Mins",
        description: "Detect intentional fallacies and distorted representations in misleading charts and formulate corrections.",
      },
      {
        name: "Round 3: Narrative Visualisation",
        duration: "Final Stage",
        description: "Construct a single compelling narrative from a raw dataset and justify your chosen visual mechanics.",
      },
    ],
    rules: [
      "Each team must consist of exactly 2 participants.",
      "All spoken and presented communication must be conducted in English.",
      "Scores from Round 2 and Round 3 combine to crown the supreme team.",
      "Laptops with visualization software/notebooks are required.",
    ],
    coordinators: [
      { name: "Anne", phone: "9342029891" },
      { name: "Blessy", phone: "7338790623" },
      { name: "Jersha", phone: "8939864436" },
    ],
  },
  {
    id: "5",
    name: "Dataverse Quiz",
    slug: "dataverse-quiz",
    category: "Technical",
    tagline: "Titan Mind Battle & Data Bingo",
    description: "Channel the explosive intellectual power of Bruce Banner. A high-voltage battle of minds spanning Data Science, Computing Fundamentals, Probability, Discrete Mathematics, and Data Bingo.",
    character: {
      name: "Bruce Banner",
      alias: "The Hulk",
      image: "/images/characters/hulk.jpg",
      color: "from-green-600 to-emerald-950",
    },
    teamSize: "1 - 2 Members",
    minTeam: 1,
    maxTeam: 2,
    venue: "Gamma Hall (Room 204)",
    rounds: [
      {
        name: "Round 1: Rapid Elimination",
        duration: "Timed",
        description: "Written/digital rapid-fire round covering Data Science, CS, and Statistics.",
      },
      {
        name: "Round 2: Data Bingo",
        duration: "Timed",
        description: "Fast-paced numerical and statistical bingo grid where speed and precision unlock the board.",
      },
      {
        name: "Round 3: Grand Finale",
        duration: "Championship",
        description: "High-pressure buzzer clash between the top finalist teams.",
      },
    ],
    rules: [
      "Max 2 participants per team.",
      "No negative marking across any round.",
      "Smartphones, smartwatches, and smart devices are strictly confiscated during play.",
      "Tie-breaker questions will be deployed in case of ties.",
    ],
    coordinators: [
      { name: "Blesson", phone: "8838484856" },
      { name: "Vinix", phone: "8838414576" },
      { name: "Remo", phone: "9344712584" },
      { name: "Johnnet", phone: "6382103380" },
    ],
  },
  {
    id: "6",
    name: "Dark Quest",
    slug: "dark-quest",
    category: "Non-Technical",
    tagline: "Blindfold Clues & Spider-Sense Intuition",
    description: "Rely on pure sensory communication and instinct. One teammate is blindfolded while the other must guide them to decode visual symbols and hidden entities without naming them directly.",
    character: {
      name: "Peter Parker",
      alias: "Spider-Man",
      image: "/images/characters/spider-man.jpg",
      color: "from-red-600 to-blue-950",
    },
    teamSize: "Exactly 2 Members",
    minTeam: 2,
    maxTeam: 2,
    venue: "Web Sanctum (Room 102)",
    rounds: [
      {
        name: "Round 1: Preliminary Blindfold",
        duration: "Allotted Time",
        description: "One projected image per team; the sighted teammate provides rapid descriptive clues.",
      },
      {
        name: "Round 2: Rapid-Fire Final",
        duration: "Final Stage",
        description: "Fast consecutive series of projected images under intense countdown constraints.",
      },
    ],
    rules: [
      "Exactly 2 participants per team (Max 2 teams per college).",
      "Direct naming, spelling, or phonetics of the answer is strictly banned.",
      "Skipped images cannot be revisited. Points awarded per correct answer.",
      "Blindfold must remain securely fastened until the bell rings.",
    ],
    coordinators: [
      { name: "Shiny Immaculate", phone: "9360728331" },
      { name: "Maria Pradeesha", phone: "7358371927" },
      { name: "Haizel Janani", phone: "9489190898" },
    ],
  },
  {
    id: "7",
    name: "Brand New Hunt",
    slug: "treasure-hunt",
    category: "Non-Technical",
    tagline: "Treasure Hunt & Tactical Scavenger",
    description: "Like Rocket Raccoon scavenging through the galaxy, decode cryptograms, solve visual crosswords, and conquer an unpredictable final surprise to unearth the Latverian prize.",
    character: {
      name: "Rocket Raccoon",
      alias: "Rocket",
      image: "/images/characters/rocket-raccoon.jpg",
      color: "from-orange-600 to-stone-950",
    },
    teamSize: "Exactly 2 Members",
    minTeam: 2,
    maxTeam: 2,
    venue: "Citadel Courtyard & Grounds",
    rounds: [
      {
        name: "Round 1: Preliminary Puzzles",
        duration: "25 Mins",
        description: "General aptitude, logical reasoning, crosswords, and pattern recognition.",
      },
      {
        name: "Round 2: Visual Word Hunt",
        duration: "15 Mins",
        description: "Deduce hidden words, phrases, and cryptic connections from image cards.",
      },
      {
        name: "Round 3: Final Surprise Challenge",
        duration: "15 Mins",
        description: "An on-the-spot surprise trial testing lightning reflexes and teamwork.",
      },
    ],
    rules: [
      "Each team must consist of exactly 2 participants.",
      "All electronic gadgets, phones, and smart gear are strictly barred.",
      "Report 10 minutes prior to round start.",
      "Any disruption of college property or physical pushing leads to instant expulsion.",
    ],
    coordinators: [
      { name: "Harish", phone: "8825407345" },
      { name: "Reymond", phone: "9345701952" },
    ],
  },
];
