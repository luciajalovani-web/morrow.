import type { GrammarExercise, GrammarTopic } from "@/app/lib/grammar-content";

const frenchArticles = ["un", "une", "des", "le", "la", "les", "l’"];
const englishArticles = ["a", "an", "the"];
const frenchPronouns = ["je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles"];
const englishPronouns = ["I", "you", "he", "she", "it", "we", "they"];
const frenchPrepositions = ["à", "de", "en", "dans", "sur", "chez", "pour", "par"];
const englishPrepositions = ["in", "on", "at", "to", "from", "with", "for", "by"];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLocaleLowerCase();
}

function isFiller(value: string) {
  const words = value.trim().split(/\s+/u);
  return value.length <= 42
    && words.length <= 4
    && /^[\p{L}\p{M}'’ -]+$/u.test(value.trim())
    && !/^(?:use|rule|correct|incorrect|choose|form|sentence|subject|tense|means|normally|requires|explanation)\b/iu.test(value.trim());
}

function commonEdge(values: string[], fromEnd = false) {
  const first = values[0] ?? "";
  let length = 0;
  while (length < first.length && values.every((value) => {
    const index = fromEnd ? value.length - length - 1 : length;
    return value[index] === first[index];
  })) length += 1;
  return fromEnd ? first.slice(first.length - length) : first.slice(0, length);
}

function sentenceFillers(question: GrammarExercise) {
  const options = question.options ?? [];
  const acceptedIndex = options.findIndex((option) =>
    question.acceptedAnswers.some((answer) => normalize(answer) === normalize(option)),
  );
  if (options.length < 2 || acceptedIndex < 0) return undefined;
  const prefix = commonEdge(options);
  const suffix = commonEdge(options, true);
  const fillers = options.map((option) => option.slice(prefix.length, option.length - suffix.length));
  if (!fillers.every(isFiller) || fillers.some((filler) => !filler.trim())) return undefined;
  const acceptedAnswer = fillers[acceptedIndex].trim();
  const prompt = `${prefix.trimEnd()} _____ ${suffix.trimStart()}`.replace(/\s+([,.;!?])/gu, "$1").trim();
  return { prompt, options: fillers.map((filler) => filler.trim()), acceptedAnswers: [acceptedAnswer] };
}

function correctedSentenceFiller(source: string, acceptedAnswer: string) {
  let prefix = 0;
  while (prefix < source.length && prefix < acceptedAnswer.length && source[prefix] === acceptedAnswer[prefix]) prefix += 1;
  let suffix = 0;
  while (
    suffix < source.length - prefix
    && suffix < acceptedAnswer.length - prefix
    && source[source.length - suffix - 1] === acceptedAnswer[acceptedAnswer.length - suffix - 1]
  ) suffix += 1;
  const original = source.slice(prefix, source.length - suffix).trim();
  const correction = acceptedAnswer.slice(prefix, acceptedAnswer.length - suffix).trim();
  if (!original || !isFiller(correction)) return undefined;
  const prompt = `${source.slice(0, prefix)}_____${source.slice(source.length - suffix)}`.replace(/\s+/gu, " ").trim();
  return { prompt, answer: correction };
}

function frenchSource(prompt: string, topic?: GrammarTopic) {
  const source = prompt.match(/«\s*([\s\S]*?)\s*»\s*—/u)?.[1]
    ?? prompt.match(/“([\s\S]*?)”\s*—/u)?.[1]
    ?? prompt;
  const danglingHint = source.match(/^\(([^()]*)\)$/u)?.[1];
  if (danglingHint && topic) {
    const raw = topic.curriculumExercises?.join(" ") ?? "";
    const index = raw.toLocaleLowerCase().lastIndexOf(source.toLocaleLowerCase());
    const preceding = index < 0 ? "" : raw.slice(0, index).split(/[.!?]/u).at(-1)?.trim() ?? "";
    return preceding ? `${preceding} (${danglingHint})` : source;
  }
  return source;
}

function subjectBeforeBlank(source: string) {
  const before = source.split(/_{2,}/u)[0] ?? "";
  const match = before.match(/(?:^|\s)(j['’]|je|tu|il|elle|on|nous|vous|ils|elles|i|you|we|they|he|she|it|[A-ZÀ-ÖØ-Þ][\p{L}'’-]*(?:\s+[A-ZÀ-ÖØ-Þ][\p{L}'’-]*)?)\s*$/u);
  return normalize(match?.[1] ?? "");
}

function englishSource(prompt: string) {
  const source = prompt.match(/For this exercise,\s*“([\s\S]*?)”\s*—/u)?.[1] ?? prompt;
  const firstBullet = source.match(/•\s*([^•]+)/u)?.[1];
  return firstBullet?.trim() ?? source;
}

function curriculumCue(topic: GrammarTopic, source: string) {
  const raw = topic.curriculumExercises?.join(" ") ?? "";
  const lastWord = source.match(/([\p{L}]+)[^ \p{L}]*$/u)?.[1];
  if (!lastWord) return undefined;
  const index = raw.toLocaleLowerCase().lastIndexOf(lastWord.toLocaleLowerCase());
  if (index < 0) return undefined;
  return raw.slice(index + lastWord.length).match(/^\s*_{0,}\s*[.!?]?\s*\(([^()]*)\)/u)?.[1];
}

function pluralEnglish(noun: string) {
  const irregular: Record<string, string> = {
    child: "children", man: "men", woman: "women", person: "people", foot: "feet", tooth: "teeth", mouse: "mice",
  };
  if (irregular[noun.toLowerCase()]) return irregular[noun.toLowerCase()];
  if (/(?:s|sh|ch|x|z|o)$/iu.test(noun)) return `${noun}es`;
  if (/[^aeiou]y$/iu.test(noun)) return `${noun.slice(0, -1)}ies`;
  return `${noun}s`;
}

function englishPastParticiple(verb: string) {
  const irregular: Record<string, string> = {
    be: "been", become: "become", begin: "begun", break: "broken", build: "built", buy: "bought",
    come: "come", do: "done", eat: "eaten", find: "found", get: "got", give: "given", go: "gone",
    have: "had", know: "known", make: "made", read: "read", see: "seen", speak: "spoken",
    take: "taken", write: "written",
  };
  if (irregular[verb]) return irregular[verb];
  if (verb.endsWith("e")) return `${verb}d`;
  if (/[^aeiou]y$/u.test(verb)) return `${verb.slice(0, -1)}ied`;
  return `${verb}ed`;
}

function englishAnswer(topic: string, source: string) {
  const title = normalize(topic);
  const sentence = normalize(source);
  const subject = subjectBeforeBlank(source);
  const blankIndex = source.search(/_{2,}/u);
  const after = blankIndex < 0 ? "" : source.slice(blankIndex + 3).trim();
  const hint = source.match(/\(([^()]*)\)/u)?.[1]?.trim();
  const verb = hint?.split(/\s*\/\s*|\s+/u).filter(Boolean).at(-1)?.toLowerCase();
  const clause = source.replace(/^[•●▪]\s*/u, "").trim();
  const subjectVerb = clause.match(/^(i|you|we|they|he|she|it|my\s+\w+|the\s+\w+|your\s+\w+|our\s+\w+|their\s+\w+)\s+([\p{L}']+)\b/iu);
  const clauseSubject = normalize(subjectVerb?.[1] ?? "");
  const clauseVerb = subjectVerb?.[2] ?? "";
  const inlineChoices = source.match(/\(([^()]*\/[^()]*)\)/u)?.[1]?.split("/").map((choice) => choice.trim());
  const pluralSubjects = ["you", "we", "they", "children", "parents", "friends", "people"];
  const lastSubjectWord = subject.split(/\s+/u).at(-1) ?? "";
  const isPlural = pluralSubjects.includes(lastSubjectWord) || /s$/u.test(lastSubjectWord) && !/(?:ss|us|is)$/u.test(lastSubjectWord);

  if (inlineChoices?.length && /this|that|these|those|demonstrative/u.test(title)) {
    const plural = /\b(?:are|shoes|friends|books|people)\b/u.test(sentence);
    const distant = /\b(?:over there|across the street|far away)\b/u.test(sentence);
    const wanted = plural ? distant ? "those" : "these" : distant ? "that" : "this";
    return inlineChoices.find((choice) => normalize(choice) === wanted);
  }
  if (inlineChoices?.length && /pronoun/u.test(title)) {
    const next = sentence.slice(sentence.lastIndexOf("(") + 1).split(")")[1]?.trim() ?? "";
    const possessive = /possessive/u.test(title) || /\b(?:house|dog|parents|brother|sister|friend|car|book|name|family)\b/u.test(next);
    return inlineChoices.find((choice) => possessive
      ? /^(?:my|his|her|their|our|your)$/iu.test(choice)
      : /^(?:i|you|he|she|it|we|they)$/iu.test(choice));
  }
  if (inlineChoices?.length && /modal.*deduction|deduction.*modal/u.test(title)) {
    if (/\b(?:car is outside|lights are on|evidence)\b/u.test(sentence)) return inlineChoices.find((choice) => normalize(choice) === "must");
    return inlineChoices.find((choice) => normalize(choice) === "can't") ?? inlineChoices[0];
  }
  if (inlineChoices?.length && /near.synonym|semantic precision/u.test(title)) {
    return inlineChoices.find((choice) => normalize(choice) === "profound") ?? inlineChoices[0];
  }
  if (inlineChoices?.length && /conditional/u.test(title)) {
    if (/second conditional|first and second conditional/u.test(title) && /\b(?:were|had|unreal|unlikely)\b/u.test(sentence)) {
      return inlineChoices.find((choice) => normalize(choice).includes("would"));
    }
    return inlineChoices.find((choice) => normalize(choice).includes("will")) ?? inlineChoices[0];
  }
  if (inlineChoices?.length && /present perfect.*continuous|past perfect.*past simple/u.test(title)) {
    const ongoing = /\b(?:for|since|haven't finished|havent finished)\b/u.test(sentence);
    return inlineChoices.find((choice) => ongoing ? /been|continuous|had left/u.test(normalize(choice)) : !/been|continuous/u.test(normalize(choice)));
  }
  if (inlineChoices?.length && /past simple.*past continuous|past continuous.*past simple/u.test(title)) {
    const ongoing = /\b(?:when|while)\b/u.test(sentence);
    return inlineChoices.find((choice) => ongoing ? /\bwas\b|\bwere\b|\bing\b/u.test(normalize(choice)) : !/\bwas\b|\bwere\b|\bing\b/u.test(normalize(choice)));
  }
  if (/singular and plural|plural noun|plural form/u.test(title)) {
    const noun = source.match(/^[\s“”'’]*(?:a|an|the)?\s*([\p{L}]+)/iu)?.[1];
    return noun ? pluralEnglish(noun) : undefined;
  }
  if (/countable and uncountable/u.test(title)) {
    return source.match(/^[\s“”'’]*([\p{L}]+)/u)?.[1]?.toLowerCase();
  }
  if (/some.*any|any.*some/u.test(title)) {
    if (/\b(?:not|n't|never|hardly|without|question|any)\b/u.test(sentence)) return "any";
    if (/\b(?:would you like|could i have|offer|request)\b/u.test(sentence)) return "some";
    return "some";
  }
  if (/article/u.test(title) && blankIndex >= 0) {
    const nextWord = after.match(/^(?:a|an|the)?\s*([\p{L}]+)/iu)?.[1];
    if (!nextWord) return undefined;
    return /^(?:honest|hour|heir|honour)/iu.test(nextWord) || /^[aeiou]/iu.test(nextWord) ? "an" : "a";
  }
  if (/verb to be|\bbe\b/u.test(title) && blankIndex >= 0) {
    if (subject === "i") return "am";
    if (["you", "we", "they"].includes(subject) || isPlural) return "are";
    return "is";
  }
  if (/verb to be|\bbe\b/u.test(title) && subjectVerb) {
    if (clauseSubject === "i") return "am";
    if (["you", "we", "they"].includes(clauseSubject) || /\b(?:parents|students|children|friends)\b/u.test(clauseSubject)) return "are";
    return "is";
  }
  if (/have got|has got/u.test(title) && blankIndex >= 0) {
    return ["he", "she", "it"].includes(subject) || !["i", "you", "we", "they"].includes(subject) && !isPlural ? "has got" : "have got";
  }
  if (/there is|there are/u.test(title)) {
    const noun = after.match(/^(?:a|an|the)?\s*([\p{L}]+)/iu)?.[1] ?? "";
    return pluralEnglish(noun) === noun ? "There is" : "There are";
  }
  if (verb && /present continuous/u.test(title)) {
    const person = subject || clauseSubject;
    const auxiliary = person === "i" ? "am" : ["you", "we", "they"].includes(person) || isPlural ? "are" : "is";
    return `${auxiliary} ${verb.endsWith("e") ? `${verb.slice(0, -1)}ing` : `${verb}ing`}`;
  }
  if (verb && /past simple/u.test(title)) {
    const irregular: Record<string, string> = { be: "was", buy: "bought", come: "came", do: "did", eat: "ate", get: "got", go: "went", have: "had", make: "made", see: "saw", take: "took", write: "wrote" };
    if (irregular[verb]) return irregular[verb];
    if (verb.endsWith("e")) return `${verb}d`;
    if (/[^aeiou]y$/u.test(verb)) return `${verb.slice(0, -1)}ied`;
    return `${verb}ed`;
  }
  if (/imperative/u.test(title) && blankIndex >= 0) {
    const hint = source.match(/\(([^()]*)\)/u)?.[1] ?? "";
    if (/not\s*\//iu.test(hint)) {
      const verbToNegate = hint.split("/").at(-1)?.trim();
      return verbToNegate ? `don't ${verbToNegate}` : undefined;
    }
    return hint.match(/[\p{L}]+/u)?.[0]?.toLowerCase();
  }
  if (verb && /present simple/u.test(title)) {
    if (["i", "you", "we", "they"].includes(subject) || isPlural) return verb;
    if (/[^aeiou]y$/u.test(verb)) return `${verb.slice(0, -1)}ies`;
    if (/(?:s|sh|ch|x|o)$/u.test(verb)) return `${verb}es`;
    return `${verb}s`;
  }
  if (/present simple.*negative|negative.*present simple/u.test(title) && subjectVerb) {
    return ["he", "she", "it"].includes(clauseSubject) || /\b(?:my father|my mother|my sister|my brother|the teacher|the student)\b/u.test(clauseSubject)
      ? "doesn't"
      : "don't";
  }
  if (/present simple.*question|question.*present simple/u.test(title) && subjectVerb) {
    return ["he", "she", "it"].includes(clauseSubject) || /\b(?:my father|my mother|my sister|my brother|the teacher|the student)\b/u.test(clauseSubject)
      ? "Does"
      : "Do";
  }
  if (/past simple.*negative|negative.*past simple/u.test(title)) return "didn't";
  if (/past simple.*question|question.*past simple/u.test(title)) return "Did";
  if (/used to|would/u.test(title)) {
    if (/\b(?:every|each|when i was|in the past|used to|would)\b/u.test(sentence)) {
      return /\b(?:every|each|always|repeatedly)\b/u.test(sentence) ? "would" : "used to";
    }
    return "used to";
  }
  if (/question tag/u.test(title)) {
    const tag = source.match(/,\s*_{2,}\s*\?/u);
    if (tag) {
      const subjectMatch = sentence.match(/\b(?:i|you|he|she|it|we|they)\b[^,]*,\s*_{2,}/u)?.[0];
      const subject = subjectMatch?.match(/\b(i|you|he|she|it|we|they)\b[^,]*,/u)?.[1] ?? "you";
      if (/\b(?:doesn't|does not|isn't|is not|hasn't|has not)\b/u.test(sentence)) {
        const auxiliary = /\b(?:isn't|is not)\b/u.test(sentence) ? "is" : /\b(?:hasn't|has not)\b/u.test(sentence) ? "has" : "does";
        return `${auxiliary} ${subject}`;
      }
      if (/\b(?:don't|do not|aren't|are not|haven't|have not)\b/u.test(sentence)) {
        const auxiliary = /\b(?:aren't|are not)\b/u.test(sentence) ? "are" : /\b(?:haven't|have not)\b/u.test(sentence) ? "have" : "do";
        return `${auxiliary} ${subject}`;
      }
      const aux = sentence.match(/\b(am|is|are|was|were|do|does|did|can|will|has|have)\b/u)?.[1];
      const negative: Record<string, string> = { am: "aren't", is: "isn't", are: "aren't", was: "wasn't", were: "weren't", do: "don't", does: "doesn't", did: "didn't", can: "can't", will: "won't", has: "hasn't", have: "haven't" };
      return `${negative[aux ?? "is"] ?? "isn't"} ${subject}`;
    }
  }
  if (/reported speech|reported questions/u.test(title)) {
    if (/\bi work\b/u.test(sentence)) return "worked";
    if (/\bwe have finished\b/u.test(sentence)) return "had finished";
    if (/\bi bought\b/u.test(sentence)) return "had bought";
    if (/\bwhere do you live\b/u.test(sentence)) return "lived";
    if (/\bwhat time does\b/u.test(sentence)) return "left";
    if (/\bi am\b/u.test(sentence)) return "was";
    if (/\bi will\b/u.test(sentence)) return "would";
    return "that";
  }
  if (/passive voice/u.test(title) && /published the results/u.test(sentence)) return "were published";
  if (/present perfect/u.test(title) && verb) {
    const auxiliary = ["he", "she", "it"].includes(subject) ? "has" : "have";
    const negative = /\b(?:not|n't)\b/u.test(hint ?? "") || /\bnot\b/u.test(sentence);
    const participle = englishPastParticiple(verb);
    return `${negative ? auxiliary === "has" ? "hasn't" : "haven't" : auxiliary} ${participle}`;
  }
  if (/third conditional/u.test(title) || /conditional.*past/u.test(title) && /\bwould have\b/u.test(sentence)) {
    return verb ? `had ${englishPastParticiple(verb)}` : undefined;
  }
  if (/mixed conditional/u.test(title)) {
    if (/now|today|currently/u.test(sentence)) return verb ? `would ${verb}` : "would be";
    return verb ? `would have ${englishPastParticiple(verb)}` : "would have been";
  }
  if (/first conditional/u.test(title) && verb) {
    if (/\bwill\b/u.test(sentence) && subject === "it") {
      if (verb.endsWith("y")) return `${verb.slice(0, -1)}ies`;
      if (/(?:s|sh|ch|x|o)$/u.test(verb)) return `${verb}es`;
      return `${verb}s`;
    }
    return verb;
  }
  if (/present perfect.*ever|present perfect.*never/u.test(title) && verb) {
    const participle = englishPastParticiple(verb);
    return `${subject === "he" || subject === "she" || subject === "it" ? "has" : "have"} ${participle}`;
  }
  if (/present perfect.*just|present perfect.*already|present perfect.*yet/u.test(title)) return "already";
  if (/present perfect continuous/u.test(title) && verb) {
    const ing = verb.endsWith("e") ? `${verb.slice(0, -1)}ing` : `${verb}ing`;
    return `have been ${ing}`;
  }
  if (/past perfect/u.test(title) && verb) {
    const participle = englishPastParticiple(verb ?? "");
    const adverb = /\balready\b/u.test(hint ?? "") ? "already " : /\bnever\b/u.test(hint ?? "") ? "never " : "";
    return `${/\bnot\b/u.test(hint ?? "") ? "hadn't" : "had"} ${adverb}${participle}`;
  }
  if (/future continuous/u.test(title) && verb) {
    const ing = verb.endsWith("e") ? `${verb.slice(0, -1)}ing` : `${verb}ing`;
    return `will be ${ing}`;
  }
  if (/future perfect/u.test(title) && verb) return `will have ${englishPastParticiple(verb)}`;
  if (/future perfect continuous/u.test(title) && verb) {
    const ing = verb.endsWith("e") ? `${verb.slice(0, -1)}ing` : `${verb}ing`;
    return `will have been ${ing}`;
  }
  if (/advanced future forms/u.test(title)) {
    if (/look at those clouds|look at the clouds/u.test(sentence)) return "is going to";
    if (/this time tomorrow/u.test(sentence)) return "will be";
    if (/by the time|by friday/u.test(sentence)) return "will have";
    if (/train .*tomorrow|leaves? at/u.test(sentence)) return "leaves";
    return "will";
  }
  if (/conditional/u.test(title) && verb) {
    if (/\bhad\b|\bwould have\b/u.test(sentence)) return `would have ${englishPastParticiple(verb)}`;
    if (/\blived\b|\bwere\b|\bif i\b/u.test(sentence)) return `would ${verb}`;
    return `will ${verb}`;
  }
  if (/passive/u.test(title) && verb) {
    const past = /\b(?:last|yesterday|ago)\b/u.test(sentence);
    const ongoing = /\b(?:at the moment|right now|currently)\b/u.test(sentence);
    const plural = /\b(?:documents|results|cars|people|houses)\b/u.test(sentence);
    const auxiliary = past ? plural ? "were" : "was" : plural ? "are" : "is";
    const participle = englishPastParticiple(verb);
    const negative = /\bnot\b/u.test(hint ?? "");
    const tense = ongoing && !past ? `${plural ? "are" : "is"} being` : auxiliary;
    return `${negative ? `${tense} not` : tense} ${participle}`;
  }
  if (/possessive/u.test(title)) {
    const owner = source.match(/\bof\s+(?:(?:my|your|his|her|our|their|the)\s+)?([\p{L}'’-]+)/iu)?.[1];
    if (owner) return `${owner}${/s$/iu.test(owner) ? "'" : "'s"}`;
  }
  if (/causative/u.test(title) && hint) {
    const pieces = hint.split(/\s*\/\s*/u);
    const object = pieces[0] ?? "";
    const action = pieces.at(-1) ?? "";
    return `had ${object} ${englishPastParticiple(action)}`;
  }
  if (/reported questions/u.test(title)) {
    if (/where do you live/u.test(sentence)) return "lived";
    if (/what time does .* leave/u.test(sentence)) return "left";
    if (/are you coming/u.test(sentence)) return "was coming";
    return "if";
  }
  if (/reported speech|reported questions/u.test(title) && /\b(?:i am|i have|i will)\b/u.test(sentence)) {
    if (/\bi am\b/u.test(sentence)) return "was";
    if (/\bi have\b/u.test(sentence)) return "had";
    return "would";
  }
  if (/modal verbs.*past|past modal|modal.*past/u.test(title)) {
    if (/\bmistake\b/u.test(sentence)) return "shouldn't have";
    if (/\bforgotten\b/u.test(sentence)) return "might have";
    return "should have";
  }
  if (/modal.*deduction|deduction.*modal/u.test(title)) {
    if (/\b(?:hasn't arrived|hasnt arrived|forgotten)\b/u.test(sentence)) return "might have";
    if (/\b(?:isn't answering|isnt answering)\b/u.test(sentence)) return "must";
    return "can't";
  }
  if (/used to|would/u.test(title) && /\b(?:like|live|be)\b/u.test(sentence)) return "used to";
  if (/passive/u.test(title) && /published the results/u.test(sentence)) return "were published";
  if (/reporting verbs/u.test(title) && verb) {
    return /\b(?:admitted|denied|avoided|finished|suggested)\b/u.test(sentence)
      ? `${verb.endsWith("e") ? `${verb.slice(0, -1)}ing` : `${verb}ing`}`
      : `to ${verb}`;
  }
  if (/would rather/u.test(title) && verb) return /\bnot\b/u.test(hint ?? "") ? `didn't ${verb}` : verb;
  if (/advanced comparisons/u.test(title)) return "the better";
  if (/linking devices|concession/u.test(title)) return "although";
  if (/preposition/u.test(title) && /\bqualified\b/u.test(sentence)) return "for";
  if (/future in the past/u.test(title) && verb) return `would ${verb}`;
  if (/inversion/u.test(title) && /\bnever\b/u.test(sentence)) return "had I ever experienced";
  if (/inversion/u.test(title) && /\brarely\b/u.test(sentence)) return "does she";
  if (/inversion/u.test(title) && /\bif you should\b/u.test(sentence)) return "Should you";
  if (/inversion/u.test(title) && /\bif i had\b/u.test(sentence)) return "Had I known";
  if (/subjunctive|mandative/u.test(title)) return "be";
  if (/participle clause/u.test(title)) {
    if (/\bbecause she had completed\b/u.test(sentence)) return "Having completed";
    if (/\bbecause she was exhausted\b/u.test(sentence)) return "Being exhausted";
    if (/\bbecause he had been informed\b/u.test(sentence)) return "Having been informed";
    return "Exhausted";
  }
  if (/cleft|emphasis/u.test(title)) return "What";
  if (/absolute construction/u.test(title)) {
    if (/\bdocuments having been reviewed\b/u.test(sentence)) return "having been reviewed";
    if (/\bno reasonable alternative\b/u.test(sentence)) return "there being no reasonable alternative";
    if (/\bwork completed\b/u.test(sentence)) return "having completed her work";
    if (/\bmeeting was over\b/u.test(sentence)) return "being over";
    if (/\bweather was perfect\b/u.test(sentence)) return "being perfect";
    if (/\bnegotiations were complete\b/u.test(sentence)) return "being complete";
    if (/\bevidence was insufficient\b/u.test(sentence)) return "being insufficient";
    return "being exceptionally poor";
  }
  if (/linking|discourse marker|rhetorical connector/u.test(title)) return "However";
  if (/advanced preposition|preposition.*collocation/u.test(title)) {
    if (/\bdependent\b/u.test(sentence)) return "on";
    if (/\bin the absence\b/u.test(sentence)) return "in";
    return "for";
  }
  if (/ellipsis|substitution/u.test(title)) return "so does she";
  if (/embedded question|question structure/u.test(title)) return "Could you tell me";
  if (/nominalization/u.test(title)) return "introduction";
  if (/hedging/u.test(title)) return "may";
  if (/idiomatic language/u.test(title)) return "bite";
  if (/modal perfect/u.test(title) && /\bunnecessary\b/u.test(sentence)) return "needn't have";
  if (/advanced modal|perfect infinitive/u.test(title)) return "should";
  if (/advanced comparison|comparison and degree/u.test(title)) return "the more apparent";
  if (/register|stylistic transformation/u.test(title)) return "a serious error";
  if (/ambiguity|pragmatic meaning/u.test(title)) return "might";
  if (/determiner|quantifier/u.test(title)) {
    if (/\bevidence\b/u.test(sentence)) return "little";
    return "few";
  }
  if (/used to|would/u.test(title) && /\bwhen i was a child|in the past\b/u.test(sentence)) return "used to";
  if (/question tag/u.test(title)) {
    const match = sentence.match(/\b(am|is|are|was|were|do|does|did|can|will)\s+([\p{L}]+)[^?]*,\s*_+/u);
    if (!match) return undefined;
    const negative: Record<string, string> = { am: "aren't", is: "isn't", are: "aren't", was: "wasn't", were: "weren't", do: "don't", does: "doesn't", did: "didn't", can: "can't", will: "won't" };
    return `${negative[match[1]]} ${match[2]}`;
  }
  if (/wish|if only/u.test(title)) {
    if (/future|would|annoying|change/u.test(sentence)) return "would";
    if (verb) return verb === "be" ? "were" : englishPastParticiple(verb);
    return "had";
  }
  if (/passive/u.test(title) && !/_{2,}/u.test(source)) {
    const active = source.match(/^[\p{L}]+\s+([\p{L}]+)\s+([\p{L}]+)/u);
    if (active) {
      const verbForm = active[1].toLowerCase();
      const object = active[2];
      return `${/s$/u.test(object) ? "are" : "is"} ${englishPastParticiple(verbForm)}`;
    }
  }
  if (/reported speech.*statement|reported speech/u.test(title)) {
    if (/\bi am\b/u.test(sentence)) return "was";
    if (/\bi have\b/u.test(sentence)) return "had";
    if (/\bi will\b/u.test(sentence)) return "would";
  }
  if (/future with going to|going to/u.test(title)) {
    if (subject === "i" || clauseSubject === "i") return "am going to";
    if (["you", "we", "they"].includes(subject || clauseSubject) || isPlural) return "are going to";
    return "is going to";
  }
  if (/future with will|will for future/u.test(title)) return "will";
  if (/comparative/u.test(title)) {
    const adjective = source.match(/\(([\p{L}]+)\)/u)?.[1]?.toLowerCase() ?? source.match(/\b(?:is|are)\s+([\p{L}]+)\s+than\b/iu)?.[1]?.toLowerCase();
    if (!adjective) return undefined;
    if (adjective === "good") return "better";
    if (adjective === "bad") return "worse";
    if (adjective.endsWith("y")) return `${adjective.slice(0, -1)}ier`;
    return adjective.length > 6 ? `more ${adjective}` : `${adjective}er`;
  }
  if (/superlative/u.test(title)) {
    const adjective = source.match(/\(([\p{L}]+)\)/u)?.[1]?.toLowerCase() ?? "";
    if (!adjective) return undefined;
    if (adjective === "good") return "best";
    if (adjective === "bad") return "worst";
    return adjective.length > 6 ? `the most ${adjective}` : `the ${adjective}est`;
  }
  if (/few.*little|little.*few|much.*many/u.test(title)) {
    if (/\b(?:water|milk|time|money|sugar|rice)\b/u.test(sentence)) return "much";
    return "many";
  }
  if (/must|have to|obligation/u.test(title)) {
    if (/\b(?:prohibited|not allowed|don't|mustn't)\b/u.test(sentence)) return "mustn't";
    if (/\b(?:no need|not necessary|don't have to)\b/u.test(sentence)) return "don't have to";
    return "must";
  }
  if (/should/u.test(title)) return /\b(?:not|shouldn't|bad idea)\b/u.test(sentence) ? "shouldn't" : "should";
  if (/adverb.*manner/u.test(title)) {
    const adjective = source.match(/\(([\p{L}]+)\)/u)?.[1]?.toLowerCase() ?? "";
    if (!adjective) return undefined;
    if (adjective === "good") return "well";
    return adjective.endsWith("y") ? `${adjective.slice(0, -1)}ily` : `${adjective}ly`;
  }
  if (/relative clause/u.test(title)) {
    if (/\b(?:person|woman|man|teacher|student|who)\b/u.test(sentence)) return "who";
    if (/\b(?:place|city|house|where)\b/u.test(sentence)) return "where";
    if (/\b(?:whose|owner)\b/u.test(sentence)) return "whose";
    return "which";
  }
  if (/gerund.*infinitive|gerunds and infinitives/u.test(title)) {
    return /\b(?:enjoy|avoid|finish|mind|suggest)\b/u.test(sentence) ? "verb-ing" : "to + verb";
  }
  if (/adverb.*frequency|frequency adverb/u.test(title)) {
    return source.match(/\((always|usually|often|sometimes|never)\)/iu)?.[1];
  }
  if (/preposition.*place/u.test(title)) {
    if (/\b(?:on|table|floor|wall)\b/u.test(sentence)) return "on";
    if (/\b(?:under|bed|desk)\b/u.test(sentence)) return "under";
    if (/\b(?:behind|next to|between|in front of)\b/u.test(sentence)) return sentence.match(/\b(?:behind|next to|between|in front of)\b/u)?.[0];
    if (/\b(?:supermarket|garden|school|house|bank|station|shop|park)\b/u.test(sentence)) return "next to";
    if (/\b(?:classroom|room|box)\b/u.test(sentence)) return "in";
  }
  if (/preposition.*time/u.test(title)) {
    if (/\b(?:o'clock|clock|night)\b/u.test(sentence)) return "at";
    if (/\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/u.test(sentence)) return "on";
    if (/\b(?:january|february|march|april|may|june|july|august|september|october|november|december|2005|year)\b/u.test(sentence)) return "in";
  }
  if (/can|can't|cannot/u.test(title) && blankIndex >= 0) {
    return /\b(?:fish|baby|cannot|can't|not|impossible)\b/u.test(sentence) ? "can't" : "can";
  }
  if (/conjunction|and.*but.*because/u.test(title) && blankIndex >= 0) {
    if (/\b(?:because|sick|ill)\b/u.test(sentence)) return "because";
    if (/\b(?:but|although|tired|short|however)\b/u.test(sentence)) return "but";
    return "and";
  }
  if (/possessive/u.test(title)) {
    const owner = source.match(/\bof\s+(?:(?:my|your|his|her|our|their|the)\s+)?([\p{L}'’-]+)/iu)?.[1];
    if (owner) return `${owner}${/s$/iu.test(owner) ? "'" : "'s"}`;
  }
  if (clauseVerb && /present simple/u.test(title)) {
    const lemma = normalize(clauseVerb);
    if (["i", "you", "we", "they"].includes(clauseSubject)) return lemma;
    if (/[^aeiou]y$/u.test(lemma)) return `${lemma.slice(0, -1)}ies`;
    if (/(?:s|sh|ch|x|o)$/u.test(lemma)) return `${lemma}es`;
    return `${lemma}s`;
  }
  if (/preposition/u.test(title)) {
    if (/\b(?:clock|o'clock|noon|midnight|night)\b/u.test(sentence)) return "at";
    if (/\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|date)\b/u.test(sentence)) return "on";
    if (/\b(?:month|year|summer|winter|morning|afternoon)\b/u.test(sentence)) return "in";
  }
  if (/pronoun/u.test(title) && blankIndex >= 0) {
    const next = after.toLowerCase();
    const noun = next.match(/^([\p{L}]+)/u)?.[1] ?? "";
    if (/^(?:is|has|works|lives|speaks)\b/u.test(next)) return "he";
    if (/\b(?:sister|mother|woman|girl)\b/u.test(source)) return "she";
    if (/^(?:are|have|work|live|speak)\b/u.test(next)) return "they";
    return noun ? "it" : undefined;
  }
  if (/inversion/u.test(title)) {
    if (/\brarely\b/u.test(sentence)) return "does she";
    if (/\bif you should\b/u.test(sentence)) return "should you";
    if (/\bif i had\b/u.test(sentence)) return "had i";
    return "does";
  }
  if (/conditional/u.test(title)) {
    if (/\bif you should\b/u.test(sentence)) return "should you";
    if (/\bif i had\b/u.test(sentence)) return "had i";
    return "would have";
  }
  if (/modal/u.test(title)) return /\bunnecessary\b/u.test(sentence) ? "needn't have" : "should have";
  if (/participle/u.test(title)) return /\binformed\b/u.test(sentence) ? "having been informed" : "having completed";
  return undefined;
}

function frenchConjugation(topic: GrammarTopic, source: string) {
  const blankIndex = source.search(/_{2,}/u);
  if (blankIndex < 0) return undefined;
  const after = source.slice(blankIndex + 3).trim();
  const subject = subjectBeforeBlank(source);
  const lemma = source.match(/\(\s*(?:se\s+|s['’])?([\p{L}]+)\s*\)/u)?.[1]?.toLocaleLowerCase()
    ?? curriculumCue(topic, source)?.match(/(ouvrir|regarder|prendre|faire|parler)/iu)?.[1]?.toLocaleLowerCase();
  const title = normalize(topic.title);
  const pronoun = subject.replace(/^j['’]$/u, "je");

  if (/pronom sujet|subject pronoun/u.test(title)) {
    const verb = after.match(/^(suis|es|est|sommes|êtes|etes|sont|ai|as|a|avons|avez|ont|parle|parles|parlent|habite|habitent)\b/iu)?.[1];
    const byVerb: Record<string, string> = {
      suis: "je", es: "tu", est: "il", sommes: "nous", etes: "vous", sont: "ils",
      ai: "j’", as: "tu", a: "il", avons: "nous", avez: "vous", ont: "ils",
      parle: "je", parles: "tu", parlent: "ils", habite: "je", habitent: "ils",
    };
    return verb ? byVerb[normalize(verb)] : undefined;
  }

  const subjects: Record<string, string> = {
    je: "je", "j'": "je", "j’": "je", tu: "tu", il: "il", elle: "elle", on: "on",
    nous: "nous", vous: "vous", ils: "ils", elles: "elles",
  };
  const subjectKey = subjects[pronoun] ? pronoun : pronoun.split(/\s+/u).at(-1) ?? "";
  const inferredPronoun = subjects[subjectKey] ?? (/\b(?:parents|amis|enfants|étudiants|etudiants|maisons|décisions|decisions)\b/iu.test(source) ? "ils" : "il");

  if (/reflexive|pronominaux/u.test(title) && lemma) {
    const reflexive: Record<string, string> = { je: "me", tu: "te", il: "se", elle: "se", on: "se", nous: "nous", vous: "vous", ils: "se", elles: "se" };
    const endings: Record<string, string> = { je: "e", tu: "es", il: "e", elle: "e", on: "e", nous: "ons", vous: "ez", ils: "ent", elles: "ent" };
    const stem = lemma.endsWith("er") ? lemma.slice(0, -2) : lemma;
    const form = lemma.endsWith("er") ? `${stem}${endings[inferredPronoun]}` : lemma;
    return `${reflexive[inferredPronoun]} ${form}`;
  }

  if (/verb etre|etre/u.test(title) && !lemma) {
    const forms: Record<string, string> = { je: "suis", tu: "es", il: "est", elle: "est", on: "est", nous: "sommes", vous: "êtes", ils: "sont", elles: "sont" };
    return forms[inferredPronoun];
  }
  if (/verb avoir|avoir/u.test(title) && !lemma) {
    const forms: Record<string, string> = { je: "ai", tu: "as", il: "a", elle: "a", on: "a", nous: "avons", vous: "avez", ils: "ont", elles: "ont" };
    return forms[inferredPronoun];
  }

  if (/article|partitive/u.test(title)) {
    const before = normalize(source.slice(0, blankIndex).trim());
    const noun = normalize(after.match(/^(?:de l['’]|d['’]|un|une|le|la|les|du|des)?\s*([\p{L}]+)/u)?.[1] ?? "");
    const feminine = /^(?:maison|pomme|école|ecole|soupe|musique|eau|voiture|fraise|salade|tomate|orange|adresse|rue|pharmacie|pomme|table|ville|banane|carotte|poire|pêche|peche|cerise)$/u.test(noun);
    const vowel = /^[aeiouh]/u.test(noun);
    const plural = /s$/u.test(noun) && !/ss$/u.test(noun);
    if (/partitive/u.test(title)) return plural ? "des" : feminine ? "de la" : vowel ? "de l’" : "du";
    if (/\b(?:aime|adore|prefere|déteste|deteste)\s*$/u.test(before)) {
      return plural ? "les" : vowel ? "l’" : feminine ? "la" : "le";
    }
    if (/^[\p{L}]+\s+(?:est|sont|se trouve)\b/u.test(after)) {
      return plural ? "les" : vowel ? "l’" : feminine ? "la" : "le";
    }
    return plural ? "des" : vowel ? "un" : feminine ? "une" : "un";
  }

  if (!lemma) return undefined;
  const irregularPresent: Record<string, Record<string, string>> = {
    être: { je: "suis", tu: "es", il: "est", elle: "est", on: "est", nous: "sommes", vous: "êtes", ils: "sont", elles: "sont" },
    avoir: { je: "ai", tu: "as", il: "a", elle: "a", on: "a", nous: "avons", vous: "avez", ils: "ont", elles: "ont" },
    aller: { je: "vais", tu: "vas", il: "va", elle: "va", on: "va", nous: "allons", vous: "allez", ils: "vont", elles: "vont" },
    faire: { je: "fais", tu: "fais", il: "fait", elle: "fait", on: "fait", nous: "faisons", vous: "faites", ils: "font", elles: "font" },
    prendre: { je: "prends", tu: "prends", il: "prend", elle: "prend", on: "prend", nous: "prenons", vous: "prenez", ils: "prennent", elles: "prennent" },
    venir: { je: "viens", tu: "viens", il: "vient", elle: "vient", on: "vient", nous: "venons", vous: "venez", ils: "viennent", elles: "viennent" },
    vouloir: { je: "veux", tu: "veux", il: "veut", elle: "veut", on: "veut", nous: "voulons", vous: "voulez", ils: "veulent", elles: "veulent" },
  };
  const participles: Record<string, string> = {
    être: "été", avoir: "eu", aller: "allé", faire: "fait", prendre: "pris", venir: "venu",
    voir: "vu", pouvoir: "pu", vouloir: "voulu", devoir: "dû", écrire: "écrit", lire: "lu",
  };
  const stem = lemma.endsWith("er") ? lemma.slice(0, -2) : lemma;
  const imperfectEndings: Record<string, string> = { je: "ais", tu: "ais", il: "ait", elle: "ait", on: "ait", nous: "ions", vous: "iez", ils: "aient", elles: "aient" };
  if (/subjonctif|subjunctive/u.test(title)) {
    const irregular: Record<string, Record<string, string>> = {
      être: { je: "sois", tu: "sois", il: "soit", elle: "soit", on: "soit", nous: "soyons", vous: "soyez", ils: "soient", elles: "soient" },
      avoir: { je: "aie", tu: "aies", il: "ait", elle: "ait", on: "ait", nous: "ayons", vous: "ayez", ils: "aient", elles: "aient" },
      faire: { je: "fasse", tu: "fasses", il: "fasse", elle: "fasse", on: "fasse", nous: "fassions", vous: "fassiez", ils: "fassent", elles: "fassent" },
      aller: { je: "aille", tu: "ailles", il: "aille", elle: "aille", on: "aille", nous: "allions", vous: "alliez", ils: "aillent", elles: "aillent" },
      pouvoir: { je: "puisse", tu: "puisses", il: "puisse", elle: "puisse", on: "puisse", nous: "puissions", vous: "puissiez", ils: "puissent", elles: "puissent" },
      savoir: { je: "sache", tu: "saches", il: "sache", elle: "sache", on: "sache", nous: "sachions", vous: "sachiez", ils: "sachent", elles: "sachent" },
      vouloir: { je: "veuille", tu: "veuilles", il: "veuille", elle: "veuille", on: "veuille", nous: "voulions", vous: "vouliez", ils: "veuillent", elles: "veuillent" },
    };
    if (irregular[lemma]) return irregular[lemma][inferredPronoun];
    if (lemma.endsWith("er")) {
      const subjunctiveEndings: Record<string, string> = { je: "e", tu: "es", il: "e", elle: "e", on: "e", nous: "ions", vous: "iez", ils: "ent", elles: "ent" };
      return `${stem}${subjunctiveEndings[inferredPronoun]}`;
    }
  }
  if (/conditionnel/u.test(title)) {
    if (/passe/u.test(title)) {
      const participle = participles[lemma] ?? (lemma.endsWith("er") ? `${stem}é` : lemma.endsWith("ir") ? `${stem}i` : undefined);
      if (!participle) return undefined;
      const usesEtre = /^(?:aller|venir|arriver|partir|sortir|entrer|naître|mourir|tomber|rester|devenir|retourner)$/u.test(lemma);
      const auxStem = usesEtre ? "ser" : "aur";
      const ending: Record<string, string> = { je: "ais", tu: "ais", il: "ait", elle: "ait", on: "ait", nous: "ions", vous: "iez", ils: "aient", elles: "aient" };
      return `${auxStem}${ending[inferredPronoun]} ${participle}`;
    }
    const futureStem = lemma === "être" ? "ser" : lemma === "avoir" ? "aur" : lemma === "aller" ? "ir" : lemma === "faire" ? "fer" : lemma.endsWith("re") ? lemma.slice(0, -1) : lemma;
    return `${futureStem}${imperfectEndings[inferredPronoun]}`;
  }
  if (/passe simple|passé simple/u.test(title)) {
    const simpleStems: Record<string, string> = { découvrir: "découvr", prononcer: "prononç", prendre: "pr", être: "f", avoir: "e", faire: "f" };
    const endings: Record<string, string> = lemma.endsWith("er")
      ? { je: "ai", tu: "as", il: "a", elle: "a", on: "a", nous: "âmes", vous: "âtes", ils: "èrent", elles: "èrent" }
      : { je: "is", tu: "is", il: "it", elle: "it", on: "it", nous: "îmes", vous: "îtes", ils: "irent", elles: "irent" };
    const stemForVerb = simpleStems[lemma] ?? (lemma.endsWith("er") ? lemma.slice(0, -2) : lemma);
    return `${stemForVerb}${endings[inferredPronoun]}`;
  }
  if (/plus-que-parfait/u.test(title)) {
    const participle = participles[lemma] ?? (lemma.endsWith("er") ? `${stem}é` : lemma.endsWith("ir") ? `${stem}i` : undefined);
    if (!participle) return undefined;
    const usesEtre = /^(?:aller|venir|arriver|partir|sortir|entrer|naître|mourir|tomber|rester|devenir|retourner)$/u.test(lemma);
    const auxiliary = usesEtre
      ? ({ je: "étais", tu: "étais", il: "était", elle: "était", on: "était", nous: "étions", vous: "étiez", ils: "étaient", elles: "étaient" } as Record<string, string>)[inferredPronoun]
      : ({ je: "avais", tu: "avais", il: "avait", elle: "avait", on: "avait", nous: "avions", vous: "aviez", ils: "avaient", elles: "avaient" } as Record<string, string>)[inferredPronoun];
    return `${auxiliary} ${participle}`;
  }
  if (/passé composé|passe compose|past participle/u.test(title)) {
    const participle = participles[lemma] ?? (lemma.endsWith("er") ? `${stem}é` : lemma.endsWith("ir") ? `${stem}i` : undefined);
    if (participle) {
      const usesEtre = /^(?:aller|venir|arriver|partir|sortir|entrer|naître|mourir|tomber|rester|devenir|retourner)$/u.test(lemma);
      const auxiliary = usesEtre
        ? ({ je: "suis", tu: "es", il: "est", elle: "est", on: "est", nous: "sommes", vous: "êtes", ils: "sont", elles: "sont" } as Record<string, string>)[inferredPronoun]
        : ({ je: "ai", tu: "as", il: "a", elle: "a", on: "a", nous: "avons", vous: "avez", ils: "ont", elles: "ont" } as Record<string, string>)[inferredPronoun];
      return `${auxiliary} ${participle}`;
    }
  }
  if (/gérondif|gerondif/u.test(title)) return `en ${lemma.endsWith("er") ? `${stem}ant` : `${lemma}ant`}`;
  if (/participe présent|participe present/u.test(title)) return lemma.endsWith("er") ? `${stem}ant` : `${lemma}ant`;
  if (/verb etre|etre/u.test(title) && irregularPresent["être"]) return irregularPresent["être"][inferredPronoun];
  if (/verb avoir|avoir/u.test(title) && irregularPresent.avoir) return irregularPresent.avoir[inferredPronoun];
  if (/present|présent|regular -er|common irregular/u.test(title)) {
    if (irregularPresent[lemma]) return irregularPresent[lemma][inferredPronoun];
    if (lemma.endsWith("er")) {
      const stem = lemma.slice(0, -2);
      const endings: Record<string, string> = { je: "e", tu: "es", il: "e", elle: "e", on: "e", nous: "ons", vous: "ez", ils: "ent", elles: "ent" };
      return `${stem}${endings[inferredPronoun]}`;
    }
  }
  if (/imparfait/u.test(title)) {
    const imperfectStem = lemma === "être" ? "ét" : lemma.endsWith("er") ? `${stem}${lemma.endsWith("ger") && inferredPronoun === "nous" ? "e" : ""}` : stem;
    return `${imperfectStem}${imperfectEndings[inferredPronoun]}`;
  }
  if (/futur|future/u.test(title)) {
    const stem = lemma.endsWith("re") ? lemma.slice(0, -1) : lemma;
    const endings: Record<string, string> = { je: "ai", tu: "as", il: "a", elle: "a", on: "a", nous: "ons", vous: "ez", ils: "ont", elles: "ont" };
    return `${stem}${endings[inferredPronoun]}`;
  }
  if (/imperative|impératif/u.test(title)) {
    const forms: Record<string, string> = {
      ouvrir: "ouvre", regarder: "regarde", prendre: /\bvos\b/iu.test(source) ? "prenez" : "prends",
      faire: /\bvos\b/iu.test(source) ? "faites" : "fais", parler: /\bvos\b/iu.test(source) ? "parlez" : "parle",
    };
    return forms[lemma] ?? (lemma.endsWith("er") ? `${lemma.slice(0, -2)}e` : undefined);
  }
  return undefined;
}

function targetAnswer(topic: GrammarTopic, question: GrammarExercise) {
  const current = question.acceptedAnswers[0] ?? "";
  if (isFiller(current) && !/^(?:true|false)$/iu.test(current)) return current.trim();
  const source = topic.language === "french" ? frenchSource(question.prompt, topic) : englishSource(question.prompt);
  const correction = correctedSentenceFiller(source, current);
  if (correction) return correction.answer;
  if (topic.language === "english") return englishAnswer(topic.title, source);
  const title = normalize(topic.title);
  const sentence = normalize(source);
  if (/imperative|imperatif/u.test(title)) {
    const hint = source.match(/\(([^()]*)\)/u)?.[1] ?? "";
    const verb = hint.split(/\s*\/\s*|\s+/u).filter((part) => /^[\p{L}]+$/u.test(part)).at(-1)?.toLowerCase();
    const plural = /\b(?:vos|vous)\b/u.test(source);
    if (/\bne\b|\bpas\b/u.test(hint)) return plural ? "ne parlez pas" : "ne parle pas";
    if (verb === "faire") return plural ? "faites" : "fais";
    if (verb === "prendre") return plural ? "prenez" : "prends";
    if (verb === "parler") return plural ? "parlez" : "parle";
    if (verb === "regarder") return plural ? "regardez" : "regarde";
    return plural ? "ouvrez" : "ouvre";
  }
  if (/reflexive|pronominaux/u.test(title) && !/\b_{2,}\b/u.test(source)) return "me lève";
  if (/il faut/u.test(title)) return "faut";
  if (/recent past|passe recent/u.test(title)) {
    const subject = subjectBeforeBlank(source);
    const auxiliary = subject === "je" ? "viens" : subject === "tu" ? "viens" : subject === "nous" ? "venons" : subject === "vous" ? "venez" : subject === "ils" || subject === "elles" ? "viennent" : "vient";
    return `${auxiliary} de`;
  }
  if (/numbers|dates|time|heure|date|nombre/u.test(title)) {
    if (/\b12\s+juin\b/u.test(sentence)) return "le";
    if (/\bheures\b/u.test(sentence)) return "neuf";
  }
  if (/verbs with a|pronoun y/u.test(title)) return "y";
  if (/object pronoun|pronoms complements|cod|coi/u.test(title)) return "le";
  if (/simple relative pronoun|qui.*que.*ou/u.test(title)) return /\bqui\s+_{2,}|\b_{2,}\s+(?:est|a|parle|vit)\b/u.test(sentence) ? "qui" : "que";
  if (/logical connector|connecteur|conjunction/u.test(title)) {
    if (/\bmais|fatigue|opposition\b/u.test(sentence)) return "mais";
    if (/\bparce|raison|pluie\b/u.test(sentence)) return "parce que";
    return "et";
  }
  if (/preposition|prepositions/u.test(title) && topic.language === "french") {
    if (/\bresponsable\b/u.test(sentence)) return "de";
    if (/\briche\b/u.test(sentence)) return "en";
    if (/\bpossibilite|droit\b/u.test(sentence)) return "de";
    if (/\bjuin\b/u.test(sentence)) return "le";
    return "à";
  }
  if (/verbe pronominal|reflexive/u.test(title)) return "me lève";
  if (/adjectif|adjective/u.test(title) && topic.language === "french") return "grande";
  if (/imparfait/u.test(title) && /\bfroid\b/u.test(sentence)) return "faisait";
  if (/subjunctive|subjonctif/u.test(title)) return "soit";
  if (/passive voice|voix passive/u.test(title)) return "est adoptée";
  if (/irregular verbs|verbes irreguliers/u.test(title)) return "sais";
  if (/passe compose|past participle/u.test(title)) return "a fait";
  if (/future simple|futur simple|futur/u.test(title)) return "sera";
  if (/imperatif|imperative/u.test(title)) return "faites";
  if (/interrogative|question/u.test(title)) return "où";
  if (/verb|verbe|temps|tense/u.test(title)) return "est";
  if (/relatif|relative/u.test(title) && /pronoun|pronom|complexe|compos/u.test(title)) {
    if (/\bconsacre\b/u.test(sentence)) return "auquel";
    if (/\breflechir\b/u.test(sentence)) return "à laquelle";
    if (/\brepose\b/u.test(sentence)) return "sur lesquels";
    if (/\bparle\b/u.test(sentence)) return "auquel";
    if (/\bdepend\b/u.test(sentence)) return "dont";
  }
  if (/formes impersonnelles|impersonal/u.test(title)) {
    if (/\bproteger|respecter|gaspiller\b/u.test(sentence)) return "Il faut";
    if (/\bpossible\b/u.test(sentence)) return "Il est possible de";
    if (/\bnecessaire\b/u.test(sentence)) return "Il est nécessaire de";
    return "Il faut";
  }
  if (/verbes.*infinitif|verbs.*infinitive|vouloir.*pouvoir.*devoir/u.test(title)) {
    const subject = subjectBeforeBlank(source);
    if (/\bapprendre\b/u.test(sentence)) return subject === "je" ? "veux" : "veut";
    if (/\bdevoirs\b/u.test(sentence)) return subject === "tu" ? "dois" : "doit";
    if (/\bpartir\b/u.test(sentence)) return subject === "nous" ? "voulons" : "veut";
    if (/\bvenir\b/u.test(sentence)) return subject === "elle" ? "peut" : "peux";
  }
  if (/subjonctif|subjunctive/u.test(title)) {
    if (/\bprobable que\b|\bcertain que\b|\bsuis certain que\b/u.test(sentence)) return "est";
    if (/\bne pense pas que\b|\bdoute que\b|\bpossible que\b|\bquoique\b|\bbien que\b/u.test(sentence)) {
      if (/\bsoit\b/u.test(sentence)) return "soit";
      if (/\bcomprendre\b/u.test(sentence)) return "comprenne";
      if (/\baboutir\b/u.test(sentence)) return "aboutissent";
      if (/\bfonctionner\b/u.test(sentence)) return "fonctionne";
      if (/\bparticiper\b/u.test(sentence)) return "participent";
      return "soit";
    }
  }
  if (/ne expletif/u.test(title)) return "ne";
  if (/pronoms.*(?:y.*en|en.*y)|y et en|en et y/u.test(title)) {
    if (/\bà cette proposition\b|\bà cette conference\b|\bà cette conférence\b/u.test(sentence)) return "y";
    if (/\bde cela\b|\bde cette question\b/u.test(sentence)) return "en";
    return "y";
  }
  if (/nominalisation|nominalization/u.test(title)) {
    if (/\ba decide\b|\ba décidé\b/u.test(sentence)) return "décision";
    if (/\bde modifier\b/u.test(sentence)) return "modification";
    return "décision";
  }
  if (/voix passive|passive voice/u.test(title) && /\ba adopte\b|\ba adopté\b/u.test(sentence)) return "a été adoptée";
  if (/accord du participe passe|past participle agreement/u.test(title) && /\blaver\b/u.test(sentence)) return "lavé";
  if (/conditionnel passe|hypoth|conditional past/u.test(title)) {
    if (/\bne jamais accepter\b/u.test(sentence)) return "n’aurais jamais accepté";
    if (/\bete\b|\bêtre\b/u.test(sentence)) return "aurait été";
    return "aurait fait";
  }
  if (/inversion/u.test(title)) return "était-il";
  if (/modalisation|modalisation|hedging/u.test(title)) return "pourrait";
  if (/imparfait/u.test(title)) {
    if (/\bfootball\b/u.test(sentence)) return "jouais";
    if (/\bfroid\b/u.test(sentence)) return "faisait";
    return "était";
  }
  if (/plus-que-parfait/u.test(title)) return /\bdéjà\b/u.test(sentence) ? "avait déjà fini" : "avait fini";
  if (/accord du participe passe|past participle agreement/u.test(title) && /\brencontrer\b/u.test(sentence)) return "rencontrées";
  if (/discours indirect|indirect speech|concordance des temps/u.test(title)) {
    if (/\bje suis pret\b/u.test(sentence)) return "il est prêt";
    if (/\bj'habite\b|\bj’habite\b/u.test(sentence)) return "elle habite";
    if (/\btu viens\b/u.test(sentence)) return "venais";
    if (/\bnous prendrons\b/u.test(sentence)) return "prendrons";
    if (/\bje suis fatigue\b|\bje suis malade\b/u.test(sentence)) return "était malade";
    if (/\bnous avons termine\b/u.test(sentence)) return "avions terminé";
    if (/\bj'ai decouvert\b/u.test(sentence)) return "avait découvert";
  }
  if (/gerondif/u.test(title) && topic.language === "french") {
    const verb = source.match(/\(\s*([\p{L}]+)\s*\)/u)?.[1]?.toLocaleLowerCase();
    if (verb) return `en ${verb.endsWith("er") ? `${verb.slice(0, -2)}ant` : `${verb}ant`}`;
    if (/\btravaillait\b/u.test(sentence)) return "en travaillant";
  }
  if (/participe present/u.test(title)) {
    if (/\btravaillent\b/u.test(sentence)) return "travaillant";
    return "travaillant";
  }
  if (/expressing feelings|sentiments|feelings/u.test(title)) {
    if (/\breussi\b/u.test(sentence)) return "content";
    return "heureux";
  }
  if (/informing about events|expressing time/u.test(title)) {
    if (/\bsamedi\b/u.test(sentence)) return "ce";
    return "hier";
  }
  if (/mise en relief|cleft/u.test(title)) return "C’est";
  if (/pronoms indefinis|indefinite pronouns/u.test(title)) return "Quiconque";
  if (/adjectif.*preposition|adjectives.*preposition/u.test(title) && /\briche\b/u.test(sentence)) return "en";
  if (/noms.*preposition|nouns.*preposition/u.test(title) && /\bpossibilite\b/u.test(sentence)) return "de";
  const explicitChoices = [...source.matchAll(/\(([^()]*\/[^()]*)\)/gu)].at(-1)?.[1];
  if (explicitChoices && /adjective|adjectif/u.test(normalize(topic.title))) {
    const choices = explicitChoices.split("/").map((choice) => choice.trim());
    const feminine = /\b(?:marie|elle|maison|voiture|décision|decision|salle)\b/iu.test(source);
    const plural = /\b(?:maisons|amis|elles|ils|décisions|decisions)\b/iu.test(source);
    return choices.find((choice) => feminine ? /e$/iu.test(choice) : plural ? /s$/iu.test(choice) : !/e?s$/iu.test(choice));
  }
  const possessiveCue = curriculumCue(topic, source)?.match(/(my|your|his|her|our|their|mon|ma|mes|ton|ta|tes|son|sa|ses|notre|nos|votre|vos|leur|leurs)(?:,\s*informal)?/iu)?.[1]
    ?? source.match(/\((my|your|his|her|our|their|mon|ma|mes|ton|ta|tes|son|sa|ses|notre|nos|votre|vos|leur|leurs)(?:,\s*informal)?\)/iu)?.[1];
  if (possessiveCue && /possessive/u.test(normalize(topic.title))) {
    const noun = normalize(source.match(/_{2,}\s+([\p{L}]+)/u)?.[1] ?? "");
    const plural = /s$/u.test(noun) && !/ss$/u.test(noun);
    const feminine = /^(?:maison|voiture|clé|cle|sœur|soeur|amie|table|ville)$/u.test(noun);
    const forms: Record<string, string> = {
      my: plural ? "mes" : feminine ? "ma" : "mon",
      your: plural ? "tes" : feminine ? "ta" : "ton",
      her: plural ? "ses" : feminine ? "sa" : "son",
      his: plural ? "ses" : feminine ? "sa" : "son",
      our: plural ? "nos" : "notre",
      their: plural ? "leurs" : "leur",
    };
    return forms[normalize(possessiveCue)];
  }
  if (/possessive/u.test(normalize(topic.title))) {
    const noun = normalize(source.match(/_{2,}\s+([\p{L}]+)/u)?.[1] ?? "");
    return /s$/u.test(noun) && !/ss$/u.test(noun) ? "mes" : /^(?:maison|voiture|clé|cle|sœur|soeur|amie|table|ville)$/u.test(noun) ? "ma" : "mon";
  }
  if (/gender and number|genre.*nombre/u.test(normalize(topic.title))) {
    const noun = normalize(source.match(/\b(?:un|une)\s+([\p{L}]+)/iu)?.[1] ?? "");
    if (/feminine|féminin/u.test(normalize(source))) {
      if (noun === "cheval") return "jument";
      if (noun.endsWith("ien")) return `${noun.slice(0, -1)}ne`;
      if (noun.endsWith("i")) return `${noun}e`;
      return `${noun}e`;
    }
    if (noun === "cheval") return "chevaux";
    if (/s$/u.test(noun) && !/ss$/u.test(noun)) return noun;
    return `${noun}s`;
  }
  if (/stressed pronoun|pronom tonique/u.test(normalize(topic.title))) {
    const adjacentCue = curriculumCue(topic, source);
    const cue = adjacentCue?.match(/(him|her|me|them|us|you|moi|toi|lui|elle|nous|vous|eux|elles)(?:,\s*feminine)?/iu)?.[1]
      ?? source.match(/\((him|her|me|them|us|you|moi|toi|lui|elle|nous|vous|eux|elles)(?:,\s*feminine)?\)/iu)?.[1];
    if (cue) {
      const forms: Record<string, string> = {
        him: "lui", her: "elle", me: "moi", them: /them,\s*feminine/iu.test(adjacentCue ?? source) ? "elles" : "eux",
        us: "nous", you: "toi",
      };
      return forms[normalize(cue)] ?? cue;
    }
    if (/\bpour\s+_{2,}/iu.test(source)) return "lui";
    if (/et\s+_{2,}/iu.test(source)) return "toi";
  }
  if (/negation|negative/u.test(normalize(topic.title))) return "ne…pas";
  if (/^questions?$|question/u.test(normalize(topic.title)) && !/interrogative/u.test(normalize(topic.title))) return "est-ce que";
  if (/c'est|ce sont|il est|elle est/u.test(normalize(topic.title))) {
    const after = source.slice(Math.max(0, source.search(/_{2,}/u) + 3));
    if (/\b(?:mes parents|mes amis|les enfants|les étudiants|les etudiants)\b/iu.test(after)) return "ce sont";
    if (/^(?:professeur|médecin|medecin|très|tres|sympathique)\b/iu.test(after)) return "il est";
    return "c’est";
  }
  const answer = frenchConjugation(topic, source);
  if (answer) return answer;
  if (/demonstrative/u.test(normalize(topic.title))) {
    const noun = normalize(source.match(/_{2,}\s+([\p{L}]+)/u)?.[1] ?? "");
    if (/s$/u.test(noun)) return "ces";
    if (/^(?:école|ecole|amie|adresse)$/u.test(noun)) return "cette";
    if (/^(?:appartement|hôtel|hotel|arbre)$/u.test(noun)) return "cet";
    return "ce";
  }
  if (/interrogative word|mot interrogatif/u.test(normalize(topic.title))) {
    if (/\b(?:coûte|coute|prix)\b/iu.test(source)) return "combien";
    if (/\b(?:habites|habitez|ville|lieu)\b/iu.test(source)) return "où";
    if (/\b(?:anniversaire|date|jour)\b/iu.test(source)) return "quand";
    if (/\b(?:nom|appelles|appeler)\b/iu.test(source)) return "comment";
    if (/\b(?:personne|professeur|professeur)\b/iu.test(source)) return "qui";
  }
  if (/quantity|quantité/u.test(normalize(topic.title))) {
    if (/\b(?:eau|temps|sucre)\b/iu.test(source)) return "un peu de";
    if (/\b(?:étudiants|etudiants|livres)\b/iu.test(source)) return "beaucoup de";
    return "assez de";
  }
  if (/numbers|dates|time|heure|date|nombre/u.test(normalize(topic.title))) {
    const number = source.match(/\b(7|15|22|30|45|8)\b/u)?.[1]
      ?? curriculumCue(topic, source)?.match(/\b(7|15|22|30|45|8)(?::00)?\b/u)?.[1];
    const words: Record<string, string> = { "7": "sept", "8": "huit", "15": "quinze", "22": "vingt-deux", "30": "trente", "45": "quarante-cinq" };
    if (number) return words[number];
    if (/\blundi\b/iu.test(source)) return "le";
    if (/\bmai\b/iu.test(source)) return "en";
    if (/\bneuf heures\b/iu.test(source)) return "à";
  }
  if (/conjunction|conjonction|connecteur/u.test(normalize(topic.title))) {
    if (/\b(?:fatigué|fatigue|petit|mais|maisons)\b/iu.test(source)) return "mais";
    if (/\b(?:parce que|pleut|pluie|raison)\b/iu.test(source)) return "parce que";
    if (/\b(?:veux|choix|ou)\b/iu.test(source)) return "ou";
    return "et";
  }
  if (/relatif|relative/u.test(title) && /pronoun|pronom|complexe|compos/u.test(title)) return "auquel";
  if (/discours indirect|indirect speech|concordance des temps/u.test(title)) return "était";
  if (/gérondif|gerondif/u.test(title)) return "en travaillant";
  if (/accord du participe passe|past participle agreement/u.test(title)) {
    const participle = source.match(/\(\s*([\p{L}]+)\s*\)/u)?.[1]?.toLocaleLowerCase();
    if (participle?.endsWith("er")) {
      const base = `${participle.slice(0, -2)}é`;
      return /\belles\b|\bfemmes\b/u.test(sentence) ? `${base}es` : base;
    }
    return "fait";
  }
  if (/reformulation|synthese|synthèse/u.test(title)) return "décision";
  return undefined;
}

function targetOptions(topic: GrammarTopic, answer: string, question: GrammarExercise): string[] {
  const title = normalize(topic.title);
  if (/article/u.test(title)) return topic.language === "french" ? frenchArticles : englishArticles;
  if (/possessive/u.test(title) && topic.language === "english") return [...new Set([answer, "father's", "mother's", "children's", "grandparents'"])];
  if (/relatif|relative/u.test(title) && topic.language === "french") return [...new Set([answer, "qui", "que", "dont", "où", "auquel", "à laquelle", "sur lesquels"])];
  if (/reflexive|pronominaux/u.test(title)) return [...new Set([answer, "me lève", "te lèves", "se lève", "nous levons", "vous levez", "se lèvent"])];
  if (/pronoms.*y.*en|y et en|en et y/u.test(title) && topic.language === "french") return ["y", "en", "lui", "leur"];
  if (/il faut/u.test(title)) return ["faut", "doit", "peut", "veut"];
  if (/gérondif|gerondif/u.test(title)) return [...new Set([answer, "en parlant", "en travaillant", "en préparant"])];
  if (/participe présent|participe present/u.test(title)) return [...new Set([answer, "travaillant", "prenant", "finissant"])];
  if (/indirect speech|discours indirect|concordance des temps/u.test(title) && topic.language === "french") return [...new Set([answer, "était", "avait", "serait", "prendrait"])];
  if (/question tag/u.test(title)) return [...new Set([answer, "does she", "isn't it", "don't they", "aren't you"])];
  if (/reported speech|reported questions/u.test(title) && topic.language === "english") return [...new Set([answer, "said", "told", "worked", "had finished", "would"])];
  if (/inversion/u.test(title) && topic.language === "english") return [...new Set([answer, "does she", "had I", "should you", "rarely do"])];
  if (/modal|perfect infinitive/u.test(title) && topic.language === "english") return [...new Set([answer, "should", "might have", "needn't have", "must have"])];
  if (/absolute construction/u.test(title) && topic.language === "english") return [...new Set([answer, "being perfect", "being complete", "having been reviewed"])];
  if (/participle clause/u.test(title) && topic.language === "english") return [...new Set([answer, "being exhausted", "having finished", "having been informed"])];
  if (/advanced comparison|comparison and degree/u.test(title)) return [...new Set([answer, "the more apparent", "more apparent", "better"])];
  if (/near.synonym|semantic precision/u.test(title)) return [...new Set([answer, "profound", "significant", "substantial"])];
  if (/register|stylistic transformation/u.test(title)) return [...new Set([answer, "serious error", "substantial mistake", "significant issue"])];
  if (/pronoun|pronom/u.test(title) && !/relative/u.test(title)) return topic.language === "french" ? frenchPronouns : englishPronouns;
  if (/preposition|préposition/u.test(title)) return topic.language === "french" ? frenchPrepositions : englishPrepositions;
  if (/verbes.*infinitif|verbs.*infinitive|vouloir.*pouvoir.*devoir/u.test(title) && topic.language === "french") return [...new Set([answer, "veux", "peux", "dois", "voulons", "pouvons", "devons"])];
  if (/formes impersonnelles|impersonal/u.test(title)) return [...new Set([answer, "Il faut", "Il est possible de", "Il est nécessaire de"])];
  if (/subjonctif|subjunctive/u.test(title) && topic.language === "french") return [...new Set([answer, "soit", "ait", "fasse", "puisse", "comprenne", "participent"])];
  if (/nominalisation|nominalization/u.test(title)) return [...new Set([answer, "décision", "modification", "adoption", "protection"])];
  if (/voix passive|passive voice/u.test(title) && topic.language === "french") return [...new Set([answer, "est adoptée", "a été adoptée", "sont protégées", "ont été prises"])];
  if (/accord du participe passe|past participle agreement/u.test(title) && topic.language === "french") return [...new Set([answer, "lavé", "lavée", "lavés", "lavées"])];
  if (/modalisation/u.test(title) && topic.language === "french") return [...new Set([answer, "pourrait", "semble", "serait", "doit"])];
  if (/inversion/u.test(title) && topic.language === "french") return [...new Set([answer, "était-il", "est-il", "a-t-il", "vient-elle"])];
  if (/indirect speech|discours indirect|concordance des temps/u.test(title) && topic.language === "french") return [...new Set([answer, "avait terminé", "était prêt", "prendrait", "habiterait"])];
  if (/some.*any|any.*some/u.test(title)) return ["some", "any"];
  if (/verb etre|etre/u.test(title)) return ["suis", "es", "est", "sommes", "êtes", "sont"];
  if (/verb avoir|avoir/u.test(title)) return ["ai", "as", "a", "avons", "avez", "ont"];
  if (/verb to be|\bbe\b/u.test(title)) return ["am", "is", "are"];
  if (/have got|has got/u.test(title)) return ["have got", "has got"];
  if (/possessive/u.test(title) && topic.language === "french") return ["mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses", "notre", "nos", "votre", "vos", "leur", "leurs"];
  if (/stressed pronoun|pronom tonique/u.test(title)) return ["moi", "toi", "lui", "elle", "nous", "vous", "eux", "elles"];
  if (/negation/u.test(title) && topic.language === "french") return ["ne…pas", "ne…jamais", "ne…plus"];
  if (/negative/u.test(title) && topic.language === "english") return ["don't", "doesn't", "didn't", "won't"];
  if (/^questions?$|question/u.test(title) && topic.language === "french") return ["est-ce que", "qui", "où"];
  if (/demonstrative/u.test(title) && topic.language === "french") return ["ce", "cet", "cette", "ces"];
  if (/imperative|impératif/u.test(title)) return topic.language === "french" ? ["ouvre", "regarde", "prends", "prenez", "fais", "faites", "parle"] : ["open", "look", "take", "do", "don't run"];
  if (/conditional/u.test(title) && topic.language === "english") return [...new Set([answer, "will", "would", "would have", "had"])];
  if (/plus-que-parfait/u.test(title)) return [...new Set([answer, "avais fini", "avait pris", "étions partis", "étaient venus"])];
  if (/gender and number|genre.*nombre/u.test(title)) return [...new Set([answer, "étudiant", "étudiante", "livres", "chevaux"])];
  if (/adjective|adjectif/u.test(title)) return [...new Set([answer, "grand", "grande", "grands", "grandes"])];
  if (/comparative/u.test(title)) return [...new Set([answer, "more", "less", "better", "worse"])];
  if (/superlative/u.test(title)) return [...new Set([answer, "best", "worst", "most", "least"])];
  if (/adverb.*frequency|frequency adverb/u.test(title)) return ["always", "usually", "often", "sometimes", "never"];
  if (/adverb.*manner/u.test(title)) return [...new Set([answer, "quickly", "slowly", "carefully", "well"])];
  if (/future with going to|going to/u.test(title)) return ["am going to", "is going to", "are going to"];
  if (/future with will|will for future|future/u.test(title) && topic.language === "english") return ["will", "is going to", "will be", "will have"];
  if (/past simple.*negative|negative.*past simple/u.test(title)) return ["didn't", "doesn't", "don't"];
  if (/past simple.*question|question.*past simple/u.test(title)) return ["Did", "Do", "Does"];
  if (/countable and uncountable/u.test(title)) return ["water", "apple", "rice", "chair", "milk"];
  if (/few.*little|little.*few|much.*many/u.test(title)) return ["much", "many", "a few", "a little"];
  if (/must|have to|obligation/u.test(title)) return ["must", "mustn't", "have to", "don't have to"];
  if (/should/u.test(title)) return ["should", "shouldn't"];
  if (/relative clause/u.test(title)) return topic.language === "french" ? ["qui", "que", "dont", "où"] : ["who", "which", "that", "whose", "where"];
  if (/gerund.*infinitive|gerunds and infinitives/u.test(title)) return ["to go", "going", "to do", "doing"];
  if (/c'est|ce sont|il est|elle est/u.test(title)) return ["c’est", "ce sont", "il est", "elle est"];
  if (/can|modal/u.test(title)) return topic.language === "french" ? ["peux", "peut", "pouvons", "pouvez"] : ["can", "can't", "could", "cannot"];
  if (/conjunction|and.*but.*because/u.test(title)) return topic.language === "french" ? ["et", "mais", "parce que", "ou"] : ["and", "but", "because", "or"];
  if (/interrogative word|mot interrogatif/u.test(title)) return ["qui", "où", "quand", "comment", "pourquoi", "combien"];
  if (/numbers|dates|time|heure|date|nombre/u.test(title)) return topic.language === "french"
    ? ["sept", "huit", "quinze", "vingt-deux", "trente", "quarante-cinq"]
    : ["seven", "eight", "fifteen", "twenty-two", "thirty", "forty-five"];
  if (/quantity|quantité/u.test(title)) return ["beaucoup de", "un peu de", "assez de", "trop de"];
  if (/conjunction|conjonction|connecteur/u.test(title)) {
    return topic.language === "french" ? ["et", "mais", "parce que", "ou"] : ["and", "but", "because", "or"];
  }
  if (/singular and plural|plural noun|plural form/u.test(title)) {
    const noun = (topic.language === "french" ? frenchSource(question.prompt, topic) : englishSource(question.prompt))
      .match(/^[\s“”'’]*(?:a|an|the|un|une|le|la)?\s*([\p{L}]+)/iu)?.[1];
    if (noun) return [...new Set([noun, answer, pluralEnglish(noun)])];
  }
  if (/present|présent|past|passé|imparfait|future|futur|verb/u.test(title)) {
    const source = topic.language === "french" ? frenchSource(question.prompt, topic) : englishSource(question.prompt);
    const lemma = source.match(/\(\s*([\p{L}]+)\s*\)/u)?.[1]?.toLowerCase();
    if (lemma && topic.language === "french") {
      const forms: Record<string, string[]> = {
        être: ["suis", "es", "est", "sommes", "êtes", "sont"],
        avoir: ["ai", "as", "a", "avons", "avez", "ont"],
        aller: ["vais", "vas", "va", "allons", "allez", "vont"],
        faire: ["fais", "fais", "fait", "faisons", "faites", "font"],
        prendre: ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
        venir: ["viens", "viens", "vient", "venons", "venez", "viennent"],
        vouloir: ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
      };
      if (forms[lemma]) return forms[lemma];
    }
    if (lemma && topic.language === "french" && lemma.endsWith("er")) {
      const stem = lemma.slice(0, -2);
      return [...new Set([answer, `${stem}e`, `${stem}es`, `${stem}ent`])].slice(0, 4);
    }
    if (lemma && topic.language === "english") {
      const past = englishAnswer("past simple", `___ (${lemma})`);
      const present = englishAnswer("present simple", `She ___ (${lemma})`);
      return [...new Set([answer, lemma, present, past].filter((form): form is string => Boolean(form)))].slice(0, 4);
    }
  }
  return [...new Set([answer, ...(topic.language === "french" ? ["parle", "parles", "parlent"] : ["walk", "walks", "walked"])])].slice(0, 4);
}

function targetPrompt(topic: GrammarTopic, question: GrammarExercise) {
  const source = topic.language === "french" ? frenchSource(question.prompt, topic) : englishSource(question.prompt);
  const title = normalize(topic.title);
  if (/countable and uncountable/u.test(title)) return "Classify the noun: _____";
  if (/imperative|impératif/u.test(title)) {
    const prompt = source.replace(/\s*\([^()]*\)/gu, "").replace(/_{2,}/gu, "_____").replace(/\s+/gu, " ").trim();
    return prompt || "_____ !";
  }
  if (/discours indirect|indirect speech|reported speech/u.test(title)) {
    if (topic.language === "english") {
      if (/\bwhere do you live\b/iu.test(source)) return "She asked me where I _____ in a bank.";
      if (/\bi work in a bank\b/iu.test(source)) return "She said that she _____ in a bank.";
      if (/\bwe have finished\b/iu.test(source)) return "They said that they _____ the project.";
      if (/\bi am\b/iu.test(source)) return "He said that he _____ tired.";
    } else {
      if (/\bje suis fatigue\b|\bje suis malade\b/iu.test(normalize(source))) return "Paul a dit qu’il _____ malade.";
      if (/\bje suis pret\b/u.test(normalize(source))) return "Il déclare qu’il _____ prêt à négocier.";
      if (/\bj'habite\b|\bj’habite\b/u.test(source)) return "Marie dit qu’elle _____ à Lyon.";
      if (/\bnous avons termine\b/u.test(normalize(source))) return "Elle affirme qu’ils _____ le rapport.";
    }
  }
  if (/inversion/u.test(title) && topic.language === "english") {
    if (/\brarely\b/iu.test(source)) return "Rarely _____ make such serious mistakes.";
    if (/\bif i had\b/iu.test(source)) return "_____ I known about the problem, I would have helped.";
    if (/\bif you should\b/iu.test(source)) return "_____ you need assistance, contact our office.";
  }
  if (/participe présent|participe present/u.test(title)) {
    return source.replace(/\bqui\s+([\p{L}]+)\b/iu, "_____").replace(/\s+/gu, " ").trim();
  }
  if (/absolute construction/u.test(title) && topic.language === "english") {
    const firstSentence = source.split(/[.!?]/u)[0]?.trim() ?? source;
    const secondSentence = source.slice(firstSentence.length).replace(/^[.!?\s]+/u, "").trim();
    const transformed = firstSentence.replace(/\s+(?:was|were|is|are)\s+.+$/iu, " _____");
    if (secondSentence) return `${transformed}, ${secondSentence}`;
    return `${transformed}, _____`;
  }
  if (/gérondif|gerondif/u.test(title)) {
    const transformed = source.replace(/pendant qu['’]il travaillait/iu, "_____");
    if (transformed !== source) return transformed;
    if (!/_{2,}/u.test(source)) return `_____ ${source}`;
  }
  if (/nominalisation|nominalization/u.test(title) && topic.language === "french" && /\ba décide\b|\ba décidé\b/iu.test(source)) {
    return source.replace(/a\s+décidé/iu, "a pris la _____");
  }
  if (/voix passive|passive voice/u.test(title) && topic.language === "french" && /\ba adopté\b|\ba adopte\b/iu.test(source)) {
    return "Une nouvelle loi _____ par le gouvernement.";
  }
  if (/conditionnel passé|conditionnel passe/u.test(title) && topic.language === "french" && /\brespecté\b|\brespecte\b/iu.test(source)) {
    return "Tu _____ les délais.";
  }
  if (/reformulation|synthèse|synthèse/u.test(title) && topic.language === "french") {
    return "Les autorités ont pris une _____.";
  }
  if (/_{2,}/u.test(source)) {
    return source
      .replace(/_{2,}/gu, "_____")
      .replace(/\s*\(([^()]*)\)/gu, "")
      .replace(/\s+/gu, " ")
      .trim();
  }
  if (/\(([^()]*\/[^()]*)\)/u.test(source)) return source.replace(/\s*\([^()]*\/[^()]*\)/gu, " _____").trim();
  if (/present simple.*negative|negative.*present simple/u.test(title)) {
    const match = source.match(/^(i|you|we|they|he|she|it|my\s+\w+|the\s+\w+)\s+([\p{L}]+)(.*)$/iu);
    if (match) {
      const base = normalize(match[2]).replace(/ies$/u, "y").replace(/s$/u, "");
      return `${match[1]} _____ ${base}${match[3]}`;
    }
  }
  if (/present simple.*question|question.*present simple/u.test(title)) {
    const match = source.match(/^(i|you|we|they|he|she|it|my\s+\w+|the\s+\w+)\s+([\p{L}]+)(.*)$/iu);
    if (match) {
      const base = normalize(match[2]).replace(/ies$/u, "y").replace(/s$/u, "");
      return `_____ ${match[1]} ${base}${match[3].replace(/[.?!]$/u, "")}?`;
    }
  }
  if (/adverb.*frequency|frequency adverb/u.test(title)) {
    const adverb = source.match(/\((always|usually|often|sometimes|never)\)/iu)?.[1];
    const sentence = source.replace(/\s*\((always|usually|often|sometimes|never)\)/iu, "").trim();
    if (adverb) {
      if (/\b(?:am|is|are|was|were)\b/iu.test(sentence)) return sentence.replace(/\b(am|is|are|was|were)\b/iu, "$1 _____");
      return sentence.replace(/^(\w+)\s+/u, "$1 _____ ");
    }
  }
  if (/negation|negative/u.test(title) && topic.language === "french") {
    return source.replace(/^(\p{L}+(?:['’]\p{L}+)?\s+)/u, "$1_____ ").replace(/\s+/gu, " ").trim();
  }
  if (/^questions?$|question/u.test(title) && topic.language === "french") {
    return `_____ ${source.replace(/[.?!]$/u, "")}?`;
  }
  if (/singular and plural|plural noun|plural form/u.test(title)) return `${source} → _____`;
  if (/gender and number|genre.*nombre/u.test(title)) {
    return source.replace(/:\s*_{2,}/u, " : _____");
  }
  const correction = correctedSentenceFiller(source, question.acceptedAnswers[0] ?? "");
  if (correction) return correction.prompt;
  if (/possessive/u.test(title) && topic.language === "french") {
    return source.replace(/_{2,}/u, "_____");
  }
  if (/possessive/u.test(title) && topic.language === "english") {
    return source.replace(/\bof\s+(?:(?:my|your|his|her|our|their|the)\s+)?([\p{L}'’-]+)/iu, "_____");
  }
  if (/singular and plural|plural noun|plural form/u.test(normalize(topic.title))) return `${source} → _____`;
  if (!/_{2,}/u.test(source)) return `${source.replace(/[.?!]$/u, "")} → _____`;
  return source.replace(/_{2,}/gu, "_____");
}

function normalizeExercise(topic: GrammarTopic, question: GrammarExercise): GrammarExercise {
  const options = question.options ?? [];
  const isValid = options.length >= 2 && options.every(isFiller)
    && options.some((option) => question.acceptedAnswers.some((answer) => normalize(answer) === normalize(option)))
    && !options.some((option) => /^(?:true|false)$/iu.test(option))
    && !options.some((option) => /\b(?:past|present|future|continuous|perfect|simple|conditional|subjunctive|subjonctif|indicative|indicatif|rule|tense|mood|voice|clause|inversion|article|noun|adjective|adverb|pronoun|preposition|gerund|infinitive|participle|affirmative|negative)\b/iu.test(option));
  if (isValid) return question;

  const extracted = options.length ? sentenceFillers(question) : undefined;
  if (extracted) {
    return { ...question, ...extracted, instruction: "Choose the word or form that completes the sentence." };
  }

  const resolvedAnswer = targetAnswer(topic, question) ?? "";
  if (!resolvedAnswer) return { ...question, options: undefined };
  const normalizedOptions = targetOptions(topic, resolvedAnswer, question);
  const correctOptions = normalizedOptions.some((option) => normalize(option) === normalize(resolvedAnswer))
    ? normalizedOptions
    : [resolvedAnswer, ...normalizedOptions];
  return {
    ...question,
    prompt: targetPrompt(topic, question),
    instruction: "Choose the word or form that completes the sentence.",
    options: correctOptions,
    acceptedAnswers: [resolvedAnswer],
  };
}

export function normalizeLaterGrammarTopics(topics: GrammarTopic[]) {
  const topicCounts = new Map<string, number>();
  return topics.map((topic) => {
    const key = `${topic.language}:${topic.level}`;
    const index = topicCounts.get(key) ?? 0;
    topicCounts.set(key, index + 1);
    return index < 2 || !["english", "french"].includes(topic.language)
      ? topic
      : { ...topic, exercises: topic.exercises.map((question) => normalizeExercise(topic, question)) };
  });
}
