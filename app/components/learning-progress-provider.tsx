"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import {
  emptyLearningProgress,
  parseLearningProgress,
  progressKey,
  scheduleVocabularyReview,
  type LearningProgress,
  type ReviewRecord,
} from "@/app/lib/learning-progress";
import { browserLearningProgressStore } from "@/app/lib/learning-progress-store";
import type { LanguageSlug, LevelSlug } from "@/app/lib/language-content";

type LearningProgressContextValue = {
  progress: LearningProgress;
  storageError: string | null;
  recordAnswer: (correct: boolean) => void;
  completeGrammarLesson: (language: LanguageSlug, level: LevelSlug, topic: string, score: number, total: number) => void;
  completeVocabularyExercise: (language: LanguageSlug, level: LevelSlug, exercise: string, score: number, total: number) => void;
  completeSkillExercise: (section: "writing" | "listening" | "reading", language: LanguageSlug, level: LevelSlug, exercise: string, score: number, total: number, answerResults?: boolean[]) => void;
  reviewWord: (language: LanguageSlug, level: LevelSlug, wordId: string, knewIt: boolean) => void;
};

type ProgressSnapshot = { raw: string; storageError: string | null };
const emptyProgressJson = JSON.stringify(emptyLearningProgress());
const serverSnapshot = JSON.stringify({ raw: emptyProgressJson, storageError: null } satisfies ProgressSnapshot);
const listeners = new Set<() => void>();
let memoryProgressJson: string | null = null;
let persistenceError: string | null = null;
let preserveUnreadableProgress = false;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const unsubscribeStorage = browserLearningProgressStore.subscribe(() => {
    onStorageChange();
  });
  return () => {
    listeners.delete(listener);
    unsubscribeStorage();
  };
}

function onStorageChange() {
  memoryProgressJson = null;
  persistenceError = null;
  preserveUnreadableProgress = false;
  emitChange();
}

function getSnapshot() {
  let raw = memoryProgressJson ?? emptyProgressJson;
  let error = persistenceError;
  if (memoryProgressJson === null) {
    try {
      raw = browserLearningProgressStore.read() ?? emptyProgressJson;
    } catch (cause) {
      error = cause instanceof Error ? `Progress could not be read from this browser: ${cause.message}` : "Progress could not be read from this browser.";
    }
  }
  return JSON.stringify({ raw, storageError: error } satisfies ProgressSnapshot);
}

function getServerSnapshot() {
  return serverSnapshot;
}

function persistProgress(progress: LearningProgress) {
  memoryProgressJson = JSON.stringify(progress);
  try {
    browserLearningProgressStore.write(memoryProgressJson);
    memoryProgressJson = null;
    persistenceError = null;
  } catch (cause) {
    persistenceError = cause instanceof Error
      ? `Progress is visible for this visit but could not be saved: ${cause.message}`
      : "Progress is visible for this visit but could not be saved.";
  }
  emitChange();
}

const LearningProgressContext = createContext<LearningProgressContextValue | null>(null);

export function LearningProgressProvider({ children }: { children: React.ReactNode }) {
  const snapshotJson = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const snapshot = useMemo(() => JSON.parse(snapshotJson) as ProgressSnapshot, [snapshotJson]);
  const { progress, parseError } = useMemo(() => {
    try {
      return { progress: parseLearningProgress(snapshot.raw), parseError: null };
    } catch (cause) {
      return {
        progress: emptyLearningProgress(),
        parseError: cause instanceof Error ? cause.message : "Saved learning progress could not be read.",
      };
    }
  }, [snapshot.raw]);

  const update = useCallback((change: (current: LearningProgress) => LearningProgress) => {
    const next = { ...change(progress), lastActivityAt: new Date().toISOString() };
    if (parseError || preserveUnreadableProgress) {
      preserveUnreadableProgress = true;
      memoryProgressJson = JSON.stringify(next);
      persistenceError = `${parseError ?? "Saved progress is in an unsupported format."} Learning progress is kept in memory only; the saved data was not overwritten.`;
      emitChange();
      return;
    }
    persistProgress(next);
  }, [progress, parseError]);

  const recordAnswer = useCallback((correct: boolean) => {
    update((current) => ({
      ...current,
      correctAnswers: current.correctAnswers + (correct ? 1 : 0),
      incorrectAnswers: current.incorrectAnswers + (correct ? 0 : 1),
    }));
  }, [update]);

  const completeGrammarLesson = useCallback((language: LanguageSlug, level: LevelSlug, topic: string, score: number, total: number) => {
    const key = progressKey(language, level, "grammar", topic);
    update((current) => ({
      ...current,
      completedGrammarLessons: current.completedGrammarLessons.includes(key)
        ? current.completedGrammarLessons
        : [...current.completedGrammarLessons, key],
      quizScores: { ...current.quizScores, [key]: [...(current.quizScores[key] ?? []), Math.round((score / total) * 100)] },
    }));
  }, [update]);

  const completeVocabularyExercise = useCallback((language: LanguageSlug, level: LevelSlug, exercise: string, score: number, total: number) => {
    const key = progressKey(language, level, "vocabulary", exercise);
    update((current) => ({
      ...current,
      completedVocabularyExercises: current.completedVocabularyExercises.includes(key)
        ? current.completedVocabularyExercises
        : [...current.completedVocabularyExercises, key],
      quizScores: { ...current.quizScores, [key]: [...(current.quizScores[key] ?? []), Math.round((score / total) * 100)] },
    }));
  }, [update]);

  const completeSkillExercise = useCallback((
    section: "writing" | "listening" | "reading",
    language: LanguageSlug,
    level: LevelSlug,
    exercise: string,
    score: number,
    total: number,
    answerResults?: boolean[],
  ) => {
    const key = progressKey(language, level, section, exercise);
    const field = section === "writing"
      ? "completedWritingTasks"
      : section === "listening"
        ? "completedListeningExercises"
        : "completedReadingExercises";
    update((current) => ({
      ...current,
      [field]: current[field].includes(key) ? current[field] : [...current[field], key],
      correctAnswers: current.correctAnswers + (answerResults?.filter(Boolean).length ?? 0),
      incorrectAnswers: current.incorrectAnswers + (answerResults?.filter((answer) => !answer).length ?? 0),
      quizScores: { ...current.quizScores, [key]: [...(current.quizScores[key] ?? []), Math.round((score / total) * 100)] },
    }));
  }, [update]);

  const reviewWord = useCallback((language: LanguageSlug, level: LevelSlug, wordId: string, knewIt: boolean) => {
    update((current) => {
      const previous = current.vocabularyReviews.find((review) => review.wordId === wordId);
      const nextReview = scheduleVocabularyReview(previous, { wordId, language, level }, knewIt);
      const vocabularyReviews: ReviewRecord[] = [
        ...current.vocabularyReviews.filter((review) => review.wordId !== wordId),
        nextReview,
      ];
      const vocabularyLearned = knewIt
        ? current.vocabularyLearned.includes(wordId) ? current.vocabularyLearned : [...current.vocabularyLearned, wordId]
        : current.vocabularyLearned.filter((id) => id !== wordId);
      return { ...current, vocabularyReviews, vocabularyLearned };
    });
  }, [update]);

  const value = useMemo(() => ({
    progress,
    storageError: snapshot.storageError ?? parseError,
    recordAnswer,
    completeGrammarLesson,
    completeVocabularyExercise,
    completeSkillExercise,
    reviewWord,
  }), [progress, snapshot.storageError, parseError, recordAnswer, completeGrammarLesson, completeVocabularyExercise, completeSkillExercise, reviewWord]);

  return <LearningProgressContext.Provider value={value}>{children}</LearningProgressContext.Provider>;
}

export function useLearningProgress() {
  const context = useContext(LearningProgressContext);
  if (!context) throw new Error("useLearningProgress must be used within LearningProgressProvider");
  return context;
}
