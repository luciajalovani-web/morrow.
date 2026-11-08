"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { LearningBreadcrumbs, LearningFooter, LearningHeader, SectionIntro } from "@/app/components/language-ui";
import { useInterfaceLanguage, type InterfaceLocale } from "@/app/components/interface-language";
import { useLearningProgress } from "@/app/components/learning-progress-provider";
import {
  getEnglishCurriculumReadingLessons,
  getEnglishCurriculumWritingTasks,
} from "@/app/lib/english-curriculum-content";
import {
  getFrenchCurriculumReadingLessons,
  getFrenchCurriculumWritingTasks,
} from "@/app/lib/french-curriculum-content";
import { englishListening, englishReading, englishWriting, type ListeningLesson, type ReadingLesson, type SkillQuestion, type WritingTask } from "@/app/lib/english-skills-content";
import { getLanguage, getLevel, levelSlugs, type LanguageSlug, type LevelSlug } from "@/app/lib/language-content";

type SkillSection = "writing" | "listening" | "reading";

const sectionLabels: Record<InterfaceLocale, Record<SkillSection | "grammar" | "vocabulary", string>> = {
  en: { writing: "Writing", listening: "Listening", reading: "Reading", grammar: "Grammar", vocabulary: "Vocabulary" },
  fr: { writing: "Écriture", listening: "Compréhension orale", reading: "Lecture", grammar: "Grammaire", vocabulary: "Vocabulaire" },
  es: { writing: "Expresión escrita", listening: "Comprensión auditiva", reading: "Lectura", grammar: "Gramática", vocabulary: "Vocabulario" },
  it: { writing: "Scrittura", listening: "Ascolto", reading: "Lettura", grammar: "Grammatica", vocabulary: "Vocabolario" },
  de: { writing: "Schreiben", listening: "Hören", reading: "Lesen", grammar: "Grammatik", vocabulary: "Wortschatz" },
};

const interfaceCopy: Record<InterfaceLocale, {
  title: Record<SkillSection, string>;
  description: Record<SkillSection, string>;
  start: string;
  levelOverview: string;
  chooseLevel: string;
  nextSectionEyebrow: string;
  nextSectionTitle: string;
  nextSectionDescription: string;
  closeDefinition: string;
  suggestionNote: string;
  audioPlayerLabel: string;
  audioFailed: string;
  instructions: string;
  wordRange: string;
  words: string;
  submitDraft: string;
  clearDraft: string;
  savedDraft: string;
  score: string;
  feedbackTitle: string;
  suggestedRevision: string;
  modelAnswer: string;
  modelNote: string;
  heuristicNotice: string;
  listen: string;
  pause: string;
  replay: string;
  speed: string;
  voiceNotice: string;
  voiceUnavailable: string;
  transcript: string;
  transcriptLocked: string;
  checkAnswer: string;
  retry: string;
  next: string;
  finish: string;
  correct: string;
  incorrect: string;
  answer: string;
  explanation: string;
  question: string;
  completed: string;
  tryAgain: string;
  readingTip: string;
  definition: string;
  translation: string;
  example: string;
  openEndedHint: string;
  progress: string;
  localProgress: string;
  noAnswer: string;
  rubric: Record<"task" | "grammar" | "spelling" | "punctuation" | "vocabulary" | "coherence", string>;
}> = {
  en: {
    title: { writing: "Write with purpose.", listening: "Listen for meaning.", reading: "Read between the lines." },
    description: { writing: "Build a clear piece of writing, then review specific, transparent feedback.", listening: "Listen to an original levelled passage spoken by your browser, then check what you understood.", reading: "Explore an original text, look up useful words and check your understanding." },
    start: "Start this level", levelOverview: "Level overview", chooseLevel: "Choose a CEFR level", nextSectionEyebrow: "Keep your learning moving", nextSectionTitle: "Explore another section.", nextSectionDescription: "Continue with the same language and CEFR level.", closeDefinition: "Close definition", suggestionNote: "Only clear patterns from the limited checks above are changed. Review the revision before using it.", audioPlayerLabel: "Audio player", audioFailed: "Audio playback failed",     instructions: "Your task", wordRange: "Suggested length", words: "words", submitDraft: "Review my writing", clearDraft: "Clear draft", savedDraft: "Draft saved on this device", score: "Score", feedbackTitle: "Your writing review", suggestedRevision: "Suggested revision (limited checks)", modelAnswer: "Example response", modelNote: "Why this example works", heuristicNotice: "Feedback uses a small set of transparent writing checks. It is not AI, a full grammar checker, or a teacher's evaluation; use your browser spell-check and treat suggestions as guidance.", listen: "Play audio", pause: "Pause", replay: "Replay", speed: "Playback speed", voiceNotice: "Playback uses an English voice provided by your browser; availability and quality vary by device.", voiceUnavailable: "An English speech voice is not available in this browser, so audio playback cannot be provided.", transcript: "Show transcript", transcriptLocked: "Complete the listening questions to reveal the transcript.", checkAnswer: "Check answer", retry: "Try again", next: "Next question", finish: "See results", correct: "Correct", incorrect: "Not quite", answer: "Answer", explanation: "Explanation", question: "Question", completed: "Practice complete", tryAgain: "Try these questions again", readingTip: "Select an underlined word for its meaning and an example.", definition: "Meaning", translation: "Translation", example: "Example", openEndedHint: "Your answer is checked against key ideas from the text; a different valid response may need a teacher's judgement.", progress: "Level progress", localProgress: "Progress saves in this browser only · demo account", noAnswer: "Write or select an answer before checking.", rubric: { task: "Task and word limit", grammar: "Common grammar patterns", spelling: "Common spelling", punctuation: "Capitalisation and punctuation", vocabulary: "Vocabulary and repetition", coherence: "Organisation and linking" },
  },
  fr: {
    title: { writing: "Écrivez avec intention.", listening: "Écoutez pour comprendre.", reading: "Lisez entre les lignes." },
    description: { writing: "Rédigez un texte clair, puis consultez des commentaires précis et transparents.", listening: "Écoutez un texte original lu par votre navigateur, puis vérifiez votre compréhension.", reading: "Explorez un texte original, découvrez des mots utiles et vérifiez votre compréhension." },
    start: "Commencer ce niveau", levelOverview: "Aperçu du niveau", chooseLevel: "Choisir un niveau du CECR", nextSectionEyebrow: "Poursuivez votre apprentissage", nextSectionTitle: "Explorez une autre section.", nextSectionDescription: "Continuez dans la même langue et au même niveau.", closeDefinition: "Fermer la définition", suggestionNote: "Seuls les problèmes repérés par ces vérifications limitées sont corrigés. Relisez le texte avant de l'utiliser.", audioPlayerLabel: "Lecteur audio", audioFailed: "Échec de la lecture audio",     instructions: "Consigne", wordRange: "Longueur conseillée", words: "mots", submitDraft: "Évaluer mon texte", clearDraft: "Effacer le texte", savedDraft: "Texte enregistré sur cet appareil", score: "Score", feedbackTitle: "Retour sur votre texte", suggestedRevision: "Révision suggérée (vérifications limitées)", modelAnswer: "Exemple de réponse", modelNote: "Pourquoi cet exemple fonctionne", heuristicNotice: "Les commentaires reposent sur quelques vérifications transparentes. Ce n'est ni une IA, ni un correcteur complet, ni une évaluation pédagogique. Utilisez aussi le correcteur de votre navigateur.", listen: "Lire l'audio", pause: "Pause", replay: "Recommencer", speed: "Vitesse de lecture", voiceNotice: "La lecture utilise une voix anglaise fournie par le navigateur ; sa disponibilité et sa qualité dépendent de l'appareil.", voiceUnavailable: "Aucune voix anglaise de synthèse n'est disponible dans ce navigateur ; la lecture audio ne peut pas être proposée.", transcript: "Afficher la transcription", transcriptLocked: "Répondez aux questions pour afficher la transcription.", checkAnswer: "Vérifier", retry: "Réessayer", next: "Question suivante", finish: "Voir les résultats", correct: "Correct", incorrect: "Pas tout à fait", answer: "Réponse", explanation: "Explication", question: "Question", completed: "Exercice terminé", tryAgain: "Refaire les questions", readingTip: "Sélectionnez un mot souligné pour voir son sens et un exemple.", definition: "Sens", translation: "Traduction", example: "Exemple", openEndedHint: "La réponse est comparée aux idées principales du texte ; une autre réponse valide peut nécessiter l'avis d'un enseignant.", progress: "Progression du niveau", localProgress: "Progression enregistrée dans ce navigateur · compte démo", noAnswer: "Écrivez ou choisissez une réponse avant de vérifier.", rubric: { task: "Consigne et longueur", grammar: "Structures grammaticales courantes", spelling: "Orthographe courante", punctuation: "Majuscules et ponctuation", vocabulary: "Vocabulaire et répétitions", coherence: "Organisation et liens" },
  },
  es: {
    title: { writing: "Escribe con intención.", listening: "Escucha para comprender.", reading: "Lee entre líneas." },
    description: { writing: "Escribe un texto claro y consulta comentarios concretos y transparentes.", listening: "Escucha un texto original leído por tu navegador y comprueba lo que has entendido.", reading: "Explora un texto original, consulta palabras útiles y comprueba tu comprensión." },
    start: "Empezar este nivel", levelOverview: "Resumen del nivel", chooseLevel: "Elige un nivel del MCER", nextSectionEyebrow: "Sigue aprendiendo", nextSectionTitle: "Explora otra sección.", nextSectionDescription: "Continúa con el mismo idioma y nivel.", closeDefinition: "Cerrar definición", suggestionNote: "Solo se cambian patrones claros de estas comprobaciones limitadas. Revisa la versión antes de usarla.", audioPlayerLabel: "Reproductor de audio", audioFailed: "No se pudo reproducir el audio",     instructions: "Instrucciones", wordRange: "Extensión recomendada", words: "palabras", submitDraft: "Revisar mi texto", clearDraft: "Borrar texto", savedDraft: "Texto guardado en este dispositivo", score: "Puntuación", feedbackTitle: "Revisión de tu texto", suggestedRevision: "Revisión sugerida (comprobaciones limitadas)", modelAnswer: "Respuesta de ejemplo", modelNote: "Por qué funciona este ejemplo", heuristicNotice: "Los comentarios se basan en comprobaciones transparentes y limitadas. No son una IA, un corrector completo ni la evaluación de un profesor. Usa también el corrector del navegador.", listen: "Reproducir audio", pause: "Pausa", replay: "Repetir", speed: "Velocidad", voiceNotice: "La reproducción usa una voz en inglés proporcionada por el navegador; su disponibilidad y calidad dependen del dispositivo.", voiceUnavailable: "Este navegador no dispone de una voz inglesa de síntesis; no se puede ofrecer reproducción de audio.", transcript: "Mostrar transcripción", transcriptLocked: "Responde las preguntas para ver la transcripción.", checkAnswer: "Comprobar", retry: "Intentar de nuevo", next: "Siguiente pregunta", finish: "Ver resultados", correct: "Correcto", incorrect: "No exactamente", answer: "Respuesta", explanation: "Explicación", question: "Pregunta", completed: "Práctica terminada", tryAgain: "Repetir las preguntas", readingTip: "Selecciona una palabra subrayada para ver su significado y un ejemplo.", definition: "Significado", translation: "Traducción", example: "Ejemplo", openEndedHint: "La respuesta se compara con ideas clave del texto; una respuesta válida distinta puede requerir la valoración de un profesor.", progress: "Progreso del nivel", localProgress: "El progreso se guarda solo en este navegador · cuenta de demostración", noAnswer: "Escribe o selecciona una respuesta antes de comprobar.", rubric: { task: "Tarea y límite de palabras", grammar: "Estructuras gramaticales frecuentes", spelling: "Ortografía frecuente", punctuation: "Mayúsculas y puntuación", vocabulary: "Vocabulario y repeticiones", coherence: "Organización y conectores" },
  },
  it: {
    title: { writing: "Scrivi con uno scopo.", listening: "Ascolta per capire.", reading: "Leggi tra le righe." },
    description: { writing: "Scrivi un testo chiaro e consulta un feedback specifico e trasparente.", listening: "Ascolta un testo originale pronunciato dal browser e verifica la comprensione.", reading: "Esplora un testo originale, scopri parole utili e verifica la comprensione." },
    start: "Inizia questo livello", levelOverview: "Panoramica del livello", chooseLevel: "Scegli un livello QCER", nextSectionEyebrow: "Continua il tuo percorso", nextSectionTitle: "Esplora un'altra sezione.", nextSectionDescription: "Continua con la stessa lingua e lo stesso livello.", closeDefinition: "Chiudi definizione", suggestionNote: "Vengono modificati solo i problemi chiari rilevati dai controlli limitati. Rivedi il testo prima di usarlo.", audioPlayerLabel: "Lettore audio", audioFailed: "Riproduzione audio non riuscita",     instructions: "Consegna", wordRange: "Lunghezza consigliata", words: "parole", submitDraft: "Rivedi il mio testo", clearDraft: "Cancella il testo", savedDraft: "Testo salvato su questo dispositivo", score: "Punteggio", feedbackTitle: "Revisione del testo", suggestedRevision: "Revisione suggerita (controlli limitati)", modelAnswer: "Risposta di esempio", modelNote: "Perché questo esempio funziona", heuristicNotice: "Il feedback usa alcuni controlli trasparenti e limitati. Non è un'IA, un correttore completo o una valutazione di un insegnante. Usa anche il correttore del browser.", listen: "Riproduci audio", pause: "Pausa", replay: "Riascolta", speed: "Velocità", voiceNotice: "La riproduzione usa una voce inglese fornita dal browser; disponibilità e qualità variano in base al dispositivo.", voiceUnavailable: "In questo browser non è disponibile una voce inglese di sintesi; la riproduzione audio non può essere offerta.", transcript: "Mostra trascrizione", transcriptLocked: "Completa le domande per visualizzare la trascrizione.", checkAnswer: "Verifica", retry: "Riprova", next: "Domanda successiva", finish: "Vedi i risultati", correct: "Corretto", incorrect: "Non proprio", answer: "Risposta", explanation: "Spiegazione", question: "Domanda", completed: "Esercizio completato", tryAgain: "Ripeti le domande", readingTip: "Seleziona una parola sottolineata per leggerne il significato e un esempio.", definition: "Significato", translation: "Traduzione", example: "Esempio", openEndedHint: "La risposta viene confrontata con le idee chiave del testo; una risposta valida diversa può richiedere il giudizio di un insegnante.", progress: "Progressi del livello", localProgress: "Progressi salvati solo in questo browser · account demo", noAnswer: "Scrivi o scegli una risposta prima di verificare.", rubric: { task: "Consegna e limite di parole", grammar: "Strutture grammaticali comuni", spelling: "Ortografia comune", punctuation: "Maiuscole e punteggiatura", vocabulary: "Vocabolario e ripetizioni", coherence: "Organizzazione e collegamenti" },
  },
  de: {
    title: { writing: "Schreibe mit Ziel.", listening: "Höre auf den Sinn.", reading: "Lies zwischen den Zeilen." },
    description: { writing: "Verfasse einen klaren Text und erhalte konkretes, transparentes Feedback.", listening: "Höre einen Originaltext mit der Sprachausgabe deines Browsers und prüfe dein Verständnis.", reading: "Entdecke einen Originaltext, schlage Wörter nach und prüfe dein Verständnis." },
    start: "Dieses Niveau beginnen", levelOverview: "Niveauübersicht", chooseLevel: "CEFR-Niveau auswählen", nextSectionEyebrow: "Lerne weiter", nextSectionTitle: "Entdecke einen weiteren Bereich.", nextSectionDescription: "Lerne in derselben Sprache und auf demselben Niveau weiter.", closeDefinition: "Definition schließen", suggestionNote: "Nur eindeutige Treffer der begrenzten Prüfungen werden geändert. Prüfe den Vorschlag vor der Verwendung.", audioPlayerLabel: "Audioplayer", audioFailed: "Audio konnte nicht abgespielt werden",     instructions: "Aufgabe", wordRange: "Empfohlener Umfang", words: "Wörter", submitDraft: "Text überprüfen", clearDraft: "Text löschen", savedDraft: "Text auf diesem Gerät gespeichert", score: "Punktzahl", feedbackTitle: "Rückmeldung zu deinem Text", suggestedRevision: "Überarbeitungsvorschlag (begrenzte Prüfung)", modelAnswer: "Beispielantwort", modelNote: "Warum dieses Beispiel funktioniert", heuristicNotice: "Das Feedback basiert auf einigen transparenten, begrenzten Prüfungen. Es ist keine KI, keine vollständige Grammatikprüfung und keine Bewertung durch eine Lehrkraft. Nutze auch die Rechtschreibprüfung deines Browsers.", listen: "Audio abspielen", pause: "Pause", replay: "Erneut abspielen", speed: "Wiedergabetempo", voiceNotice: "Die Wiedergabe nutzt eine englische Browserstimme; Verfügbarkeit und Qualität hängen vom Gerät ab.", voiceUnavailable: "In diesem Browser ist keine englische Sprachausgabe verfügbar; die Audiowiedergabe ist daher nicht möglich.", transcript: "Transkript anzeigen", transcriptLocked: "Beantworte die Fragen, um das Transkript zu sehen.", checkAnswer: "Antwort prüfen", retry: "Noch einmal", next: "Nächste Frage", finish: "Ergebnisse ansehen", correct: "Richtig", incorrect: "Nicht ganz", answer: "Antwort", explanation: "Erklärung", question: "Frage", completed: "Übung abgeschlossen", tryAgain: "Fragen erneut bearbeiten", readingTip: "Wähle ein unterstrichenes Wort für Bedeutung und Beispiel.", definition: "Bedeutung", translation: "Übersetzung", example: "Beispiel", openEndedHint: "Die Antwort wird mit Kernaussagen abgeglichen; eine andere passende Antwort braucht möglicherweise eine Beurteilung durch eine Lehrkraft.", progress: "Lernfortschritt", localProgress: "Der Fortschritt wird nur in diesem Browser gespeichert · Demokonto", noAnswer: "Gib eine Antwort ein oder wähle sie aus.", rubric: { task: "Aufgabe und Wortumfang", grammar: "Häufige Grammatikmuster", spelling: "Häufige Rechtschreibung", punctuation: "Großschreibung und Zeichensetzung", vocabulary: "Wortschatz und Wiederholungen", coherence: "Aufbau und Verknüpfungen" },
  },
};

const sectionData = {
  writing: englishWriting,
  listening: englishListening,
  reading: englishReading,
} as const;

type DraftSnapshot = { value: string; error: string | null };
const draftSubscribers = new Map<string, Set<() => void>>();
const volatileDrafts = new Map<string, string>();

function readDraftSnapshot(key: string) {
  try {
    const stored = window.localStorage.getItem(key);
    volatileDrafts.delete(key);
    return JSON.stringify({ value: stored ?? "", error: null } satisfies DraftSnapshot);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Browser storage is unavailable.";
    return JSON.stringify({
      value: volatileDrafts.get(key) ?? "",
      error: `Draft is available for this visit but browser storage failed: ${message}`,
    } satisfies DraftSnapshot);
  }
}

function subscribeToDraft(key: string, listener: () => void) {
  const subscribers = draftSubscribers.get(key) ?? new Set<() => void>();
  subscribers.add(listener);
  draftSubscribers.set(key, subscribers);
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    subscribers.delete(listener);
    window.removeEventListener("storage", onStorage);
    if (subscribers.size === 0) draftSubscribers.delete(key);
  };
}

function writeDraft(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    volatileDrafts.delete(key);
  } catch {
    volatileDrafts.set(key, value);
  }
  draftSubscribers.get(key)?.forEach((listener) => listener());
}

function subscribeToSpeechVoices(listener: () => void) {
  if (!("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", listener);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", listener);
}

function getSpeechSupportSnapshot() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getSpeechVoiceSnapshot() {
  return getSpeechSupportSnapshot() && window.speechSynthesis.getVoices().some((voice) => /^en(-|_)/iu.test(voice.lang));
}

export function EnglishSkillModule({ languageSlug, levelSlug, section }: { languageSlug: LanguageSlug; levelSlug: LevelSlug; section: SkillSection }) {
  const { locale } = useInterfaceLanguage();
  const { progress } = useLearningProgress();
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  const copy = interfaceCopy[locale];
  const labels = sectionLabels[locale];
  const data = sectionData[section][levelSlug];
  const readingLessons = section === "reading"
    ? languageSlug === "english"
      ? [englishReading[levelSlug], ...getEnglishCurriculumReadingLessons(levelSlug)]
      : getFrenchCurriculumReadingLessons(levelSlug)
    : [];
  const writingTasks = section === "writing"
    ? languageSlug === "english"
      ? [englishWriting[levelSlug], ...getEnglishCurriculumWritingTasks(levelSlug)]
      : getFrenchCurriculumWritingTasks(levelSlug)
    : [];
  const completed = section === "writing"
    ? progress.completedWritingTasks
    : section === "listening"
      ? progress.completedListeningExercises
      : progress.completedReadingExercises;
  const completionIds = section === "writing"
    ? writingTasks.map((task) => task.id)
    : section === "reading"
      ? readingLessons.map((lesson) => lesson.id)
      : [data.id];
  const isComplete = completionIds.some((id) => completed.includes(`${languageSlug}/${levelSlug}/${section}/${id}`));

  if (!language || !level) return null;

  return (
    <>
      <LearningHeader />
      <main className="learning-page level-learning-page">
        <div className="page-width">
          <LearningBreadcrumbs items={[
            { label: "Explore languages", href: "/languages" },
            { label: language.name, href: `/languages/${languageSlug}` },
            { label: `${level.title} · ${level.name}`, href: `/languages/${languageSlug}/${levelSlug}` },
            { label: labels[section] },
          ]} />
          <section className="module-hero grammar-module-hero skill-module-hero">
            <div className="module-hero-copy">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>{language.flag} {language.name} · {level.title} · {level.name}</span>
              <h1>{labels[section]}<br /><i>{copy.title[section]}</i></h1>
              <p>{copy.description[section]}</p>
              <div className="module-hero-actions">
                <a className="button button-dark" href="#skill-activity">{copy.start} <span aria-hidden="true">→</span></a>
                <Link className="text-link" href={`/languages/${languageSlug}/${levelSlug}`}>{copy.levelOverview} <span aria-hidden="true">→</span></Link>
              </div>
              <span className="module-hero-footnote">{level.title} · {level.objectives[0]}</span>
            </div>
            <div className="module-hero-art grammar-hero-art skill-hero-art" aria-label={`${labels[section]} practice illustration`}>
              <span className="module-art-star">✳</span>
              <span className="module-art-word">{section === "writing" ? "write" : section === "listening" ? "listen" : "read"}</span>
              <span className="module-art-note">notice<br />the details<br />find the meaning</span>
              <span className="module-art-paper">One thoughtful step<br />at a time.</span>
              <span className="module-art-level">{level.title}</span>
            </div>
          </section>

          <section className="skill-level-switcher" aria-label={copy.progress}>
            <div><span className="module-section-kicker">{copy.progress}</span><strong>{isComplete ? `${level.title} · ✓` : `${level.title} · ${level.name}`}</strong></div>
            <nav aria-label={copy.chooseLevel}>
              {levelSlugs.map((slug) => <Link key={slug} href={`/languages/${languageSlug}/${slug}/${section}`} aria-current={slug === levelSlug ? "page" : undefined} className={slug === levelSlug ? "is-current" : ""}>{slug.toUpperCase()}</Link>)}
            </nav>
          </section>

          <section className="skill-activity-section" id="skill-activity">
            <SectionIntro
              eyebrow={`${language.name} ${level.title} · ${labels[section]}`}
              title={labels[section]}
              description={copy.description[section]}
            />
            {section === "writing" ? (
              <WritingWorkspace key={data.id} languageSlug={languageSlug} tasks={writingTasks} levelSlug={levelSlug} copy={copy} locale={locale} />
            ) : section === "listening" ? (
              <ListeningWorkspace key={data.id} lesson={englishListening[levelSlug]} levelSlug={levelSlug} copy={copy} locale={locale} />
            ) : (
              <ReadingWorkspace key={data.id} languageSlug={languageSlug} lessons={readingLessons} levelSlug={levelSlug} copy={copy} locale={locale} />
            )}
          </section>

          <section className="language-categories-section skill-section-switcher">
            <SectionIntro eyebrow={copy.nextSectionEyebrow} title={copy.nextSectionTitle} description={copy.nextSectionDescription} />
            <div className="module-language-switcher">
              {(["grammar", "writing", "listening", "reading", "vocabulary"] as const)
                .filter((name) => name !== section)
                .map((name) => <Link href={`/languages/${languageSlug}/${levelSlug}/${name}`} key={name}>{labels[name]} <span aria-hidden="true">→</span></Link>)}
            </div>
          </section>
          <p className="module-demo-note">{copy.localProgress}</p>
        </div>
      </main>
      <LearningFooter />
    </>
  );
}

type Copy = (typeof interfaceCopy)[InterfaceLocale];

function WritingWorkspace({ languageSlug, tasks, levelSlug, copy, locale }: { languageSlug: LanguageSlug; tasks: WritingTask[]; levelSlug: LevelSlug; copy: Copy; locale: InterfaceLocale }) {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? "");
  const task = tasks.find((item) => item.id === selectedTaskId) ?? tasks[0];
  if (!task) return null;

  return (
    <>
      {tasks.length > 1 && (
        <div className="skill-task-picker">
          <label htmlFor="writing-task-select">Choose a writing task</label>
          <select id="writing-task-select" value={task.id} onChange={(event) => setSelectedTaskId(event.target.value)}>
            {tasks.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
      )}
      <WritingTaskEditor key={task.id} languageSlug={languageSlug} task={task} levelSlug={levelSlug} copy={copy} locale={locale} />
    </>
  );
}

function WritingTaskEditor({ languageSlug, task, levelSlug, copy, locale }: { languageSlug: LanguageSlug; task: WritingTask; levelSlug: LevelSlug; copy: Copy; locale: InterfaceLocale }) {
  const { completeSkillExercise } = useLearningProgress();
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const draftKey = `morrow:writing-draft:${languageSlug}:${levelSlug}:${task.id}`;
  const subscribe = useCallback((listener: () => void) => subscribeToDraft(draftKey, listener), [draftKey]);
  const getSnapshot = useCallback(() => readDraftSnapshot(draftKey), [draftKey]);
  const draftSnapshotJson = useSyncExternalStore(subscribe, getSnapshot, () => JSON.stringify({ value: "", error: null }));
  const draftSnapshot = useMemo(() => JSON.parse(draftSnapshotJson) as DraftSnapshot, [draftSnapshotJson]);
  const draft = draftSnapshot.value;
  const wordCount = countWords(draft);

  function submit() {
    if (!draft.trim() || submitted) return;
    const result = evaluateWriting(task, draft, languageSlug);
    setFeedback(result);
    setSubmitted(true);
    completeSkillExercise("writing", languageSlug, levelSlug, task.id, result.score, result.criteria.length, result.criteria.map((criterion) => criterion.passed));
  }

  return (
    <div className="skill-workspace">
      <article className="skill-instructions-card">
        <span className="module-section-kicker">{copy.instructions}</span>
        <h2>{task.title}</h2>
        <p>{task.prompt}</p>
        <div className="skill-task-meta"><span>{task.format}</span><span>{copy.wordRange}: {task.minWords}–{task.maxWords} {copy.words}</span></div>
        <p className="skill-task-hint">{task.instructions}</p>
      </article>
      <div className="skill-editor-card">
        <label htmlFor="writing-draft">{labelsForWriting(locale)}</label>
        <textarea id="writing-draft" className="skill-text-editor" value={draft} onChange={(event) => writeDraft(draftKey, event.target.value)} placeholder={locale === "fr" ? "Commencez votre texte ici…" : locale === "es" ? "Empieza a escribir aquí…" : locale === "it" ? "Inizia a scrivere qui…" : locale === "de" ? "Schreibe deinen Text hier…" : "Start writing your response here…"} spellCheck disabled={submitted} />
        <div className="skill-editor-footer"><span aria-live="polite">{wordCount} {copy.words} · {copy.wordRange}: {task.minWords}–{task.maxWords}</span><span>{draftSnapshot.error ?? copy.savedDraft}</span></div>
        {!submitted ? (
          <div className="skill-editor-actions">
            <button type="button" className="button button-dark" onClick={submit} disabled={!draft.trim()}>{copy.submitDraft} <span aria-hidden="true">→</span></button>
            <button type="button" className="button button-outline" onClick={() => writeDraft(draftKey, "")} disabled={!draft}>{copy.clearDraft}</button>
          </div>
        ) : feedback ? (
          <WritingFeedbackPanel feedback={feedback} task={task} copy={copy} onRetry={() => { setSubmitted(false); setFeedback(null); }} />
        ) : null}
      </div>
    </div>
  );
}

function labelsForWriting(locale: InterfaceLocale) {
  return ({ en: "Your response", fr: "Votre texte", es: "Tu respuesta", it: "La tua risposta", de: "Dein Text" })[locale];
}

type WritingFeedback = {
  score: number;
  criteria: Array<{ key: keyof Copy["rubric"]; passed: boolean; message: string }>;
  corrections: Array<{ original: string; replacement: string }>;
  suggestedDraft: string;
};

function evaluateWriting(task: WritingTask, text: string, languageSlug: LanguageSlug): WritingFeedback {
  const isFrench = languageSlug === "french";
  const words = text.match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu) ?? [];
  const sentences = text.split(/[.!?]+/u).filter((part) => part.trim().length > 0);
  const uniqueRatio = new Set(words.map((word) => word.toLocaleLowerCase())).size / Math.max(words.length, 1);
  const connectors = isFrench
    ? /\b(d’abord|ensuite|puis|parce que|cependant|bien que|enfin|aussi|par exemple|donc|en revanche|ainsi)\b/iu.test(text)
    : /\b(first|then|next|because|however|although|finally|also|for example|therefore|on the other hand|as a result)\b/iu.test(text);
  const corrections = isFrench ? [] : [
    { pattern: /\bteh\b/giu, replacement: "the" },
    { pattern: /\bbecuase\b/giu, replacement: "because" },
    { pattern: /\brecieve\b/giu, replacement: "receive" },
    { pattern: /\bdefinately\b/giu, replacement: "definitely" },
    { pattern: /\bseperate\b/giu, replacement: "separate" },
    { pattern: /\bwich\b/giu, replacement: "which" },
    { pattern: /\bdont\b/giu, replacement: "don't" },
    { pattern: /\bcant\b/giu, replacement: "can't" },
  ];
  const foundSpellings = corrections.flatMap(({ pattern, replacement }) =>
    [...text.matchAll(pattern)].map((match) => ({ original: match[0], replacement })),
  );
  const grammarPatterns = isFrench ? [] : [
    { pattern: /\bI am agree\b/iu, suggestion: '“I agree” (not “I am agree”)' },
    { pattern: /\bI is\b/iu, suggestion: '“I am” (not “I is”)' },
    { pattern: /\b(he|she|it) don't\b/iu, suggestion: '“he/she/it doesn’t”' },
    { pattern: /\b(he|she|it) have\b/iu, suggestion: '“he/she/it has”' },
    { pattern: /\bthey was\b/iu, suggestion: '“they were”' },
    { pattern: /\b(he|she) go\b/iu, suggestion: '“he/she goes”' },
  ];
  const grammarIssues = grammarPatterns.flatMap(({ pattern, suggestion }) => pattern.test(text) ? [suggestion] : []);
  const hasSentencePunctuation = /[.!?]["')\]]?\s*$/u.test(text.trim());
  const startsWithCapital = /^\s*[\p{Lu}"'“(]/u.test(text);
  const criteria: WritingFeedback["criteria"] = [
    {
      key: "task",
      passed: words.length >= task.minWords && words.length <= task.maxWords,
      message: words.length < task.minWords
        ? `Add about ${task.minWords - words.length} more words to reach the suggested minimum.`
        : words.length > task.maxWords
          ? `Remove about ${words.length - task.maxWords} words to stay within the suggested range.`
          : `Your ${words.length}-word draft is within the suggested range.`,
    },
    {
      key: "grammar",
      passed: !isFrench && grammarIssues.length === 0,
      message: isFrench
        ? "French grammar is not evaluated by this limited review; check verb forms and agreement carefully."
        : grammarIssues.length
          ? `Check these common patterns: ${grammarIssues.join("; ")}.`
          : "This limited check did not flag its listed subject–verb patterns; it cannot check every grammar rule.",
    },
    {
      key: "spelling",
      passed: !isFrench && foundSpellings.length === 0,
      message: isFrench
        ? "French spelling is not checked by this limited review; use a French spell-checker for accents and spelling."
        : foundSpellings.length
          ? `Review: ${foundSpellings.map((item) => `${item.original} → ${item.replacement}`).join(", ")}.`
          : "No word from this small common-typo list was found. Use your browser's spell-check for broader coverage.",
    },
    {
      key: "punctuation",
      passed: startsWithCapital && hasSentencePunctuation && !/\s{2,}/u.test(text),
      message: !startsWithCapital
        ? "Start the response with a capital letter."
        : !hasSentencePunctuation
          ? "Add a final full stop, question mark or exclamation mark."
          : /\s{2,}/u.test(text)
            ? "Check for repeated spaces."
            : "The opening capital, sentence ending and spacing look consistent.",
    },
    {
      key: "vocabulary",
      passed: words.length >= 12 && uniqueRatio >= 0.48,
      message: uniqueRatio < 0.48 ? "Several words repeat; try a precise alternative where it keeps your meaning." : "Your draft uses a reasonable range of different words for this short check.",
    },
    {
      key: "coherence",
      passed: sentences.length >= 2 && (sentences.length < 4 || connectors),
      message: sentences.length < 2
        ? "Separate your ideas into at least two sentences."
        : sentences.length >= 4 && !connectors
          ? isFrench
            ? "For longer answers, try a clear link such as « parce que », « cependant » or « enfin »."
            : "For longer answers, try a clear link such as “because”, “however” or “finally”."
          : "Your ideas have sentence breaks; check that each sentence follows the previous one.",
    },
  ];
  return {
    score: criteria.filter((item) => item.passed).length,
    criteria,
    corrections: foundSpellings,
    suggestedDraft: isFrench ? text.trim() : buildSuggestedDraft(text),
  };
}

function buildSuggestedDraft(text: string) {
  let suggested = text
    .replace(/\bteh\b/giu, "the")
    .replace(/\bbecuase\b/giu, "because")
    .replace(/\brecieve\b/giu, "receive")
    .replace(/\bdefinately\b/giu, "definitely")
    .replace(/\bseperate\b/giu, "separate")
    .replace(/\bwich\b/giu, "which")
    .replace(/\bdont\b/giu, "don't")
    .replace(/\bcant\b/giu, "can't")
    .replace(/\bI am agree\b/giu, "I agree")
    .replace(/\bI is\b/giu, "I am")
    .replace(/\b(he|she|it) don't\b/giu, "$1 doesn't")
    .replace(/\b(he|she|it) have\b/giu, "$1 has")
    .replace(/\bthey was\b/giu, "they were")
    .replace(/\b(he|she) go\b/giu, "$1 goes")
    .trim();
  if (suggested) {
    suggested = suggested[0].toLocaleUpperCase() + suggested.slice(1);
    if (!/[.!?]["')\]]?$/u.test(suggested)) suggested += ".";
  }
  return suggested;
}

function WritingFeedbackPanel({ feedback, task, copy, onRetry }: { feedback: WritingFeedback; task: WritingTask; copy: Copy; onRetry: () => void }) {
  return (
    <section className="skill-feedback-panel" aria-live="polite">
      <div className="skill-feedback-heading"><div><span className="module-section-kicker">{copy.feedbackTitle}</span><h3>{copy.score}: {feedback.score} / {feedback.criteria.length}</h3></div><div className="skill-score-ring">{Math.round((feedback.score / feedback.criteria.length) * 100)}%</div></div>
      <ul className="skill-rubric-list">
        {feedback.criteria.map((criterion) => <li key={criterion.key} className={criterion.passed ? "is-passed" : "needs-review"}><span aria-hidden="true">{criterion.passed ? "✓" : "↗"}</span><div><strong>{copy.rubric[criterion.key]}</strong><p>{criterion.message}</p></div></li>)}
      </ul>
      <aside className="skill-model-answer"><span className="module-section-kicker">{copy.suggestedRevision}</span><p>{feedback.suggestedDraft}</p><small>{copy.suggestionNote}</small></aside>
      {task.modelAnswer && (
        <aside className="skill-model-answer">
          <span className="module-section-kicker">{copy.modelAnswer}</span>
          <p>{task.modelAnswer}</p>
          {task.modelNote && <small>{copy.modelNote}: {task.modelNote}</small>}
        </aside>
      )}
      <p className="skill-limit-note">{copy.heuristicNotice}</p>
      <button type="button" className="button button-outline" onClick={onRetry}>{copy.tryAgain}</button>
    </section>
  );
}

function ListeningWorkspace({ lesson, levelSlug, copy, locale }: { lesson: ListeningLesson; levelSlug: LevelSlug; copy: Copy; locale: InterfaceLocale }) {
  const [complete, setComplete] = useState(false);
  return (
    <div className="skill-workspace">
      <AudioPlayer lesson={lesson} copy={copy} locale={locale} />
      <QuestionSet key={lesson.id} section="listening" languageSlug="english" levelSlug={levelSlug} exerciseId={lesson.id} questions={lesson.questions} copy={copy} onComplete={() => setComplete(true)} />
      {complete ? <details className="skill-transcript"><summary>{copy.transcript}</summary><p>{lesson.transcript}</p></details> : <p className="skill-transcript-locked">{copy.transcriptLocked}</p>}
    </div>
  );
}

function AudioPlayer({ lesson, copy, locale }: { lesson: ListeningLesson; copy: Copy; locale: InterfaceLocale }) {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [rate, setRate] = useState(1);
  const speechAvailable = useSyncExternalStore(subscribeToSpeechVoices, getSpeechSupportSnapshot, () => false);
  const hasEnglishVoice = useSyncExternalStore(subscribeToSpeechVoices, getSpeechVoiceSnapshot, () => false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    return () => window.speechSynthesis.cancel();
  }, []);

  function play(restart = false) {
    if (!("speechSynthesis" in window)) return;
    setAudioError(null);
    const synthesis = window.speechSynthesis;
    if (!restart && playing && !paused) {
      synthesis.pause();
      setPaused(true);
      setPlaying(false);
      return;
    }
    if (!restart && paused) {
      synthesis.resume();
      setPaused(false);
      setPlaying(true);
      return;
    }
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lesson.transcript);
    const voices = synthesis.getVoices();
    const englishVoice = voices.find((voice) => /^en(-|_)/iu.test(voice.lang));
    if (!englishVoice) {
      setAudioError(copy.voiceUnavailable);
      return;
    }
    utterance.voice = englishVoice;
    utterance.lang = englishVoice.lang;
    utterance.rate = rate;
    utterance.onstart = () => { setPlaying(true); setPaused(false); };
    utterance.onend = () => { setPlaying(false); setPaused(false); };
    utterance.onerror = (event) => {
      setPlaying(false);
      setPaused(false);
      setAudioError(`${copy.audioFailed}: ${event.error}.`);
    };
    synthesis.speak(utterance);
  }

  return (
    <section className="skill-audio-panel" aria-label={copy.audioPlayerLabel}>
      <div className="skill-audio-art" aria-hidden="true"><span>♫</span><i>English<br />{locale === "fr" ? "audio" : locale === "es" ? "audio" : locale === "it" ? "audio" : locale === "de" ? "Audio" : "listening"}</i></div>
      <div className="skill-audio-copy"><span className="module-section-kicker">{lesson.context}</span><h2>{lesson.title}</h2><p>{copy.voiceNotice}</p></div>
      <div className="skill-audio-controls">
        <button type="button" className="button button-dark" onClick={() => play()} disabled={!speechAvailable || !hasEnglishVoice} aria-label={playing ? copy.pause : copy.listen}>{playing ? copy.pause : copy.listen} <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span></button>
        <button type="button" className="button button-outline" onClick={() => play(true)} disabled={!speechAvailable || !hasEnglishVoice}>{copy.replay}</button>
        <label>{copy.speed}<select value={rate} onChange={(event) => setRate(Number(event.target.value))}><option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.25}>1.25×</option><option value={1.5}>1.5×</option></select></label>
      </div>
      {(!speechAvailable || !hasEnglishVoice) && <p className="skill-limit-note" role="status">{copy.voiceUnavailable}</p>}
      {audioError && <p className="skill-limit-note" role="alert">{audioError}</p>}
    </section>
  );
}

function ReadingWorkspace({ languageSlug, lessons, levelSlug, copy, locale }: { languageSlug: LanguageSlug; lessons: ReadingLesson[]; levelSlug: LevelSlug; copy: Copy; locale: InterfaceLocale }) {
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id ?? "");
  const lesson = lessons.find((item) => item.id === selectedLessonId) ?? lessons[0];
  if (!lesson) return null;

  return (
    <>
      {lessons.length > 1 && (
        <div className="skill-task-picker">
          <label htmlFor="reading-text-select">Choose a reading text</label>
          <select id="reading-text-select" value={lesson.id} onChange={(event) => setSelectedLessonId(event.target.value)}>
            {lessons.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </div>
      )}
      <ReadingLessonWorkspace key={lesson.id} languageSlug={languageSlug} lesson={lesson} levelSlug={levelSlug} copy={copy} locale={locale} />
    </>
  );
}

function ReadingLessonWorkspace({ languageSlug, lesson, levelSlug, copy, locale }: { languageSlug: LanguageSlug; lesson: ReadingLesson; levelSlug: LevelSlug; copy: Copy; locale: InterfaceLocale }) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const glossaryByTerm = useMemo(() => new Map(lesson.glossary.map((item) => [item.term.toLocaleLowerCase(), item])), [lesson.glossary]);
  const tokens = useMemo(() => {
    const terms = lesson.glossary.map((item) => item.term).sort((a, b) => b.length - a.length);
    const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const matcher = new RegExp(`(${[...escaped, "[\\p{L}]+(?:['’][\\p{L}]+)*"].join("|")})`, "giu");
    return lesson.passage.split(matcher);
  }, [lesson.glossary, lesson.passage]);

  return (
    <div className="skill-workspace">
      <article className="skill-reading-card">
        <div className="skill-reading-meta"><span>{lesson.genre}</span><span>{getLanguage(languageSlug)?.name} · {levelSlug.toUpperCase()}</span></div>
        <h2>{lesson.title}</h2>
        {lesson.glossary.length > 0 && <p className="skill-reading-tip">{copy.readingTip}</p>}
        <div className="skill-reading-passage">
          {tokens.map((token, index) => {
            const glossaryEntry = glossaryByTerm.get(token.toLocaleLowerCase());
            return glossaryEntry
              ? <button type="button" className="skill-glossary-word" key={`${token}-${index}`} onClick={() => setSelectedTerm((current) => current === glossaryEntry.term ? null : glossaryEntry.term)} aria-pressed={selectedTerm === glossaryEntry.term}>{token}</button>
              : <span key={`${token}-${index}`}>{token}</span>;
          })}
        </div>
        {selectedTerm && glossaryByTerm.get(selectedTerm.toLocaleLowerCase()) && (
          <aside className="skill-glossary-popover" aria-live="polite">
            {(() => {
              const entry = glossaryByTerm.get(selectedTerm.toLocaleLowerCase());
              if (!entry) return null;
              return <><button type="button" className="skill-glossary-close" onClick={() => setSelectedTerm(null)} aria-label={copy.closeDefinition}>×</button><strong>{entry.term}</strong><span>{copy.definition}</span><p>{entry.definition}</p><span>{copy.translation}</span><p>{entry.translations[locale]}</p><span>{copy.example}</span><p><i>{entry.example}</i></p></>;
            })()}
          </aside>
        )}
      </article>
      {lesson.questions.some((question) => question.type === "text") && <p className="skill-open-ended-hint">{copy.openEndedHint}</p>}
      <QuestionSet key={lesson.id} section="reading" languageSlug={languageSlug} levelSlug={levelSlug} exerciseId={lesson.id} questions={lesson.questions} copy={copy} />
    </div>
  );
}

function QuestionSet({ section, languageSlug, levelSlug, exerciseId, questions, copy, onComplete }: { section: "listening" | "reading"; languageSlug: LanguageSlug; levelSlug: LevelSlug; exerciseId: string; questions: SkillQuestion[]; copy: Copy; onComplete?: () => void }) {
  const { recordAnswer, completeSkillExercise } = useLearningProgress();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = questions[index];

  function checkAnswer() {
    if (!answer.trim() || checked || finished) return;
    const isCorrect = question.acceptedAnswers.some((accepted) => normalize(answer) === normalize(accepted));
    recordAnswer(isCorrect);
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) setScore((value) => value + 1);
  }

  function advance() {
    if (!correct) return;
    if (index + 1 < questions.length) {
      setIndex((value) => value + 1);
      setAnswer("");
      setChecked(false);
      setCorrect(false);
      return;
    }
    completeSkillExercise(section, languageSlug, levelSlug, exerciseId, score, questions.length);
    setFinished(true);
    onComplete?.();
  }

  function retry() {
    setAnswer("");
    setChecked(false);
    setCorrect(false);
  }

  function reset() {
    setIndex(0);
    setAnswer("");
    setChecked(false);
    setCorrect(false);
    setScore(0);
    setFinished(false);
  }

  return (
    <section className="grammar-practice-section skill-quiz-section">
      <div className="module-section-kicker">{copy.question} · English {levelSlug.toUpperCase()}</div>
      <div className="grammar-practice-header"><div><h2>{copy.checkAnswer}</h2><p>{question?.type === "text" ? copy.openEndedHint : copy.question}</p></div><span>{Math.min(index + 1, questions.length)} / {questions.length}</span></div>
      {finished ? (
        <div className="grammar-finished-panel">
          <span className="finished-mark">✳</span><h3>{copy.completed}</h3>
          <p>{copy.score}: {score} / {questions.length} · {copy.localProgress}</p>
          <button type="button" className="button button-dark" onClick={reset}>{copy.tryAgain}</button>
        </div>
      ) : question ? (
        <div className="grammar-question-card">
          <div className="grammar-question-meta"><span>0{index + 1}</span><span>{question.type === "choice" ? "Multiple choice" : question.type === "boolean" ? "True or false" : "Short answer"}</span></div>
          <h3>{question.prompt}</h3>
          {question.options ? (
            <div className="grammar-answer-options" role="group" aria-label={copy.question}>
              {question.options.map((option, optionIndex) => <button type="button" key={option} className={`grammar-option ${answer === option ? "is-selected" : ""}`} onClick={() => !checked && setAnswer(option)} disabled={checked}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}
            </div>
          ) : <label className="grammar-answer-input"><span className="sr-only">{copy.answer}</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !checked) checkAnswer(); }} disabled={checked} autoComplete="off" /></label>}
          {!checked ? (
            <button type="button" className="button button-dark grammar-check-button" onClick={checkAnswer} disabled={!answer.trim()}>{copy.checkAnswer} <span aria-hidden="true">→</span></button>
          ) : (
            <div className={`grammar-answer-feedback ${correct ? "is-correct" : "is-incorrect"}`} aria-live="polite">
              <strong>{correct ? copy.correct : copy.incorrect}</strong>
              {!correct && <p>{copy.answer}: <b>{question.acceptedAnswers.join(" / ")}</b></p>}
              <p>{question.explanation}</p>
              <div className="grammar-feedback-actions">
                {!correct && <button type="button" className="button button-outline" onClick={retry}>{copy.retry}</button>}
                {correct && <button type="button" className="button button-dark" onClick={advance}>{index + 1 === questions.length ? copy.finish : copy.next} <span aria-hidden="true">→</span></button>}
              </div>
            </div>
          )}
          <div className="grammar-question-progress"><span>{copy.score}: {score} / {questions.length}</span><span>{Math.round(((index + (checked ? 1 : 0)) / questions.length) * 100)}%</span><div role="progressbar" aria-valuenow={Math.round(((index + (checked ? 1 : 0)) / questions.length) * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${copy.question} ${index + (checked ? 1 : 0)} / ${questions.length}`}><i style={{ width: `${((index + (checked ? 1 : 0)) / questions.length) * 100}%` }} /></div></div>
        </div>
      ) : null}
    </section>
  );
}

function normalize(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase().replace(/[’‘`]/gu, "'").replace(/[.!?;:]+$/u, "");
}

function countWords(value: string) {
  return (value.match(/\b[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*\b/gu) ?? []).length;
}
