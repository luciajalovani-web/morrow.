import type { LanguageSlug, LevelSlug } from "@/app/lib/language-content";

export type PracticeSkill = "Grammar" | "Vocabulary" | "Listening" | "Reading" | "Writing" | "Speaking";
export type PracticeQuestion = {
  id: string;
  skill: PracticeSkill;
  task: string;
  prompt: string;
  passage?: string;
  choices?: string[];
  answer?: string;
  explanation?: string;
  minimumWords?: number;
};

export type SampleTest = {
  id: string;
  level: LevelSlug;
  title: string;
  questions: PracticeQuestion[];
};

type TestCopy = {
  title: string;
  grammarPrompt: string;
  grammarChoices: [string, string, string];
  grammarAnswer: string;
  vocabularyPrompt: string;
  vocabularyChoices: [string, string, string];
  vocabularyAnswer: string;
  listeningPrompt: string;
  listeningPassage: string;
  listeningChoices: [string, string, string];
  listeningAnswer: string;
  readingPrompt: string;
  readingPassage: string;
  readingChoices: [string, string, string];
  readingAnswer: string;
  writingPrompt: string;
};

const sampleCopy: Record<LanguageSlug, [TestCopy, TestCopy]> = {
  english: [
    {
      title: "A day in the city",
      grammarPrompt: "Yesterday, Maya ___ the bus to the museum.",
      grammarChoices: ["takes", "took", "taking"],
      grammarAnswer: "took",
      vocabularyPrompt: "A place where you can borrow books is a ___.",
      vocabularyChoices: ["library", "bakery", "station"],
      vocabularyAnswer: "library",
      listeningPrompt: "Listen to the short message. What time does the group meet?",
      listeningPassage: "Hi, everyone. Let's meet outside the museum at half past ten. Please bring your tickets.",
      listeningChoices: ["10:00", "10:30", "11:30"],
      listeningAnswer: "10:30",
      readingPrompt: "Why did Leo take the earlier train?",
      readingPassage: "Leo planned to meet his cousin at noon. His usual train was delayed, so he chose an earlier one and arrived with time for coffee.",
      readingChoices: ["His usual train was delayed.", "He wanted to visit the station.", "His cousin asked him to drive."],
      readingAnswer: "His usual train was delayed.",
      writingPrompt: "Write a short message to a friend suggesting a place and time to meet in your town.",
    },
    {
      title: "Plans and experiences",
      grammarPrompt: "If it ___ tomorrow, we will have lunch indoors.",
      grammarChoices: ["rains", "will rain", "rained"],
      grammarAnswer: "rains",
      vocabularyPrompt: "Which verb naturally completes the phrase: ___ a decision?",
      vocabularyChoices: ["do", "make", "take up"],
      vocabularyAnswer: "make",
      listeningPrompt: "Listen to the announcement. Which platform should passengers use?",
      listeningPassage: "The 4:15 service to Brighton will now leave from platform six. We apologise for the change.",
      listeningChoices: ["Platform four", "Platform five", "Platform six"],
      listeningAnswer: "Platform six",
      readingPrompt: "What is Nina's main reason for cycling to work?",
      readingPassage: "Nina started cycling to work to avoid the busy morning buses. She now enjoys the fresh air and says the journey takes about the same time.",
      readingChoices: ["It is always faster.", "She wanted to avoid crowded buses.", "Her workplace is next to her home."],
      readingAnswer: "She wanted to avoid crowded buses.",
      writingPrompt: "Write an email describing a recent day out and recommending one thing your friend could do there.",
    },
  ],
  french: [
    {
      title: "Une journée en ville",
      grammarPrompt: "Hier, Maya ___ le bus pour aller au musée.",
      grammarChoices: ["prend", "a pris", "prendre"],
      grammarAnswer: "a pris",
      vocabularyPrompt: "On peut emprunter des livres à la ___.",
      vocabularyChoices: ["bibliothèque", "boulangerie", "gare"],
      vocabularyAnswer: "bibliothèque",
      listeningPrompt: "Écoutez le message. À quelle heure le groupe se retrouve-t-il ?",
      listeningPassage: "Bonjour tout le monde. Retrouvons-nous devant le musée à dix heures et demie. N'oubliez pas vos billets.",
      listeningChoices: ["10 h", "10 h 30", "11 h 30"],
      listeningAnswer: "10 h 30",
      readingPrompt: "Pourquoi Léo a-t-il pris le train précédent ?",
      readingPassage: "Léo devait retrouver sa cousine à midi. Son train habituel était en retard ; il a donc pris le précédent et a eu le temps de boire un café.",
      readingChoices: ["Son train habituel était en retard.", "Il voulait visiter la gare.", "Sa cousine lui a demandé de conduire."],
      readingAnswer: "Son train habituel était en retard.",
      writingPrompt: "Écrivez un court message à un ami pour proposer un lieu et une heure de rendez-vous dans votre ville.",
    },
    {
      title: "Projets et expériences",
      grammarPrompt: "S'il ___ demain, nous déjeunerons à l'intérieur.",
      grammarChoices: ["pleut", "pleuvra", "pleuvait"],
      grammarAnswer: "pleut",
      vocabularyPrompt: "Quel verbe complète naturellement l'expression : ___ une décision ?",
      vocabularyChoices: ["faire", "prendre", "mettre"],
      vocabularyAnswer: "prendre",
      listeningPrompt: "Écoutez l'annonce. De quel quai part le train ?",
      listeningPassage: "Le train de 16 h 15 pour Brighton partira désormais du quai six. Nous vous prions de nous excuser pour ce changement.",
      listeningChoices: ["Quai quatre", "Quai cinq", "Quai six"],
      listeningAnswer: "Quai six",
      readingPrompt: "Pourquoi Nina se rend-elle au travail à vélo ?",
      readingPassage: "Nina a commencé à aller au travail à vélo pour éviter les bus bondés le matin. Elle apprécie maintenant l'air frais et le trajet dure à peu près le même temps.",
      readingChoices: ["C'est toujours plus rapide.", "Elle voulait éviter les bus bondés.", "Son travail est près de chez elle."],
      readingAnswer: "Elle voulait éviter les bus bondés.",
      writingPrompt: "Écrivez un courriel sur une sortie récente et recommandez une activité à votre ami.",
    },
  ],
  spanish: [
    {
      title: "Un día en la ciudad",
      grammarPrompt: "Ayer, Maya ___ el autobús para ir al museo.",
      grammarChoices: ["toma", "tomó", "tomando"],
      grammarAnswer: "tomó",
      vocabularyPrompt: "Un lugar donde puedes pedir libros prestados es una ___.",
      vocabularyChoices: ["biblioteca", "panadería", "estación"],
      vocabularyAnswer: "biblioteca",
      listeningPrompt: "Escucha el mensaje. ¿A qué hora queda el grupo?",
      listeningPassage: "Hola a todos. Quedamos delante del museo a las diez y media. Por favor, traed las entradas.",
      listeningChoices: ["10:00", "10:30", "11:30"],
      listeningAnswer: "10:30",
      readingPrompt: "¿Por qué Leo tomó el tren anterior?",
      readingPassage: "Leo iba a encontrarse con su prima al mediodía. Su tren habitual se retrasó, así que tomó otro anterior y tuvo tiempo para tomar un café.",
      readingChoices: ["Su tren habitual se retrasó.", "Quería visitar la estación.", "Su prima le pidió que condujera."],
      readingAnswer: "Su tren habitual se retrasó.",
      writingPrompt: "Escribe un mensaje corto a un amigo para proponer un lugar y una hora para quedar en tu ciudad.",
    },
    {
      title: "Planes y experiencias",
      grammarPrompt: "Si ___ mañana, comeremos dentro.",
      grammarChoices: ["llueve", "lloverá", "llovía"],
      grammarAnswer: "llueve",
      vocabularyPrompt: "¿Qué verbo completa la expresión: ___ una decisión?",
      vocabularyChoices: ["hacer", "tomar", "poner"],
      vocabularyAnswer: "tomar",
      listeningPrompt: "Escucha el aviso. ¿De qué andén sale el tren?",
      listeningPassage: "El tren de las 16:15 a Brighton saldrá ahora del andén seis. Disculpen las molestias.",
      listeningChoices: ["Andén cuatro", "Andén cinco", "Andén seis"],
      listeningAnswer: "Andén seis",
      readingPrompt: "¿Por qué Nina va en bicicleta al trabajo?",
      readingPassage: "Nina empezó a ir en bicicleta al trabajo para evitar los autobuses llenos por la mañana. Ahora disfruta del aire fresco y dice que tarda casi lo mismo.",
      readingChoices: ["Siempre es más rápido.", "Quería evitar los autobuses llenos.", "Su trabajo está al lado de casa."],
      readingAnswer: "Quería evitar los autobuses llenos.",
      writingPrompt: "Escribe un correo sobre una excursión reciente y recomienda una actividad a tu amigo.",
    },
  ],
  italian: [
    {
      title: "Una giornata in città",
      grammarPrompt: "Ieri Maya ___ l'autobus per andare al museo.",
      grammarChoices: ["prende", "ha preso", "prendere"],
      grammarAnswer: "ha preso",
      vocabularyPrompt: "In quale luogo puoi prendere in prestito dei libri?",
      vocabularyChoices: ["biblioteca", "panetteria", "stazione"],
      vocabularyAnswer: "biblioteca",
      listeningPrompt: "Ascolta il messaggio. A che ora si incontra il gruppo?",
      listeningPassage: "Ciao a tutti. Ci vediamo davanti al museo alle dieci e mezza. Portate i biglietti.",
      listeningChoices: ["10:00", "10:30", "11:30"],
      listeningAnswer: "10:30",
      readingPrompt: "Perché Leo ha preso il treno precedente?",
      readingPassage: "Leo doveva incontrare sua cugina a mezzogiorno. Il suo treno abituale era in ritardo, così ne ha preso uno prima e ha avuto tempo per un caffè.",
      readingChoices: ["Il suo treno era in ritardo.", "Voleva visitare la stazione.", "Sua cugina gli ha chiesto di guidare."],
      readingAnswer: "Il suo treno era in ritardo.",
      writingPrompt: "Scrivi un breve messaggio a un amico per proporre un luogo e un orario per incontrarvi in città.",
    },
    {
      title: "Progetti ed esperienze",
      grammarPrompt: "Se domani ___, pranzeremo al coperto.",
      grammarChoices: ["piove", "pioverà", "pioveva"],
      grammarAnswer: "piove",
      vocabularyPrompt: "Quale verbo completa l'espressione: ___ una decisione?",
      vocabularyChoices: ["fare", "prendere", "mettere"],
      vocabularyAnswer: "prendere",
      listeningPrompt: "Ascolta l'annuncio. Da quale binario parte il treno?",
      listeningPassage: "Il treno delle 16:15 per Brighton partirà dal binario sei. Ci scusiamo per il cambiamento.",
      listeningChoices: ["Binario quattro", "Binario cinque", "Binario sei"],
      listeningAnswer: "Binario sei",
      readingPrompt: "Perché Nina va al lavoro in bicicletta?",
      readingPassage: "Nina ha iniziato ad andare al lavoro in bicicletta per evitare gli autobus affollati. Ora le piace l'aria fresca e il viaggio dura quasi lo stesso tempo.",
      readingChoices: ["È sempre più veloce.", "Voleva evitare gli autobus affollati.", "L'ufficio è vicino a casa."],
      readingAnswer: "Voleva evitare gli autobus affollati.",
      writingPrompt: "Scrivi un'email su una gita recente e consiglia un'attività al tuo amico.",
    },
  ],
  german: [
    {
      title: "Ein Tag in der Stadt",
      grammarPrompt: "Gestern ___ Maya mit dem Bus zum Museum.",
      grammarChoices: ["fährt", "fuhr", "fahren"],
      grammarAnswer: "fuhr",
      vocabularyPrompt: "In einer ___ kann man Bücher ausleihen.",
      vocabularyChoices: ["Bibliothek", "Bäckerei", "Bahnhof"],
      vocabularyAnswer: "Bibliothek",
      listeningPrompt: "Hören Sie die Nachricht. Um wie viel Uhr trifft sich die Gruppe?",
      listeningPassage: "Hallo zusammen. Treffen wir uns um halb elf vor dem Museum. Bitte bringt eure Eintrittskarten mit.",
      listeningChoices: ["10:00 Uhr", "10:30 Uhr", "11:30 Uhr"],
      listeningAnswer: "10:30 Uhr",
      readingPrompt: "Warum nahm Leo den früheren Zug?",
      readingPassage: "Leo wollte seine Cousine um zwölf Uhr treffen. Sein Zug hatte Verspätung, deshalb nahm er einen früheren Zug und hatte noch Zeit für einen Kaffee.",
      readingChoices: ["Sein Zug hatte Verspätung.", "Er wollte den Bahnhof besuchen.", "Seine Cousine bat ihn zu fahren."],
      readingAnswer: "Sein Zug hatte Verspätung.",
      writingPrompt: "Schreiben Sie einer Freundin oder einem Freund eine kurze Nachricht und schlagen Sie einen Treffpunkt und eine Uhrzeit vor.",
    },
    {
      title: "Pläne und Erlebnisse",
      grammarPrompt: "Wenn es morgen ___, essen wir drinnen.",
      grammarChoices: ["regnet", "regnen wird", "regnete"],
      grammarAnswer: "regnet",
      vocabularyPrompt: "Welches Verb ergänzt den Ausdruck: eine Entscheidung ___?",
      vocabularyChoices: ["machen", "treffen", "nehmen"],
      vocabularyAnswer: "treffen",
      listeningPrompt: "Hören Sie die Durchsage. Von welchem Gleis fährt der Zug?",
      listeningPassage: "Der Zug um 16.15 Uhr nach Brighton fährt jetzt von Gleis sechs. Wir bitten um Entschuldigung.",
      listeningChoices: ["Gleis vier", "Gleis fünf", "Gleis sechs"],
      listeningAnswer: "Gleis sechs",
      readingPrompt: "Warum fährt Nina mit dem Fahrrad zur Arbeit?",
      readingPassage: "Nina fährt mit dem Fahrrad zur Arbeit, um die vollen Busse am Morgen zu vermeiden. Jetzt genießt sie die frische Luft und braucht ungefähr genauso lange.",
      readingChoices: ["Es ist immer schneller.", "Sie wollte volle Busse vermeiden.", "Ihr Büro ist neben ihrer Wohnung."],
      readingAnswer: "Sie wollte volle Busse vermeiden.",
      writingPrompt: "Schreiben Sie eine E-Mail über einen Ausflug und empfehlen Sie einer Freundin oder einem Freund eine Aktivität.",
    },
  ],
};

export function getSampleTests(language: LanguageSlug): SampleTest[] {
  const [first, second] = sampleCopy[language];
  return [
    {
      id: `${language}-a1-city`,
      level: "a1",
      title: `${first.title} · A1`,
      questions: makeQuestions("a1", first),
    },
    {
      id: `${language}-a2-plans`,
      level: "a2",
      title: `${second.title} · A2`,
      questions: makeQuestions("a2", second),
    },
  ];
}

function makeQuestions(level: "a1" | "a2", copy: TestCopy): PracticeQuestion[] {
  return [
    {
      id: "grammar",
      skill: "Grammar",
      task: "Choose the best answer",
      prompt: copy.grammarPrompt,
      choices: copy.grammarChoices,
      answer: copy.grammarAnswer,
      explanation: level === "a1"
        ? "Use the past form because the sentence begins with “yesterday.”"
        : "In a first conditional sentence, use the present simple after “if.”",
    },
    {
      id: "vocabulary",
      skill: "Vocabulary",
      task: "Choose the best word",
      prompt: copy.vocabularyPrompt,
      choices: copy.vocabularyChoices,
      answer: copy.vocabularyAnswer,
      explanation: "This word is the natural fit for the meaning and context of the sentence.",
    },
    {
      id: "listening",
      skill: "Listening",
      task: "Listen, then answer",
      prompt: copy.listeningPrompt,
      passage: copy.listeningPassage,
      choices: copy.listeningChoices,
      answer: copy.listeningAnswer,
      explanation: "The requested detail is stated directly in the short announcement.",
    },
    {
      id: "reading",
      skill: "Reading",
      task: "Read, then answer",
      prompt: copy.readingPrompt,
      passage: copy.readingPassage,
      choices: copy.readingChoices,
      answer: copy.readingAnswer,
      explanation: "The text explains the reason in its first sentence.",
    },
    {
      id: "writing",
      skill: "Writing",
      task: "Write a short response",
      prompt: copy.writingPrompt,
      minimumWords: 20,
    },
  ];
}

export type ExamSlug = "ielts-academic" | "ielts-general" | "cils" | "goethe" | "dele";
export type ExamDefinition = {
  slug: ExamSlug;
  language: LanguageSlug;
  title: string;
  shortName: string;
  structure: string;
  note: string;
  officialUrl: string;
  references: string[];
  samples: Array<{
    title: string;
    tasks: Record<"Reading" | "Listening" | "Writing" | "Speaking", string>;
    passages: Partial<Record<"Reading" | "Listening", string>>;
    questions: Partial<Record<"Reading" | "Listening", { choices: string[]; answer: string; explanation: string }>>;
    writingWords: number;
    speakingSeconds: number;
  }>;
};

const ieltsAcademicTasks = [
  {
    title: "Campus choices",
    tasks: {
      Reading: "According to the notice, when does the library close on Fridays?",
      Listening: "Which room will host the student workshop?",
      Writing: "Describe the information in the original chart: a campus café served 120, 180 and 150 meals on Monday, Tuesday and Wednesday. Summarise the main trend and compare figures.",
      Speaking: "Describe a place where you enjoy studying. Explain what makes it comfortable and how it helps you focus.",
    },
    passages: {
      Reading: "Riverside Library is open until 8 p.m. Monday to Thursday and until 6 p.m. on Friday. Weekend hours are 10 a.m. to 4 p.m.",
      Listening: "The research workshop has moved from Room 12 to Room 18 because the original room is being repaired. It starts at two o'clock.",
    },
    questions: {
      Reading: { choices: ["4 p.m.", "6 p.m.", "8 p.m."], answer: "6 p.m.", explanation: "The notice says Friday closing time is 6 p.m." },
      Listening: { choices: ["Room 12", "Room 18", "Room 20"], answer: "Room 18", explanation: "The speaker says the workshop moved to Room 18." },
    },
    writingWords: 150,
    speakingSeconds: 60,
  },
  {
    title: "Community energy",
    tasks: {
      Reading: "What does the report say is the main benefit of the neighbourhood garden?",
      Listening: "When will the public information session begin?",
      Writing: "Some people think cities should invest more in public transport than in roads. Discuss both views and give your opinion.",
      Speaking: "Talk about a change in your community that has improved daily life. What changed, and who benefited?",
    },
    passages: {
      Reading: "A neighbourhood garden began as a small volunteer project. Beyond producing vegetables, its organisers report that it has become a regular meeting place and has helped new residents get to know their neighbours.",
      Listening: "The energy advice session will take place in the community hall next Thursday. Doors open at six, and the presentation begins at six thirty.",
    },
    questions: {
      Reading: { choices: ["It sells more vegetables.", "It helps neighbours connect.", "It reduces the cost of homes."], answer: "It helps neighbours connect.", explanation: "The report highlights the garden as a meeting place for residents." },
      Listening: { choices: ["6:00", "6:30", "7:00"], answer: "6:30", explanation: "The presentation begins at half past six." },
    },
    writingWords: 250,
    speakingSeconds: 90,
  },
];

const ieltsGeneralTasks = [
  {
    title: "A new neighbourhood",
    tasks: {
      Reading: "Which day is the community centre closed?",
      Listening: "What should the caller bring to the appointment?",
      Writing: "Write a letter to a neighbour about a noisy building project. Explain the problem and suggest a reasonable solution.",
      Speaking: "Describe a helpful person you have met. Say what they did and why it mattered to you.",
    },
    passages: {
      Reading: "The Oak Street Community Centre is open every day from 9 a.m. to 7 p.m., except Wednesday, when it is closed for maintenance.",
      Listening: "Your appointment is confirmed for Tuesday at ten. Please bring a photo ID and the completed form. You don't need to bring proof of address.",
    },
    questions: {
      Reading: { choices: ["Tuesday", "Wednesday", "Sunday"], answer: "Wednesday", explanation: "The centre is closed on Wednesday for maintenance." },
      Listening: { choices: ["A photo ID and the form", "Proof of address only", "A passport photograph"], answer: "A photo ID and the form", explanation: "The caller is asked to bring both items." },
    },
    writingWords: 150,
    speakingSeconds: 60,
  },
  {
    title: "Making plans",
    tasks: {
      Reading: "What is the main purpose of the notice?",
      Listening: "Where should visitors wait for the tour?",
      Writing: "Write to a friend who is visiting your area. Recommend two activities and explain how to get there.",
      Speaking: "Describe a journey you remember well. Where did you go, and what made it memorable?",
    },
    passages: {
      Reading: "The weekend market has moved indoors to the Town Hall this Saturday because of forecast rain. The opening time remains 9 a.m.; the usual outdoor location will reopen next week.",
      Listening: "The walking tour leaves at eleven. Please meet beside the information desk inside the main entrance, not outside the station.",
    },
    questions: {
      Reading: { choices: ["The market is permanently closing.", "The market is moving for one day.", "The market opens later this week."], answer: "The market is moving for one day.", explanation: "The notice says it is indoors this Saturday and returns next week." },
      Listening: { choices: ["Outside the station", "By the information desk", "At the market"], answer: "By the information desk", explanation: "Visitors should meet by the information desk inside." },
    },
    writingWords: 150,
    speakingSeconds: 60,
  },
];

function makeLanguageExam(
  slug: "cils" | "goethe" | "dele",
  language: "italian" | "german" | "spanish",
  shortName: string,
  title: string,
  structure: string,
  officialUrl: string,
  samples: ExamDefinition["samples"],
  note: string,
): ExamDefinition {
  return {
    slug,
    language,
    shortName,
    title,
    structure,
    note,
    officialUrl,
    references: [officialUrl],
    samples,
  };
}

export const examDefinitions: ExamDefinition[] = [
  {
    slug: "ielts-academic",
    language: "english",
    title: "IELTS Academic",
    shortName: "IELTS Academic",
    structure: "Four sections: Listening, Reading, Writing and Speaking. Listening and Speaking are shared with General Training; Academic Reading and Writing use academic-focused tasks. The official test takes about 2 hours 45 minutes.",
    note: "Original practice only; task timing and formats can vary by delivery mode. Check IELTS for the current format.",
    officialUrl: "https://ielts.org/take-a-test/test-types/ielts-academic-test",
    references: ["https://ielts.org/take-a-test/test-types/ielts-academic-test", "https://ielts.org/take-a-test/test-types/ielts-general-training-test"],
    samples: ieltsAcademicTasks,
  },
  {
    slug: "ielts-general",
    language: "english",
    title: "IELTS General Training",
    shortName: "IELTS General Training",
    structure: "Four sections: Listening, Reading, Writing and Speaking. Listening and Speaking are shared with Academic; General Training Reading and Writing focus on everyday and workplace contexts. The official test takes about 2 hours 45 minutes.",
    note: "Original practice only; task timing and formats can vary by delivery mode. Check IELTS for the current format.",
    officialUrl: "https://ielts.org/take-a-test/test-types/ielts-general-training-test",
    references: ["https://ielts.org/take-a-test/test-types/ielts-general-training-test", "https://ielts.org/take-a-test/test-types/ielts-academic-test"],
    samples: ieltsGeneralTasks,
  },
  makeLanguageExam("cils", "italian", "CILS", "CILS examinations", "CILS levels assess listening, reading, writing and speaking; some levels also include a separate analysis-of-communication-structures component. The exact sections and timing depend on the level.", "https://cils.unistrasi.it/", [
    {
      title: "La vita in città",
      tasks: {
        Reading: "A che ora chiude la biblioteca il venerdì?",
        Listening: "Dove si svolge l'incontro del quartiere?",
        Writing: "Scrivi un messaggio a un amico per raccontare una nuova attività nella tua zona.",
        Speaking: "Descrivi un luogo della tua città che ti piace e spiega perché.",
      },
      passages: {
        Reading: "La biblioteca di via Roma è aperta dal lunedì al venerdì dalle 9 alle 18. Il sabato chiude alle 13.",
        Listening: "La riunione del quartiere non sarà in biblioteca. Ci vediamo alle 18 nella sala grande del centro civico.",
      },
      questions: {
        Reading: { choices: ["Alle 13", "Alle 18", "Alle 20"], answer: "Alle 18", explanation: "Dal lunedì al venerdì la biblioteca chiude alle 18." },
        Listening: { choices: ["In biblioteca", "Nel centro civico", "Alla stazione"], answer: "Nel centro civico", explanation: "L'incontro è nella sala grande del centro civico." },
      },
      writingWords: 80,
      speakingSeconds: 60,
    },
    {
      title: "Un fine settimana diverso",
      tasks: {
        Reading: "Perché il mercato si svolge al coperto sabato?",
        Listening: "A che ora parte la visita guidata?",
        Writing: "Scrivi un breve testo su un cambiamento utile nel tuo quartiere.",
        Speaking: "Racconta un'esperienza recente che ti ha aiutato a imparare qualcosa di nuovo.",
      },
      passages: {
        Reading: "A causa della pioggia prevista, sabato il mercato si terrà nella palestra della scuola. L'orario resta dalle 9 alle 13.",
        Listening: "La visita guidata comincia alle dieci e mezza. Il gruppo si incontra davanti all'ingresso del museo, vicino alla biglietteria.",
      },
      questions: {
        Reading: { choices: ["Perché piove.", "Perché il mercato è chiuso.", "Perché cambia l'orario."], answer: "Perché piove.", explanation: "Il mercato si sposta al coperto per la pioggia prevista." },
        Listening: { choices: ["Alle 9:30", "Alle 10:30", "Alle 11:30"], answer: "Alle 10:30", explanation: "La visita guidata comincia alle dieci e mezza." },
      },
      writingWords: 100,
      speakingSeconds: 90,
    },
  ], "CILS task types and duration depend on the certificate level. Use the official provider page for the current level-specific syllabus."),
  makeLanguageExam("goethe", "german", "Goethe-Zertifikat", "Goethe-Zertifikat", "Goethe-Zertifikat examinations are aligned to CEFR levels. The four skill modules are Reading, Listening, Writing and Speaking; modular options and task formats vary by level.", "https://www.goethe.de/en/spr/kup/prf.html", [
    {
      title: "Im Alltag",
      tasks: {
        Reading: "Wann ist das Stadtteilzentrum am Samstag geöffnet?",
        Listening: "Wo findet der Sprachkurs statt?",
        Writing: "Schreiben Sie eine kurze Nachricht und laden Sie einen Freund zu einer Veranstaltung ein.",
        Speaking: "Beschreiben Sie einen Ort in Ihrer Stadt, an dem Sie gern Zeit verbringen.",
      },
      passages: {
        Reading: "Das Stadtteilzentrum ist montags bis freitags von 9 bis 18 Uhr geöffnet. Am Samstag können Besucher von 10 bis 13 Uhr kommen.",
        Listening: "Der Deutschkurs findet heute nicht in Raum 4 statt. Bitte gehen Sie in den zweiten Stock, Raum 12.",
      },
      questions: {
        Reading: { choices: ["9 bis 18 Uhr", "10 bis 13 Uhr", "12 bis 16 Uhr"], answer: "10 bis 13 Uhr", explanation: "Am Samstag ist das Zentrum von 10 bis 13 Uhr geöffnet." },
        Listening: { choices: ["Raum 4", "Raum 12", "Im Erdgeschoss"], answer: "Raum 12", explanation: "Der Kurs wurde in den zweiten Stock, Raum 12, verlegt." },
      },
      writingWords: 80,
      speakingSeconds: 60,
    },
    {
      title: "Neue Ideen",
      tasks: {
        Reading: "Warum findet das Treffen im Innenraum statt?",
        Listening: "Wann beginnt die Führung?",
        Writing: "Schreiben Sie eine E-Mail über eine gute Veränderung in Ihrem Wohnort.",
        Speaking: "Erzählen Sie von einer Erfahrung, bei der Sie etwas Neues gelernt haben.",
      },
      passages: {
        Reading: "Wegen des angekündigten Regens findet das Nachbarschaftsfest am Samstag in der Sporthalle statt. Beginn und Programm bleiben gleich.",
        Listening: "Die Führung beginnt um halb elf. Bitte warten Sie vor dem Haupteingang des Museums.",
      },
      questions: {
        Reading: { choices: ["Wegen des Regens", "Wegen einer Verspätung", "Wegen eines neuen Programms"], answer: "Wegen des Regens", explanation: "Der Regen ist der Grund für den Ortswechsel." },
        Listening: { choices: ["Um 9:30 Uhr", "Um 10:30 Uhr", "Um 11:30 Uhr"], answer: "Um 10:30 Uhr", explanation: "Die Führung beginnt um halb elf." },
      },
      writingWords: 100,
      speakingSeconds: 90,
    },
  ], "The Goethe-Institut offers level-specific and, for some certificates, modular examinations. Confirm the current format for your level."),
  makeLanguageExam("dele", "spanish", "DELE", "DELE examinations", "DELE exams assess reading comprehension, listening comprehension, written expression and interaction, and oral expression and interaction. The number and combination of tasks vary by CEFR level.", "https://cervantes.org/es/examenes/dele", [
    {
      title: "La vida diaria",
      tasks: {
        Reading: "¿A qué hora cierra la biblioteca los viernes?",
        Listening: "¿Dónde es la reunión del barrio?",
        Writing: "Escribe un mensaje a un amigo para contarle una actividad nueva de tu barrio.",
        Speaking: "Describe un lugar de tu ciudad que te guste y explica por qué.",
      },
      passages: {
        Reading: "La biblioteca de la calle Mayor abre de lunes a viernes de 9 a 18 horas. Los sábados cierra a las 13.",
        Listening: "La reunión del barrio no será en la biblioteca. Nos vemos a las seis en la sala grande del centro cívico.",
      },
      questions: {
        Reading: { choices: ["A las 13", "A las 18", "A las 20"], answer: "A las 18", explanation: "De lunes a viernes, la biblioteca cierra a las 18." },
        Listening: { choices: ["En la biblioteca", "En el centro cívico", "En la estación"], answer: "En el centro cívico", explanation: "La reunión es en la sala grande del centro cívico." },
      },
      writingWords: 80,
      speakingSeconds: 60,
    },
    {
      title: "Un fin de semana diferente",
      tasks: {
        Reading: "¿Por qué el mercado se celebra en un espacio cubierto?",
        Listening: "¿A qué hora empieza la visita guiada?",
        Writing: "Escribe un texto breve sobre un cambio positivo en tu comunidad.",
        Speaking: "Cuenta una experiencia reciente en la que aprendiste algo nuevo.",
      },
      passages: {
        Reading: "Por la lluvia prevista, el mercado del sábado se celebrará en el gimnasio de la escuela. El horario sigue siendo de 9 a 13.",
        Listening: "La visita guiada empieza a las diez y media. El grupo queda delante de la entrada del museo, junto a la taquilla.",
      },
      questions: {
        Reading: { choices: ["Por la lluvia.", "Porque el mercado cierra.", "Porque cambia el horario."], answer: "Por la lluvia.", explanation: "El texto explica que se cambia de lugar por la lluvia." },
        Listening: { choices: ["A las 9:30", "A las 10:30", "A las 11:30"], answer: "A las 10:30", explanation: "La visita empieza a las diez y media." },
      },
      writingWords: 100,
      speakingSeconds: 90,
    },
  ], "DELE task groupings and timings vary by level. Check the Instituto Cervantes information for your specific certificate."),
];

export function getExamsForLanguage(language: LanguageSlug): ExamDefinition[] {
  return examDefinitions.filter((exam) => exam.language === language);
}

export function getExam(slug: string): ExamDefinition | undefined {
  return examDefinitions.find((exam) => exam.slug === slug);
}

export function getExamByLanguage(slug: string, language: LanguageSlug): ExamDefinition | undefined {
  const exam = getExam(slug);
  return exam?.language === language ? exam : undefined;
}

export function getLevelSlug(value: string): LevelSlug | undefined {
  return ["a1", "a2", "b1", "b2", "c1", "c2"].includes(value) ? value as LevelSlug : undefined;
}
