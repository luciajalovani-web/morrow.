export type SourceStatus = "consulted" | "access-limited" | "reference-for-review";

export type EducationalSource = {
  id: string;
  organization: string;
  title: string;
  url: string;
  status: SourceStatus;
  consultedOn: string;
  note: string;
};

export const educationalSources: EducationalSource[] = [
  {
    id: "cefr-companion-volume",
    organization: "Council of Europe",
    title: "Common European Framework of Reference for Languages: Learning, teaching, assessment — Companion volume",
    url: "https://rm.coe.int/common-european-framework-of-reference-for-languages-learning-teaching/16809ea0d4",
    status: "consulted",
    consultedOn: "2026-11-03",
    note: "The official Companion Volume PDF was retrievable; automated text extraction was limited. Use for broad A1–C2 progression only until descriptors are checked manually. Lesson objectives are original adaptations, not official descriptor quotations.",
  },
  {
    id: "cambridge-english-cefr",
    organization: "Cambridge English",
    title: "About the Common European Framework of Reference for Languages",
    url: "https://www.cambridgeenglish.org/exams-and-tests/cefr/",
    status: "consulted",
    consultedOn: "2026-11-03",
    note: "The page confirms the six-level A1–C2 scale and its role in comparing qualifications. It does not validate any individual lesson or vocabulary item.",
  },
  {
    id: "oxford-learners-dictionary",
    organization: "Oxford University Press",
    title: "Oxford Advanced Learner’s Dictionary",
    url: "https://www.oxfordlearnersdictionaries.com/",
    status: "reference-for-review",
    consultedOn: "2026-11-03",
    note: "The dictionary homepage was accessible, but entries were not checked word-by-word. Do not treat vocabulary data here as Oxford-verified.",
  },
  {
    id: "tv5monde-edu",
    organization: "TV5MONDE",
    title: "Apprendre le français",
    url: "https://www.tv5monde.com/",
    status: "consulted",
    consultedOn: "2026-11-03",
    note: "The official site describes video-based French learning exercises. It was consulted as a learning-resource reference, not as verification of specific vocabulary entries.",
  },
  {
    id: "telc-certificate-exams",
    organization: "telc gGmbH",
    title: "Certificate exams",
    url: "https://www.telc.net/en/language-examinations/certificate-exams/",
    status: "consulted",
    consultedOn: "2026-11-03",
    note: "The official certificate-exams section was accessible. Individual exam specifications and sample tasks have not been checked or reproduced.",
  },
  {
    id: "delf-fei",
    organization: "France Éducation international",
    title: "DELF tout public",
    url: "https://www.france-education-international.fr/diplome/delf-tout-public",
    status: "consulted",
    consultedOn: "2026-11-03",
    note: "Confirmed DELF A1–B2 alignment and that DELF examinations assess communicative skills.",
  },
  {
    id: "rae-grammar",
    organization: "Real Academia Española and Asociación de Academias de la Lengua Española",
    title: "Nueva gramática de la lengua española",
    url: "https://www.rae.es/gram%C3%A1tica/",
    status: "consulted",
    consultedOn: "2026-11-03",
    note: "Consulted the official overview describing the work's coverage of morphology, syntax, phonetics and language variation.",
  },
  {
    id: "dw-learn-german",
    organization: "Deutsche Welle",
    title: "Learn German free online",
    url: "https://learngerman.dw.com/en/learn-german/s-9528",
    status: "consulted",
    consultedOn: "2026-11-03",
    note: "Confirmed the provider organizes learning resources across beginner, independent and proficient ranges. Lesson examples here are original.",
  },
  {
    id: "cils-siena",
    organization: "Università per Stranieri di Siena",
    title: "Centro Certificazione CILS",
    url: "https://cils.unistrasi.it/",
    status: "consulted",
    consultedOn: "2026-11-03",
    note: "Confirmed the university's official CILS certification center. No exam items or teaching passages were copied.",
  },
  {
    id: "british-council-grammar",
    organization: "British Council",
    title: "LearnEnglish grammar",
    url: "https://learnenglish.britishcouncil.org/grammar",
    status: "access-limited",
    consultedOn: "2026-11-03",
    note: "Automated access returned HTTP 403. No claim is made that the lesson content was verified against this page.",
  },
  {
    id: "goethe-exams",
    organization: "Goethe-Institut",
    title: "German exams",
    url: "https://www.goethe.de/en/spr/kup/prf.html",
    status: "access-limited",
    consultedOn: "2026-11-03",
    note: "Automated access returned HTTP 403. German learning examples are original and not represented as Goethe-Institut-approved.",
  },
  {
    id: "cambridge-grammar",
    organization: "Cambridge Dictionary",
    title: "English Grammar Today",
    url: "https://dictionary.cambridge.org/grammar/british-grammar/",
    status: "access-limited",
    consultedOn: "2026-11-03",
    note: "Automated access returned an upstream error. IPA is omitted throughout the initial vocabulary set because pronunciation transcriptions were not independently verified.",
  },
  {
    id: "italian-certification-dante",
    organization: "Società Dante Alighieri",
    title: "PLIDA certification",
    url: "https://www.dante.global/en/certifications-plida",
    status: "reference-for-review",
    consultedOn: "2026-11-03",
    note: "The page loaded only limited content in automated retrieval; certification details should be checked directly before publishing exam-specific guidance.",
  },
  {
    id: "italian-celi-perugia",
    organization: "Università per Stranieri di Perugia",
    title: "CELI certification",
    url: "https://www.unistrapg.it/en/certifications/celi",
    status: "access-limited",
    consultedOn: "2026-11-03",
    note: "The supplied page returned HTTP 404. No CELI format details are claimed.",
  },
  {
    id: "spanish-dele-cervantes",
    organization: "Instituto Cervantes",
    title: "DELE diplomas",
    url: "https://cervantes.org/en/learn/spanish/dele-diplomas",
    status: "access-limited",
    consultedOn: "2026-11-03",
    note: "The supplied page could not be retrieved. Spanish topics and examples are original; the page makes no claim of official DELE alignment.",
  },
];

export const contentVerification = {
  contentType: "Original platform-created sample lessons and exercises.",
  cefrBasis: "Broad level progression informed by the Council of Europe CEFR Companion Volume; the activity text itself is an original adaptation and is not an official descriptor quotation.",
  verifiedClaims: [
    "Cambridge English describes CEFR as a six-level A1–C2 scale; this confirms the scale, not the alignment of the platform’s sample lessons.",
    "DELF tout public includes independent A1, A2, B1 and B2 diplomas and assesses communicative skills (France Éducation international page consulted).",
    "The RAE/ASALE Nueva gramática overview covers morphology, syntax, phonetics and phonology (official overview consulted).",
    "Deutsche Welle presents German learning resources in broad A1–A2, B1–B2 and C1–C2 ranges (DW page consulted).",
    "Università per Stranieri di Siena operates the CILS certification center (official center page consulted).",
    "TV5MONDE describes its French-learning offer as video-based exercises; no specific item in this app was taken from it.",
    "telc’s official certificate-exams section is a reference for the existence of its examination program; no format claim is made here.",
  ],
  verificationLimits: [
    "The selected topics/examples have not been independently reviewed by a professional language teacher.",
    "Automated access was blocked or failed for some requested references; see each source status.",
    "IPA transcriptions are not included because verified phonetic sources were unavailable for the sample entries.",
    "This is a representative sample curriculum, not a complete CEFR syllabus or official exam-preparation course.",
  ],
};
