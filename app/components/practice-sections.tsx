"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LanguageSlug, LevelSlug } from "@/app/lib/language-content";
import {
  getExamsForLanguage,
  getSampleTests,
  type ExamDefinition,
  type PracticeQuestion,
  type PracticeSkill,
  type SampleTest,
} from "@/app/lib/practice-content";

type ChatMessage = { role: "user" | "assistant"; content: string };
const languageNames: Record<LanguageSlug, string> = {
  english: "English",
  french: "French",
  spanish: "Spanish",
  italian: "Italian",
  german: "German",
};
const languageLocales: Record<LanguageSlug, string> = {
  english: "en-GB",
  french: "fr-FR",
  spanish: "es-ES",
  italian: "it-IT",
  german: "de-DE",
};
const levels: LevelSlug[] = ["a1", "a2", "b1", "b2", "c1", "c2"];
type TestSkill = Exclude<PracticeSkill, "Speaking">;
const testSkills: TestSkill[] = ["Grammar", "Vocabulary", "Listening", "Reading", "Writing"];
const examSkills = ["Reading", "Listening", "Writing", "Speaking"] as const;
type ExamSkill = (typeof examSkills)[number];

export function SpeakingPractice({
  language: initialLanguage,
  level: initialLevel,
}: {
  language: LanguageSlug;
  level: LevelSlug;
}) {
  const [language, setLanguage] = useState(initialLanguage);
  const [level, setLevel] = useState(initialLevel);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationRef.current?.scrollTo({ top: conversationRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  function startFreshConversation() {
    setMessages([]);
    setError("");
  }

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || pending) return;

    const nextMessages = [...messages, { role: "user" as const, content: text }].slice(-20);
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, level, messages: nextMessages }),
      });
      const result: unknown = await response.json();
      const reply = isRecord(result) && typeof result.reply === "string" ? result.reply : undefined;
      if (!response.ok || !reply) {
        throw new Error(isRecord(result) && typeof result.error === "string" ? result.error : "The AI tutor could not reply. Please try again.");
      }
      setMessages((current) => [...current, { role: "assistant" as const, content: reply }].slice(-20));
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "The AI tutor could not reply. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="practice-panel speaking-panel" aria-label="AI conversation practice">
      <div className="practice-panel-heading">
        <div>
          <span className="eyebrow">Real conversation · no fixed topics</span>
          <h2>Say what’s on your mind.</h2>
          <p>Chat naturally, change topics whenever you like, and get gentle corrections along the way.</p>
        </div>
        <button className="practice-secondary-button" type="button" onClick={startFreshConversation}>New conversation</button>
      </div>

      <div className="speaking-settings">
        <label>
          <span>Practice language</span>
          <select value={language} onChange={(event) => { setLanguage(event.target.value as LanguageSlug); startFreshConversation(); }}>
            {Object.entries(languageNames).map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}
          </select>
        </label>
        <label>
          <span>Your level</span>
          <select value={level} onChange={(event) => { setLevel(event.target.value as LevelSlug); startFreshConversation(); }}>
            {levels.map((item) => <option key={item} value={item}>{item.toUpperCase()}</option>)}
          </select>
        </label>
        <span className="speaking-level-note">Explanations adapt to your level. You can talk about everyday life, culture, science, current affairs and more.</span>
      </div>

      <div className="speaking-conversation" ref={conversationRef} aria-live="polite">
        {messages.length === 0 && (
          <div className="speaking-welcome">
            <span className="speaking-welcome-star" aria-hidden="true">✳</span>
            <h3>Your conversation can start anywhere.</h3>
            <p>Tell me what you’ve been thinking about, ask a question, or share a story in {languageNames[language]}.</p>
            <small>Text chat only · Your messages are sent to the configured AI provider.</small>
          </div>
        )}
        {messages.map((message, index) => (
          <article className={`speaking-message speaking-message-${message.role}`} key={`${index}-${message.content.slice(0, 20)}`}>
            <span className="speaking-message-author">{message.role === "user" ? "You" : `${languageNames[language]} tutor`}</span>
            <p>{message.content}</p>
          </article>
        ))}
        {pending && <p className="speaking-pending" role="status">Your tutor is thinking…</p>}
      </div>

      {error && <p className="practice-error" role="alert">{error}</p>}
      <form className="speaking-composer" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="speaking-message">Write your message</label>
        <textarea
          id="speaking-message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={`Write something in ${languageNames[language]}…`}
          rows={2}
          maxLength={2000}
          disabled={pending}
          required
        />
        <button className="button button-dark" type="submit" disabled={pending || !draft.trim()}>
          {pending ? "Sending…" : "Send"} <span aria-hidden="true">↑</span>
        </button>
      </form>
      <p className="speaking-configuration">Needs server configuration: <code>OPENAI_API_KEY</code> (required) and <code>OPENAI_MODEL</code> (optional; defaults to <code>gpt-4o-mini</code>). Never place the key in browser code.</p>
    </section>
  );
}

export function ComprehensiveTest({ language, level }: { language: LanguageSlug; level: LevelSlug }) {
  const tests = getSampleTests(language);
  const preferred = tests.find((test) => test.level === level) ?? tests[0];
  const [activeTestId, setActiveTestId] = useState(preferred.id);
  const activeTest = tests.find((test) => test.id === activeTestId) ?? tests[0];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [writing, setWriting] = useState("");
  const [writingSelfScore, setWritingSelfScore] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [audioError, setAudioError] = useState("");

  function selectTest(id: string) {
    setActiveTestId(id);
    setAnswers({});
    setWriting("");
    setWritingSelfScore("");
    setSubmitted(false);
    setAudioError("");
  }

  function playListening(text: string) {
    setAudioError("");
    if (!("speechSynthesis" in window)) {
      setAudioError("Text-to-speech is not available in this browser. Open the transcript below to complete the listening task.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageLocales[language];
    window.speechSynthesis.speak(utterance);
  }

  const scores = scoreTest(activeTest, answers, writing, writingSelfScore);
  const totalScore = Math.round(Object.values(scores).reduce((sum, score) => sum + score, 0) / testSkills.length);
  const readyToSubmit = activeTest.questions
    .filter((question) => question.skill !== "Writing")
    .every((question) => Boolean(answers[question.id]))
    && Boolean(writing.trim())
    && Boolean(writingSelfScore);

  return (
    <section className="practice-panel" aria-label="Comprehensive language test">
      <div className="practice-panel-heading">
        <div>
          <span className="eyebrow">{languageNames[language]} · CEFR practice</span>
          <h2>One test. Five connected skills.</h2>
          <p>Each original sample combines grammar, vocabulary, listening, reading and a short writing task.</p>
        </div>
      </div>
      <div className="test-level-picker" aria-label="Choose a CEFR sample test">
        <span>Sample level</span>
        {tests.map((test) => (
          <button type="button" key={test.id} className={test.id === activeTest.id ? "is-selected" : ""} onClick={() => selectTest(test.id)}>
            {test.level.toUpperCase()}
          </button>
        ))}
        <small>Original A1 and A2 sample tests; more level sets can be added as new exercises are authored.</small>
      </div>
      <h3 className="practice-test-title">{activeTest.title}</h3>

      <div className="practice-question-list">
        {activeTest.questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            answer={answers[question.id] ?? ""}
            onAnswer={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
            onPlay={playListening}
            audioError={question.skill === "Listening" ? audioError : ""}
            writing={question.skill === "Writing" ? writing : undefined}
            onWriting={question.skill === "Writing" ? setWriting : undefined}
            selfScore={question.skill === "Writing" ? writingSelfScore : undefined}
            onSelfScore={question.skill === "Writing" ? setWritingSelfScore : undefined}
            submitted={submitted}
          />
        ))}
      </div>

      {!submitted ? (
        <button className="button button-dark practice-submit" type="button" disabled={!readyToSubmit} onClick={() => setSubmitted(true)}>Check my answers <span aria-hidden="true">→</span></button>
      ) : (
        <TestReport
          test={activeTest}
          scores={scores}
          totalScore={totalScore}
          onTryAgain={() => {
            setAnswers({});
            setWriting("");
            setWritingSelfScore("");
            setSubmitted(false);
          }}
        />
      )}
    </section>
  );
}

function QuestionCard({
  question,
  answer,
  onAnswer,
  onPlay,
  audioError,
  writing,
  onWriting,
  selfScore,
  onSelfScore,
  submitted,
}: {
  question: PracticeQuestion;
  answer: string;
  onAnswer: (value: string) => void;
  onPlay: (text: string) => void;
  audioError: string;
  writing?: string;
  onWriting?: (value: string) => void;
  selfScore?: string;
  onSelfScore?: (value: string) => void;
  submitted: boolean;
}) {
  const correct = submitted && question.answer !== undefined && answer === question.answer;
  return (
    <article className={`practice-question practice-question-${question.id}`}>
      <div className="practice-question-header"><span>{question.skill}</span><b>{question.task}</b></div>
      <p className="practice-question-prompt">{question.prompt}</p>
      {question.skill === "Listening" && question.passage && (
        <div className="practice-audio-control">
          <button className="practice-secondary-button" type="button" onClick={() => onPlay(question.passage!)}>▶ Play listening passage</button>
          <details><summary>Read transcript</summary><p>{question.passage}</p></details>
          {audioError && <p className="practice-error" role="status">{audioError}</p>}
        </div>
      )}
      {question.skill === "Reading" && question.passage && <blockquote className="practice-passage">{question.passage}</blockquote>}
      {question.choices && (
        <div className="practice-choice-list">
          {question.choices.map((choice) => (
            <label className={submitted && choice === question.answer ? "is-correct" : submitted && choice === answer ? "is-incorrect" : ""} key={choice}>
              <input type="radio" name={`answer-${question.id}`} checked={answer === choice} onChange={() => onAnswer(choice)} disabled={submitted} />
              <span>{choice}</span>
            </label>
          ))}
        </div>
      )}
      {question.skill === "Writing" && (
        <div className="practice-writing-response">
          <label htmlFor={`writing-${question.id}`}>Your response <small>{countWords(writing ?? "")} words · aim for at least {question.minimumWords}</small></label>
          <textarea id={`writing-${question.id}`} rows={5} value={writing ?? ""} onChange={(event) => onWriting?.(event.target.value)} disabled={submitted} />
          <label htmlFor={`writing-score-${question.id}`}>Self-assess your response</label>
          <select id={`writing-score-${question.id}`} value={selfScore ?? ""} onChange={(event) => onSelfScore?.(event.target.value)} disabled={submitted}>
            <option value="">Choose a score</option>
            <option value="1">1 · I need more practice</option>
            <option value="2">2 · I communicated the main idea</option>
            <option value="3">3 · I completed the task clearly</option>
          </select>
        </div>
      )}
      {submitted && question.answer !== undefined && (
        <p className={`practice-answer-feedback ${correct ? "is-correct" : "is-incorrect"}`} role="status">
          {correct ? "Correct. " : `Not quite. Best answer: ${question.answer}. `}{question.explanation}
        </p>
      )}
      {submitted && question.skill === "Writing" && (
        <p className="practice-answer-feedback">Writing is self-assessed using the task-completion rubric you selected; this sample does not claim automatic essay grading.</p>
      )}
    </article>
  );
}

function TestReport({
  test,
  scores,
  totalScore,
  onTryAgain,
}: {
  test: SampleTest;
  scores: Record<TestSkill, number>;
  totalScore: number;
  onTryAgain: () => void;
}) {
  const ranked = [...testSkills].sort((a, b) => scores[b] - scores[a]);
  return (
    <section className="practice-report" aria-label="Test performance report" aria-live="polite">
      <span className="eyebrow">Your practice report · {test.level.toUpperCase()}</span>
      <h3>Overall score: {totalScore}%</h3>
      <div className="practice-score-grid">
        {testSkills.map((skill) => (
          <div className="practice-score" key={skill}>
            <span>{skill}</span><b>{scores[skill]}%</b>
            <span className="practice-score-track"><i style={{ width: `${scores[skill]}%` }} /></span>
          </div>
        ))}
      </div>
      <p><b>Strength:</b> {ranked[0]} · <b>Next focus:</b> {ranked[ranked.length - 1]}.</p>
      <button className="practice-secondary-button" type="button" onClick={onTryAgain}>Try the test again</button>
    </section>
  );
}

export function ExamPreparationIndex({ language, level }: { language: LanguageSlug; level: LevelSlug }) {
  const exams = getExamsForLanguage(language);
  return (
    <section className="practice-panel" aria-label={`${languageNames[language]} exam preparation`}>
      <div className="practice-panel-heading">
        <div>
          <span className="eyebrow">{languageNames[language]} · exam pathways</span>
          <h2>Prepare with original exam-style practice.</h2>
          <p>Choose an exam for its structure, two sample mock exercises, timed tasks and a skill-by-skill report.</p>
        </div>
      </div>
      {exams.length ? (
        <div className="exam-choice-grid">
          {exams.map((exam) => (
            <article className="exam-choice-card" key={exam.slug}>
              <span className="eyebrow">{exam.shortName}</span>
              <h3>{exam.title}</h3>
              <p>{exam.structure}</p>
              <Link className="button button-dark" href={`/languages/${language}/${level}/exam-preparation/${exam.slug}`}>
                Open preparation <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="practice-empty-state">
          <h3>No exam pathway is listed for {languageNames[language]} yet.</h3>
          <p>Available initial pathways are IELTS for English, CILS for Italian, Goethe-Zertifikat for German, and DELE for Spanish.</p>
          <div className="exam-choice-grid">
            <Link href="/languages/english/a1/exam-preparation/ielts-academic">IELTS Academic <span aria-hidden="true">→</span></Link>
            <Link href="/languages/english/a1/exam-preparation/ielts-general">IELTS General Training <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      )}
    </section>
  );
}

export function ExamPractice({ exam }: { exam: ExamDefinition }) {
  const [sampleIndex, setSampleIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<ExamSkill, string>>({ Reading: "", Listening: "", Writing: "", Speaking: "" });
  const [selfScores, setSelfScores] = useState<Record<"Writing" | "Speaking", string>>({ Writing: "", Speaking: "" });
  const [submitted, setSubmitted] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(exam.samples[0].writingWords >= 200 ? 20 * 60 : 12 * 60);
  const [audioError, setAudioError] = useState("");
  const sample = exam.samples[sampleIndex];
  const targetLanguage = exam.language;
  const objectiveSkills: ExamSkill[] = ["Reading", "Listening"];

  useEffect(() => {
    if (!timerStarted || submitted || secondsRemaining <= 0) return;
    const timerId = window.setInterval(() => setSecondsRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timerId);
  }, [timerStarted, submitted, secondsRemaining]);

  function switchSample(index: number) {
    setSampleIndex(index);
    setAnswers({ Reading: "", Listening: "", Writing: "", Speaking: "" });
    setSelfScores({ Writing: "", Speaking: "" });
    setSubmitted(false);
    setTimerStarted(false);
    setSecondsRemaining(exam.samples[index].writingWords >= 200 ? 20 * 60 : 12 * 60);
    setAudioError("");
  }

  function playPassage(text: string) {
    if (!("speechSynthesis" in window)) {
      setAudioError("Text-to-speech is unavailable. Use the transcript to complete this listening practice.");
      return;
    }
    setAudioError("");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageLocales[targetLanguage];
    window.speechSynthesis.speak(utterance);
  }

  const scores: Record<ExamSkill, number> = {
    Reading: answers.Reading === sample.questions.Reading?.answer ? 100 : 0,
    Listening: answers.Listening === sample.questions.Listening?.answer ? 100 : 0,
    Writing: responseScore(answers.Writing, selfScores.Writing, sample.writingWords),
    Speaking: responseScore(answers.Speaking, selfScores.Speaking, 20),
  };
  const overall = Math.round(examSkills.reduce((sum, skill) => sum + scores[skill], 0) / examSkills.length);
  const canSubmit = objectiveSkills.every((skill) => Boolean(answers[skill]))
    && Boolean(answers.Writing.trim())
    && Boolean(answers.Speaking.trim())
    && Boolean(selfScores.Writing)
    && Boolean(selfScores.Speaking);

  return (
    <section className="practice-panel" aria-label={`${exam.title} practice mock test`}>
      <div className="practice-panel-heading">
        <div>
          <span className="eyebrow">{exam.shortName} · original independent practice</span>
          <h2>Try a complete four-skill mock.</h2>
          <p>{exam.structure}</p>
        </div>
      </div>
      <div className="exam-source-note">
        <p>{exam.note} These questions are newly written practice, not official or reproduced exam papers.</p>
        <a href={exam.officialUrl} target="_blank" rel="noreferrer">Check the official exam information <span aria-hidden="true">↗</span></a>
      </div>
      <div className="test-level-picker" aria-label="Choose an original mock exercise">
        <span>Sample mocks</span>
        {exam.samples.map((item, index) => <button type="button" key={item.title} className={sampleIndex === index ? "is-selected" : ""} onClick={() => switchSample(index)}>0{index + 1}</button>)}
        <b>{sample.title}</b>
      </div>
      <div className="exam-timer">
        <div><span className="eyebrow">Writing practice timer</span><b>{formatTime(secondsRemaining)}</b></div>
        <p>{timerStarted ? (secondsRemaining ? "Time is running. You can still submit your practice when ready." : "Time is up. Review your response, then submit.") : "Start a short practice timer for the written section."}</p>
        <button className="practice-secondary-button" type="button" disabled={timerStarted || submitted} onClick={() => setTimerStarted(true)}>{timerStarted ? "Timer started" : "Start timer"}</button>
      </div>

      <div className="exam-task-grid">
        {examSkills.map((skill) => {
          const passage = sample.passages[skill as "Reading" | "Listening"];
          const question = sample.questions[skill as "Reading" | "Listening"];
          const isOpenTask = skill === "Writing" || skill === "Speaking";
          return (
            <article className="exam-task-card" key={skill}>
              <div className="practice-question-header"><span>{skill}</span><b>{skill === "Writing" ? `Timed · ${sample.writingWords} words suggested` : skill === "Speaking" ? `Timed · ${sample.speakingSeconds} seconds suggested` : "Comprehension"}</b></div>
              {passage && skill === "Reading" && <blockquote className="practice-passage">{passage}</blockquote>}
              {passage && skill === "Listening" && (
                <div className="practice-audio-control">
                  <button className="practice-secondary-button" type="button" onClick={() => playPassage(passage)}>▶ Play listening passage</button>
                  <details><summary>Read transcript</summary><p>{passage}</p></details>
                  {audioError && <p className="practice-error" role="status">{audioError}</p>}
                </div>
              )}
              <p className="practice-question-prompt">{sample.tasks[skill]}</p>
              {question && (
                <div className="practice-choice-list">
                  {question.choices.map((choice) => (
                    <label className={submitted && choice === question.answer ? "is-correct" : submitted && choice === answers[skill] ? "is-incorrect" : ""} key={choice}>
                      <input type="radio" name={`${sampleIndex}-${skill}`} checked={answers[skill] === choice} disabled={submitted} onChange={() => setAnswers((current) => ({ ...current, [skill]: choice }))} />
                      <span>{choice}</span>
                    </label>
                  ))}
                </div>
              )}
              {isOpenTask && (
                <div className="practice-writing-response">
                  <label htmlFor={`exam-response-${skill}`}>Your response {skill === "Writing" && <small>{countWords(answers[skill])} words · aim for {sample.writingWords}</small>}</label>
                  <textarea id={`exam-response-${skill}`} rows={skill === "Writing" ? 6 : 4} value={answers[skill]} disabled={submitted} onChange={(event) => setAnswers((current) => ({ ...current, [skill]: event.target.value }))} />
                  <label htmlFor={`exam-self-score-${skill}`}>Self-assess the response</label>
                  <select id={`exam-self-score-${skill}`} value={selfScores[skill]} disabled={submitted} onChange={(event) => setSelfScores((current) => ({ ...current, [skill]: event.target.value }))}>
                    <option value="">Choose a score</option>
                    <option value="1">1 · Needs more practice</option>
                    <option value="2">2 · Main task completed</option>
                    <option value="3">3 · Clear and complete</option>
                  </select>
                </div>
              )}
              {submitted && question && (
                <p className={`practice-answer-feedback ${answers[skill] === question.answer ? "is-correct" : "is-incorrect"}`} role="status">
                  {answers[skill] === question.answer ? "Correct. " : `Best answer: ${question.answer}. `}{question.explanation}
                </p>
              )}
              {submitted && isOpenTask && <p className="practice-answer-feedback">Open response is self-assessed. The score is a practice reflection, not an official exam band or automated language-quality score.</p>}
            </article>
          );
        })}
      </div>
      {!submitted ? (
        <button className="button button-dark practice-submit" type="button" disabled={!canSubmit} onClick={() => setSubmitted(true)}>Submit mock and see report <span aria-hidden="true">→</span></button>
      ) : (
        <section className="practice-report" aria-label="Exam practice performance report" aria-live="polite">
          <span className="eyebrow">{exam.title} · practice report</span>
          <h3>Overall practice score: {overall}%</h3>
          <div className="practice-score-grid">
            {examSkills.map((skill) => <div className="practice-score" key={skill}><span>{skill}</span><b>{scores[skill]}%</b><span className="practice-score-track"><i style={{ width: `${scores[skill]}%` }} /></span></div>)}
          </div>
          <p><b>Strength:</b> {[...examSkills].sort((a, b) => scores[b] - scores[a])[0]} · <b>Next focus:</b> {[...examSkills].sort((a, b) => scores[a] - scores[b])[0]}.</p>
          <button className="practice-secondary-button" type="button" onClick={() => switchSample((sampleIndex + 1) % exam.samples.length)}>Try the other original mock</button>
        </section>
      )}
    </section>
  );
}

function scoreTest(
  test: SampleTest,
  answers: Record<string, string>,
  writing: string,
  writingSelfScore: string,
): Record<TestSkill, number> {
  return {
    Grammar: objectiveScore(test, answers, "Grammar"),
    Vocabulary: objectiveScore(test, answers, "Vocabulary"),
    Listening: objectiveScore(test, answers, "Listening"),
    Reading: objectiveScore(test, answers, "Reading"),
    Writing: responseScore(writing, writingSelfScore, test.questions.find((item) => item.skill === "Writing")?.minimumWords ?? 20),
  };
}

function objectiveScore(test: SampleTest, answers: Record<string, string>, skill: PracticeSkill) {
  const question = test.questions.find((item) => item.skill === skill);
  return question && answers[question.id] === question.answer ? 100 : 0;
}

function responseScore(text: string, selfScore: string, minimumWords: number) {
  if (!text.trim() || !selfScore || countWords(text) < minimumWords) return 0;
  return Math.round((Number(selfScore) / 3) * 100);
}

function countWords(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
