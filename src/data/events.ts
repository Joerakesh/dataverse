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
    name: "AgentOps",
    slug: "agentops-ai-agent-hackathon",
    category: "Flagship",
    tagline: "AI Agent Hackathon",
    description: "Build an AI agent that solves a real-world business problem. Teams submit a sample project idea for shortlisting and develop a working MVP during the event.",
    character: { name: "Victor Von Doom", alias: "Doctor Doom", image: "/images/characters/doom.jpg", color: "from-emerald-600 to-green-950" },
    teamSize: "2–3 Members",
    minTeam: 2,
    maxTeam: 3,
    venue: "Centenary Building",
    rounds: [
      { name: "Preliminary Shortlisting", description: "Submit a PPT outlining a sample project idea. Selection considers originality, problem understanding, presentation, reasoning and problem-solving." },
      { name: "AI Agent Challenge", description: "Develop a working Minimum Viable Product that performs the core task for the given real-world business problem." },
    ],
    rules: [
      "Each team must consist of 2–3 participants.",
      "Only one team per department from each college is allowed.",
      "Teams must submit a PPT outlining a sample project idea for the preliminary round.",
      "Shortlisted teams will be notified by registered email and must confirm within 24 hours.",
      "Teams must develop a working MVP. Presentations or non-functional prototypes alone are not considered complete solutions.",
      "Open-source tools, frameworks, models and technologies are encouraged.",
      "Teams must bring their own laptops, internet connection and required software.",
      "The organisers may modify guidelines with prior notification.",
    ],
    coordinators: [
      { name: "Sylvester Jones", phone: "6382138684" },
      { name: "Rejo", phone: "9626828025" },
      { name: "Amrit", phone: "6369427442" },
    ],
  },
  {
    id: "2",
    name: "Data Nova",
    slug: "data-nova-project-presentation",
    category: "Technical",
    tagline: "Project Presentation",
    description: "Present a project related to Data Analytics, Machine Learning, Deep Learning, NLP, Statistics or Agentic AI. Demonstrate your working model, dashboard or prototype.",
    character: { name: "Steve Rogers", alias: "Captain America", image: "/images/characters/captain-america.jpg", color: "from-blue-600 to-slate-900" },
    teamSize: "Maximum 2 Members",
    minTeam: 1,
    maxTeam: 2,
    venue: "Centenary Building",
    rounds: [
      { name: "Project Presentation", duration: "5 minutes", description: "1 minute technical setup, 3 minutes presentation and 1 minute Q&A. A warning buzzer will sound one minute before the presentation concludes." },
    ],
    rules: [
      "Each team must consist of a maximum of two participants.",
      "Projects must relate to Data Analytics, Machine Learning, Deep Learning, NLP, Statistics or Agentic AI.",
      "Each team gets 5 minutes: 1 minute setup, 3 minutes presentation and 1 minute Q&A.",
      "Projects are evaluated on technical depth, presentation clarity, practical application, innovation and Q&A performance.",
      "Bring your own laptop. Presentations must be in PPT/PDF format with proper citations.",
      "Project files, datasets and software requirements must be available offline; internet access will not be provided.",
      "Both team members must actively participate and report 10–15 minutes before the scheduled presentation.",
      "Projects must be original work and the judges' decision is final.",
    ],
    coordinators: [
      { name: "Vinosh", phone: "8248205988" },
      { name: "Melvin", phone: "9361856070" },
      { name: "Mervin Jude", phone: "9787856625" },
    ],
  },
  {
    id: "3",
    name: "Intelliquest",
    slug: "intelliquest-quiz",
    category: "Technical",
    tagline: "Data Science Quiz",
    description: "A three-round quiz covering Data Science, Computer Science, Statistics and Mathematics, including a Data Bingo round.",
    character: { name: "Bruce Banner", alias: "The Hulk", image: "/images/characters/hulk.jpg", color: "from-green-600 to-emerald-950" },
    teamSize: "Maximum 2 Members",
    minTeam: 1,
    maxTeam: 2,
    venue: "Centenary Building",
    rounds: [
      { name: "Elimination", description: "The first round to identify the top-performing teams." },
      { name: "Data Bingo", description: "Shortlisted teams progress to the Data Bingo round." },
      { name: "Final", description: "Top-performing teams from the Bingo round advance to the final." },
    ],
    rules: [
      "Each team must consist of a maximum of two participants.",
      "The event comprises three rounds: Elimination, Data Bingo and Final.",
      "Questions cover Data Science, Computer Science, Statistics and Mathematics.",
      "Top-performing teams advance from the Elimination round to Data Bingo and then to the Final.",
      "There is no negative marking for incorrect or unanswered questions.",
      "Mobile phones and smart devices are prohibited throughout all rounds.",
      "Time limits are strictly enforced. Tie-breaker questions may be used.",
    ],
    coordinators: [
      { name: "Blesson", phone: "8838484856" },
      { name: "Vinix", phone: "8838414576" },
      { name: "Remo", phone: "9344712584" },
      { name: "Maria Johnnet", phone: "6382103380" },
    ],
  },
  {
    id: "4",
    name: "VisQuest",
    slug: "visquest-data-visualisation",
    category: "Technical",
    tagline: "Data Visualisation",
    description: "Explore visualisation concepts, identify misleading charts and build a narrative from a provided dataset.",
    character: { name: "Stephen Strange", alias: "Doctor Strange", image: "/images/characters/doctor-strange.jpg", color: "from-orange-600 to-purple-950" },
    teamSize: "Exactly 2 Members",
    minTeam: 2,
    maxTeam: 2,
    venue: "Centenary Building",
    rounds: [
      { name: "Preliminary", description: "An elimination round with objective-type questions about data visualisation concepts, charts and graphs." },
      { name: "Spot the Deception", description: "Identify misleading elements in visualisations, explain why they are misleading and suggest corrections." },
      { name: "Data Visualisation Final", description: "Create a single narrative from a given dataset and justify the chosen visualisation technique." },
    ],
    rules: [
      "Each team must consist of exactly two participants.",
      "All communication must take place only in English.",
      "Round 1 is an objective-type elimination round about data visualisation concepts, charts and graphs.",
      "Round 2 asks teams to identify misleading visualisations, explain the errors and suggest corrections.",
      "In Round 3, teams construct a narrative from a dataset and justify their visualisation choices.",
      "Points from the rounds are added to the team's score.",
    ],
    coordinators: [
      { name: "Anne Rose", phone: "9342029891" },
      { name: "Blessy Rebekkah", phone: "7338790623" },
      { name: "Jersha Rachael", phone: "8939864436" },
    ],
  },
  {
    id: "5",
    name: "Pitch Storm",
    slug: "pitch-storm-shark-tank",
    category: "Technical",
    tagline: "Shark Tank",
    description: "Pitch an original, technology-based business idea. Explain the problem, solution, target market, revenue model and estimated investment.",
    character: { name: "Tony Stark", alias: "Iron Man", image: "/images/characters/iron-man.jpg", color: "from-amber-600 to-red-950" },
    teamSize: "2–3 Members",
    minTeam: 2,
    maxTeam: 3,
    venue: "Centenary Building",
    rounds: [
      { name: "Investor Pitch", duration: "8 minutes", description: "6 minutes for presentation and 2 minutes for Q&A." },
      { name: "Case Study Preliminary", description: "When registrations are high, an on-the-spot case study preliminary round may be conducted before the final investor pitch." },
    ],
    rules: [
      "Each team must consist of 2–3 participants and present an original, technology-based business idea using a PPT.",
      "Each team gets 6 minutes for presentation and 2 minutes for Q&A.",
      "Prototypes, product models, mobile applications and software demonstrations are optional but add value.",
      "Ideas must be legal, ethical and professionally presented.",
      "Teams must explain the problem, proposed solution, innovation, target market, revenue model and estimated investment.",
      "Evaluation considers innovation, feasibility, market potential, business model, presentation quality and prototype demonstration.",
      "Depending on registration volume, the event may include an on-the-spot case study preliminary round.",
      "Bring your own laptops and presentation equipment.",
    ],
    coordinators: [
      { name: "Joe Jerome", phone: "7904523973" },
      { name: "Jawwad Ahnaf", phone: "8870073991" },
      { name: "Michael Deepak", phone: "7395905050" },
    ],
  },
  {
    id: "6",
    name: "Dark Quest",
    slug: "dark-quest-blindfold-clues",
    category: "Non-Technical",
    tagline: "Blindfold Clues",
    description: "One participant is blindfolded while the teammate gives verbal clues to help identify images within the allotted time.",
    character: { name: "Peter Parker", alias: "Spider-Man", image: "/images/characters/spider-man.jpg", color: "from-red-600 to-blue-950" },
    teamSize: "Exactly 2 Members",
    minTeam: 2,
    maxTeam: 2,
    venue: "Centenary Building",
    rounds: [
      { name: "Preliminary", description: "One image is projected for each team. One participant is blindfolded while the other provides verbal clues." },
      { name: "Final", description: "Shortlisted teams identify a set of images within the allotted time using the same format." },
    ],
    rules: [
      "Each team must consist of exactly two participants.",
      "A maximum of two teams per college may participate.",
      "The event has Preliminary and Final rounds.",
      "Direct naming or spelling out the answer is strictly prohibited while giving clues.",
      "Teams may skip an image but cannot return to it later.",
      "There is no negative marking for incorrect answers.",
      "The blindfold must remain on until the round ends. Misconduct may result in disqualification.",
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
    slug: "brand-new-hunt-treasure-hunt",
    category: "Non-Technical",
    tagline: "Treasure Hunt",
    description: "Solve aptitude questions, logical puzzles and visual word clues across a three-round treasure hunt.",
    character: { name: "Rocket Raccoon", alias: "Rocket", image: "/images/characters/rocket-raccoon.jpg", color: "from-orange-600 to-stone-950" },
    teamSize: "Exactly 2 Members",
    minTeam: 2,
    maxTeam: 2,
    venue: "Centenary Building",
    rounds: [
      { name: "Preliminary", description: "Questions cover general aptitude, logical reasoning, puzzles, crosswords and pattern recognition. Shortlisted teams advance." },
      { name: "Visual Word Hunt", description: "Teams identify hidden words, phrases or connections from a set of images." },
      { name: "Final Surprise", description: "A final surprise round for the top-performing teams." },
    ],
    rules: [
      "Each team must consist of exactly two participants.",
      "The event comprises Preliminary, Visual Word Hunt and Final Surprise rounds.",
      "Participants must report at least 10 minutes before the event begins.",
      "Participants are requested to bring their laptops.",
      "Only shortlisted teams qualify for the next round.",
      "Visual Word Hunt answers must be submitted within the allotted time.",
      "Final qualification considers accuracy and speed.",
    ],
    coordinators: [
      { name: "Harish", phone: "8825407345" },
      { name: "Reymond", phone: "9345701952" },
      { name: "Nitin Xavier", phone: "8778404842" },
    ],
  },
  {
    id: "8",
    name: "Infinity Decode",
    slug: "infinity-decode-connections",
    category: "Technical",
    tagline: "Connections",
    description: "Connect images, words, letters and fragments to identify technical and data-related terms.",
    character: { name: "Tony Stark", alias: "Iron Man", image: "/images/characters/iron-man.jpg", color: "from-amber-500 to-red-950" },
    teamSize: "Exactly 2 Members",
    minTeam: 2,
    maxTeam: 2,
    venue: "Centenary Building",
    rounds: [
      { name: "Simple Tech Connections", description: "An elimination round: connect two or three images or words to identify a technical term." },
      { name: "Immediate Connections", description: "Combine two to four fragments, which may include images, letters or syllables, to form a tech word." },
      { name: "Complex Connections", description: "Identify four related technology or data terms from images, words or diagrams." },
    ],
    rules: [
      "Each team must consist of exactly two participants.",
      "Round 1 is an elimination round based on simple technology connections.",
      "Round 2 combines two to four image, letter or syllable fragments to form a complete word.",
      "Round 3 asks teams to identify four related technology or data terms from clues.",
      "All answers must be submitted within the allotted time.",
      "Points from the rounds are added to the team's score.",
    ],
    coordinators: [
      { name: "Thenmozhi", phone: "9976307305" },
      { name: "Joe Rakesh", phone: "8838414576" },
      { name: "Godwin Rufus", phone: "8807941612" },
    ],
  },
];

export const GENERAL_EVENT_RULES = [
  "Registration is free and open to students from Computer Science, Computer Applications, Data Science, Information Technology, Mathematics, Statistics and related departments.",
  "Only one team per department/college may participate in each event, except Dark Quest, which allows a maximum of two teams per college.",
  "A participant may take part in a maximum of two events, provided there are no scheduling conflicts.",
  "Participants must carry a valid College ID Card and Bonafide Certificate.",
  "Online registration must be completed before the deadline. On-spot registration, if available, depends on event availability.",
  "Collect participation cards from the registration desk before attending events.",
  "Report to the event venue on time. Late arrival may result in disqualification.",
  "Participants must arrange their own food and refreshments and take responsibility for personal belongings.",
  "Maintain discipline, follow the institution's dress code and follow instructions from organisers and coordinators.",
  "Misconduct, malpractice or damage to college property may result in disqualification.",
  "The decisions of judges and the organising committee are final.",
];
