import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GrammarTopicIndex } from "@/app/components/learning-modules";
import { getGrammarTopics } from "@/app/lib/grammar-content";
import { getLanguage, getLevel, languages, levelSlugs } from "@/app/lib/language-content";

type GrammarIndexProps = {
  params: Promise<{ language: string; level: string }>;
};

export function generateStaticParams() {
  return languages.flatMap((language) =>
    levelSlugs.map((level) => ({ language: language.slug, level })),
  );
}

export async function generateMetadata({ params }: GrammarIndexProps): Promise<Metadata> {
  const { language: languageSlug, level: levelSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  if (!language || !level) return { title: "Grammar lessons not found — morrow" };
  return {
    title: `${language.name} ${level.title} grammar lessons — morrow`,
    description: `Practice original ${language.name} grammar lessons for CEFR ${level.title}, with examples, clear explanations and interactive checks.`,
  };
}

export default function GrammarIndexPage({ params }: GrammarIndexProps) {
  return (
    <Suspense fallback={<div className="learning-page page-width" role="status">Loading grammar lessons…</div>}>
      <GrammarIndexContent params={params} />
    </Suspense>
  );
}

async function GrammarIndexContent({ params }: GrammarIndexProps) {
  const { language: languageSlug, level: levelSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  if (!language || !level) notFound();

  return (
    <GrammarTopicIndex
      language={language}
      level={level}
      topics={getGrammarTopics(language.slug, level.slug)}
    />
  );
}
