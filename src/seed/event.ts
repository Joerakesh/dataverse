export type InitialEvent = {
  name: string;
  slug: string;
  category: string;
  shortDescription?: string;
  description: string;
  rules?: string[];
  teamSize?: { min: number; max: number };
  venue?: string;
  startTime?: string;
  endTime?: string;
  registrationOpen?: boolean;
  status?: "draft" | "published" | "archived";
  image?: string;
  displayOrder?: number;
};

export const initialEvents: InitialEvent[] = [
  {
    name: "Unknown Variable: The Classified AI & DS Surprise Event",
    slug: "unknown-variable",
    category: "Flagship Technical",
    shortDescription: "A classified Dr. Doom sovereign surprise event testing AI, Data Science, prompt engineering & agent workflows.",
    description: "The signature surprise technical event of DATAVERSE. Problem statement, round structure, and evaluation criteria will be revealed exclusively at event commencement. Challenges span Data Science, Artificial Intelligence, Low-code/No-code Agent Workflows, Prompt & Logic Engineering, and on-the-spot technical challenges. Only one team per department/college may register, with priority given to institutions participating in higher numbers of fest events.",
    rules: [
      "Each team must consist of participants from the same department of their respective institution.",
      "Only one team per department/college may register. Priority given to colleges with higher fest participation.",
      "During online registration, teams must answer three AI & DS mindset/personality-based questions. Shortlisting is based on response quality.",
      "The total number of shortlisted teams remains strictly confidential. Selected teams must confirm within 24 hours.",
      "Participants must bring their own laptops with Python and Data Science tools pre-installed offline. Chargers and adapters are participant responsibility.",
      "Any form of malpractice, unauthorized external communication, or violation of time limits results in immediate disqualification.",
      "Coordinators: Silverster Jones (8838484856), Selva Rejo (8838414576), Amrit (9344712584), Nitin Xavier (6382103380)."
    ],
    teamSize: { min: 1, max: 2 },
    venue: "Main Computing Citadel (Lab 1)",
    registrationOpen: true,
    status: "published",
    image: "/images/characters/doom.jpg",
    displayOrder: 1,
  },
  {
    name: "Data Nova - Project Presentation",
    slug: "data-nova",
    category: "Technical Presentation",
    shortDescription: "Flagship project presentation showcasing Machine Learning, Deep Learning, NLP, Statistics, and Agentic AI.",
    description: "Present groundbreaking research and working prototypes in Data Analytics, Machine Learning, Deep Learning, NLP, Statistics, or Agentic AI. Teams deliver a rigorous 5-minute technical presentation (1 min setup, 3 mins presentation, 1 min Q&A) before our panel of judges. Demonstrations of working models, dashboards, and offline applications are strongly encouraged.",
    rules: [
      "Each team must consist of a maximum of two participants.",
      "Allowed domains: Data Analytics, Machine Learning, Deep Learning, NLP, Statistics, or Agentic AI.",
      "Time allotment: 5 minutes total (1 min technical setup, 3 mins presentation, 1 min Q&A). Warning buzzer at 1 min remaining.",
      "Evaluated on: Technical Depth, Presentation Clarity, Practical Application, Innovation/Creativity, and Q&A Performance.",
      "Each team must bring their own laptops. Presentations must be in PPT/PDF format with proper citations.",
      "All project files, datasets, and software requirements must be available offline (no internet provided).",
      "Both team members must actively participate in the presentation. Must report 10–15 minutes before scheduled slot.",
      "Coordinators: Vinosh (8248205988), Melvin (9361856070), Mervin Jude (9787856625)."
    ],
    teamSize: { min: 1, max: 2 },
    venue: "Seminar Hall Alpha",
    registrationOpen: true,
    status: "published",
    image: "/images/characters/captain-america.jpg",
    displayOrder: 2,
  },
  {
    name: "Pitch Storm - Shark Tank",
    slug: "pitch-storm",
    category: "Technical & Startup Pitch",
    shortDescription: "High-stakes entrepreneurship arena to pitch original tech-based business innovations to an investor panel.",
    description: "Step into the Shark Tank arena. Teams present an original, technology-based business solution addressing critical market problems using a PPT pitch deck. Defend your business model, target market, revenue streams, and investment thesis before an austere panel. Working prototypes and software demos provide a distinct competitive advantage.",
    rules: [
      "Each team must consist of 2–3 participants and present an original, technology-based business idea.",
      "Time allotment: 6 minutes presentation + 2 minutes Q&A with strict time enforcement.",
      "Teams must explain: Problem, Proposed Solution, Innovation, Target Market, Revenue Model, and Estimated Investment.",
      "Participants may bring working prototypes, product models, mobile applications, or software demos.",
      "Format depends on registration count: High registrations trigger an on-the-spot case study prelim round; limited registrations proceed to direct PPT pitching.",
      "Teams must bring their own laptops and equipment. In case of a tie, uniqueness, feasibility, and business potential determine the winner.",
      "Coordinators: Joe Jerome (7904523973), Jawwad Ahnaf (8870073991), Michael Deepak (7395905050)."
    ],
    teamSize: { min: 2, max: 3 },
    venue: "Stark Innovation Auditorium",
    registrationOpen: true,
    status: "published",
    image: "/images/characters/iron-man.jpg",
    displayOrder: 3,
  },
  {
    name: "VisQuest - Data Visualisation",
    slug: "visquest",
    category: "Technical Analytics",
    shortDescription: "Decipher deceptive charts, spot visual fallacies, and craft compelling narrative data dashboards.",
    description: "Test your visual analytical prowess across 3 challenging rounds. Progress from foundational chart and graph concepts to identifying deceptive, distorted data graphics ('Spot the Deception'), culminating in constructing a complete analytical narrative from a raw dataset with justifiable visualization techniques.",
    rules: [
      "Each team must consist of exactly two participants. All communication must take place only in English.",
      "Round 1 (Preliminary): Elimination round with objective-type questions based on data visualization concepts, charts, and graphs.",
      "Round 2 (Intermediate – Spot the Deception): Identify errors/misleading elements in deceptive charts, explain flaws, and suggest corrections.",
      "Round 3 (Final – Data Visualisation): Construct a single cohesive narrative from a provided dataset and defend your choice of visualization technique.",
      "Points earned in rounds 2 and 3 will be combined for the final score.",
      "Coordinators: Anne (9342029891), Blessy (7338790623), Jersha (8939864436)."
    ],
    teamSize: { min: 2, max: 2 },
    venue: "Visual Analytics Lab",
    registrationOpen: true,
    status: "published",
    image: "/images/characters/doctor-strange.jpg",
    displayOrder: 4,
  },
  {
    name: "Quiz",
    slug: "dataverse-quiz",
    category: "Technical & Aptitude",
    shortDescription: "High-speed clash of wits spanning Data Science, CS, Statistics, Mathematics, and Data Bingo.",
    description: "A rapid-fire intellectual clash testing speed, memory, and analytical intellect. Across three stages—Elimination, Data Bingo, and the Grand Finals—contenders battle across questions from Data Science, Computer Science fundamentals, Statistics, and Discrete Mathematics.",
    rules: [
      "Each team must consist of a maximum of two participants.",
      "Three rounds: Elimination Round, Data Bingo Round, and Final Round.",
      "Questions cover Data Science, Computer Science, Statistics, and Mathematics.",
      "There is no negative marking for incorrect or unanswered questions.",
      "Use of mobile phones or smart devices is strictly prohibited throughout all rounds.",
      "Time limits will be strictly enforced. Additional tie-breaker questions determine ties.",
      "Coordinators: Blesson (8838484856), Vinix (8838414576), Remo (9344712584), Johnnet (6382103380)."
    ],
    teamSize: { min: 1, max: 2 },
    venue: "Titan Hall (Room 204)",
    registrationOpen: true,
    status: "published",
    image: "/images/characters/hulk.jpg",
    displayOrder: 5,
  },
  {
    name: "Dark Quest - Blindfold Clues",
    slug: "dark-quest",
    category: "Non-Technical / Intuition",
    shortDescription: "Sensory isolation challenge where one blindfolded teammate decodes visual clues from their partner.",
    description: "Trust, synergy, and acute perception collide in Dark Quest. One teammate is blindfolded while projected images appear on the screen. The sighted teammate must convey rapid verbal clues without naming or spelling the subject, testing communication under pressure.",
    rules: [
      "Each team must consist of exactly two participants. Maximum 2 teams per college may participate.",
      "Round 1 (Preliminary Round): One image projected per team; one participant is blindfolded while the other provides verbal clues within time limit.",
      "Round 2 (Final Round): Qualifying teams must identify a rapid sequence of images under the same blindfold format.",
      "Direct naming or spelling out the answer is strictly prohibited while providing clues.",
      "Teams may skip an image but cannot return to it later. Points awarded for correct answers, no negative marking.",
      "The blindfolded participant must not remove the blindfold until the round ends.",
      "Coordinators: Shiny Immaculate (9360728331), Maria Pradeesha (7358371927), Haizel Janani (9489190898)."
    ],
    teamSize: { min: 2, max: 2 },
    venue: "Sanctum Hall (Room 102)",
    registrationOpen: true,
    status: "published",
    image: "/images/characters/spider-man.jpg",
    displayOrder: 6,
  },
  {
    name: "Brand New Hunt - Treasure Hunt",
    slug: "treasure-hunt",
    category: "Non-Technical / Strategy",
    shortDescription: "Campus-wide tactical hunt through logic puzzles, visual word decryptions, and an on-the-spot final surprise.",
    description: "The ultimate tactical scavenger trial. Teams of two battle through mathematical puzzles, pattern recognition, visual word hunts, and an unpredictable final on-the-spot challenge across campus grounds to claim the Latverian bounty.",
    rules: [
      "Each team must consist of exactly two participants.",
      "Three rounds: Preliminary Round, Visual Word Hunt Round, and Final Surprise Round.",
      "Round 1 (Preliminary - 25 mins): General aptitude, logical reasoning, puzzles, crosswords, and pattern recognition. Elimination round.",
      "Round 2 (Visual Word Hunt - 15 mins): Identify or deduce hidden words, phrases, or connections from given image sets.",
      "Round 3 (Final Surprise Round - 15 mins): On-the-spot surprise format testing quick thinking, adaptability, and teamwork.",
      "Mobile phones, smartwatches, Bluetooth devices, calculators, and internet access are strictly prohibited.",
      "Participants must report at least 10 minutes prior to event commencement. Running, pushing, or property damage results in disqualification.",
      "Coordinators: Harish (8825407345), Reymond (9345701952)."
    ],
    teamSize: { min: 2, max: 2 },
    venue: "Latveria Courtyard & Quad",
    registrationOpen: true,
    status: "published",
    image: "/images/characters/rocket-raccoon.jpg",
    displayOrder: 7,
  },
];
