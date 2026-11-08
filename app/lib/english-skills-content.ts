import type { LevelSlug } from "@/app/lib/language-content";

export type SkillQuestion = {
  prompt: string;
  type: "choice" | "boolean" | "text";
  options?: string[];
  acceptedAnswers: string[];
  explanation: string;
};

export type WritingTask = {
  id: string;
  title: string;
  format: string;
  prompt: string;
  instructions: string;
  minWords: number;
  maxWords: number;
  modelAnswer?: string;
  modelNote?: string;
};

export type ListeningLesson = {
  id: string;
  title: string;
  context: string;
  transcript: string;
  questions: SkillQuestion[];
};

export type ReadingLesson = {
  id: string;
  title: string;
  genre: string;
  passage: string;
  glossary: Array<{
    term: string;
    definition: string;
    translations: Record<"en" | "fr" | "es" | "it" | "de", string>;
    example: string;
  }>;
  questions: SkillQuestion[];
};

export const englishWriting: Record<LevelSlug, WritingTask> = {
  a1: {
    id: "a1-meeting-message",
    title: "A message to meet",
    format: "Everyday message",
    prompt: "Write a short message to a new classmate. Say hello, give your name and where you are from, and suggest a time and place to meet.",
    instructions: "Use simple sentences and include a greeting and a friendly ending.",
    minWords: 25,
    maxWords: 40,
    modelAnswer: "Hi Sam, I'm Alex. I'm from Bristol. I study English on Tuesday. Would you like to meet at the cafe at 3 pm? See you there!",
    modelNote: "The message gives the key details in a clear order: greeting, introduction, suggestion and closing.",
  },
  a2: {
    id: "a2-weekend-email",
    title: "An email about your weekend",
    format: "Friendly email",
    prompt: "Write to a friend about a recent weekend. Say where you went, who you went with, what you did and what you would like to do next weekend.",
    instructions: "Use past-tense verbs for the weekend and finish with one question for your friend.",
    minWords: 55,
    maxWords: 80,
    modelAnswer: "Hi Mia,\n\nI had a lovely weekend. On Saturday, I went to the market with my sister. We bought fresh bread and ate lunch by the river. On Sunday, I stayed at home because it rained. Next weekend, I would like to visit the new art museum. Would you like to come with me?\n\nWrite soon,\nElla",
    modelNote: "Past events use the past simple, and the final question invites the reader to reply.",
  },
  b1: {
    id: "b1-travel-story",
    title: "A journey that changed",
    format: "Personal story",
    prompt: "Tell a story about a journey that did not go as planned. Explain what happened, how you felt and what you learned from the experience.",
    instructions: "Organise the story into a beginning, the unexpected problem and its outcome. Use time expressions to guide the reader.",
    minWords: 110,
    maxWords: 150,
    modelAnswer: "Last spring, I was travelling by train to visit my cousin when our train stopped outside a small town. At first, nobody knew why. After twenty minutes, an announcement explained that a tree had fallen across the line. I felt worried because I had promised to arrive before dinner. However, another passenger showed me a local bus route. I got off at the next station and continued by bus. I arrived late, but my cousin had kept some food for me. The delay taught me to check alternative routes and not to assume that a difficult start will ruin the whole day.",
    modelNote: "Time markers make the sequence easy to follow; contrast words connect the problem to its resolution.",
  },
  b2: {
    id: "b2-city-transport",
    title: "Rethinking the daily commute",
    format: "Opinion article",
    prompt: "Write an article for a community website discussing whether cities should make public transport cheaper, even if this means spending less on road projects. Give reasons and acknowledge a different point of view.",
    instructions: "State your position, support it with relevant examples, and end with a practical recommendation.",
    minWords: 180,
    maxWords: 230,
    modelAnswer: "A more affordable journey can change how a city moves. When buses and trains are reliable and reasonably priced, people are more likely to leave the car at home. That can reduce congestion while making work, education and local services easier to reach.\n\nCost is not the only barrier, of course. A cheaper bus that arrives once an hour is not a realistic alternative for someone with a fixed shift. Investment should therefore improve frequency and connections as well as fares. Road maintenance also remains essential, particularly for deliveries and emergency services.\n\nCities should fund a balanced network, but put new investment where it helps the greatest number of residents. A trial of reduced fares on busy routes, combined with better evening services, would provide evidence before a city-wide change. The goal is not to punish drivers; it is to make the practical choice the easier one.",
    modelNote: "The article presents a position, recognises a counterpoint and offers a specific recommendation.",
  },
  c1: {
    id: "c1-project-proposal",
    title: "A proposal for a shared-work programme",
    format: "Formal proposal",
    prompt: "Your organisation is considering a programme that lets staff work from a local community hub one day a week. Write a proposal evaluating its benefits, risks and practical requirements.",
    instructions: "Use a professional register, headings or clear paragraphs, and evidence-based recommendations. Avoid unsupported claims.",
    minWords: 230,
    maxWords: 290,
    modelAnswer: "Purpose\nThis proposal considers a six-month pilot in which teams may work from a community hub one day each week.\n\nPotential value\nA local hub could reduce commuting time for staff who live far from the main office. Shared meeting rooms may also support focused work and collaboration with other local organisations. These advantages should be treated as hypotheses, however, rather than guaranteed outcomes.\n\nRisks and requirements\nThe organisation would need to assess accessibility, information security, private-call facilities and reliable connectivity before selecting a venue. Participation should remain optional during the pilot, since some roles require equipment or face-to-face contact that a shared space cannot provide. Managers would also need consistent expectations for availability and performance.\n\nRecommendation\nI recommend a limited pilot with two volunteer teams. Before it begins, the organisation should agree on a modest budget and a written security checklist. At the end of each month, participants should report on travel time, concentration and practical obstacles. A final review can then compare those findings with the cost and decide whether the arrangement merits expansion.",
    modelNote: "The proposal separates purpose, evaluation and action, while qualifying claims that have not yet been measured.",
  },
  c2: {
    id: "c2-essay-measurement",
    title: "What should a successful city measure?",
    format: "Reflective essay",
    prompt: "Write an essay examining the limits of measuring a city's success through economic growth alone. Consider at least two other dimensions and explain how decision-makers might balance them.",
    instructions: "Develop a nuanced argument, distinguish evidence from assumption, and connect your conclusion to the points raised earlier.",
    minWords: 280,
    maxWords: 360,
    modelAnswer: "Economic growth is an attractive shorthand for urban success: it is measurable, comparable and closely connected to employment and public revenue. Yet a rising total can conceal who benefits, what has been displaced and whether the city remains liveable for the people whose work sustains it.\n\nDistribution is one necessary qualification. If higher-value employment raises average income while housing costs rise faster for lower-paid residents, growth may coexist with a shrinking ability to remain in the city. This does not make economic indicators irrelevant; rather, it suggests that averages should be read alongside affordability, wage distribution and access to essential services.\n\nA second dimension is resilience. A city dependent on one industry may appear prosperous while remaining exposed to a single shock. Diversified employment, robust infrastructure and healthy public institutions are less visible in a headline figure, but they influence whether prosperity can be maintained. Environmental costs matter for the same reason: pollution or heat-related risk can transfer present gains into future public expense.\n\nNo single metric can settle these questions, and a long list of indicators can obscure trade-offs instead of clarifying them. Decision-makers might therefore publish a small set of complementary measures, explain how each is calculated and identify who gains or bears a cost. Growth remains useful as one signal. It becomes a more credible measure of success only when interpreted beside distribution, resilience and the conditions of everyday life.",
    modelNote: "The essay qualifies its central claim, develops distinct dimensions and returns to a practical framework in its conclusion.",
  },
};

export const englishListening: Record<LevelSlug, ListeningLesson> = {
  a1: {
    id: "a1-first-day",
    title: "Meeting a new classmate",
    context: "A short conversation before an English class.",
    transcript: "Ava: Hello. Is this your first English class? Leo: Yes, it is. My name is Leo. What's your name? Ava: I'm Ava. Nice to meet you. Where are you from? Leo: I'm from Porto, but I live near the station now. Ava: Welcome! The class starts at ten. Leo: Great. Thank you.",
    questions: [
      { type: "choice", prompt: "Where is Leo from?", options: ["Porto", "London", "The station"], acceptedAnswers: ["Porto"], explanation: "Leo says, “I'm from Porto.” He lives near the station now, but that is where he lives, not where he is from." },
      { type: "text", prompt: "What time does the class start?", acceptedAnswers: ["ten", "10", "10 o'clock", "ten o'clock"], explanation: "Ava says the class starts at ten." },
    ],
  },
  a2: {
    id: "a2-market-plan",
    title: "Changing Saturday plans",
    context: "Two friends make a plan after checking the weather.",
    transcript: "Nina: Are we still going to the beach on Saturday? Tom: I checked the forecast this morning. It will probably rain until lunchtime. Nina: We could visit the covered market instead. It opens at nine, and the food stalls are usually quiet before eleven. Tom: That sounds good. I can meet you outside the station at half past ten. Nina: Perfect. We can have lunch there and go for a walk if the weather improves. Tom: I'll bring an umbrella just in case.",
    questions: [
      { type: "choice", prompt: "Why are Nina and Tom changing their original plan?", options: ["The forecast predicts rain", "The market is closed", "Tom has to work"], acceptedAnswers: ["The forecast predicts rain"], explanation: "Tom checked the forecast, which predicts rain until lunchtime." },
      { type: "text", prompt: "Where will Tom meet Nina?", acceptedAnswers: ["outside the station", "at the station", "the station"], explanation: "Tom says he can meet Nina outside the station." },
    ],
  },
  b1: {
    id: "b1-library-volunteer",
    title: "A new role at the library",
    context: "A volunteer describes their first week to a friend.",
    transcript: "When I signed up to help at the neighbourhood library, I thought I would mostly put books back on the shelves. There is some of that, but on Wednesday I helped run a conversation group for people who are learning English. I was nervous at first because I had never led a group before. The librarian had prepared picture cards, so everyone could join in without feeling put on the spot. One visitor told us about a recipe from her home town, and the group asked questions about the ingredients. By the end, we had been talking for nearly an hour. I am going back next week, and I want to bring a map so people can share where their stories began.",
    questions: [
      { type: "choice", prompt: "What surprised the speaker about the library role?", options: ["They helped run an English conversation group", "They had to work every evening", "They were asked to cook lunch"], acceptedAnswers: ["They helped run an English conversation group"], explanation: "The speaker expected mostly to shelve books but also helped with a conversation group." },
      { type: "boolean", prompt: "The picture cards helped people take part in the group.", options: ["True", "False"], acceptedAnswers: ["True"], explanation: "The speaker says the cards let everyone join in without feeling put on the spot." },
    ],
  },
  b2: {
    id: "b2-four-day-week",
    title: "What a four-day week changed",
    context: "A radio guest reflects on a workplace trial.",
    transcript: "Host: Your design studio trialled a four-day week last year. Did everyone simply compress five days of meetings into four? Guest: We tried that for the first fortnight, and it was exhausting. The useful change was not the calendar by itself; it was asking which meetings needed to happen at all. We replaced a daily status meeting with a shared written update. That freed up time, but it also meant managers had to be more deliberate about checking in with people who were new to the team. Host: What about clients who still expected a response on Friday? Guest: We published a rota and made sure someone was available for urgent work. It was not a universal solution. The trial worked for our project teams because deadlines could be planned, but colleagues supporting live events had less flexibility. We now review workload each month rather than assuming that a shorter week automatically means a healthier one.",
    questions: [
      { type: "choice", prompt: "What was the guest's main lesson from the first two weeks?", options: ["They needed to reconsider unnecessary meetings", "They should answer fewer client emails", "They needed to hire more managers"], acceptedAnswers: ["They needed to reconsider unnecessary meetings"], explanation: "The guest says the useful change was reviewing which meetings needed to happen." },
      { type: "boolean", prompt: "The guest says the same four-day schedule suited every role equally.", options: ["True", "False"], acceptedAnswers: ["False"], explanation: "The trial was less flexible for colleagues supporting live events." },
    ],
  },
  c1: {
    id: "c1-coastal-restoration",
    title: "Restoring a working coastline",
    context: "An environmental researcher explains a community project.",
    transcript: "The restoration programme began with an assumption that is now being revised: that planting more trees along the estuary would, on its own, protect nearby homes. Trees can stabilise some banks and provide habitat, but the coastline is a working landscape. Fishing access, drainage channels and seasonal flooding all shape what can succeed. Rather than impose one design, our team mapped how residents and local businesses use the shore throughout the year. We then selected three trial sites with different conditions. At one, a narrow strip of native plants reduced erosion. At another, the same planting would have blocked a route used by small boats, so we are testing a different layout. The monitoring matters as much as the planting. We record water levels, vegetation survival and residents' observations, then publish the results, including the sites where an intervention has not worked. That evidence will not eliminate disagreement about the coast's future, but it gives the discussion a shared basis.",
    questions: [
      { type: "choice", prompt: "Why did the team revise its original assumption?", options: ["Planting alone did not account for how the coast is used", "Residents refused to take part in any mapping", "The estuary had no erosion problem"], acceptedAnswers: ["Planting alone did not account for how the coast is used"], explanation: "The coast supports several uses, so a single planting approach would not suit every site." },
      { type: "text", prompt: "Name one kind of evidence the team records.", acceptedAnswers: ["water levels", "vegetation survival", "residents' observations", "resident observations"], explanation: "The transcript names water levels, vegetation survival and residents' observations." },
    ],
  },
  c2: {
    id: "c2-public-data",
    title: "When public data changes a decision",
    context: "A policy analyst discusses the value and limits of open data.",
    transcript: "Open data is often presented as a straightforward route to accountability: publish the numbers and the public can judge the institution. That account is incomplete. Data can make a decision easier to scrutinise, but only if people can see how the categories were defined, what was excluded and how uncertainty was handled. Consider a city that reports average journey times. A single average may improve while late-night routes become less reliable for a small group of workers. If the underlying distribution and the time of day are hidden, the headline figure can be accurate and still give a misleading impression of who benefits. The answer is not to publish every record indiscriminately. Privacy, collection costs and the risk of false precision are real constraints. Instead, institutions should explain the purpose of each measure, document its limitations and invite scrutiny before a metric becomes a target. Used this way, data does not replace public judgement. It provides a more testable account of the choices that judgement must assess.",
    questions: [
      { type: "choice", prompt: "What limitation of an average journey-time figure does the analyst highlight?", options: ["It may hide worse outcomes for a smaller group", "It cannot be collected by a city", "It always includes private information"], acceptedAnswers: ["It may hide worse outcomes for a smaller group"], explanation: "A city-wide average can conceal less reliable late-night routes for some workers." },
      { type: "boolean", prompt: "The analyst argues that institutions should publish every record without restriction.", options: ["True", "False"], acceptedAnswers: ["False"], explanation: "The speaker notes privacy, collection costs and false precision as constraints." },
    ],
  },
};

export const englishReading: Record<LevelSlug, ReadingLesson> = {
  a1: {
    id: "a1-park-notice",
    title: "A note from the neighbourhood",
    genre: "Short dialogue",
    passage: "Rosa: Hello, I'm Rosa. I live on Green Street with my brother. Ben: Is the park near your neighbourhood? Rosa: Yes. We go on Saturday at ten. We take a ball and sandwiches. The small cafe closes at four. Would you like to come with us? Ben: Yes, thank you!",
    glossary: [
      { term: "neighbourhood", definition: "The area near where someone lives.", translations: { en: "area where people live", fr: "quartier", es: "barrio", it: "quartiere", de: "Wohnviertel" }, example: "Our neighbourhood has a small park." },
      { term: "closes", definition: "Stops being open to visitors.", translations: { en: "stops being open", fr: "ferme", es: "cierra", it: "chiude", de: "schließt" }, example: "The shop closes at six." },
    ],
    questions: [
      { type: "choice", prompt: "What time do Rosa and her brother go to the park?", options: ["At ten", "At four", "At six"], acceptedAnswers: ["At ten"], explanation: "The notice says they go to the park at ten on Saturday." },
      { type: "boolean", prompt: "The cafe closes at ten.", options: ["True", "False"], acceptedAnswers: ["False"], explanation: "The cafe closes at four, not ten." },
      { type: "text", prompt: "What do Rosa and her brother take to the park?", acceptedAnswers: ["a ball and sandwiches", "a ball and some sandwiches", "ball and sandwiches"], explanation: "They take a ball and some sandwiches." },
    ],
  },
  a2: {
    id: "a2-community-garden",
    title: "A garden beside the station",
    genre: "Community update",
    passage: "Last month, the empty space beside North Street station became a community garden. Local residents built six raised beds and planted tomatoes, beans and herbs. The group meets every Sunday morning, but visitors can look around at any time. There is a small sign with a map near the gate. If you would like to help, bring a pair of gloves; the group has extra tools to share. The first vegetables should be ready in July, and volunteers plan to cook a free lunch for everyone who helped.",
    glossary: [
      { term: "raised beds", definition: "Garden areas built above ground level, often inside a wooden frame.", translations: { en: "raised garden plots", fr: "bacs potagers surélevés", es: "bancales elevados", it: "aiuole rialzate", de: "Hochbeete" }, example: "They grow herbs in raised beds." },
      { term: "volunteers", definition: "People who offer their time without being paid.", translations: { en: "people who freely give their time", fr: "bénévoles", es: "voluntarios", it: "volontari", de: "Freiwillige" }, example: "Volunteers planted the trees." },
    ],
    questions: [
      { type: "choice", prompt: "When does the gardening group meet?", options: ["Every Sunday morning", "Every Saturday evening", "Every day at noon"], acceptedAnswers: ["Every Sunday morning"], explanation: "The update says the group meets every Sunday morning." },
      { type: "text", prompt: "What should a new helper bring?", acceptedAnswers: ["a pair of gloves", "gloves"], explanation: "Visitors who would like to help are asked to bring a pair of gloves." },
      { type: "boolean", prompt: "The first vegetables are expected in July.", options: ["True", "False"], acceptedAnswers: ["True"], explanation: "The update says the first vegetables should be ready in July." },
    ],
  },
  b1: {
    id: "b1-night-bus",
    title: "The route that connects the late shift",
    genre: "Local news",
    passage: "When the last train leaves the city centre, a number of people are still finishing work. For years, hospital cleaner Anika Shah relied on a lift from a colleague after her evening shift. That changed when the city extended its night-bus route to the hospital entrance. The service runs every forty minutes between midnight and five in the morning. Anika says the most useful difference is not simply the lower cost of travel; it is being able to plan her journey without asking someone else for help. The transport team introduced the extension after surveying late-shift workers and reviewing passenger counts from a shorter trial. The city will examine the route again in six months. Officials say they will consider reliability and who uses the service, rather than passenger numbers alone, before deciding whether to keep it.",
    glossary: [
      { term: "relied on", definition: "Needed or trusted someone or something for support.", translations: { en: "depended on", fr: "comptait sur", es: "dependía de", it: "si affidava a", de: "verließ sich auf" }, example: "We relied on the local bus during the repair work." },
      { term: "extension", definition: "An addition that makes a service reach further.", translations: { en: "addition that reaches further", fr: "prolongement", es: "ampliación", it: "estensione", de: "Erweiterung" }, example: "The route extension now reaches the hospital." },
      { term: "reliability", definition: "The quality of working as expected consistently.", translations: { en: "consistent dependability", fr: "fiabilité", es: "fiabilidad", it: "affidabilità", de: "Zuverlässigkeit" }, example: "Passengers value the reliability of the early train." },
    ],
    questions: [
      { type: "choice", prompt: "What does Anika value most about the new route?", options: ["Planning her journey independently", "Getting a larger salary", "Finishing work before midnight"], acceptedAnswers: ["Planning her journey independently"], explanation: "She says she can plan without asking a colleague for a lift." },
      { type: "boolean", prompt: "The city will judge the route only by passenger totals.", options: ["True", "False"], acceptedAnswers: ["False"], explanation: "Officials will also consider reliability and who uses the service." },
      { type: "text", prompt: "How often does the night bus run?", acceptedAnswers: ["every forty minutes", "40 minutes", "forty minutes"], explanation: "The service runs every forty minutes from midnight to five." },
    ],
  },
  b2: {
    id: "b2-repair-cafes",
    title: "The case for keeping repair skills local",
    genre: "Feature article",
    passage: "On the first Thursday of each month, the workshop at Easton Community Hall fills with lamps, radios and bicycles that have stopped working. The repair cafe is not a shop, and its volunteers do not promise to fix every item. Instead, visitors sit beside someone with practical experience and learn how to inspect a loose cable, replace a worn brake pad or decide when a repair is unsafe.\n\nThe organisers began the project after noticing that residents often discarded small appliances for want of an affordable repair. Their early sessions attracted mostly older visitors. A partnership with a local college has since brought in students, who help explain digital devices while learning from volunteers who have repaired household equipment for decades. The exchange is valuable, although it requires more planning than a simple drop-in service: a booking system, accessible instructions and a safe way to handle damaged batteries.\n\nThe cafe cannot solve the larger problem of products designed to be difficult to repair. Nor can volunteer time replace professional work on dangerous equipment. Its contribution is smaller and more immediate. It makes repair visible, gives people a chance to learn a skill and creates a place where knowledge can move between generations. The organisers now record how many items are repaired, but they also ask visitors whether they feel more confident attempting a safe repair themselves. Those answers may reveal an outcome that a tally of saved objects would miss.",
    glossary: [
      { term: "for want of", definition: "Because something necessary or useful is missing.", translations: { en: "because of a lack of", fr: "faute de", es: "por falta de", it: "per mancanza di", de: "mangels" }, example: "The trip was cancelled for want of a suitable vehicle." },
      { term: "drop-in", definition: "Available to visit without booking a set appointment.", translations: { en: "available without an appointment", fr: "sans rendez-vous", es: "sin cita previa", it: "senza appuntamento", de: "ohne Termin" }, example: "The centre runs a drop-in advice session." },
      { term: "tally", definition: "A count or record of the total number.", translations: { en: "a count or total", fr: "décompte", es: "recuento", it: "conteggio", de: "Zählung" }, example: "The tally does not show how people learned." },
    ],
    questions: [
      { type: "choice", prompt: "Why did the repair cafe add a booking system and safety procedures?", options: ["The mix of equipment and visitors required more planning", "The hall was closing every month", "Volunteers stopped sharing their skills"], acceptedAnswers: ["The mix of equipment and visitors required more planning"], explanation: "The article explains that collaboration, accessibility and battery safety need planning." },
      { type: "boolean", prompt: "The article claims volunteer repair cafes can replace professional work on dangerous equipment.", options: ["True", "False"], acceptedAnswers: ["False"], explanation: "It explicitly says volunteer time cannot replace professional work on dangerous equipment." },
      { type: "text", prompt: "Name one outcome the organisers measure beyond the number of items repaired.", acceptedAnswers: ["visitors' confidence", "visitor confidence", "whether visitors feel more confident", "confidence attempting a safe repair"], explanation: "They ask whether visitors feel more confident attempting a safe repair themselves." },
    ],
  },
  c1: {
    id: "c1-library-hours",
    title: "Who benefits when a library stays open later?",
    genre: "Analysis",
    passage: "A proposal to extend library opening hours is often framed as a simple question of demand. If more people use the building after six o'clock, the argument goes, later hours are justified. Yet a count of evening visitors can be a poor substitute for asking who cannot use the service at present. A parent working a late shift, a student sharing a crowded home and a person who relies on a daytime bus may all encounter different barriers, even if they live within walking distance.\n\nEastbank Library tested two later evenings each week for one term. Its evaluation paired entry counts with short interviews and a review of which services visitors used. The result was not an unqualified case for expansion. Study-space use rose markedly, while attendance at children's events remained low. Staff also noted that the final bus departure constrained some visitors more than the closing time did. These findings point to a distinction between extending access and merely extending the building's schedule.\n\nThe council's next decision should therefore combine operating costs with evidence about unmet need. It could retain the later study evenings, trial one event aimed at families, and publish the bus connection problem for transport planners to address. This approach treats opening hours as one part of access rather than an outcome in themselves. It also makes the trade-off visible: funding a quieter evening session may be worthwhile if it serves people who otherwise have no practical alternative, but that judgement should be stated rather than hidden behind a single attendance figure.",
    glossary: [
      { term: "substitute", definition: "Something used in place of another thing, sometimes inadequately.", translations: { en: "replacement", fr: "substitut", es: "sustituto", it: "sostituto", de: "Ersatz" }, example: "A raw count is a poor substitute for asking users." },
      { term: "unqualified", definition: "Not limited or accompanied by a reservation or condition.", translations: { en: "without reservation or condition", fr: "sans réserve", es: "sin reservas", it: "senza riserve", de: "uneingeschränkt" }, example: "The findings do not offer unqualified support." },
      { term: "unmet need", definition: "A need that is not currently being addressed.", translations: { en: "need not currently addressed", fr: "besoin non satisfait", es: "necesidad no cubierta", it: "bisogno insoddisfatto", de: "ungedeckter Bedarf" }, example: "Interviews revealed an unmet need for quiet study space." },
    ],
    questions: [
      { type: "choice", prompt: "What does the article suggest visitor counts cannot show on their own?", options: ["Who faces barriers to using the library", "How much the building costs to heat", "When the library first opened"], acceptedAnswers: ["Who faces barriers to using the library"], explanation: "The article argues that counts do not reveal who cannot currently access the service or why." },
      { type: "boolean", prompt: "The trial showed that every evening service became more popular.", options: ["True", "False"], acceptedAnswers: ["False"], explanation: "Study-space use rose, but attendance at children's events remained low." },
      { type: "text", prompt: "What other service limited some visitors' ability to stay late?", acceptedAnswers: ["the final bus", "bus departure", "the bus service"], explanation: "The final bus departure constrained some visitors more than library closing time." },
    ],
  },
  c2: {
    id: "c2-measuring-quiet",
    title: "The value of what a city does not count",
    genre: "Long-form commentary",
    passage: "Cities are adept at counting what can be made legible to a spreadsheet: journeys completed, permits issued, trees planted, calls answered. Such measures are indispensable. They make budgets contestable and can expose a service that is failing behind a reassuring slogan. The difficulty begins when a proxy acquires the authority of the thing it was meant to represent.\n\nConsider a programme that rewards neighbourhoods for planting trees. A city can report the number of saplings distributed within weeks; it may take years to know which survived, whether they shade a useful route and whether residents had any influence over their placement. Counting distribution is not an error. Treating distribution as proof of environmental improvement is. The same slippage occurs when a transport authority counts journeys but not the time lost waiting for a connection, or when a health service counts appointments without asking whether a patient could attend them.\n\nThe obvious response is to add indicators, but more measurement has costs of its own. Each measure demands collection, interpretation and protection. A dense scorecard can also shift attention from public reasoning to an apparently technical contest over weights. A number may clarify a disagreement; it cannot decide which unequal outcomes a community is willing to accept.\n\nA more defensible practice is modest and explicit. Institutions should describe what a measure can and cannot establish, pair output counts with evidence of experience and distribution, and revisit proxies when they begin to drive behaviour. Qualitative accounts are not a substitute for systematic evidence, any more than a spreadsheet is a substitute for public judgement. The aim is not to count everything. It is to prevent a convenient count from quietly standing in for a contested value.",
    glossary: [
      { term: "legible", definition: "Clear enough to be understood or interpreted.", translations: { en: "easy to understand", fr: "compréhensible", es: "comprensible", it: "chiaro", de: "verständlich" }, example: "The report makes the budget process legible." },
      { term: "proxy", definition: "A measure used to represent something that is difficult to observe directly.", translations: { en: "indirect measure", fr: "indicateur indirect", es: "indicador indirecto", it: "indicatore indiretto", de: "Ersatzindikator" }, example: "Journey totals are a proxy for access, not access itself." },
      { term: "slippage", definition: "A gradual or unintended movement from one meaning or position to another.", translations: { en: "gradual shift in meaning", fr: "glissement", es: "deslizamiento", it: "slittamento", de: "Bedeutungsverschiebung" }, example: "There is a slippage between output and outcome." },
      { term: "defensible", definition: "Able to be supported with reasonable arguments or evidence.", translations: { en: "able to be justified", fr: "défendable", es: "defendible", it: "difendibile", de: "vertretbar" }, example: "The policy needs a defensible evidence base." },
    ],
    questions: [
      { type: "choice", prompt: "What is the central risk of a proxy measure, according to the article?", options: ["It may be treated as proof of a broader value it only approximates", "It is always too expensive to collect", "It prevents cities from publishing any results"], acceptedAnswers: ["It may be treated as proof of a broader value it only approximates"], explanation: "The article warns that proxies can gain the authority of the outcome they were meant to represent." },
      { type: "boolean", prompt: "The writer recommends replacing quantitative measures with personal stories.", options: ["True", "False"], acceptedAnswers: ["False"], explanation: "The writer argues that qualitative accounts and systematic evidence should complement each other." },
      { type: "text", prompt: "According to the final paragraph, what should institutions revisit when it begins to drive behaviour?", acceptedAnswers: ["proxies", "the proxies", "proxy measures"], explanation: "The writer says institutions should revisit proxies when they begin to drive behaviour." },
    ],
  },
};
