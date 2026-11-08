"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { LearningBreadcrumbs, LearningFooter, LearningHeader, SectionIntro } from "@/app/components/language-ui";
import { useInterfaceLanguage, type InterfaceLocale } from "@/app/components/interface-language";
import { useLearningProgress } from "@/app/components/learning-progress-provider";
import type { GrammarExercise, GrammarTopic } from "@/app/lib/grammar-content";
import { getVocabularySourceNotes, type VocabularyEntry, vocabularyEntries } from "@/app/lib/vocabulary-content";
import { learningUi } from "@/app/lib/learning-ui-translations";
import { languages, type Language, type LearningLevel } from "@/app/lib/language-content";
import type { LanguageSlug, LevelSlug } from "@/app/lib/language-content";

function Arrow({ className = "" }: { className?: string }) {
  return <span className={className} aria-hidden="true">→</span>;
}

const moduleLabels = {
  en: {
    grammarTagline: "in context.",
    topicCount: "topics",
    shortLesson: "short lesson",
    shortLessons: "short lessons",
    practicePrompt: "practice prompts",
    wordTitle: "Words for",
    wordTitleSecond: "real life.",
    wordDescription: "Browse a small, language-specific collection, hear it when your browser supports speech, and return to words on a gentle schedule.",
    sampleWords: "sample words",
    forms: "Forms",
    speechLimit: "Browser speech synthesis · voice quality varies by device and language.",
    sourceConsulted: "Reference consulted",
    sourceLimited: "Access limited / review required",
    entryDisclaimer: "Entries are original sample material, not copied from dictionaries or official exams. Their definitions and usage notes need independent dictionary and teacher review before publication. No verified IPA has been added.",
    allWords: "All words",
    spellHint: "Write the target-language word or expression for this meaning:",
    dueToday: "Due for review",
    reviewIn: "Review in",
    lastReviewed: "Last reviewed",
    successes: "successful reviews",
    difficulties: "difficult reviews",
    reviewLevelLearning: "Learning",
    reviewLevelEstablished: "Established",
    reviewScheduleTitle: "A simple fixed-interval demo",
    optionDoesNotFitMeaning: "This meaning belongs to a different target-language word.",
    optionDoesNotFitCollocation: "This is not the natural pairing used with this word.",
  },
  fr: {
    grammarTagline: "en contexte.",
    topicCount: "thèmes",
    shortLesson: "courte leçon",
    shortLessons: "courtes leçons",
    practicePrompt: "questions d’entraînement",
    wordTitle: "Des mots pour",
    wordTitleSecond: "la vraie vie.",
    wordDescription: "Parcourez une petite sélection propre à cette langue, écoutez les mots si votre navigateur prend en charge la synthèse vocale et révisez-les à votre rythme.",
    sampleWords: "mots d’exemple",
    forms: "Formes",
    speechLimit: "Synthèse vocale du navigateur · la qualité dépend de l’appareil et de la langue.",
    sourceConsulted: "Référence consultée",
    sourceLimited: "Accès limité / vérification nécessaire",
    entryDisclaimer: "Ces entrées sont des exemples originaux, non copiés de dictionnaires ou d’examens officiels. Les définitions et notes d’usage doivent être vérifiées par un dictionnaire et un enseignant avant publication. Aucune transcription API vérifiée n’est incluse.",
    allWords: "Tous les mots",
    spellHint: "Écrivez le mot ou l’expression dans la langue étudiée pour ce sens :",
    dueToday: "À revoir",
    reviewIn: "À revoir dans",
    lastReviewed: "Dernière révision",
    successes: "révisions réussies",
    difficulties: "révisions difficiles",
    reviewLevelLearning: "En cours d’apprentissage",
    reviewLevelEstablished: "Acquis",
    reviewScheduleTitle: "Démonstration à intervalles fixes",
    optionDoesNotFitMeaning: "Cette définition correspond à un autre mot de la langue étudiée.",
    optionDoesNotFitCollocation: "Cette expression ne s’emploie pas naturellement avec ce mot.",
  },
  es: {
    grammarTagline: "en contexto.",
    topicCount: "temas",
    shortLesson: "lección breve",
    shortLessons: "lecciones breves",
    practicePrompt: "preguntas de práctica",
    wordTitle: "Palabras para",
    wordTitleSecond: "la vida real.",
    wordDescription: "Explora una pequeña selección específica de esta lengua, escucha las palabras si tu navegador admite síntesis de voz y vuelve a repasarlas poco a poco.",
    sampleWords: "palabras de muestra",
    forms: "Formas",
    speechLimit: "Síntesis de voz del navegador · la calidad depende del dispositivo y del idioma.",
    sourceConsulted: "Referencia consultada",
    sourceLimited: "Acceso limitado / requiere revisión",
    entryDisclaimer: "Estas entradas son ejemplos originales, no copiados de diccionarios ni exámenes oficiales. Un diccionario y un docente deben revisar las definiciones y notas de uso antes de publicarlas. No se incluye IPA sin verificar.",
    allWords: "Todas las palabras",
    spellHint: "Escribe la palabra o expresión en el idioma que estudias para este significado:",
    dueToday: "Pendiente de repaso",
    reviewIn: "Repasar en",
    lastReviewed: "Último repaso",
    successes: "repasos correctos",
    difficulties: "repasos difíciles",
    reviewLevelLearning: "En aprendizaje",
    reviewLevelEstablished: "Consolidada",
    reviewScheduleTitle: "Demostración con intervalos fijos",
    optionDoesNotFitMeaning: "Esta definición corresponde a otra palabra del idioma que estudias.",
    optionDoesNotFitCollocation: "Esta expresión no suele combinarse con esta palabra.",
  },
  it: {
    grammarTagline: "nel contesto.",
    topicCount: "argomenti",
    shortLesson: "breve lezione",
    shortLessons: "brevi lezioni",
    practicePrompt: "domande di pratica",
    wordTitle: "Parole per",
    wordTitleSecond: "la vita vera.",
    wordDescription: "Esplora una piccola raccolta specifica per questa lingua, ascolta le parole se il browser supporta la sintesi vocale e ripassale con calma.",
    sampleWords: "parole di esempio",
    forms: "Forme",
    speechLimit: "Sintesi vocale del browser · la qualità varia in base al dispositivo e alla lingua.",
    sourceConsulted: "Riferimento consultato",
    sourceLimited: "Accesso limitato / revisione necessaria",
    entryDisclaimer: "Le voci sono esempi originali, non copiati da dizionari o esami ufficiali. Definizioni e note d’uso richiedono una verifica indipendente con dizionario e docente prima della pubblicazione. Non è stata aggiunta IPA non verificata.",
    allWords: "Tutte le parole",
    spellHint: "Scrivi la parola o l’espressione nella lingua studiata per questo significato:",
    dueToday: "Da ripassare",
    reviewIn: "Da ripassare tra",
    lastReviewed: "Ultimo ripasso",
    successes: "ripassi riusciti",
    difficulties: "ripassi difficili",
    reviewLevelLearning: "In apprendimento",
    reviewLevelEstablished: "Consolidata",
    reviewScheduleTitle: "Demo a intervalli fissi",
    optionDoesNotFitMeaning: "Questa definizione corrisponde a un’altra parola della lingua studiata.",
    optionDoesNotFitCollocation: "Questa espressione non si abbina naturalmente a questa parola.",
  },
  de: {
    grammarTagline: "im Kontext.",
    topicCount: "Themen",
    shortLesson: "kurze Lektion",
    shortLessons: "kurze Lektionen",
    practicePrompt: "Übungsfragen",
    wordTitle: "Wörter für",
    wordTitleSecond: "den Alltag.",
    wordDescription: "Entdecke eine kleine, sprachspezifische Auswahl, höre die Wörter mit der Sprachsynthese deines Browsers und wiederhole sie in passenden Abständen.",
    sampleWords: "Beispielwörter",
    forms: "Formen",
    speechLimit: "Browser-Sprachausgabe · die Qualität variiert je nach Gerät und Sprache.",
    sourceConsulted: "Quelle eingesehen",
    sourceLimited: "Zugriff eingeschränkt / Prüfung erforderlich",
    entryDisclaimer: "Die Einträge sind eigene Beispiele und nicht aus Wörterbüchern oder offiziellen Prüfungen übernommen. Definitionen und Gebrauchshinweise müssen vor der Veröffentlichung unabhängig durch Wörterbücher und Lehrkräfte geprüft werden. Ungeprüfte IPA-Angaben wurden nicht ergänzt.",
    allWords: "Alle Wörter",
    spellHint: "Schreibe das Wort oder den Ausdruck in der Zielsprache für diese Bedeutung:",
    dueToday: "Zur Wiederholung fällig",
    reviewIn: "Wiederholung in",
    lastReviewed: "Zuletzt wiederholt",
    successes: "erfolgreiche Wiederholungen",
    difficulties: "schwierige Wiederholungen",
    reviewLevelLearning: "Im Lernprozess",
    reviewLevelEstablished: "Gefestigt",
    reviewScheduleTitle: "Demo mit festen Intervallen",
    optionDoesNotFitMeaning: "Diese Bedeutung gehört zu einem anderen Wort der Zielsprache.",
    optionDoesNotFitCollocation: "Diese Wendung wird nicht natürlich mit diesem Wort verwendet.",
  },
} as const;

const categoryTranslations: Record<InterfaceLocale, Record<string, string>> = {
  en: {
    "Greetings and introductions": "Greetings and introductions", "Family and relationships": "Family and relationships", "Food and drinks": "Food and drinks",
    "Travel and transport": "Travel and transport", Education: "Education", "Work and business": "Work and business", "Daily routine": "Daily routine",
    Shopping: "Shopping", Health: "Health", Emotions: "Emotions", Technology: "Technology", Nature: "Nature", Culture: "Culture", Society: "Society",
    Environment: "Environment", Media: "Media", "Politics and current affairs": "Politics and current affairs", "Abstract concepts": "Abstract concepts",
  },
  fr: {
    "Greetings and introductions": "Salutations et présentations", "Family and relationships": "Famille et relations", "Food and drinks": "Alimentation et boissons",
    "Travel and transport": "Voyages et transports", Education: "Éducation", "Work and business": "Travail et affaires", "Daily routine": "Vie quotidienne",
    Shopping: "Achats", Health: "Santé", Emotions: "Émotions", Technology: "Technologie", Nature: "Nature", Culture: "Culture", Society: "Société",
    Environment: "Environnement", Media: "Médias", "Politics and current affairs": "Politique et actualité", "Abstract concepts": "Concepts abstraits",
  },
  es: {
    "Greetings and introductions": "Saludos y presentaciones", "Family and relationships": "Familia y relaciones", "Food and drinks": "Comida y bebidas",
    "Travel and transport": "Viajes y transporte", Education: "Educación", "Work and business": "Trabajo y negocios", "Daily routine": "Rutina diaria",
    Shopping: "Compras", Health: "Salud", Emotions: "Emociones", Technology: "Tecnología", Nature: "Naturaleza", Culture: "Cultura", Society: "Sociedad",
    Environment: "Medio ambiente", Media: "Medios", "Politics and current affairs": "Política y actualidad", "Abstract concepts": "Conceptos abstractos",
  },
  it: {
    "Greetings and introductions": "Saluti e presentazioni", "Family and relationships": "Famiglia e relazioni", "Food and drinks": "Cibo e bevande",
    "Travel and transport": "Viaggi e trasporti", Education: "Istruzione", "Work and business": "Lavoro e affari", "Daily routine": "Vita quotidiana",
    Shopping: "Acquisti", Health: "Salute", Emotions: "Emozioni", Technology: "Tecnologia", Nature: "Natura", Culture: "Cultura", Society: "Società",
    Environment: "Ambiente", Media: "Media", "Politics and current affairs": "Politica e attualità", "Abstract concepts": "Concetti astratti",
  },
  de: {
    "Greetings and introductions": "Begrüßungen und Vorstellungen", "Family and relationships": "Familie und Beziehungen", "Food and drinks": "Essen und Trinken",
    "Travel and transport": "Reisen und Verkehr", Education: "Bildung", "Work and business": "Arbeit und Wirtschaft", "Daily routine": "Alltag",
    Shopping: "Einkaufen", Health: "Gesundheit", Emotions: "Gefühle", Technology: "Technologie", Nature: "Natur", Culture: "Kultur", Society: "Gesellschaft",
    Environment: "Umwelt", Media: "Medien", "Politics and current affairs": "Politik und Zeitgeschehen", "Abstract concepts": "Abstrakte Begriffe",
  },
};

function vocabularyCategory(locale: InterfaceLocale, category: string) {
  return categoryTranslations[locale][category] ?? category;
}

function ModuleFrame({
  language,
  level,
  children,
  current,
}: {
  language: Language;
  level: LearningLevel;
  children: React.ReactNode;
  current: string;
}) {
  const { locale } = useInterfaceLanguage();
  return (
    <>
      <LearningHeader />
      <main className="learning-page module-page">
        <div className="page-width">
          <LearningBreadcrumbs items={[
            { label: "Explore languages", href: "/languages" },
            { label: language.name, href: `/languages/${language.slug}` },
            { label: `${level.title} · ${level.name}`, href: `/languages/${language.slug}/${level.slug}` },
            { label: current },
          ]} />
          {children}
          <p className="module-demo-note">{learningUi(locale, "localDemo")}</p>
        </div>
      </main>
      <LearningFooter />
    </>
  );
}

export function GrammarTopicIndex({
  language,
  level,
  topics,
}: {
  language: Language;
  level: LearningLevel;
  topics: GrammarTopic[];
}) {
  const { locale } = useInterfaceLanguage();
  const { progress } = useLearningProgress();
  const completed = new Set(progress.completedGrammarLessons);
  return (
    <ModuleFrame language={language} level={level} current={learningUi(locale, "grammar")}>
      <section className="module-hero grammar-module-hero">
        <div className="module-hero-copy">
          <span className="eyebrow"><span className="eyebrow-star">✳</span>{language.flag} {language.name} · {level.title}</span>
          <h1>{learningUi(locale, "grammar")}<br /><i>{moduleLabels[locale].grammarTagline}</i></h1>
          <p>{locale === "fr" ? "Des modèles clairs, des exemples du quotidien et un peu de pratique à la fois." : locale === "es" ? "Patrones claros, ejemplos cotidianos y práctica paso a paso." : locale === "it" ? "Strutture chiare, esempi quotidiani e pratica un passo alla volta." : locale === "de" ? "Klare Muster, Beispiele aus dem Alltag und Übung Schritt für Schritt." : `Clear patterns, real-life examples and a little practice at a time for ${language.name} ${level.title}.`}</p>
          <div className="module-hero-actions">
            <a className="button button-dark" href="#grammar-topics">{learningUi(locale, "start")} <Arrow /></a>
            <Link className="text-link" href={`/languages/${language.slug}/${level.slug}`}>{learningUi(locale, "levelOverview")} <Arrow /></Link>
          </div>
          <span className="module-hero-footnote">{topics.length} {moduleLabels[locale].topicCount} · {topics.length * 3} {moduleLabels[locale].practicePrompt}</span>
        </div>
        <div className="module-hero-art grammar-hero-art" aria-label={`${language.name} grammar lesson illustration`}>
          <span className="module-art-star">✳</span>
          <span className="module-art-word">gram-<br />mar</span>
          <span className="module-art-note">patterns<br />that make<br />meaning</span>
          <span className="module-art-paper">A little structure<br />goes a long way.</span>
          <span className="module-art-level">{level.title}</span>
        </div>
      </section>

      <section className="module-topic-section" id="grammar-topics">
        <SectionIntro
          eyebrow={`${language.name} ${level.title} · ${topics.length} ${topics.length === 1 ? moduleLabels[locale].shortLesson : moduleLabels[locale].shortLessons}`}
          title={learningUi(locale, "grammarTitle")}
          description={learningUi(locale, "contentNote")}
        />
        {topics.length ? (
          <div className="module-topic-grid">
            {topics.map((topic, index) => {
              const isComplete = completed.has(`${language.slug}/${level.slug}/grammar/${topic.id}`);
              return (
                <Link
                  className={`module-topic-card module-topic-tone-${(index % 5) + 1}`}
                  href={`/languages/${language.slug}/${level.slug}/grammar/${topic.id}`}
                  key={topic.id}
                >
                  <span className="module-topic-meta"><span>0{index + 1} · {level.title}</span><span>{isComplete ? `✓ ${learningUi(locale, "completed")}` : `${topic.exercises.length} ${learningUi(locale, "practice").toLowerCase()}`}</span></span>
                  <h3>{topic.title}</h3>
                  <p>{topic.objective}</p>
                  <span className="module-topic-objective">{topic.context}</span>
                  <span className="module-topic-link">{learningUi(locale, "start")} <Arrow /></span>
                </Link>
              );
            })}
          </div>
        ) : <p className="module-empty-state">{learningUi(locale, "noGrammar")}</p>}
      </section>

      <LearningNotice />
    </ModuleFrame>
  );
}

function LearningNotice() {
  const { locale } = useInterfaceLanguage();
  const { storageError } = useLearningProgress();
  return (
    <aside className={`learning-notice ${storageError ? "has-error" : ""}`} role={storageError ? "alert" : "note"}>
      <span aria-hidden="true">{storageError ? "!" : "✳"}</span>
      <div>
        <strong>{storageError ? learningUi(locale, "storageError") : learningUi(locale, "sampleCurriculum")}</strong>
        <p>{storageError ?? learningUi(locale, "contentNote")}</p>
      </div>
    </aside>
  );
}

export function GrammarLesson({
  language,
  level,
  topic,
}: {
  language: Language;
  level: LearningLevel;
  topic: GrammarTopic;
}) {
  const { locale } = useInterfaceLanguage();
  const { progress, recordAnswer, completeGrammarLesson } = useLearningProgress();
  const completedKey = `${language.slug}/${level.slug}/grammar/${topic.id}`;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = topic.exercises[questionIndex];
  const isComplete = progress.completedGrammarLessons.includes(completedKey);

  function checkAnswer() {
    if (!answer.trim() || checked) return;
    const correct = normalizeAnswer(answer) === normalizeAnswer(question.acceptedAnswers[0]);
    recordAnswer(correct);
    setLastCorrect(correct);
    setChecked(true);
    if (correct) setScore((current) => current + 1);
  }

  function continueLesson() {
    if (questionIndex + 1 < topic.exercises.length) {
      setQuestionIndex((current) => current + 1);
      setAnswer("");
      setChecked(false);
      return;
    }
    completeGrammarLesson(language.slug, level.slug, topic.id, score, topic.exercises.length);
    setFinished(true);
  }

  function retryQuestion() {
    setAnswer("");
    setChecked(false);
  }

  return (
    <ModuleFrame language={language} level={level} current={topic.title}>
      <div className="lesson-topline">
        <Link className="lesson-back-link" href={`/languages/${language.slug}/${level.slug}/grammar`}>← {learningUi(locale, "grammarTitle")}</Link>
        <span>{language.flag} {language.name} · {level.title} · {learningUi(locale, "sampleCurriculum")}</span>
      </div>

      <section className="grammar-lesson-heading">
        <div>
          <span className="eyebrow"><span className="eyebrow-star">✳</span>{learningUi(locale, "theory")} · {level.title}</span>
          <h1>{topic.title}</h1>
          <p>{topic.objective}</p>
        </div>
        <div className="lesson-heading-badge"><span>{language.flag}</span><b>{level.title}</b><small>{level.name}</small></div>
      </section>

      <div className="grammar-lesson-layout">
        <div className="grammar-lesson-main">
          <section className="grammar-explanation-card">
            <span className="module-section-kicker">01 / {topic.curriculumExercises ? "A clear explanation" : learningUi(locale, "theory")}</span>
            <h2>{topic.curriculumExercises ? "A clear explanation" : learningUi(locale, "theory")}</h2>
            <p>{topic.explanation}</p>
            <div className="grammar-rule-box"><span>{learningUi(locale, "rules")}</span><p>{topic.rule}</p></div>
            {!topic.curriculumExercises && <div className="grammar-pattern-grid">
              {([
                [learningUi(locale, "positive"), topic.pattern.positive],
                [learningUi(locale, "negative"), topic.pattern.negative],
                [learningUi(locale, "question"), topic.pattern.question],
              ] as const).map(([label, text]) => <div key={label}><span>{label}</span><p>{text}</p></div>)}
            </div>}
          </section>

          <section className="grammar-example-section">
            <div className="module-section-kicker">02 / {topic.curriculumExercises ? "Examples in context" : learningUi(locale, "examples")}</div>
            <h2>{topic.curriculumExercises ? "Examples in context" : learningUi(locale, "examples")}</h2>
            <div className="grammar-example-grid">
              {topic.examples.map((example) => (
                <article className="grammar-example-card" key={example.target}>
                  <p>{example.target}</p><span>{example.translation}</span><small>{example.note}</small>
                </article>
              ))}
            </div>
          </section>

          {!topic.curriculumExercises && <section className="grammar-context-grid">
            <article><span>{learningUi(locale, "context")}</span><p>{topic.context}</p></article>
            <article><span>{learningUi(locale, "commonMistakes")}</span><p className="grammar-mistake"><s>{topic.commonMistake.incorrect}</s><b>{topic.commonMistake.correct}</b></p><small>{topic.commonMistake.why}</small></article>
            <article><span>{learningUi(locale, "compare")}</span><p><b>{topic.distinction.structures}</b></p><small>{topic.distinction.difference}</small></article>
          </section>}

          <section className="grammar-practice-section" aria-labelledby="grammar-practice-title">
            <div className="module-section-kicker">03 / {topic.curriculumExercises ? "Let's practise" : learningUi(locale, "practice")}</div>
            <div className="grammar-practice-header">
              <div><h2 id="grammar-practice-title">{topic.curriculumExercises ? "Let's practise" : learningUi(locale, "practice")}</h2><p>{learningUi(locale, "instruction")}</p></div>
              <span>{learningUi(locale, "questionProgress")} {Math.min(questionIndex + 1, topic.exercises.length)} / {topic.exercises.length}</span>
            </div>
            {finished ? (
              <div className="grammar-finished-panel">
                <span className="finished-mark">✳</span><h3>{learningUi(locale, "completed")}</h3>
                <p>{learningUi(locale, "score")}: {score} / {topic.exercises.length} · {learningUi(locale, "savedProgress")}</p>
                <div className="grammar-finished-actions">
                  <button className="button button-dark" onClick={() => { setQuestionIndex(0); setAnswer(""); setChecked(false); setScore(0); setFinished(false); }}>{learningUi(locale, "retryQuiz")}</button>
                  <Link className="button button-outline" href={`/languages/${language.slug}/${level.slug}/grammar`}>{learningUi(locale, "grammarTitle")} <Arrow /></Link>
                </div>
              </div>
            ) : question ? (
              <GrammarQuestionCard
                question={question}
                index={questionIndex}
                total={topic.exercises.length}
                score={score}
                answer={answer}
                checked={checked}
                isCorrect={lastCorrect}
                locale={locale}
                onAnswer={setAnswer}
                onCheck={checkAnswer}
                onRetry={retryQuestion}
                onNext={continueLesson}
              />
            ) : null}
          </section>
          <LearningNotice />
        </div>
        <aside className="grammar-lesson-aside">
          <span className="module-section-kicker">{learningUi(locale, "levelOverview")}</span>
          <strong>{level.title}</strong>
          <p>{level.summary}</p>
          <div className="grammar-aside-progress"><span>{learningUi(locale, "sampleProgress")}</span><div><i style={{ width: `${level.progress}%` }} /></div><small>{level.progress}%</small></div>
          <Link href={`/languages/${language.slug}/${level.slug}`} className="text-link">{learningUi(locale, "returnToLesson")} <Arrow /></Link>
          <Link href={`/languages/${language.slug}/${level.slug}/vocabulary`} className="text-link">{learningUi(locale, "vocabularyTitle")} <Arrow /></Link>
          <p className="grammar-aside-note">{isComplete ? `✓ ${learningUi(locale, "completed")}` : learningUi(locale, "sampleCurriculum")}</p>
        </aside>
      </div>
    </ModuleFrame>
  );
}

function normalizeAnswer(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase()
    .replace(/[’‘`]/g, "'").replace(/[.!?;:]+$/u, "");
}

function GrammarQuestionCard({
  question,
  index,
  total,
  answer,
  checked,
  isCorrect,
  score,
  locale,
  onAnswer,
  onCheck,
  onRetry,
  onNext,
}: {
  question: GrammarExercise;
  index: number;
  total: number;
  answer: string;
  checked: boolean;
  isCorrect: boolean;
  score: number;
  locale: "en" | "fr" | "es" | "it" | "de";
  onAnswer: (answer: string) => void;
  onCheck: () => void;
  onRetry: () => void;
  onNext: () => void;
}) {
  const { progress } = useLearningProgress();
  const displayPrompt = question.prompt;
  return (
    <div className="grammar-question-card">
      <div className="grammar-question-meta"><span>0{index + 1}</span><span>{question.type.replaceAll("-", " ")}</span></div>
      <p className="grammar-question-instruction">{localizedGrammarInstruction(locale, question.type, question.instruction)}</p>
      <h3>{displayPrompt}</h3>
      {question.options?.length ? (
        <div className="grammar-answer-options" role="group" aria-label={learningUi(locale, "selectOption")}>
          {question.options.map((option, optionIndex) => (
            <button type="button" className={`grammar-option ${answer === option ? "is-selected" : ""} ${checked && question.acceptedAnswers.some((accepted) => normalizeAnswer(option) === normalizeAnswer(accepted)) ? "is-answer" : ""}`} key={option} onClick={() => !checked && onAnswer(option)} disabled={checked}>
              <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
            </button>
          ))}
        </div>
      ) : (
        <label className="grammar-answer-input">
          <span className="sr-only">{learningUi(locale, "enterAnswer")}</span>
          <input value={answer} onChange={(event) => onAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !checked) onCheck(); }} placeholder={learningUi(locale, "enterAnswer")} disabled={checked} autoComplete="off" />
        </label>
      )}
      {!checked ? (
        <button className="button button-dark grammar-check-button" onClick={onCheck} disabled={!answer.trim()}>{learningUi(locale, "checkAnswer")} <Arrow /></button>
      ) : (
        <div className={`grammar-answer-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`} aria-live="polite">
          <strong>{isCorrect ? learningUi(locale, "correct") : learningUi(locale, "incorrect")}</strong>
          {!isCorrect && <p>{learningUi(locale, "correctAnswer")}: <b>{question.acceptedAnswers.join(" / ")}</b></p>}
          {!isCorrect && question.options?.length && question.distractorExplanations?.[answer] && <p>{question.distractorExplanations[answer]}</p>}
          <p>{question.explanation}</p>
          <div className="grammar-feedback-actions">
            {!isCorrect && <button className="button button-outline" onClick={onRetry}>{learningUi(locale, "tryAgain")}</button>}
            <button className="button button-dark" onClick={onNext}>{index + 1 === total ? learningUi(locale, "completeLesson") : learningUi(locale, "nextQuestion")} <Arrow /></button>
          </div>
        </div>
      )}
      <div className="grammar-question-progress"><span>{learningUi(locale, "score")}: {score} / {total}</span><span>{Math.round(((index + (checked ? 1 : 0)) / total) * 100)}%</span><div role="progressbar" aria-valuenow={Math.round(((index + (checked ? 1 : 0)) / total) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${learningUi(locale, "questionProgress")} ${index + (checked ? 1 : 0)} / ${total}`}><i style={{ width: `${((index + (checked ? 1 : 0)) / total) * 100}%` }} /></div></div>
      <p className="grammar-answer-count">{learningUi(locale, "rightAnswers")}: {progress.correctAnswers} · {learningUi(locale, "missedAnswers")}: {progress.incorrectAnswers}</p>
    </div>
  );
}

function localizedGrammarInstruction(
  locale: "en" | "fr" | "es" | "it" | "de",
  type: GrammarExercise["type"],
  english: string,
) {
  if (locale === "en") return english;
  const instructions = {
    fr: {
      "multiple-choice": "Choisissez la meilleure réponse.",
      "fill-blank": "Complétez la phrase avec la forme correcte.",
      "choose-form": "Choisissez la forme correcte.",
      "sentence-transformation": "Reformulez sans changer le sens.",
      "word-order": "Remettez les mots dans le bon ordre.",
      "true-false": "Indiquez si l’affirmation est vraie ou fausse.",
      "error-correction": "Corrigez l’erreur dans la phrase.",
      translation: "Saisissez la traduction demandée.",
    },
    es: {
      "multiple-choice": "Elige la mejor respuesta.",
      "fill-blank": "Completa la frase con la forma correcta.",
      "choose-form": "Elige la forma correcta.",
      "sentence-transformation": "Reformula la frase sin cambiar el sentido.",
      "word-order": "Ordena las palabras correctamente.",
      "true-false": "Indica si la afirmación es verdadera o falsa.",
      "error-correction": "Corrige el error de la frase.",
      translation: "Escribe la traducción solicitada.",
    },
    it: {
      "multiple-choice": "Scegli la risposta migliore.",
      "fill-blank": "Completa la frase con la forma corretta.",
      "choose-form": "Scegli la forma corretta.",
      "sentence-transformation": "Riformula senza cambiare il significato.",
      "word-order": "Metti le parole nell’ordine corretto.",
      "true-false": "Indica se l’affermazione è vera o falsa.",
      "error-correction": "Correggi l’errore nella frase.",
      translation: "Scrivi la traduzione richiesta.",
    },
    de: {
      "multiple-choice": "Wähle die beste Antwort.",
      "fill-blank": "Ergänze den Satz mit der richtigen Form.",
      "choose-form": "Wähle die richtige Form.",
      "sentence-transformation": "Formuliere um, ohne die Bedeutung zu ändern.",
      "word-order": "Bringe die Wörter in die richtige Reihenfolge.",
      "true-false": "Entscheide, ob die Aussage richtig oder falsch ist.",
      "error-correction": "Korrigiere den Fehler im Satz.",
      translation: "Gib die geforderte Übersetzung ein.",
    },
  } as const;
  return instructions[locale][type];
}

type VocabularyMatchPair = {
  entry: VocabularyEntry;
  options: string[];
};

type VocabularyExercise = {
  id: string;
  entry: VocabularyEntry;
  prompt: string;
  answer: string;
  acceptedAnswers?: string[];
  explanation: string;
  options?: string[];
  matchPairs?: VocabularyMatchPair[];
  type: "match" | "choose" | "spell" | "sentence" | "collocation";
};

function makeVocabularyExercises(entries: VocabularyEntry[], sameLanguageEntries: VocabularyEntry[]): VocabularyExercise[] {
  const definedEntries = entries.filter((entry) => entry.translation);
  const matchExercise: VocabularyExercise[] = definedEntries.length > 1 ? [{
    id: `${definedEntries[0].language}-${definedEntries[0].level}-translation-match`,
    entry: definedEntries[0],
    prompt: "",
    answer: "",
    explanation: "",
    matchPairs: definedEntries.map((entry) => ({
      entry,
      options: uniqueValues(definedEntries.map((candidate) => candidate.translation)).sort((a, b) => a.localeCompare(b)),
    })),
    type: "match",
  }] : [];

  const individualExercises = entries.flatMap((entry, index) => {
    if (!entry.translation) {
      const contextExercise = makeSentenceExercise(entry);
      return contextExercise ? [contextExercise] : [];
    }

    let exercise: VocabularyExercise;
    if (index % 3 === 0) {
      const distractors = uniqueValues(sameLanguageEntries
        .filter((candidate) => candidate.id !== entry.id)
        .map((candidate) => candidate.translation)
        .filter(Boolean))
        .filter((translation) => translation !== entry.translation).slice(0, 3);
      exercise = {
        id: `${entry.id}-meaning`,
        entry,
        prompt: entry.target,
        answer: entry.translation,
        explanation: entry.usageNote,
        options: [entry.translation, ...distractors].sort((a, b) => a.localeCompare(b)),
        type: "choose",
      };
    } else if (index % 3 === 1) {
      exercise = {
        id: `${entry.id}-spelling`,
        entry,
        prompt: entry.translation,
        answer: entry.target,
        acceptedAnswers: entry.acceptedAnswers,
        explanation: entry.usageNote,
        type: "spell",
      };
    } else {
      const categoryEntries = sameLanguageEntries.filter((candidate) => candidate.id !== entry.id && candidate.category === entry.category);
      const otherEntries = sameLanguageEntries.filter((candidate) => candidate.id !== entry.id && candidate.category !== entry.category);
      const collocationChoices = uniqueValues([...categoryEntries, ...otherEntries]
        .flatMap((candidate) => candidate.collocations))
        .filter((collocation) => !entry.collocations.includes(collocation)).slice(0, 3);
      const correctCollocation = entry.collocations[0];
      if (!correctCollocation) {
        exercise = {
          id: `${entry.id}-meaning-review`,
          entry,
          prompt: entry.target,
          answer: entry.translation,
          explanation: entry.usageNote,
          options: [entry.translation, ...uniqueValues(sameLanguageEntries
            .filter((candidate) => candidate.id !== entry.id)
            .map((candidate) => candidate.translation)
            .filter(Boolean)).filter((translation) => translation !== entry.translation).slice(0, 3)].sort((a, b) => a.localeCompare(b)),
          type: "choose",
        };
        const contextExercise = makeSentenceExercise(entry);
        return contextExercise ? [exercise, contextExercise] : [exercise];
      }
      exercise = {
        id: `${entry.id}-collocation`,
        entry,
        prompt: entry.target,
        answer: correctCollocation,
        explanation: `${entry.usageNote} Natural pairing: ${correctCollocation}.`,
        options: [correctCollocation, ...collocationChoices].sort((a, b) => a.localeCompare(b)),
        type: "collocation",
      };
    }

    const contextExercise = makeSentenceExercise(entry);
    return contextExercise ? [exercise, contextExercise] : [exercise];
  });

  return [...matchExercise, ...individualExercises];
}

function uniqueValues(values: string[]) {
  return [...new Set(values)];
}

function makeSentenceExercise(entry: VocabularyEntry): VocabularyExercise | null {
  const stripArticle = (value: string) => value.replace(/^(?:to|a|an|the|un|une|des|du|le|la|les|el|los|las|il|lo|i|gli|der|die|das)\s+/iu, "");
  const candidates = uniqueValues([
    stripArticle(entry.target),
    ...(entry.plural ? [stripArticle(entry.plural)] : []),
  ]).sort((a, b) => b.length - a.length);

  for (const candidate of candidates) {
    if (!candidate) continue;
    const matcher = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(candidate)}(?![\\p{L}\\p{N}])`, "iu");
    const match = entry.example.match(matcher);
    if (!match) continue;
    return {
      id: `${entry.id}-sentence`,
      entry,
      prompt: `${entry.example.replace(matcher, "_____")} (${entry.exampleTranslation})`,
      answer: match[0],
      explanation: `${entry.usageNote} The completed example uses “${match[0]}”.`,
      type: "sentence",
    };
  }
  return null;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const speechLanguage: Record<LanguageSlug, string> = {
  english: "en-GB",
  french: "fr-FR",
  spanish: "es-ES",
  italian: "it-IT",
  german: "de-DE",
};

const speechSubscribe = () => () => {};
const speechSnapshot = () => typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
const speechServerSnapshot = () => false;
const moduleLoadedAt = Date.now();

export function VocabularyModule({
  language,
  level,
  entries,
}: {
  language: Language;
  level: LearningLevel;
  entries: VocabularyEntry[];
}) {
  const { locale } = useInterfaceLanguage();
  const { progress, reviewWord, recordAnswer, completeVocabularyExercise, storageError } = useLearningProgress();
  const [cardIndex, setCardIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exerciseAnswer, setExerciseAnswer] = useState("");
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [exerciseChecked, setExerciseChecked] = useState(false);
  const [exerciseCorrect, setExerciseCorrect] = useState(false);
  const [exerciseScore, setExerciseScore] = useState(0);
  const [exerciseFinished, setExerciseFinished] = useState(false);
  const canSpeak = useSyncExternalStore(speechSubscribe, speechSnapshot, speechServerSnapshot);
  const exercises = useMemo(
    () => makeVocabularyExercises(entries, vocabularyEntries.filter((entry) => entry.language === language.slug)),
    [entries, language.slug],
  );
  const categories = useMemo(() => uniqueValues(entries.map((entry) => entry.category)).sort((a, b) => a.localeCompare(b)), [entries]);
  const filteredEntries = selectedCategory ? entries.filter((entry) => entry.category === selectedCategory) : entries;
  const current = filteredEntries[cardIndex];
  const exercise = exercises[exerciseIndex];
  const reviewEntries = entries.flatMap((entry) => {
    const review = progress.vocabularyReviews.find((item) => item.wordId === entry.id);
    return review ? [{ entry, review }] : [];
  });

  function moveCard(direction: -1 | 1) {
    if (!filteredEntries.length) return;
    setCardIndex((currentIndex) => (currentIndex + direction + filteredEntries.length) % filteredEntries.length);
    setIsFlipped(false);
  }

  function chooseCategory(category: string) {
    setSelectedCategory(category);
    setCardIndex(0);
    setIsFlipped(false);
  }

  function speakWord() {
    if (!current || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;
    const utterance = new SpeechSynthesisUtterance(current.target);
    utterance.lang = speechLanguage[language.slug];
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function checkVocabularyAnswer() {
    if (!exercise || exerciseChecked) return;
    const isMatching = exercise.type === "match";
    if (isMatching && !exercise.matchPairs?.every((pair) => matchAnswers[pair.entry.id]))
      return;
    if (!isMatching && !exerciseAnswer.trim()) return;
    const acceptedAnswers = exercise.acceptedAnswers ?? [exercise.answer];
    const isCorrect = isMatching
      ? Boolean(exercise.matchPairs?.every((pair) => normalizeAnswer(matchAnswers[pair.entry.id]) === normalizeAnswer(pair.entry.translation)))
      : acceptedAnswers.some((answer) => normalizeAnswer(exerciseAnswer) === normalizeAnswer(answer));
    setExerciseCorrect(isCorrect);
    setExerciseChecked(true);
    recordAnswer(isCorrect);
    if (isCorrect) setExerciseScore((score) => score + 1);
  }

  function nextVocabularyExercise() {
    if (exerciseIndex + 1 < exercises.length) {
      setExerciseIndex((index) => index + 1);
      setExerciseAnswer("");
      setMatchAnswers({});
      setExerciseChecked(false);
      return;
    }
    completeVocabularyExercise(language.slug, level.slug, `${language.slug}-${level.slug}`, exerciseScore, exercises.length);
    setExerciseFinished(true);
  }

  function restartVocabularyExercise() {
    setExerciseIndex(0);
    setExerciseAnswer("");
    setMatchAnswers({});
    setExerciseChecked(false);
    setExerciseScore(0);
    setExerciseFinished(false);
  }

  function revisitWord(word: VocabularyEntry) {
    chooseCategory(word.category);
    setCardIndex(entries.filter((entry) => entry.category === word.category).findIndex((entry) => entry.id === word.id));
    setIsFlipped(false);
    document.getElementById("word-cards")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <ModuleFrame language={language} level={level} current={learningUi(locale, "vocabulary")}>
      <section className="module-hero vocabulary-module-hero">
        <div className="module-hero-copy">
          <span className="eyebrow"><span className="eyebrow-star">✳</span>{language.flag} {language.name} · {level.title}</span>
          <h1>{moduleLabels[locale].wordTitle}<br /><i>{moduleLabels[locale].wordTitleSecond}</i></h1>
          <p>{learningUi(locale, "vocabularyDeck")} · {language.name} {level.title}. {moduleLabels[locale].wordDescription}</p>
          <div className="module-hero-actions"><a className="button button-dark" href="#word-cards">{learningUi(locale, "start")} <Arrow /></a><Link className="text-link" href={`/languages/${language.slug}/${level.slug}`}>{learningUi(locale, "levelOverview")} <Arrow /></Link></div>
          <span className="module-hero-footnote">{entries.length} {moduleLabels[locale].sampleWords} · {progress.vocabularyLearned.filter((id) => entries.some((entry) => entry.id === id)).length} {learningUi(locale, "learnedWords").toLowerCase()}</span>
        </div>
        <div className="module-hero-art vocabulary-hero-art" aria-label={`${language.name} vocabulary illustration`}>
          <span className="module-art-star">✳</span><span className="vocabulary-art-flag">{language.flag}</span>
          <span className="vocabulary-art-word">{entries[0]?.target ?? language.name}<br />{entries[1]?.target ?? language.flag}</span>
          <span className="vocabulary-art-note">one word<br />opens a door</span><span className="module-art-level">{level.title}</span>
        </div>
      </section>

      <section className="vocabulary-workspace" id="word-cards">
        <div className="vocabulary-section-heading">
          <SectionIntro eyebrow={`${language.name} · ${level.title}`} title={learningUi(locale, "vocabularyTitle")} description={learningUi(locale, "currentWords")} />
          <span className="vocabulary-count">{String(filteredEntries.length).padStart(2, "0")} <i>/ {moduleLabels[locale].sampleWords.toUpperCase()}</i></span>
        </div>

        <div className="vocabulary-category-filters" aria-label={learningUi(locale, "topics")}>
          <button type="button" className={!selectedCategory ? "is-active" : ""} onClick={() => chooseCategory("")}>{moduleLabels[locale].allWords}</button>
          {categories.map((category) => <button key={category} type="button" className={selectedCategory === category ? "is-active" : ""} onClick={() => chooseCategory(category)}>{vocabularyCategory(locale, category)}</button>)}
        </div>

        {current ? (
          <div className="vocabulary-study-grid">
            <div className={`vocabulary-flashcard ${isFlipped ? "is-flipped" : ""}`}>
              <div className="flashcard-top"><span>{language.flag} {language.name} · {level.title}</span><span>{String(cardIndex + 1).padStart(2, "0")} / {String(filteredEntries.length).padStart(2, "0")}</span></div>
              {!isFlipped ? (
                <div className="flashcard-front">
                  <span className="flashcard-kicker">{learningUi(locale, "frontOfCard")}</span>
                  <span className="flashcard-category">{vocabularyCategory(locale, current.category)}</span>
                  <h3>{current.target}</h3>
                  {current.gender && <span className="flashcard-gender">{learningUi(locale, "gender")}: {current.gender}</span>}
                  <button className="flashcard-flip" onClick={() => setIsFlipped(true)}>{learningUi(locale, "flipCard")} <Arrow /></button>
                </div>
              ) : (
                <div className="flashcard-back">
                  <span className="flashcard-kicker">{learningUi(locale, "backOfCard")}</span>
                  <h3>{current.translation || "Definition not provided in the source material."}</h3>
                  <div className="flashcard-example"><p>{current.example}</p><span>{current.exampleTranslation}</span></div>
                  <p className="flashcard-usage">{current.usageNote}</p>
                  <div className="flashcard-facts">
                    <span><b>{learningUi(locale, "partOfSpeech")}</b>{current.sourcePartOfSpeech ?? current.partOfSpeech}</span>
                    {current.gender && <span><b>{learningUi(locale, "gender")}</b>{current.gender}</span>}
                    {current.plural && <span><b>{learningUi(locale, "plural")}</b>{current.plural}</span>}
                    {current.irregularForms && <span><b>{moduleLabels[locale].forms}</b>{current.irregularForms}</span>}
                  </div>
                  {current.collocations.length > 0 && <div className="flashcard-collocations"><b>{learningUi(locale, "collocations")}</b><span>{current.collocations.join(" · ")}</span></div>}
                </div>
              )}
              <div className="flashcard-footer">
                <button type="button" onClick={() => moveCard(-1)} aria-label={learningUi(locale, "previousWord")}>←</button>
                <span>{vocabularyCategory(locale, current.category)}</span>
                <button type="button" onClick={() => moveCard(1)} aria-label={learningUi(locale, "nextWord")}>→</button>
              </div>
            </div>

            <aside className="vocabulary-word-aside">
              <span className="module-section-kicker">{learningUi(locale, "atThisLevel")}</span>
              <h3>{current.target}</h3>
              <p>{current.translation || "Definition not provided in the source material."}</p>
              <div className="vocabulary-speech">
                <button type="button" className="button button-outline" onClick={speakWord} disabled={!canSpeak}>{learningUi(locale, "listen")} <span aria-hidden="true">◖))</span></button>
                {!canSpeak && <small>{learningUi(locale, "noPronunciation")}</small>}
                <small>{moduleLabels[locale].speechLimit}</small>
              </div>
              <div className="vocabulary-mark-actions">
                <button type="button" className="button button-dark" onClick={() => reviewWord(language.slug, level.slug, current.id, true)}>✓ {learningUi(locale, "knowWord")}</button>
                <button type="button" className="button button-outline" onClick={() => reviewWord(language.slug, level.slug, current.id, false)}>↻ {learningUi(locale, "practiceWord")}</button>
              </div>
              <p className="vocabulary-schedule-note">{learningUi(locale, "reviewSchedule")}</p>
            </aside>
          </div>
        ) : <p className="module-empty-state">{learningUi(locale, "contentNote")}</p>}
      </section>

      <section className="vocabulary-practice-section">
        <SectionIntro eyebrow={`${language.flag} ${language.name} · ${level.title}`} title={learningUi(locale, "vocabularyPractice")} description={learningUi(locale, "chooseTranslation")} />
        {exercises.length ? (
          <div className="vocabulary-quiz-card">
            <div className="vocabulary-quiz-side">
              <span className="module-section-kicker">{learningUi(locale, "practice")}</span>
              <strong>{String(Math.min(exerciseIndex + 1, exercises.length)).padStart(2, "0")}<i> / {String(exercises.length).padStart(2, "0")}</i></strong>
              <span>{language.name} · {level.title}</span>
              <span>{learningUi(locale, "score")}: {exerciseScore}</span>
              <div className="vocabulary-quiz-progress"><i style={{ width: `${Math.round(((exerciseIndex + (exerciseChecked ? 1 : 0)) / exercises.length) * 100)}%` }} /></div>
            </div>
            <div className="vocabulary-quiz-main">
              {exerciseFinished ? (
                <div className="vocabulary-quiz-finished">
                  <span className="finished-mark">✳</span><h3>{learningUi(locale, "quizComplete")}</h3>
                  <p>{learningUi(locale, "score")}: {exerciseScore} / {exercises.length}</p>
                  <button className="button button-dark" onClick={restartVocabularyExercise}>{learningUi(locale, "retryQuiz")} <Arrow /></button>
                </div>
              ) : exercise ? (
                <>
                  <span className="vocabulary-quiz-prompt">
                    {exercise.type === "match" ? learningUi(locale, "practice") : exercise.type === "choose" ? learningUi(locale, "chooseTranslation") : exercise.type === "spell" ? moduleLabels[locale].spellHint : exercise.type === "sentence" ? learningUi(locale, "sentencePrompt") : learningUi(locale, "chooseCollocation")}
                  </span>
                  <h3>{exercise.type === "match" ? learningUi(locale, "matchTranslations") : exercise.prompt}</h3>
                  {exercise.type === "match" && exercise.matchPairs ? (
                    <div className="vocabulary-match-list">
                      {exercise.matchPairs.map((pair) => (
                        <label key={pair.entry.id}>
                          <span>{pair.entry.target}</span>
                          <select
                            value={matchAnswers[pair.entry.id] ?? ""}
                            onChange={(event) => setMatchAnswers((currentAnswers) => ({ ...currentAnswers, [pair.entry.id]: event.target.value }))}
                            disabled={exerciseChecked}
                          >
                            <option value="">{learningUi(locale, "selectOption")}</option>
                            {pair.options.map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                        </label>
                      ))}
                    </div>
                  ) : exercise.options ? (
                    <div className="vocabulary-quiz-options">
                      {exercise.options.map((option) => <button key={option} className={exerciseAnswer === option ? "is-selected" : ""} disabled={exerciseChecked} onClick={() => setExerciseAnswer(option)}>{option}</button>)}
                    </div>
                  ) : <input className="vocabulary-quiz-input" value={exerciseAnswer} onChange={(event) => setExerciseAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !exerciseChecked) checkVocabularyAnswer(); }} placeholder={learningUi(locale, "enterAnswer")} disabled={exerciseChecked} autoComplete="off" />}
                  {exerciseChecked ? (
                    <div className={`vocabulary-quiz-feedback ${exerciseCorrect ? "is-correct" : "is-incorrect"}`} aria-live="polite">
                      <strong>{exerciseCorrect ? learningUi(locale, "correct") : learningUi(locale, "incorrect")}</strong>
                      {!exerciseCorrect && <span>{learningUi(locale, "correctAnswer")}: {exercise.type === "match" ? exercise.matchPairs?.map((pair) => `${pair.entry.target} → ${pair.entry.translation}`).join(" · ") : exercise.answer}</span>}
                      <p>{exercise.type === "match" ? learningUi(locale, "matchExplanation") : exercise.explanation}</p>
                      {!exerciseCorrect && exercise.options && (
                        <ul className="vocabulary-option-explanations">
                          {exercise.options.filter((option) => option !== exercise.answer).map((option) => (
                            <li key={option}><b>{option}</b> — {exercise.type === "collocation" ? moduleLabels[locale].optionDoesNotFitCollocation : moduleLabels[locale].optionDoesNotFitMeaning}</li>
                          ))}
                        </ul>
                      )}
                      <div className="vocabulary-quiz-feedback-actions">
                        {!exerciseCorrect && <button className="button button-outline" onClick={() => { setExerciseAnswer(""); setMatchAnswers({}); setExerciseChecked(false); }}>{learningUi(locale, "tryAgain")}</button>}
                        <button className="button button-dark" onClick={nextVocabularyExercise}>{exerciseIndex + 1 === exercises.length ? learningUi(locale, "exerciseComplete") : learningUi(locale, "nextQuestion")} <Arrow /></button>
                      </div>
                    </div>
                  ) : <button className="button button-dark" onClick={checkVocabularyAnswer} disabled={exercise.type === "match" ? !exercise.matchPairs?.every((pair) => matchAnswers[pair.entry.id]) : !exerciseAnswer.trim()}>{learningUi(locale, "checkAnswer")} <Arrow /></button>}
                </>
              ) : null}
            </div>
          </div>
        ) : <p className="module-empty-state">{learningUi(locale, "contentNote")}</p>}
      </section>

      <section className="vocabulary-review-section">
        <div className="vocabulary-review-heading"><div><span className="eyebrow"><span className="eyebrow-star">✳</span>{learningUi(locale, "reviewWords")}</span><h2>{learningUi(locale, "reviewWords")}<span> {reviewEntries.length.toString().padStart(2, "0")}</span></h2></div><p>{learningUi(locale, "reviewSchedule")}</p></div>
        {reviewEntries.length ? (
          <div className="vocabulary-due-list">
            {reviewEntries.map(({ entry, review }) => {
              const nextReviewTime = new Date(review.nextReviewAt).getTime();
              const daysUntilReview = Math.max(0, Math.ceil((nextReviewTime - moduleLoadedAt) / 86_400_000));
              const reviewStatus = daysUntilReview === 0 ? moduleLabels[locale].dueToday : `${moduleLabels[locale].reviewIn} ${daysUntilReview} ${learningUi(locale, "days")}`;
              const reviewedDate = review.lastReviewedAt
                ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(review.lastReviewedAt))
                : "";
              return (
                <article key={entry.id}>
                  <span>{entry.target}<small>{reviewStatus} · {review.difficulty === "learning" ? moduleLabels[locale].reviewLevelLearning : moduleLabels[locale].reviewLevelEstablished}</small></span>
                  <span>{entry.translation}<small>{moduleLabels[locale].successes}: {review.successes} · {moduleLabels[locale].difficulties}: {review.failures} · {moduleLabels[locale].lastReviewed}: {reviewedDate}</small></span>
                  <button className="button button-outline" onClick={() => revisitWord(entry)}>{learningUi(locale, "practiceWord")}</button>
                </article>
              );
            })}
          </div>
        ) : <div className="vocabulary-no-due"><span>✳</span><p>{learningUi(locale, "noReview")}</p></div>}
      </section>

      <section className="vocabulary-source-note">
        <div><span className="module-section-kicker">{learningUi(locale, "sources")}</span><h3>{learningUi(locale, "sourceNote")}</h3><p>{learningUi(locale, "contentNote")}</p></div>
        <ul>{getVocabularySourceNotes(language.slug).map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.organization} · {source.title} <Arrow /></a><span>{source.status === "consulted" ? moduleLabels[locale].sourceConsulted : moduleLabels[locale].sourceLimited} · {source.note}</span></li>)}</ul>
        <p className="vocabulary-source-disclaimer">{moduleLabels[locale].entryDisclaimer}</p>
      </section>
      <LearningNotice />
      {storageError && <p className="module-storage-error" role="alert">{learningUi(locale, "storageError")}: {storageError}</p>}
    </ModuleFrame>
  );
}

export function SupportedLanguageLinks({ currentLanguage }: { currentLanguage: Language }) {
  return (
    <div className="module-language-switcher">
      {languages.filter((language) => language.slug !== currentLanguage.slug).map((language) => (
        <Link key={language.slug} href={`/languages/${language.slug}`} aria-label={`Explore ${language.name}`}>{language.flag} {language.name}</Link>
      ))}
    </div>
  );
}

export function getModuleRouteParams(value: { language: string; level: string }): { language: LanguageSlug; level: LevelSlug } | null {
  const language = languages.find((item) => item.slug === value.language);
  const level = language?.levels.find((item) => item.slug === value.level);
  return language && level ? { language: language.slug, level: level.slug } : null;
}
