"use client";

import { useState } from "react";
import Link from "next/link";
import { useInterfaceLanguage } from "@/app/components/interface-language";

const languages = [
  { id: "english", name: "English", flag: "🇬🇧", lessons: 284, color: "blue", phrase: "A little every day." },
  { id: "french", name: "French", flag: "🇫🇷", lessons: 216, color: "rose", phrase: "La vie est belle." },
  { id: "spanish", name: "Spanish", flag: "🇪🇸", lessons: 248, color: "gold", phrase: "Vive el momento." },
  { id: "italian", name: "Italian", flag: "🇮🇹", lessons: 192, color: "sage", phrase: "Dolce far niente." },
  { id: "german", name: "German", flag: "🇩🇪", lessons: 203, color: "lilac", phrase: "Wort für Wort." },
] as const;

const categories = [
  { id: "grammar", icon: "book", color: "category-blue" },
  { id: "vocabulary", icon: "spark", color: "category-peach" },
  { id: "listening", icon: "headphones", color: "category-yellow" },
  { id: "reading", icon: "read", color: "category-green" },
  { id: "writing", icon: "pen", color: "category-lilac" },
  { id: "speaking", icon: "chat", color: "category-pink" },
  { id: "tests", icon: "check", color: "category-sand" },
  { id: "exams", icon: "award", color: "category-sky" },
] as const;

const messages = {
  en: {
    navHome: "Home", navLanguages: "Explore languages", navCourses: "Courses", navPractice: "Practice", navAbout: "About us",
    search: "Search languages", heroKicker: "A little language goes a long way", heroTitle: "DISCOVER A NEW LANGUAGE",
    languageCount: "languages", levelNames: ["A1 Beginner", "A2 Elementary", "B1 Intermediate", "B2 Upper intermediate", "C1 Advanced", "C2 Proficiency"],
    learningLabel: "Learning", interfaceLabel: "Interface", separateChoices: "These are two independent choices.",
    heroCaption: "A desk full of possibility", communityProof: "curious minds learning together",
    dashboardSpace: "your learning space", dashboardDate: "A LITTLE PROGRESS, EVERY DAY",
    footerLanguagesTitle: "Five ways to say hello", footerCuriosity: "Curiosity looks good on you.", backToTop: "Back to top",
    heroGreeting: "HELLO", heroGreetingAside: "there!", wordMeaning: "hello", heroAudioNote: "play · repeat · enjoy",
    examPaperLabel: "YOUR NEXT CHAPTER", examPaperTitle: "A goal|in sight.", examSeal: "YOU GOT THIS",
    examScribble: "one step|at a time", curiositySticker: "stay|curious", aboutCredit: "A note to your future self",
    heroBody: "Learn languages, explore cultures and build confidence one lesson at a time.", start: "Start learning",
    heroNote: "A fresh way to find your words.", marquee: ["LEARN", "SPEAK", "EXPLORE", "PRACTICE", "CONNECT", "DISCOVER"],
    languageKicker: "Your next chapter starts here", languagesTitle: "Five languages. A whole new world.",
    languagesBody: "Pick a language to explore. Every path is made for real life, from your very first hello to the finer details.",
    levels: "CEFR levels", lessons: "lessons", explore: "Explore language", allLevels: "A1 — C2",
    categoryKicker: "Find your way in", categoryTitle: "A good lesson for every kind of learner.",
    categoryBody: "Build a well-rounded routine, or follow the curiosity that brought you here.",
    categories: ["Grammar", "Vocabulary", "Listening", "Reading", "Writing", "Speaking", "Tests", "Exam preparation"],
    categoryDescriptions: [
      "Make the patterns feel natural.", "Find the right word, right when you need it.", "Tune your ear to everyday conversation.",
      "Stories, articles and ideas worth sharing.", "Put your thoughts into words.", "Find your voice, without the pressure.",
      "A little check-in to see how far you’ve come.", "Thoughtful preparation for the big day.",
    ],
    viewPractice: "Try a practice", learningKicker: "Your little corner of progress", learningTitle: "Keep your momentum.",
    dashboardLabel: "A look inside your learning space", demo: "Sample dashboard · local preview",
    currentCourse: "CURRENT COURSE", completed: "LESSONS COMPLETED", streak: "DAY STREAK",
    weekly: "Your week, at a glance", weekProgress: "of your weekly goal", recentWords: "A few new words",
    wordOne: "the little things", wordTwo: "to find your way", wordThree: "a quiet morning",
    continue: "Continue learning", level: "A2 · Elementary", nextLesson: "Next up: Finding your rhythm",
    examKicker: "A goal worth preparing for", examTitle: "Make room for your next big thing.",
    examBody: "Build confidence for the exams that open doors. Explore focused, level-based practice for the certificate you’re working towards.",
    viewExams: "Explore exam preparation", examLabel: "International exam paths",
    exams: ["Cambridge · IELTS · TOEFL", "DELF · DALF · TCF", "DELE · SIELE", "CILS · CELI · PLIDA", "Goethe · telc · TestDaF"],
    aboutKicker: "Learning, with a little more life in it", aboutTitle: "Language is more than words. It’s a way in.",
    aboutBody: "We believe the best lessons feel like opening a window: a new way to see, listen and connect. So we pair thoughtful learning paths with the things that make a language come alive — its people, places and everyday moments.",
    aboutSmall: "A little curiosity can take you anywhere.", aboutButton: "Find your first lesson",
    footerText: "A thoughtful place to find your words.", footerExplore: "Explore", footerFollow: "Say hello",
    footerRights: "Made for curious minds, everywhere.", notifications: "You’re all caught up", notificationBody: "Your next little win is only one lesson away.",
    profile: "Your learning preview", profileBody: "This is a sample space. Sign-in and saved progress will be added in a future release.",
    close: "Close", searchPlaceholder: "Search a language…", noResults: "No languages found. Try another search.",
    lessonTitle: "A little lesson, just for you", lessonBody: "Today’s prompt: introduce yourself and share one thing you love about your day.",
    lessonPrompt: "Try saying: “I’m learning a new language because…”", gotIt: "Lovely, got it",
    categorySelected: "A small step makes a big difference.", words: ["bonjour", "despacito", "Fernweh"],
    footerLanguage: "Choose your interface language",
  },
  fr: {
    navHome: "Accueil", navLanguages: "Explorer les langues", navCourses: "Cours", navPractice: "Pratique", navAbout: "À propos",
    search: "Rechercher une langue", heroKicker: "Un peu de langue ouvre bien des portes", heroTitle: "DÉCOUVREZ UNE NOUVELLE LANGUE",
    languageCount: "langues", levelNames: ["A1 Débutant", "A2 Élémentaire", "B1 Intermédiaire", "B2 Intermédiaire avancé", "C1 Avancé", "C2 Maîtrise"],
    learningLabel: "Apprentissage", interfaceLabel: "Interface", separateChoices: "Deux choix indépendants.",
    heroCaption: "Un bureau plein de possibilités", communityProof: "esprits curieux qui apprennent ensemble",
    dashboardSpace: "votre espace d’apprentissage", dashboardDate: "UN PETIT PROGRÈS CHAQUE JOUR",
    footerLanguagesTitle: "Cinq façons de dire bonjour", footerCuriosity: "La curiosité vous va si bien.", backToTop: "Retour en haut",
    heroGreeting: "BONJOUR", heroGreetingAside: "à vous !", wordMeaning: "bonjour", heroAudioNote: "écouter · répéter · savourer",
    examPaperLabel: "VOTRE PROCHAIN CHAPITRE", examPaperTitle: "Un objectif|en vue.", examSeal: "VOUS POUVEZ",
    examScribble: "un pas|à la fois", curiositySticker: "restez|curieux", aboutCredit: "Un mot pour votre futur vous",
    heroBody: "Apprenez, explorez les cultures et prenez confiance, une leçon à la fois.", start: "Commencer",
    heroNote: "Une nouvelle façon de trouver vos mots.", marquee: ["APPRENDRE", "PARLER", "EXPLORER", "PRATIQUER", "ÉCHANGER", "DÉCOUVRIR"],
    languageKicker: "Votre prochain chapitre commence ici", languagesTitle: "Cinq langues. Un monde nouveau.",
    languagesBody: "Choisissez une langue à explorer. Des parcours pensés pour la vie réelle, du premier bonjour aux nuances les plus fines.",
    levels: "Niveaux du CECR", lessons: "leçons", explore: "Explorer", allLevels: "A1 — C2",
    categoryKicker: "Trouvez votre voie", categoryTitle: "Une bonne leçon pour chaque curiosité.",
    categoryBody: "Créez une routine complète ou suivez simplement votre curiosité.",
    categories: ["Grammaire", "Vocabulaire", "Écoute", "Lecture", "Écriture", "Expression orale", "Tests", "Préparation aux examens"],
    categoryDescriptions: [
      "Comprendre les structures naturellement.", "Trouver le bon mot au bon moment.", "Habituer votre oreille aux conversations.",
      "Des histoires et des idées à partager.", "Exprimer vos pensées par écrit.", "Trouver votre voix sans pression.",
      "Faire le point sur vos progrès.", "Une préparation sereine pour le grand jour.",
    ],
    viewPractice: "Découvrir la pratique", learningKicker: "Votre espace de progression", learningTitle: "Gardez votre élan.",
    dashboardLabel: "Un aperçu de votre espace d’apprentissage", demo: "Aperçu de démonstration · local",
    currentCourse: "COURS EN COURS", completed: "LEÇONS TERMINÉES", streak: "JOURS DE SUITE",
    weekly: "Votre semaine en un coup d’œil", weekProgress: "de votre objectif hebdomadaire", recentWords: "Quelques nouveaux mots",
    wordOne: "les petits plaisirs", wordTwo: "trouver son chemin", wordThree: "un matin tranquille",
    continue: "Continuer", level: "A2 · Élémentaire", nextLesson: "Ensuite : trouver votre rythme",
    examKicker: "Un objectif qui se prépare", examTitle: "Ouvrez la porte à vos projets.",
    examBody: "Préparez-vous aux examens qui ouvrent des horizons, avec des exercices adaptés à votre niveau et à votre certificat.",
    viewExams: "Explorer la préparation", examLabel: "Préparer un examen international",
    exams: ["Cambridge · IELTS · TOEFL", "DELF · DALF · TCF", "DELE · SIELE", "CILS · CELI · PLIDA", "Goethe · telc · TestDaF"],
    aboutKicker: "Apprendre avec un peu plus de vie", aboutTitle: "Une langue, c’est bien plus que des mots.",
    aboutBody: "Nous pensons qu’une bonne leçon ressemble à une fenêtre ouverte : une nouvelle façon de voir, d’écouter et de créer des liens. Nous réunissons des parcours réfléchis et tout ce qui fait vivre une langue : ses habitants, ses lieux et ses petits moments.",
    aboutSmall: "Un peu de curiosité peut vous emmener partout.", aboutButton: "Trouver ma première leçon",
    footerText: "Un lieu inspirant pour trouver vos mots.", footerExplore: "Explorer", footerFollow: "Nous suivre",
    footerRights: "Fait pour les esprits curieux, partout.", notifications: "Vous êtes à jour", notificationBody: "Votre prochaine petite victoire est à une leçon d’ici.",
    profile: "Votre aperçu d’apprentissage", profileBody: "Ceci est un aperçu. La connexion et l’enregistrement des progrès arriveront plus tard.",
    close: "Fermer", searchPlaceholder: "Rechercher une langue…", noResults: "Aucune langue trouvée. Essayez un autre terme.",
    lessonTitle: "Une petite leçon rien que pour vous", lessonBody: "À vous de jouer : présentez-vous et partagez une chose que vous aimez dans votre journée.",
    lessonPrompt: "Essayez : « J’apprends une langue parce que… »", gotIt: "C’est noté",
    categorySelected: "Un petit pas peut tout changer.", words: ["bonjour", "despacito", "Fernweh"],
    footerLanguage: "Choisir la langue de l’interface",
  },
  es: {
    navHome: "Inicio", navLanguages: "Explorar idiomas", navCourses: "Cursos", navPractice: "Práctica", navAbout: "Nosotros",
    search: "Buscar idiomas", heroKicker: "Un poco de idioma te lleva muy lejos", heroTitle: "DESCUBRE UN NUEVO IDIOMA",
    languageCount: "idiomas", levelNames: ["A1 Principiante", "A2 Elemental", "B1 Intermedio", "B2 Intermedio alto", "C1 Avanzado", "C2 Dominio"],
    learningLabel: "Aprendizaje", interfaceLabel: "Interfaz", separateChoices: "Son dos opciones independientes.",
    heroCaption: "Un escritorio lleno de posibilidades", communityProof: "mentes curiosas aprendiendo juntas",
    dashboardSpace: "tu espacio de aprendizaje", dashboardDate: "UN PEQUEÑO AVANCE CADA DÍA",
    footerLanguagesTitle: "Cinco formas de decir hola", footerCuriosity: "La curiosidad te sienta bien.", backToTop: "Volver arriba",
    heroGreeting: "HOLA", heroGreetingAside: "por aquí", wordMeaning: "hola", heroAudioNote: "escucha · repite · disfruta",
    examPaperLabel: "TU PRÓXIMO CAPÍTULO", examPaperTitle: "Un objetivo|a la vista.", examSeal: "TÚ PUEDES",
    examScribble: "un paso|a la vez", curiositySticker: "sigue|curioso", aboutCredit: "Una nota para tu yo del futuro",
    heroBody: "Aprende idiomas, explora culturas y gana confianza, lección a lección.", start: "Empezar a aprender",
    heroNote: "Una forma nueva de encontrar tus palabras.", marquee: ["APRENDER", "HABLAR", "EXPLORAR", "PRACTICAR", "CONECTAR", "DESCUBRIR"],
    languageKicker: "Tu próximo capítulo empieza aquí", languagesTitle: "Cinco idiomas. Un mundo nuevo.",
    languagesBody: "Elige un idioma y explóralo. Cada recorrido está pensado para la vida real, desde el primer hola hasta los pequeños matices.",
    levels: "Niveles MCER", lessons: "lecciones", explore: "Explorar idioma", allLevels: "A1 — C2",
    categoryKicker: "Encuentra tu camino", categoryTitle: "Una buena lección para cada curiosidad.",
    categoryBody: "Crea una rutina completa o sigue la curiosidad que te trajo hasta aquí.",
    categories: ["Gramática", "Vocabulario", "Escucha", "Lectura", "Escritura", "Expresión oral", "Pruebas", "Preparación de exámenes"],
    categoryDescriptions: [
      "Descubre patrones que se sienten naturales.", "Encuentra la palabra precisa en cada momento.", "Afina el oído con conversaciones reales.",
      "Historias, artículos e ideas para compartir.", "Expresa tus ideas con palabras.", "Encuentra tu voz, sin presión.",
      "Comprueba cuánto has avanzado.", "Prepárate con calma para el gran día.",
    ],
    viewPractice: "Probar una práctica", learningKicker: "Tu rincón de progreso", learningTitle: "Sigue con ese impulso.",
    dashboardLabel: "Un vistazo a tu espacio de aprendizaje", demo: "Panel de muestra · vista local",
    currentCourse: "CURSO ACTUAL", completed: "LECCIONES COMPLETADAS", streak: "DÍAS SEGUIDOS",
    weekly: "Tu semana de un vistazo", weekProgress: "de tu objetivo semanal", recentWords: "Algunas palabras nuevas",
    wordOne: "los pequeños detalles", wordTwo: "encontrar el camino", wordThree: "una mañana tranquila",
    continue: "Seguir aprendiendo", level: "A2 · Elemental", nextLesson: "Siguiente: encontrar tu ritmo",
    examKicker: "Un objetivo que merece prepararse", examTitle: "Haz espacio para lo que viene.",
    examBody: "Gana confianza para los exámenes que abren puertas. Explora prácticas por nivel para el certificado que te propones.",
    viewExams: "Explorar preparación", examLabel: "Preparación de exámenes internacionales",
    exams: ["Cambridge · IELTS · TOEFL", "DELF · DALF · TCF", "DELE · SIELE", "CILS · CELI · PLIDA", "Goethe · telc · TestDaF"],
    aboutKicker: "Aprender con un poco más de vida", aboutTitle: "Un idioma es mucho más que palabras.",
    aboutBody: "Creemos que una buena lección es como abrir una ventana: una nueva forma de ver, escuchar y conectar. Combinamos recorridos cuidados con todo lo que da vida a un idioma: sus personas, lugares y momentos cotidianos.",
    aboutSmall: "Un poco de curiosidad puede llevarte a cualquier lugar.", aboutButton: "Buscar mi primera lección",
    footerText: "Un lugar especial para encontrar tus palabras.", footerExplore: "Explorar", footerFollow: "Salúdanos",
    footerRights: "Hecho para mentes curiosas, en todas partes.", notifications: "Todo al día", notificationBody: "Tu próximo pequeño logro está a una lección.",
    profile: "Tu vista de aprendizaje", profileBody: "Este es un espacio de muestra. El inicio de sesión y el progreso guardado llegarán más adelante.",
    close: "Cerrar", searchPlaceholder: "Busca un idioma…", noResults: "No encontramos idiomas. Prueba otra búsqueda.",
    lessonTitle: "Una pequeña lección para ti", lessonBody: "Reto de hoy: preséntate y comparte algo que te guste de tu día.",
    lessonPrompt: "Prueba: «Estoy aprendiendo un idioma porque…»", gotIt: "¡Entendido!",
    categorySelected: "Un pequeño paso puede marcar la diferencia.", words: ["bonjour", "despacito", "Fernweh"],
    footerLanguage: "Elige el idioma de la interfaz",
  },
  it: {
    navHome: "Home", navLanguages: "Esplora le lingue", navCourses: "Corsi", navPractice: "Esercizi", navAbout: "Chi siamo",
    search: "Cerca lingue", heroKicker: "Un po’ di lingua ti porta lontano", heroTitle: "SCOPRI UNA NUOVA LINGUA",
    languageCount: "lingue", levelNames: ["A1 Principiante", "A2 Elementare", "B1 Intermedio", "B2 Intermedio superiore", "C1 Avanzato", "C2 Padronanza"],
    learningLabel: "Apprendimento", interfaceLabel: "Interfaccia", separateChoices: "Sono due scelte indipendenti.",
    heroCaption: "Una scrivania piena di possibilità", communityProof: "menti curiose che imparano insieme",
    dashboardSpace: "il tuo spazio di apprendimento", dashboardDate: "UN PICCOLO PASSO OGNI GIORNO",
    footerLanguagesTitle: "Cinque modi per dire ciao", footerCuriosity: "La curiosità ti dona.", backToTop: "Torna su",
    heroGreeting: "CIAO", heroGreetingAside: "a te!", wordMeaning: "ciao", heroAudioNote: "ascolta · ripeti · divertiti",
    examPaperLabel: "IL TUO PROSSIMO CAPITOLO", examPaperTitle: "Un obiettivo|in vista.", examSeal: "CE LA FAI",
    examScribble: "un passo|alla volta", curiositySticker: "resta|curioso", aboutCredit: "Un biglietto per il tuo futuro",
    heroBody: "Impara, esplora culture e acquista fiducia, una lezione alla volta.", start: "Inizia a imparare",
    heroNote: "Un nuovo modo per trovare le parole.", marquee: ["IMPARA", "PARLA", "ESPLORA", "ESERCITATI", "CONNETTITI", "SCOPRI"],
    languageKicker: "Il tuo prossimo capitolo inizia qui", languagesTitle: "Cinque lingue. Un mondo nuovo.",
    languagesBody: "Scegli una lingua da esplorare. Percorsi per la vita di tutti i giorni, dal primo ciao alle sfumature più sottili.",
    levels: "Livelli QCER", lessons: "lezioni", explore: "Esplora la lingua", allLevels: "A1 — C2",
    categoryKicker: "Trova la tua strada", categoryTitle: "Una lezione per ogni curiosità.",
    categoryBody: "Crea una routine completa o segui la curiosità che ti ha portato qui.",
    categories: ["Grammatica", "Vocabolario", "Ascolto", "Lettura", "Scrittura", "Conversazione", "Test", "Preparazione esami"],
    categoryDescriptions: [
      "Riconosci gli schemi con naturalezza.", "La parola giusta, proprio quando serve.", "Allena l’orecchio alle conversazioni quotidiane.",
      "Storie, articoli e idee da condividere.", "Metti i tuoi pensieri nero su bianco.", "Trova la tua voce, senza pressione.",
      "Scopri quanta strada hai fatto.", "Preparati con calma al grande giorno.",
    ],
    viewPractice: "Prova un esercizio", learningKicker: "Il tuo spazio dei progressi", learningTitle: "Continua così.",
    dashboardLabel: "Uno sguardo al tuo spazio di apprendimento", demo: "Anteprima · dati locali",
    currentCourse: "CORSO ATTUALE", completed: "LEZIONI COMPLETATE", streak: "GIORNI DI FILA",
    weekly: "La tua settimana in breve", weekProgress: "del tuo obiettivo settimanale", recentWords: "Qualche parola nuova",
    wordOne: "le piccole cose", wordTwo: "trovare la strada", wordThree: "una mattina tranquilla",
    continue: "Continua a imparare", level: "A2 · Elementare", nextLesson: "Prossimo: trova il tuo ritmo",
    examKicker: "Un obiettivo da preparare", examTitle: "Fai spazio ai tuoi progetti.",
    examBody: "Preparati agli esami che aprono nuove porte. Esplora esercizi pensati per il tuo livello e il certificato che desideri.",
    viewExams: "Esplora la preparazione", examLabel: "Percorsi per gli esami internazionali",
    exams: ["Cambridge · IELTS · TOEFL", "DELF · DALF · TCF", "DELE · SIELE", "CILS · CELI · PLIDA", "Goethe · telc · TestDaF"],
    aboutKicker: "Imparare, con un po’ più di vita", aboutTitle: "Una lingua è molto più di parole.",
    aboutBody: "Crediamo che una bella lezione sia come aprire una finestra: un nuovo modo di vedere, ascoltare e connettersi. Uniamo percorsi curati a tutto ciò che fa vivere una lingua: le persone, i luoghi e i momenti quotidiani.",
    aboutSmall: "Un po’ di curiosità può portarti ovunque.", aboutButton: "Trova la tua prima lezione",
    footerText: "Un posto speciale per trovare le parole.", footerExplore: "Esplora", footerFollow: "Saluta",
    footerRights: "Per menti curiose, ovunque.", notifications: "È tutto aggiornato", notificationBody: "Il tuo prossimo piccolo traguardo è a una lezione da qui.",
    profile: "La tua anteprima di apprendimento", profileBody: "Questo è uno spazio dimostrativo. Accesso e progressi salvati arriveranno in futuro.",
    close: "Chiudi", searchPlaceholder: "Cerca una lingua…", noResults: "Nessuna lingua trovata. Prova un’altra ricerca.",
    lessonTitle: "Una piccola lezione per te", lessonBody: "La sfida di oggi: presentati e racconta una cosa che ami della tua giornata.",
    lessonPrompt: "Prova a dire: «Sto imparando una lingua perché…»", gotIt: "Perfetto",
    categorySelected: "Un piccolo passo può fare la differenza.", words: ["bonjour", "despacito", "Fernweh"],
    footerLanguage: "Scegli la lingua dell’interfaccia",
  },
  de: {
    navHome: "Start", navLanguages: "Sprachen entdecken", navCourses: "Kurse", navPractice: "Üben", navAbout: "Über uns",
    search: "Sprachen suchen", heroKicker: "Eine Sprache bringt dich weit", heroTitle: "ENTDECKE EINE NEUE SPRACHE",
    languageCount: "Sprachen", levelNames: ["A1 Anfänger", "A2 Grundstufe", "B1 Mittelstufe", "B2 Obere Mittelstufe", "C1 Fortgeschritten", "C2 Kompetent"],
    learningLabel: "Lernen", interfaceLabel: "Oberfläche", separateChoices: "Das sind zwei unabhängige Einstellungen.",
    heroCaption: "Ein Schreibtisch voller Möglichkeiten", communityProof: "neugierige Köpfe lernen gemeinsam",
    dashboardSpace: "dein Lernbereich", dashboardDate: "JEDEN TAG EIN KLEINER FORTSCHRITT",
    footerLanguagesTitle: "Fünf Arten, Hallo zu sagen", footerCuriosity: "Neugier steht dir gut.", backToTop: "Nach oben",
    heroGreeting: "HALLO", heroGreetingAside: "du!", wordMeaning: "hallo", heroAudioNote: "hören · wiederholen · genießen",
    examPaperLabel: "DEIN NÄCHSTES KAPITEL", examPaperTitle: "Ein Ziel|vor Augen.", examSeal: "DU SCHAFFST DAS",
    examScribble: "ein Schritt|nach dem anderen", curiositySticker: "bleib|neugierig", aboutCredit: "Eine Notiz an dein Zukunfts-Ich",
    heroBody: "Lerne Sprachen, entdecke Kulturen und gewinne Selbstvertrauen – Lektion für Lektion.", start: "Jetzt starten",
    heroNote: "Ein neuer Weg, deine Worte zu finden.", marquee: ["LERNEN", "SPRECHEN", "ENTDECKEN", "ÜBEN", "VERBINDEN", "ERLEBEN"],
    languageKicker: "Dein nächstes Kapitel beginnt hier", languagesTitle: "Fünf Sprachen. Eine neue Welt.",
    languagesBody: "Wähle eine Sprache und entdecke sie. Für das echte Leben – vom ersten Hallo bis zu den feinen Nuancen.",
    levels: "GER-Niveaus", lessons: "Lektionen", explore: "Sprache entdecken", allLevels: "A1 — C2",
    categoryKicker: "Finde deinen Weg", categoryTitle: "Die richtige Lektion für jede Neugier.",
    categoryBody: "Finde deine Routine oder folge einfach deiner Neugier.",
    categories: ["Grammatik", "Wortschatz", "Hören", "Lesen", "Schreiben", "Sprechen", "Tests", "Prüfungsvorbereitung"],
    categoryDescriptions: [
      "Muster ganz natürlich verstehen.", "Das passende Wort im richtigen Moment.", "Höre dich in echte Gespräche ein.",
      "Geschichten, Artikel und Ideen zum Teilen.", "Bringe deine Gedanken zu Papier.", "Finde deine Stimme, ganz ohne Druck.",
      "Sieh, wie weit du schon gekommen bist.", "Gut vorbereitet in den großen Tag.",
    ],
    viewPractice: "Übung ausprobieren", learningKicker: "Dein kleiner Fortschrittsraum", learningTitle: "Bleib dran.",
    dashboardLabel: "Ein Einblick in deinen Lernbereich", demo: "Beispielansicht · lokal",
    currentCourse: "AKTUELLER KURS", completed: "ABGESCHLOSSENE LEKTIONEN", streak: "TAGE IN FOLGE",
    weekly: "Deine Woche im Überblick", weekProgress: "deines Wochenziels", recentWords: "Ein paar neue Wörter",
    wordOne: "die kleinen Dinge", wordTwo: "den Weg finden", wordThree: "ein ruhiger Morgen",
    continue: "Weiterlernen", level: "A2 · Grundstufe", nextLesson: "Als Nächstes: den Rhythmus finden",
    examKicker: "Ein Ziel, auf das es sich lohnt hinzuarbeiten", examTitle: "Mach Platz für deine nächsten Ziele.",
    examBody: "Gewinne Sicherheit für Prüfungen, die Türen öffnen. Entdecke Übungen für dein Niveau und dein Wunschzertifikat.",
    viewExams: "Prüfungsvorbereitung entdecken", examLabel: "Internationale Prüfungswege",
    exams: ["Cambridge · IELTS · TOEFL", "DELF · DALF · TCF", "DELE · SIELE", "CILS · CELI · PLIDA", "Goethe · telc · TestDaF"],
    aboutKicker: "Lernen mit etwas mehr Leben", aboutTitle: "Sprache ist mehr als Worte. Sie öffnet Türen.",
    aboutBody: "Wir finden: Die beste Lektion ist wie ein offenes Fenster – eine neue Art zu sehen, zu hören und sich zu verbinden. Darum verbinden wir durchdachte Lernwege mit allem, was Sprache lebendig macht: Menschen, Orte und kleine Alltagsmomente.",
    aboutSmall: "Ein wenig Neugier bringt dich überallhin.", aboutButton: "Erste Lektion finden",
    footerText: "Ein besonderer Ort, um Worte zu finden.", footerExplore: "Entdecken", footerFollow: "Sag Hallo",
    footerRights: "Für neugierige Köpfe, überall.", notifications: "Alles ist auf dem neuesten Stand", notificationBody: "Dein nächster kleiner Erfolg ist nur eine Lektion entfernt.",
    profile: "Deine Lernvorschau", profileBody: "Dies ist eine Beispielansicht. Anmeldung und gespeicherter Fortschritt folgen in einer späteren Version.",
    close: "Schließen", searchPlaceholder: "Sprache suchen…", noResults: "Keine Sprache gefunden. Versuche es noch einmal.",
    lessonTitle: "Eine kleine Lektion nur für dich", lessonBody: "Die heutige Aufgabe: Stell dich vor und erzähle, was du an deinem Tag besonders magst.",
    lessonPrompt: "Sag doch: „Ich lerne eine neue Sprache, weil …“", gotIt: "Alles klar",
    categorySelected: "Ein kleiner Schritt macht einen großen Unterschied.", words: ["bonjour", "despacito", "Fernweh"],
    footerLanguage: "Sprache der Benutzeroberfläche",
  },
} as const;

type Locale = keyof typeof messages;
type IconName = "spark" | "search" | "bell" | "user" | "arrow" | "book" | "headphones" | "read" | "pen" | "chat" | "check" | "award" | "close" | "menu" | "play";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths: Record<IconName, React.ReactNode> = {
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 21c0-4 2.8-6 7-6s7 2 7 6" /></>,
    arrow: <><path d="M4.5 12h14" /><path d="m13 5.5 6.5 6.5-6.5 6.5" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h7M8 10h5" /></>,
    headphones: <><path d="M3 13v-1a9 9 0 0 1 18 0v1" /><rect x="3" y="12" width="4" height="8" rx="2" /><rect x="17" y="12" width="4" height="8" rx="2" /><path d="M21 19c0 1.1-.9 2-2 2h-3" /></>,
    read: <><path d="M3 5.5C6.5 4 9.5 4.4 12 6v14c-2.5-1.6-5.5-2-9-0.5v-14ZM21 5.5C17.5 4 14.5 4.4 12 6v14c2.5-1.6 5.5-2 9-0.5v-14Z" /></>,
    pen: <><path d="m4 20 4.5-1 10.8-10.8a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z" /><path d="m14.8 6.2 3 3" /></>,
    chat: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.5-.8L4 20l1.5-4A7.5 7.5 0 1 1 20 11.5Z" /><path d="M9 11.5h.01M12.5 11.5h.01M16 11.5h.01" /></>,
    check: <><path d="M12 3 20 6v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" /><path d="m8.5 12 2.3 2.3 4.8-5" /></>,
    award: <><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1 7 4.5-2.5 4.5 2.5-1-7M9.5 9l1.6 1.6L14.5 7" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    play: <><path d="m9 6 10 6-10 6V6Z" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function LanguageSelect({ locale, onChange, label, className = "" }: { locale: Locale; onChange: (locale: Locale) => void; label: string; className?: string }) {
  const labels: Record<Locale, string> = { en: "EN", fr: "FR", es: "ES", it: "IT", de: "DE" };
  return (
    <label className={`language-select ${className}`}>
      <Icon name="spark" size={16} />
      <span className="sr-only">{label}</span>
      <select value={locale} onChange={(event) => onChange(event.target.value as Locale)} aria-label={label}>
        {Object.keys(labels).map((code) => <option key={code} value={code}>{labels[code as Locale]}</option>)}
      </select>
    </label>
  );
}

export default function Home() {
  const { locale, setLocale } = useInterfaceLanguage();
  const currentLanguage = languages[0];
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [panel, setPanel] = useState<"notifications" | "profile" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lessonOpen, setLessonOpen] = useState(false);
  const t = messages[locale];

  const filteredLanguages = languages.filter((language) =>
    `${language.name} ${language.phrase}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const navLinks = [
    { href: "#home", label: t.navHome },
    { href: "/languages", label: t.navLanguages },
    { href: "#courses", label: t.navCourses },
    { href: "#practice", label: t.navPractice },
    { href: "#about", label: t.navAbout },
  ];

  return (
    <main>
      <header className="site-header" id="home">
        <div className="nav-shell">
          <a className="brand" href="#home" aria-label="Morrow home">
            <span className="brand-mark"><Icon name="spark" size={22} /></span>
            <span>morrow<span className="brand-period">.</span></span>
          </a>
          <nav className={`main-nav ${mobileMenuOpen ? "is-open" : ""}`} aria-label="Main navigation">
            {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>)}
          </nav>
          <div className="nav-actions">
            <button className={`icon-button search-trigger ${searchOpen ? "active" : ""}`} aria-label={t.search} onClick={() => { setSearchOpen(!searchOpen); setPanel(null); }}>
              <Icon name={searchOpen ? "close" : "search"} size={19} />
            </button>
            <button className={`icon-button notification-trigger ${panel === "notifications" ? "active" : ""}`} aria-label={t.notifications} onClick={() => { setPanel(panel === "notifications" ? null : "notifications"); setSearchOpen(false); }}>
              <Icon name="bell" size={19} /><span className="notification-dot" />
            </button>
            <button className={`profile-button ${panel === "profile" ? "active" : ""}`} aria-label={t.profile} onClick={() => { setPanel(panel === "profile" ? null : "profile"); setSearchOpen(false); }}>
              <span className="avatar">M</span><span className="profile-chevron">⌄</span>
            </button>
            <LanguageSelect locale={locale} onChange={setLocale} label={t.footerLanguage} />
            <button className="icon-button mobile-menu-button" aria-label="Toggle navigation" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "close" : "menu"} size={21} />
            </button>
          </div>
          {searchOpen && (
            <div className="header-popover search-popover">
              <label htmlFor="language-search">{t.search}</label>
              <div className="search-field"><Icon name="search" size={18} /><input id="language-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} /></div>
              <p>{filteredLanguages.length} {t.languageCount} · {filteredLanguages.map((language) => language.name).join(" · ") || t.noResults}</p>
            </div>
          )}
          {panel && (
            <div className="header-popover notice-popover">
              <span className="popover-icon"><Icon name={panel === "notifications" ? "bell" : "user"} size={18} /></span>
              <div><strong>{panel === "notifications" ? t.notifications : t.profile}</strong><p>{panel === "notifications" ? t.notificationBody : t.profileBody}</p></div>
              <button className="popover-close" aria-label={t.close} onClick={() => setPanel(null)}><Icon name="close" size={16} /></button>
            </div>
          )}
        </div>
      </header>

      <section className="hero-section page-width">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-star">✳</span>{t.heroKicker}</div>
          <h1>{t.heroTitle.split(" ").map((word, index) => <span key={`${word}-${index}`}>{word} </span>)}</h1>
          <p className="hero-description">{t.heroBody}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#languages">{t.start}<Icon name="arrow" size={18} /></a>
            <span className="hero-note"><span className="note-spark">✳</span>{t.heroNote}</span>
          </div>
          <div className="hero-footnote"><span className="avatar-stack"><i>J</i><i>A</i><i>M</i></span><span><b>12,000+</b> {t.communityProof}</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <div className="photo-caption"><span className="photo-caption-dot" /> {t.heroCaption}</div>
          </div>
          <div className="hero-books" aria-hidden="true" />
          <div className="hero-float-card float-word"><span className="word-scribble">bonjour</span><span className="word-meaning">/ bɔ̃.ʒuʁ / · {t.wordMeaning}</span></div>
          <div className="hero-audio"><span><Icon name="headphones" size={18} /></span><small>{t.categories[2].toUpperCase()}<br /><b>{t.heroAudioNote}</b></small></div>
          <div className="hero-float-card float-sticker"><span>✿</span><small>{t.aboutSmall}</small></div>
          <div className="hero-sticker">{t.heroGreeting}<br /><span>{t.heroGreetingAside}</span></div>
          <span className="hero-orbit orbit-one">✳</span><span className="hero-orbit orbit-two">✦</span>
          <div className="visual-index">01 <span /> 05</div>
        </div>
      </section>

      <section className="marquee-band" aria-label={t.marquee.join(", ")}>
        <div className="marquee-track">{[0, 1, 2, 3].map((repeat) => <div className="marquee-group" key={repeat} aria-hidden={repeat > 0}><span>{t.marquee.join("  ✳  ")}</span><b>✳</b></div>)}</div>
      </section>

      <section className="section-block languages-section page-width" id="languages">
        <div className="section-heading">
          <div><div className="eyebrow">{t.languageKicker}</div><h2>{t.languagesTitle}</h2></div>
          <p>{t.languagesBody}</p>
        </div>
        <div className="language-grid">
          {filteredLanguages.map((language, index) => (
            <Link key={language.id} href={`/languages/${language.id}`} className={`language-card ${language.color}`} aria-label={`${t.explore} ${language.name}`}>
              <span className="language-card-top"><span className="flag-illustration">{language.flag}</span><span className="card-index">0{index + 1}</span></span>
              <span className="language-phrase">{language.phrase}</span>
              <span className="language-name">{language.name}<Icon name="arrow" size={17} /></span>
              <span className="language-description">{t.levels} <b>{t.allLevels}</b></span>
              <span className="language-card-bottom"><span>{language.lessons} {t.lessons}</span><span className="card-arrow"><Icon name="arrow" size={16} /></span></span>
              <span className="card-decoration" aria-hidden="true">✳</span>
            </Link>
          ))}
          {filteredLanguages.length === 0 && <p className="empty-search">{t.noResults}</p>}
        </div>
        <div className="study-language-note"><span className="note-dot" /> <span>{t.learningLabel} <b>{currentLanguage.name}</b></span><span className="note-divider">·</span><span>{t.interfaceLabel} <b>{locale.toUpperCase()}</b></span><span className="note-separation">{t.separateChoices}</span></div>
        <div className="cefr-strip" aria-label={t.levels}>
          <span className="cefr-caption">{t.levels}</span>
          {t.levelNames.map((level) => <span className="cefr-level" key={level}><b>{level.slice(0, 2)}</b>{level.slice(3)}</span>)}
        </div>
      </section>

      <section className="category-section page-width" id="courses">
        <div className="section-heading category-heading">
          <div><div className="eyebrow">{t.categoryKicker}</div><h2>{t.categoryTitle}</h2></div>
          <p>{t.categoryBody}</p>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/languages/${currentLanguage.id}/a2/${category.id === "exams" ? "exam-preparation" : category.id}`}
              className={`category-card ${category.color}`}
            >
              <span className="category-card-icon"><Icon name={category.icon} size={22} /></span>
              <span className="category-card-number">0{index + 1}</span>
              <span className="category-name">{t.categories[index]}</span>
              <span className="category-description">{t.categoryDescriptions[index]}</span>
              <span className="category-link"><Icon name="arrow" size={17} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="practice-section page-width" id="practice">
        <div className="practice-copy">
          <div className="eyebrow">{t.learningKicker}</div>
          <h2>{t.learningTitle}</h2>
          <p>{t.dashboardLabel}</p>
          <button className="button button-dark" onClick={() => setLessonOpen(true)}>{t.continue}<Icon name="arrow" size={18} /></button>
          <span className="demo-caption"><span className="demo-dot" />{t.demo}</span>
        </div>
        <div className="dashboard-preview">
          <div className="dashboard-top"><div className="dashboard-brand"><span className="mini-brand-mark">✳</span> {t.dashboardSpace}</div><span className="dashboard-date">{t.dashboardDate}</span><button aria-label={t.notifications} className="dashboard-more" onClick={() => setPanel("notifications")}>···</button></div>
          <div className="dashboard-greeting"><div><span className="dashboard-overline">{t.currentCourse}</span><h3>{currentLanguage.flag} {currentLanguage.name}</h3><span className="level-pill">{t.level}</span></div><div className="progress-ring"><span>68<small>%</small></span></div></div>
          <div className="dashboard-stats"><div><strong>18</strong><span>{t.completed}</span></div><div><strong>7 <small>✳</small></strong><span>{t.streak}</span></div><div><strong>04<span>/05</span></strong><span>{t.weekly}</span></div></div>
          <div className="weekly-progress"><div className="weekly-progress-head"><span>{t.weekly}</span><span>4 / 5</span></div><div className="progress-bar"><span /></div><small>{t.weekProgress}</small></div>
          <div className="dashboard-bottom">
            <div className="vocabulary-preview"><span className="dashboard-overline">{t.recentWords}</span><div className="word-row"><span>01</span><b>{t.wordOne}</b><span>✳</span></div><div className="word-row"><span>02</span><b>{t.wordTwo}</b><span>✳</span></div><div className="word-row"><span>03</span><b>{t.wordThree}</b><span>✳</span></div></div>
            <div className="next-lesson"><span className="next-lesson-icon"><Icon name="play" size={18} /></span><span className="dashboard-overline">{t.nextLesson}</span><span className="lesson-time">8 MIN <span>·</span> A2</span></div>
          </div>
        </div>
        <div className="practice-doodle">a little<br />progress <span>✳</span></div>
      </section>

      <section className="exam-section page-width" id="exams">
        <div className="exam-illustration">
          <div className="exam-paper"><span className="paper-label">{t.examPaperLabel}</span><span className="paper-title">{t.examPaperTitle.split("|").map((line) => <span key={line}>{line}</span>)}</span><span className="paper-stars">✳ ✦ ✳</span><span className="paper-seal">{t.examSeal}</span></div>
          <div className="exam-scribble"><span>{t.examScribble.split("|")[0]}<br />{t.examScribble.split("|")[1]}</span><span className="scribble-arrow">↗</span></div>
        </div>
        <div className="exam-copy">
          <div className="eyebrow">{t.examKicker}</div><h2>{t.examTitle}</h2><p>{t.examBody}</p>
          <div className="exam-list"><span>{t.examLabel}</span>{languages.map((language, index) => <div className="exam-row" key={language.id}><span>{language.flag} {language.name}</span><b>{t.exams[index]}</b></div>)}</div>
          <a className="text-link" href="#languages">{t.viewExams}<Icon name="arrow" size={18} /></a>
        </div>
      </section>

      <section className="about-section page-width" id="about">
        <div className="about-image-wrap"><div className="about-photo" /><span className="about-sticker">{t.curiositySticker.split("|")[0]}<br />{t.curiositySticker.split("|")[1]} <i>✳</i></span><span className="about-photo-credit">{t.aboutCredit}</span></div>
        <div className="about-copy"><div className="eyebrow">{t.aboutKicker}</div><h2>{t.aboutTitle}</h2><p>{t.aboutBody}</p><div className="about-bottom"><a className="button button-outline" href="#languages">{t.aboutButton}<Icon name="arrow" size={18} /></a><span>{t.aboutSmall}<b> — morrow</b></span></div></div>
      </section>

      <footer className="site-footer">
        <div className="footer-main page-width">
          <div className="footer-brand-block"><a className="brand footer-brand" href="#home"><span className="brand-mark"><Icon name="spark" size={22} /></span><span>morrow<span className="brand-period">.</span></span></a><p>{t.footerText}</p><div className="footer-socials"><a href="https://www.instagram.com/" aria-label="Instagram">ig</a><a href="https://www.pinterest.com/" aria-label="Pinterest">p</a><a href="https://www.youtube.com/" aria-label="YouTube">yt</a></div></div>
          <div className="footer-links"><span>{t.footerExplore}</span><Link href="/languages">{t.navLanguages}</Link><a href="#courses">{t.navCourses}</a><a href="#practice">{t.navPractice}</a><a href="#exams">{t.viewExams}</a></div>
          <div className="footer-languages"><span>{t.footerLanguagesTitle}</span><p>{languages.map((language) => language.name).join(" · ")}</p><label>{t.footerLanguage}</label><LanguageSelect locale={locale} onChange={setLocale} label={t.footerLanguage} /></div>
          <div className="footer-follow"><span>{t.footerFollow}</span><p>{t.footerCuriosity}</p><a href="mailto:hello@morrow.example">hello@morrow.example <Icon name="arrow" size={15} /></a></div>
        </div>
        <div className="footer-bottom page-width"><span>© 2026 morrow language studio</span><span>{t.footerRights}</span><a href="#home">{t.backToTop} ↑</a></div>
      </footer>

      {lessonOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLessonOpen(false); }}>
          <section className="lesson-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
            <button className="modal-close" aria-label={t.close} onClick={() => setLessonOpen(false)}><Icon name="close" size={20} /></button>
            <span className="modal-flower">✳</span><span className="eyebrow">{currentLanguage.flag} {currentLanguage.name} · {t.level}</span>
            <h2 id="lesson-title">{t.lessonTitle}</h2><p>{t.lessonBody}</p><div className="lesson-prompt">{t.lessonPrompt}</div>
            <button className="button button-dark modal-done" onClick={() => setLessonOpen(false)}>{t.gotIt}<Icon name="arrow" size={18} /></button>
            <small>{t.demo}</small>
          </section>
        </div>
      )}
    </main>
  );
}
