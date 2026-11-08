import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GrammarLesson } from "@/app/components/learning-modules";
import { getGrammarTopic, grammarTopics } from "@/app/lib/grammar-content";
import { getLanguage, getLevel } from "@/app/lib/language-content";

type GrammarLessonProps = {
  params: Promise<{ language: string; level: string; topic: string }>;
};

export function generateStaticParams() {
  return grammarTopics.map((topic) => ({
    language: topic.language,
    level: topic.level,
    topic: topic.id,
  }));
}

export async function generateMetadata({ params }: GrammarLessonProps): Promise<Metadata> {
  const { language: languageSlug, level: levelSlug, topic: topicId } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  const topic = language && level ? getGrammarTopic(language.slug, level.slug, topicId) : undefined;
  if (!language || !level || !topic) return { title: "Grammar lesson not found — morrow" };
  return {
    title: `${topic.title} · ${language.name} ${level.title} — morrow`,
    description: topic.objective,
  };
}

export default function GrammarLessonPage({ params }: GrammarLessonProps) {
  return (
    <Suspense fallback={<div className="learning-page page-width" role="status">Loading this grammar lesson…</div>}>
      <GrammarLessonContent params={params} />
    </Suspense>
  );
}

async function GrammarLessonContent({ params }: GrammarLessonProps) {
  const { language: languageSlug, level: levelSlug, topic: topicId } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  const topic = language && level ? getGrammarTopic(language.slug, level.slug, topicId) : undefined;
  if (!language || !level || !topic) notFound();

  return <GrammarLesson language={language} level={level} topic={topic} />;
}
