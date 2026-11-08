import curriculum from "@/app/lib/english-study-program.json";
import type { GrammarExercise, GrammarTopic } from "@/app/lib/grammar-content";
import type { VocabularyEntry, VocabularyPartOfSpeech } from "@/app/lib/vocabulary-content";
import type { LevelSlug } from "@/app/lib/language-content";
import type { ReadingLesson, SkillQuestion, WritingTask } from "@/app/lib/english-skills-content";

type CurriculumSection = { title: string; content: string };
type CurriculumLevel = { levelTitle: string; intro: string; sections: CurriculumSection[] };

const curriculumByLevel = curriculum as Record<LevelSlug, CurriculumLevel>;

function sectionContent(level: LevelSlug, index: number) {
  const section = curriculumByLevel[level]?.sections[index];
  if (!section) throw new Error(`Missing English curriculum section ${index + 1} for ${level.toUpperCase()}.`);
  return section.content;
}

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/gu, "").toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, "");
}

function parseGrammarTopics(level: LevelSlug): GrammarTopic[] {
  const content = sectionContent(level, 0);
  const headings = [...content.matchAll(/^(?:Topic\s+\d+\.|\d+\.)\s*(.+)$/gmu)];
  return headings.map((heading, index) => {
    const start = (heading.index ?? 0) + heading[0].length;
    const end = headings[index + 1]?.index ?? content.length;
    const title = heading[1].trim();
    const lines = content.slice(start, end).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
    const exerciseLines = lines
      .map((line) => line.replace(/^[•●▪]\s*/u, "").trim())
      .filter((line) => line && !/^(?:Complete|Choose|Write|Put|Rewrite|Make|Use|Correct|Form|Identify|Underline|Combine|Transform|Decide|Add|Change|Select|Fill|Answer|Create|Insert|Replace|Order|Rearrange|Express|Report|Tick|Match|Classify|Give|Explain|Compare|Construct|Translate|Remove|Rewrite|Use|Exercise:)/iu.test(line));
    const instruction = lines.find((line) => !/^[•●▪]/u.test(line)) ?? `Practise ${title}.`;
    const rule = grammarRule(title);
    const id = `english-${level}-curriculum-${slugify(title)}`;
    const exampleLines = exerciseLines.length ? exerciseLines : lines.slice(1);
    const examples = exampleLines.slice(0, 2).map((target) => ({
      target,
      translation: "",
      note: "Original exercise prompt from the supplied curriculum.",
    }));
    const sourceExercises = exerciseLines.length ? exerciseLines : [`Practise the rule for ${title}.`];
    const exercises = sourceExercises.map((sourceExercise, exerciseIndex) =>
      makeGrammarExercise(sourceExercise, title, rule, id, level, exerciseIndex, sourceExercises.length),
    );

    return {
      id,
      language: "english",
      level,
      title,
      objective: instruction,
      explanation: `This lesson focuses on ${title}. Use the rule and examples below to recognise and practise the structure.`,
      rule,
      pattern: { positive: rule, negative: rule, question: rule },
      examples,
      context: instruction,
      commonMistake: { incorrect: "", correct: "", why: "" },
      distinction: { structures: "", difference: "" },
      exercises,
      sourceIds: [],
      verification: "original-sample-needs-teacher-review",
      curriculumExercises: exerciseLines,
    };
  });
}

function makeGrammarExercise(
  source: string,
  title: string,
  rule: string,
  topicId: string,
  level: LevelSlug,
  index: number,
  total: number,
): GrammarExercise {
  const resolved = resolveGrammarAnswer(title, source);
  if (resolved) {
    return {
      id: `${topicId}-exercise-${index + 1}`,
      topicId,
      level,
      type: "multiple-choice",
      prompt: source.replace(/\(([^()]*\/[^()]*)\)/gu, "_____").replace(/_{2,}/gu, "_____"),
      instruction: "Choose the correct form for the sentence.",
      options: resolved.options,
      acceptedAnswers: [resolved.answer],
      explanation: `${rule} Correct answer: ${resolved.answer}.`,
      isFinalQuiz: index === total - 1,
    };
  }

  const prompt = source.toLowerCase().includes("rule for ")
    ? source
    : `For this exercise, “${source}” — which rule should you apply?`;
  return {
    id: `${topicId}-rule-check-${index + 1}`,
    topicId,
    level,
    type: "multiple-choice",
    prompt,
    instruction: "Choose the principle that helps complete this item.",
    options: [rule, "Ignore the sentence context and use a form that contradicts its meaning.", "Use one fixed form regardless of the subject, tense, or sentence type."],
    acceptedAnswers: [rule],
    explanation: rule,
    isFinalQuiz: index === total - 1,
  };
}

function resolveGrammarAnswer(title: string, source: string): { answer: string; options: string[] } | undefined {
  const titleText = title.toLowerCase();
  const sentence = source.toLowerCase();
  const inlineChoices = [...source.matchAll(/\(([^()]*\/[^()]*)\)/gu)].at(-1)?.[1];
  if (inlineChoices) {
    const choices = inlineChoices.split("/").map((choice) => choice.trim());
    const answer = selectInlineChoice(choices, titleText, sentence);
    if (answer) return { answer, options: uniqueOptions(answer, choices, choices) };
  }

  const verb = source.match(/\(([a-z]+)\)/iu)?.[1];
  let answer: string | undefined;
  let alternatives: string[] = [];

  if (/verb to be/u.test(titleText)) {
    const subject = sentence.match(/\b(i|you|we|they|he|she|it|this|that)\b/u)?.[1];
    answer = subject === "i" ? "am" : subject === "you" || subject === "we" || subject === "they" ? "are" : subject ? "is" : undefined;
    alternatives = ["am", "is", "are"];
  } else if (verb && /present continuous/u.test(titleText)) {
    const subject = subjectBeforeBlank(sentence);
    const auxiliary = subject === "i" ? "am" : ["you", "we", "they"].includes(subject) || subject.endsWith("s") ? "are" : "is";
    answer = `${auxiliary} ${verbIng(verb)}`;
    alternatives = [`am ${verbIng(verb)}`, `is ${verbIng(verb)}`, `are ${verbIng(verb)}`];
  } else if (verb && /past continuous/u.test(titleText)) {
    const subject = subjectBeforeBlank(sentence);
    const auxiliary = ["i", "he", "she", "it"].includes(subject) ? "was" : "were";
    answer = `${auxiliary} ${verbIng(verb)}`;
    alternatives = [`was ${verbIng(verb)}`, `were ${verbIng(verb)}`, `${pastForm(verb)} ${verbIng(verb)}`];
  } else if (verb && /past simple/u.test(titleText) && !/negative|question|continuous/u.test(titleText)) {
    answer = pastForm(verb);
    alternatives = [answer, verb, verbIng(verb)];
  } else if (verb && /present simple/u.test(titleText)) {
    answer = presentForm(verb, subjectBeforeBlank(sentence));
    alternatives = [answer, verb, pastForm(verb)];
  } else if (/article/u.test(titleText) && /_{2,}|___/u.test(source)) {
    const nextWord = sentence.match(/_{2,}\s+(?:a\s+|an\s+)?([a-z]+)/u)?.[1];
    answer = nextWord && /^(?:a|e|i|o|u)/u.test(nextWord) ? "an" : nextWord ? "a" : undefined;
    if (nextWord && /sun|moon|earth|internet/u.test(nextWord)) answer = "the";
    alternatives = ["a", "an", "the"];
  } else if (/there is|there are/u.test(titleText)) {
    const nounPhrase = sentence.match(/_{2,}\s+(?:a|an|the|\d+)?\s*([a-z]+)(?:\s+([a-z]+))?/u);
    const plural = nounPhrase ? pluralSubject(`${nounPhrase[1]} ${nounPhrase[2] ?? ""}`.trim()) : undefined;
    answer = plural === undefined ? undefined : plural ? "There are" : "There is";
    alternatives = ["There is", "There are"];
  }

  if (!answer) return undefined;
  return { answer, options: uniqueOptions(answer, alternatives, [answer, ...alternatives]) };
}

function selectInlineChoice(choices: string[], title: string, sentence: string) {
  if (!choices.length) return undefined;
  if (/article/u.test(title) || choices.some((choice) => ["a", "an", "the"].includes(choice.toLowerCase()))) {
    const nextWord = sentence.match(/\(\s*[^)]*\)\s*([a-z]+)/u)?.[1]
      ?? sentence.match(/\b(?:have|is|are|has)\s+\([^)]*\)\s*([a-z]+)/u)?.[1];
    if (nextWord) {
      const desired = /^(?:a|e|i|o|u)/u.test(nextWord) ? "an" : "a";
      const selected = choices.find((choice) => choice.toLowerCase() === desired);
      if (selected) return selected;
      if (/^(?:sun|moon|earth|internet)$/u.test(nextWord)) return choices.find((choice) => choice.toLowerCase() === "the");
    }
  }
  if (/pronoun/u.test(title)) {
    const next = sentence.slice(sentence.lastIndexOf("(") + 1).split(")")[1]?.trim() ?? "";
    const isBeforeNoun = /^(?:house|dog|parents|brother|sister|friend|car|book|name|family)\b/u.test(next);
    const isSubjectPosition = /is my brother|are teachers|work|live|speak|play/u.test(next);
    if (isBeforeNoun || /possessive/u.test(title) && !isSubjectPosition) {
      return choices.find((choice) => /(?:my|his|her|their|our|your)$/u.test(choice.toLowerCase()));
    }
    return choices.find((choice) => /^(?:i|you|he|she|it|we|they)$/iu.test(choice));
  }
  if (/present perfect.*past simple|past simple.*present perfect/u.test(title)) {
    const hasFinishedTime = /\b(yesterday|last\s+(?:week|month|year|summer|night)|in\s+\d{4}|ago)\b/u.test(sentence);
    const needsPerfect = /\b(since|for|ever|never|already|yet|just|\d+\s+times?)\b/u.test(sentence);
    if (hasFinishedTime) return choices.find((choice) => /^(?:did|went|saw|finished|visited|made|took|played)$/iu.test(choice));
    if (needsPerfect) return choices.find((choice) => /have|has|haven't|hasn't/iu.test(choice));
  }
  if (/some|any|no/u.test(title)) {
    if (/\b(?:isn't|aren't|not|don't|doesn't|didn't|hardly)\b/u.test(sentence)) return choices.find((choice) => choice.toLowerCase() === "any" || choice.toLowerCase() === "no");
    if (/\b(?:would you like|could i have|offer)\b/u.test(sentence)) return choices.find((choice) => choice.toLowerCase() === "some");
  }
  if (/this|that|demonstrative/u.test(title)) {
    const plural = /\b(?:are|shoes|friends|books|people)\b/u.test(sentence);
    const distant = /\b(?:over there|across the street|far away)\b/u.test(sentence);
    const desired = plural ? distant ? "those" : "these" : distant ? "that" : "this";
    return choices.find((choice) => choice.toLowerCase() === desired);
  }
  if (/past simple/u.test(title) && /\b(yesterday|last\s+\w+|ago|in\s+\d{4})\b/u.test(sentence)) {
    return choices.find((choice) => /(?:ed|went|saw|had|made|took|bought|came|did|got|was|were)$/iu.test(choice));
  }
  if (/comparative/u.test(title)) return choices.find((choice) => /(?:er|more)\b/iu.test(choice));
  if (/superlative/u.test(title)) return choices.find((choice) => /(?:est|most)\b/iu.test(choice));
  if (/frequency/u.test(title)) return choices.find((choice) => /(?:always|usually|often|sometimes|never)/iu.test(choice));
  return undefined;
}

function subjectBeforeBlank(sentence: string) {
  const beforeBlank = sentence.split(/_{2,}/u)[0] ?? "";
  const tokens = beforeBlank.trim().split(/\s+/u);
  return (tokens.at(-1) ?? "").replace(/[^\p{L}]/gu, "");
}

function pluralSubject(value: string) {
  if (!value) return undefined;
  if (/\b(?:a|an|the)\b/u.test(value)) return false;
  const words = value.trim().split(/\s+/u);
  const noun = words.at(-1) ?? "";
  if (/^\d+$/u.test(words[0])) return Number(words[0]) > 1;
  return /s$/u.test(noun) && !/(?:ss|us|is)$/u.test(noun);
}

function verbIng(verb: string) {
  if (verb.endsWith("ie")) return `${verb.slice(0, -2)}ying`;
  if (verb.endsWith("e") && !verb.endsWith("ee")) return `${verb.slice(0, -1)}ing`;
  return `${verb}ing`;
}

function pastForm(verb: string) {
  const irregular: Record<string, string> = {
    be: "was", buy: "bought", come: "came", do: "did", eat: "ate", get: "got", give: "gave",
    go: "went", have: "had", make: "made", read: "read", run: "ran", say: "said", see: "saw",
    take: "took", teach: "taught", tell: "told", think: "thought", write: "wrote",
  };
  if (irregular[verb]) return irregular[verb];
  if (verb.endsWith("e")) return `${verb}d`;
  if (/[^aeiou]y$/u.test(verb)) return `${verb.slice(0, -1)}ied`;
  return `${verb}ed`;
}

function presentForm(verb: string, subject: string) {
  if (["i", "you", "we", "they"].includes(subject) || subject.endsWith("s")) return verb;
  if (verb.endsWith("y") && !/[aeiou]y$/u.test(verb)) return `${verb.slice(0, -1)}ies`;
  if (/(?:s|sh|ch|x|o)$/u.test(verb)) return `${verb}es`;
  return `${verb}s`;
}

function uniqueOptions(answer: string, choices: string[], fallbacks: string[]) {
  const options = [...new Set([answer, ...choices, ...fallbacks].map((choice) => choice.trim()).filter(Boolean))];
  const result = options.slice(0, 3);
  if (result.length < 2) {
    for (const fallback of ["another form", "a different form"]) {
      if (!result.includes(fallback)) result.push(fallback);
      if (result.length === 2) break;
    }
  }
  return result;
}

function grammarRule(title: string) {
  const name = title.toLowerCase();
  if (/verb to be/u.test(name)) return "Choose am with I, is with he/she/it, and are with you/we/they.";
  if (/pronoun/u.test(name)) return "Use subject pronouns before verbs; use possessive adjectives before nouns.";
  if (/article/u.test(name)) return "Use a before a consonant sound, an before a vowel sound, and the for something specific or already identified.";
  if (/singular and plural|plural noun/u.test(name)) return "Use the singular form for one item and the plural form for more than one; plural spelling varies, especially for irregular nouns.";
  if (/this.*that|demonstrative/u.test(name)) return "Use this/these for things near the speaker and that/those for things farther away; use these/those for plural nouns.";
  if (/have got|has got/u.test(name)) return "Use have got with I/you/we/they and has got with he/she/it.";
  if (/present simple/u.test(name)) return "Use the base verb with I/you/we/they and add -s or -es with he/she/it; use do/does for questions and negatives.";
  if (/adverb.*frequency/u.test(name)) return "Place frequency adverbs before most main verbs, but after the verb be.";
  if (/present continuous/u.test(name)) return "Form the present continuous with am/is/are + verb-ing for actions happening now or around now.";
  if (/there is|there are/u.test(name)) return "Use there is with a singular noun and there are with a plural noun.";
  if (/preposition.*place/u.test(name)) return "Choose a place preposition that describes the relationship between the object and its location.";
  if (/preposition.*time/u.test(name)) return "Use at for clock times, on for days and dates, and in for months, years and longer periods.";
  if (/modal.*past|past.*modal/u.test(name)) return "Use a modal + have + past participle to make a past deduction or express possibility, regret, or criticism.";
  if (/modal.*deduction|deduction.*modal/u.test(name)) return "Use must for a strong positive deduction, can't for a strong negative deduction, and may/might/could for possibility.";
  if (/can|modal/u.test(name)) return "A modal verb is followed by the base form of the main verb; choose the modal that matches ability, advice, obligation, or possibility.";
  if (/imperative/u.test(name)) return "Use the base verb to give an instruction; use do not/don't + base verb for a negative instruction.";
  if (/countable|uncountable/u.test(name)) return "Countable nouns have singular and plural forms; uncountable nouns are not normally counted with a number or plural -s.";
  if (/some|any|no/u.test(name)) return "Use some commonly in affirmative statements and offers; use any commonly in questions and negatives, with exceptions determined by meaning.";
  if (/possessive/u.test(name)) return "Use apostrophe-s to show possession with a singular owner; plural owners ending in -s usually take an apostrophe after the s.";
  if (/conjunction|linking|connector/u.test(name)) return "Choose a conjunction that expresses the intended relationship, such as addition, contrast, cause, or result.";
  if (/past simple.*regular/u.test(name)) return "Form the regular past simple with -ed, observing spelling changes such as study → studied.";
  if (/past simple.*irregular/u.test(name)) return "Use the irregular past form; irregular verbs do not follow the regular -ed pattern.";
  if (/past simple.*past continuous/u.test(name)) return "Use the past continuous for an action in progress at a past time and the past simple for a shorter completed event.";
  if (/past simple/u.test(name)) return "Use the past simple for finished past events; use did + base verb in questions and negatives.";
  if (/past continuous/u.test(name)) return "Form the past continuous with was/were + verb-ing for an action in progress at a past time.";
  if (/comparatives and superlatives/u.test(name)) return "Use comparative forms to compare two things and superlative forms to identify the highest or lowest degree in a group.";
  if (/comparative/u.test(name)) return "Use a comparative form to compare two things, commonly adjective + -er or more + adjective, followed by than.";
  if (/superlative/u.test(name)) return "Use a superlative to identify the highest or lowest degree in a group, commonly the + adjective-est or the most + adjective.";
  if (/much|many|quantifier|few|little/u.test(name)) return "Use many/few with countable plural nouns and much/little with uncountable nouns; a lot of can be used with both.";
  if (/must|have to|obligation/u.test(name)) return "Use must or have to for obligation; mustn't means prohibition, while don't have to means there is no obligation.";
  if (/should/u.test(name)) return "Use should + base verb to give advice or express a recommendation; shouldn't gives negative advice.";
  if (/adverb.*manner/u.test(name)) return "Adverbs of manner describe how an action is done and often use adjective + -ly, with spelling exceptions.";
  if (/present perfect.*past simple/u.test(name)) return "Use the past simple with a finished past time; use the present perfect for experience or a past event connected to now.";
  if (/present perfect.*ever|present perfect.*never/u.test(name)) return "Use have/has + past participle with ever to ask about experience and never to say an experience has not happened.";
  if (/present perfect.*just|present perfect.*already|present perfect.*yet/u.test(name)) return "Use have/has + past participle; just and already usually come before the participle, while yet commonly appears at the end of questions and negatives.";
  if (/present perfect/u.test(name)) return "Form the present perfect with have/has + past participle; use it for experience or a past event connected to the present.";
  if (/first conditional/u.test(name)) return "Use if + present simple for a real future condition, followed by will + base verb for its likely result.";
  if (/first and second conditional/u.test(name)) return "Use the first conditional for a realistic future possibility and the second conditional for an unreal or unlikely situation.";
  if (/second conditional/u.test(name)) return "Use if + past simple for an unreal or unlikely present/future condition, followed by would + base verb.";
  if (/third conditional/u.test(name)) return "Use if + past perfect for an unreal past condition, followed by would have + past participle.";
  if (/mixed conditional/u.test(name)) return "A mixed conditional connects a past condition with a present result, or a present condition with a past result.";
  if (/past perfect/u.test(name)) return "Form the past perfect with had + past participle for an event completed before another past reference point.";
  if (/would rather/u.test(name)) return "Use would rather + base verb for a preference; use would rather + subject + past form to express a preference about someone else's action.";
  if (/used to/u.test(name)) return "Use used to + base verb for past habits or states that are no longer true; would commonly describes repeated past actions.";
  if (/be used to|get used to/u.test(name)) return "Be used to means be accustomed to; get used to means become accustomed to. Follow both with a noun or an -ing form.";
  if (/future in the past/u.test(name)) return "Use was/were going to, would, or a past continuous arrangement to describe a future event viewed from a past point.";
  if (/going to/u.test(name)) return "Use be going to + base verb for a prior intention or a prediction based on present evidence.";
  if (/future with will|will for future/u.test(name)) return "Use will + base verb for predictions, spontaneous decisions, offers, and promises.";
  if (/present continuous for future|future arrangements/u.test(name)) return "Use the present continuous with a future time expression for a definite arrangement.";
  if (/conditional inversion/u.test(name)) return "Formal conditional inversion omits if and places were, had, or should before the subject.";
  if (/conditional/u.test(name)) return "Choose the conditional form according to whether the condition and result are real, hypothetical, or counterfactual and when they occur.";
  if (/future perfect continuous/u.test(name)) return "Form the future perfect continuous with will have been + verb-ing to emphasise duration up to a future point.";
  if (/future perfect/u.test(name)) return "Form the future perfect with will have + past participle for an action completed before a future point.";
  if (/future continuous/u.test(name)) return "Form the future continuous with will be + verb-ing for an action in progress at a future time.";
  if (/future/u.test(name)) return "Choose the future form that matches the meaning: plans, arrangements, predictions, or actions in progress/completed by a future time.";
  if (/passive/u.test(name)) return "Form the passive with the appropriate form of be + past participle; use it when the action or affected participant is more important than the agent.";
  if (/reported question/u.test(name)) return "Reported questions use statement word order; yes/no questions generally introduce if or whether.";
  if (/reported speech|reporting verb/u.test(name)) return "In reported speech, adjust pronouns, time references, and verb forms as needed for the reporting context and reporting verb.";
  if (/relative clause/u.test(name)) return "Use a relative pronoun or a reduced relative structure to add information about a noun; retain only forms appropriate to the clause.";
  if (/gerund|infinitive/u.test(name)) return "The verb before an -ing form or infinitive determines which pattern is grammatical; some verbs allow both with a change in meaning.";
  if (/wish|if only|regret/u.test(name)) return "Use wish/if only with a past form for an unreal present, past perfect for past regret, and would for an unwanted future behaviour.";
  if (/causative/u.test(name)) return "Use have/get + object + past participle when someone arranges for another person to do a service or task.";
  if (/question tag/u.test(name)) return "A question tag usually has the opposite polarity to the statement and uses an auxiliary that agrees with its subject and tense.";
  if (/inversion/u.test(name)) return "After a negative or restrictive expression placed at the beginning, use subject–auxiliary inversion.";
  if (/cleft|emphasis|information structure/u.test(name)) return "Cleft structures and fronting place emphasis on a chosen part of the message while preserving the intended meaning.";
  if (/participle|reduced clause/u.test(name)) return "Participle clauses shorten related clauses when the understood subject and time relationship are clear.";
  if (/subjunctive|mandative/u.test(name)) return "Formal mandative clauses commonly use the base form after verbs or expressions of recommendation, demand, or necessity.";
  if (/ellipsis|substitution/u.test(name)) return "Use ellipsis or a substitute form to avoid repeating information that is clear from the surrounding context.";
  if (/determiner|article|quantification/u.test(name)) return "Choose a determiner that matches the noun's countability, number, specificity, and intended quantity.";
  if (/concession|contrast/u.test(name)) return "Concessive structures acknowledge a contrast while maintaining the main clause's point.";
  if (/preposition|collocation/u.test(name)) return "Prepositions and collocations are often fixed by usage; learn the whole phrase and check the surrounding context.";
  if (/hedging|qualification/u.test(name)) return "Use hedging to qualify the strength or certainty of a claim rather than presenting an inference as an established fact.";
  if (/register|tone|stylistic/u.test(name)) return "Choose vocabulary and sentence structure that fit the audience, purpose, and level of formality.";
  if (/ambiguity|implication|pragmatic/u.test(name)) return "Interpret meaning using wording, context, speaker intention, and what is implied rather than stated directly.";
  if (/semantic precision|near-synonym/u.test(name)) return "Choose near-synonyms by their exact meaning, typical collocations, register, and context.";
  if (/nominalization/u.test(name)) return "Nominalization turns actions or qualities into nouns and is common in formal academic style; use it when it improves clarity.";
  return `Use ${title} to express the meaning intended by the sentence; choose the form and word order that fit its context.`;
}

export function getEnglishCurriculumGrammarTopics(level: LevelSlug) {
  return parseGrammarTopics(level);
}

function parseVocabularyEntries(level: LevelSlug): VocabularyEntry[] {
  const lines = sectionContent(level, 1).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  const headerIndex = lines.findIndex((line) => line.includes("\t") && /word/iu.test(line));
  if (headerIndex < 0) return [];
  const headers = lines[headerIndex].split("\t").map((cell) => cell.trim().toLowerCase());
  const wordIndex = headers.findIndex((header) => /word/iu.test(header));
  const partIndex = headers.findIndex((header) => /part of speech|word class/iu.test(header));
  const meaningIndex = headers.findIndex((header) => /meaning|definition/iu.test(header));
  const exampleIndex = headers.findIndex((header) => /example/iu.test(header));
  return lines.slice(headerIndex + 1).flatMap((line, index) => {
    const columns = line.split("\t").map((cell) => cell.trim());
    if (columns.length < 2) return [];
    const target = (columns[wordIndex] ?? "").replace(/^\d+[.)]?\s*/u, "").trim();
    const sourcePartOfSpeech = columns[partIndex] ?? "word";
    if (!target || /^\d+[.)]?$/u.test(target)) return [];
    const description = meaningIndex >= 0 ? columns[meaningIndex] ?? "" : "";
    const sourceExample = exampleIndex >= 0 ? columns[exampleIndex] ?? "" : "";
    const [meaning, combinedExample] = splitMeaningAndExample(description);
    const example = sourceExample || combinedExample || description;
    const partOfSpeech = vocabularyPartOfSpeech(sourcePartOfSpeech);
    const category = `Curriculum · ${sourcePartOfSpeech}`;

    return [{
      id: `english-${level}-curriculum-${slugify(target)}-${index + 1}`,
      language: "english",
      level,
      target,
      translation: meaning || "",
      partOfSpeech,
      sourcePartOfSpeech,
      example: example || `No example sentence was included for ${target}.`,
      exampleTranslation: "",
      collocations: [],
      usageNote: description && sourceExample ? description : "",
      category,
      sourceIds: [],
      verification: "original-sample-needs-dictionary-review",
      definitionProvided: Boolean(meaning),
    }];
  });
}

function splitMeaningAndExample(description: string): [string, string] {
  const text = description.trim();
  const boundary = text.search(/\.\s+(?=[A-Z“])/u);
  if (boundary < 0) return [text, ""];
  return [text.slice(0, boundary + 1), text.slice(boundary + 2)];
}

function vocabularyPartOfSpeech(value: string): VocabularyPartOfSpeech {
  const normalized = value.toLowerCase();
  if (normalized.includes("phrasal verb")) return "phrasal verb";
  if (normalized.includes("verb")) return "verb";
  if (normalized.includes("noun")) return "noun";
  if (normalized.includes("adjective")) return "adjective";
  if (normalized.includes("adverb")) return "adverb";
  if (normalized.includes("preposition")) return "preposition";
  if (normalized.includes("conjunction")) return "conjunction";
  return "expression";
}

export function getEnglishCurriculumVocabularyEntries(level: LevelSlug) {
  return parseVocabularyEntries(level);
}

function readingSentences(passage: string) {
  return passage.replace(/\s+/gu, " ").match(/[^.!?]+[.!?]?/gu)?.map((sentence) => sentence.trim()).filter((sentence) => sentence.length > 12) ?? [];
}

const questionStopWords = new Set("a an and are as at be by can did do does for from has have how in is it of on or the their them there they this to was were what when where which who why with would".split(" "));

function questionTokens(value: string) {
  return value.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter((token) => token.length > 2 && !questionStopWords.has(token)) ?? [];
}

function candidatePassages(passage: string) {
  const sentences = readingSentences(passage);
  return sentences.map((sentence, index) => [sentence, `${sentence} ${sentences[index + 1] ?? ""}`].filter((text) => text.length > 12));
}

function makeReadingQuestion(question: string, passage: string, index: number): SkillQuestion {
  const candidates = candidatePassages(passage).flat();
  const tokens = questionTokens(question);
  const ranked = candidates.map((text, candidateIndex) => ({
    text,
    candidateIndex,
    score: tokens.reduce((score, token) => score + (questionTokens(text).includes(token) ? 1 : 0), 0),
  })).sort((left, right) => right.score - left.score || left.candidateIndex - right.candidateIndex);
  const correct = ranked[0]?.text ?? passage.slice(0, 180);
  const distractors = ranked.map((item) => item.text).filter((text) => text !== correct);
  const options = [correct, ...distractors.slice(Math.max(0, Math.floor(distractors.length / 2)), Math.max(0, Math.floor(distractors.length / 2)) + 2)];
  while (options.length < 3) options.push(`The text does not provide this detail (option ${options.length}).`);
  const uniqueOptions = [...new Set(options)].slice(0, 3);

  return {
    prompt: `Which part of the text best answers question ${index + 1}: ${question}`,
    type: "choice",
    options: uniqueOptions,
    acceptedAnswers: [correct],
    explanation: `The relevant detail is: “${correct}”`,
  };
}

function parseReadingLessons(level: LevelSlug): ReadingLesson[] {
  const content = sectionContent(level, 2);
  const headings = [...content.matchAll(/^Reading\s+\d+[.:]\s*(.+)$/gmu)];
  return headings.map((heading, index) => {
    const start = (heading.index ?? 0) + heading[0].length;
    const end = headings[index + 1]?.index ?? content.length;
    const blockLines = content.slice(start, end).split(/\r?\n/u);
    const questionStart = blockLines.findIndex((line) => /^\s*Questions?\s*:?\s*$/iu.test(line));
    const passageLines = blockLines.slice(0, questionStart < 0 ? blockLines.length : questionStart).map((line) => line.trim()).filter(Boolean);
    const genre = passageLines[0] && passageLines[0].split(/\s+/u).length <= 5 && !/[.!?]$/u.test(passageLines[0])
      ? passageLines.shift()!
      : "Reading comprehension";
    const passage = passageLines.join("\n");
    const rawQuestions = questionStart < 0 ? [] : blockLines.slice(questionStart + 1)
      .map((line) => line.trim().replace(/^[•●▪]\s*/u, "").replace(/^\d+[.)]\s*/u, ""))
      .filter(Boolean);

    return {
      id: `english-${level}-curriculum-reading-${index + 1}`,
      title: heading[1].trim(),
      genre,
      passage,
      glossary: [],
      questions: rawQuestions.map((question, questionIndex) => makeReadingQuestion(question, passage, questionIndex)),
    };
  });
}

export function getEnglishCurriculumReadingLessons(level: LevelSlug) {
  return parseReadingLessons(level);
}

function parseWordRange(lines: string[], level: LevelSlug): [number, number] {
  const range = lines.join(" ").match(/(?:Suggested length|approximately)\s*:?\s*(\d+)\s*[–-]\s*(\d+)\s*words/iu)
    ?? lines.join(" ").match(/(\d+)\s*[–-]\s*(\d+)\s*words/iu);
  if (range) return [Number(range[1]), Number(range[2])];
  const defaultRanges: Record<LevelSlug, [number, number]> = {
    a1: [80, 100],
    a2: [100, 120],
    b1: [150, 180],
    b2: [220, 260],
    c1: [280, 350],
    c2: [350, 450],
  };
  return defaultRanges[level];
}

function parseWritingTasks(level: LevelSlug): WritingTask[] {
  const content = sectionContent(level, 3);
  const headings = [...content.matchAll(/^Topic\s+\d+\s*[.:]\s*(.+)$/gmu)];
  return headings.map((heading, index) => {
    const start = (heading.index ?? 0) + heading[0].length;
    const end = headings[index + 1]?.index ?? content.length;
    const lines = content.slice(start, end).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
    const prompt = lines.find((line) => /^(?:Write|Describe|Tell|Explain|Discuss|Imagine|Compare|Argue|Evaluate|Examine|Consider|Reflect|Your task|Task:)/iu.test(line))
      ?? lines[0]
      ?? `Complete the ${level.toUpperCase()} writing task.`;
    const instructionLines = lines.filter((line) => line !== prompt);
    const [minWords, maxWords] = parseWordRange(lines, level);
    const normalizedPrompt = prompt.replace(/^Task:\s*/iu, "");
    const format = /email|letter/iu.test(`${heading[1]} ${prompt}`) ? "Email or letter"
      : /story|experience|personal account/iu.test(`${heading[1]} ${prompt}`) ? "Personal writing"
        : /essay|discuss|argument/iu.test(`${heading[1]} ${prompt}`) ? "Essay"
          : /proposal/iu.test(`${heading[1]} ${prompt}`) ? "Proposal" : "Writing task";

    return {
      id: `english-${level}-curriculum-writing-${index + 1}-${slugify(heading[1])}`,
      title: heading[1].trim(),
      format,
      prompt: normalizedPrompt,
      instructions: instructionLines.join("\n"),
      minWords,
      maxWords,
    };
  });
}

export function getEnglishCurriculumWritingTasks(level: LevelSlug) {
  return parseWritingTasks(level);
}
