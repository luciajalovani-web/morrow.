import type { LanguageSlug, LevelSlug } from "@/app/lib/language-content";
import { getLanguage } from "@/app/lib/language-content";
import { educationalSources, contentVerification } from "@/app/lib/content-sources";
import { additionalGrammarTopics } from "@/app/lib/grammar-additional-content";
import { getEnglishCurriculumGrammarTopics } from "@/app/lib/english-curriculum-content";
import { getFrenchCurriculumGrammarTopics } from "@/app/lib/french-curriculum-content";
import { normalizeLaterGrammarTopics } from "@/app/lib/grammar-quiz-options";

export type GrammarExerciseType =
  | "multiple-choice"
  | "fill-blank"
  | "choose-form"
  | "sentence-transformation"
  | "word-order"
  | "true-false"
  | "error-correction"
  | "translation";

export type GrammarExercise = {
  id: string;
  topicId: string;
  level: LevelSlug;
  type: GrammarExerciseType;
  prompt: string;
  instruction: string;
  options?: string[];
  acceptedAnswers: string[];
  explanation: string;
  distractorExplanations?: Record<string, string>;
  isFinalQuiz?: boolean;
};

export type GrammarTopic = {
  id: string;
  language: LanguageSlug;
  level: LevelSlug;
  title: string;
  objective: string;
  explanation: string;
  rule: string;
  pattern: { positive: string; negative: string; question: string };
  examples: { target: string; translation: string; note: string }[];
  context: string;
  commonMistake: { incorrect: string; correct: string; why: string };
  distinction: { structures: string; difference: string };
  exercises: GrammarExercise[];
  sourceIds: string[];
  verification: "original-sample-needs-teacher-review";
  curriculumExercises?: string[];
};

type GrammarQuestionSeed = {
  type: GrammarExerciseType;
  prompt: string;
  instruction: string;
  options?: string[];
  answer: string;
  acceptedAnswers?: string[];
  explanation: string;
  distractorExplanations?: Record<string, string>;
};

type GrammarSeed = Omit<GrammarTopic, "id" | "language" | "level" | "exercises" | "sourceIds" | "verification"> & {
  language: LanguageSlug;
  level: LevelSlug;
  questions: [GrammarQuestionSeed, GrammarQuestionSeed, GrammarQuestionSeed];
};

function seed(topic: GrammarSeed): GrammarTopic {
  const sourceIds: Record<LanguageSlug, string[]> = {
    english: ["cefr-companion-volume", "cambridge-english-cefr", "british-council-grammar", "cambridge-grammar"],
    french: ["cefr-companion-volume", "delf-fei", "tv5monde-edu"],
    spanish: ["cefr-companion-volume", "rae-grammar", "spanish-dele-cervantes"],
    italian: ["cefr-companion-volume", "cils-siena", "italian-certification-dante", "italian-celi-perugia"],
    german: ["cefr-companion-volume", "dw-learn-german", "goethe-exams", "telc-certificate-exams"],
  };
  return {
    id: `${topic.language}-${topic.level}-${topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    language: topic.language,
    level: topic.level,
    title: topic.title,
    objective: topic.objective,
    explanation: topic.explanation,
    rule: topic.rule,
    pattern: topic.pattern,
    examples: topic.examples,
    context: topic.context,
    commonMistake: topic.commonMistake,
    distinction: topic.distinction,
    exercises: topic.questions.map((question, index) => ({
      id: `${topic.language}-${topic.level}-${index + 1}`,
      topicId: `${topic.language}-${topic.level}-${topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
      level: topic.level,
      type: question.type,
      prompt: question.prompt,
      instruction: question.instruction,
      options: "options" in question ? question.options : undefined,
      acceptedAnswers: question.acceptedAnswers ?? [question.answer],
      explanation: question.explanation,
      distractorExplanations: "distractorExplanations" in question ? question.distractorExplanations : undefined,
      isFinalQuiz: index === 2,
    })),
    sourceIds: sourceIds[topic.language],
    verification: "original-sample-needs-teacher-review",
  };
}

const seeds: GrammarSeed[] = [
  {
    language: "english", level: "a1", title: "Present simple for everyday routines",
    objective: "Describe habits, regular events and familiar facts with a simple present-tense sentence.",
    explanation: "Use the present simple for things that happen regularly or are generally true. With he, she and it, most verbs take -s; use do/does to make negatives and questions.",
    rule: "Use the base verb with I/you/we/they and add -s or -es with he/she/it. In negatives and questions, the main verb returns to its base form after do or does.",
    pattern: { positive: "I/you/we/they + base verb · She/he/it + verb-s", negative: "I/you/we/they + do not + base verb · She/he/it + does not + base verb", question: "Do + I/you/we/they + base verb? · Does + she/he/it + base verb?" },
    examples: [{ target: "I take the 8:10 bus to work.", translation: "Tomo el autobús de las 8:10 para ir al trabajo.", note: "A regular weekday routine." }, { target: "Mina doesn't work on Sundays.", translation: "Mina no trabaja los domingos.", note: "Does carries the third-person marking, so work stays in its base form." }],
    context: "Use it for routines, timetables, preferences and facts: “The gallery opens at ten.”",
    commonMistake: { incorrect: "Does Mina works on Sundays?", correct: "Does Mina work on Sundays?", why: "The auxiliary does already marks the third-person singular; do not add -s to the main verb." },
    distinction: { structures: "Present simple vs present continuous", difference: "Present simple describes a routine (I take the bus). Present continuous describes an action happening around now (I’m taking the bus today)." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the sentence that describes Mina's routine.", prompt: "Mina ___ at a small bookshop.", options: ["work", "works", "is work"], answer: "works", explanation: "Mina is third-person singular, so the present-simple verb takes -s.", distractorExplanations: { work: "The base form is used with I, you, we and they, or after does.", "is work": "The present simple does not use is before the base verb." } },
      { type: "fill-blank", instruction: "Complete the question with the correct auxiliary.", prompt: "___ you walk to work every day?", answer: "Do", explanation: "Use do to make a present-simple question with you." },
      { type: "choose-form", instruction: "Choose the correct negative form.", prompt: "My train ___ at this station on Sundays.", options: ["don't stop", "doesn't stop", "isn't stop"], answer: "doesn't stop", explanation: "Train is third-person singular: use doesn't + the base verb stop.", distractorExplanations: { "don't stop": "Don't is used with I, you, we and they.", "isn't stop": "The present-simple negative uses doesn't, not isn't." } },
    ],
  },
  {
    language: "english", level: "a2", title: "Past simple: finished events",
    objective: "Describe a completed event and ask when it happened.",
    explanation: "Use the past simple for an action or situation completed at a definite past time. Regular verbs usually add -ed; many common verbs are irregular and must be learned individually.",
    rule: "Positive: past form. Negative: did not + base form. Question: did + subject + base form. The auxiliary did carries the past tense.",
    pattern: { positive: "Subject + past form + time", negative: "Subject + did not + base form", question: "Did + subject + base form?" },
    examples: [{ target: "We visited the night market on Friday.", translation: "Visitamos el mercado nocturno el viernes.", note: "A completed visit with a finished time expression." }, { target: "I didn't see the message yesterday.", translation: "No vi el mensaje ayer.", note: "After didn't, use the base form see, not saw." }],
    context: "Use it for finished trips, yesterday's events and a sequence in a story.",
    commonMistake: { incorrect: "Did you went by train?", correct: "Did you go by train?", why: "Did already marks the past; the following verb is the base form." },
    distinction: { structures: "Past simple vs present perfect", difference: "Use past simple with a finished time (last Friday). Present perfect connects an experience or result to now, without a finished-time expression." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the correct past form.", prompt: "Last summer, we ___ in Brighton.", options: ["stay", "stayed", "have stayed"], answer: "stayed", explanation: "Last summer is a finished past time, so use the past simple.", distractorExplanations: { stay: "This is the present base form.", "have stayed": "Present perfect is not normally used with a finished-time expression like last summer." } },
      { type: "fill-blank", instruction: "Complete the sentence with the base form after didn't.", prompt: "Nora didn't ___ the bus this morning. (catch)", answer: "catch", explanation: "After didn't, use the base form, even though the sentence refers to the past." },
      { type: "sentence-transformation", instruction: "Turn the statement into a question.", prompt: "They arrived before lunch. → ___ they arrive before lunch?", options: ["Did", "Were", "Have"], answer: "Did", explanation: "Past-simple questions use did + subject + base verb.", distractorExplanations: { Were: "Were is a form of be, not the auxiliary for arrived.", Have: "Have would form a present-perfect question and needs a past participle." } },
    ],
  },
  {
    language: "english", level: "b1", title: "Present perfect: experience and recent results",
    objective: "Talk about life experience or a recent result without naming a finished past time.",
    explanation: "The present perfect combines have/has with a past participle. It often connects an experience, change or recent result to the present moment.",
    rule: "Use have with I/you/we/they and has with he/she/it. Use a past participle; do not pair the present perfect with a finished-time adverb such as yesterday.",
    pattern: { positive: "Subject + have/has + past participle", negative: "Subject + have/has not + past participle", question: "Have/Has + subject + past participle?" },
    examples: [{ target: "I've tried sea kayaking, but I've never camped alone.", translation: "He probado el kayak de mar, pero nunca he acampado a solas.", note: "Life experiences up to the present; no date is specified." }, { target: "The parcel has just arrived.", translation: "El paquete acaba de llegar.", note: "A recent event with a present result." }],
    context: "Use ever/never for experience and just/already/yet for recent results or unfinished time periods.",
    commonMistake: { incorrect: "I have seen her yesterday.", correct: "I saw her yesterday.", why: "Yesterday is a completed past time; use the past simple." },
    distinction: { structures: "Present perfect vs past simple", difference: "Present perfect: experience or present relevance, no finished time. Past simple: the event belongs to a finished time." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the correct form.", prompt: "Have you ever ___ a night train?", options: ["take", "took", "taken"], answer: "taken", explanation: "Present-perfect questions use have + past participle; taken is the participle of take.", distractorExplanations: { take: "Use a past participle after have.", took: "Took is the past-simple form, not the participle." } },
      { type: "fill-blank", instruction: "Complete the sentence with the present-perfect auxiliary.", prompt: "Rosa ___ already finished the report.", answer: "has", explanation: "Rosa is third-person singular, so use has + finished." },
      { type: "error-correction", instruction: "Replace the incorrect verb phrase.", prompt: "We have met the guide last Tuesday. → We ___ the guide last Tuesday.", options: ["met", "have met", "have meet"], answer: "met", explanation: "Last Tuesday is a finished past time; use the past simple met.", distractorExplanations: { "have met": "Present perfect is not used with this finished-time expression.", "have meet": "The participle is met, not meet." } },
    ],
  },
  {
    language: "english", level: "b2", title: "Conditionals for real and imagined outcomes",
    objective: "Choose conditional patterns to discuss likely results and hypothetical situations.",
    explanation: "Conditionals connect a condition to its result. The verb forms show whether a situation is open and realistic or imagined. In a second conditional, the if-clause uses past form but refers to an unreal or unlikely present/future.",
    rule: "Real possibility: if + present, will + base verb. Hypothetical present/future: if + past, would + base verb. Avoid will in the if-clause in standard conditional patterns.",
    pattern: { positive: "If + present, will + base verb · If + past, would + base verb", negative: "If the train is late, we won't wait · If I had time, I wouldn't rush", question: "What would you do if + past clause?" },
    examples: [{ target: "If the weather clears, we'll walk along the coast.", translation: "Si el tiempo mejora, caminaremos por la costa.", note: "An open, realistic possibility." }, { target: "If I had another week, I'd explore the islands.", translation: "Si tuviera otra semana, exploraría las islas.", note: "A hypothetical situation; had does not refer to past time here." }],
    context: "Use a first conditional to plan around a real possibility, and a second conditional to imagine a different present or future.",
    commonMistake: { incorrect: "If it will rain, we'll stay in.", correct: "If it rains, we'll stay in.", why: "Use present simple in the if-clause for a likely future condition." },
    distinction: { structures: "First vs second conditional", difference: "The first presents a real possibility. The second distances the speaker from the condition, making it imagined or unlikely." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the verb form for a real possible condition.", prompt: "If the ferry ___, we'll take the later one.", options: ["is full", "will be full", "would be full"], answer: "is full", explanation: "Use present simple in the if-clause of a first conditional.", distractorExplanations: { "will be full": "Will normally belongs in the result clause, not this if-clause.", "would be full": "Would suggests a hypothetical second conditional." } },
      { type: "fill-blank", instruction: "Complete the imagined result with would + base verb.", prompt: "If I lived by the sea, I ___ (swim) every morning.", answer: "would swim", explanation: "The second conditional uses would + base verb in the result clause." },
      { type: "translation", instruction: "Translate the sentence using a second conditional.", prompt: "Si tuviera más tiempo, aprendería italiano.", options: ["If I had more time, I'd learn Italian.", "If I will have more time, I learn Italian.", "If I had more time, I learned Italian."], answer: "If I had more time, I'd learn Italian.", explanation: "If + past form expresses the hypothetical condition; would + base verb expresses its imagined result.", distractorExplanations: { "If I will have more time, I learn Italian.": "This mixes future will with a conditional if-clause.", "If I had more time, I learned Italian.": "Learned does not express the hypothetical result here." } },
    ],
  },
  {
    language: "english", level: "c1", title: "Reported speech and shifts in viewpoint",
    objective: "Report statements and questions while keeping time reference and the original speaker's meaning clear.",
    explanation: "When a reporting verb is in the past, a reported clause often shifts one step back in time. The shift is not mechanical: keep the original tense when the information is still true or the context makes the time reference clear.",
    rule: "Statement: said (that) + clause. Yes/no question: asked if/whether + statement word order. Wh-question: asked + question word + statement word order.",
    pattern: { positive: "“I work here.” → She said (that) she worked there.", negative: "“I don't know.” → He said he didn't know.", question: "“Where do you live?” → She asked where I lived." },
    examples: [{ target: "“I can send the notes tonight,” Jo said. → Jo said she could send the notes that night.", translation: "«Puedo enviar los apuntes esta noche», dijo Jo. → Jo dijo que podía enviar los apuntes esa noche.", note: "Pronoun, modal and time phrase change to fit the reporting viewpoint." }, { target: "“Have you booked a table?” he asked. → He asked whether I had booked a table.", translation: "«¿Has reservado una mesa?», preguntó. → Preguntó si yo había reservado una mesa.", note: "The reported yes/no question uses whether and statement word order." }],
    context: "Use reporting verbs to summarize interviews, conversations, requests and explanations.",
    commonMistake: { incorrect: "She asked me where did I work.", correct: "She asked me where I worked.", why: "An embedded reported question uses statement word order, not do-support inversion." },
    distinction: { structures: "say vs tell", difference: "Say usually takes the message (say that…). Tell usually takes a person (tell me that…). Reported questions use ask." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the reported form with correct word order.", prompt: "“Why are you leaving?” → He asked me ___.", options: ["why was I leaving", "why I was leaving", "why did I leave"], answer: "why I was leaving", explanation: "An embedded question uses subject + verb word order.", distractorExplanations: { "why was I leaving": "This keeps direct-question inversion.", "why did I leave": "This uses do-support and changes the tense and aspect." } },
      { type: "sentence-transformation", instruction: "Report the statement using said.", prompt: "“I will call you tomorrow,” she said. → She said she ___ me the next day.", options: ["would call", "will call", "called"], answer: "would call", explanation: "With a past reporting verb, will commonly shifts to would and tomorrow changes to the next day.", distractorExplanations: { "will call": "This may be possible if reporting immediately, but the exercise specifies a past-reported, shifted viewpoint.", called: "Called changes the intended future-in-the-past meaning." } },
      { type: "true-false", instruction: "Decide whether the reported question is well formed.", prompt: "“Do you know the address?” → She asked if I knew the address.", options: ["True", "False"], answer: "True", explanation: "The reported yes/no question uses if and statement word order: I knew.", distractorExplanations: { False: "The clause is correctly formed with if + subject + verb." } },
    ],
  },
  {
    language: "english", level: "c2", title: "Inversion for emphasis",
    objective: "Recognise and use formal negative inversion to place emphasis without changing the core meaning.",
    explanation: "A fronted negative or restrictive adverbial can trigger subject–auxiliary inversion in formal writing and prepared speech. The finite auxiliary moves before the subject; if there is no auxiliary, do-support is required.",
    rule: "Negative adverbial + auxiliary + subject + main verb. With no auxiliary in the original clause, add do/does/did and use the base verb.",
    pattern: { positive: "I had never seen such a quiet station. → Never had I seen such a quiet station.", negative: "At no point did we ignore the warning.", question: "Only after the meeting did she explain the change." },
    examples: [{ target: "Rarely have I heard such a thoughtful discussion.", translation: "Pocas veces he oído una conversación tan reflexiva.", note: "Rarely is fronted; have precedes the subject I." }, { target: "Not until the lights came on did we notice the painting.", translation: "No nos fijamos en el cuadro hasta que se encendieron las luces.", note: "The main clause inverts; the until-clause keeps normal word order." }],
    context: "Use negative inversion sparingly in formal narratives, editorials and prepared presentations for emphasis.",
    commonMistake: { incorrect: "Never I had seen such a view.", correct: "Never had I seen such a view.", why: "The fronted negative adverbial triggers auxiliary–subject inversion." },
    distinction: { structures: "Inversion vs an ordinary negative", difference: "Never I had… is not standard. I had never… is neutral; Never had I… is emphatic and formal." },
    questions: [
      { type: "word-order", instruction: "Choose the correctly inverted sentence.", prompt: "Not until the doors opened ___.", options: ["the audience entered", "did the audience enter", "the audience did entered"], answer: "did the audience enter", explanation: "After fronted not until, use did + subject + base verb.", distractorExplanations: { "the audience entered": "The subject and verb do not invert after the fronted negative phrase.", "the audience did entered": "After did, use the base form enter." } },
      { type: "fill-blank", instruction: "Complete the inversion with the correct auxiliary.", prompt: "Rarely ___ we see such a careful restoration.", answer: "do", explanation: "The present-simple verb see needs do-support when rarely is fronted." },
      { type: "error-correction", instruction: "Correct the word order.", prompt: "At no time we were asked to leave. → At no time ___ asked to leave.", options: ["were we", "we were", "did we were"], answer: "were we", explanation: "The existing auxiliary were moves before the subject.", distractorExplanations: { "we were": "This keeps ordinary subject–verb order.", "did we were": "Do-support cannot be combined with the finite verb were." } },
    ],
  },

  {
    language: "french", level: "a1", title: "Articles and gender: un café, une rue",
    objective: "Choose a basic article and match it to the gender and number of familiar French nouns.",
    explanation: "French nouns have grammatical gender. Use un for a masculine singular noun and une for a feminine singular noun when introducing one item. The article and noun usually take an -s in the plural, though the ending is often silent.",
    rule: "Indefinite singular: un + masculine noun, une + feminine noun. Plural: des + plural noun. Learn each new noun together with its article.",
    pattern: { positive: "un café · une rue · des cafés", negative: "Je n'ai pas un café → Je n'ai pas de café.", question: "C'est un café ? · C'est une rue ?" },
    examples: [{ target: "Je cherche une pharmacie près de la gare.", translation: "Busco una farmacia cerca de la estación.", note: "Pharmacie is feminine: une pharmacie." }, { target: "Nous prenons un café et des croissants.", translation: "Tomamos un café y unos cruasanes.", note: "Café is masculine; croissants is plural." }],
    context: "Use articles with everyday objects and places; learn le/la and un/une along with the noun.",
    commonMistake: { incorrect: "un rue", correct: "une rue", why: "Rue is feminine; its grammatical gender is not determined reliably by its meaning." },
    distinction: { structures: "un/une vs le/la", difference: "Un/une introduces an unspecified item. Le/la often refers to a known item or makes a general statement." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the correct article.", prompt: "___ adresse utile", options: ["un", "une", "des"], answer: "une", explanation: "Adresse is feminine singular, so use une.", distractorExplanations: { un: "Un is masculine singular.", des: "Des is plural." } },
      { type: "fill-blank", instruction: "Add the plural indefinite article.", prompt: "___ billets de train", answer: "des", explanation: "Des is the plural indefinite article before a plural count noun." },
      { type: "choose-form", instruction: "Choose the correct phrase.", prompt: "On cherche ___ hôtel près du centre.", options: ["un hôtel", "une hôtel", "des hôtel"], answer: "un hôtel", explanation: "Hôtel is masculine singular, so use un.", distractorExplanations: { "une hôtel": "Une is feminine singular.", "des hôtel": "Des requires the plural form hôtels." } },
    ],
  },
  {
    language: "french", level: "a2", title: "Passé composé for completed events",
    objective: "Describe a completed recent event with the passé composé and the appropriate auxiliary.",
    explanation: "The passé composé is formed with a present-tense auxiliary (usually avoir, sometimes être) and a past participle. Many movement verbs and all reflexive verbs use être. With être, the participle agrees with the subject in gender and number.",
    rule: "Most verbs: subject + avoir + past participle. Être verbs: subject + être + past participle, with agreement. In a negative, ne…pas surrounds the auxiliary.",
    pattern: { positive: "J'ai visité Lyon · Elle est arrivée tôt.", negative: "Je n'ai pas réservé · Elle n'est pas partie.", question: "Est-ce que vous avez choisi ? · Tu es arrivé(e) quand ?" },
    examples: [{ target: "Nous avons acheté des billets pour le musée.", translation: "Compramos entradas para el museo.", note: "Acheter takes avoir; the past participle acheté is unchanged here." }, { target: "Camille est arrivée avant midi.", translation: "Camille llegó antes del mediodía.", note: "Arriver takes être; Camille is feminine, so arrivée takes -e." }],
    context: "Use the passé composé for a completed event in a sequence: On est sortis, puis on a pris le tram.",
    commonMistake: { incorrect: "Elle a arrivée à midi.", correct: "Elle est arrivée à midi.", why: "Arriver uses être in the passé composé." },
    distinction: { structures: "Passé composé vs imparfait", difference: "The passé composé presents a bounded event; the imparfait provides background, habit or an ongoing past situation." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the correct auxiliary and agreement.", prompt: "Léa ___ à Marseille hier soir.", options: ["a arrivé", "est arrivée", "est arrivés"], answer: "est arrivée", explanation: "Arriver uses être; Léa is feminine singular, so the participle agrees with -e.", distractorExplanations: { "a arrivé": "Arriver uses être in this meaning.", "est arrivés": "The subject is singular feminine, not plural." } },
      { type: "fill-blank", instruction: "Complete the negative with the correct auxiliary.", prompt: "Nous n'___ pas réservé de table.", answer: "avons", explanation: "Réserver takes avoir; ne…pas surrounds the auxiliary avons." },
      { type: "translation", instruction: "Choose the accurate translation.", prompt: "“They (all women) left early.”", options: ["Elles sont parties tôt.", "Elles ont parti tôt.", "Elles sont parti tôt."], answer: "Elles sont parties tôt.", explanation: "Partir takes être, and the feminine plural subject requires -ies.", distractorExplanations: { "Elles ont parti tôt.": "Partir takes être.", "Elles sont parti tôt.": "The participle agrees with the feminine plural subject: parties." } },
    ],
  },
  {
    language: "french", level: "b1", title: "Imparfait and passé composé in a story",
    objective: "Combine background description with completed events in a past narrative.",
    explanation: "The imparfait presents a past habit, description or situation in progress. The passé composé presents a completed event that advances the story. Context determines which viewpoint is intended.",
    rule: "Imparfait: nous-form present stem without -ons + ais, ais, ait, ions, iez, aient (être has ét-). Passé composé: present avoir/être + past participle.",
    pattern: { positive: "Il pleuvait quand le train est arrivé.", negative: "Je ne travaillais pas quand elle a appelé.", question: "Qu'est-ce que tu faisais quand le téléphone a sonné ?" },
    examples: [{ target: "Il faisait encore jour quand nous sommes arrivés au port.", translation: "Todavía era de día cuando llegamos al puerto.", note: "The weather/light is background; arriving is a completed event." }, { target: "Je préparais le dîner quand Léa a téléphoné.", translation: "Estaba preparando la cena cuando Léa llamó.", note: "The ongoing activity is interrupted by a completed call." }],
    context: "Use imparfait for the scene and past habits; use passé composé for the events that happened in that scene.",
    commonMistake: { incorrect: "Quand j'ai étais petit, je jouais dehors.", correct: "Quand j'étais petit, je jouais dehors.", why: "Childhood background and repeated habits take the imparfait." },
    distinction: { structures: "Imparfait vs passé composé", difference: "Ask whether you are setting the scene or reporting a bounded event; the same verb may take either tense depending on the intended viewpoint." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the background tense.", prompt: "Pendant que nous ___, le serveur a apporté le dessert.", options: ["discutions", "avons discuté", "discuterons"], answer: "discutions", explanation: "The discussion was in progress when another completed event occurred.", distractorExplanations: { "avons discuté": "This presents the discussion as bounded rather than ongoing background.", discuterons: "This is a future form." } },
      { type: "fill-blank", instruction: "Complete the ongoing background with the imparfait.", prompt: "Il ___ (faire) froid quand le bateau est parti.", answer: "faisait", explanation: "Faire is irregular in the imparfait: il faisait." },
      { type: "choose-form", instruction: "Choose the event that advances the story.", prompt: "Je ___ quand la lumière s'est éteinte.", options: ["lisais", "ai lu", "lirais"], answer: "lisais", explanation: "Reading is the activity in progress; the light going out is the completed event.", distractorExplanations: { "ai lu": "This presents reading as a completed event rather than background.", lirais: "This is a conditional form." } },
    ],
  },
  {
    language: "french", level: "b2", title: "Subjunctive after necessity and concession",
    objective: "Use the subjunctive after common expressions of necessity, emotion, doubt and concession.",
    explanation: "The subjunctive is a mood used in subordinate clauses after certain expressions, including necessity and emotion. It is not simply a marker of uncertainty; the trigger phrase and clause structure matter.",
    rule: "Expression + que + subject + subjunctive. For regular -er verbs, many present subjunctive forms use the ils/elles stem plus -e, -es, -e, -ions, -iez, -ent.",
    pattern: { positive: "Il faut que nous partions tôt.", negative: "Je ne pense pas qu'il soit disponible.", question: "Bien que la route soit longue, on continue." },
    examples: [{ target: "Il faut que vous preniez le premier train.", translation: "Es necesario que tomen el primer tren.", note: "Il faut que requires the subjunctive; prendre → preniez." }, { target: "Bien qu'elle ait peu de temps, elle nous aide.", translation: "Aunque tiene poco tiempo, nos ayuda.", note: "Bien que is followed by the subjunctive; avoir → ait." }],
    context: "Common triggers include il faut que, pour que, bien que and je suis content(e) que.",
    commonMistake: { incorrect: "Il faut que vous prenez le train.", correct: "Il faut que vous preniez le train.", why: "Il faut que selects the subjunctive form preniez, not the indicative prenez." },
    distinction: { structures: "Indicative vs subjunctive after penser", difference: "Je pense qu'il vient normally presents an affirmative belief with the indicative; je ne pense pas qu'il vienne commonly uses the subjunctive." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the subjunctive form after il faut que.", prompt: "Il faut que tu ___ le formulaire aujourd'hui.", options: ["remplis", "remplisses", "rempliras"], answer: "remplisses", explanation: "Il faut que introduces a subjunctive clause; remplir → que tu remplisses.", distractorExplanations: { remplis: "This is the indicative present.", rempliras: "This is the future." } },
      { type: "fill-blank", instruction: "Complete with the subjunctive of être.", prompt: "Bien qu'il ___ tard, le musée reste ouvert.", answer: "soit", explanation: "Bien que selects the subjunctive; être → soit." },
      { type: "true-false", instruction: "Decide whether the sentence uses the required mood.", prompt: "Je suis ravie que vous soyez ici.", options: ["True", "False"], answer: "True", explanation: "An emotion expression followed by que takes the subjunctive here: soyez.", distractorExplanations: { False: "The sentence correctly uses the subjunctive soyez after an emotion expression." } },
    ],
  },
  {
    language: "french", level: "c1", title: "Relative pronouns: dont, lequel and ce qui",
    objective: "Choose a relative pronoun that correctly links a clause to its antecedent or preposition.",
    explanation: "Relative pronouns connect information to a noun or to an idea. Dont replaces a complement introduced by de; lequel agrees with its antecedent and often follows a preposition; ce qui/ce que refer to an unspecified idea.",
    rule: "dont = de + antecedent; avec lequel / à laquelle = preposition + lequel agreeing with the noun; ce qui is the subject of its clause and ce que is its object.",
    pattern: { positive: "Le sujet dont elle parle est complexe.", negative: "Je ne sais pas ce qui a changé.", question: "Laquelle des options, parmi lesquelles figure la nôtre, choisir ?" },
    examples: [{ target: "C'est une question à laquelle il faut répondre avec soin.", translation: "Es una pregunta a la que hay que responder con cuidado.", note: "Laquelle agrees with question and follows à." }, { target: "Il a résumé ce qu'il avait observé.", translation: "Resumió lo que había observado.", note: "Ce que is the object of avait observé." }],
    context: "Use a relative pronoun to avoid repeating a noun and to connect supporting details in formal speech and writing.",
    commonMistake: { incorrect: "Le rapport que je vous fais référence.", correct: "Le rapport auquel je fais référence.", why: "Faire référence à selects à; use auquel, not que." },
    distinction: { structures: "ce qui vs ce que", difference: "Ce qui is the subject of the following verb; ce que is its object: ce qui surprend, ce que je comprends." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the pronoun required by parler de.", prompt: "Le projet ___ elle parle sera présenté demain.", options: ["dont", "auquel", "ce qui"], answer: "dont", explanation: "Parler de quelque chose → dont.", distractorExplanations: { auquel: "This represents à + lequel, not de.", "ce qui": "This refers to an unspecified idea and does not replace the noun projet here." } },
      { type: "choose-form", instruction: "Choose the relative pronoun that is the subject.", prompt: "Je ne comprends pas ___ a provoqué ce changement.", options: ["ce qui", "ce que", "dont"], answer: "ce qui", explanation: "The missing relative phrase is the subject of a provoqué.", distractorExplanations: { "ce que": "Ce que would be the object of the following verb.", dont: "No de-complement is required." } },
      { type: "translation", instruction: "Choose the accurate relative clause.", prompt: "“The method to which she refers is widely used.”", options: ["La méthode à laquelle elle fait référence est très répandue.", "La méthode dont elle fait référence est très répandue.", "La méthode que elle fait référence est très répandue."], answer: "La méthode à laquelle elle fait référence est très répandue.", explanation: "Faire référence à requires à laquelle, agreeing with the feminine noun méthode.", distractorExplanations: { "La méthode dont elle fait référence est très répandue.": "Dont represents de, but this expression requires à.", "La méthode que elle fait référence est très répandue.": "Que is not selected by faire référence à, and the elision would also be incorrect." } },
    ],
  },
  {
    language: "french", level: "c2", title: "Complex sentence structure and emphasis",
    objective: "Organise a complex argument using emphasis, concession and clear clause relationships.",
    explanation: "Advanced French prose often moves a phrase to the front for emphasis, balances concession with a main claim and uses a clear system of pronoun reference. These choices affect focus and register without changing the underlying facts.",
    rule: "C'est… qui/que highlights a participant or object. Bien que / quoique introduces concession + subjunctive. Keep pronoun references unambiguous across long clauses.",
    pattern: { positive: "C'est cette approche qui a permis d'avancer.", negative: "Ce n'est pas le coût, mais l'accès qui pose problème.", question: "Dans quelle mesure cette réforme, si elle aboutit, changera-t-elle la situation ?" },
    examples: [{ target: "C'est la cohérence du projet qui a convaincu le comité.", translation: "Fue la coherencia del proyecto lo que convenció al comité.", note: "C'est… qui gives focus to the subject." }, { target: "Quoiqu'elle paraisse simple, la solution exige un suivi régulier.", translation: "Aunque parezca sencilla, la solución requiere seguimiento periódico.", note: "Quoique introduces concession and takes the subjunctive." }],
    context: "Use these structures to guide the reader through contrast, emphasis and evidence in a formal argument.",
    commonMistake: { incorrect: "C'est cette solution que fonctionne.", correct: "C'est cette solution qui fonctionne.", why: "The focused phrase is the subject of fonctionne, so use qui." },
    distinction: { structures: "qui vs que in cleft sentences", difference: "Use qui when the focused item is the subject of the following verb; use que when it is the object." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the subject relative pronoun.", prompt: "C'est cette mesure ___ réduira les délais.", options: ["qui", "que", "dont"], answer: "qui", explanation: "Cette mesure is the subject of réduira, so use qui.", distractorExplanations: { que: "Que introduces an object relative clause.", dont: "Dont replaces a de-complement." } },
      { type: "fill-blank", instruction: "Complete with the subjunctive after quoique.", prompt: "Quoiqu'il ___ (être) tard, la réunion continue.", answer: "soit", explanation: "Quoique introduces a concessive clause with the subjunctive: soit." },
      { type: "error-correction", instruction: "Correct the agreement of the focused clause.", prompt: "C'est les résultats qui est important. → Ce sont les résultats qui ___ importants.", options: ["sont", "est", "soit"], answer: "sont", explanation: "The focused plural noun is resumed by a plural verb: ce sont les résultats qui sont importants.", distractorExplanations: { est: "The plural subject résultats requires sont.", soit: "The sentence makes a fact, not a subjunctive clause." } },
    ],
  },

  {
    language: "spanish", level: "a1", title: "Articles, gender and plural nouns",
    objective: "Choose a basic article and match it to the gender and number of familiar nouns.",
    explanation: "Spanish nouns have grammatical gender. The definite articles el/la change to los/las in the plural; un/una introduces a singular item. Many nouns ending in -o are masculine and -a feminine, but there are important exceptions, so learn the article with the word.",
    rule: "Masculine: el/un; feminine: la/una; plural: los/las and unos/unas. Adjectives usually agree in gender and number.",
    pattern: { positive: "el libro nuevo · una calle tranquila", negative: "No tengo un billete → No tengo ningún billete.", question: "¿Es una estación grande?" },
    examples: [{ target: "Busco una farmacia cerca de la estación.", translation: "I’m looking for a pharmacy near the station.", note: "Farmacia and estación are feminine." }, { target: "Los billetes están en la mochila.", translation: "The tickets are in the backpack.", note: "Billete is masculine; its article and adjective would agree." }],
    context: "Use articles with everyday objects, places and people; notice agreement in phrases rather than learning isolated nouns.",
    commonMistake: { incorrect: "el mano", correct: "la mano", why: "Mano is feminine despite ending in -o; grammatical gender has lexical exceptions." },
    distinction: { structures: "un/una vs el/la", difference: "Un/una usually introduces an unspecified item; el/la refers to a known item or to a general category." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the correct article.", prompt: "___ mano derecha", options: ["el", "la", "los"], answer: "la", explanation: "Mano is a feminine noun, including in the singular.", distractorExplanations: { el: "Mano is a notable feminine noun ending in -o.", los: "Los is masculine plural." } },
      { type: "fill-blank", instruction: "Complete the phrase with the feminine plural article.", prompt: "___ calles estrechas", answer: "las", explanation: "Calles is feminine plural, so use las." },
      { type: "choose-form", instruction: "Choose the phrase with agreement.", prompt: "un ___ edificio", options: ["antigua", "antiguo", "antiguos"], answer: "antiguo", explanation: "Edificio is masculine singular, so the adjective is antiguo.", distractorExplanations: { antigua: "This is feminine singular.", antiguos: "This is masculine plural." } },
    ],
  },
  {
    language: "spanish", level: "a2", title: "Ser and estar: identity, state and place",
    objective: "Choose ser or estar to describe identity, characteristics, location and temporary states.",
    explanation: "Ser commonly identifies, classifies or describes characteristic information. Estar commonly locates people and things or describes states. Avoid the oversimplified rule that ser means permanent and estar means temporary; meaning and construction matter.",
    rule: "Ser: identity, origin, profession, time and many characteristics. Estar: location and many states or results. Some adjectives change meaning with the verb.",
    pattern: { positive: "Soy de Lima · El mercado está en el centro.", negative: "No es caro · Hoy no estamos cansados.", question: "¿De dónde eres? · ¿Dónde está la parada?" },
    examples: [{ target: "Mi hermana es médica y es de Quito.", translation: "My sister is a doctor and she is from Quito.", note: "Profession and origin use ser." }, { target: "La farmacia está abierta, pero está lejos.", translation: "The pharmacy is open, but it is far away.", note: "State and location use estar." }],
    context: "Use ser for identity and classification; use estar for location and states, checking for adjective-specific meanings.",
    commonMistake: { incorrect: "La reunión es en la sala 4.", correct: "La reunión es en la sala 4.", why: "Events use ser for their location; people and objects are located with estar." },
    distinction: { structures: "ser listo vs estar listo", difference: "Ser listo means to be clever; estar listo means to be ready. The verb can change the adjective's meaning." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the verb for origin.", prompt: "¿De dónde ___ tus compañeros?", options: ["están", "son", "es"], answer: "son", explanation: "Origin is expressed with ser; tus compañeros is plural.", distractorExplanations: { están: "Estar is not used for a person's origin.", es: "Es is singular, but compañeros is plural." } },
      { type: "fill-blank", instruction: "Complete with the correct form of estar.", prompt: "La estación ___ cerca del río.", answer: "está", explanation: "The physical location of a place is expressed with estar." },
      { type: "true-false", instruction: "Decide whether the verb is appropriate.", prompt: "La conferencia es en el auditorio. (The event takes place in the auditorium.)", options: ["True", "False"], answer: "True", explanation: "Ser is used to give the location of an event.", distractorExplanations: { False: "The event-location construction uses ser." } },
    ],
  },
  {
    language: "spanish", level: "b1", title: "Pretérito and imperfecto in a story",
    objective: "Use the pretérito to report completed past events and the imperfecto for background and habits.",
    explanation: "The pretérito presents a past event as bounded or completed. The imperfecto presents a past situation, habit or action as background. A narrative often uses both to show what was in progress when something happened.",
    rule: "Regular -ar imperfect: -aba; -er/-ir imperfect: -ía. Regular pretérito endings are -é/-aste/-ó and -í/-iste/-ió. Common irregulars must be learned separately.",
    pattern: { positive: "Hacía calor cuando empezó la música.", negative: "No conocía el barrio, así que no encontré la plaza.", question: "¿Qué hacías cuando se fue la luz?" },
    examples: [{ target: "Mientras esperábamos el autobús, empezó a llover.", translation: "While we were waiting for the bus, it started to rain.", note: "Esperábamos is background; empezó is the bounded event." }, { target: "De pequeño, mi abuelo vivía cerca del mar.", translation: "As a child, my grandfather lived near the sea.", note: "A repeated or ongoing past situation uses the imperfecto." }],
    context: "Use the imperfecto to set the scene and the pretérito to move a story forward.",
    commonMistake: { incorrect: "Cuando era niño, fui al parque todos los sábados.", correct: "Cuando era niño, iba al parque todos los sábados.", why: "A repeated past habit is usually expressed with the imperfecto." },
    distinction: { structures: "Pretérito vs imperfecto", difference: "The difference is viewpoint, not simply duration: the pretérito bounds an event; the imperfecto presents background or repetition." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the ongoing background form.", prompt: "Nosotros ___ cuando llegó el mensaje.", options: ["cenamos", "cenábamos", "cenaremos"], answer: "cenábamos", explanation: "Dinner was in progress when the message arrived.", distractorExplanations: { cenamos: "This presents dinner as a bounded event rather than the ongoing background.", cenaremos: "This is future tense." } },
      { type: "fill-blank", instruction: "Complete with the imperfecto of ser.", prompt: "El cielo ___ gris cuando salimos.", answer: "era", explanation: "Ser is irregular in the imperfecto: era." },
      { type: "choose-form", instruction: "Choose the completed event.", prompt: "La puerta ___ de repente.", options: ["se cerraba", "se cerró", "se cerraría"], answer: "se cerró", explanation: "The sudden, bounded event is expressed with the pretérito.", distractorExplanations: { "se cerraba": "This gives an ongoing/background viewpoint.", "se cerraría": "This is the conditional." } },
    ],
  },
  {
    language: "spanish", level: "b2", title: "Present subjunctive after influence and evaluation",
    objective: "Use the present subjunctive in a subordinate clause after common expressions of influence, necessity and evaluation.",
    explanation: "A subordinate clause often takes the subjunctive after an expression that conveys influence, necessity, emotion or evaluation. The subject may change or stay the same; when it stays the same, an infinitive is often preferred.",
    rule: "Expression + que + new subject + present subjunctive. For many regular verbs, the subjunctive endings switch: -ar uses -e; -er/-ir use -a.",
    pattern: { positive: "La guía recomienda que reservemos con tiempo.", negative: "No creo que el museo abra los lunes.", question: "¿Te parece importante que lleguen temprano?" },
    examples: [{ target: "Es mejor que consultes el horario antes de salir.", translation: "It is better that you check the timetable before leaving.", note: "Evaluation + que introduces the subjunctive consultes." }, { target: "El ayuntamiento propone que los vecinos participen.", translation: "The town council proposes that residents take part.", note: "An expression of proposal selects the subjunctive." }],
    context: "Common triggers include recomendar que, es importante que and me alegra que when the clauses have different subjects.",
    commonMistake: { incorrect: "Te recomiendo que reservas con tiempo.", correct: "Te recomiendo que reserves con tiempo.", why: "Recomendar que introduces a subordinate clause with the subjunctive." },
    distinction: { structures: "Subjunctive vs infinitive", difference: "With the same subject, use an infinitive: recomiendo reservar. With a different subject, use que + subjunctive: recomiendo que reserves." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the subjunctive form.", prompt: "Es importante que ustedes ___ los documentos.", options: ["traen", "traigan", "traer"], answer: "traigan", explanation: "Es importante que introduces a subjunctive clause; traer → traigan.", distractorExplanations: { traen: "This is indicative.", traer: "The clauses have different subjects, so the subjunctive is needed here." } },
      { type: "fill-blank", instruction: "Complete with the present subjunctive of tener.", prompt: "La profesora pide que Ana ___ paciencia.", answer: "tenga", explanation: "Pedir que selects the subjunctive; tener → tenga." },
      { type: "translation", instruction: "Choose the natural translation.", prompt: "“I recommend that you (informal) arrive early.”", options: ["Te recomiendo que llegues temprano.", "Te recomiendo que llegas temprano.", "Te recomiendo llegaras temprano."], answer: "Te recomiendo que llegues temprano.", explanation: "Recomendar que with a different subject takes the present subjunctive llegues.", distractorExplanations: { "Te recomiendo que llegas temprano.": "This uses the indicative instead of the required subjunctive.", "Te recomiendo llegaras temprano.": "This incorrectly uses the imperfect subjunctive without que." } },
    ],
  },
  {
    language: "spanish", level: "c1", title: "Object pronouns and their position",
    objective: "Place direct and indirect object pronouns accurately, including common pronoun combinations.",
    explanation: "Direct object pronouns replace what is directly affected; indirect object pronouns identify the recipient or beneficiary. Pronouns usually precede a conjugated verb, but attach to an infinitive or affirmative command. Le/les becomes se before lo/la/los/las.",
    rule: "Indirect + direct + verb: se lo expliqué. Before a conjugated verb: se lo explico. Attached to an infinitive: voy a explicárselo.",
    pattern: { positive: "Le envié el mapa → Se lo envié.", negative: "No se lo he dicho todavía.", question: "¿Se lo puedes enseñar?" },
    examples: [{ target: "A Lucía le presté la guía; se la devuelvo mañana.", translation: "I lent Lucía the guide; I’ll return it to her tomorrow.", note: "Le becomes se before la." }, { target: "Voy a mandárselo después de la reunión.", translation: "I’m going to send it to them after the meeting.", note: "The combined pronouns attach to the infinitive." }],
    context: "Use combined pronouns to avoid repeating people and things in connected speech and writing.",
    commonMistake: { incorrect: "Le lo expliqué ayer.", correct: "Se lo expliqué ayer.", why: "Le changes to se before a direct object pronoun lo/la/los/las." },
    distinction: { structures: "Lo/la vs le", difference: "Lo/la generally replace direct objects; le/les commonly replace indirect objects. Regional leísmo exists, so register and region matter." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the correct pronoun combination.", prompt: "El profesor explicó la regla a sus alumnos. El profesor ___ explicó.", options: ["les la", "se la", "la les"], answer: "se la", explanation: "Les changes to se before the direct object pronoun la.", distractorExplanations: { "les la": "Le/les cannot directly precede lo/la; it changes to se.", "la les": "The order is indirect object + direct object before the verb." } },
      { type: "fill-blank", instruction: "Attach the pronouns to the infinitive.", prompt: "Quiero explicar ___ el plan a Marta. (I want to explain it to her.)", answer: "explicárselo", explanation: "Attach se + lo to the infinitive explicar; the written accent preserves the stress." },
      { type: "error-correction", instruction: "Correct the pronoun sequence.", prompt: "Le envié la invitación → ___ envié.", options: ["Se la", "La se", "Le la"], answer: "Se la", explanation: "The indirect pronoun le becomes se before direct object la.", distractorExplanations: { "La se": "Pronoun order is indirect before direct.", "Le la": "Le changes to se before la." } },
    ],
  },
  {
    language: "spanish", level: "c2", title: "Concession and conditional nuance",
    objective: "Express a hypothetical, counterfactual or concessive relationship with accurate tense and mood.",
    explanation: "Advanced conditional clauses pair tense and mood to show how remote or unreal a situation is. Concessive clauses with aunque can take the indicative for a known fact or the subjunctive for a hypothetical or unasserted possibility.",
    rule: "Counterfactual past: si + pluperfect subjunctive, conditional perfect. Aunque + indicative for an asserted fact; aunque + subjunctive for a hypothetical possibility.",
    pattern: { positive: "Si hubiéramos salido antes, habríamos llegado a tiempo.", negative: "Aunque no parezca evidente, el cambio no carece de efectos.", question: "¿Qué habría ocurrido si se hubiera aprobado la propuesta?" },
    examples: [{ target: "Aunque el informe reconoce avances, señala varias limitaciones.", translation: "Although the report acknowledges progress, it points out several limitations.", note: "Indicative presents the report's statement as asserted." }, { target: "Aunque el informe reconozca avances, conviene revisar los datos.", translation: "Even if the report acknowledges progress, it is advisable to review the data.", note: "Subjunctive leaves the acknowledgement open or hypothetical." }],
    context: "Use these distinctions to qualify claims, evaluate evidence and discuss alternative outcomes.",
    commonMistake: { incorrect: "Si habría tenido tiempo, habría revisado el informe.", correct: "Si hubiera tenido tiempo, habría revisado el informe.", why: "In a standard counterfactual past condition, the si-clause uses the pluperfect subjunctive, not the conditional." },
    distinction: { structures: "Aunque + indicative vs subjunctive", difference: "The indicative presents a point as a fact; the subjunctive presents it as possible, hypothetical or not asserted." },
    questions: [
      { type: "multiple-choice", instruction: "Complete a counterfactual past condition.", prompt: "Si ___ antes, no habríamos perdido el tren.", options: ["saldríamos", "hubiéramos salido", "habríamos salido"], answer: "hubiéramos salido", explanation: "The si-clause takes the pluperfect subjunctive; the result uses the conditional perfect.", distractorExplanations: { saldríamos: "Conditional forms do not normally appear in this si-clause.", "habríamos salido": "This conditional perfect belongs in the result clause." } },
      { type: "choose-form", instruction: "Choose the indicative for an asserted fact.", prompt: "Aunque el trayecto ___ largo, el grupo llegó antes del anochecer.", options: ["era", "fuera", "sea"], answer: "era", explanation: "This presents the length as an asserted background fact in the past.", distractorExplanations: { fuera: "The subjunctive would frame it as hypothetical or non-asserted.", sea: "This is present subjunctive and does not fit the past narrative." } },
      { type: "true-false", instruction: "Decide whether the conditional pairing is standard.", prompt: "Si lo hubieran sabido, habrían elegido otra ruta.", options: ["True", "False"], answer: "True", explanation: "Pluperfect subjunctive in the si-clause pairs naturally with conditional perfect in the result.", distractorExplanations: { False: "This is a standard counterfactual-past pattern." } },
    ],
  },

  {
    language: "italian", level: "a1", title: "Articles and noun agreement",
    objective: "Choose a basic Italian article and make familiar noun phrases agree in gender and number.",
    explanation: "Italian nouns are masculine or feminine, and singular or plural. The article reflects those features. A masculine noun beginning with s + consonant or z commonly takes lo, not il.",
    rule: "Common forms: il libro / i libri; la piazza / le piazze; lo zaino / gli zaini; un'amica / un amico.",
    pattern: { positive: "il biglietto · una strada · gli amici", negative: "Non compro il pane oggi.", question: "È una fermata vicina?" },
    examples: [{ target: "La stazione è vicina alla piazza.", translation: "The station is near the square.", note: "Stazione and piazza are feminine singular." }, { target: "Prendiamo uno zaino e due bottiglie.", translation: "We’re taking a backpack and two bottles.", note: "Zaino begins with z and uses lo/uno." }],
    context: "Learn the article with each noun; notice plural changes in the article as well as the noun.",
    commonMistake: { incorrect: "il zaino", correct: "lo zaino", why: "Masculine nouns beginning with z use lo in the singular." },
    distinction: { structures: "il vs lo", difference: "Both are masculine singular definite articles; use lo before z, s + consonant, and some other special initial sounds." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the correct article.", prompt: "___ zaino leggero", options: ["il", "lo", "la"], answer: "lo", explanation: "A masculine noun beginning with z takes lo.", distractorExplanations: { il: "Il is not used before initial z.", la: "La is feminine." } },
      { type: "fill-blank", instruction: "Complete with the feminine plural article.", prompt: "___ strade del centro", answer: "le", explanation: "Strade is feminine plural, so use le." },
      { type: "choose-form", instruction: "Choose the correct plural phrase.", prompt: "due ___ (bottle)", options: ["bottiglia", "bottiglie", "bottigli"], answer: "bottiglie", explanation: "Many feminine nouns ending in -a form the plural in -e: bottiglia → bottiglie.", distractorExplanations: { bottiglia: "This is singular.", bottigli: "This is not the standard plural form of bottiglia." } },
    ],
  },
  {
    language: "italian", level: "a2", title: "Passato prossimo for completed events",
    objective: "Describe a completed event using avere or essere and a past participle.",
    explanation: "The passato prossimo uses the present tense of avere or essere plus a past participle. Many transitive verbs use avere; movement and change-of-state verbs often use essere. With essere, the participle agrees with the subject.",
    rule: "Avere + participle: ho visitato. Essere + participle: siamo partiti/e. Negative non comes before the auxiliary.",
    pattern: { positive: "Ho preso il treno · Siamo arrivate presto.", negative: "Non ho prenotato · Luca non è partito.", question: "Avete già scelto?" },
    examples: [{ target: "Abbiamo visitato il museo domenica.", translation: "We visited the museum on Sunday.", note: "Visitare takes avere." }, { target: "Giulia è arrivata prima delle nove.", translation: "Giulia arrived before nine.", note: "Arrivare takes essere; the participle agrees with Giulia." }],
    context: "Use it for completed events in a recent trip, a sequence of actions or a finished experience.",
    commonMistake: { incorrect: "Giulia ha arrivata alle nove.", correct: "Giulia è arrivata alle nove.", why: "Arrivare uses essere; the past participle agrees with the feminine singular subject." },
    distinction: { structures: "Passato prossimo vs imperfetto", difference: "Passato prossimo presents a completed event; imperfetto presents background, description or a repeated past habit." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the correct auxiliary and agreement.", prompt: "Marta ___ a Firenze ieri sera.", options: ["ha arrivato", "è arrivata", "è arrivati"], answer: "è arrivata", explanation: "Arrivare takes essere and agrees with feminine singular Marta.", distractorExplanations: { "ha arrivato": "Arrivare uses essere here.", "è arrivati": "The subject is feminine singular, not masculine plural." } },
      { type: "fill-blank", instruction: "Complete with the past participle of prendere.", prompt: "Ho ___ un caffè prima della riunione.", answer: "preso", explanation: "Prendere has the irregular past participle preso." },
      { type: "error-correction", instruction: "Correct the auxiliary.", prompt: "Ieri siamo visitato il museo. → Ieri ___ visitato il museo.", options: ["abbiamo", "siamo", "eravamo"], answer: "abbiamo", explanation: "Visitare takes avere: abbiamo visitato.", distractorExplanations: { siamo: "Essere is not the auxiliary for visitare here.", eravamo: "This is the imperfect of essere, not the passato prossimo auxiliary." } },
    ],
  },
  {
    language: "italian", level: "b1", title: "Imperfetto and passato prossimo",
    objective: "Use past-tense viewpoint to distinguish a scene or habit from a completed event.",
    explanation: "The imperfetto describes an ongoing past situation, repeated habit or background. The passato prossimo presents a completed event. A narrative often uses both to distinguish the setting from what happened.",
    rule: "Imperfetto endings: -vo, -vi, -va, -vamo, -vate, -vano. Passato prossimo: present avere/essere + participle.",
    pattern: { positive: "Pioveva quando siamo usciti.", negative: "Non conoscevo la zona, quindi non ho trovato il bar.", question: "Che cosa facevi quando ti ho chiamato?" },
    examples: [{ target: "Mentre aspettavamo il tram, ha iniziato a nevicare.", translation: "While we were waiting for the tram, it started to snow.", note: "Waiting is ongoing background; snow beginning is a completed event." }, { target: "Da bambina, abitavo vicino al mare.", translation: "As a child, I lived near the sea.", note: "A past state or continuing situation uses the imperfetto." }],
    context: "Use the imperfetto to set the scene or describe a habit; use the passato prossimo for events that happened in it.",
    commonMistake: { incorrect: "Da piccolo, ho giocato ogni giorno in piazza.", correct: "Da piccolo, giocavo ogni giorno in piazza.", why: "A repeated past habit is usually expressed with the imperfetto." },
    distinction: { structures: "Imperfetto vs passato prossimo", difference: "The choice shows viewpoint, not simply how long something lasted: background/habit vs bounded event." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the background action.", prompt: "Noi ___ quando è arrivato il messaggio.", options: ["cenavamo", "abbiamo cenato", "ceneremo"], answer: "cenavamo", explanation: "Dinner was in progress when the message arrived.", distractorExplanations: { "abbiamo cenato": "This frames dinner as a completed event rather than ongoing background.", ceneremo: "This is future tense." } },
      { type: "fill-blank", instruction: "Complete with the imperfetto of essere.", prompt: "La strada ___ tranquilla prima del concerto.", answer: "era", explanation: "Essere has the imperfetto form era in the third-person singular." },
      { type: "choose-form", instruction: "Choose the completed event.", prompt: "A un certo punto, il telefono ___.", options: ["squillava", "ha squillato", "squillerebbe"], answer: "ha squillato", explanation: "A un certo punto presents a bounded event that advances the story.", distractorExplanations: { squillava: "This presents ringing as ongoing background.", squillerebbe: "This is the conditional." } },
    ],
  },
  {
    language: "italian", level: "b2", title: "Conditional for polite requests and possibilities",
    objective: "Make a tactful request and describe a hypothetical result with the present conditional.",
    explanation: "The present conditional commonly softens a request or expresses an imagined outcome. Its endings attach to the conditional stem; many verbs use a stem related to the future, including contracted infinitive endings.",
    rule: "Common endings: -ei, -esti, -ebbe, -emmo, -este, -ebbero. Potere → potrei; volere → vorrei; essere → sarei.",
    pattern: { positive: "Vorrei un tavolo vicino alla finestra.", negative: "Non potremmo partire prima.", question: "Potrebbe indicarmi la fermata?" },
    examples: [{ target: "Vorrei sapere se il museo è aperto il lunedì.", translation: "I’d like to know whether the museum is open on Mondays.", note: "Vorrei softens a request for information." }, { target: "Con più tempo, visiteremmo anche il borgo.", translation: "With more time, we would visit the village too.", note: "The conditional expresses an imagined result." }],
    context: "Use the conditional for polite requests, suggestions and the result of a hypothetical situation.",
    commonMistake: { incorrect: "Voglio un tavolo, per favore. (in a formal request)", correct: "Vorrei un tavolo, per favore.", why: "Voglio is grammatically possible but can sound abrupt; vorrei is a conventional polite request." },
    distinction: { structures: "Conditional vs imperfect subjunctive", difference: "In a hypothetical period, the conditional usually expresses the result; the imperfect subjunctive appears in the se-clause: se avessi tempo, partirei." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the polite conditional request.", prompt: "___ un'informazione sulla partenza del treno.", options: ["Voglio", "Vorrei", "Vorrò"], answer: "Vorrei", explanation: "Vorrei is the conventional polite conditional form of volere.", distractorExplanations: { Voglio: "This is direct and can sound less tactful.", Vorrò: "This is future tense, not a polite request." } },
      { type: "fill-blank", instruction: "Complete the imagined result with the conditional.", prompt: "Con un giorno in più, noi ___ (visitare) Siena.", answer: "visiteremmo", explanation: "The first-person plural conditional of visitare is visiteremmo." },
      { type: "translation", instruction: "Choose the natural translation.", prompt: "“Could you show me the way?”", options: ["Potrebbe indicarmi la strada?", "Può indicarmi la strada ieri?", "Potrei indicarti la strada?"], answer: "Potrebbe indicarmi la strada?", explanation: "Potrebbe is a polite conditional request addressed to Lei.", distractorExplanations: { "Può indicarmi la strada ieri?": "The time adverb is incompatible and the form is not the requested softened conditional.", "Potrei indicarti la strada?": "Potrei means I could; it changes the speaker and uses informal te." } },
    ],
  },
  {
    language: "italian", level: "c1", title: "Congiuntivo after opinion, doubt and concession",
    objective: "Select the subjunctive in clauses introduced by opinion, doubt, emotion and concessive expressions.",
    explanation: "The congiuntivo is selected by particular matrix expressions and clause relationships. It is not a general marker of uncertainty: the governing expression, register and clause type all matter.",
    rule: "Opinion/doubt/emotion + che + subjunctive. Although: benché/sebbene + subjunctive. When subject is shared, an infinitive may be preferred.",
    pattern: { positive: "Ritengo che la proposta sia utile.", negative: "Non credo che il dato sia completo.", question: "Benché il percorso sia lungo, ne vale la pena." },
    examples: [{ target: "È possibile che il museo chiuda prima oggi.", translation: "It is possible that the museum will close earlier today.", note: "An impersonal expression of possibility selects the subjunctive." }, { target: "Sebbene abbiano poco tempo, preparano un incontro accurato.", translation: "Although they have little time, they are preparing a careful meeting.", note: "Sebbene introduces a concessive subjunctive clause." }],
    context: "Use these patterns in considered conversation, formal correspondence and analytical writing.",
    commonMistake: { incorrect: "Penso che la soluzione è efficace.", correct: "Penso che la soluzione sia efficace.", why: "In standard Italian, affirmative penso che commonly selects the subjunctive." },
    distinction: { structures: "Indicative vs congiuntivo", difference: "The indicative presents a proposition directly; the congiuntivo is selected by a governing expression or subordinate-clause relation. Regional and colloquial usage can vary." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the subjunctive after penso che.", prompt: "Penso che loro ___ già la risposta.", options: ["conoscono", "conoscano", "conoscevano"], answer: "conoscano", explanation: "Standard penso che commonly selects the present subjunctive: conoscano.", distractorExplanations: { conoscono: "This is indicative and is not the target construction.", conoscevano: "This is imperfect indicative and does not fit the present opinion clause." } },
      { type: "fill-blank", instruction: "Complete with the congiuntivo of essere.", prompt: "Benché il risultato ___ positivo, restano alcuni dubbi.", answer: "sia", explanation: "Benché selects the subjunctive; essere → sia." },
      { type: "true-false", instruction: "Decide whether the clause uses the standard mood after a concessive connector.", prompt: "Sebbene il progetto sia ambizioso, resta realizzabile.", options: ["True", "False"], answer: "True", explanation: "Sebbene is followed by the congiuntivo sia.", distractorExplanations: { False: "The sentence correctly uses the congiuntivo after sebbene." } },
    ],
  },
  {
    language: "italian", level: "c2", title: "Combined pronouns and information focus",
    objective: "Place combined object pronouns naturally and use dislocation without obscuring reference.",
    explanation: "Italian combines indirect and direct object pronouns in a fixed order. With third-person indirect pronouns, gli/le become glie- before lo/la/li/le and attach as one written unit. Pronoun placement changes with finite verbs, infinitives and affirmative imperatives.",
    rule: "Indirect + direct: glielo, gliela, glieli, gliele. Before a finite verb: glielo spiego; attached to an infinitive: spiegarglielo. Avoid ambiguous dislocation without a clear resumptive pronoun.",
    pattern: { positive: "La procedura? Gliel'ho spiegata ieri.", negative: "Non gliel'avrei suggerita senza controllare.", question: "Potresti mostrarglielo di nuovo?" },
    examples: [{ target: "La proposta? Gliel'abbiamo inviata ieri.", translation: "The proposal? We sent it to them yesterday.", note: "Gli + la combines as gliela; before avere, the apostrophe reflects elision." }, { target: "Vorrei illustrargliene i vantaggi con calma.", translation: "I would like to explain its advantages to them calmly.", note: "The combined form includes ne; the pronouns attach to the infinitive." }],
    context: "Use combined pronouns to maintain natural flow when referring back to people and things in connected speech.",
    commonMistake: { incorrect: "Gli lo spiego domani.", correct: "Glielo spiego domani.", why: "Gli and lo combine into the single form glielo." },
    distinction: { structures: "glielo vs gliel'ho", difference: "Glielo precedes a finite verb; before the auxiliary ho, elision commonly gives gliel'ho. Pronoun order remains indirect then direct." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the combined pronoun.", prompt: "Spiego il problema a Paolo. ___ spiego con calma.", options: ["Gli lo", "Glielo", "Lo gli"], answer: "Glielo", explanation: "Gli + lo combine as glielo before the finite verb.", distractorExplanations: { "Gli lo": "The indirect and direct pronouns combine in this context.", "Lo gli": "The order is indirect object before direct object." } },
      { type: "fill-blank", instruction: "Attach the combined pronoun to the infinitive.", prompt: "Vorrei ___ (explain it to them) prima della riunione.", answer: "spiegarglielo", explanation: "Attach glielo to spiegare: spiegarglielo." },
      { type: "error-correction", instruction: "Correct the pronoun combination.", prompt: "Ho consegnato i documenti a Sara → Glieli ho consegnati. Is this correct?", options: ["Yes", "No, use gliele", "No, use gli li"], answer: "Yes", explanation: "I documenti is masculine plural, so the direct pronoun is li; gli + li combines as glieli. The participle agrees with the preceding direct object in this construction.", distractorExplanations: { "No, use gliele": "Gliele would refer to a feminine plural direct object.", "No, use gli li": "Third-person indirect gli combines with lo/la/li/le." } },
    ],
  },

  {
    language: "german", level: "a1", title: "Nominative articles: der, die, das",
    objective: "Identify the subject of a simple sentence and choose its nominative article.",
    explanation: "German nouns have grammatical gender: masculine, feminine or neuter. The article marks the case as well as gender and number. In a simple statement, the subject is normally nominative.",
    rule: "Nominative definite articles: der (masculine), die (feminine/plural), das (neuter). Indefinite: ein (masculine/neuter), eine (feminine).",
    pattern: { positive: "Der Zug kommt · Eine Frau wartet · Das Café öffnet.", negative: "Der Bus kommt nicht.", question: "Kommt der Zug heute?" },
    examples: [{ target: "Der Zug nach Köln fährt um neun.", translation: "The train to Cologne leaves at nine.", note: "Der Zug is the masculine nominative subject." }, { target: "Eine freundliche Frau zeigt uns den Weg.", translation: "A friendly woman shows us the way.", note: "Eine Frau is the feminine nominative subject." }],
    context: "Learn each noun with its article; the article shows the subject's role in a basic statement.",
    commonMistake: { incorrect: "Das Bahnhof ist geschlossen.", correct: "Der Bahnhof ist geschlossen.", why: "Bahnhof is masculine; learn the noun together with its article." },
    distinction: { structures: "der vs den", difference: "Der is masculine nominative; den is masculine accusative. The article changes when the noun is the direct object." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the nominative article for the subject.", prompt: "___ Mädchen wartet am Gleis.", options: ["Der", "Die", "Das"], answer: "Das", explanation: "Mädchen is grammatically neuter, although it refers to a girl.", distractorExplanations: { Der: "Der is masculine nominative.", Die: "Die is feminine or plural nominative." } },
      { type: "fill-blank", instruction: "Complete with the nominative article.", prompt: "___ Bahnhof ist heute geöffnet. (masculine)", answer: "Der", explanation: "Bahnhof is masculine and is the sentence subject: der Bahnhof." },
      { type: "choose-form", instruction: "Choose the sentence with the correct subject article.", prompt: "___ Karte liegt auf dem Tisch.", options: ["Der Karte", "Die Karte", "Das Karte"], answer: "Die Karte", explanation: "Karte is feminine; its nominative article is die.", distractorExplanations: { "Der Karte": "Der does not agree with feminine Karte in the nominative.", "Das Karte": "Das is neuter." } },
    ],
  },
  {
    language: "german", level: "a2", title: "Accusative and dative in everyday sentences",
    objective: "Distinguish a direct object in the accusative from a recipient in the dative.",
    explanation: "The accusative commonly marks a direct object; the dative commonly marks a recipient or follows a dative preposition. Masculine articles change clearly: der → den and ein → einen in the accusative. Dative articles have their own forms.",
    rule: "Accusative: den/einen (masculine), die/eine (feminine), das/ein (neuter). Dative: dem/einem (masculine/neuter), der/einer (feminine), den + -n (plural in many contexts).",
    pattern: { positive: "Ich kaufe den Stadtplan. · Ich gebe dem Kind den Stadtplan.", negative: "Ich nehme keinen Bus. · Sie hilft dem Gast nicht.", question: "Wem gibst du den Schlüssel? · Wen besuchst du?" },
    examples: [{ target: "Ich frage den Verkäufer nach dem Weg.", translation: "I ask the salesperson for directions.", note: "Den Verkäufer is the direct object (accusative)." }, { target: "Die Verkäuferin erklärt der Kundin den Fahrplan.", translation: "The salesperson explains the timetable to the customer.", note: "Der Kundin is the recipient (dative); den Fahrplan is the direct object." }],
    context: "Use case questions as a first clue: Wen/was? for many accusative objects; Wem? for many dative recipients.",
    commonMistake: { incorrect: "Ich helfe den Mann.", correct: "Ich helfe dem Mann.", why: "Helfen takes a dative object." },
    distinction: { structures: "Accusative vs dative", difference: "The direct object is often accusative, but certain verbs (helfen, danken) and prepositions govern the dative regardless of English translation." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the dative article after helfen.", prompt: "Wir helfen ___ neuen Nachbarin.", options: ["die", "der", "den"], answer: "der", explanation: "Helfen takes the dative; feminine dative is der.", distractorExplanations: { die: "Die is feminine nominative/accusative.", den: "Den is masculine accusative or plural dative, not feminine dative." } },
      { type: "fill-blank", instruction: "Use the masculine accusative form.", prompt: "Er sucht ___ Schlüssel. (der Schlüssel)", answer: "den", explanation: "Suchen takes a direct accusative object; masculine der changes to den." },
      { type: "choose-form", instruction: "Choose the recipient in the dative.", prompt: "Ich gebe ___ Gast die Quittung.", options: ["dem", "den", "der"], answer: "dem", explanation: "The recipient is dative; masculine dative is dem.", distractorExplanations: { den: "Den is masculine accusative.", der: "Der is feminine dative or masculine nominative." } },
    ],
  },
  {
    language: "german", level: "b1", title: "Perfekt for spoken past events",
    objective: "Describe completed events using the Perfekt and select the usual auxiliary.",
    explanation: "The Perfekt is common for past events in conversation. It uses haben or sein plus a past participle, usually placed at the end of the clause. Many intransitive motion or change-of-state verbs use sein; most other verbs use haben.",
    rule: "Main clause: subject + haben/sein + … + past participle. Regular participles often use ge-…-t; irregular forms vary. Separable-prefix verbs place ge between the prefix and stem.",
    pattern: { positive: "Wir haben eine Führung gebucht. · Der Zug ist angekommen.", negative: "Ich habe die Adresse nicht gefunden.", question: "Wann seid ihr angekommen?" },
    examples: [{ target: "Wir haben das Gepäck am Bahnhof gelassen.", translation: "We left the luggage at the station.", note: "Lassen uses haben and the participle is irregular: gelassen." }, { target: "Der Bus ist um halb sieben abgefahren.", translation: "The bus departed at half past six.", note: "Abfahren is a motion verb; its participle is abgefahren and the auxiliary is sein." }],
    context: "Use the Perfekt for completed past events in everyday conversation; keep the participle at the end of the main clause.",
    commonMistake: { incorrect: "Wir haben nach Berlin gefahren.", correct: "Wir sind nach Berlin gefahren.", why: "Fahren expressing a change of location usually takes sein in the Perfekt." },
    distinction: { structures: "Perfekt vs Präteritum", difference: "Perfekt is common in conversation; Präteritum is frequent in written narrative and with sein, haben and modal verbs in speech." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the usual auxiliary for a journey.", prompt: "Die Gäste ___ spät angekommen.", options: ["haben", "sind", "werden"], answer: "sind", explanation: "Ankommen expresses a change of location and uses sein in the Perfekt.", distractorExplanations: { haben: "Haben is not the usual auxiliary for ankommen.", werden: "Werden does not form the Perfekt here." } },
      { type: "fill-blank", instruction: "Place the participle at the end and complete it.", prompt: "Ich habe ein Zimmer ___ (buchen).", answer: "gebucht", explanation: "Buchen forms the participle gebucht; it comes at the end of the clause." },
      { type: "word-order", instruction: "Choose the correct word order.", prompt: "Gestern ___ wir den Fahrplan ___.", options: ["haben / überprüft", "überprüft / haben", "sind / überprüfen"], answer: "haben / überprüft", explanation: "The finite auxiliary occupies the second position; the participle goes at the end.", distractorExplanations: { "überprüft / haben": "The finite verb does not belong at the end of this main clause.", "sind / überprüfen": "This uses the wrong auxiliary and the infinitive instead of the participle." } },
    ],
  },
  {
    language: "german", level: "b2", title: "Subordinate clauses and verb-final order",
    objective: "Place the finite verb at the end of a subordinate clause introduced by a conjunction.",
    explanation: "Subordinating conjunctions such as weil, obwohl and dass send the finite verb to the end of their clause. In a main clause after the subordinate clause, the conjugated verb returns to the second position.",
    rule: "Main clause + conjunction + subject + … + finite verb. If the subordinate clause comes first, the following main clause starts with its finite verb.",
    pattern: { positive: "Wir warten, weil der Zug Verspätung hat.", negative: "Obwohl es nicht regnet, nehmen wir keinen Schirm mit.", question: "Warum bleibst du hier, wenn der Laden schließt?" },
    examples: [{ target: "Ich nehme den früheren Bus, weil ich pünktlich ankommen möchte.", translation: "I’m taking the earlier bus because I want to arrive on time.", note: "The finite möchte goes at the end of the weil-clause." }, { target: "Obwohl die Strecke lang ist, fahren viele mit dem Rad.", translation: "Although the route is long, many people cycle.", note: "The subordinate clause comes first; fahren is second in the main clause." }],
    context: "Use a subordinate clause to connect reasons, contrast and reported content in more developed explanations.",
    commonMistake: { incorrect: "…, weil der Zug hat Verspätung.", correct: "…, weil der Zug Verspätung hat.", why: "The finite verb moves to the end after subordinating weil." },
    distinction: { structures: "weil vs denn", difference: "Weil introduces a subordinate clause with final verb order; denn coordinates main clauses, so the following clause keeps main-clause word order." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the correct subordinate-clause order.", prompt: "Ich rufe später an, weil ich noch im Büro ___.", options: ["bin", "bin ich", "sein"], answer: "bin", explanation: "The finite verb bin comes at the end of the weil-clause.", distractorExplanations: { "bin ich": "This is question-like inversion, not subordinate order.", sein: "This is an infinitive, not the finite verb." } },
      { type: "word-order", instruction: "Choose the correct main-clause order after a fronted subordinate clause.", prompt: "Obwohl der Weg weit ist, ___ wir zu Fuß.", options: ["gehen", "wir gehen", "gegangen"], answer: "gehen", explanation: "After the initial subordinate clause, the finite verb leads the main clause (verb-second overall).", distractorExplanations: { "wir gehen": "This places the subject before the verb after an initial clause.", gegangen: "This is a participle, not the finite verb." } },
      { type: "sentence-transformation", instruction: "Choose the clause with denn and main-clause word order.", prompt: "Weil es spät ist, nehmen wir ein Taxi. → Es ist spät, denn ___.", options: ["wir nehmen ein Taxi", "nehmen wir ein Taxi", "wir ein Taxi nehmen"], answer: "wir nehmen ein Taxi", explanation: "Denn coordinates two main clauses; the second keeps subject + finite verb order.", distractorExplanations: { "nehmen wir ein Taxi": "This inversion is not needed after coordinating denn.", "wir ein Taxi nehmen": "This puts the finite verb at the end, as in a subordinate clause." } },
    ],
  },
  {
    language: "german", level: "c1", title: "Passive voice and focus",
    objective: "Choose passive constructions when the process or affected participant matters more than the agent.",
    explanation: "The werden-passive foregrounds an action or process; the sein-passive often describes a resulting state. The agent can be added with von for an agent or durch for a means/cause, when relevant.",
    rule: "Process passive: werden (finite) + past participle. State passive: sein (finite) + past participle. In a subordinate clause, the finite auxiliary moves to the end.",
    pattern: { positive: "Der Bericht wird morgen veröffentlicht.", negative: "Die Ergebnisse sind noch nicht bestätigt.", question: "Wann wird die Brücke wieder geöffnet?" },
    examples: [{ target: "Die Unterlagen werden von einer unabhängigen Stelle geprüft.", translation: "The documents are being reviewed by an independent body.", note: "Werden + geprüft describes the review process." }, { target: "Die Tür ist bereits geschlossen.", translation: "The door is already closed.", note: "Sein + geschlossen describes a resulting state." }],
    context: "Use passive when the process, result or affected object is the focus; retain an agent when it contributes important information.",
    commonMistake: { incorrect: "Die Unterlagen sind morgen geprüft.", correct: "Die Unterlagen werden morgen geprüft.", why: "A future process uses werden-passive; sein-passive describes a current resulting state." },
    distinction: { structures: "werden-passive vs sein-passive", difference: "Werden-passive describes an action/process; sein-passive describes the resulting state. Context and time reference determine the intended reading." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the passive form for an ongoing process.", prompt: "Die Straße ___ nächste Woche repariert.", options: ["wird", "ist", "hat"], answer: "wird", explanation: "The repair is a process scheduled for next week: werden + participle.", distractorExplanations: { ist: "Sein-passive usually describes the resulting state.", hat: "Haben does not form the passive here." } },
      { type: "fill-blank", instruction: "Complete the passive with werden.", prompt: "Die Daten ___ regelmäßig überprüft.", answer: "werden", explanation: "Daten is plural, so the passive auxiliary is werden." },
      { type: "true-false", instruction: "Decide whether sein-passive describes a state.", prompt: "Die Fenster sind geschlossen. (The windows are in a closed state.)", options: ["True", "False"], answer: "True", explanation: "Sein + participle describes the resulting state here.", distractorExplanations: { False: "The stated reading is a standard state-passive interpretation." } },
    ],
  },
  {
    language: "german", level: "c2", title: "Konjunktiv I for reported claims",
    objective: "Recognise and use reported-speech forms to distinguish a reported claim from the writer's own assertion.",
    explanation: "Konjunktiv I is a conventional form of indirect speech, especially in formal reporting. When its form is identical to the indicative, Konjunktiv II or würde + infinitive may be used for clarity. This is a reporting convention, not a guarantee of disbelief.",
    rule: "Reported statement: reporting clause + Konjunktiv I clause. If the form is ambiguous, choose an unmistakable form (often Konjunktiv II or würde + infinitive) according to register.",
    pattern: { positive: "Die Sprecherin sagt, die Lage sei stabil.", negative: "Der Bericht erklärt, die Zahlen hätten sich nicht verändert.", question: "Der Minister fragt, ob die Gespräche fortgesetzt würden." },
    examples: [{ target: "Der Verlag teilte mit, das Buch erscheine im Herbst.", translation: "The publisher stated that the book would appear in autumn.", note: "Erscheine is Konjunktiv I and marks an indirectly reported statement." }, { target: "Die Forschenden erklärten, sie hätten weitere Daten gesammelt.", translation: "The researchers explained that they had collected additional data.", note: "Hätten is Konjunktiv II, used here to distinguish a plural reported form from the indicative." }],
    context: "Use reported-speech forms in formal summaries and journalism when the distinction between source and narrator matters.",
    commonMistake: { incorrect: "Konjunktiv I always means the writer doubts the claim.", correct: "Konjunktiv I marks reported speech; it does not by itself express the writer's personal disbelief.", why: "Its function is grammatical and reporting-related; evaluation depends on context and additional wording." },
    distinction: { structures: "Konjunktiv I vs Konjunktiv II", difference: "Konjunktiv I is a common indirect-speech form. Konjunktiv II can mark irrealis or replace an ambiguous Konjunktiv I form in reported speech." },
    questions: [
      { type: "multiple-choice", instruction: "Choose the standard Konjunktiv I form of sein.", prompt: "Der Sprecher sagt, der Termin ___ bestätigt.", options: ["ist", "sei", "wäre"], answer: "sei", explanation: "The third-person singular Konjunktiv I of sein is sei.", distractorExplanations: { ist: "This is indicative and does not mark the reported form.", wäre: "This is Konjunktiv II and has a different modal value or may be used as a substitute in some contexts." } },
      { type: "fill-blank", instruction: "Complete with the Konjunktiv I of haben.", prompt: "Die Autorin schreibt, der Text ___ drei Teile.", answer: "habe", explanation: "The third-person singular Konjunktiv I of haben is habe." },
      { type: "true-false", instruction: "Decide whether Konjunktiv I alone proves the report is false.", prompt: "“Die Firma sei insolvent” grammatically marks a reported claim, but does not itself say whether the claim is true.", options: ["True", "False"], answer: "True", explanation: "Konjunktiv I marks reported speech; it does not encode the narrator's personal disbelief by itself.", distractorExplanations: { False: "The grammatical mood alone does not establish truth or falsity." } },
    ],
  },
];

export const grammarTopics = normalizeLaterGrammarTopics([
  ...seeds.map(seed),
  ...additionalGrammarTopics,
  ...(["a1", "a2", "b1", "b2", "c1", "c2"] as const).flatMap(getEnglishCurriculumGrammarTopics),
  ...(["a1", "a2", "b1", "b2", "c1", "c2"] as const).flatMap(getFrenchCurriculumGrammarTopics),
]);

export function getGrammarTopics(language: LanguageSlug, level: LevelSlug): GrammarTopic[] {
  return grammarTopics.filter((topic) => topic.language === language && topic.level === level);
}

export function getGrammarTopic(language: LanguageSlug, level: LevelSlug, topicId: string): GrammarTopic | undefined {
  return getGrammarTopics(language, level).find((topic) => topic.id === topicId);
}

export function getGrammarSourceNotes(topic: GrammarTopic) {
  const sourceIds = new Set(topic.sourceIds);
  return educationalSources.filter((source) => sourceIds.has(source.id));
}

export { contentVerification };

export function grammarLanguageName(slug: LanguageSlug) {
  return getLanguage(slug)?.name ?? slug;
}
