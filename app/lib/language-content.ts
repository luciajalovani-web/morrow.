export type LanguageSlug = "english" | "french" | "spanish" | "italian" | "german";
export type LevelSlug = "a1" | "a2" | "b1" | "b2" | "c1" | "c2";

export type LearningLevel = {
  slug: LevelSlug;
  title: string;
  name: string;
  summary: string;
  lessons: number;
  progress: number;
  objectives: string[];
  grammar: string[];
  vocabulary: string[];
  listening: string[];
  reading: string[];
  writing: string[];
  speaking: string[];
  test: string;
  sequence: string[];
};

export type Language = {
  slug: LanguageSlug;
  name: string;
  flag: string;
  region: string;
  modules: number;
  heroWord: string;
  heroMeaning: string;
  exams: string[];
  image: string;
  imagePosition?: string;
  introduction: string;
  facts: string[];
  reasons: string[];
  levels: LearningLevel[];
};

const levelNames: Record<LevelSlug, { title: string; name: string; summary: string }> = {
  a1: { title: "A1", name: "Beginner", summary: "Build a foundation for everyday introductions, familiar words and simple exchanges." },
  a2: { title: "A2", name: "Elementary", summary: "Handle familiar routines and share simple information about the world around you." },
  b1: { title: "B1", name: "Intermediate", summary: "Find your footing in travel, work and the experiences you want to tell." },
  b2: { title: "B2", name: "Upper Intermediate", summary: "Express a point of view clearly and take part in more nuanced conversations." },
  c1: { title: "C1", name: "Advanced", summary: "Use the language with flexibility across academic, social and professional settings." },
  c2: { title: "C2", name: "Proficiency", summary: "Understand subtle meaning and communicate with precision, ease and range." },
};

function makeLevels(
  entries: Array<{
    slug: LevelSlug;
    lessons: number;
    progress: number;
    objectives: string[];
    grammar: string[];
    vocabulary: string[];
    listening: string[];
    reading: string[];
    writing: string[];
    speaking: string[];
    test: string;
    sequence: string[];
  }>,
): LearningLevel[] {
  return entries.map((entry) => ({
    ...levelNames[entry.slug],
    ...entry,
  }));
}

export const languages: Language[] = [
  {
    slug: "english",
    name: "English",
    flag: "🇬🇧",
    region: "United Kingdom · United States · and beyond",
    modules: 284,
    heroWord: "wanderlust",
    heroMeaning: "the urge to explore",
    exams: ["Cambridge", "IELTS", "TOEFL"],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85",
    introduction: "From a first coffee order to a late-night conversation, English is a language for joining in. Follow its stories through different places, voices and everyday expressions.",
    facts: [
      "English is an official language in more than 50 countries.",
      "Its vocabulary has travelled widely, borrowing words from Norse, French, Hindi and many more.",
      "The same familiar phrase can sound wonderfully different from London to Lagos to Los Angeles.",
    ],
    reasons: [
      "Open up travel, study and career opportunities across borders.",
      "Enjoy films, books, music and the internet in their original voices.",
      "Connect with people from an unusually wide range of backgrounds.",
    ],
    levels: makeLevels([
      { slug: "a1", lessons: 42, progress: 18, objectives: ["Introduce yourself: “Hi, I’m Maya. I’m from Bristol.”", "Ask and answer simple questions about home, work and family.", "Order a drink and understand prices, times and everyday signs."], grammar: ["be: I am / you are / she is", "a / an, plurals and this / that", "Present simple: I live near the station"], vocabulary: ["Introductions and countries", "Numbers, times and the days of the week", "Café basics: tea, still water, the bill"], listening: ["Pick out names and countries in a first-meeting dialogue.", "Listen for prices in a short café order."], reading: ["Follow a simple café menu and opening-hours sign.", "Find key details in a short personal profile."], writing: ["Complete a short introduction with your name and hometown.", "Write a three-line message arranging to meet."], speaking: ["Say hello, spell your name and introduce where you live.", "Role-play ordering a tea and asking for the price."], test: "A five-minute café challenge: listen, choose a drink and complete a two-line order.", sequence: ["First introductions", "Numbers and everyday questions", "A coffee and a conversation"] },
      { slug: "a2", lessons: 46, progress: 0, objectives: ["Describe your usual week and what you did yesterday.", "Make a simple plan and understand a short travel announcement.", "Explain preferences, familiar problems and what you need."], grammar: ["Past simple: we walked / I went", "Countable and uncountable nouns: much, many, some", "Comparatives: quieter, more convenient"], vocabulary: ["Getting around town", "Food shopping and ingredients", "Free time and weekend plans"], listening: ["Follow a neighbour describing a change of plans.", "Catch platform and departure details in a station notice."], reading: ["Understand a friendly email about a weekend visit.", "Compare opening times and services on local listings."], writing: ["Write a message inviting a friend for Saturday.", "Describe your neighbourhood in a short paragraph."], speaking: ["Compare two places to stay and give a simple reason.", "Tell a partner what you did last weekend."], test: "Listen to a weekend plan, then reply with a suitable time and place.", sequence: ["My week and my neighbourhood", "What happened yesterday?", "Making plans that work"] },
      { slug: "b1", lessons: 50, progress: 0, objectives: ["Explain the main points of familiar news and conversations.", "Describe experiences and say what you would do in common situations.", "Keep a conversation going while travelling or at work."], grammar: ["Present perfect and past simple in personal stories", "First conditional: if we leave early, we’ll...", "Reported requests and everyday phrasal verbs"], vocabulary: ["Travel delays and finding another route", "Workplace tasks and team conversations", "Feelings, experiences and personal milestones"], listening: ["Follow two travellers comparing a change of itinerary.", "Identify a caller’s problem and the solution offered."], reading: ["Read a first-person account of moving to a new city.", "Find supporting details in a practical travel article."], writing: ["Write a clear email asking for help with a booking.", "Tell a short story about a memorable day."], speaking: ["Describe an experience and answer follow-up questions.", "Suggest a solution when a train connection is missed."], test: "Read a travel problem, listen to two replies and record your own practical response.", sequence: ["Stories and experience", "Handling everyday complications", "Explaining choices and plans"] },
      { slug: "b2", lessons: 52, progress: 0, objectives: ["Discuss a range of topics and support a clear opinion.", "Follow the main ideas of longer talks and articles.", "Write a well-organised account with examples and reasons."], grammar: ["Second and third conditional in discussion", "Relative clauses and emphasis with cleft sentences", "Hedging: tends to, appears to, is likely to"], vocabulary: ["Media literacy and digital habits", "City life, housing and public spaces", "Collocations for work and decision-making"], listening: ["Follow a radio discussion where speakers disagree politely.", "Take notes on a short talk about flexible work."], reading: ["Compare two opinion pieces on city transport.", "Infer a writer’s attitude from a review."], writing: ["Write a balanced article weighing two sides of an issue.", "Make a reasoned recommendation in a work email."], speaking: ["Build and qualify an argument in a small-group discussion.", "Compare options and negotiate a shared decision."], test: "A paired discussion and a 220-word opinion piece on a familiar social topic.", sequence: ["Listening for the argument", "Making a case with nuance", "Writing for a clear purpose"] },
      { slug: "c1", lessons: 48, progress: 0, objectives: ["Use English flexibly in academic and professional situations.", "Recognise implied meaning, stance and changes of register.", "Present complex ideas in a coherent, well-signposted way."], grammar: ["Inversion for emphasis: rarely have we seen...", "Participle clauses and concise sentence structure", "Register choices in requests and professional writing"], vocabulary: ["Academic discussion and evidence", "Subtle stance: arguably, admittedly, nonetheless", "Idioms and register in workplace conversations"], listening: ["Track a university seminar’s claims and counterarguments.", "Notice shifts in tone in a long-form interview."], reading: ["Evaluate evidence and voice in a long feature article.", "Summarise the central line of an academic essay."], writing: ["Write a structured proposal for a real workplace change.", "Summarise a source and clearly distinguish your response."], speaking: ["Deliver a short, clearly signposted presentation.", "Respond spontaneously to questions about a complex proposal."], test: "Write a concise source-based proposal and discuss its implications in a follow-up.", sequence: ["Register and intention", "Synthesising information", "Presenting complex ideas with clarity"] },
      { slug: "c2", lessons: 46, progress: 0, objectives: ["Understand fine distinctions in demanding, natural English.", "Reformulate an idea for different audiences without losing meaning.", "Express subtle evaluation, humour and qualification precisely."], grammar: ["Concession and emphasis across extended argument", "Ellipsis and reference in fast, connected speech", "Stylistic variation for audience and effect"], vocabulary: ["Allusion, irony and understated humour", "Fine-grained evaluation and qualification", "Regional idiom and culturally marked references"], listening: ["Interpret irony and speaker relationships in a panel exchange.", "Reconstruct an argument from a fast, unscripted interview."], reading: ["Compare implication and voice across literary and journalistic prose.", "Identify ambiguity and rhetorical effects in a commentary."], writing: ["Adapt the same evidence into a public note and an executive brief.", "Write a nuanced review that balances judgement with context."], speaking: ["Paraphrase a dense argument for a mixed-audience group.", "Handle disagreement with precision and a natural register."], test: "Synthesize two contrasting sources, then defend a nuanced position in conversation.", sequence: ["Register, subtext and voice", "Synthesis across perspectives", "Choosing exactly the right words"] },
    ]),
  },
  {
    slug: "french",
    name: "French",
    flag: "🇫🇷",
    region: "France · Belgium · Switzerland · and more",
    modules: 216,
    heroWord: "flâner",
    heroMeaning: "to wander without hurry",
    exams: ["DELF", "DALF", "TCF"],
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=85",
    imagePosition: "center 53%",
    introduction: "French moves between a morning bonjour at the boulangerie and animated conversations that stretch into the evening. Learn the rhythm of its everyday politeness and the details that make a sentence feel natural.",
    facts: [
      "French is spoken on five continents and is an official language in 29 countries.",
      "In a Paris bakery, you may hear une tradition as the everyday name for a baguette.",
      "The Académie française has advised on written French since the seventeenth century.",
    ],
    reasons: [
      "Feel more at home in cafés, markets and conversations across the francophone world.",
      "Explore French cinema, literature and cooking in their original language.",
      "Build a useful second language for international study, culture and work.",
    ],
    levels: makeLevels([
      { slug: "a1", lessons: 38, progress: 12, objectives: ["Greet someone and say “Je m’appelle Léa, j’habite à Lyon.”", "Recognise familiar words on a boulangerie menu.", "Ask a simple question about a name, place or price."], grammar: ["être and avoir in the present", "Un / une, le / la and adjective agreement", "Simple questions with est-ce que"], vocabulary: ["Bonjour, au revoir and polite introductions", "Numbers, dates and basic personal details", "Une baguette, un café crème, s’il vous plaît"], listening: ["Hear the difference between bonjour and bonne soirée.", "Choose a pastry after listening to a short bakery order."], reading: ["Read a simple café menu and identify the prices.", "Match a short profile to a French-speaking city."], writing: ["Fill in a brief introduction: prénom, ville, langues.", "Write a polite two-line message to say hello."], speaking: ["Introduce yourself with je m’appelle and j’habite.", "Order une baguette and thank the person serving you."], test: "Listen to a bakery exchange and complete an order using un, une and s’il vous plaît.", sequence: ["Bonjour and first introductions", "Names, places and numbers", "À la boulangerie"] },
      { slug: "a2", lessons: 40, progress: 0, objectives: ["Talk about a recent outing using simple past forms.", "Describe your home and make a plan for the weekend.", "Handle common questions at a shop or train station."], grammar: ["Passé composé with avoir and être", "Partitive articles: du, de la and des", "Futur proche: on va visiter..."], vocabulary: ["Market produce and quantities", "Apartment rooms and furniture", "Train stations, tickets and directions"], listening: ["Follow a friend suggesting a Saturday market visit.", "Catch a platform change in a station announcement."], reading: ["Understand an invitation to a fête de quartier.", "Compare prices on a small market stall board."], writing: ["Reply to an invitation and propose a meeting time.", "Describe your apartment in five connected sentences."], speaking: ["Explain what you did dimanche dernier.", "Ask for directions to la gare and check the route."], test: "Respond to a market vendor, ask a price and explain what you bought yesterday.", sequence: ["A day at the market", "Talking about yesterday", "Making a plan for Saturday"] },
      { slug: "b1", lessons: 44, progress: 0, objectives: ["Explain an experience and give the main details of a story.", "Share an opinion about daily life, study and travel.", "Manage familiar travel situations with growing independence."], grammar: ["Imparfait and passé composé in a story", "Relative pronouns qui, que and où", "Si clauses for realistic plans and advice"], vocabulary: ["Booking a chambre d’hôtes", "Work routines and les collègues", "Describing culture, food and local traditions"], listening: ["Follow a host describing a change to your reservation.", "Pick out a speaker’s view in a short radio report."], reading: ["Read a first-person account of a summer in Bretagne.", "Find practical details in a chambre d’hôtes listing."], writing: ["Write a message to change a reservation politely.", "Describe a trip, using both background and key events."], speaking: ["Tell a story about a place you recently visited.", "Ask a host about breakfast, transport and local walks."], test: "Listen to a guesthouse call, then write a short account of a travel experience.", sequence: ["A story in two past tenses", "Travel without a script", "Opinions and local life"] },
      { slug: "b2", lessons: 47, progress: 0, objectives: ["Support an opinion with examples in a longer discussion.", "Follow the central argument of a radio feature.", "Write a clear, balanced text on a familiar social question."], grammar: ["Subjunctive after il faut que and bien que", "Pronouns en and y in connected speech", "Concession: même si, pourtant and tandis que"], vocabulary: ["La vie en ville and mobilité douce", "Media, information and point of view", "Everyday expressions for agreement and nuance"], listening: ["Compare viewpoints in a debate about les pistes cyclables.", "Note the argument and an example from a radio column."], reading: ["Compare two short articles on life without a car.", "Recognise an author’s reservation in a magazine review."], writing: ["Write a balanced response about city transport.", "Make a polite, well-supported suggestion to a local group."], speaking: ["Explain which transport option you would choose and why.", "Build on a different opinion with pourtant or en revanche."], test: "Read contrasting views on city life, then present and defend your own position.", sequence: ["Agreeing and disagreeing politely", "Reading for an implied viewpoint", "A considered written argument"] },
      { slug: "c1", lessons: 43, progress: 0, objectives: ["Follow sustained French across formal and informal settings.", "Present an analysis using precise links between ideas.", "Choose a suitable register for an email, talk or discussion."], grammar: ["Inversion in formal questions and written style", "Complex relative clauses and ce dont / ce à quoi", "Nominalisation in reports and summaries"], vocabulary: ["Presse, enjeux and débat public", "Qualifying claims: il semblerait que, certes", "Register choices: courrier, note and conversation"], listening: ["Track a round-table discussion about le patrimoine.", "Identify a guest’s reservations in a long-form interview."], reading: ["Evaluate reasoning in a French editorial.", "Summarise a cultural essay about regional identity."], writing: ["Draft a concise note proposing a cultural programme.", "Synthesize two sources on a local heritage question."], speaking: ["Present an interpretation and support it with evidence.", "Handle follow-up questions without losing your structure."], test: "Synthesize an editorial and interview, then give a structured short presentation.", sequence: ["Discourse markers and register", "Reading for stance", "Synthesis and presentation"] },
      { slug: "c2", lessons: 42, progress: 0, objectives: ["Understand implication, irony and allusion in authentic French.", "Recast complex ideas while preserving tone and emphasis.", "Express a finely qualified position with idiomatic ease."], grammar: ["Ellipsis and anaphora across extended argument", "Concession and emphasis in literary prose", "Stylistic variation in speech and writing"], vocabulary: ["Irony and understated disagreement", "Literary allusions and culturally specific references", "Fine distinctions in evaluation and intensity"], listening: ["Interpret humour and relationships in a French chronicle.", "Follow quick, overlapping viewpoints in a radio panel."], reading: ["Compare voice and implication in a column and an essay.", "Identify rhetorical effects in a literary extract."], writing: ["Adapt a long article into a short, elegant briefing.", "Write a review that balances tone, evidence and judgement."], speaking: ["Paraphrase a nuanced argument for a new audience.", "Defend a position while acknowledging its limits."], test: "Reframe a cultural argument in writing, then discuss its implications.", sequence: ["Subtext, irony and voice", "Reformulating with precision", "Argument for different audiences"] },
    ]),
  },
  {
    slug: "spanish",
    name: "Spanish",
    flag: "🇪🇸",
    region: "Spain · Latin America · and more",
    modules: 248,
    heroWord: "sobremesa",
    heroMeaning: "conversation after a meal",
    exams: ["DELE", "SIELE"],
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1400&q=85",
    imagePosition: "center 57%",
    introduction: "Spanish is heard in a quick hola over coffee, in stories passed around the table and in countless local accents. Start with the shared language, then notice the colourful expressions that give every place its character.",
    facts: [
      "Spanish is an official language in 20 countries and has hundreds of millions of native speakers.",
      "In Spain, vosotros is common; across much of Latin America, ustedes fills the plural role.",
      "The letter ñ has its own place in the alphabet and appears in words like mañana.",
    ],
    reasons: [
      "Travel more confidently through Spain and the many countries of Latin America.",
      "Enjoy Spanish-language films, music, food writing and conversation.",
      "Connect with a large, diverse community across several continents.",
    ],
    levels: makeLevels([
      { slug: "a1", lessons: 40, progress: 20, objectives: ["Say “Hola, soy Mateo y vivo en Sevilla.”", "Recognise everyday words in a café and on the street.", "Ask and answer simple questions about names and places."], grammar: ["Ser and llamarse for introductions", "Gender and number: un café, unas tapas", "Present tense of common regular verbs"], vocabulary: ["Greetings and personal details", "Numbers, days and meeting times", "Café con leche, agua sin gas and la cuenta"], listening: ["Identify where two new friends are from.", "Choose a snack after hearing a café order."], reading: ["Follow a short menu with tapas and prices.", "Understand a simple profile of a student in Sevilla."], writing: ["Complete a short personal profile in Spanish.", "Write a friendly message suggesting a café."], speaking: ["Introduce yourself and say where you live.", "Order a café con leche and ask for the bill."], test: "Listen to a café order and choose the right drink, quantity and polite closing.", sequence: ["¡Hola! First introductions", "Numbers, times and simple questions", "A little café conversation"] },
      { slug: "a2", lessons: 42, progress: 0, objectives: ["Describe your last outing and your plans for tomorrow.", "Ask about directions, meals and familiar services.", "Talk about preferences and make a simple comparison."], grammar: ["Pretérito indefinido for completed events", "Ir a + infinitive for plans", "Direct object pronouns: lo, la, los, las"], vocabulary: ["Directions around el barrio", "Market fruit and food quantities", "Accommodation and travel plans"], listening: ["Follow a friend explaining how to reach el mercado.", "Understand a short description of last Sunday’s paseo."], reading: ["Read a message about a day trip to Toledo.", "Find prices and hours on a local market notice."], writing: ["Describe what you ate and where you went yesterday.", "Message a friend to arrange tomorrow’s visit."], speaking: ["Ask where the bus stop is and check the answer.", "Compare two places to eat and say what you prefer."], test: "Find a route on a simple map and explain where you went last weekend.", sequence: ["My neighbourhood and directions", "A story from yesterday", "Plans and invitations"] },
      { slug: "b1", lessons: 46, progress: 0, objectives: ["Narrate an experience and describe what was happening around it.", "Explain a preference and respond to straightforward follow-up questions.", "Manage most familiar situations while travelling."], grammar: ["Pretérito imperfecto and indefinido in narratives", "Present subjunctive for wishes and advice", "Relative clauses with que, quien and donde"], vocabulary: ["Staying in una casa rural", "Study exchanges and daily routines", "Local celebrations and traditions"], listening: ["Follow a host explaining a change to a booking.", "Distinguish background from key events in a story."], reading: ["Understand a personal account of Las Fallas.", "Find details in a casa rural description."], writing: ["Write to a host explaining a small travel problem.", "Tell a story about a celebration you attended."], speaking: ["Describe a memorable journey with useful detail.", "Ask a host for advice about local transport."], test: "Listen to a booking conversation, then describe a travel experience in a short message.", sequence: ["Stories and the two past tenses", "Asking for advice", "Travel with growing confidence"] },
      { slug: "b2", lessons: 49, progress: 0, objectives: ["Discuss social topics and support an opinion with examples.", "Follow the main claims in an interview or debate.", "Write a connected argument and respond to another viewpoint."], grammar: ["Imperfect subjunctive in hypothetical situations", "Si clauses: si tuviera tiempo, viajaría", "Connectors: sin embargo, de hecho, por mucho que"], vocabulary: ["Sustainable travel and turismo responsable", "Digital life and media habits", "Language for qualifying and contrasting views"], listening: ["Compare opinions on overtourism in a radio discussion.", "Note a presenter’s reasons for choosing local travel."], reading: ["Compare accounts of tourism in Barcelona and Granada.", "Infer a writer’s stance in a cultural magazine article."], writing: ["Write a balanced proposal for more responsible travel.", "Reply to a travel opinion with examples and a counterpoint."], speaking: ["Discuss the effects of tourism on a local neighbourhood.", "Present an alternative and answer two follow-up questions."], test: "Read two views on mass tourism and make a supported recommendation.", sequence: ["A point of view with evidence", "Listening for contrast", "A balanced proposal"] },
      { slug: "c1", lessons: 45, progress: 0, objectives: ["Communicate fluidly in social, academic and workplace settings.", "Understand implied stance in a sustained discussion.", "Structure complex written work for clarity and emphasis."], grammar: ["Discourse emphasis and marked word order", "Subjunctive across concession and doubt", "Concise nominal structures in formal writing"], vocabulary: ["Public debate and políticas culturales", "Subtle evaluation: quizá, cabe señalar, no obstante", "Regional terms and register in authentic interviews"], listening: ["Track competing arguments in a cultural radio programme.", "Notice shifts between anecdote and evidence."], reading: ["Analyse an essay about heritage and regional identity.", "Summarise the line of reasoning in a long feature."], writing: ["Prepare a concise briefing from two contrasting sources.", "Write a structured commentary for a cultural magazine."], speaking: ["Present a nuanced analysis of a familiar public question.", "Handle a challenge with a clear, measured response."], test: "Synthesize two Spanish-language sources and defend your interpretation in a short talk.", sequence: ["Nuance and register", "Synthesis across sources", "Argument and response"] },
      { slug: "c2", lessons: 43, progress: 0, objectives: ["Interpret subtle tone, allusion and humour in natural Spanish.", "Reformulate dense information for a new purpose or audience.", "Express complex ideas idiomatically while preserving nuance."], grammar: ["Ellipsis and cohesion in extended speech", "Rhetorical emphasis and flexible clause structure", "Style shifts in editorial and conversational Spanish"], vocabulary: ["Irony, understatement and wordplay", "Regional idioms and culturally marked references", "Precise qualification and evaluation"], listening: ["Interpret humour and subtext in a Spanish-language chronicle.", "Follow rapid exchanges in a multi-speaker round table."], reading: ["Compare voice in an editorial and a literary essay.", "Notice how a columnist uses allusion to make a point."], writing: ["Reframe an essay as a short, accessible cultural note.", "Write an evaluative review with a distinct but measured voice."], speaking: ["Explain an allusion to someone unfamiliar with its context.", "Build on a disagreement with tact and precision."], test: "Synthesize conflicting cultural commentaries and give a precise spoken response.", sequence: ["Subtext, rhythm and register", "Adapting a complex argument", "A precise and natural voice"] },
    ]),
  },
  {
    slug: "italian",
    name: "Italian",
    flag: "🇮🇹",
    region: "Italy · San Marino · Switzerland · and more",
    modules: 192,
    heroWord: "meriggiare",
    heroMeaning: "to rest in the midday shade",
    exams: ["CILS", "CELI", "PLIDA"],
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=85",
    imagePosition: "center 58%",
    introduction: "Italian has a melody all its own, from un caffè at the bar to the lively back-and-forth of a family lunch. Discover useful everyday phrases and the expressive details that bring them to life.",
    facts: [
      "Italian is the official language of Italy, San Marino and Vatican City, and is widely spoken in Switzerland.",
      "A quick espresso is often simply un caffè, enjoyed standing at the bar.",
      "Many familiar music terms, including allegro and piano, come from Italian.",
    ],
    reasons: [
      "Enjoy regional food, art, design and history with a closer connection to local life.",
      "Make the most of a trip from a city café to a small village market.",
      "Explore one of the great languages of music, opera and cinema.",
    ],
    levels: makeLevels([
      { slug: "a1", lessons: 34, progress: 9, objectives: ["Say “Ciao, mi chiamo Giulia. Abito a Bologna.”", "Understand a short greeting and a simple café order.", "Ask for a name, a price and a familiar place."], grammar: ["Essere and avere in the present", "Articles and gender: il libro, la casa", "Common -are verbs: parlare, abitare"], vocabulary: ["Ciao, piacere and personal introductions", "Numbers and simple appointment times", "Al bar: un caffè, un cornetto, grazie"], listening: ["Recognise a first introduction and its reply.", "Listen to someone order a coffee at the bar."], reading: ["Read a simple menu and match drinks to prices.", "Find a host’s name and town in a short profile."], writing: ["Fill in a short profile with città and lingue.", "Write a friendly note to arrange an afternoon coffee."], speaking: ["Introduce yourself and spell your surname.", "Order un cappuccino and ask quanto costa."], test: "Listen to a bar order and choose the correct item and polite phrase.", sequence: ["Ciao and names", "Numbers and familiar places", "Un caffè al bar"] },
      { slug: "a2", lessons: 36, progress: 0, objectives: ["Talk about a recent day out and a plan for tomorrow.", "Find your way around a town and ask for a recommendation.", "Describe a favourite dish and make a simple comparison."], grammar: ["Passato prossimo with avere and essere", "Prepositions in city directions: a, in, da", "Comparatives: più tranquillo, meno caro"], vocabulary: ["Directions through the centro storico", "Market food and quantities", "A restaurant table and simple preferences"], listening: ["Follow directions from the stazione to a piazza.", "Understand someone describing a pranzo di domenica."], reading: ["Read a short note about visiting un mercato.", "Compare a trattoria menu and its opening hours."], writing: ["Describe a town you visited last weekend.", "Message a friend to reserve a table for two."], speaking: ["Ask how to get to the piazza and repeat the directions.", "Recommend a dish and say why you like it."], test: "Read a trattoria menu, choose a meal and explain a recent outing.", sequence: ["Around town", "A story from last weekend", "A table for two"] },
      { slug: "b1", lessons: 40, progress: 0, objectives: ["Tell a connected story and add background details.", "Share preferences about travel, work and everyday culture.", "Handle practical conversations with increasing independence."], grammar: ["Imperfetto and passato prossimo in a story", "Direct and indirect pronouns: lo, gli, le", "Conditional politeness: vorrei, potrebbe"], vocabulary: ["Agriturismo stays and local excursions", "Cooking, recipes and regional dishes", "Work routines and practical arrangements"], listening: ["Follow a host describing a change to an agriturismo stay.", "Pick out the main events in a story about Ferragosto."], reading: ["Understand a traveller’s account of a village festival.", "Find useful details in a country-house listing."], writing: ["Explain a booking problem politely to a host.", "Write about a memorable meal and the people there."], speaking: ["Tell a story with clear background and events.", "Ask about a local walk and say what you would prefer."], test: "Write a short travel account and respond to a host’s practical questions.", sequence: ["Everyday stories", "Polite requests and plans", "The people and places of a trip"] },
      { slug: "b2", lessons: 42, progress: 0, objectives: ["Discuss familiar social questions with supporting reasons.", "Follow a longer interview and separate fact from opinion.", "Write a clear argument with concessions and examples."], grammar: ["Congiuntivo after penso che and nonostante", "Conditional periods for imagined choices", "Connectors: tuttavia, benché, d’altra parte"], vocabulary: ["Il turismo lento and life in small towns", "Food traditions and contemporary culture", "Disagreement and qualification in conversation"], listening: ["Follow a discussion about turismo lento in Sicilia.", "Note a guest’s examples and reservations."], reading: ["Compare two pieces about living in a historic centre.", "Find evidence and opinion in a food-culture feature."], writing: ["Write a balanced proposal for a local cultural event.", "Reply to an opinion about tourism with a counterpoint."], speaking: ["Discuss whether a historic centre should limit cars.", "Present a compromise and explain the trade-offs."], test: "Compare two views on heritage tourism and make a reasoned recommendation.", sequence: ["Listening for stance", "Useful concession and contrast", "A reasoned proposal"] },
      { slug: "c1", lessons: 39, progress: 0, objectives: ["Use Italian flexibly in professional, cultural and academic contexts.", "Recognise an author's intention and implied point of view.", "Present detailed ideas with a clear line of reasoning."], grammar: ["Subjunctive across concession and uncertainty", "Formal inversion and sentence focus", "Nominal structures in concise reports"], vocabulary: ["Patrimonio, territorio and public debate", "Academic and professional discussion", "Nuance and register in Italian commentary"], listening: ["Follow an interview about preserving a historic district.", "Track evidence and counterarguments in a radio essay."], reading: ["Analyse an editorial about regional identity.", "Summarise an essay on cultural heritage and tourism."], writing: ["Draft a concise briefing on a community arts project.", "Synthesize an interview and an editorial on local heritage."], speaking: ["Present a structured interpretation to a small group.", "Respond to a question without losing precision."], test: "Combine an editorial and interview into a short briefing and oral response.", sequence: ["Register and emphasis", "Sources, evidence and inference", "Clear presentation of a nuanced view"] },
      { slug: "c2", lessons: 41, progress: 0, objectives: ["Follow subtle humour, implication and allusion in authentic Italian.", "Adapt language and tone while keeping a precise meaning.", "Communicate demanding ideas with natural rhythm and finesse."], grammar: ["Ellipsis and reference in lively conversation", "Rhetorical structures in editorial and literary prose", "Flexible focus and emphasis across a paragraph"], vocabulary: ["Understatement and playful irony", "Literary references and regional expressions", "Fine shades of appreciation and criticism"], listening: ["Interpret humour in a quick exchange on Italian radio.", "Follow overlapping points of view in a round-table conversation."], reading: ["Compare a satirical column and a cultural review.", "Identify allusion and rhetorical emphasis in an essay."], writing: ["Adapt a long cultural piece for a short public programme.", "Write a nuanced review with a distinctive voice."], speaking: ["Explain a layered reference and its effect on an audience.", "Use tactful disagreement while keeping a natural register."], test: "Interpret a satirical text, then explain its implication and tone to a new audience.", sequence: ["Irony, allusion and voice", "Adapting a cultural argument", "Precision with a natural rhythm"] },
    ]),
  },
  {
    slug: "german",
    name: "German",
    flag: "🇩🇪",
    region: "Germany · Austria · Switzerland · and more",
    modules: 203,
    heroWord: "Fernweh",
    heroMeaning: "a longing for faraway places",
    exams: ["Goethe", "telc", "TestDaF"],
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=85",
    imagePosition: "center 52%",
    introduction: "German opens doors to life in Germany, Austria and Switzerland, with plenty of regional character along the way. Build confidence with useful phrases, clear structure and the small words that connect a sentence.",
    facts: [
      "German is an official language in Germany, Austria, Liechtenstein and parts of Switzerland and Belgium.",
      "Nouns are capitalised, which makes the word das Abenteuer easy to spot in a sentence.",
      "The ß in Straße is called Eszett and is used in standard German spelling.",
    ],
    reasons: [
      "Prepare for study, work or travel across central Europe.",
      "Read German philosophy, science and literature in the language they were written in.",
      "Feel more at ease with everyday conversations, from a train platform to a neighbourhood shop.",
    ],
    levels: makeLevels([
      { slug: "a1", lessons: 37, progress: 15, objectives: ["Introduce yourself: “Hallo, ich heiße Jonas und komme aus Köln.”", "Recognise familiar words in a bakery and on a timetable.", "Ask simple questions about a person, a place and a price."], grammar: ["sein and haben in the present", "Noun gender: der, die, das", "Verb position in a simple main clause"], vocabulary: ["Greetings, names and countries", "Numbers, weekdays and appointment times", "In der Bäckerei: ein Brötchen, ein Kaffee, bitte"], listening: ["Identify a name and town in a short introduction.", "Choose an item after hearing a bakery order."], reading: ["Read a simple bakery price list.", "Find meeting details in a short message."], writing: ["Complete a profile with Name, Wohnort and Sprachen.", "Write a brief message to suggest a meeting time."], speaking: ["Say where you live and ask someone where they come from.", "Order ein Brötchen and say danke."], test: "Listen to a bakery exchange and complete an order with the correct article.", sequence: ["Hallo and introductions", "Numbers and meeting times", "Ein Besuch beim Bäcker"] },
      { slug: "a2", lessons: 39, progress: 0, objectives: ["Describe a past weekend and make a simple future plan.", "Ask for directions and understand a short local announcement.", "Talk about familiar work, home and leisure routines."], grammar: ["Perfekt with haben and sein", "Dative in common expressions: mit dem Bus", "Separable verbs: einkaufen, aufstehen"], vocabulary: ["Shopping at the Wochenmarkt", "Transport and asking for directions", "Apartment, chores and daily routines"], listening: ["Follow directions from the Bahnhof to the Marktplatz.", "Understand a neighbour describing yesterday’s routine."], reading: ["Read a message about a weekend in Freiburg.", "Find times and platforms on a local schedule."], writing: ["Describe what you did am Wochenende.", "Write a message asking how to reach a meeting place."], speaking: ["Explain your usual route to work or study.", "Ask a market seller how much the Äpfel cost."], test: "Read a timetable, choose a connection and explain how you travelled last weekend.", sequence: ["At home and in the neighbourhood", "Yesterday with the Perfekt", "Getting around town"] },
      { slug: "b1", lessons: 43, progress: 0, objectives: ["Explain an experience and add what was happening at the time.", "Give reasons for a choice in familiar social situations.", "Handle common travel and workplace exchanges."], grammar: ["Präteritum of sein, haben and modal verbs", "Two-way prepositions: in den Park, im Park", "Subordinate clauses with weil, dass and wenn"], vocabulary: ["A Praktikum and first work experiences", "Moving house and making appointments", "Hiking routes and outdoor plans"], listening: ["Follow a colleague explaining a change to a meeting.", "Pick out the main events in a story about a Wanderung."], reading: ["Understand a short account of a first Praktikum.", "Find conditions in a shared-flat listing."], writing: ["Write a clear email to arrange a viewing.", "Describe a hiking day, including a change in weather."], speaking: ["Explain why you would choose a particular flat.", "Ask about a route and clarify where it begins."], test: "Read a flat listing, write to the owner and respond to a question about your routine.", sequence: ["Past experience and background", "Reasons and subordinate clauses", "Practical plans and arrangements"] },
      { slug: "b2", lessons: 45, progress: 0, objectives: ["Discuss social topics with clear reasons and examples.", "Follow an extended report and identify its main position.", "Write a connected text that acknowledges another view."], grammar: ["Konjunktiv II for suggestions and hypotheticals", "Passive voice in news and process descriptions", "Relative clauses and connectors: obwohl, währenddessen"], vocabulary: ["Nachhaltige Mobilität and city planning", "News, media and reliable information", "Language for weighing advantages and drawbacks"], listening: ["Follow a radio debate about Fahrradwege in der Innenstadt.", "Note the evidence behind two speakers’ views."], reading: ["Compare arguments on urban public transport.", "Identify a writer’s qualification in a newspaper feature."], writing: ["Propose a practical change to a city transport plan.", "Write a balanced response to a news commentary."], speaking: ["Discuss the benefits of a ticket-free public transport day.", "Build on a disagreement and suggest a compromise."], test: "Compare a report and a listener response, then present a supported recommendation.", sequence: ["Finding the point of view", "Clear contrast and qualification", "A proposal that considers both sides"] },
      { slug: "c1", lessons: 42, progress: 0, objectives: ["Use German flexibly in professional and academic situations.", "Understand implied reservations in sustained discussion.", "Organise a complex argument with precise signposting."], grammar: ["Nominal style in formal reports", "Passive alternatives and precise agency", "Advanced connectors: insofern, wohingegen, zumal"], vocabulary: ["Stadtentwicklung and public consultation", "Research, evidence and professional exchange", "Subtle stance: durchaus, dennoch, allenfalls"], listening: ["Track competing recommendations in a planning discussion.", "Notice how a speaker qualifies a technical proposal."], reading: ["Analyse an editorial about housing in a growing city.", "Summarise the case made in a planning report."], writing: ["Write a concise recommendation for a community project.", "Synthesize two sources on neighbourhood development."], speaking: ["Present the strongest case for a planning proposal.", "Answer objections with precise qualifications."], test: "Synthesize a planning report and an editorial, then present a recommendation.", sequence: ["Academic and professional register", "Evidence, stance and inference", "Synthesis and an assured presentation"] },
      { slug: "c2", lessons: 44, progress: 0, objectives: ["Interpret subtle tone and implication in demanding German.", "Adapt complex content for readers with different backgrounds.", "Communicate with exact vocabulary, natural rhythm and nuance."], grammar: ["Ellipsis and reference across connected argument", "Information structure and word order for emphasis", "Stylistic variation in commentary and conversation"], vocabulary: ["Understatement and dry humour", "Culturally specific allusion and regional phrasing", "Fine distinctions in evaluation and degree"], listening: ["Interpret irony and subtext in a German radio feature.", "Follow quick exchanges in a multi-voice discussion."], reading: ["Compare rhetorical voice in an essay and a feuilleton.", "Identify implication in a finely qualified review."], writing: ["Adapt a specialist discussion for a public newsletter.", "Write a nuanced review that balances evidence and judgement."], speaking: ["Rephrase a complex point for a non-specialist audience.", "Disagree precisely while acknowledging the other position."], test: "Recast a demanding article for a new audience, then discuss what its tone implies.", sequence: ["Tone, implication and style", "Reformulating complex information", "Nuanced discussion for a real audience"] },
    ]),
  },
];

export const categories = [
  { slug: "grammar", name: "Grammar", description: "See the patterns that make everyday sentences work." },
  { slug: "vocabulary", name: "Vocabulary", description: "Find words for the places and moments you care about." },
  { slug: "listening", name: "Listening", description: "Tune your ear to natural voices and useful details." },
  { slug: "reading", name: "Reading", description: "Make sense of stories, signs and ideas worth sharing." },
  { slug: "writing", name: "Writing", description: "Put a message, a story or an opinion into your own words." },
  { slug: "speaking", name: "Speaking", description: "Build a voice for conversations, one small exchange at a time." },
  { slug: "tests", name: "Tests", description: "Check what is sticking with short, purposeful practice." },
  { slug: "exam-preparation", name: "Exam Preparation", description: "Prepare for the certificate that matters to your next step." },
] as const;

export const levelSlugs = Object.keys(levelNames) as LevelSlug[];

export function getLanguage(slug: string): Language | undefined {
  return languages.find((language) => language.slug === slug);
}

export function getLevel(language: Language, slug: string): LearningLevel | undefined {
  return language.levels.find((level) => level.slug === slug);
}
