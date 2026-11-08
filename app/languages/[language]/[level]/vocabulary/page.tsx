import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { VocabularyModule } from "@/app/components/learning-modules";
import { getLanguage, getLevel, languages, levelSlugs } from "@/app/lib/language-content";
import { getVocabularyEntries } from "@/app/lib/vocabulary-content";

type VocabularyPageProps = {
  params: Promise<{ language: string; level: string }>;
};

export function generateStaticParams() {
  return languages.flatMap((language) =>
    levelSlugs.map((level) => ({ language: language.slug, level })),
  );
}

export async function generateMetadata({ params }: VocabularyPageProps): Promise<Metadata> {
  const { language: languageSlug, level: levelSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  if (!language || !level) return { title: "Vocabulary practice not found — morrow" };
  return {
    title: `${language.name} ${level.title} vocabulary practice — morrow`,
    description: `Study original ${language.name} ${level.title} vocabulary through interactive word cards, practice and a local review queue.`,
  };
}

export default function VocabularyPage({ params }: VocabularyPageProps) {
  return (
    <Suspense fallback={<div className="learning-page page-width" role="status">Loading vocabulary practice…</div>}>
      <VocabularyPageContent params={params} />
    </Suspense>
  );
}

async function VocabularyPageContent({ params }: VocabularyPageProps) {
  const { language: languageSlug, level: levelSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  if (!language || !level) notFound();

  return (
    <VocabularyModule
      language={language}
      level={level}
      entries={getVocabularyEntries(language.slug, level.slug)}
    />
  );
}
