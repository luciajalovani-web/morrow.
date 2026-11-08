import curriculum from "@/app/lib/french-curriculum-data.json";
import type { GrammarTopic } from "@/app/lib/grammar-content";
import type { VocabularyEntry, VocabularyPartOfSpeech } from "@/app/lib/vocabulary-content";
import type { LevelSlug } from "@/app/lib/language-content";
import type { ReadingLesson, SkillQuestion, WritingTask } from "@/app/lib/english-skills-content";

type RawGrammarTopic = {
  title: string;
  instructions: string[];
  exercises: string[];
  source: string[];
};

type RawVocabularyEntry = {
  target: string;
  partOfSpeech: string;
  translation: string;
  example: string;
};

type RawReadingLesson = {
  title: string;
  genre: string;
  passage: string;
  questions: string[];
};

type RawWritingTask = {
  title: string;
  prompt: string;
  instructions: string;
  minWords: number;
  maxWords: number;
  format: string;
};

type RawLevel = {
  grammar: RawGrammarTopic[];
  vocabulary: RawVocabularyEntry[];
  reading: RawReadingLesson[];
  writing: RawWritingTask[];
};

const curriculumByLevel: Record<LevelSlug, RawLevel> = curriculum;
const frenchSourceIds = ["delf-fei", "tv5monde-edu"];

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "");
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLocaleLowerCase();
}

function grammarRule(title: string) {
  const name = normalize(title);
  if (/subject pronoun|pronom sujet/u.test(name)) return "Le pronom sujet indique qui fait l’action : je, tu, il/elle/on, nous, vous, ils/elles.";
  if (/\betre\b|verb etre/u.test(name)) return "Conjuguez être selon le sujet : je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont.";
  if (/\bavoir\b|verb avoir/u.test(name)) return "Conjuguez avoir selon le sujet : j’ai, tu as, il/elle/on a, nous avons, vous avez, ils/elles ont.";
  if (/subjonctif|subjunctive/u.test(name)) return "Le subjonctif s’emploie notamment après des expressions de doute, de volonté, de nécessité ou d’émotion, ainsi qu’après certains connecteurs.";
  if (/past participle agreement|accord du participe passe/u.test(name)) return "Avec être, le participe passé s’accorde avec le sujet ; avec avoir, il s’accorde avec le complément direct lorsque celui-ci le précède.";
  if (/passe compose.*imparfait|imparfait.*passe compose/u.test(name)) return "Le passé composé présente un événement achevé ; l’imparfait décrit un contexte, une habitude ou une action en cours dans le passé.";
  if (/conditionnel passe/u.test(name)) return "Formez le conditionnel passé avec avoir ou être au conditionnel présent et le participe passé ; il exprime souvent une hypothèse irréelle ou un regret.";
  if (/futur proche|near future/u.test(name)) return "Formez le futur proche avec aller au présent suivi de l’infinitif : « Nous allons partir. »";
  if (/passe recent|recent past/u.test(name)) return "Formez le passé récent avec venir au présent + de + infinitif : « Elle vient d’arriver. »";
  if (/present progressif|present progressive/u.test(name)) return "Formez le présent progressif avec être en train de + infinitif pour insister sur une action en cours.";
  if (/verbes.*infinitif|verbs.*infinitive|vouloir|pouvoir|devoir/u.test(name)) return "Après vouloir, pouvoir et devoir, employez généralement l’infinitif : « Je peux venir. »";
  if (/verbe pronominal|reflexive|pronominaux/u.test(name)) return "Les verbes pronominaux se construisent avec un pronom réfléchi accordé au sujet : je me lève, nous nous levons.";
  if (/il faut/u.test(name)) return "La tournure impersonnelle il faut est suivie d’un infinitif : « Il faut partir. »";
  if (/possessive adjective|adjectif possessif/u.test(name)) return "Le déterminant possessif s’accorde avec le nom possédé : mon frère, ma sœur, mes amis.";
  if (/possessive pronoun|pronom possessif/u.test(name)) return "Le pronom possessif remplace un nom déjà mentionné et s’accorde avec ce nom : le mien, la mienne, les miens, les miennes.";
  if (/demonstrative adjective|adjectif demonstratif/u.test(name)) return "Le déterminant démonstratif s’accorde avec le nom : ce, cet, cette ou ces.";
  if (/demonstrative pronoun|pronom demonstratif/u.test(name)) return "Le pronom démonstratif remplace un nom : celui/celle au singulier, ceux/celles au pluriel.";
  if (/article|partitive/u.test(name)) return "Choisissez l’article selon le genre, le nombre et le sens : défini, indéfini ou partitif.";
  if (/indicatif/u.test(name)) return "L’indicatif présente généralement une information comme réelle, constatée ou tenue pour certaine.";
  if (/conditionnel/u.test(name)) return "Formez le conditionnel présent avec le radical du futur et les terminaisons de l’imparfait : -ais, -ais, -ait, -ions, -iez, -aient.";
  if (/common irregular verbs|verbes irreguliers/u.test(name)) return "Les verbes irréguliers ont des radicaux ou des formes propres à mémoriser ; conjuguez-les selon le sujet et le temps demandés.";
  if (/futur|future/u.test(name)) return "Formez le futur simple avec le radical du futur et les terminaisons -ai, -as, -a, -ons, -ez, -ont.";
  if (/plus-que-parfait/u.test(name)) return "Formez le plus-que-parfait avec l’imparfait de être ou avoir, suivi du participe passé.";
  if (/passe compose|past participle/u.test(name)) return "Formez le passé composé avec être ou avoir au présent et le participe passé ; avec être, le participe s’accorde avec le sujet.";
  if (/imparfait/u.test(name)) return "Formez l’imparfait à partir de la forme nous au présent, sans -ons, puis ajoutez -ais, -ais, -ait, -ions, -iez, -aient.";
  if (/passe simple/u.test(name)) return "Le passé simple est un temps du récit écrit ; choisissez la terminaison selon le groupe verbal et le sujet.";
  if (/present|present tense|present simple|present continuous|regular -er/u.test(name)) return "Au présent, accordez le verbe avec son sujet et choisissez la terminaison qui correspond au groupe verbal.";
  if (/interrogative|question/u.test(name)) return "Formez une question avec l’intonation, est-ce que ou l’inversion ; choisissez le mot interrogatif qui demande l’information voulue.";
  if (/negation|negative/u.test(name)) return "Dans une négation courante, encadrez le verbe conjugué avec ne (ou n’) et pas ; adaptez les autres mots négatifs au sens.";
  if (/stressed pronoun|pronom tonique/u.test(name)) return "Les pronoms toniques s’emploient après une préposition, seuls ou pour insister : moi, toi, lui/elle, nous, vous, eux/elles.";
  if (/quantity|quantite/u.test(name)) return "Après la plupart des expressions de quantité, employez de ou d’ devant le nom : beaucoup de livres, trop d’eau.";
  if (/numbers|dates|time|heure|date/u.test(name)) return "Exprimez l’heure, la date et les nombres avec les formes conventionnelles ; utilisez les prépositions adaptées au repère temporel.";
  if (/c'est|ce sont|il est|elle est/u.test(name)) return "Employez c’est/ce sont pour présenter ou identifier ; il est/elle est s’emploie notamment avec un adjectif ou une profession sans article.";
  if (/conjunction|connecteur|connector|logical connectors/u.test(name)) return "Choisissez le connecteur selon le lien logique voulu : addition, opposition, cause, conséquence ou chronologie.";
  if (/y et en|pronoun y|pronoms.*y|en and y/u.test(name)) return "Y remplace généralement un complément de lieu ou introduit par à ; en remplace souvent un complément introduit par de ou une quantité.";
  if (/verb.*preposition|verbes avec prepositions|verbes suivis/u.test(name)) return "La préposition qui suit un verbe dépend de la construction de ce verbe ; apprenez l’ensemble verbe + préposition + complément.";
  if (/double object pronoun|doubles pronoms|pronoms complements|cod|coi/u.test(name)) return "Placez les pronoms compléments avant le verbe conjugué, dans l’ordre requis ; à l’impératif affirmatif, ils se placent après le verbe.";
  if (/adjectif|adjective|agreement|accord/u.test(name)) return "L’adjectif s’accorde généralement en genre et en nombre avec le nom qu’il qualifie.";
  if (/pronoun|pronom/u.test(name)) return "Choisissez le pronom selon sa fonction dans la phrase, puis placez-le à la position prévue par la structure verbale.";
  if (/relatif|relative/u.test(name)) return "Choisissez le pronom relatif selon sa fonction : qui sujet, que complément direct, dont complément introduit par de, où lieu ou temps.";
  if (/passive|passive voice/u.test(name)) return "Formez la voix passive avec être conjugué et le participe passé, qui s’accorde avec le sujet ; introduisez l’agent avec par si nécessaire.";
  if (/gerondif|gerund/u.test(name)) return "Formez le gérondif avec en + participe présent ; le sujet implicite est généralement celui du verbe principal.";
  if (/nominalisation/u.test(name)) return "La nominalisation transforme une action ou une qualité en nom ; elle permet de condenser et de formaliser l’expression.";
  if (/ne expl/u.test(name)) return "Le ne explétif, notamment après certains verbes et locutions, ne marque pas à lui seul une négation.";
  if (/inversion/u.test(name)) return "Dans l’inversion, le sujet pronominal suit le verbe ; respectez la forme verbale et le trait d’union.";
  if (/mise en relief|emphasis|dislocation/u.test(name)) return "La mise en relief souligne un élément, notamment avec c’est… qui/que ou par une dislocation avec reprise pronominale.";
  if (/restriction/u.test(name)) return "La restriction ne… que signifie « seulement » et se distingue de la négation ne… pas.";
  if (/modalisation|nuances de l'enonciation/u.test(name)) return "La modalisation marque le degré de certitude, d’obligation ou de réserve du locuteur ; choisissez les marqueurs selon l’intention.";
  if (/reformulation|synthese|densite syntaxique/u.test(name)) return "Reformulez en conservant le sens, en hiérarchisant les idées et en choisissant une structure adaptée au registre.";
  if (/comparative|superlative|comparison/u.test(name)) return "Comparez deux éléments avec plus, moins ou aussi + adjectif/adverbe + que ; le superlatif ajoute le, la ou les.";
  if (/preposition/u.test(name)) return "Choisissez la préposition selon le lien de lieu, de temps ou de sens exprimé par la phrase.";
  if (/imperative|imperatif/u.test(name)) return "L’impératif sert à donner un ordre, un conseil ou une consigne ; il s’emploie sans pronom sujet.";
  if (/indirect speech|discours indirect|concordance des temps/u.test(name)) return "Au discours indirect, adaptez les pronoms, les repères temporels et, selon le verbe introducteur, les temps verbaux.";
  if (/agreement|accord/u.test(name)) return "Repérez les éléments qui commandent l’accord, puis accordez le participe, l’adjectif ou le verbe selon la règle concernée.";
  return `Pour « ${title} », repérez le sujet, les mots déclencheurs et la fonction des éléments avant de choisir la forme grammaticale attendue.`;
}

function grammarExamples(title: string, fallbacks: string[]) {
  const name = normalize(title);
  let examples: string[] | undefined;
  if (/subject pronoun|pronom sujet/u.test(name)) examples = ["Nous habitons à Lyon.", "Elles arrivent demain."];
  else if (/\betre\b|verb etre/u.test(name)) examples = ["Je suis à la maison.", "Mes amis sont très sympathiques."];
  else if (/\bavoir\b|verb avoir/u.test(name)) examples = ["J’ai vingt ans.", "Ils ont un grand appartement."];
  else if (/article|partitive/u.test(name)) examples = ["J’achète un livre et des pommes.", "Elle boit de l’eau et mange du pain."];
  else if (/gender|number of nouns|genre.*nombre/u.test(name)) examples = ["Un étudiant sérieux arrive.", "Les chevaux traversent le champ."];
  else if (/possessive adjective|adjectif possessif/u.test(name)) examples = ["Mon frère et ma sœur arrivent.", "Leurs enfants jouent dehors."];
  else if (/demonstrative/u.test(name)) examples = ["Cette maison est agréable.", "Je préfère ceux de gauche."];
  else if (/past participle agreement|accord du participe passe/u.test(name)) examples = ["Elles sont parties tôt.", "Les décisions qu’elles ont prises seront examinées."];
  else if (/adjectif|adjective/u.test(name)) examples = ["Marie est grande.", "Les maisons blanches sont lumineuses."];
  else if (/negation|negative/u.test(name)) examples = ["Je ne parle pas espagnol.", "Nous n’avons jamais visité ce musée."];
  else if (/question|interrogative/u.test(name)) examples = ["Où habites-tu ?", "Est-ce que vous venez demain ?"];
  else if (/imperative|imperatif/u.test(name)) examples = ["Fermez la porte, s’il vous plaît.", "N’oublie pas ton sac."];
  else if (/subjonctif|subjunctive/u.test(name)) examples = ["Il faut que chacun puisse participer.", "Bien qu’il soit tard, la réunion continue."];
  else if (/futur proche|near future/u.test(name)) examples = ["Nous allons partir demain.", "Elle va téléphoner ce soir."];
  else if (/passe recent|recent past/u.test(name)) examples = ["Je viens de terminer le rapport.", "Ils viennent d’arriver."];
  else if (/passe compose.*imparfait|imparfait.*passe compose/u.test(name)) examples = ["Il pleuvait quand le train est arrivé.", "Nous marchions lorsqu’elle a appelé."];
  else if (/passe compose|past participle/u.test(name)) examples = ["J’ai visité le musée hier.", "Elles sont parties tôt."];
  else if (/imparfait/u.test(name)) examples = ["Quand j’étais enfant, je jouais au parc.", "Le soleil brillait toute la journée."];
  else if (/plus-que-parfait/u.test(name)) examples = ["Elle avait terminé avant la réunion.", "Nous étions déjà partis quand tu as appelé."];
  else if (/conditionnel/u.test(name)) examples = ["Si j’avais le temps, je voyagerais davantage.", "Il aurait accepté si l’offre avait été claire."];
  else if (/futur|future/u.test(name)) examples = ["Nous visiterons le musée demain.", "Elle prendra le train lundi."];
  else if (/common irregular verbs|verbes irreguliers/u.test(name)) examples = ["Je vais au travail en bus.", "Ils prennent le train à huit heures."];
  else if (/numbers|dates|time|heure|date/u.test(name)) examples = ["Il est huit heures et demie.", "Le rendez-vous est le 14 juin."];
  else if (/indirect speech|discours indirect|concordance des temps/u.test(name)) examples = ["Elle a expliqué qu’elle arriverait plus tard.", "Il a dit qu’il avait déjà répondu."];
  else if (/passive|passive voice/u.test(name)) examples = ["Le rapport a été publié hier.", "La décision sera annoncée demain."];
  else if (/gerondif|gerund/u.test(name)) examples = ["Il a répondu en prenant le temps de réfléchir.", "Elle apprend en écoutant la radio."];
  else if (/relatif|relative/u.test(name)) examples = ["La ville où je travaille est très animée.", "Le projet dont elle parle est ambitieux."];
  else if (/y et en|pronoun y|pronoms.*y|en and y/u.test(name)) examples = ["Nous y réfléchirons demain.", "Elle en a déjà parlé."];
  else if (/double object pronoun|doubles pronoms|pronoms complements|cod|coi/u.test(name)) examples = ["Je le lui ai déjà expliqué.", "Nous les leur avons envoyés."];
  else if (/ne expl/u.test(name)) examples = ["Je crains qu’il ne soit trop tard.", "Elle redoute que la situation ne s’aggrave."];
  else if (/mise en relief|emphasis|dislocation/u.test(name)) examples = ["C’est cette mesure qui a lancé le débat.", "Ce livre, je l’ai lu deux fois."];
  else if (/nominalisation/u.test(name)) examples = ["La mise en œuvre de la réforme exige un suivi.", "L’analyse des résultats précède la décision."];
  else if (/cause|consequence|connecteur|connector|concession|opposition/u.test(name)) examples = ["Bien que les coûts augmentent, le projet continue.", "La décision a été reportée parce que les données manquent."];

  return (examples ?? fallbacks.slice(0, 3)).map((target) => ({
    target,
    translation: "",
    note: examples ? "Exemple original illustrant la règle dans un contexte courant." : "Exemple contextualisé extrait de l’exercice fourni.",
  }));
}

function splitPracticeItems(source: string) {
  const normalized = source.replace(/\s+/gu, " ").trim();
  const sentences = normalized.match(/[^.!?]+[.!?]+/gu)?.map((item) => item.trim()).filter(Boolean) ?? [];
  const remainder = normalized.replace(/[^.!?]+[.!?]+/gu, " ").trim();
  if (sentences.length > 1) {
    return [...sentences, ...(remainder ? [remainder] : [])];
  }
  const splitItems = normalized.split(/(?<=___)\s+(?=(?:Un|Une|Je|Tu|Il|Elle|Nous|Vous|Ils|Elles|Le|La|Les|Qui|Que|Quand|Où|Comment)\b)/u);
  return splitItems.map((item) => item.trim()).filter(Boolean);
}

function practicePrompt(source: string) {
  return `« ${source} » — quelle règle grammaticale permet de traiter cet exemple ?`;
}

export function getFrenchCurriculumGrammarTopics(level: LevelSlug): GrammarTopic[] {
  return curriculumByLevel[level].grammar.map((topic, topicIndex) => {
    const rule = grammarRule(topic.title);
    const id = `french-${level}-curriculum-${slugify(topic.title)}`;
    const practiceItems = topic.exercises.flatMap(splitPracticeItems);
    const sourceItems = practiceItems.length ? practiceItems : [topic.instructions[0] ?? topic.title];
    const wrongOptions = [
      "Le verbe reste toujours à l’infinitif, quel que soit le sujet ou le temps.",
      "Les mots de la phrase ne commandent jamais d’accord grammatical.",
    ];

    return {
      id,
      language: "french",
      level,
      title: topic.title,
      objective: `Comprendre et appliquer la règle : ${topic.title}.`,
      explanation: `${rule} Observez le contexte avant de choisir la forme.`,
      rule,
      pattern: { positive: rule, negative: rule, question: rule },
      examples: grammarExamples(topic.title, sourceItems),
      context: topic.instructions[0] ?? `Mettez en pratique la règle « ${topic.title} ».`,
      commonMistake: {
        incorrect: "Le verbe reste à l’infinitif dans toute la phrase.",
        correct: rule,
        why: "La forme correcte dépend de la règle et du contexte de la phrase.",
      },
      distinction: {
        structures: topic.title,
        difference: rule,
      },
      exercises: sourceItems.map((source, exerciseIndex) => {
        const options = [rule, ...wrongOptions];
        const rotation = (topicIndex + exerciseIndex) % options.length;
        const rotatedOptions = [...options.slice(rotation), ...options.slice(0, rotation)];
        return {
          id: `${id}-exercise-${exerciseIndex + 1}`,
          topicId: id,
          level,
          type: "multiple-choice",
          prompt: practicePrompt(source),
          instruction: "Choisissez le principe grammatical qui convient.",
          options: rotatedOptions,
          acceptedAnswers: [rule],
          explanation: rule,
          isFinalQuiz: exerciseIndex === sourceItems.length - 1,
        };
      }),
      sourceIds: frenchSourceIds,
      verification: "original-sample-needs-teacher-review",
      curriculumExercises: topic.source,
    };
  });
}

function vocabularyPartOfSpeech(value: string): VocabularyPartOfSpeech {
  const type = normalize(value);
  if (/nom|noun/u.test(type)) return "noun";
  if (/verbe|verb/u.test(type)) return "verb";
  if (/adjectif|adjective/u.test(type)) return "adjective";
  if (/adverbe|adverb/u.test(type)) return "adverb";
  if (/preposition/u.test(type)) return "preposition";
  if (/conjonction|conjunction/u.test(type)) return "conjunction";
  if (/expression|locution/u.test(type)) return "expression";
  return "expression";
}

function pluralizeFrenchWord(word: string) {
  const irregular: Record<string, string> = {
    cheval: "chevaux",
    journal: "journaux",
    travail: "travaux",
    oeil: "yeux",
    monsieur: "messieurs",
    madame: "mesdames",
  };
  const lower = word.toLocaleLowerCase();
  if (irregular[lower]) return irregular[lower];
  if (/(?:s|x|z)$/iu.test(word)) return word;
  if (/(?:eau|au)$/iu.test(word)) return `${word}x`;
  if (/al$/iu.test(word)) return `${word.slice(0, -2)}aux`;
  if (/eu$/iu.test(word)) return `${word}x`;
  return `${word}s`;
}

function frenchPlural(target: string) {
  if (/^(?:des|les|mes|tes|ses|nos|vos|leurs)\b/iu.test(target)) return target;
  const article = target.match(/^(un|une|le|la|l['’])\s*/iu);
  const remainder = article ? target.slice(article[0].length) : target;
  const words = remainder.split(/\s+/u);
  if (!words[0]) return target;
  words[0] = pluralizeFrenchWord(words[0]);
  const pluralArticle = article
    ? /^(?:un|une)$/iu.test(article[1]) ? "des" : "les"
    : "";
  return `${pluralArticle}${pluralArticle ? " " : ""}${words.join(" ")}`;
}

export function getFrenchCurriculumVocabularyEntries(level: LevelSlug): VocabularyEntry[] {
  return curriculumByLevel[level].vocabulary.map((entry, index) => {
    const partOfSpeech = vocabularyPartOfSpeech(entry.partOfSpeech);
    const gender = partOfSpeech !== "noun"
      ? undefined
      : /(?:\bf\.|feminine|féminin)/iu.test(entry.partOfSpeech) || /^(?:une|la)\b/iu.test(entry.target)
        ? "feminine"
        : /(?:\bm\.|masculine|masculin)/iu.test(entry.partOfSpeech) || /^(?:un|le)\b/iu.test(entry.target)
          ? "masculine"
          : undefined;
    return {
      id: `french-${level}-curriculum-${index + 1}-${slugify(entry.target)}`,
      language: "french",
      level,
      target: entry.target,
      translation: entry.translation,
      partOfSpeech,
      gender,
      plural: partOfSpeech === "noun" ? frenchPlural(entry.target) : undefined,
      example: entry.example,
      exampleTranslation: "",
      collocations: [],
      usageNote: `French ${level.toUpperCase()} curriculum vocabulary.`,
      category: `French ${level.toUpperCase()}`,
      sourceIds: frenchSourceIds,
      verification: "original-sample-needs-dictionary-review",
      sourcePartOfSpeech: entry.partOfSpeech,
      definitionProvided: true,
    };
  });
}

const stopWords = new Set([
  "alors", "au", "aux", "avec", "ce", "ces", "dans", "de", "des", "du", "elle", "elles", "en", "et",
  "il", "ils", "je", "la", "le", "les", "leur", "lui", "ma", "mais", "me", "meme", "mes", "mon",
  "ne", "nos", "notre", "nous", "on", "ou", "par", "pas", "pour", "que", "qui", "sa", "se", "ses",
  "son", "sur", "ta", "te", "tes", "ton", "tu", "un", "une", "vos", "votre", "vous", "y",
]);

function tokens(value: string) {
  return normalize(value).match(/\p{L}+/gu)?.filter((token) => token.length > 2 && !stopWords.has(token)) ?? [];
}

function splitSentences(passage: string) {
  return passage.match(/[^.!?]+[.!?]*/gu)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
}

function sentenceScore(sentence: string, query: string) {
  const sentenceTokens = tokens(sentence);
  const queryTokens = tokens(query);
  let score = queryTokens.reduce((total, token) => {
    if (sentenceTokens.includes(token)) return total + 4;
    if (sentenceTokens.some((candidate) => candidate.startsWith(token.slice(0, 4)) || token.startsWith(candidate.slice(0, 4)))) return total + 2;
    return total;
  }, 0);
  const normalizedQuery = normalize(query);
  const normalizedSentence = normalize(sentence);
  if (/quel age/u.test(normalizedQuery) && /\b(?:ans|annees)\b/u.test(normalizedSentence)) score += 6;
  if (/combien/u.test(normalizedQuery) && /\b(?:un|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|\d+)\b/u.test(normalizedSentence)) score += 3;
  if (/quelle heure|a quelle heure/u.test(normalizedQuery) && /\b(?:heure|heures|midi|minuit|[0-2]?\d\s*h)\b/u.test(normalizedSentence)) score += 6;
  if (/comment/u.test(normalizedQuery) && /travail|transport|aller/u.test(normalizedQuery) && /\b(?:bus|train|voiture|velo|pied|metro)\b/u.test(normalizedSentence)) score += 6;
  if (/pourquoi/u.test(normalizedQuery) && /\b(?:parce que|car|puisque)\b/u.test(normalizedSentence)) score += 3;
  return score;
}

function makeReadingQuestion(question: string, passage: string, index: number): SkillQuestion {
  const sentences = splitSentences(passage);
  const normalizedQuestion = normalize(question);
  const isOpinionQuestion = /^(?:es-tu|etes-vous) d'accord/u.test(normalizedQuestion);
  const isFollowUpWhy = /^pourquoi\s*[?？]?$/u.test(normalizedQuestion.trim());
  const transformedQuestion = isOpinionQuestion
    ? "Quelle position l’auteur défend-il dans le texte ?"
    : isFollowUpWhy
      ? "Pour quelle raison l’auteur recommande-t-il cette solution ?"
      : question;
  const ranked = sentences.map((sentence, sentenceIndex) => ({
    sentence,
    sentenceIndex,
    score: sentenceScore(sentence, transformedQuestion),
  })).sort((left, right) => right.score - left.score || left.sentenceIndex - right.sentenceIndex);
  const opinion = isOpinionQuestion
    ? sentences.find((sentence) => /\ba mon avis\b|meilleure solution|il me semble|selon l'auteur/u.test(normalize(sentence)))
    : undefined;
  const reason = isFollowUpWhy
    ? sentences.find((sentence) => /\b(?:pouvoir|permettre|car|parce que|afin de|afin que|choisir)\b/u.test(normalize(sentence)))
    : undefined;
  const answer = opinion ?? reason ?? ranked[0]?.sentence ?? passage;
  const distractors = ranked
    .filter((item) => item.sentence !== answer && item.score < ranked[0]?.score)
    .slice(0, 2)
    .map((item) => item.sentence);
  if (distractors.length < 2) {
    for (const sentence of sentences) {
      if (sentence !== answer && !distractors.includes(sentence)) distractors.push(sentence);
      if (distractors.length === 2) break;
    }
  }
  const options = [answer, ...distractors].slice(0, 3);
  const rotation = options.length ? index % options.length : 0;
  const rotatedOptions = [...options.slice(rotation), ...options.slice(0, rotation)];
  return {
    prompt: transformedQuestion,
    type: "choice",
    options: rotatedOptions,
    acceptedAnswers: [answer],
    explanation: `La réponse est donnée dans le texte : « ${answer} »`,
  };
}

export function getFrenchCurriculumReadingLessons(level: LevelSlug): ReadingLesson[] {
  return curriculumByLevel[level].reading.map((lesson) => {
    return {
      id: `french-${level}-reading-${slugify(lesson.title)}`,
      title: lesson.title,
      genre: lesson.genre === "Reading comprehension" ? "Compréhension écrite" : lesson.genre,
      passage: lesson.passage,
      glossary: [],
      questions: lesson.questions.map((question, index) => makeReadingQuestion(question, lesson.passage, index)),
    };
  });
}

function writingInstructions(value: string) {
  const generalInstruction = value.match(/Consigne générale\s*:\s*(.+)$/iu)?.[1];
  return (generalInstruction ?? value)
    .replace(/^На DALF C2[^.]*\.\s*/iu, "")
    .trim();
}

export function getFrenchCurriculumWritingTasks(level: LevelSlug): WritingTask[] {
  return curriculumByLevel[level].writing.map((task) => ({
    id: `french-${level}-writing-${slugify(task.title)}`,
    title: task.title,
    format: task.format === "Guided writing" ? "Rédaction guidée" : "Production écrite",
    prompt: task.prompt.replace(/\. (?=[A-ZÀ-ÖØ-Þ])/gu, ".\n"),
    instructions: writingInstructions(task.instructions),
    minWords: task.minWords,
    maxWords: task.maxWords,
  }));
}
