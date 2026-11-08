import type { LanguageSlug, LevelSlug } from "@/app/lib/language-content";

export const PROGRESS_STORAGE_KEY = "morrow:learning-progress:v1";

export type ReviewRecord = {
  wordId: string;
  language: LanguageSlug;
  level: LevelSlug;
  lastReviewedAt: string | null;
  nextReviewAt: string;
  repetitions: number;
  intervalDays: number;
  successes: number;
  failures: number;
  difficulty: "learning" | "review";
};

export type LearningProgress = {
  version: 1;
  completedGrammarLessons: string[];
  completedVocabularyExercises: string[];
  completedWritingTasks: string[];
  completedListeningExercises: string[];
  completedReadingExercises: string[];
  correctAnswers: number;
  incorrectAnswers: number;
  vocabularyLearned: string[];
  vocabularyReviews: ReviewRecord[];
  quizScores: Record<string, number[]>;
  lastActivityAt: string | null;
};

export function emptyLearningProgress(): LearningProgress {
  return {
    version: 1,
    completedGrammarLessons: [],
    completedVocabularyExercises: [],
    completedWritingTasks: [],
    completedListeningExercises: [],
    completedReadingExercises: [],
    correctAnswers: 0,
    incorrectAnswers: 0,
    vocabularyLearned: [],
    vocabularyReviews: [],
    quizScores: {},
    lastActivityAt: null,
  };
}

export function loadLearningProgress(): LearningProgress {
  const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
  if (!raw) return emptyLearningProgress();

  return parseLearningProgress(raw);
}

export function parseLearningProgress(raw: string): LearningProgress {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("Saved learning progress could not be read as valid data. It was not overwritten.");
  }

  if (!value || typeof value !== "object" || !("version" in value) || value.version !== 1) {
    throw new Error("Saved learning progress has an unsupported format. It was not overwritten.");
  }
  const record = value as Record<string, unknown>;
  const isStringArray = (candidate: unknown): candidate is string[] =>
    Array.isArray(candidate) && candidate.every((entry) => typeof entry === "string");
  const optionalStringArray = (candidate: unknown) =>
    candidate === undefined || isStringArray(candidate);
  const isLanguage = (candidate: unknown): candidate is LanguageSlug =>
    candidate === "english" || candidate === "french" || candidate === "spanish" || candidate === "italian" || candidate === "german";
  const isLevel = (candidate: unknown): candidate is LevelSlug =>
    candidate === "a1" || candidate === "a2" || candidate === "b1" || candidate === "b2" || candidate === "c1" || candidate === "c2";
  const isQuizScores = (candidate: unknown): candidate is Record<string, number[]> => {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return false;
    return Object.values(candidate).every((score) =>
      Array.isArray(score) && score.every((item) => typeof item === "number" && Number.isFinite(item)),
    );
  };
  const isReviewRecord = (candidate: unknown): candidate is ReviewRecord => {
    if (!candidate || typeof candidate !== "object") return false;
    const review = candidate as Record<string, unknown>;
    return typeof review.wordId === "string"
      && isLanguage(review.language)
      && isLevel(review.level)
      && (review.lastReviewedAt === null || typeof review.lastReviewedAt === "string")
      && typeof review.nextReviewAt === "string"
      && typeof review.repetitions === "number"
      && Number.isInteger(review.repetitions)
      && typeof review.intervalDays === "number"
      && Number.isInteger(review.intervalDays)
      && typeof review.successes === "number"
      && Number.isInteger(review.successes)
      && typeof review.failures === "number"
      && Number.isInteger(review.failures)
      && (review.difficulty === "learning" || review.difficulty === "review");
  };

  if (
    !isStringArray(record.completedGrammarLessons)
    || !isStringArray(record.completedVocabularyExercises)
    || !optionalStringArray(record.completedWritingTasks)
    || !optionalStringArray(record.completedListeningExercises)
    || !optionalStringArray(record.completedReadingExercises)
    || !isStringArray(record.vocabularyLearned)
    || !Array.isArray(record.vocabularyReviews)
    || !record.vocabularyReviews.every(isReviewRecord)
    || !isQuizScores(record.quizScores)
    || typeof record.correctAnswers !== "number"
    || !Number.isFinite(record.correctAnswers)
    || typeof record.incorrectAnswers !== "number"
    || !Number.isFinite(record.incorrectAnswers)
    || !(record.lastActivityAt === null || typeof record.lastActivityAt === "string")
  ) {
    throw new Error("Saved learning progress is incomplete. It was not overwritten.");
  }

  return {
    version: 1,
    completedGrammarLessons: record.completedGrammarLessons,
    completedVocabularyExercises: record.completedVocabularyExercises,
    completedWritingTasks: isStringArray(record.completedWritingTasks) ? record.completedWritingTasks : [],
    completedListeningExercises: isStringArray(record.completedListeningExercises) ? record.completedListeningExercises : [],
    completedReadingExercises: isStringArray(record.completedReadingExercises) ? record.completedReadingExercises : [],
    correctAnswers: record.correctAnswers,
    incorrectAnswers: record.incorrectAnswers,
    vocabularyLearned: record.vocabularyLearned,
    vocabularyReviews: record.vocabularyReviews,
    quizScores: record.quizScores,
    lastActivityAt: record.lastActivityAt,
  };
}

export function saveLearningProgress(progress: LearningProgress): void {
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function progressKey(language: LanguageSlug, level: LevelSlug, module: "grammar" | "vocabulary" | "writing" | "listening" | "reading", item: string) {
  return `${language}/${level}/${module}/${item}`;
}

export function scheduleVocabularyReview(
  previous: ReviewRecord | undefined,
  input: { wordId: string; language: LanguageSlug; level: LevelSlug },
  knewIt: boolean,
  now = new Date(),
): ReviewRecord {
  const repetitions = knewIt ? (previous?.repetitions ?? 0) + 1 : 0;
  const intervalDays = knewIt
    ? [1, 3, 7, 14, 30][Math.min(repetitions - 1, 4)]
    : 1;
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + intervalDays);

  return {
    wordId: input.wordId,
    language: input.language,
    level: input.level,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReview.toISOString(),
    repetitions,
    intervalDays,
    successes: (previous?.successes ?? 0) + (knewIt ? 1 : 0),
    failures: (previous?.failures ?? 0) + (knewIt ? 0 : 1),
    difficulty: knewIt && repetitions >= 2 ? "review" : "learning",
  };
}
