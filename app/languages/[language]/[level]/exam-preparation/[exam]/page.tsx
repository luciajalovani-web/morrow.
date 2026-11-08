import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LearningBreadcrumbs, LearningFooter, LearningHeader } from "@/app/components/language-ui";
import { ExamPractice } from "@/app/components/practice-sections";
import { examDefinitions } from "@/app/lib/practice-content";
import { getLanguage, getLevel, languages, levelSlugs } from "@/app/lib/language-content";

type ExamPageProps = {
  params: Promise<{ language: string; level: string; exam: string }>;
};

export function generateStaticParams() {
  return languages.flatMap((language) =>
    levelSlugs.flatMap((level) =>
      examDefinitions
        .filter((exam) => exam.language === language.slug)
        .map((exam) => ({ language: language.slug, level, exam: exam.slug })),
    ),
  );
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const { language: languageSlug, level: levelSlug, exam: examSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  const exam = examDefinitions.find((item) => item.slug === examSlug && item.language === languageSlug);
  if (!language || !level || !exam) return { title: "Exam preparation not found — morrow" };
  return {
    title: `${exam.title} ${level.title} Preparation — morrow`,
    description: `Original ${exam.title} exam-style reading, listening, writing and speaking practice for ${language.name} ${level.title}.`,
  };
}

export default function ExamPage({ params }: ExamPageProps) {
  return (
    <Suspense fallback={<div className="learning-page page-width" role="status">Loading this exam preparation page…</div>}>
      <ExamPageContent params={params} />
    </Suspense>
  );
}

async function ExamPageContent({ params }: ExamPageProps) {
  const { language: languageSlug, level: levelSlug, exam: examSlug } = await params;
  const language = getLanguage(languageSlug);
  const level = language ? getLevel(language, levelSlug) : undefined;
  const exam = examDefinitions.find((item) => item.slug === examSlug && item.language === languageSlug);
  if (!language || !level || !exam) notFound();

  return (
    <>
      <LearningHeader />
      <main className="learning-page level-learning-page">
        <div className="page-width">
          <LearningBreadcrumbs items={[
            { label: "Explore languages", href: "/languages" },
            { label: language.name, href: `/languages/${language.slug}` },
            { label: `${level.title} · ${level.name}`, href: `/languages/${language.slug}/${level.slug}` },
            { label: "Exam Preparation", href: `/languages/${language.slug}/${level.slug}/exam-preparation` },
            { label: exam.title },
          ]} />
          <section className="level-detail-hero exam-detail-hero">
            <div className="level-detail-copy">
              <span className="eyebrow"><span className="eyebrow-star">✳</span>{language.flag} {language.name} · {level.title} · original practice</span>
              <h1><span>{exam.title}</span><b>Preparation</b></h1>
              <p>{exam.structure}</p>
              <p className="level-detail-cefr">Independent practice · not an official exam provider</p>
              <div className="language-detail-actions">
                <Link className="button button-dark" href={`/languages/${language.slug}/${level.slug}/exam-preparation`}>All {language.name} exams <span aria-hidden="true">→</span></Link>
                <Link className="text-link" href={`/languages/${language.slug}/${level.slug}`}>Back to {level.title} <span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <div className="level-detail-visual" aria-hidden="true">
              <span className="level-orbit orbit-a">✳</span><span className="level-orbit orbit-b">✦</span>
              <span className="level-visual-code">{level.title}</span>
              <span className="level-visual-caption">{exam.shortName}<br /><i>practice with purpose</i></span>
              <span className="level-visual-index">{language.flag} {language.name}</span>
            </div>
          </section>
          <ExamPractice exam={exam} />
        </div>
      </main>
      <LearningFooter />
    </>
  );
}
